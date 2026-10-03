import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-slate-900 tracking-tight">
          NextDocker
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-8 text-xs font-semibold text-slate-600">
          <Link 
            to="/marketplace" 
            className={isActive('/marketplace') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}
          >
            Marketplace
          </Link>
          <Link 
            to="/tracking" 
            className={isActive('/tracking') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}
          >
            Tracking
          </Link>
          <Link 
            to="/logistics" 
            className={isActive('/logistics') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}
          >
            Logistics
          </Link>
          <Link 
            to="/rates" 
            className={isActive('/rates') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}
          >
            Rates
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-5 text-slate-700">
          <Link to="/profile" className="hover:text-black transition-colors text-sm">👤</Link>
          <button className="hover:text-black transition-colors text-sm">🔍</button>
        </div>
      </div>
    </header>
  );
}