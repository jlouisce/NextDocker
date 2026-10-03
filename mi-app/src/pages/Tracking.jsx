import React, { useState } from 'react';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

export default function Tracking() {
  const { reservations } = useApp();
  const [searchId, setSearchId] = useState('');
  const [activeTrack, setActiveTrack] = useState({
    id: 'MSKU-982341-2',
    vessel: 'Maersk Mc-Kinney Moller',
    origin: 'Shanghai (CNSHA)',
    destination: 'Rotterdam (NLRTM)',
    eta: 'Oct 14, 2026',
    status: 'In Transit',
    progress: 65,
    location: 'Indian Ocean (Lat 12.4, Long 65.2)'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    // Buscar si coincide con alguna reserva del usuario
    const match = reservations.find((r) => r.id.toLowerCase() === searchId.trim().toLowerCase());

    if (match) {
      setActiveTrack({
        id: match.id,
        vessel: 'Ever Given II',
        origin: match.port,
        destination: 'Rotterdam (NLRTM)',
        eta: 'Oct 20, 2026',
        status: 'Processing at Terminal',
        progress: 25,
        location: `${match.port} Terminal Berth 4`
      });
    } else {
      setActiveTrack({
        id: searchId.toUpperCase(),
        vessel: 'Pacific Logistics Carrier',
        origin: 'Ningbo (CNNGB)',
        destination: 'Los Angeles (USLAX)',
        eta: 'Oct 18, 2026',
        status: 'In Transit',
        progress: 50,
        location: 'Mid-Pacific Ocean'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      <section className="bg-slate-950 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Container Live Tracking</h1>
          <p className="text-slate-400 text-xs mb-6">Real-time GPS telemetry and AIS vessel positioning.</p>

          <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-2">
            <input 
              type="text" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Container or Booking ID (e.g. MSKU-982341-2)" 
              className="flex-1 bg-white text-slate-900 px-4 py-2.5 rounded-lg text-xs font-semibold focus:outline-none border border-slate-300"
            />
            <button 
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors"
            >
              Track
            </button>
          </form>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-12 w-full flex-1">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-100 pb-4 mb-6 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
                Live Status
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">Container: {activeTrack.id}</h2>
              <p className="text-xs text-slate-500">Vessel: <span className="font-semibold text-slate-700">{activeTrack.vessel}</span></p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-xs text-slate-400">Estimated Arrival (ETA)</div>
              <div className="text-sm font-bold text-emerald-600">{activeTrack.eta}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>{activeTrack.origin}</span>
              <span className="text-amber-600 font-bold">{activeTrack.status} ({activeTrack.progress}%)</span>
              <span>{activeTrack.destination}</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-amber-500 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${activeTrack.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <div className="text-slate-400">Current Position</div>
              <div className="font-bold text-slate-800 mt-0.5">{activeTrack.location}</div>
            </div>
            <div>
              <div className="text-slate-400">Origin Port</div>
              <div className="font-bold text-slate-800 mt-0.5">{activeTrack.origin}</div>
            </div>
            <div>
              <div className="text-slate-400">Destination Port</div>
              <div className="font-bold text-slate-800 mt-0.5">{activeTrack.destination}</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}