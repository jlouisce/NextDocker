import React from 'react';
import Footer from '../components/Footer';

export default function Rates() {
  const benchmarks = [
    { route: 'Shanghai (CNSHA) → Rotterdam (NLRTM)', ft20: '$1,850', ft40: '$2,950', reefer: '$3,800', trend: '+1.8%', positive: true },
    { route: 'Ningbo (CNNGB) → Los Angeles (USLAX)', ft20: '$2,100', ft40: '$3,200', reefer: '$4,150', trend: '-0.5%', positive: false },
    { route: 'Singapore (SGSIN) → Hamburg (DEHAM)', ft20: '$1,720', ft40: '$2,780', reefer: '$3,600', trend: '+2.4%', positive: true },
    { route: 'Antwerp (BEANT) → New York (USNYC)', ft20: '$1,450', ft40: '$2,250', reefer: '$3,100', trend: '0.0%', positive: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      {/* Hero Header */}
      <section className="bg-slate-950 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Global Container Freight Rates
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Benchmark market indices updated daily across primary trade lanes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 w-full flex-1">
        {/* Market Benchmark Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Spot Market Benchmarks</h2>
              <p className="text-xs text-slate-500">Average container shipping rates by major corridor.</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
              Updated Today
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="p-4">Trade Route</th>
                  <th className="p-4">20ft Standard</th>
                  <th className="p-4">40ft High Cube</th>
                  <th className="p-4">Reefer</th>
                  <th className="p-4">24h Trend</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {benchmarks.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{item.route}</td>
                    <td className="p-4 font-mono font-semibold text-slate-700">{item.ft20}</td>
                    <td className="p-4 font-mono font-semibold text-slate-700">{item.ft40}</td>
                    <td className="p-4 font-mono font-semibold text-slate-700">{item.reefer}</td>
                    <td className="p-4 font-semibold">
                      <span className={item.positive ? 'text-emerald-600' : 'text-rose-600'}>
                        {item.trend}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded text-[11px] transition-colors">
                        Get Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}