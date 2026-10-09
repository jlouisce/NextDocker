import React from 'react';

export default function Logistics() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* BANNER SUPERIOR OSCURO */}
      <section className="bg-slate-950 text-white py-16 px-6 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Logistics Network & Intelligence
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Manage repositioning fleets, port storage agreements, and intermodal transport connections.
          </p>
        </div>
      </section>

      {/* TARJETAS DE SERVICIOS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-2xl">
              🌐
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Global Port Hubs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connected to 140+ port terminals worldwide with automated depot releases.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Smart Repositioning</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmic container matching to avoid empty runs and optimize repositioning costs.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Insurance & Compliance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant marine hull & cargo insurance integration for seamless international transit.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}