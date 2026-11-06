import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 py-6 px-8 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm font-sans">NextDocker</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/network" className="hover:text-white transition-colors">Port Network</Link>
          <Link to="/support" className="hover:text-white transition-colors">Support</Link>
        </div>

        <div className="text-slate-500 text-[11px]">
          © {new Date().getFullYear()} NextDocker Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}