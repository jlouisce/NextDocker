import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultContainers = [
  {
    id: 'CONT-20FT-STD',
    title: '20ft Standard Dry Container',
    type: '20ft Standard',
    port: 'Shanghai (CNSHA)',
    price: 2400,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    description: 'Standard multi-purpose cargo container suitable for general intermodal freight transport.',
    specs: { capacity: '33.2 CBM', maxPayload: '28,200 kg', tareWeight: '2,300 kg', dimensions: '20ft x 8ft x 8.5ft' }
  },
  {
    id: 'CONT-40FT-HC',
    title: '40ft High Cube Container',
    type: '40ft High Cube',
    port: 'Rotterdam (NLRTM)',
    price: 3800,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    description: 'Extra-height container providing additional vertical clearance for high-volume cargo.',
    specs: { capacity: '76.2 CBM', maxPayload: '28,600 kg', tareWeight: '3,900 kg', dimensions: '40ft x 8ft x 9.5ft' }
  },
  {
    id: 'CONT-REEFER',
    title: 'Refrigerated (Reefer)',
    type: 'Refrigerated (Reefer)',
    port: 'Los Angeles (USLAX)',
    price: 4500,
    status: 'Limited',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80',
    description: 'Precision climate-controlled unit for temperature-sensitive perishable goods.',
    specs: { capacity: '28.3 CBM', maxPayload: '27,400 kg', tareWeight: '3,080 kg', dimensions: '20ft x 8ft x 8.5ft' }
  }
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [containers] = useState(defaultContainers);

  // Usuario nulo por defecto o cargado de localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nd_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('nd_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nd_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nd_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nd_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Función para registrar usuarios según su ROL
  const registerUser = (userData) => {
    setUser(userData);
    return userData;
  };

  const logoutUser = () => {
    setUser(null);
  };

  const addReservation = (item) => {
    if (!item) return;
    const newBooking = {
      ...item,
      bookingId: `BK-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      userName: user?.name || 'Observador Anónimo'
    };
    
    setReservations((prev) => [...prev, newBooking]);
    return newBooking;
  };

  const cancelReservation = (id) => {
    setReservations((prev) => prev.filter((item) => (item.id || item.bookingId) !== id));
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AppContext.Provider 
      value={{ 
        containers, 
        user, 
        registerUser, 
        logoutUser, 
        updateUser, 
        reservations, 
        addReservation, 
        cancelReservation 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    return {
      containers: defaultContainers,
      user: null,
      registerUser: () => {},
      logoutUser: () => {},
      updateUser: () => {},
      reservations: [],
      addReservation: () => {},
      cancelReservation: () => {}
    };
  }
  return context;
};