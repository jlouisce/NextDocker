import { useApp } from '../context/AppContext';
import { cartCatalog, containersData } from '../data/mockData';

export default function Profile() {
  const context = useApp() || {};
  const currentCart = context.cart || [];
  const orderHistory = context.reservations || [];

  const getDetails = (item) => {
    // Buscar ID en todas las formas posibles
    const id = item.containerId || item.id || item.sku || item.productId;
    
    // Extraer detalles de cualquiera de los dos catálogos
    const detailsFromCatalog = cartCatalog[id] || (Array.isArray(cartCatalog) && cartCatalog.find(c => c.id === id)) || {};
    const detailsFromData = (Array.isArray(containersData) && containersData.find(c => c.id === id)) || {};
    
    const details = { ...detailsFromData, ...detailsFromCatalog };

    // Cazador de propiedades: busca el precio y el nombre en todas las variaciones comunes
    const realPrice = details.price || details.unitCost || details.unit_cost || details.cost || item.price || item.unitCost || 0;
    const realName = details.name || details.title || details.type || details.model || item.name || item.title || 'Contenedor Estándar';

    return {
      ...item,
      id: id,
      name: realName,
      price: realPrice,
      origin: item.origin || details.origin || 'No especificado',
      rawItemData: item, // Guardamos los datos crudos para depuración
      rawCatalogDetails: details
    };
  };

  const cartItems = currentCart.map(getDetails);
  const historyItems = orderHistory.map(getDetails);
  const totalCart = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  const renderItem = (res, index, isHistory) => (
    <div key={index} className={`p-4 border rounded-lg ${isHistory ? 'border-emerald-200 bg-emerald-50' : 'border-blue-200 bg-blue-50'}`}>
      <h3 className="font-semibold text-lg">{res.name}</h3>
      <p className="text-sm text-slate-500 mb-2">Origen: {res.origin}</p>
      <p className={`font-bold text-lg ${isHistory ? 'text-emerald-600' : 'text-blue-600'}`}>
        ${res.price.toLocaleString()} USD
      </p>
      {isHistory && (
        <span className="inline-block mt-2 px-2 py-1 bg-emerald-200 text-emerald-800 text-xs font-bold rounded">
          ORDEN PROCESADA
        </span>
      )}
      
      {/* MODO DEPURACIÓN: Si el precio sigue siendo 0, mostramos qué hay realmente dentro */}
      {res.price === 0 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-xs overflow-auto text-slate-700">
          <p className="font-bold text-red-600 mb-1">⚠️ Depuración de Datos (Falta Precio/Nombre):</p>
          <p className="font-semibold">Datos guardados en el carrito:</p>
          <pre>{JSON.stringify(res.rawItemData, null, 2)}</pre>
          <p className="font-semibold mt-2">Detalles encontrados en el catálogo:</p>
          <pre>{JSON.stringify(res.rawCatalogDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">Mi Perfil y Panel de Usuario</h1>
      <p className="text-slate-600 mb-8">
        Usuario activo: <span className="font-semibold">{context.user?.name || 'Invitado'}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Carrito en Curso</h2>
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-slate-500 italic">No tienes contenedores en el carrito logístico.</p>
            ) : (
              cartItems.map((res, index) => renderItem(res, index, false))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
              <p className="text-slate-600 font-semibold">Total pendiente:</p>
              <p className="text-xl font-bold text-blue-600">${totalCart.toLocaleString()} USD</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Historial de Órdenes</h2>
          <div className="space-y-4">
            {historyItems.length === 0 ? (
              <p className="text-slate-500 italic">Aún no has procesado ninguna orden en el checkout.</p>
            ) : (
              historyItems.map((res, index) => renderItem(res, index, true))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}