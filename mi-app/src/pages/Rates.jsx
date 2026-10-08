import { useState } from 'react';
import { CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';
import { ratesData } from '../data/mockData';

const label = 'block font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#44474c] mb-2';
const control =
  'w-full bg-[#f7fafc] border border-[#c4c6cd] rounded-[4px] px-4 py-3 text-base text-[#181c1e] focus:outline-none focus:border-[#041627]';
const card = 'bg-white border border-[#c4c6cd] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]';

export default function Rates() {
  const [selectedRoute, setSelectedRoute] = useState(ratesData[0].id);
  const [quantity, setQuantity] = useState(1);
  const [equipmentType, setEquipmentType] = useState('ft20');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const activeRoute = ratesData.find((r) => r.id === Number(selectedRoute)) || ratesData[0];

  // Cálculo dinámico de precio base (las tarifas del mock vienen como texto, p. ej. "$1,850")
  const basePrice = parseInt(activeRoute[equipmentType].replace(/[^0-9]/g, ''), 10);
  const totalPrice = basePrice * quantity;

  const handleRequestQuote = (e) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => setQuoteSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#181c1e] font-sans">
      <section className="bg-[#041627] text-white py-12 lg:py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-[-0.02em]">Freight Rates &amp; Indices</h1>
          <p className="text-lg text-[#b7c8de] mt-2">Real-time spot rates across major global shipping corridors.</p>
        </div>
      </section>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 lg:py-12 w-full flex-1 flex flex-col gap-8 lg:gap-10">
        {/* Tabla de tarifas */}
        <section className={`${card} overflow-hidden`}>
          <div className="p-6 border-b border-[#ebeef0]">
            <h2 className="text-xl font-semibold leading-7">Global Spot Market Rates</h2>
            <p className="text-sm text-[#44474c] mt-1">Updated daily based on average container index rates.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-[#f7fafc] border-b border-[#c4c6cd] font-mono text-xs tracking-[0.05em] uppercase text-[#44474c]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">Trade Route</th>
                  <th scope="col" className="px-6 py-4 font-bold">20ft Standard</th>
                  <th scope="col" className="px-6 py-4 font-bold">40ft High Cube</th>
                  <th scope="col" className="px-6 py-4 font-bold">Reefer</th>
                  <th scope="col" className="px-6 py-4 font-bold">Weekly Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebeef0] font-mono text-sm">
                {ratesData.map((row) => (
                  <tr key={row.id} className="hover:bg-[#f7fafc] transition-colors">
                    <td className="px-6 py-4 font-sans font-semibold text-base text-[#041627]">{row.route}</td>
                    <td className="px-6 py-4">{row.ft20}</td>
                    <td className="px-6 py-4">{row.ft40}</td>
                    <td className="px-6 py-4">{row.reefer}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-[12px] px-3 py-1 font-medium ${row.positive ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#ffdad6] text-[#93000a]'}`}>
                        {row.positive ? <TrendingUp className="size-3.5" aria-hidden="true" /> : <TrendingDown className="size-3.5" aria-hidden="true" />}
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Calculadora de fletes */}
        <section className={`${card} p-6 lg:p-8`}>
          <h2 className="text-xl font-semibold leading-7">Instant Rate Calculator</h2>
          <p className="text-sm text-[#44474c] mt-1 mb-6">Estimate your total freight cost based on volume and route selection.</p>

          <form onSubmit={handleRequestQuote} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="rate-route" className={label}>Select corridor</label>
              <select id="rate-route" value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} className={control}>
                {ratesData.map((r) => (
                  <option key={r.id} value={r.id}>{r.route}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rate-type" className={label}>Container type</label>
              <select id="rate-type" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)} className={control}>
                <option value="ft20">20ft Standard</option>
                <option value="ft40">40ft High Cube</option>
                <option value="reefer">Refrigerated (Reefer)</option>
              </select>
            </div>

            <div>
              <label htmlFor="rate-quantity" className={label}>Units quantity</label>
              <input
                id="rate-quantity"
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                className={control}
              />
            </div>

            <button
              type="submit"
              className="h-12 bg-brand-orange hover:brightness-95 transition rounded-[4px] font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#181c1e] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
            >
              Request official quote
            </button>
          </form>

          <div className="mt-6 p-5 bg-[#041627] text-white rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#b7c8de]">Estimated freight cost</span>
              <div className="text-3xl font-bold text-brand-orange tracking-[-0.01em]">${totalPrice.toLocaleString('en-US')} USD</div>
            </div>
            <p className="text-sm text-[#b7c8de] sm:text-right max-w-[320px]">
              Includes terminal handling fees (THC) &amp; bunker adjustment factor (BAF).
            </p>
          </div>

          {quoteSuccess && (
            <p role="status" className="mt-4 p-3 bg-[#dcfce7] border border-[#86efac] text-[#166534] text-sm rounded-[4px] font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Formal quotation request submitted successfully!
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
