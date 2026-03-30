// ============================================
// BazaarOS — Authentication Module
// ============================================

const Auth = {
  currentUser: null,
  initialized: false,

  // Initialize auth state listener
  init() {
    // Guard: make sure supabaseClient is loaded
    if (typeof supabaseClient === 'undefined' || !supabaseClient || !supabaseClient.auth) {
      console.error('supabaseClient not loaded! Check your internet connection.');
      const alertEl = document.getElementById('login-alert');
      if (alertEl) {
        alertEl.textContent = 'Failed to connect to server. Please check your internet and refresh.';
        alertEl.style.display = 'block';
      }
      return;
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (session && session.user) {
        Auth.currentUser = session.user;
        Auth.showApp();
        Auth.ensureProfile(session.user);
      } else if (Auth.initialized) {
        // Only redirect to login if we've already initialized
        Auth.currentUser = null;
        Auth.showAuth();
      }
    });

    // Check current session on load
    Auth.checkSession();
  },

  async checkSession() {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      Auth.initialized = true;
      if (session && session.user) {
        Auth.currentUser = session.user;
        Auth.showApp();
        Auth.ensureProfile(session.user);
      } else {
        Auth.showAuth();
      }
    } catch (err) {
      console.error('Session check failed:', err);
      Auth.initialized = true;
      Auth.showAuth();
    }
  },

  async ensureProfile(user) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!data) {
        const meta = user.user_metadata || {};
        await supabaseClient.from('profiles').insert({
          id: user.id,
          store_name: meta.store_name || 'My Store',
          full_name: meta.full_name || '',
          email: user.email || ''
        });
      }
    } catch (err) {
      console.error('Profile ensure error (non-blocking):', err);
    }
  },

  showAuth() {
    document.getElementById('auth-wrapper').style.display = 'flex';
    document.getElementById('app-shell').classList.remove('visible');
    Auth.showLogin();
  },

  showApp() {
    document.getElementById('auth-wrapper').style.display = 'none';
    document.getElementById('app-shell').classList.add('visible');
    // Initialize app modules
    if (!Router.currentPage) {
      Router.init();
    }
    Dashboard.load();
  },

  showLogin() {
    document.getElementById('login-form-section').style.display = 'block';
    document.getElementById('register-form-section').style.display = 'none';
  },

  showRegister() {
    document.getElementById('login-form-section').style.display = 'none';
    document.getElementById('register-form-section').style.display = 'block';
  },

  async login(email, password) {
    const btn = document.getElementById('login-btn');
    const alertEl = document.getElementById('login-alert');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Signing in...';
    alertEl.style.display = 'none';

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';

      if (error) {
        alertEl.textContent = error.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : error.message;
        alertEl.style.display = 'block';
        return;
      }
      // Success — onAuthStateChange will handle the redirect
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      alertEl.textContent = 'Error: ' + (err.message || 'Connection error. Please check console.');
      alertEl.style.display = 'block';
      console.error('Login error:', err);
    }
  },

  async register(email, password, storeName, fullName) {
    const btn = document.getElementById('register-btn');
    const alertEl = document.getElementById('register-alert');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Creating account...';
    alertEl.style.display = 'none';

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            store_name: storeName,
            full_name: fullName
          }
        }
      });

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          alertEl.textContent = 'This email is already registered. Please log in instead.';
        } else {
          alertEl.textContent = error.message;
        }
        alertEl.className = 'alert alert-error';
        alertEl.style.display = 'block';
        return;
      }

      // If email confirmation is required (session is null)
      if (data.user && !data.session) {
        alertEl.textContent = 'Account created! Check your email to confirm, then log in.';
        alertEl.className = 'alert alert-success';
        alertEl.style.display = 'block';
        return;
      }

      // If auto-confirmed, onAuthStateChange will handle redirect
      // But also handle it here as a fallback
      if (data.session) {
        Auth.currentUser = data.session.user;
        Auth.showApp();
        Auth.ensureProfile(data.session.user);
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
      alertEl.textContent = 'Error: ' + (err.message || 'Connection error. Please check console.');
      alertEl.className = 'alert alert-error';
      alertEl.style.display = 'block';
      console.error('Register error:', err);
    }
  },

  async logout() {
    try {
      await supabaseClient.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    Auth.currentUser = null;
    Auth.showAuth();
    Toast.show('Logged out successfully', 'info');
  }
};

// Form event listeners (set up once DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    Auth.login(email, password);
  });

  // Register form
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const store = document.getElementById('reg-store').value.trim();
    const fullName = document.getElementById('reg-fullname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    const alertEl = document.getElementById('register-alert');

    if (password !== confirm) {
      alertEl.textContent = 'Passwords do not match.';
      alertEl.className = 'alert alert-error';
      alertEl.style.display = 'block';
      return;
    }

    if (password.length < 6) {
      alertEl.textContent = 'Password must be at least 6 characters.';
      alertEl.className = 'alert alert-error';
      alertEl.style.display = 'block';
      return;
    }

    Auth.register(email, password, store, fullName);
  });

  // Initialize auth
  Auth.init();
});
