import React, { createContext, useContext, useState, useEffect } from 'react';
import { containersData as initialContainers } from '../data/mockData';

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
    localStorage.setItem('nextdocker_user', JSON.stringify(user));
  }, [user]);

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