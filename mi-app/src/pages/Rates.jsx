import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  Container,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { containersData } from '../data/mockData';
import Footer from '../components/Footer';

const POPULAR_LOCATIONS = [
  'Cali (COCLO)',
  'Medellín (COMDE)',
  'Buenaventura (COBUN)',
  'Cartagena (COCTG)',
  'Bogotá (COBOG)',
  'Shanghai (CNSHA)',
  'Los Angeles (USLAX)',
  'Rotterdam (NLRTM)',
  'Singapore (SGSIN)',
  'Hamburg (DEHAM)',
  'Ningbo (CNNGB)',
  'New York / Newark (USNYC)',
  'Busan (KRPUS)',
  'Santos (BRSSZ)',
  'Callao (PECLL)',
];

const EQUIPMENT_OPTIONS = [
  { id: '20ft-standard', label: "20' Standard Steel", multiplier: 1.0, baseUnitCost: 2100 },
  { id: '40ft-standard', label: "40' Standard Dry", multiplier: 1.45, baseUnitCost: 3450 },
  { id: '40ft-highcube', label: "40' High Cube", multiplier: 1.62, baseUnitCost: 3900 },
  { id: '40ft-reefer', label: "40' Refrigerated (Reefer)", multiplier: 2.15, baseUnitCost: 6200 },
];

const CARRIERS = [
  {
    code: 'MAEU',
    name: 'Maersk Line',
    service: 'Express Direct Corridor',
    rateFactor: 1.14,
    transitOffset: -2,
    reliability: '98.4%',
    sailingFreq: 'Tue / Fri',
    badge: 'FASTEST',
  },
  {
    code: 'MSCU',
    name: 'MSC Mediterranean',
    service: 'Global Liner Standard',
    rateFactor: 0.94,
    transitOffset: 1,
    reliability: '95.1%',
    sailingFreq: 'Mon / Thu',
    badge: 'BEST VALUE',
  },
  {
    code: 'CMDU',
    name: 'CMA CGM',
    service: 'Priority Intermodal Hub',
    rateFactor: 1.03,
    transitOffset: 0,
    reliability: '96.8%',
    sailingFreq: 'Wed / Sat',
    badge: 'POPULAR',
  },
  {
    code: 'HLCU',
    name: 'Hapag-Lloyd',
    service: 'Atlantic & Pacific Shuttle',
    rateFactor: 1.08,
    transitOffset: -1,
    reliability: '97.2%',
    sailingFreq: 'Tue / Sat',
    badge: null,
  },
  {
    code: 'COSU',
    name: 'COSCO Shipping',
    service: 'Economy Feeder & Trunk',
    rateFactor: 0.89,
    transitOffset: 3,
    reliability: '93.7%',
    sailingFreq: 'Sun / Wed',
    badge: 'LOWEST FARE',
  },
];

function computeRouteMetrics(origin, destination) {
  const cleanOrigin = origin.trim().toLowerCase();
  const cleanDest = destination.trim().toLowerCase();

  const colombianCities = [
    'cali',
    'medellin',
    'medellín',
    'bogota',
    'bogotá',
    'buenaventura',
    'cartagena',
    'barranquilla',
  ];
  const originIsCol = colombianCities.some((c) => cleanOrigin.includes(c));
  const destIsCol = colombianCities.some((c) => cleanDest.includes(c));

  const pairKey = `${cleanOrigin}->${cleanDest}`;
  let hash = 0;
  for (let i = 0; i < pairKey.length; i += 1) {
    hash = (hash * 31 + pairKey.charCodeAt(i)) % 10000;
  }

  if (originIsCol && destIsCol) {
    const distanceKm = 320 + (hash % 680);
    const baseFreight = 480 + Math.round(distanceKm * 0.65);
    const baseTransitDays = Math.max(2, Math.round(distanceKm / 260) + 1);
    return { distanceKm, baseFreight, baseTransitDays, corridorType: 'Domestic Multimodal Corridor' };
  }

  const distanceKm = 4200 + (hash % 11500);
  const baseFreight = 1450 + Math.round(distanceKm * 0.16);
  const baseTransitDays = Math.max(8, Math.round(distanceKm / 580));
  return { distanceKm, baseFreight, baseTransitDays, corridorType: 'International Ocean Freight' };
}

