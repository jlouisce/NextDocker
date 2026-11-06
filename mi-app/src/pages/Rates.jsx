import { useState } from 'react';
import { Search, MapPin, Anchor, Box } from 'lucide-react';
import FreightCard from '../components/FreightCard';
import RateBreakdown from '../components/RateBreakdown';
import MarketTrend from '../components/MarketTrend';
import Footer from '../components/Footer';

export default function Rates() {
  const [origin, setOrigin] = useState('Shanghai (CNSHA)');
  const [destination, setDestination] = useState('Los Angeles (USLAX)');
  const [equipment, setEquipment] = useState("40' High Cube (HC)");
  const [searchFilters, setSearchFilters] = useState({
  origin: 'Shanghai (CNSHA)',
  destination: 'Los Angeles (USLAX)',
  equipment: "40' High Cube (HC)",
});

const [error, setError] = useState('');

const handleSearch = () => {
  if (!origin.trim() || !destination.trim()) {
    setError('Please enter origin and destination ports.');
    return;
  }

  setError('');
  setSearchFilters({
    origin: origin.trim(),
    destination: destination.trim(),
    equipment,
  });
};
  

  const rateQuotes = [
    {
      id: 'quote-1',
      carrier: 'Oceania Line',
      carrierCode: 'OCL',
      status: 'AVAILABLE',
      transitTime: '18-21 Days',
      frequency: 'Weekly (Mon)',
      price: '3,250',
    },
    {
      id: 'quote-2',
      carrier: 'Pacific Freight',
      carrierCode: 'PAC',
      status: 'AVAILABLE',
      transitTime: '20-24 Days',
      frequency: 'Bi-Weekly',
      price: '3,100',
    },
    {
      id: 'quote-3',
      carrier: 'Express Logistics',
      carrierCode: 'EXP',
      status: 'LIMITED SPACE',
      tag: 'Fastest',
      transitTime: '14-16 Days',
      frequency: 'Weekly (Fri)',
      price: '4,150',
    },
  ];

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
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900">
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Global Freight Rates
          </h1>
          <p className="text-slate-300 font-roboto text-sm lg:text-base mt-2 max-w-2xl">
            Instant access to real-time shipping lanes, structural pricing, and capacity guarantees.
          </p>

          {/* Inline Filter Control Bar */}
          <div className="mt-8 bg-white p-4 rounded-md shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-900">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Origin Port
              </label>
              <div className="relative">
                <Anchor className="size-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded text-xs py-2 pl-9 pr-3 font-mono font-medium focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Destination Port
              </label>
              <div className="relative">
                <MapPin className="size-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded text-xs py-2 pl-9 pr-3 font-mono font-medium focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Equipment Type
              </label>
              <div className="relative">
                <Box className="size-4 absolute left-3 top-2.5 text-slate-400" />
                <select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded text-xs py-2 pl-9 pr-3 font-mono font-medium focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="20' Standard">20' Standard (SD)</option>
                  <option value="40' High Cube (HC)">40' High Cube (HC)</option>
                  <option value="40' Reefer">40' Refrigerated (Reefer)</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full py-2 bg-brand-orange text-navy-900 font-bold uppercase tracking-wider text-xs rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2 h-[34px]"
              >
                <Search className="size-4" />
                Search Rates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Results View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-12 gap-8">
        {/* Left Column: Carriers & Lane Quotes (8 cols) */}
        <section className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 font-mono">
            Available Lanes: {searchFilters.origin} → {searchFilters.destination}
            </h2>
            <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded">
              {filteredRates.length} Rate Quotes
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {filteredRates.length > 0 ? (
              filteredRates.map((rate) => (<FreightCard key={rate.id} rate={rate} />

              ))
            ) : (
            <p className="text-slate-500 bg-white rounded p-6">
              No simulated rates available for this route and equipment.
              </p>
            )}
          </div>
        </section>

        {/* Right Column: Analytics & Breakdown (4 cols) */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <RateBreakdown />
          <MarketTrend />
        </aside>
      </main>

      <Footer />
    </div>
  );
}