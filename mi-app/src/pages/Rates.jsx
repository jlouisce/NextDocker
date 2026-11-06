import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const GLOBAL_PORTS = [
  { code: 'CNSHA', name: 'Shanghai (CNSHA)', country: 'China' },
  { code: 'USLAX', name: 'Los Angeles (USLAX)', country: 'EE. UU.' },
  { code: 'NLRTM', name: 'Rotterdam (NLRTM)', country: 'Países Bajos' },
  { code: 'SGSIN', name: 'Singapore (SGSIN)', country: 'Singapur' },
  { code: 'DEHAM', name: 'Hamburg (DEHAM)', country: 'Alemania' },
  { code: 'CNNGB', name: 'Ningbo-Zhoushan (CNNGB)', country: 'China' },
  { code: 'KRPUS', name: 'Busan (KRPUS)', country: 'Corea del Sur' },
];

const EQUIPMENT_TYPES = [
  { id: '20ft', name: "20' Standard (SD)", multiplier: 0.75, containerId: '20ft-standard' },
  { id: '40hc', name: "40' High Cube (HC)", multiplier: 1.0, containerId: '40ft-hc' },
  { id: 'reefer', name: "40' Refrigerated (Reefer)", multiplier: 1.45, containerId: 'reefer' },
];

const BASE_CARRIERS = [
  { id: 'oceania', name: 'Oceania Line', status: 'AVAILABLE', transit: '18-21 Days', frequency: 'Weekly (Mon)', basePrice: 3250 },
  { id: 'pacific', name: 'Pacific Freight', status: 'AVAILABLE', transit: '20-24 Days', frequency: 'Bi-Weekly', basePrice: 3100 },
  { id: 'express', name: 'Express Logistics', status: 'LIMITED SPACE', tag: 'FASTEST', transit: '14-16 Days', frequency: 'Weekly (Fri)', basePrice: 4250 },
];

export default function Rates() {
  const navigate = useNavigate();
  const { addToCart, searchParams } = useApp() || {};

  const [origin, setOrigin] = useState(searchParams?.origin || 'Shanghai (CNSHA)');
  const [destination, setDestination] = useState('Los Angeles (USLAX)');
  const [equipmentId, setEquipmentId] = useState('40hc');

  const [activeSearch, setActiveSearch] = useState({
    origin: searchParams?.origin || 'Shanghai (CNSHA)',
    destination: 'Los Angeles (USLAX)',
    equipmentId: '40hc',
  });

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setActiveSearch({ origin, destination, equipmentId });
  };

  const selectedEquipment = EQUIPMENT_TYPES.find((e) => e.id === activeSearch.equipmentId) || EQUIPMENT_TYPES[1];

  const calculatedRates = BASE_CARRIERS.map((carrier) => {
    const isSamePort = activeSearch.origin === activeSearch.destination;
    const routeFactor = isSamePort ? 0.3 : 1.0;
    const finalPrice = Math.round(carrier.basePrice * selectedEquipment.multiplier * routeFactor);
    return {
      ...carrier,
      totalRate: finalPrice,
    };
  });

  // Envío persistente del puerto ingresado al carrito
  const handleBookNow = (carrier) => {
    const targetOrigin = activeSearch.origin || origin || 'Shanghai (CNSHA)';
    if (typeof addToCart === 'function') {
      addToCart(selectedEquipment.containerId, targetOrigin);
    }
    navigate('/logistics');
  };

  const availableRates = rateQuotes.map((rate) => ({
  ...rate,
  origin: 'Shanghai (CNSHA)',
  destination: 'Los Angeles (USLAX)',
  equipment: "40' High Cube (HC)",
}));

const normalize = (value) =>
  value.trim().toLowerCase();

const filteredRates = availableRates.filter((rate) =>
  normalize(rate.origin) === normalize(searchFilters.origin) &&
  normalize(rate.destination) === normalize(searchFilters.destination) &&
  rate.equipment === searchFilters.equipment
);



  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#041627] font-sans pb-16">
      <section className="bg-[#041627] text-white px-6 lg:px-12 py-12 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Global Freight Rates</h1>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            Instant access to real-time shipping lanes, structural pricing, and capacity guarantees.
          </p>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/10 p-4 rounded-lg border border-slate-700 backdrop-blur-sm">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Origin Port</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Shanghai, Cali, Rotterdam"
                className="w-full bg-[#0b1d2d] border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Destination Port</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Los Angeles (USLAX)"
                className="w-full bg-[#0b1d2d] border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Equipment Type</label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full bg-[#0b1d2d] border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
              >
                {EQUIPMENT_TYPES.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold font-mono py-2.5 px-4 rounded flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4" />
                <span>SEARCH RATES</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 mt-10">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-xl font-bold">
            Available Lanes: <span className="text-amber-600">{activeSearch.origin}</span> &rarr; <span className="text-amber-600">{activeSearch.destination}</span>
          </h2>
          <span className="text-sm text-slate-500 font-medium">{calculatedRates.length} Results Found</span>
        </div>

        <div className="space-y-4 mb-12">
          {calculatedRates.map((carrier) => (
            <div
              key={carrier.id}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{carrier.name}</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                    {carrier.status}
                  </span>
                </div>
                <div className="flex gap-6 text-xs text-slate-500 font-mono mt-2">
                  <div>
                    <span className="block text-slate-400">TRANSIT TIME</span>
                    <span className="font-semibold text-slate-700">{carrier.transit}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">FREQUENCY</span>
                    <span className="font-semibold text-slate-700">{carrier.frequency}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="block text-xs font-mono text-slate-400 uppercase">TOTAL RATE</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    ${carrier.totalRate.toLocaleString()} <span className="text-xs text-slate-500 font-normal">USD</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleBookNow(carrier)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs py-3 px-6 rounded transition"
                >
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}