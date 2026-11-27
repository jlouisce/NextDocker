import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { containersData } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';
import { getSession, syncSupabaseSession } from '../utils/auth';
import { formatShipDate } from '../utils/formatDate';

const AppContext = createContext();

const mapDbRowToReservation = (row) => ({
  id: row.id,
  orderRef: row.order_ref,
  containerId: row.container_id,
  title: row.title,
  origin: row.origin,
  destination: row.destination,
  shipDate: row.ship_date,
  unitCost: Number(row.unit_cost || 0),
  freight: Number(row.freight || 0),
});

export function AppProvider({ children }) {
  const [containers] = useState(containersData);
  const [currentUser, setCurrentUser] = useState(() => getSession());

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
      return [];
    }
  });

  const [reservations, setReservationsState] = useState(() => {
    try {
      const savedReservations = localStorage.getItem('nextdocker_reservations');
      if (!savedReservations) return [];
      const parsed = JSON.parse(savedReservations);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('nextdocker_notifications');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const seenTrackingsRef = useRef(new Set(notifications.map((n) => n.trackingNumber)));
  const activeUserIdRef = useRef(null);

  const pushUniqueNotification = (order, idx = 0) => {
    const tracking = order.orderRef || `TRK-${Date.now().toString().slice(-6)}-${idx + 1}`;
    if (seenTrackingsRef.current.has(tracking)) return;
    seenTrackingsRef.current.add(tracking);

    const route =
      order.origin && order.destination
        ? `${order.origin} → ${order.destination}${order.shipDate ? `, ship date ${formatShipDate(order.shipDate)}` : ''}`
        : 'Global Freight Corridor';

    setNotifications((prev) => {
      if (prev.some((n) => n.trackingNumber === tracking)) return prev;
      return [
        {
          id: `notif-${tracking}`,
          title: 'Order Processed',
          message: `Your shipment (${route}) has been confirmed and processed.`,
          trackingNumber: tracking,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
        ...prev,
      ];
    });
  };

  // Sincronización segura con Supabase Auth y tabla reservations
  useEffect(() => {
    let isMounted = true;
    let channel = null;

    const loadUserReservations = async (userId) => {
      if (!userId) {
        if (isMounted) setReservationsState([]);
        return;
      }

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (!isMounted) return;

      if (!error && Array.isArray(data)) {
        const mapped = data.map(mapDbRowToReservation);
        setReservationsState(mapped);
        mapped.forEach((m) => seenTrackingsRef.current.add(m.orderRef));
      }

      if (channel) {
        supabase.removeChannel(channel);
      }

      channel = supabase
        .channel(`reservations-user-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'reservations',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (!isMounted) return;
            const incoming = mapDbRowToReservation(payload.new);
            setReservationsState((prev) => {
              if (prev.some((item) => item.id === incoming.id || item.orderRef === incoming.orderRef)) {
                return prev;
              }
              return [...prev, incoming];
            });
            pushUniqueNotification(incoming);
          }
        )
        .subscribe();
    };

    const init = async () => {
      const user = await syncSupabaseSession({ notify: true });
      if (!isMounted) return;
      setCurrentUser(user || getSession() || null);
      const uid = user?.id || null;
      activeUserIdRef.current = uid;
      await loadUserReservations(uid);
    };

    init();

    const handleSessionUpdated = () => {
      if (!isMounted) return;
      setCurrentUser(getSession());
    };
    window.addEventListener('nextdocker_session_updated', handleSessionUpdated);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      const nextUid = session?.user?.id || null;
      if (event === 'SIGNED_OUT') {
        activeUserIdRef.current = null;
        setCurrentUser(null);
        if (channel) supabase.removeChannel(channel);
        setReservationsState([]);
        return;
      }
      if (nextUid && nextUid !== activeUserIdRef.current) {
        activeUserIdRef.current = nextUid;
        const synced = await syncSupabaseSession({ notify: true });
        setCurrentUser(synced || getSession() || null);
        await loadUserReservations(nextUid);
      }
    });

    return () => {
      isMounted = false;
      window.removeEventListener('nextdocker_session_updated', handleSessionUpdated);
      authListener?.subscription?.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem('nextdocker_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const setReservations = async (updater) => {
    const session = getSession();
    // Bloqueo obligatorio: nadie puede crear órdenes/recibos sin haber iniciado sesión
    if (!session?.id) {
      return { success: false, reason: 'AUTH_REQUIRED' };
    }

    const next = typeof updater === 'function' ? updater(reservations) : updater;
    const addedItems = Array.isArray(next) ? next.slice(reservations.length) : [];

    setReservationsState(next);
    addedItems.forEach((order, idx) => pushUniqueNotification(order, idx));

    if (addedItems.length > 0) {
      const rowsToInsert = addedItems.map((item) => ({
        user_id: session.id,
        order_ref: item.orderRef || `RES-${Math.floor(100000 + Math.random() * 900000)}`,
        container_id: item.containerId || item.id || '20ft-standard',
        title: item.title || 'Standard Container',
        origin: item.origin || 'Shanghai (CNSHA)',
        destination: item.destination || 'Los Angeles (USLAX)',
        ship_date: item.shipDate || new Date().toISOString().split('T')[0],
        unit_cost: Number(item.unitCost || item.price || 2100),
        freight: Number(item.freight || 1200),
      }));

      const { error } = await supabase.from('reservations').insert(rowsToInsert);
      if (error) {
        console.error('Error saving reservation to Supabase:', error.message);
        return { success: false, reason: 'DB_ERROR', error };
      }
    }

    return { success: true };
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    try {
      localStorage.removeItem('nextdocker_notifications');
    } catch {
      // se ignora
    }
  };

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
      // se ignora
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
        notifications,
        markAllNotificationsRead,
        clearNotifications,
        searchParams,
        updateSearchParams,
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
    throw new Error('useApp debe ser utilizado dentro de un AppProvider');
  }
  return context;
}