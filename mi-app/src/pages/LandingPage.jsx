import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Filter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Footer from '../components/Footer';

// Factores de ajuste de flete/precio según origen
const PORT_FACTORS = {
  shanghai: 1.0,
  cnsha: 1.0,
  rotterdam: 1.2,
  nlrtm: 1.2,
  'los angeles': 1.15,
  uslax: 1.15,
  singapore: 1.25,
  sgsin: 1.25,
  hamburg: 1.18,
  deham: 1.18,
};

export default function LandingPage() {
  const { containers = [], searchParams = {}, updateSearchParams, addToCart } = useApp();

  // Estados locales de los campos
  const [originInput, setOriginInput] = useState(searchParams.origin || 'Shanghai (CNSHA)');
  const [destinationInput, setDestinationInput] = useState(searchParams.destination || 'Los Angeles (USLAX)');
  const [typeSelect, setTypeSelect] = useState(searchParams.containerType || 'all');
  const [dateInput, setDateInput] = useState(searchParams.shipDate || new Date().toISOString().split('T')[0]);

  // Filtros aplicados al presionar SEARCH FLEET
  const [appliedFilters, setAppliedFilters] = useState({
    origin: searchParams.origin || 'Shanghai (CNSHA)',
    destination: searchParams.destination || 'Los Angeles (USLAX)',
    containerType: searchParams.containerType || 'all',
    shipDate: searchParams.shipDate || new Date().toISOString().split('T')[0],
  });

  // Sincroniza automáticamente si searchParams cambia desde otra página (Rates, Logistics, etc.)
  useEffect(() => {
    setOriginInput(searchParams.origin || 'Shanghai (CNSHA)');
    setDestinationInput(searchParams.destination || 'Los Angeles (USLAX)');
    setTypeSelect(searchParams.containerType || 'all');
    setDateInput(searchParams.shipDate || new Date().toISOString().split('T')[0]);

    setAppliedFilters({
      origin: searchParams.origin || 'Shanghai (CNSHA)',
      destination: searchParams.destination || 'Los Angeles (USLAX)',
      containerType: searchParams.containerType || 'all',
      shipDate: searchParams.shipDate || new Date().toISOString().split('T')[0],
    });
  }, [searchParams.origin, searchParams.destination, searchParams.containerType, searchParams.shipDate]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const newFilters = {
      origin: originInput,
      destination: destinationInput,
      containerType: typeSelect,
      shipDate: dateInput,
    };
    setAppliedFilters(newFilters);
    if (typeof updateSearchParams === 'function') {
      updateSearchParams(newFilters);
    }
  };

  // Filtrado de equipos
  const filteredContainers = containers.filter((item) => {
    const filterType = appliedFilters.containerType;
    if (filterType === 'all') return true;

    const id = (item.id || '').toLowerCase();
    const title = (item.title || '').toLowerCase();

    if (filterType === '20ft') return id.includes('20') || title.includes('20');
    if (filterType === '40hc') return id.includes('40') || title.includes('40');
    if (filterType === 'reefer') return id.includes('reefer') || title.includes('refrigerated');

    return true;
  });

  // Factor de precio dinámico según puerto
  const getPortFactor = (originStr) => {
    const cleanStr = (originStr || '').toLowerCase();
    for (const [key, factor] of Object.entries(PORT_FACTORS)) {
      if (cleanStr.includes(key)) return factor;
    }
    return 1.1;
  };

  const currentFactor = getPortFactor(appliedFilters.origin);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      {/* Sección Banner Principal */}
      <section className="bg-[#041627] text-white pt-14 pb-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3 tracking-tight">
            Find Containers in Any Port
          </h1>
          <p className="text-slate-300 text-sm lg:text-base max-w-2xl mx-auto mb-10">
            Global procurement simplified. Source, track, and manage industrial-grade shipping containers across our worldwide network.
          </p>

          {/* Tarjeta de Búsqueda Estilo Figma */}
          <div className="bg-white text-slate-900 border border-slate-200/80 rounded-lg p-6 shadow-xl text-left">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end"
            >
              {/* 1. Origin Port */}
              <div className="flex flex-col">
                <label className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
                  Origin Port
                </label>
                <div className="relative w-full">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <input
                    type="text"
                    value={originInput}
                    onChange={(e) => setOriginInput(e.target.value)}
                    placeholder="e.g. Shanghai (CNSHA)"
                    className="w-full h-12 bg-[#f8fafc] border border-slate-300 rounded-[4px] pl-10 pr-3.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* 2. Destination Port */}
              <div className="flex flex-col">
                <label className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
                  Destination Port
                </label>
                <div className="relative w-full">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="e.g. Los Angeles (USLAX)"
                    className="w-full h-12 bg-[#f8fafc] border border-slate-300 rounded-[4px] pl-10 pr-3.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* 3. Container Type */}
              <div className="flex flex-col">
                <label className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
                  Equipment Type
                </label>
                <div className="relative w-full">
                  <Filter className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <select
                    value={typeSelect}
                    onChange={(e) => setTypeSelect(e.target.value)}
                    className="appearance-none w-full h-12 bg-[#f8fafc] border border-slate-300 rounded-[4px] pl-10 pr-10 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer transition"
                  >
                    <option value="all">All Equipment Types</option>
                    <option value="20ft">20' Standard (SD)</option>
                    <option value="40hc">40' High Cube (HC)</option>
                    <option value="reefer">40' Refrigerated (Reefer)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                </div>
              </div>

              {/* 4. Shipment Date */}
              <div className="flex flex-col">
                <label className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
                  Shipment Date
                </label>
                <div className="relative w-full">
                  <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full h-12 bg-[#f8fafc] border border-slate-300 rounded-[4px] pl-10 pr-3.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* 5. Botón Search Fleet */}
              <div>
                <button
                  type="submit"
                  className="w-full h-12 bg-[#f5a623] hover:bg-[#e0951a] active:scale-[0.99] text-[#041627] font-mono font-bold text-xs uppercase tracking-wider rounded-[4px] flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Search className="w-4 h-4 text-[#041627]" />
                  <span>SEARCH FLEET</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Catálogo de Equipos */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Available Equipment</h2>
            <p className="text-xs font-mono text-slate-500 mt-1">
              Route: <span className="font-bold text-amber-600">{appliedFilters.origin}</span> →{' '}
              <span className="font-bold text-amber-600">{appliedFilters.destination}</span> | Date:{' '}
              <span className="font-bold text-slate-700">{appliedFilters.shipDate}</span>
            </p>
          </div>
          <span className="text-sm font-mono text-slate-500 font-medium">
            {filteredContainers.length} Models Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredContainers.map((item) => {
            const basePrice = item.price || item.unitCost || 2100;
            const calculatedPrice = Math.round(basePrice * currentFactor);

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.description}</p>
                    <div className="flex items-baseline justify-between">
                      <div className="font-mono font-bold text-2xl text-amber-600">
                        ${calculatedPrice.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
                      </div>
                      {currentFactor !== 1 && (
                        <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                          Port Adjusted
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
                  <Link
                    to={`/containers/${item.id}`}
                    className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold py-2.5 rounded transition flex items-center justify-center"
                  >
                    VIEW DETAILS
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      addToCart(item.id, appliedFilters.origin, appliedFilters.shipDate, appliedFilters.destination)
                    }
                    className="bg-[#f5a623] hover:bg-[#e0951a] text-slate-900 text-xs font-mono font-bold px-4 py-2.5 rounded transition"
                  >
                    ADD TO CART
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}