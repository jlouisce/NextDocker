import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-8 px-6 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <span className="text-white font-bold tracking-wide">NextDocker</span>
        </div>

        {/* Links de navegación inferior */}
        <div className="flex flex-wrap gap-6 text-sm">
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#ports" className="hover:text-white transition-colors">Port Network</a>
          <a href="#support" className="hover:text-white transition-colors">Support</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © 2024 NextDocker Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}