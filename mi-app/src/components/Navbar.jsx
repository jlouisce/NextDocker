import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, User, CheckCircle2, PackageCheck, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AUTH_CHANGE_EVENT, getSession } from '../utils/auth';

export default function Navbar() {
  const {
    cart = [],
    notifications = [],
    markAllNotificationsRead,
    clearNotifications,
  } = useApp() || {};
  const location = useLocation();
  const [session, setSession] = useState(() => getSession());
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const syncSession = () => setSession(getSession());
    window.addEventListener(AUTH_CHANGE_EVENT, syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleNotifications = () => {
    const nextOpen = !notifOpen;
    setNotifOpen(nextOpen);
    if (nextOpen && unreadCount > 0 && typeof markAllNotificationsRead === 'function') {
      markAllNotificationsRead();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo y Enlaces Navegación */}
        <div className="flex items-center space-x-3 sm:space-x-8">
          <Link to="/" className="text-base sm:text-xl font-bold tracking-tight text-slate-900 shrink-0">
            NextDocker
          </Link>

          <nav className="flex items-center space-x-2 sm:space-x-6 text-xs sm:text-sm font-medium">
            <Link
              to="/marketplace"
              className={`hover:text-slate-900 transition-colors ${
                isActive('/marketplace') ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/logistics"
              className={`hover:text-slate-900 transition-colors ${
                isActive('/logistics') ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              Logistics
            </Link>
            <Link
              to="/rates"
              className={`hover:text-slate-900 transition-colors ${
                isActive('/rates') ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              Rates
            </Link>
          </nav>
        </div>

        {/* Íconos de acción a la derecha */}
        <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
          <Link
            to="/logistics"
            aria-label="Logistics cart"
            className="relative p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Campana de Notificaciones */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={handleToggleNotifications}
              aria-label="Notifications"
              className="relative p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="bg-[#041627] text-white px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    Shipping Notifications
                  </span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => clearNotifications?.()}
                      className="text-[11px] font-mono text-slate-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No pending notifications</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Order confirmations and tracking numbers will appear here once dispatched.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((item) => (
                      <div key={item.id} className="p-3.5 hover:bg-slate-50 transition-colors flex gap-3">
                        <div className="mt-0.5 bg-emerald-100 text-emerald-700 p-2 rounded-full h-fit shrink-0">
                          <PackageCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-900">{item.title}</p>
                            <span className="text-[10px] font-mono text-slate-400">{item.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{item.message}</p>
                          <div className="mt-1.5 inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            <span className="text-[10px] font-mono uppercase text-slate-500">Tracking:</span>
                            <span className="text-xs font-mono font-bold text-[#041627]">
                              {item.trackingNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {session ? (
            <Link
              to="/profile"
              aria-label="Account profile"
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-colors ${
                isActive('/profile')
                  ? 'bg-[#041627] text-white border-[#041627]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {session.avatar ? (
                <img src={session.avatar} alt={session.name} className="h-5 w-5 rounded-full object-cover" />
              ) : (
                <User className="h-4 w-4 shrink-0" />
              )}
              <span className="hidden sm:inline text-xs font-semibold max-w-[110px] truncate">
                {session.name || session.email}
              </span>
            </Link>
          ) : (
            <Link
              to="/dashboard/login"
              aria-label="Sign in"
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}