export default function Rates() {
  const navigate = useNavigate();
  const { searchParams, updateSearchParams, addToCart } = useApp();

  const [originInput, setOriginInput] = useState(searchParams?.origin || 'Cali (COCLO)');
  const [destinationInput, setDestinationInput] = useState(
    searchParams?.destination || 'Medellín (COMDE)'
  );
  const [equipmentInput, setEquipmentInput] = useState(
    searchParams?.containerType && searchParams.containerType !== 'all'
      ? searchParams.containerType
      : '20ft-standard'
  );
  const [shipDateInput, setShipDateInput] = useState(
    searchParams?.shipDate || new Date().toISOString().split('T')[0]
  );

  const [activeQuery, setActiveQuery] = useState({
    origin: searchParams?.origin || 'Cali (COCLO)',
    destination: searchParams?.destination || 'Medellín (COMDE)',
    equipmentId:
      searchParams?.containerType && searchParams.containerType !== 'all'
        ? searchParams.containerType
        : '20ft-standard',
    shipDate: searchParams?.shipDate || new Date().toISOString().split('T')[0],
  });

  const [sortBy, setSortBy] = useState('CHEAPEST');
  const [formError, setFormError] = useState('');
  const [addedCarrier, setAddedCarrier] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanOrigin = originInput.trim();
    const cleanDest = destinationInput.trim();

    if (!cleanOrigin || !cleanDest) {
      setFormError('Please enter both an origin location and a destination location.');
      return;
    }

    if (cleanOrigin.toLowerCase() === cleanDest.toLowerCase()) {
      setFormError('Origin and destination must be different locations.');
      return;
    }

    const nextQuery = {
      origin: cleanOrigin,
      destination: cleanDest,
      equipmentId: equipmentInput,
      shipDate: shipDateInput || new Date().toISOString().split('T')[0],
    };

    setActiveQuery(nextQuery);
    updateSearchParams({
      origin: nextQuery.origin,
      destination: nextQuery.destination,
      containerType: nextQuery.equipmentId,
      shipDate: nextQuery.shipDate,
    });
  };

  const handleReset = () => {
    const defaultOrigin = 'Shanghai (CNSHA)';
    const defaultDest = 'Los Angeles (USLAX)';
    const defaultEquip = '20ft-standard';
    const today = new Date().toISOString().split('T')[0];

    setOriginInput(defaultOrigin);
    setDestinationInput(defaultDest);
    setEquipmentInput(defaultEquip);
    setShipDateInput(today);
    setFormError('');
    setSortBy('CHEAPEST');

    setActiveQuery({
      origin: defaultOrigin,
      destination: defaultDest,
      equipmentId: defaultEquip,
      shipDate: today,
    });
  };

  const quotes = useMemo(() => {
    const selectedEquip =
      EQUIPMENT_OPTIONS.find((eq) => eq.id === activeQuery.equipmentId) || EQUIPMENT_OPTIONS[0];
    const metrics = computeRouteMetrics(activeQuery.origin, activeQuery.destination);

    const list = CARRIERS.map((carrier) => {
      const freightRate = Math.round(
        metrics.baseFreight * selectedEquip.multiplier * carrier.rateFactor
      );
      const portHandlingFee = Math.round(freightRate * 0.12);
      const totalQuote = freightRate + portHandlingFee;
      const transitDays = Math.max(1, metrics.baseTransitDays + carrier.transitOffset);

      return {
        ...carrier,
        equipmentId: selectedEquip.id,
        equipmentLabel: selectedEquip.label,
        baseUnitCost: selectedEquip.baseUnitCost,
        origin: activeQuery.origin,
        destination: activeQuery.destination,
        shipDate: activeQuery.shipDate,
        distanceKm: metrics.distanceKm,
        corridorType: metrics.corridorType,
        freightRate,
        portHandlingFee,
        totalQuote,
        transitDays,
      };
    });

    if (sortBy === 'CHEAPEST') {
      return [...list].sort((a, b) => a.totalQuote - b.totalQuote);
    }
    if (sortBy === 'FASTEST') {
      return [...list].sort((a, b) => a.transitDays - b.transitDays);
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [activeQuery, sortBy]);

  const handleBookQuote = (quote) => {
    const matchedContainer =
      containersData.find((c) => c.id === quote.equipmentId) || containersData[0];

    addToCart({
      containerId: matchedContainer?.id || quote.equipmentId,
      origin: quote.origin,
      destination: quote.destination,
      shipDate: quote.shipDate,
    });

    setAddedCarrier(quote.code);
    setTimeout(() => {
      navigate('/logistics');
    }, 350);
  };

  const selectedEquipmentObj =
    EQUIPMENT_OPTIONS.find((eq) => eq.id === activeQuery.equipmentId) || EQUIPMENT_OPTIONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-8">
        {/* Panel Superior de Cotización */}
        <section className="bg-[#041627] text-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-800">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-orange mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Multi-Carrier Instant Freight Quoter
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Freight Rates &amp; Routes
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1.5">
              Enter any origin and destination to compare live container shipping rates across global carriers.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#0b2239] border border-slate-700/80 rounded-lg p-4 sm:p-5 flex flex-col gap-4"
          >
            {formError && (
              <div className="bg-red-950/80 border border-red-500/60 text-red-200 text-xs px-3.5 py-2.5 rounded">
                {formError}
              </div>
            )}

            <datalist id="nextdocker-locations">
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Origen */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Origin Port / City *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    list="nextdocker-locations"
                    value={originInput}
                    onChange={(e) => setOriginInput(e.target.value)}
                    placeholder="e.g. Cali, Shanghai..."
                    required
                    className="w-full h-[42px] bg-[#132c46] border border-slate-600 focus:border-brand-orange rounded-md pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Destino */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Destination Port / City *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-brand-orange absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    list="nextdocker-locations"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="e.g. Medellín, Los Angeles..."
                    required
                    className="w-full h-[42px] bg-[#132c46] border border-slate-600 focus:border-brand-orange rounded-md pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tipo de Contenedor */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Equipment Type
                </label>
                <div className="relative">
                  <Container className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    className="w-full h-[42px] appearance-none bg-[#132c46] border border-slate-600 focus:border-brand-orange rounded-md pl-9 pr-8 text-sm text-white focus:outline-none cursor-pointer"
                  >
                    {EQUIPMENT_OPTIONS.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* Fecha de envío */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ship Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={shipDateInput}
                    onChange={(e) => setShipDateInput(e.target.value)}
                    className="w-full h-[42px] bg-[#132c46] border border-slate-600 focus:border-brand-orange rounded-md pl-9 pr-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Botón Principal de Búsqueda */}
            <div className="flex justify-end pt-3 border-t border-slate-700/70">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:brightness-95 text-[#181c1e] font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md transition cursor-pointer shadow-sm"
              >
                <Search className="w-4 h-4" />
                Search Quotes
              </button>
            </div>
          </form>
        </section>

        {/* Encabezado de Resultados y Ordenamiento */}
        <section className="flex flex-col gap-5">
          <div className="border-b border-[#c4c6cd] pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-[#041627]">Available Carrier Quotes</h2>
                <span className="text-xs font-mono font-bold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded border border-amber-300">
                  {quotes[0]?.corridorType}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-600 mt-1 flex flex-wrap items-center gap-1.5">
                <strong className="text-[#041627]">{activeQuery.origin}</strong>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 inline" />
                <strong className="text-[#041627]">{activeQuery.destination}</strong>
                <span>• {quotes.length} carriers</span>
                <span>• {selectedEquipmentObj.label}</span>
                <span>• ~{quotes[0]?.distanceKm.toLocaleString('en-US')} km</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-500 mr-1">
                Sort By
              </span>
              {['CHEAPEST', 'FASTEST', 'CARRIER A-Z'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSortBy(option)}
                  className={`text-xs font-mono font-bold uppercase px-3 py-2 rounded border transition cursor-pointer ${
                    sortBy === option
                      ? 'bg-[#041627] text-white border-[#041627]'
                      : 'bg-white text-slate-700 border-[#c4c6cd] hover:bg-slate-100'
                  }`}
                >
                  {option}
                </button>
              ))}

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-600 hover:text-[#041627] px-3 py-2 rounded hover:bg-slate-200/70 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Tarjetas Comparativas por Naviera */}
          <div className="flex flex-col gap-4">
            {quotes.map((quote) => {
              const isSelected = addedCarrier === quote.code;

              return (
                <article
                  key={quote.code}
                  className="bg-white border border-[#c4c6cd] hover:border-[#041627] rounded-lg p-5 sm:p-6 shadow-sm transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Info de la Naviera */}
                  <div className="flex flex-col gap-2 lg:w-1/3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="w-9 h-9 rounded-md bg-[#041627] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {quote.code}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-[#041627]">{quote.name}</h3>
                          {quote.badge && (
                            <span
                              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                quote.badge === 'BEST VALUE' || quote.badge === 'LOWEST FARE'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {quote.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {quote.service}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Transit: <strong className="text-[#041627]">{quote.transitDays} days</strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Ship className="w-3.5 h-3.5 text-slate-400" />
                        Sailings: <strong className="text-[#041627]">{quote.sailingFreq}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {quote.reliability} on-time
                      </span>
                    </div>
                  </div>

                  {/* Ruta Visual */}
                  <div className="flex items-center justify-between sm:justify-center gap-3 bg-[#f7fafc] border border-slate-200 rounded-md px-4 py-3 lg:w-1/3">
                    <div className="text-left">
                      <span className="block text-[10px] font-mono uppercase text-slate-400">Origin</span>
                      <span className="text-sm font-bold text-[#041627]">{quote.origin}</span>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <span className="text-[10px] font-mono text-slate-500">{quote.transitDays}d</span>
                      <div className="w-16 sm:w-24 h-[2px] bg-slate-300 relative my-1">
                        <span className="w-2 h-2 rounded-full bg-brand-orange absolute -top-[3px] right-0" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{quote.shipDate}</span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] font-mono uppercase text-slate-400">Destination</span>
                      <span className="text-sm font-bold text-[#041627]">{quote.destination}</span>
                    </div>
                  </div>

                  {/* Desglose de Cotización y Botón de Selección */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 lg:w-1/4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
                    <div className="lg:text-right">
                      <span className="block text-[11px] font-mono uppercase text-slate-500">
                        Freight + Terminal Fees
                      </span>
                      <p className="text-2xl font-bold font-mono text-[#041627]">
                        ${quote.totalQuote.toLocaleString('en-US')}{' '}
                        <span className="text-xs font-normal text-slate-500">USD</span>
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">
                        Freight ${quote.freightRate.toLocaleString('en-US')} + Port ${quote.portHandlingFee.toLocaleString('en-US')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookQuote(quote)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:brightness-95 text-[#181c1e] font-mono font-bold text-xs uppercase px-4 py-2.5 rounded transition cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isSelected ? 'Added to Cart...' : 'Select & Book'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}