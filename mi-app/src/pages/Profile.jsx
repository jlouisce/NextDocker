import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cartCatalog, containersData } from '../data/mockData';
import Footer from '../components/Footer';

const money = (val) => `$${(val || 0).toLocaleString('en-US')} USD`;

export default function Profile() {
  const { cart = [], reservations = [], removeFromCart, clearCart } = useApp() || {};

  // Formateador de origen robusto sin fallback a Shanghai si existe un string válido
  const getOriginLabel = (item) => {
    if (!item) return 'Origen no especificado';

    const rawOrigin = item.origin || item.selectedOrigin;
    if (typeof rawOrigin === 'string' && rawOrigin.trim() !== '') {
      return rawOrigin;
    }

    if (typeof rawOrigin === 'object' && rawOrigin !== null) {
      return rawOrigin.port ? `${rawOrigin.port} (${rawOrigin.code || ''})` : (rawOrigin.code || 'Origen no especificado');
    }

    return 'Origen no especificado';
  };

  // Formateador de destino robusto sincronizado con el carrito y las reservas
  const getDestinationLabel = (item) => {
    if (!item) return 'Destino no especificado';

    const rawDestination = item.destination || item.selectedDestination;
    if (typeof rawDestination === 'string' && rawDestination.trim() !== '') {
      return rawDestination;
    }

    if (typeof rawDestination === 'object' && rawDestination !== null) {
      return rawDestination.port
        ? `${rawDestination.port} (${rawDestination.code || ''})`
        : (rawDestination.code || 'Destino no especificado');
    }

    return 'Destino no especificado';
  };

  const getItemDetails = (item) => {
    const id = item.containerId || item.id;
    const cat = cartCatalog[id] || containersData?.find((c) => c.id === id) || {};
    return {
      title: item.title || cat.title || 'Contenedor Estándar',
      price: item.unitCost || cat.unitCost || item.price || cat.price || 2100,
      origin: getOriginLabel(item),
      destination: getDestinationLabel(item),
    };
  };

  // Invertir el historial para mostrar las órdenes más recientes primero
  const reversedReservations = [...reservations].reverse();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8">
        
        {/* Cabecera del Panel */}
        <div className="border-b border-[#c4c6cd] pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mi Perfil y Panel de Usuario</h1>
            <p className="text-slate-600 mt-1">
              Usuario activo: <span className="font-semibold text-slate-800">Invitado</span>
            </p>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => clearCart()}
              className="text-xs font-mono text-red-600 hover:underline border border-red-200 bg-red-50 px-3 py-1.5 rounded"
            >
              PURGAR CARRITO COMPLETAMENTE
            </button>
          )}
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Carrito en Curso */}
          <section className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h2 className="text-xl font-bold text-slate-800">
                Carrito en Curso ({cart.length})
              </h2>
              {cart.length > 0 && (
                <Link 
                  to="/logistics" 
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold font-mono px-3 py-1.5 rounded transition"
                >
                  PROCEDER AL CHECKOUT &rarr;
                </Link>
              )}
            </div>
            
            {cart.length === 0 ? (
              <p className="text-slate-500 italic py-4">No tienes contenedores en el carrito logístico.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.map((item, idx) => {
                  const details = getItemDetails(item);
                  const itemId = item.cartItemId || item.containerId || item.id || idx;

                  return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{details.title}</h3>
                        <p className="text-sm text-slate-600 mt-0.5">
                          Origen: <strong className="font-semibold">{details.origin}</strong>
                        </p>
                        <p className="text-sm text-slate-600">
                          Destino: <strong className="font-semibold">{details.destination}</strong>
                        </p>
                        <p className="text-amber-600 font-bold font-mono text-base mt-1">{money(details.price)}</p>
                      </div>

                      {/* Eliminación manual de elementos de la lista */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(itemId)}
                        title="Eliminar del carrito"
                        className="p-2 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}

                <Link 
                  to="/logistics" 
                  className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm py-3 rounded transition mt-2"
                >
                  IR A SMART CART PARA REVISAR Y PAGAR
                </Link>
              </div>
            )}
          </section>

          {/* Historial de Órdenes (Recientes Primero) */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
              Historial de Órdenes ({reservations.length})
            </h2>

            {reservations.length === 0 ? (
              <p className="text-slate-500 italic py-4">No hay órdenes procesadas anteriormente.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {reversedReservations.map((item, idx) => {
                  const details = getItemDetails(item);
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 shadow-sm flex flex-col gap-1.5"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[#166534] text-lg">{details.title}</h3>
                        {item.orderRef && (
                          <span className="text-xs font-mono font-bold text-[#15803d] bg-white px-2 py-0.5 rounded border border-[#86efac]">
                            {item.orderRef}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#15803d]">
                        Origen: <strong className="font-semibold">{details.origin}</strong>
                      </p>
                      <p className="text-sm text-[#15803d]">
                        Destino: <strong className="font-semibold">{details.destination}</strong>
                      </p>
                      <p className="text-[#166534] font-bold font-mono text-base mt-0.5">{money(details.price)}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] font-mono font-bold uppercase bg-[#dcfce7] text-[#15803d] px-2 py-1 rounded border border-[#86efac]">
                          ORDEN PROCESADA
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}