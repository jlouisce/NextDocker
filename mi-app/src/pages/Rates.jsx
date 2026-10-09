import React, { useState } from 'react';
import { TrendingUp, Calculator, CheckCircle2 } from 'lucide-react';

const fallbackRates = [
  { route: 'Shanghai (CNSHA) ➔ Rotterdam (NLRTM)', std20: 1850, hc40: 2950, reefer: 3800, trend: '+1.8%' },
  { route: 'Ningbo (CNNGB) ➔ Los Angeles (USLAX)', std20: 2100, hc40: 3200, reefer: 4150, trend: '-0.5%' },
  { route: 'Singapore (SGSIN) ➔ Hamburg (DEHAM)', std20: 1720, hc40: 2780, reefer: 3600, trend: '+2.4%' },
  { route: 'Antwerp (BEANT) ➔ New York (USNYC)', std20: 1450, hc40: 2250, reefer: 3100, trend: '+0.0%' }
];

export default function Rates() {
  const [selectedRoute, setSelectedRoute] = useState(fallbackRates[0].route);
  const [containerType, setContainerType] = useState('std20');
  const [quantity, setQuantity] = useState(1);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Obtener precio base de la ruta seleccionada
  const activeRouteData = fallbackRates.find((r) => r.route === selectedRoute) || fallbackRates[0];
  const unitPrice = activeRouteData[containerType] || 1850;
  const totalCost = unitPrice * Math.max(1, Number(quantity) || 1);

  const handleRequestQuote = (e) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => setQuoteSuccess(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Freight Rates & Indices</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time spot rates across major global shipping corridors.
        </p>
      </div>

      {/* TABLA DE TARIFAS GLOBALES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Global Spot Market Rates</h2>
            <p className="text-[11px] text-slate-500">Updated daily based on average container index rates.</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Market Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Trade Route</th>
                <th className="py-3.5 px-4 text-right">20ft Standard</th>
                <th className="py-3.5 px-4 text-right">40ft High Cube</th>
                <th className="py-3.5 px-4 text-right">Reefer</th>
                <th className="py-3.5 px-6 text-center">Weekly Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {fallbackRates.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{row.route}</td>
                  <td className="py-4 px-4 text-right font-mono">${row.std20.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-mono">${row.hc40.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-mono">${row.reefer.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      row.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALCULADORA DE TARIFAS INSTANTÁNEA */}
      <div className="bg-slate-950 text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="font-bold text-base text-white">Instant Rate Calculator</h2>
            <p className="text-xs text-slate-400">Estimate your total freight cost based on volume and route selection.</p>
          </div>
        </div>

        <form onSubmit={handleRequestQuote} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Select Corridor</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-amber-500"
            >
              {fallbackRates.map((r, i) => (
                <option key={i} value={r.route}>{r.route}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Container Type</label>
            <select
              value={containerType}
              onChange={(e) => setContainerType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="std20">20ft Standard</option>
              <option value="hc40">40ft High Cube</option>
              <option value="reefer">Refrigerated (Reefer)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Units Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-3 pt-2 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold">Estimated Freight Cost</span>
              <p className="text-2xl font-black text-amber-400">${totalCost.toLocaleString()} USD</p>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-8 py-3 rounded-xl text-xs transition-colors shadow-lg"
            >
              Request Official Quote
            </button>
          </div>
        </form>

        {quoteSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Formal quotation request submitted successfully!</span>
          </div>
        )}
      </div>

    </div>
  );
}