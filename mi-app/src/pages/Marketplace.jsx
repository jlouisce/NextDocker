import React from 'react';
import EquipmentCard from '../components/EquipmentCard';
import Footer from '../components/Footer';

export default function Marketplace() {
  const containers = [
    {
      id: 1,
      title: '20ft Standard',
      description: 'The industry workhorse. Ideal for heavy goods and dry cargo across standard shipping lanes.',
      capacity: '33.2 CBM',
      maxWeight: '28,200 KG',
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: '40ft High Cube',
      description: 'Maximum volume efficiency. Designed for lighter, voluminous cargo demanding extra headspace.',
      capacity: '76.4 CBM',
      maxWeight: '28,600 KG',
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Refrigerated (Reefer)',
      description: 'Precision climate control. Engineered for perishable goods requiring strict temperature adherence.',
      capacity: 'Temp: -30°C to +30°C',
      maxWeight: 'Power: 380/460V AC',
      status: 'Limited',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Hero Header & Search */}
      <section className="relative bg-slate-900 text-white py-16 px-6 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            Find Containers in Any Port
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8">
            Global procurement simplified. Source, track, and manage industrial-grade shipping containers across our worldwide network with structural precision.
          </p>

          {/* Formulario de búsqueda */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto text-left">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 pl-1">Origin Port</label>
              <input 
                type="text" 
                placeholder="e.g. Shanghai, Rotterdam, Los Angeles" 
                className="w-full px-3 py-2 text-xs rounded bg-white text-slate-900 border-none focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 pl-1">Container Type</label>
              <select className="w-full px-3 py-2 text-xs rounded bg-white text-slate-900 border-none focus:outline-none">
                <option value="">ALL Types</option>
                <option value="20ft">20ft Standard</option>
                <option value="40ft">40ft High Cube</option>
                <option value="reefer">Refrigerated (Reefer)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full sm:w-auto px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-xs rounded transition-colors h-[34px]">
                🔍 Search Fleet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Equipamiento Disponible */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Available Equipment</h2>
          <p className="text-xs text-slate-500 mt-1">Ready for immediate deployment across key global hubs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {containers.map((item) => (
            <EquipmentCard 
              key={item.id}
              title={item.title}
              description={item.description}
              capacity={item.capacity}
              maxWeight={item.maxWeight}
              status={item.status}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </section>

      {/* Beneficios Logísticos */}
      <section className="bg-slate-100 border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">Smart Logistics Optimization</h2>
            <p className="text-xs text-slate-500 mt-1">Data-driven procurement for the modern supply chain.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-amber-500 text-xl mb-2">⚡</div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Dynamic Routing & Sourcing</h3>
              <p className="text-xs text-slate-500">Our algorithm identifies the most cost-effective container positioning based on real-time port congestion.</p>
            </div>
            <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-sm">
              <div className="text-emerald-400 text-xl mb-2">🛡️</div>
              <h3 className="font-bold text-sm mb-1">Grade-A Certification</h3>
              <p className="text-xs text-slate-400">Every unit undergoes strict structural integrity testing before listing.</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-amber-500 text-xl mb-2">⚡</div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Instant Booking</h3>
              <p className="text-xs text-slate-500">Bypass brokers. Secure assets instantly via secure API.</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-amber-500 text-xl mb-2">📈</div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Market Rates</h3>
              <p className="text-xs text-slate-500">Transparent pricing historically pegged to global shipping indices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}