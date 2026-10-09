import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ContainerModal from '../components/ContainerModal';

export default function LandingPage() {
  const { containers = [] } = useApp();

  const [selectedType, setSelectedType] = useState('ALL');
  const [searchPort, setSearchPort] = useState('');
  const [selectedContainer, setSelectedContainer] = useState(null);

  const filteredContainers = (containers || []).filter((item) => {
    const matchesType = selectedType === 'ALL' || item.type?.toLowerCase().includes(selectedType.toLowerCase());
    const matchesPort = !searchPort || item.port?.toLowerCase().includes(searchPort.toLowerCase());
    return matchesType && matchesPort;
  });

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* HERO SECTION */}
      <section className="bg-slate-950 text-white py-16 px-6 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Find Containers in Any Port
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Global procurement simplified. Source, track, and manage industrial-grade shipping containers across our worldwide network with structural precision.
          </p>

          {/* FILTROS DE BÚSQUEDA */}
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-800 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-900 text-xs mt-8">
            <div className="flex flex-col text-left">
              <label className="font-bold text-slate-500 mb-1">Origin Port</label>
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50">
                <MapPin className="w-4 h-4 text-amber-500" />
                <input
                  type="text"
                  placeholder="e.g. Shanghai, Rotterdam..."
                  value={searchPort}
                  onChange={(e) => setSearchPort(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <label className="font-bold text-slate-500 mb-1">Container Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none text-slate-800 h-full"
              >
                <option value="ALL">All Types</option>
                <option value="20ft Standard">20ft Standard</option>
                <option value="40ft High Cube">40ft High Cube</option>
                <option value="Refrigerated">Refrigerated (Reefer)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Search Fleet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPOS DISPONIBLES */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Available Equipment</h2>
          <p className="text-xs text-slate-500">Ready for immediate deployment across key global hubs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredContainers.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-slate-950/80 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-slate-800">
                    • {item.status}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {item.port}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-600">
                    <div><span className="text-slate-400">Cap:</span> <strong className="text-slate-800">{item.specs?.capacity}</strong></div>
                    <div><span className="text-slate-400">Max:</span> <strong className="text-slate-800">{item.specs?.maxPayload}</strong></div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedContainer(item)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-2.5 rounded-lg text-xs transition-colors"
                >
                  View Inventory
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {selectedContainer && (
        <ContainerModal 
          container={selectedContainer} 
          onClose={() => setSelectedContainer(null)} 
        />
      )}
    </div>
  );
}