// ============================================================
// sat-auth.js  —  Supabase real authentication for SAT Platform
// ============================================================
const SUPABASE_URL = 'https://djrtklaaqancrlhaptmn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XKxGTb0o5OD_1nr0T1gLiQ_jHBigQxs';

// Load Supabase from CDN (called once per page via <script>)
// Usage: await SATAuth.init() then use SATAuth methods

const SATAuth = (() => {
  let _supabase = null;

  // ── INIT ─────────────────────────────────────────────────
  async function init() {
    if (_supabase) return _supabase;
    // supabase is loaded via CDN script tag on each page
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _supabase;
  }

  function client() { return _supabase; }

  // ── GET CURRENT SESSION ──────────────────────────────────
  async function getSession() {
    await init();
    const { data: { session } } = await _supabase.auth.getSession();
    return session;
  }

  // ── GET CURRENT USER ─────────────────────────────────────
  async function getUser() {
    const session = await getSession();
    return session?.user || null;
  }

  // ── SIGN UP WITH EMAIL + PASSWORD ────────────────────────
  async function signUp({ email, password, firstName, lastName }) {
    await init();
    const { data, error } = await _supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          avatar: (firstName[0] + lastName[0]).toUpperCase()
        }
      }
    });
    if (error) throw error;
    return data;
  }

  // ── SIGN IN WITH EMAIL + PASSWORD ────────────────────────
  async function signIn({ email, password }) {
    await init();
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  // ── SIGN IN WITH GOOGLE ──────────────────────────────────
  async function signInWithGoogle() {
    await init();
    const { data, error } = await _supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/sat-dashboard.html'
      }
    });
    if (error) throw error;
    return data;
  }

  // ── SIGN OUT ─────────────────────────────────────────────
  async function signOut() {
    await init();
    const { error } = await _supabase.auth.signOut();
    if (error) throw error;
    // Clear local SAT data too
    localStorage.removeItem('sat_user');
    localStorage.removeItem('sat_profile');
  }

  // ── RESET PASSWORD ───────────────────────────────────────
  async function resetPassword(email) {
    await init();
    const { error } = await _supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/sat-reset.html'
    });
    if (error) throw error;
  }

  // ── REQUIRE AUTH (redirect if not logged in) ─────────────
  async function requireAuth(redirectTo = 'sat-login.html') {
    await init();
    const session = await getSession();
    if (!session) {
      window.location.replace(redirectTo);
      return null;
    }
    // Sync user to localStorage for fast reads
    const u = session.user;
    const meta = u.user_metadata || {};
    const stored = {
      id: u.id,
      email: u.email,
      name: meta.full_name || meta.name || u.email.split('@')[0],
      firstName: meta.first_name || meta.given_name || u.email.split('@')[0],
      avatar: meta.avatar || meta.picture || (meta.first_name?.[0]||u.email[0]).toUpperCase(),
      provider: u.app_metadata?.provider || 'email'
    };
    localStorage.setItem('sat_user', JSON.stringify(stored));
    return session;
  }

  // ── REDIRECT IF ALREADY LOGGED IN ────────────────────────
  async function redirectIfLoggedIn(to = 'sat-dashboard.html') {
    await init();
    const session = await getSession();
    if (session) window.location.replace(to);
  }

  // ── AUTH STATE CHANGE LISTENER ───────────────────────────
  function onAuthChange(callback) {
    if (!_supabase) return;
    return _supabase.auth.onAuthStateChange(callback);
  }

  // ── SAVE PROFILE TO SUPABASE (via upsert) ────────────────
  async function saveProfile(profileData) {
    await init();
    const user = await getUser();
    if (!user) return;
    // Save to localStorage fast path
    localStorage.setItem('sat_profile', JSON.stringify(profileData));
    // Also save metadata to Supabase user (non-blocking)
    _supabase.auth.updateUser({
      data: { sat_profile: profileData }
    }).catch(() => {});
  }

  // ── LOAD PROFILE ─────────────────────────────────────────
  async function loadProfile() {
    // Fast: try localStorage first
    const cached = localStorage.getItem('sat_profile');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) {}
    }
    // Fallback: user metadata from Supabase
    const user = await getUser();
    if (user?.user_metadata?.sat_profile) {
      const p = user.user_metadata.sat_profile;
      localStorage.setItem('sat_profile', JSON.stringify(p));
      return p;
    }
    return null;
  }

  // ── GET DISPLAY USER (from localStorage or session) ──────
  function getDisplayUser() {
    try {
      const u = JSON.parse(localStorage.getItem('sat_user') || '{}');
      return u;
    } catch(e) { return {}; }
  }

  return {
    init, client, getSession, getUser,
    signUp, signIn, signInWithGoogle, signOut,
    resetPassword, requireAuth, redirectIfLoggedIn,
    onAuthChange, saveProfile, loadProfile, getDisplayUser
  };
})();
