import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { reservations } = useApp();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>⚓</span> NextDocker
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <Link to="/marketplace" className={isActive('/marketplace') || isActive('/') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}>
            Marketplace
          </Link>
          <Link to="/tracking" className={isActive('/tracking') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}>
            Tracking
          </Link>
          <Link to="/logistics" className={isActive('/logistics') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}>
            Logistics
          </Link>
          <Link to="/rates" className={isActive('/rates') ? 'text-black font-bold border-b-2 border-black pb-1' : 'hover:text-black transition-colors'}>
            Rates
          </Link>
        </nav>

        {/* User Profile Link */}
        <div className="flex items-center gap-4">
          <Link to="/profile" className="relative p-2 hover:bg-slate-100 rounded-full text-sm flex items-center gap-1">
            <span>👤</span>
            {reservations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {reservations.length}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg text-lg"
          >
            {isMobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 text-sm font-semibold">
          <Link to="/marketplace" onClick={() => setIsMobileOpen(false)} className="block py-1 text-slate-800">Marketplace</Link>
          <Link to="/tracking" onClick={() => setIsMobileOpen(false)} className="block py-1 text-slate-800">Tracking</Link>
          <Link to="/logistics" onClick={() => setIsMobileOpen(false)} className="block py-1 text-slate-800">Logistics</Link>
          <Link to="/rates" onClick={() => setIsMobileOpen(false)} className="block py-1 text-slate-800">Rates</Link>
          <Link to="/profile" onClick={() => setIsMobileOpen(false)} className="block py-1 text-amber-600 font-bold">My Profile ({reservations.length})</Link>
        </div>
      )}
    </header>
  );
}