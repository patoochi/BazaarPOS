// ============================================
// BazaarOS — Profile Module
// ============================================

const Profile = {
  async load() {
    if (!Auth.currentUser) return;

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', Auth.currentUser.id)
      .single();

    if (data) {
      document.getElementById('profile-store-name').value = data.store_name || '';
      document.getElementById('profile-full-name').value = data.full_name || '';
      document.getElementById('profile-email').value = data.email || Auth.currentUser.email || '';
      document.getElementById('profile-phone').value = data.phone || '';
      document.getElementById('profile-address').value = data.address || '';
      document.getElementById('profile-hours').value = data.business_hours || '';

      // Avatar initials
      const initials = (data.store_name || 'S').charAt(0).toUpperCase();
      document.getElementById('profile-avatar-letter').textContent = initials;
    }
  },

  async save() {
    const profileData = {
      store_name: document.getElementById('profile-store-name').value.trim(),
      full_name: document.getElementById('profile-full-name').value.trim(),
      email: document.getElementById('profile-email').value.trim(),
      phone: document.getElementById('profile-phone').value.trim(),
      address: document.getElementById('profile-address').value.trim(),
      business_hours: document.getElementById('profile-hours').value.trim()
    };

    const { error } = await supabaseClient
      .from('profiles')
      .update(profileData)
      .eq('id', Auth.currentUser.id);

    if (error) {
      Toast.show('Error saving profile: ' + error.message, 'error');
      return;
    }

    Toast.show('Profile saved successfully!', 'success');
  }
};
