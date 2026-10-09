import { useState } from 'react';
import { ChevronDown, Flag, MapPin, Receipt, Search, Ship, TrendingDown, Waves, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import { equipmentOptions, lanesData } from '../../data/mockData';
import heroOverlay from '../../assets/figma/dash-hero-overlay.jpg';

const carrierIcons = { oceania: Waves, pacific: Ship, express: Zap };
const money = (value) => `$${value.toLocaleString('en-US')}`;
const sum = (rows) => rows.reduce((total, [, amount]) => total + amount, 0);

// Código corto de puerto: "Shanghai (CNSHA)" -> "SHA"
const portCode = (text) => {
  const inParens = text.match(/\(([A-Za-z]{3,5})\)/);
  return (inParens ? inParens[1].slice(-3) : text.trim().slice(0, 3)).toUpperCase();
};

const trends = {
  '30D': { change: '-4.2%', bars: [98, 110, 104, 86, 74, 67] },
  '60D': { change: '-1.8%', bars: [80, 92, 100, 96, 88, 76] },
  '90D': { change: '+2.6%', bars: [60, 72, 84, 92, 100, 108] },
};
const barOpacity = ['opacity-50', 'opacity-60', 'opacity-70', 'opacity-80', 'opacity-90'];

const label = 'font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#44474c]';
const field =
  'w-full bg-[#f7fafc] border border-[#c4c6cd] rounded-[4px] py-[13px] text-base text-[#181c1e] focus:outline-none focus:border-[#041627]';
const card = 'bg-white border border-[#c4c6cd] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]';

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [form, setForm] = useState({ origin: 'Shanghai (CNSHA)', destination: 'Los Angeles (USLAX)', equipment: '40ft-hc' });
  const [query, setQuery] = useState(form);
  const [selectedLane, setSelectedLane] = useState(lanesData[0].id);
  const [period, setPeriod] = useState('30D');

  const equipment = equipmentOptions.find((e) => e.id === query.equipment) ?? equipmentOptions[1];
  const lanes = lanesData.map((lane) => ({
    ...lane,
    breakdown: lane.breakdown.map(([name, amount]) => [name, Math.round(amount * equipment.factor)]),
  }));
  const active = lanes.find((lane) => lane.id === selectedLane) ?? lanes[0];
  const trend = trends[period];

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(form);
  };

  const handleBook = (laneId) => {
    addToCart(query.equipment);
    setSelectedLane(laneId);
    navigate('/logistics');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f3] text-[#181c1e] font-sans">
      {/* Header propio del dashboard */}
      <header className="bg-[#0e1a33]">
        <div className="max-w-[1728px] mx-auto px-4 sm:px-6 lg:px-[41px] min-h-[64px] lg:h-[101px] py-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Link to="/dashboard" className="text-lg sm:text-xl lg:text-[28px] font-bold text-[#d9d1b1] whitespace-nowrap">
            NextDocker | DashBoard
          </Link>
          <nav aria-label="Dashboard" className="order-3 lg:order-none w-full lg:w-auto flex items-center gap-6 lg:gap-[40px] font-mono font-bold text-sm lg:text-base tracking-[0.07em] text-[#f0f0f0]">
            <Link to="/marketplace" className="hover:opacity-70 transition-opacity">Marketplace</Link>
            <Link to="/logistics" className="hover:opacity-70 transition-opacity">Logistics</Link>
            <Link to="/rates" className="hover:opacity-70 transition-opacity">Rates</Link>
          </nav>
          <Link to="/marketplace" className="bg-brand-orange hover:brightness-95 transition rounded-[9px] px-3 h-10 lg:h-[46px] inline-flex items-center font-mono text-sm lg:text-base tracking-[0.07em] text-[#222] whitespace-nowrap">
            Back to store
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1728px] mx-auto px-6 lg:px-[64px] py-8 flex flex-col gap-8">
        {/* Hero + buscador */}
        <section className={`${card} overflow-hidden`}>
          <div className="relative px-8 py-12 bg-[#041627]">
            <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: `url("${heroOverlay}")` }} />
            <div className="absolute inset-0 bg-[rgba(4,22,39,0.85)] mix-blend-overlay" />
            <div className="relative flex flex-col gap-2">
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-[-0.02em] leading-[56px]">Global Freight Rates</h1>
              <p className="text-lg text-[#b7c8de] leading-7 max-w-[672px]">
                Instant access to real-time shipping lanes, structural pricing, and capacity guarantees.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="dash-origin" className={label}>Origin port</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#44474c] pointer-events-none" aria-hidden="true" />
                <input id="dash-origin" type="text" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className={`${field} pl-[41px] pr-[17px]`} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dash-destination" className={label}>Destination port</label>
              <div className="relative">
                <Flag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#44474c] pointer-events-none" aria-hidden="true" />
                <input id="dash-destination" type="text" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className={`${field} pl-[41px] pr-[17px]`} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dash-equipment" className={label}>Equipment type</label>
              <div className="relative">
                <select id="dash-equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} className={`${field} appearance-none pl-[17px] pr-[41px] cursor-pointer`}>
                  {equipmentOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#44474c] pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            <button type="submit" className="h-12 bg-brand-orange hover:brightness-95 transition rounded-[4px] flex items-center justify-center gap-2 font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#181c1e] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
              <Search className="size-[18px]" aria-hidden="true" />
              Search rates
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Comparador de tarifas */}
          <section className="xl:col-span-8 flex flex-col gap-4">
            <div className="border-b border-[#c4c6cd] pb-[9px] flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold leading-7">
                Available Lanes: {portCode(query.origin)} → {portCode(query.destination)}
              </h2>
              <span className="bg-[#ebeef0] rounded-[12px] px-3 py-1 font-mono font-medium text-sm text-[#44474c] whitespace-nowrap">
                {lanes.length} Results Found
              </span>
            </div>

            {lanes.map((lane) => {
              const total = sum(lane.breakdown);
              const isSelected = lane.id === active.id;
              const CarrierIcon = carrierIcons[lane.logo];
              return (
                <article
                  key={lane.id}
                  className={`${card} relative overflow-hidden ${lane.fastest ? 'border-2 border-brand-orange' : ''} ${isSelected && !lane.fastest ? 'ring-2 ring-[#041627]' : ''}`}
                >
                  {lane.fastest && (
                    <span className="absolute right-0 top-0 bg-brand-orange px-3 py-1 font-mono font-bold text-xs tracking-[0.05em] text-[#181c1e]">Fastest</span>
                  )}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-3 flex items-center gap-4">
                      <div className="bg-[#ebeef0] border border-[#c4c6cd] rounded-[12px] h-12 w-[44px] overflow-hidden flex items-center justify-center shrink-0">
                        <CarrierIcon className="size-6 text-[#041627]" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold leading-7">{lane.carrier}</h3>
                        <div className="flex items-center gap-1">
                          <span className={`size-2 rounded-full ${lane.status === 'Available' ? 'bg-[#34d399]' : 'bg-[#f59e0b]'}`} />
                          <span className="font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#44474c]">{lane.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 lg:border-x border-[#c4c6cd] lg:px-[17px] flex gap-4">
                      <div className="flex-1 flex flex-col gap-[7px]">
                        <span className={label}>Transit time</span>
                        <span className={`font-mono text-sm ${lane.fastest ? 'font-bold' : 'font-medium'}`}>{lane.transit}</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-[7px]">
                        <span className={label}>Frequency</span>
                        <span className="font-mono font-medium text-sm">{lane.frequency}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col items-end justify-center">
                      <div className="pb-3 text-right">
                        <div className={label}>Total rate</div>
                        <div className="flex items-baseline justify-end gap-2">
                          <span className="text-[32px] font-bold text-[#041627] tracking-[-0.01em] leading-10">{money(total)}</span>
                          <span className="text-sm text-[#74777d]">USD</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLane(lane.id)}
                          className="border border-[#041627] rounded-[4px] px-[17px] py-[9px] font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#041627] hover:bg-[#041627] hover:text-white transition-colors"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBook(lane.id)}
                          className={`rounded-[4px] px-4 py-[9px] font-mono font-bold text-xs tracking-[0.05em] uppercase shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:brightness-110 transition ${lane.fastest ? 'bg-brand-orange text-[#181c1e]' : 'bg-[#041627] text-white'}`}
                        >
                          Book now
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Barra lateral */}
          <aside className="xl:col-span-4 flex flex-col gap-8">
            <div className={`${card} p-[25px] flex flex-col gap-4`}>
              <h3 className="flex items-center gap-2 text-xl font-semibold leading-7">
                <Receipt className="size-5" aria-hidden="true" />
                Rate Breakdown
              </h3>
              <p className="text-sm text-[#44474c] leading-5">
                Estimated average breakdown for {equipment.label.split(' (')[0]} on this lane ({active.carrier}).
              </p>
              <div className="flex flex-col gap-2 font-mono font-medium text-sm">
                {active.breakdown.map(([name, amount]) => (
                  <div key={name} className="border-b border-dashed border-[#c4c6cd] pt-2 pb-[9px] flex justify-between gap-4">
                    <span className="text-[#44474c]">{name}</span>
                    <span>{money(amount)}</span>
                  </div>
                ))}
                <div className="bg-[#ebeef0] p-3 mt-2 flex justify-between gap-4 font-bold">
                  <span>Estimated Total</span>
                  <span className="text-[#041627]">{money(sum(active.breakdown))}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#041627] border border-[#c4c6cd] p-5 sm:p-[34px] flex flex-col gap-[5px] shadow-[0_5px_8px_-1px_rgba(0,0,0,0.1),0_3px_5px_-1px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-[11px] text-2xl font-semibold text-white leading-[38px]">
                  <TrendingDown className="size-6" aria-hidden="true" />
                  Market Trend
                </h3>
                <div className="bg-[#1a2b3c] p-[5px] flex gap-[5px]" role="group" aria-label="Trend period">
                  {Object.keys(trends).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPeriod(key)}
                      aria-pressed={period === key}
                      className={`rounded-[3px] px-[11px] py-[5px] font-mono font-bold text-base tracking-[0.05em] ${period === key ? 'bg-[#ebeef0] text-[#181c1e]' : 'text-[#b7c8de] hover:text-white'}`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <p className="py-4 flex items-baseline gap-[11px]">
                <span className="text-[43px] font-bold text-brand-orange tracking-[-0.01em] leading-[54px]">{trend.change}</span>
                <span className="text-lg text-[#b7c8de]">vs last period</span>
              </p>

              <div className="h-[129px] border-b border-[#c4c6cd] pb-[7px] flex items-end justify-between gap-2" aria-hidden="true">
                {trend.bars.map((height, index) => (
                  <div
                    key={index}
                    style={{ height }}
                    className={`flex-1 rounded-t-[3px] ${index === trend.bars.length - 1 ? 'bg-brand-orange shadow-[0_0_11px_rgba(255,87,34,0.3)]' : `bg-[#b7c8de] ${barOpacity[index]}`}`}
                  />
                ))}
              </div>

              <div className="flex items-start justify-between">
                <span className="font-mono text-[13px] text-[#b7c8de] leading-8">Past</span>
                <span className="font-mono text-[13px] text-[#b7c8de] leading-8">Present</span>
              </div>

              <p className="pt-[14px] text-lg text-[#b7c8de] leading-[30px]">
                Rates on the {portCode(query.origin)} → {portCode(query.destination)} lane have stabilized after a minor drop mid-month. Capacity remains tight for early next month.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
