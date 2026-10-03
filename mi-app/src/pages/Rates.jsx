import React, { useState } from 'react';
import Footer from '../components/Footer';
import { ratesData } from '../data/mockData';

export default function Rates() {
  const [selectedRoute, setSelectedRoute] = useState(ratesData[0].id);
  const [quantity, setQuantity] = useState(1);
  const [equipmentType, setEquipmentType] = useState('ft20');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const activeRoute = ratesData.find((r) => r.id === Number(selectedRoute)) || ratesData[0];

  // Cálculo dinámico de precio base
  const getBasePrice = () => {
    const rawPrice = activeRoute[equipmentType] || '$1,850';
    return parseInt(rawPrice.replace(/[^0-9]/g, ''), 10);
  };

  const totalPrice = getBasePrice() * (quantity || 1);

  const handleRequestQuote = (e) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => setQuoteSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      <section className="bg-slate-950 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Freight Rates & Indices</h1>
          <p className="text-slate-400 text-xs">Real-time spot rates across major global shipping corridors.</p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12 w-full flex-1 space-y-10">
        
        {/* Tabla de tarifas en vivo */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Global Spot Market Rates</h2>
            <p className="text-xs text-slate-500">Updated daily based on average container index rates.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Trade Route</th>
                  <th className="p-4">20ft Standard</th>
                  <th className="p-4">40ft High Cube</th>
                  <th className="p-4">Reefer</th>
                  <th className="p-4">Weekly Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {ratesData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-900 font-bold">{row.route}</td>
                    <td className="p-4">{row.ft20}</td>
                    <td className="p-4">{row.ft40}</td>
                    <td className="p-4">{row.reefer}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculadora interactiva de fletes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Instant Rate Calculator</h2>
          <p className="text-xs text-slate-500 mb-6">Estimate your total freight cost based on volume and route selection.</p>

          <form onSubmit={handleRequestQuote} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Select Corridor</label>
              <select 
                value={selectedRoute} 
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold"
              >
                {ratesData.map((r) => (
                  <option key={r.id} value={r.id}>{r.route}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Container Type</label>
              <select 
                value={equipmentType} 
                onChange={(e) => setEquipmentType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold"
              >
                <option value="ft20">20ft Standard</option>
                <option value="ft40">40ft High Cube</option>
                <option value="reefer">Refrigerated (Reefer)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Units Quantity</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-2.5 rounded text-xs transition-colors shadow"
              >
                Request Official Quote
              </button>
            </div>
          </form>

          {/* Resultado del cálculo */}
          <div className="mt-6 p-4 bg-slate-950 text-white rounded-lg flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Freight Cost</span>
              <div className="text-2xl font-black text-amber-500">${totalPrice.toLocaleString()} USD</div>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              Includes terminal handling fees (THC) & bunker adjustment factor (BAF).
            </div>
          </div>

          {quoteSuccess && (
            <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded font-bold text-center">
              ✓ Formal quotation request submitted successfully!
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}