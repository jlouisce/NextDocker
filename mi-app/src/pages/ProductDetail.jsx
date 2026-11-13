import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { cartCatalog, containersData } from '../data/mockData';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchParams = {}, updateSearchParams, addToCart } = useApp() || {};

  // Obtención del contenedor actual
  const container =
    cartCatalog[id] ||
    containersData?.find((c) => c.id === id) || {
      id: id || '20ft-standard',
      title: "20' Standard Steel Container",
      price: 2100,
      unitCost: 2100,
      image: '/assets/figma/cart-20ft.jpg',
      sku: 'STD-20-BLU-441',
      payload: '21,770 kg',
    };

  // Inicializar origen y destino desde el contexto global (searchParams), priorizando cambios locales
  const [userOrigin, setSelectedOrigin] = useState(null);
  const [userDestination, setSelectedDestination] = useState(null);

  const selectedOrigin = userOrigin ?? (searchParams.origin || 'Shanghai (CNSHA)');
  const selectedDestination = userDestination ?? (searchParams.destination || 'Los Angeles (USLAX)');

  // Lista de orígenes base
  const baseOrigins = container.origins || [
    { port: 'Shanghai', code: 'CNSHA', freight: 1200 },
    { port: 'Rotterdam', code: 'NLRTM', freight: 1400 },
    { port: 'Los Angeles', code: 'USLAX', freight: 1300 },
  ];

  // Comprobar si el origen ingresado existe en los base; si no, incluirlo dinámicamente
  const hasMatch = baseOrigins.some(
    (o) =>
      o.code.toLowerCase() === selectedOrigin.toLowerCase() ||
      o.port.toLowerCase().includes(selectedOrigin.toLowerCase())
  );

  const originsOptions = hasMatch
    ? baseOrigins
    : [
        {
          port: selectedOrigin.includes('(') ? selectedOrigin.split('(')[0].trim() : selectedOrigin,
          code: selectedOrigin.includes('(')
            ? selectedOrigin.split('(')[1]?.replace(')', '').trim()
            : selectedOrigin.toUpperCase(),
          freight: 1350,
        },
        ...baseOrigins,
      ];

  const handleOriginChange = (value) => {
    setSelectedOrigin(value);
    if (typeof updateSearchParams === 'function') {
      updateSearchParams({ origin: value });
    }
  };

  const handleDestinationChange = (value) => {
    setSelectedDestination(value);
    if (typeof updateSearchParams === 'function') {
      updateSearchParams({ destination: value });
    }
  };

  const handleAddToCart = () => {
    if (typeof addToCart === 'function') {
      addToCart(container.id, selectedOrigin, searchParams.shipDate, selectedDestination);
    }
    navigate('/logistics');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <div className="mb-4">
          <Link to="/marketplace" className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800">
            &larr; BACK TO MARKETPLACE
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Vista previa */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-200 rounded-lg overflow-hidden h-96 border border-slate-300">
              <img src={container.image} alt={container.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Panel Configurador */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase bg-amber-100 text-amber-800 px-2 py-1 rounded">
                Available
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mt-2">{container.title}</h1>
              <p className="text-2xl font-bold font-mono text-amber-600 mt-2">
                ${(container.price || container.unitCost || 2100).toLocaleString()}{' '}
                <span className="text-xs text-slate-500">USD / unit</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold font-mono py-3.5 px-4 rounded transition uppercase tracking-wider"
            >
              Add to Logistics Cart
            </button>

            {/* Logistics Optimizer */}
            <div className="bg-[#0b1d2d] text-white p-6 rounded-lg border border-slate-700 shadow-md">
              <h3 className="font-bold text-base mb-1 flex items-center gap-2">
                <span className="text-amber-500">⚙</span> Logistics Optimizer
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Calculate real-time freight rates and estimated transit schedules.
              </p>

              <div className="space-y-4">
                {/* Selector con el Origen Preservado */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Origin Port
                  </label>
                  <select
                    value={selectedOrigin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    className="w-full bg-[#041627] border border-slate-600 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer font-mono"
                  >
                    {originsOptions.map((o, idx) => {
                      const val = o.code ? `${o.port} (${o.code})` : o.port;
                      return (
                        <option key={idx} value={val}>
                          {o.port} {o.code ? `(${o.code})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Destination Port
                  </label>
                  <input
                    type="text"
                    value={selectedDestination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    placeholder="e.g. Los Angeles (USLAX)"
                    className="w-full bg-[#041627] border border-slate-600 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}