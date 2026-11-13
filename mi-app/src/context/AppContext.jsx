import { createContext, useContext, useState, useEffect } from 'react';
import { containersData } from '../data/mockData';

// Contexto global: catálogo, carrito, reservas y parámetros de búsqueda
const AppContext = createContext();

export function AppProvider({ children }) {
  const [containers] = useState(containersData);

  const [searchParams, setSearchParams] = useState({
    origin: 'Shanghai (CNSHA)',
    destination: 'Los Angeles (USLAX)',
    containerType: 'all',
    shipDate: new Date().toISOString().split('T')[0],
  });

  const updateSearchParams = (newParams) => {
    setSearchParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nextdocker_cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Si el JSON guardado está corrupto, se arranca con lista vacía
      return [];
    }
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const savedReservations = localStorage.getItem('nextdocker_reservations');
      if (!savedReservations) return [];
      const parsed = JSON.parse(savedReservations);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Si el JSON guardado está corrupto, se arranca con lista vacía
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nextdocker_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nextdocker_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.error(e);
    }
  }, [reservations]);

  const addToCart = (containerId, customOrigin, customShipDate, customDestination) => {
    const isObj = typeof containerId === 'object' && containerId !== null;
    const resolvedId = isObj ? containerId.containerId || containerId.id : containerId;
    const resolvedOrigin = isObj ? containerId.origin : customOrigin;
    const resolvedDate = isObj ? containerId.shipDate : customShipDate;
    const resolvedDestination = isObj ? containerId.destination : customDestination;

    const newItem = {
      cartItemId: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      containerId: resolvedId || '20ft-standard',
      origin: resolvedOrigin || searchParams.origin || 'Shanghai (CNSHA)',
      destination: resolvedDestination || searchParams.destination || 'Los Angeles (USLAX)',
      shipDate: resolvedDate || searchParams.shipDate || new Date().toISOString().split('T')[0],
    };
    setCart((prevCart) => [...(prevCart || []), newItem]);
  };

  const removeFromCart = (targetId) => {
    // Se elimina por cartItemId (único). Solo los ítems antiguos sin ese campo
    // se comparan por containerId, para no borrar otros ítems del mismo contenedor.
    setCart((prevCart) =>
      (prevCart || []).filter((item) =>
        item.cartItemId ? item.cartItemId !== targetId : item.containerId !== targetId
      )
    );
  };

  const setCartOrigin = (targetId, origin) => {
    setCart((prevCart) =>
      (prevCart || []).map((item) => {
        if (item.cartItemId === targetId || item.containerId === targetId) {
          return { ...item, origin };
        }
        return item;
      })
    );
  };

  const setCartDestination = (targetId, destination) => {
    setCart((prevCart) =>
      (prevCart || []).map((item) => {
        if (item.cartItemId === targetId || item.containerId === targetId) {
          return { ...item, destination };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('nextdocker_cart');
    } catch {
      // localStorage no disponible: se ignora
    }
  };

  return (
    <AppContext.Provider
      value={{
        containers,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        setCartOrigin,
        setCartDestination,
        clearCart,
        reservations,
        setReservations,
        searchParams,
        updateSearchParams,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook de consumo del contexto global
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser utilizado dentro de un AppProvider');
  }
  return context;
}