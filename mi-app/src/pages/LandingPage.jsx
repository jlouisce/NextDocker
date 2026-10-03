import React, { useState } from 'react';
import Footer from '../components/Footer';
import ContainerModal from '../components/ContainerModal';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { containers } = useApp();
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchPort, setSearchPort] = useState('');
  const [selectedContainer, setSelectedContainer] = useState(null);

  const filteredContainers = containers.filter((item) => {
    const matchesType = selectedType === 'ALL' || item.title.toLowerCase().includes(selectedType.toLowerCase());
    return matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      
      {/* HERO SECTION */}
      <section className="relative bg-slate-950 text-white py-20 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80')` }}
        ></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Find Containers in Any Port
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto mb-10 leading-relaxed">
            Global procurement simplified. Source, track, and manage industrial-grade shipping containers across our worldwide network.
          </p>

          {/* BARRA DE BÚSQUEDA INTERACTIVA */}
          <div className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-2xl max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2 text-left border border-slate-200">
            <div className="md:col-span-5 p-2">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Origin Port</label>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span>📍</span>
                <input 
                  type="text" 
                  value={searchPort}
                  onChange={(e) => setSearchPort(e.target.value)}
                  placeholder="e.g. Shanghai, Rotterdam, Los Angeles" 
                  className="w-full bg-transparent focus:outline-none text-xs text-slate-900 font-semibold" 
                />
              </div>
            </div>

            <div className="md:col-span-4 p-2 border-t md:border-t-0 md:border-l border-slate-200">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Container type</label>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span>📦</span>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-xs text-slate-900 font-semibold cursor-pointer"
                >
                  <option value="ALL">ALL Types</option>
                  <option value="20ft">20ft Standard</option>
                  <option value="40ft">40ft High Cube</option>
                  <option value="Refrigerated">Refrigerated (Reefer)</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-3 flex items-center">
              <button 
                onClick={() => alert(`Searching fleet for port: ${searchPort || 'All Global Ports'}`)}
                className="w-full h-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>🔍</span> Search fleet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DINÁMICO */}
      <section className="max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Available Equipment</h2>
          <p className="text-xs text-slate-500 mt-1">Ready for immediate deployment across key global hubs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredContainers.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="relative h-44 bg-slate-200">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  item.statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  • {item.status}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{item.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100 mb-6">
                    <div>Cap: {item.cap}</div>
                    <div>Max: {item.maxWeight}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedContainer(item)}
                  className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-xs rounded transition-colors"
                >
                  View Inventory
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Smart Logistics Optimization</h2>
          <p className="text-xs text-slate-500 mt-1">Data-driven procurement for the modern supply chain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-4">📈</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Dynamic Routing & Sourcing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our algorithm identifies the most cost-effective container positioning based on real-time port congestion and freight lane demands.
            </p>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg">
            <div className="text-2xl mb-4 text-amber-400">🛡️</div>
            <h3 className="text-base font-bold text-white mb-2">Grade-A Certification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every unit undergoes strict structural integrity testing before listing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-4">⚡</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Instant Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bypass brokers. Secure assets instantly via secure API.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Market Rates</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent pricing historically pegged to global shipping indices.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <ContainerModal 
        container={selectedContainer} 
        onClose={() => setSelectedContainer(null)} 
      />
    </div>
  );
}