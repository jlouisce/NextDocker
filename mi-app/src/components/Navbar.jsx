import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, User, LogOut, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RegisterModal from './RegisterModal';

export default function Navbar() {
  const { user, logoutUser, reservations = [] } = useApp();
  const location = useLocation();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-wider hover:opacity-90 transition-opacity">
            <div className="bg-amber-500 text-slate-950 p-1.5 rounded-lg">
              <Ship className="w-5 h-5" />
            </div>
            <span>Next<span className="text-amber-500">Docker</span></span>
          </Link>

          {/* MENÚ DE NAVEGACIÓN */}
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            <Link to="/" className={isActive('/') ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-white'}>Marketplace</Link>
            <Link to="/tracking" className={isActive('/tracking') ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-white'}>Tracking</Link>
            <Link to="/logistics" className={isActive('/logistics') ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-white'}>Logistics</Link>
            <Link to="/rates" className={isActive('/rates') ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-white'}>Rates</Link>
            
            <Link 
              to="/profile" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                isActive('/profile') ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile ({reservations.length})</span>
            </Link>

            {/* BOTÓN REGISTRO / SESIÓN */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
                <span className="text-slate-400 capitalize normal-case text-[11px]">{user.name} ({user.role || 'Usuario'})</span>
                <button onClick={logoutUser} title="Cerrar sesión" className="text-slate-500 hover:text-rose-400 p-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Registro
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* Modal global de registro */}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
}