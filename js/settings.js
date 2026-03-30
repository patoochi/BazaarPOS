// ============================================
// BazaarOS — Settings Module
// ============================================

const Settings = {
  load() {
    // Load saved preferences
    const lowStockAlerts = localStorage.getItem('bazaar_lowstock_alerts') !== 'false';
    const salesReports = localStorage.getItem('bazaar_sales_reports') !== 'false';

    document.getElementById('setting-low-stock').checked = lowStockAlerts;
    document.getElementById('setting-sales-reports').checked = salesReports;
  },

  saveNotifications() {
    localStorage.setItem('bazaar_lowstock_alerts', document.getElementById('setting-low-stock').checked);
    localStorage.setItem('bazaar_sales_reports', document.getElementById('setting-sales-reports').checked);
    Toast.show('Notification settings saved', 'success');
  },

  async exportInventory() {
    if (!Auth.currentUser) return;

    const { data } = await supabaseClient
      .from('products')
      .select('*')
      .eq('user_id', Auth.currentUser.id)
      .order('name');

    if (!data || data.length === 0) {
      Toast.show('No products to export', 'info');
      return;
    }

    let csv = 'Name,SKU,Category,Quantity,Price,Supplier\n';
    data.forEach(item => {
      csv += `"${item.name}","${item.sku || ''}","${item.category || ''}",${item.quantity},${item.price},"${item.supplier || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bazaaros-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    Toast.show('Inventory exported as CSV', 'success');
  },

  async backupData() {
    if (!Auth.currentUser) return;

    const [products, sales, profile] = await Promise.all([
      supabaseClient.from('products').select('*').eq('user_id', Auth.currentUser.id),
      supabaseClient.from('sales').select('*').eq('user_id', Auth.currentUser.id),
      supabaseClient.from('profiles').select('*').eq('id', Auth.currentUser.id).single()
    ]);

    const backup = {
      exported_at: new Date().toISOString(),
      products: products.data || [],
      sales: sales.data || [],
      profile: profile.data || {}
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bazaaros-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    Toast.show('Full backup downloaded', 'success');
  }
};

// ============================================
// Toast Notification System
// ============================================

const Toast = {
  show(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle'
      : type === 'error' ? 'fa-exclamation-circle'
      : 'fa-info-circle';

    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
