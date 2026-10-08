import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const links = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/logistics', label: 'Logistics' },
  { to: '/rates', label: 'Rates' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { cart } = useApp();
  const [open, setOpen] = useState(false);
  const isActive = (path) => pathname === path;

  return (
    <header className="bg-[#eef1f3] sticky top-0 z-50">
      <div className="max-w-[1728px] mx-auto px-4 sm:px-6 lg:px-[59px] h-[64px] lg:h-[101px] flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl lg:text-[32px] font-bold text-[#303030] tracking-tight">
          NextDocker
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-8 lg:gap-[40px] font-mono text-sm lg:text-base font-bold tracking-[0.07em] text-black">
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

        <div className="flex items-center gap-3 lg:gap-4">
          <Link
            to="/dashboard/login"
            className="whitespace-nowrap font-mono font-bold text-xs sm:text-sm lg:text-base tracking-[0.07em] text-black border border-black px-2 sm:px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link to="/logistics" aria-label={`Smart Cart, ${cart.length} items`} className="relative p-2 text-[#303030] hover:opacity-70 transition-opacity">
            <ShoppingCart className="size-6" aria-hidden="true" />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-orange text-[11px] font-bold text-black flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 text-[#303030]"
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="md:hidden border-t border-black/10 px-4 sm:px-6 py-3 flex flex-col font-mono font-bold tracking-[0.07em]">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className={`py-3 ${isActive(to) ? 'underline underline-offset-4' : ''}`}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
