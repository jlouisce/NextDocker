import { createContext, useContext, useState, useEffect } from 'react';
import { containersData } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [containers] = useState(containersData);

  const [searchParams, setSearchParams] = useState({
    origin: 'Shanghai (CNSHA)',
    containerType: 'all',
    shipDate: new Date().toISOString().split('T')[0],
  });

  const updateSearchParams = (params) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nextdocker_cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const savedReservations = localStorage.getItem('nextdocker_reservations');
      if (!savedReservations) return [];
      const parsed = JSON.parse(savedReservations);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
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

  const addToCart = (containerId, customOrigin, customShipDate) => {
    const newItem = {
      cartItemId: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      containerId: containerId || '20ft-standard',
      origin: customOrigin || searchParams.origin || 'Shanghai (CNSHA)',
      shipDate: customShipDate || searchParams.shipDate || new Date().toISOString().split('T')[0],
    };
    setCart((prevCart) => [...(prevCart || []), newItem]);
  };

  const removeFromCart = (targetId) => {
    setCart((prevCart) =>
      (prevCart || []).filter(
        (item, idx) =>
          item.cartItemId !== targetId &&
          item.containerId !== targetId &&
          item.id !== targetId &&
          idx !== targetId
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

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('nextdocker_cart');
    } catch (e) {}
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

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser utilizado dentro de un AppProvider');
  }
  return context;
}