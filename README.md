<div align="center">
  <img src="assets/logo.png" alt="BazaarOS Logo" width="150" />
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
