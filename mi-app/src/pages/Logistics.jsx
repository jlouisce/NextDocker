import React from 'react';
import Footer from '../components/Footer';

export default function Logistics() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      <section className="bg-slate-950 text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          Logistics Network & Intelligence
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto">
          Manage repositioning fleets, port storage agreements, and intermodal transport connections.
        </p>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12 w-full flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-3xl mb-3">🌐</div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Global Port Hubs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connected to 140+ port terminals worldwide with automated depot releases.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Smart Repositioning</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Algorithmic container matching to avoid empty runs and optimize repositioning costs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Insurance & Compliance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant marine hull & cargo insurance integration for seamless international transit.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}