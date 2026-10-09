import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Ship } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const { reservations = [] } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/tracking', label: 'Tracking' },
    { to: '/logistics', label: 'Logistics' },
    { to: '/rates', label: 'Rates' },
    { to: '/profile', label: `Profile (${reservations.length})` }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-amber-500 tracking-wider">
          <Ship className="w-6 h-6 text-amber-500" />
          <span>NextDocker</span>
        </Link>

        {/* NAVEGACIÓN ESCRITORIO */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors py-1 ${
                isActive(link.to)
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* BOTÓN MÓVIL */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-slate-300 hover:text-white p-2"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      {isMobileOpen && (
        <nav className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileOpen(false)}
              className={`block text-xs font-bold uppercase py-1.5 ${
                isActive(link.to) ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}