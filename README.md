<div align="center">
  <img src="RetailOS Logo.png" alt="BazaarOS Logo" width="150" />
  <h1>BazaarOS</h1>
  <p><strong>A Modern, Multi-Tenant POS & Inventory Management System</strong></p>
  
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
</div>

---

## 🚀 Overview

BazaarOS is a lightweight, high-performance Single-Page Application (SPA) designed to help retail store owners manage their inventory, process sales, and track revenue & profit in real time. It was built strictly with vanilla web technologies, requiring no build steps or bundlers.

**Features included:**
- **Secure Multi-Tenancy**: Built-in Row-Level Security ensures your data remains completely isolated and protected, even if multiple stores register on the app.
- **Profit Tracking System**: Calculates exact profit margins using the historical cost of goods at the time of sale.
- **Dynamic POS Interface**: Add items, adjust quantities, scan barcodes, and instantly generate receipts.
- **Live Analytical Dashboard**: View realtime Total Revenue, Total Profit, Sales Count, and Low-Stock warnings.
- **Barcode Scanner**: Built-in camera support using the native `BarcodeDetector` API (with QuaggaJS fallback).

---

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism UI), and JavaScript (ES6 Modules)
- **Backend / Database**: [Supabase](https://supabase.com) (PostgreSQL + Auth)
- **Icons**: [FontAwesome 6](https://fontawesome.com/)
- **Typography**: [Google Inter Font](https://fonts.google.com/specimen/Inter)

---

## 🗄️ Database Setup (Supabase)

Before running the application, you **must** configure your Supabase backend. The entire app relies on these tables, and it will intentionally fail to load without them.

### 1. Create a Supabase Project
1. Register/Login at [Supabase](https://supabase.com/).
2. Create a new project.
3. Once generated, go to the **SQL Editor** on the left menu, and click **New Query**.

### 2. Run the Initial Schema Script
Copy and paste the exact SQL below and click **Run**. This generates your tables, columns, and absolute Row-Level Security policies to protect your data.

```sql
-- ============================================
-- BazaarOS Database Setup (Includes Profit tracking)
-- ============================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sku TEXT DEFAULT '',
  category TEXT DEFAULT 'Others',
  quantity INTEGER DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  cost_price NUMERIC(10,2) DEFAULT 0,
  supplier TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SALES TABLE
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) DEFAULT 0,
  total_cost NUMERIC(10,2) DEFAULT 0,
  total_profit NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT DEFAULT '',
  full_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  business_hours TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS) Configuration
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- PRODUCTS policies: users can only access their own products
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid() = user_id);

-- SALES policies: users can only access their own sales
CREATE POLICY "Users can view own sales" ON sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sales" ON sales FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PROFILES policies: users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### 3. Disable Email Confirmation (For Testing)
To drastically speed up local testing, go to **Authentication > Providers > Email** in Supabase and toggle **"Confirm email"** to **OFF**. 

### 4. Connect the Frontend
Open `/js/supabase-config.js` and paste your Supabase Project URL and Anon Key inside standard string boundaries:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

---

## 💻 Running Locally

Because this relies heavily on ES6 modules and specific Supabase CDN loading structures, **you must run it via a local HTTP server** (running via `file:///` causes CORS and Module fetch errors).

**Method 1: VS Code (Recommended)**
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` -> "Open with Live Server".

**Method 2: Python HTTP Server**
1. Open your terminal in the directory.
2. Run `python -m http.server 3000`
3. Navigate to `http://localhost:3000`

---

## 📂 Project Structure

```text
├── index.html              # Main SPA Shell & UI Modals
├── css/
│   └── styles.css          # Core Design System, Variables, Grid Layouts
├── js/
│   ├── auth.js             # Supabase Authentication & Session Persistence
│   ├── dashboard.js        # Analytics Aggregation Engine
│   ├── inventory.js        # Product CRUD & Barcode Camera Logic
│   ├── pos.js              # Checkout Cart, Receipts, Margin calculations
│   ├── profile.js          # Store Meta Data 
│   ├── router.js           # Hash-based SPA Navigation
│   ├── settings.js         # CSV Exports & UX Toggles
│   └── supabase-config.js  # Environment Config
└── README.md
```

<div align="center">
  <br>
  <p><i>Made for BS Information Technology Project</i></p>
</div>
