import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Building2,
  Camera,
  CheckCircle2,
  Edit3,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cartCatalog, containersData } from '../data/mockData';
import {
  AUTH_CHANGE_EVENT,
  getCurrentUser,
  getSession,
  logoutUser,
  syncSupabaseSession,
  updateUserProfile,
  uploadUserAvatar,
} from '../utils/auth';
import Footer from '../components/Footer';

const money = (val) => `$${(val || 0).toLocaleString('en-US')} USD`;

export default function Profile() {
  const navigate = useNavigate();
  const { cart = [], reservations = [], removeFromCart, clearCart } = useApp() || {};

  const [user, setUser] = useState(() => getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
    role: user?.role || 'Fleet Administrator',
    avatar: user?.avatar || '',
    newPassword: '',
  }));

  useEffect(() => {
    syncSupabaseSession({ notify: false }).then((fresh) => {
      if (fresh) {
        setUser(fresh);
        setFormData((prev) => ({
          ...prev,
          name: fresh.name || '',
          email: fresh.email || '',
          company: fresh.company || '',
          phone: fresh.phone || '',
          role: fresh.role || 'Fleet Administrator',
          avatar: fresh.avatar || '',
        }));
      }
    });
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const fresh = getCurrentUser();
      setUser(fresh);
      if (fresh && !isEditing) {
        setFormData({
          name: fresh.name || '',
          email: fresh.email || '',
          company: fresh.company || '',
          phone: fresh.phone || '',
          role: fresh.role || 'Fleet Administrator',
          avatar: fresh.avatar || '',
          newPassword: '',
        });
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
    };
  }, [isEditing]);

  if (!getSession() || !user) {
    return <Navigate to="/dashboard/login" replace />;
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Image must be smaller than 2 MB.' });
      return;
    }

    setUploadingAvatar(true);
    setFeedback({ type: '', message: '' });

    const res = await uploadUserAvatar(file);
    setUploadingAvatar(false);

    if (!res.ok) {
      setFeedback({ type: 'error', message: `Avatar upload failed: ${res.error}` });
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: res.url }));
    setFeedback({ type: 'success', message: 'Photo uploaded to cloud storage. Click Save Changes to apply.' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'Full name is required.' });
      return;
    }
    if (formData.newPassword && formData.newPassword.trim().length < 6) {
      setFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    setSaving(true);
    const result = await updateUserProfile(formData);
    setSaving(false);

    if (!result.ok) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setUser(result.user);
    setFormData((prev) => ({ ...prev, newPassword: '' }));
    setIsEditing(false);
    setFeedback({ type: 'success', message: 'Profile synced with database successfully.' });
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      company: user.company || '',
      phone: user.phone || '',
      role: user.role || 'Fleet Administrator',
      avatar: user.avatar || '',
      newPassword: '',
    });
    setIsEditing(false);
    setFeedback({ type: '', message: '' });
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/dashboard/login');
  };

  const getOriginLabel = (item) => {
    if (!item) return 'Unspecified origin';
    const rawOrigin = item.origin || item.selectedOrigin;
    if (typeof rawOrigin === 'string' && rawOrigin.trim() !== '') return rawOrigin;
    if (typeof rawOrigin === 'object' && rawOrigin !== null) {
      return rawOrigin.port ? `${rawOrigin.port} (${rawOrigin.code || ''})` : rawOrigin.code || 'Unspecified origin';
    }
    return 'Unspecified origin';
  };

  const getDestinationLabel = (item) => {
    if (!item) return 'Unspecified destination';
    const rawDestination = item.destination || item.selectedDestination;
    if (typeof rawDestination === 'string' && rawDestination.trim() !== '') return rawDestination;
    if (typeof rawDestination === 'object' && rawDestination !== null) {
      return rawDestination.port
        ? `${rawDestination.port} (${rawDestination.code || ''})`
        : rawDestination.code || 'Unspecified destination';
    }
    return 'Unspecified destination';
  };

  const getItemDetails = (item) => {
    const id = item.containerId || item.id;
    const cat = cartCatalog[id] || containersData?.find((c) => c.id === id) || {};
    return {
      title: item.title || cat.title || 'Standard Container',
      price: item.unitCost || cat.unitCost || item.price || cat.price || 2100,
      origin: getOriginLabel(item),
      destination: getDestinationLabel(item),
    };
  };

  const initials = (user.name || user.email || 'AD')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const reversedReservations = [...reservations].reverse();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-8">
        <div className="border-b border-[#c4c6cd] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              Authenticated Account Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#041627]">Account & Fleet Profile</h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage your administrator credentials, company details, and active shipping orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-[#041627] hover:bg-slate-800 text-white text-xs font-mono font-bold uppercase px-4 py-2.5 rounded transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              Operations Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase px-4 py-2.5 rounded transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {feedback.message && (
          <div
            role="alert"
            className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <span className="flex items-center gap-2">
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {feedback.message}
            </span>
            <button
              type="button"
              onClick={() => setFeedback({ type: '', message: '' })}
              className="text-xs opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <section className="bg-white border border-[#c4c6cd] rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#041627] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-brand-orange" />
              <h2 className="text-lg font-semibold">Administrator Details</h2>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setFeedback({ type: '', message: '' });
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-2 bg-brand-orange hover:brightness-95 text-[#181c1e] text-xs font-mono font-bold uppercase px-3.5 py-2 rounded transition self-start sm:self-auto cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            ) : (
              <span className="text-xs font-mono uppercase text-amber-300">Editing Mode Active</span>
            )}
          </div>

          {!isEditing ? (
            <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#041627] text-white flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden border-2 border-amber-500">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                <div>
                  <span className="block text-[11px] font-mono font-bold uppercase text-slate-400">Full Name</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{user.name}</p>
                  <span className="inline-block mt-1 text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {user.role || 'Fleet Administrator'}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-mono font-bold uppercase text-slate-400">Email Address</span>
                  <p className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-1.5 break-all">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    {user.email}
                  </p>
                </div>

                <div>
                  <span className="block text-[11px] font-mono font-bold uppercase text-slate-400">Company</span>
                  <p className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    {user.company || 'Not specified'}
                  </p>
                </div>

                <div>
                  <span className="block text-[11px] font-mono font-bold uppercase text-slate-400">Contact Phone</span>
                  <p className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    {user.phone || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-4 border-b border-slate-200">
                <div className="w-20 h-20 rounded-full bg-[#041627] text-white flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden border-2 border-amber-500">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold uppercase px-3 py-2 rounded cursor-pointer transition w-fit">
                    <Camera className="w-4 h-4" />
                    {uploadingAvatar ? 'Uploading to Cloud...' : 'Upload Profile Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingAvatar}
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-500">Stored in Supabase Storage (PNG/JPG up to 2 MB).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Global Logistics Co."
                    className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Fleet Administrator"
                    className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                    New Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Leave blank to keep current"
                    className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-mono font-bold uppercase px-4 py-2.5 rounded transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingAvatar}
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-xs font-mono font-bold uppercase px-5 py-2.5 rounded transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 pb-2">
              <h2 className="text-xl font-bold text-slate-800">Active Cart ({cart.length})</h2>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => clearCart()}
                      className="text-[11px] font-mono text-red-600 hover:underline border border-red-200 bg-red-50 px-2.5 py-1 rounded cursor-pointer"
                    >
                      CLEAR CART
                    </button>
                    <Link
                      to="/logistics"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold font-mono px-3 py-1.5 rounded transition"
                    >
                      CHECKOUT &rarr;
                    </Link>
                  </>
                )}
              </div>
            </div>

            {cart.length === 0 ? (
              <p className="text-slate-500 italic py-4">No containers currently in your logistics cart.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.map((item, idx) => {
                  const details = getItemDetails(item);
                  const itemId = item.cartItemId || item.containerId || item.id || idx;

                  return (
                    <div
                      key={itemId}
                      className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex justify-between items-center gap-3"
                    >
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{details.title}</h3>
                        <p className="text-sm text-slate-600 mt-0.5">
                          Origin: <strong className="font-semibold">{details.origin}</strong>
                        </p>
                        <p className="text-sm text-slate-600">
                          Destination: <strong className="font-semibold">{details.destination}</strong>
                        </p>
                        <p className="text-amber-600 font-bold font-mono text-base mt-1">{money(details.price)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(itemId)}
                        title="Remove from cart"
                        aria-label={`Remove ${details.title}`}
                        className="p-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}

                <Link
                  to="/logistics"
                  className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm py-3 rounded transition mt-2"
                >
                  GO TO SMART CART TO REVIEW & PAY
                </Link>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
              Order History ({reservations.length})
            </h2>

            {reservations.length === 0 ? (
              <p className="text-slate-500 italic py-4">No processed orders on record yet.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {reversedReservations.map((item, idx) => {
                  const details = getItemDetails(item);
                  return (
                    <div
                      key={item.orderRef || item.id || idx}
                      className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 shadow-sm flex flex-col gap-1.5"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-[#166534] text-lg">{details.title}</h3>
                        {item.orderRef && (
                          <span className="text-xs font-mono font-bold text-[#15803d] bg-white px-2 py-0.5 rounded border border-[#86efac]">
                            {item.orderRef}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#15803d]">
                        Origin: <strong className="font-semibold">{details.origin}</strong>
                      </p>
                      <p className="text-sm text-[#15803d]">
                        Destination: <strong className="font-semibold">{details.destination}</strong>
                      </p>
                      <p className="text-[#166534] font-bold font-mono text-base mt-0.5">{money(details.price)}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] font-mono font-bold uppercase bg-[#dcfce7] text-[#15803d] px-2 py-1 rounded border border-[#86efac]">
                          ORDER PROCESSED
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}