import React, { useState } from 'react';
import Footer from '../components/Footer';

export default function Tracking() {
  const [containerId, setContainerId] = useState('MSCU9823410');

  const timelineSteps = [
    { title: 'Gate In (Shanghai)', date: 'Oct 01, 2026 - 08:30 AM', status: 'completed' },
    { title: 'Loaded on Vessel (MSC OSCAR)', date: 'Oct 02, 2026 - 02:15 PM', status: 'completed' },
    { title: 'In Transit (East China Sea)', date: 'Oct 03, 2026 - Current Position', status: 'active' },
    { title: 'Estimated Arrival (Rotterdam)', date: 'Oct 18, 2026 - Projected', status: 'upcoming' },
    { title: 'Final Gate Out', date: 'Oct 20, 2026 - Projected', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      {/* Search Header */}
      <section className="bg-slate-950 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Real-Time Container Tracking
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mb-8">
            Monitor asset location, temperature logs, and estimated arrival across all maritime routes.
          </p>

          <div className="bg-white p-2 rounded-lg shadow-xl max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={containerId}
              onChange={(e) => setContainerId(e.target.value)}
              placeholder="Enter Container ID (e.g. MSCU9823410)"
              className="w-full px-4 py-2 text-xs text-slate-900 focus:outline-none font-mono"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase px-6 py-2 rounded transition-colors whitespace-nowrap">
              Track Asset
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 w-full flex-1">
        {/* Status Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
            <div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase">
                • In Transit
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2 font-mono">Container #{containerId}</h2>
              <p className="text-xs text-slate-500">Vessel: <span className="font-semibold text-slate-700">MSC OSCAR (IMO 9703291)</span></p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-xs text-slate-500">Estimated Arrival (ETA)</div>
              <div className="text-lg font-extrabold text-slate-900">Oct 18, 2026</div>
              <div className="text-[11px] text-emerald-600 font-semibold">On Schedule</div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
            <div>
              <div className="text-slate-400 font-semibold">Origin</div>
              <div className="font-bold text-slate-800">Shanghai (CNSHA)</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold">Destination</div>
              <div className="font-bold text-slate-800">Rotterdam (NLRTM)</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold">Equipment Type</div>
              <div className="font-bold text-slate-800">40ft High Cube</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold">Payload Weight</div>
              <div className="font-bold text-slate-800">24,150 KG</div>
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Shipment Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === 'completed' ? 'bg-emerald-500 text-white' :
                    step.status === 'active' ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {step.status === 'completed' ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{step.title}</div>
                    <div className="text-[11px] text-slate-500">{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}