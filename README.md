# BazaarOS — POS & Inventory Management System

A modern Point of Sale and Inventory Management web application built for retail store owners.

**BSIT College Project**

---

## 🚀 How to Run

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox).
   - You can simply double-click the file, or
   - Use a local server like VS Code's **Live Server** extension for best results.

2. **Register** a new account on the app.
3. **Log in** and start adding products to your inventory.
4. Use the **POS** page to sell products by scanning barcodes or clicking product cards.

---

## 🗄️ Supabase Setup (Required First)

Before the app works, you need to create the database tables in your Supabase project.

### Step 1: Go to Supabase SQL Editor

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `mkgklnnlmifrkzetivvb`
3. Go to **SQL Editor** (left sidebar)
4. Click **+ New Query**

### Step 2: Run This SQL

Copy and paste the entire SQL below, then click **Run**:

```sql
-- ============================================
-- BazaarOS Database Setup
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
  supplier TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SALES TABLE
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) DEFAULT 0,
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
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- PRODUCTS policies: users can only access their own products
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- SALES policies: users can only access their own sales
CREATE POLICY "Users can view own sales"
  ON sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales"
  ON sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- PROFILES policies: users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Step 3: Disable Email Confirmation (Recommended for Testing)

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle OFF **"Confirm email"**
3. This allows instant registration without email verification.

---

## 🔌 How Supabase is Connected

| Component | Supabase Feature |
|-----------|-----------------|
| Login / Register | `supabase.auth.signInWithPassword()` / `supabase.auth.signUp()` |
| Session Persistence | `supabase.auth.onAuthStateChange()` auto-detects returning users |
| Product CRUD | `supabase.from('products').select/insert/update/delete()` |
| Sales Records | `supabase.from('sales').insert()` on checkout |
| Store Profile | `supabase.from('profiles').select/update()` |
| Data Security | Row Level Security (RLS) ensures users only see their own data |

**Config file:** `js/supabase-config.js` contains the project URL and anon key.

---

## 📁 File Structure

```
RetailOS/
├── index.html              ← Main SPA (Single Page App)
├── css/
│   └── styles.css          ← Complete design system (dark theme)
├── js/
│   ├── supabase-config.js  ← Supabase URL + API key
│   ├── auth.js             ← Login, Register, Logout, Sessions
│   ├── router.js           ← SPA page routing
│   ├── dashboard.js        ← Dashboard stats from Supabase
│   ├── inventory.js        ← Product CRUD + barcode scanner
│   ├── pos.js              ← POS cart, checkout, barcode scanner
│   ├── profile.js          ← Store profile management
│   └── settings.js         ← App settings + Toast notifications
├── assets/
│   └── logo.png            ← App logo
└── README.md               ← This file
```

---

## ✨ Features

- **Authentication** — Supabase email/password auth with persistent sessions
- **Dashboard** — Live stats (revenue, sales, products, low stock) pulled from database
- **Inventory** — Add, edit, delete products with barcode scanner support
- **POS** — Add-to-cart system with quantity controls, barcode scanning, and checkout
- **Profile** — Store info saved to database
- **Settings** — Notification preferences, CSV export, full data backup
- **Responsive** — Works on desktop, tablet, and mobile
- **Dark Theme** — Modern glassmorphism UI

---

## 🛠️ Technologies

- HTML5, CSS3, Vanilla JavaScript (no framework)
- [Supabase](https://supabase.com) — Auth + PostgreSQL database
- [Font Awesome 6](https://fontawesome.com) — Icons
- [Inter Font](https://fonts.google.com/specimen/Inter) — Typography
- [QuaggaJS](https://github.com/ericblade/quagga2) — Barcode scanning fallback
- [BarcodeDetector API](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector) — Native barcode scanning
