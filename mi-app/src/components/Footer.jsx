import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span>⚓</span> NextDocker
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Port Network</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>

        <div>
          2024 NextDocker Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}