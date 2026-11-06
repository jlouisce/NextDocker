import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { cart = [] } = useApp() || {};
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
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
            to="/profile"
            aria-label="Perfil y cotizaciones"
            className="relative p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Notificaciones"
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 hidden sm:block"
          >
            <Bell className="h-5 w-5" />
          </button>

          <Link
            to="/dashboard/login"
            aria-label="Acceso usuario"
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </header>
  );
}