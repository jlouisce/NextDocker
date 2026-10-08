import React, { createContext, useContext, useState, useEffect } from 'react';
import { containersData as initialContainers, initialCart, cartCatalog } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Estado de contenedores (inicializado desde localStorage o datos por defecto)
  const [containers, setContainers] = useState(() => {
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

  // Estado del usuario activo
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nextdocker_user');
    return saved ? JSON.parse(saved) : { name: 'Demo Logistics Manager', company: 'Global Trade Co.', email: 'manager@globaltrade.com' };
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

  useEffect(() => {
    localStorage.setItem('nextdocker_user', JSON.stringify(user));
  }, [user]);

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
  };

  // Función para cancelar reserva
  const cancelReservation = (reservationId) => {
    setReservations((prev) => prev.filter((item) => item.id !== reservationId));
  };

  return (
    <AppContext.Provider
      value={{
        containers,
        reservations,
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        setCartOrigin,
        clearCart,
        reserveContainer,
        cancelReservation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
}