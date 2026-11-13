import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Route, Clock, Calendar, RotateCcw, CheckCircle2, X } from 'lucide-react';
import Footer from '../components/Footer';
import RateBreakdown from '../components/RateBreakdown';
import { useApp } from '../context/AppContext';
import { lanesData } from '../data/mockData';

const ALL = 'all';

// Tipos de equipo: id de contenedor del carrito y multiplicador de tarifa sobre la base (40' HC)
const EQUIPMENT = {
  [ALL]: { label: 'All Equipment Types', containerId: '40ft-hc', mult: 1 },
  '20ft': { label: "20' Standard Steel", containerId: '20ft-standard', mult: 0.75 },
  '40hc': { label: "40' High Cube", containerId: '40ft-hc', mult: 1 },
  reefer: { label: "40' Refrigerated", containerId: 'reefer', mult: 1.4 },
};

const SORTS = [
  { id: 'price', label: 'Cheapest' },
  { id: 'transit', label: 'Fastest' },
  { id: 'carrier', label: 'Carrier A-Z' },
];

const unique = (list) => [...new Set(list)];
const days = (text) => parseInt(text, 10) || 0;
const money = (n) => `$${n.toLocaleString('en-US')}`;

// Empareja texto libre venido de LandingPage (ej. "Los Angeles" o "USLAX") con las opciones del select
const resolvePortOption = (paramValue, availablePorts) => {
  if (!paramValue || paramValue === ALL) return ALL;
  const clean = paramValue.trim().toLowerCase();
  const exact = availablePorts.find((p) => p.toLowerCase() === clean);
  if (exact) return exact;
  const partial = availablePorts.find((p) => p.toLowerCase().includes(clean));
  return partial || paramValue;
};

