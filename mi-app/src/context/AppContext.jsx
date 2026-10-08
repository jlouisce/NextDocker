import { createContext, useContext, useState, useEffect } from 'react';
import { containersData as initialContainers, initialCart, cartCatalog } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Estado de contenedores (inicializado desde localStorage o datos por defecto)
  const [containers] = useState(() => {
    const saved = localStorage.getItem('nextdocker_containers');
    if (!saved) return initialContainers;
    // Los datos estáticos (imágenes, textos) siempre vienen de mockData; solo se conservan campos guardados extra.
    const savedById = Object.fromEntries(JSON.parse(saved).map((c) => [c.id, c]));
    return initialContainers.map((c) => ({ ...savedById[c.id], ...c }));
  });

  // Estado de reservas del usuario
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('nextdocker_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  // Carrito: solo se guarda { containerId, origin }; título, imagen y costos salen de `cartCatalog`.
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('nextdocker_cart');
    return saved ? JSON.parse(saved) : initialCart;
  });

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('nextdocker_containers', JSON.stringify(containers));
  }, [containers]);

  useEffect(() => {
    localStorage.setItem('nextdocker_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('nextdocker_cart', JSON.stringify(cart));
  }, [cart]);

  // Acciones del carrito (un contenedor por tipo; si ya está, no se duplica)
  const addToCart = (containerId, origin) => {
    const entry = cartCatalog[containerId];
    if (!entry) return;
    setCart((prev) => (prev.some((i) => i.containerId === containerId)
      ? prev
      : [...prev, { containerId, origin: origin || entry.baseOrigin }]));
  };
  const removeFromCart = (containerId) => setCart((prev) => prev.filter((i) => i.containerId !== containerId));
  const setCartOrigin = (containerId, origin) =>
    setCart((prev) => prev.map((i) => (i.containerId === containerId ? { ...i, origin } : i)));
  const clearCart = () => setCart([]);

  // Función para reservar equipamiento
  const reserveContainer = (containerId, originPort = 'Shanghai (CNSHA)') => {
    const container = containers.find((c) => c.id === containerId);
    if (!container) return;

    const newReservation = {
      id: `RES-${Date.now().toString().slice(-6)}`,
      containerId: container.id,
      title: container.title,
      image: container.image,
      port: originPort,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Confirmed',
    };

    setReservations((prev) => [newReservation, ...prev]);
    return newReservation.id;
  };

  return (
    <AppContext.Provider
      value={{
        containers,
        reservations,
        cart,
        addToCart,
        removeFromCart,
        setCartOrigin,
        clearCart,
        reserveContainer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
}