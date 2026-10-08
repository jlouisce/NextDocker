import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import iconCart from '../assets/figma/icon-cart.png';
import iconBell from '../assets/figma/icon-bell.png';

const links = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/logistics', label: 'Logistics' },
  { to: '/rates', label: 'Rates' },
];

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#eef1f3] sticky top-0 z-50">
      <div className="max-w-[1728px] mx-auto px-6 lg:px-[59px] h-[72px] lg:h-[101px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-2xl lg:text-[32px] font-bold text-[#303030] tracking-tight">
          NextDocker
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-[40px] font-mono text-sm lg:text-base font-bold tracking-[0.07em] text-black">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? 'border-b-2 border-black pb-1' : 'hover:opacity-70 transition-opacity'}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-4 lg:gap-[15px]">
          <Link to="/logistics" aria-label="Smart Cart" className="size-[38px] flex items-center justify-center">
            <img src={iconCart} alt="" className="h-[39px] w-[38px] object-cover" />
          </Link>
          <button type="button" aria-label="Notifications" className="size-[44px] flex items-center justify-center">
            <img src={iconBell} alt="" className="h-[45px] w-[44px] object-cover" />
          </button>
          <Link to="/profile" aria-label="Profile" className="hover:opacity-70 transition-opacity text-lg">👤</Link>
        </div>
      </div>
    </header>
  );
}