// Fecha de llegada estimada = fecha de envío + días de tránsito
const arrivalDate = (shipDate, transit) => {
  const d = new Date(`${shipDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '—';
  d.setDate(d.getDate() + days(transit));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Desglose estimado de una tarifa (porcentajes fijos sobre el total)
const buildBreakdown = (rate) => {
  const docs = 50;
  const net = rate - docs;
  const parts = [
    ['Base Ocean Freight', Math.round(net * 0.72)],
    ['BAF (Fuel)', Math.round(net * 0.14)],
    ['CAF', Math.round(net * 0.04)],
  ];
  parts.push(['Port Handling (THC)', net - parts.reduce((s, [, v]) => s + v, 0)]);
  parts.push(['Documentation', docs]);
  return parts.map(([label, amount]) => ({ label, amount: money(amount) }));
};

const selectClass =
  'w-full bg-[#182838] text-white border border-[#38485a] rounded px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-brand-orange cursor-pointer';
const labelClass = 'text-xs font-mono text-gray-400 uppercase tracking-wider';

export default function Rates() {
  const { searchParams = {}, updateSearchParams, addToCart } = useApp();

  const origins = unique(lanesData.map((l) => l.origin));
  const destinations = unique(lanesData.map((l) => l.destination));

  // Filtros: se aplican al instante y se inicializan desde el contexto global
  const [origin, setOrigin] = useState(() => resolvePortOption(searchParams.origin, origins));
  const [destination, setDestination] = useState(() => resolvePortOption(searchParams.destination, destinations));
  const [equipment, setEquipment] = useState(
    searchParams.containerType && EQUIPMENT[searchParams.containerType] ? searchParams.containerType : ALL
  );
  const [shipDate, setShipDate] = useState(searchParams.shipDate || new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('price');

  const [selectedLane, setSelectedLane] = useState(null);
  const [booked, setBooked] = useState(null); // aviso tras agregar al carrito

  // Sincroniza automáticamente si searchParams cambia desde LandingPage u otra vista
  useEffect(() => {
    setOrigin(resolvePortOption(searchParams.origin, origins));
    setDestination(resolvePortOption(searchParams.destination, destinations));
    if (searchParams.containerType && EQUIPMENT[searchParams.containerType]) {
      setEquipment(searchParams.containerType);
    }
    if (searchParams.shipDate) {
      setShipDate(searchParams.shipDate);
    }
  }, [searchParams.origin, searchParams.destination, searchParams.containerType, searchParams.shipDate]);

  // Asegura que un puerto escrito manualmente en LandingPage también aparezca visible en el select
  const originOptions = origin !== ALL && !origins.includes(origin) ? [origin, ...origins] : origins;
  const destinationOptions =
    destination !== ALL && !destinations.includes(destination) ? [destination, ...destinations] : destinations;

  const eq = EQUIPMENT[equipment] || EQUIPMENT[ALL];

  const changeOrigin = (value) => {
    setOrigin(value);
    if (value !== ALL) updateSearchParams({ origin: value });
  };

  const changeDestination = (value) => {
    setDestination(value);
    if (value !== ALL) updateSearchParams({ destination: value });
  };

  const changeEquipment = (value) => {
    setEquipment(value);
    updateSearchParams({ containerType: value });
  };

  const changeDate = (value) => {
    setShipDate(value);
    if (value) updateSearchParams({ shipDate: value });
  };

  const resetFilters = () => {
    setOrigin(ALL);
    setDestination(ALL);
    setEquipment(ALL);
    setSortBy('price');
  };

  // Tarifas ya ajustadas al tipo de equipo, filtradas y ordenadas
  const lanes = lanesData
    .map((lane) => ({ ...lane, rate: Math.round(lane.rate * eq.mult) }))
    .filter((l) => {
      const matchOrigin =
        origin === ALL || l.origin.toLowerCase().includes(origin.trim().toLowerCase());
      const matchDestination =
        destination === ALL || l.destination.toLowerCase().includes(destination.trim().toLowerCase());
      return matchOrigin && matchDestination;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.rate - b.rate;
      if (sortBy === 'transit') return days(a.transitTime) - days(b.transitTime);
      return a.carrier.localeCompare(b.carrier);
    });

  const cheapestId = lanes.length > 1 ? [...lanes].sort((a, b) => a.rate - b.rate)[0].id : null;
  const fastestId = lanes.length > 1 ? [...lanes].sort((a, b) => days(a.transitTime) - days(b.transitTime))[0].id : null;
  const avgRate = lanes.length ? Math.round(lanes.reduce((s, l) => s + l.rate, 0) / lanes.length) : 0;

  const bookLane = (lane) => {
    addToCart(eq.containerId, lane.origin, shipDate, lane.destination);
    setBooked(lane);
    setSelectedLane(null);
  };

  const hasFilters = origin !== ALL || destination !== ALL || equipment !== ALL;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-[1728px] mx-auto px-6 lg:px-[54px] py-8 flex flex-col gap-8">
        {/* Encabezado y filtros */}
        <section className="bg-[#041627] text-white p-6 lg:p-8 rounded-[5px] flex flex-col gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Freight Rates & Routes</h1>
            <p className="text-gray-300 text-sm mt-1">
              Compare ocean freight rates and schedules across major shipping corridors. Results update as you change the filters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0b1d2d] p-4 rounded-[4px] border border-[#38485a] items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="rates-origin" className={labelClass}>Origin Port</label>
              <div className="relative">
                <select id="rates-origin" value={origin} onChange={(e) => changeOrigin(e.target.value)} className={selectClass}>
                  <option value={ALL}>All origins</option>
                  {originOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="rates-destination" className={labelClass}>Destination Port</label>
              <div className="relative">
                <select id="rates-destination" value={destination} onChange={(e) => changeDestination(e.target.value)} className={selectClass}>
                  <option value={ALL}>All destinations</option>
                  {destinationOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="rates-equipment" className={labelClass}>Equipment Type</label>
              <div className="relative">
                <select id="rates-equipment" value={equipment} onChange={(e) => changeEquipment(e.target.value)} className={selectClass}>
                  {Object.entries(EQUIPMENT).map(([id, e]) => (
                    <option key={id} value={id}>{e.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="rates-date" className={labelClass}>Ship Date</label>
              <input
                id="rates-date"
                type="date"
                value={shipDate}
                onChange={(e) => changeDate(e.target.value)}
                className="w-full bg-[#182838] text-white border border-[#38485a] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Aviso de reserva */}
        {booked && (
          <div role="status" className="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded px-4 py-3 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              {booked.carrier} ({booked.code}) added to your cart.
            </span>
            <span className="flex items-center gap-4">
              <Link to="/logistics" className="font-mono font-bold text-xs uppercase underline">Go to cart</Link>
              <button type="button" onClick={() => setBooked(null)} aria-label="Dismiss" className="cursor-pointer">
                <X className="size-4" />
              </button>
            </span>
          </div>
        )}

        {/* Resultados */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 border-b border-[#c4c6cd] pb-3">
            <div>
              <h2 className="text-xl font-bold text-[#041627]">Available Lanes</h2>
              <p className="text-xs text-[#74777d] font-mono mt-0.5">
                {lanes.length} {lanes.length === 1 ? 'result' : 'results'}
                {lanes.length > 0 && <> · average {money(avgRate)} USD</>} · {eq.label}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#74777d] uppercase">Sort by</span>
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSortBy(s.id)}
                  aria-pressed={sortBy === s.id}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase border transition cursor-pointer ${
                    sortBy === s.id
                      ? 'bg-[#041627] text-white border-[#041627]'
                      : 'bg-white text-[#44474c] border-[#c4c6cd] hover:border-[#041627]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold uppercase text-[#44474c] hover:text-[#041627] cursor-pointer"
                >
                  <RotateCcw className="size-3" /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {lanes.length === 0 ? (
              <div className="bg-white p-8 rounded border border-[#c4c6cd] text-center font-mono text-sm text-gray-500 flex flex-col items-center gap-3">
                No shipping routes available matching your search criteria.
                <button type="button" onClick={resetFilters} className="underline font-bold text-[#041627] cursor-pointer">
                  Clear filters
                </button>
              </div>
            ) : (
              lanes.map((lane) => (
                <div
                  key={lane.id}
                  className="bg-white border border-[#c4c6cd] rounded-[5px] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:border-[#041627] transition cursor-pointer"
                  onClick={() => setSelectedLane(lane)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-lg text-[#041627]">{lane.carrier}</span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded font-medium ${
                          lane.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lane.status}
                      </span>
                      {lane.id === cheapestId && (
                        <span className="text-[10px] font-mono font-bold bg-brand-orange text-[#181c1e] px-2 py-0.5 rounded uppercase">Cheapest</span>
                      )}
                      {lane.id === fastestId && (
                        <span className="text-[10px] font-mono font-bold bg-[#041627] text-white px-2 py-0.5 rounded uppercase">Fastest</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#44474c] font-mono">
                      <span className="flex items-center gap-1">
                        <Route className="size-4 text-[#74777d]" />
                        {lane.code}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-4 text-[#74777d]" />
                        {lane.transitTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4 text-[#74777d]" />
                        {lane.frequency}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#74777d]">
                      Est. arrival: <strong className="text-[#041627]">{arrivalDate(shipDate, lane.transitTime)}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#ebeef0] pt-3 md:pt-0">
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#74777d] uppercase block">Base Rate ({eq.label})</span>
                      <span className="text-xl font-mono font-bold text-[#041627]">{money(lane.rate)} USD</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        bookLane(lane);
                      }}
                      className="bg-brand-orange hover:brightness-95 text-[#181c1e] font-mono font-bold text-xs px-4 py-2.5 rounded transition uppercase cursor-pointer"
                    >
                      Book Lane
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Desglose de tarifa de la ruta seleccionada */}
        {selectedLane && (
          <section className="flex flex-col gap-3 max-w-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold uppercase text-[#44474c]">
                {selectedLane.carrier} · {selectedLane.code}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedLane(null)}
                className="text-xs font-mono font-bold uppercase text-[#44474c] hover:text-[#041627] cursor-pointer"
              >
                Close
              </button>
            </div>
            <RateBreakdown items={buildBreakdown(selectedLane.rate)} total={selectedLane.rate.toLocaleString('en-US')} />
            <button
              type="button"
              onClick={() => bookLane(selectedLane)}
              className="bg-brand-orange hover:brightness-95 text-[#181c1e] font-mono font-bold text-xs px-4 py-2.5 rounded transition uppercase cursor-pointer"
            >
              Book this lane
            </button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}