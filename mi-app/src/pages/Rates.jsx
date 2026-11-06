import { useState } from 'react';
import { Search, ChevronDown, Route, Clock, Calendar } from 'lucide-react';
import Footer from '../components/Footer';
import RateBreakdown from '../components/RateBreakdown';
import { useApp } from '../context/AppContext';
import { lanesData } from '../data/mockData';

export default function Rates() {
  const { origin, setOrigin, shipDate, setShipDate, addToCart } = useApp();

  // Estados de entrada del formulario
  const [searchOrigin, setSearchOrigin] = useState(origin || 'Shanghai (CNSHA)');
  const [searchEquipment, setSearchEquipment] = useState('40ft High Cube');
  const [searchDate, setSearchDate] = useState(shipDate || '2026-11-26');

  // Estado que actualiza los resultados en pantalla tras hacer clic en SEARCH RATES
  const [appliedFilters, setAppliedFilters] = useState({
    origin: origin || 'Shanghai (CNSHA)',
    equipment: '40ft High Cube',
    date: shipDate || '2026-11-26',
  });

  const [selectedLane, setSelectedLane] = useState(null);

  // Ejecución de la búsqueda al hacer clic o submit
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setOrigin(searchOrigin);
    setShipDate(searchDate);
    setAppliedFilters({
      origin: searchOrigin,
      equipment: searchEquipment,
      date: searchDate,
    });
  };

  const getContainerId = (equip) => {
    if (equip.includes('20ft')) return '20ft-standard';
    if (equip.includes('Reefer') || equip.includes('Refrigerated')) return 'reefer';
    return '40ft-hc';
  };

  const getRateMultiplier = (equip) => {
    if (equip.includes('20ft')) return 0.75;
    if (equip.includes('Reefer') || equip.includes('Refrigerated')) return 1.4;
    return 1.0;
  };

  const mult = getRateMultiplier(appliedFilters.equipment);

  // Extrae el código de 5 letras entre paréntesis (ej: "CNSHA", "NLRTM", "USLAX")
  const extractCode = (str) => {
    const match = str.match(/\(([A-Z]+)\)/);
    return match ? match[1] : str;
  };

  const filterCode = extractCode(appliedFilters.origin);

  // Filtrado flexible por nombre de puerto o código de ruta
  const filteredLanes = lanesData.filter((lane) => {
    if (!appliedFilters.origin) return true;
    return (
      lane.origin.toLowerCase().includes(appliedFilters.origin.toLowerCase()) ||
      lane.code.includes(filterCode)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-[1728px] mx-auto px-6 lg:px-[54px] py-8 flex flex-col gap-8">
        
        {/* Header & Search Form */}
        <section className="bg-[#041627] text-white p-6 lg:p-8 rounded-[5px] flex flex-col gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Freight Rates & Routes</h1>
            <p className="text-gray-300 text-sm mt-1">
              Compare ocean freight rates and schedules across major shipping corridors.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0b1d2d] p-4 rounded-[4px] border border-[#38485a] items-end"
          >
            {/* Origin Port */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Origin Port
              </label>
              <div className="relative">
                <select
                  value={searchOrigin}
                  onChange={(e) => setSearchOrigin(e.target.value)}
                  className="w-full bg-[#182838] text-white border border-[#38485a] rounded px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="Shanghai (CNSHA)">Shanghai (CNSHA)</option>
                  <option value="Rotterdam (NLRTM)">Rotterdam (NLRTM)</option>
                  <option value="Los Angeles (USLAX)">Los Angeles (USLAX)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>
            </div>

            {/* Equipment Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Equipment Type
              </label>
              <div className="relative">
                <select
                  value={searchEquipment}
                  onChange={(e) => setSearchEquipment(e.target.value)}
                  className="w-full bg-[#182838] text-white border border-[#38485a] rounded px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="All Equipment Types">All Equipment Types</option>
                  <option value="20ft Standard Steel">20' Standard Steel</option>
                  <option value="40ft High Cube">40' High Cube</option>
                  <option value="40ft Refrigerated">40' Refrigerated</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>
            </div>

            {/* Ship Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Ship Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-[#182838] text-white border border-[#38485a] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange cursor-pointer"
              />
            </div>

            {/* Botón Search Rates */}
            <button
              type="submit"
              onClick={handleSearch}
              className="w-full bg-brand-orange hover:brightness-95 text-[#181c1e] font-mono font-bold text-xs uppercase px-4 py-3 rounded transition flex items-center justify-center gap-2 cursor-pointer h-[42px]"
            >
              <Search className="size-4" />
              Search Rates
            </button>
          </form>
        </section>

        {/* Listado de Rutas (Available Lanes) */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#c4c6cd] pb-2">
            <div>
              <h2 className="text-xl font-bold text-[#041627]">Available Lanes</h2>
              <p className="text-xs text-[#74777d] font-mono mt-0.5">
                Routes for <span className="font-bold text-[#041627]">{appliedFilters.origin}</span> • {appliedFilters.equipment}
              </p>
            </div>
            <span className="text-sm font-mono text-[#74777d]">
              {filteredLanes.length} {filteredLanes.length === 1 ? 'Result Found' : 'Results Found'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredLanes.length === 0 ? (
              <div className="bg-white p-8 rounded border border-[#c4c6cd] text-center font-mono text-sm text-gray-500">
                No shipping routes available matching your search criteria.
              </div>
            ) : (
              filteredLanes.map((lane) => {
                const calculatedRate = Math.round(lane.rate * mult);

                return (
                  <div
                    key={lane.id}
                    className="bg-white border border-[#c4c6cd] rounded-[5px] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:border-[#041627] transition cursor-pointer"
                    onClick={() => setSelectedLane({ ...lane, rate: calculatedRate })}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-lg text-[#041627]">{lane.carrier}</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                          {lane.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-[#44474c] font-mono">
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
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#ebeef0] pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-xs font-mono text-[#74777d] uppercase block">
                          Base Rate ({appliedFilters.equipment})
                        </span>
                        <span className="text-xl font-mono font-bold text-[#041627]">
                          ${calculatedRate.toLocaleString()} USD
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const containerId = getContainerId(appliedFilters.equipment);
                          addToCart(containerId, appliedFilters.origin, appliedFilters.date);
                        }}
                        className="bg-brand-orange hover:brightness-95 text-[#181c1e] font-mono font-bold text-xs px-4 py-2.5 rounded transition uppercase"
                      >
                        Book Lane
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Desglose de Tarifas */}
        {selectedLane && (
          <RateBreakdown
            lane={selectedLane}
            onClose={() => setSelectedLane(null)}
            onBook={() => {
              const containerId = getContainerId(appliedFilters.equipment);
              addToCart(containerId, appliedFilters.origin, appliedFilters.date);
              setSelectedLane(null);
            }}
          />
        )}

      </main>
      <Footer />
    </div>
  );
}