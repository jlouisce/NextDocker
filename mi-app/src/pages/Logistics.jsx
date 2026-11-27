import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Lock,
  MapPin,
  Package,
  Receipt,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSession } from '../utils/auth';
import Footer from '../components/Footer';

export default function Logistics() {
  const navigate = useNavigate();
  const {
    currentUser,
    containers,
    cart,
    setCart,
    removeFromCart,
    setCartOrigin,
    setCartDestination,
    clearCart,
    setReservations,
  } = useApp();

  const [lastOrderRef, setLastOrderRef] = useState('');
  const [authWarning, setAuthWarning] = useState(false);

  const activeUser = currentUser || getSession();

  const enrichedCart = (cart || []).map((item, index) => {
    const spec =
      containers.find((c) => c.id === item.containerId) || containers[0] || {};
    const unitCost = Number(spec.price || 2100);
    const freight = Number(spec.freight || 650);
    const itemKey = item.cartItemId || `${item.containerId}-${index}`;

    return {
      ...item,
      itemKey,
      title: spec.name || spec.title || 'Standard Container',
      code: spec.code || spec.isoCode || 'ISO-6346',
      dimensions: spec.dimensions || "20' / 40' Standard",
      image: spec.image || '',
      unitCost,
      freight,
    };
  });

  const totalMerchandise = enrichedCart.reduce((acc, item) => acc + item.unitCost, 0);
  const totalFreight = enrichedCart.reduce((acc, item) => acc + item.freight, 0);
  const grandTotal = totalMerchandise + totalFreight;

  const handleUpdateShipDate = (targetKey, newDate) => {
    setCart((prev) =>
      prev.map((item, idx) => {
        const key = item.cartItemId || `${item.containerId}-${idx}`;
        return key === targetKey ? { ...item, shipDate: newDate } : item;
      })
    );
  };

  const handleSingleDispatch = async (item) => {
    const session = getSession();
    if (!session?.id) {
      setAuthWarning(true);
      return;
    }

    const orderRef = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderRef,
      containerId: item.containerId,
      title: item.title,
      origin: item.origin,
      destination: item.destination,
      shipDate: item.shipDate,
      unitCost: item.unitCost,
      freight: item.freight,
    };

    const result = await setReservations((prev) => [...prev, newOrder]);
    if (result?.reason === 'AUTH_REQUIRED') {
      setAuthWarning(true);
      return;
    }

    removeFromCart(item.cartItemId || item.containerId);
    setLastOrderRef(orderRef);
    setAuthWarning(false);
  };

  const handleCheckoutAll = async () => {
    const session = getSession();
    if (!session?.id) {
      setAuthWarning(true);
      return;
    }

    if (enrichedCart.length === 0) return;

    const batchOrders = enrichedCart.map((item) => ({
      orderRef: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      containerId: item.containerId,
      title: item.title,
      origin: item.origin,
      destination: item.destination,
      shipDate: item.shipDate,
      unitCost: item.unitCost,
      freight: item.freight,
    }));

    const result = await setReservations((prev) => [...prev, ...batchOrders]);
    if (result?.reason === 'AUTH_REQUIRED') {
      setAuthWarning(true);
      return;
    }

    clearCart();
    setLastOrderRef(batchOrders[0].orderRef);
    setAuthWarning(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-6">
        <div className="border-b border-[#c4c6cd] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#041627]">
              Logistics &amp; Dispatch
            </h1>
            <p className="text-sm font-mono text-slate-600 mt-1">
              {enrichedCart.length}{' '}
              {enrichedCart.length === 1 ? 'container' : 'containers'} selected for dispatch.
            </p>
          </div>

          {activeUser && (
            <div className="inline-flex items-center gap-2 text-xs font-mono bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              Billing to: <strong>{activeUser.email}</strong>
            </div>
          )}
        </div>

        {/* Bloqueo obligatorio si el usuario NO ha iniciado sesión */}
        {!activeUser && (
          <div
            className={`rounded-lg p-5 border transition ${
              authWarning
                ? 'bg-red-50 border-red-400 text-red-950 shadow-sm'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Lock
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    authWarning ? 'text-red-600' : 'text-amber-600'
                  }`}
                />
                <div>
                  <h2 className="text-sm font-bold uppercase font-mono">
                    Account &amp; Billing Details Required to Place Order
                  </h2>
                  <p className="text-xs sm:text-sm mt-1 opacity-90">
                    You must sign in or create an account with your contact details so we can issue your official shipping receipt and tracking number. Your cart items will be saved.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/login')}
                  className="bg-[#041627] hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase px-4 py-2.5 rounded transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/login')}
                  className="bg-brand-orange hover:brightness-95 text-[#181c1e] font-mono font-bold text-xs uppercase px-4 py-2.5 rounded transition cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmación de Orden Exitosa */}
        {lastOrderRef && activeUser && (
          <div className="bg-emerald-50 border border-emerald-400 rounded-lg p-6 text-center shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-emerald-950">Order placed successfully!</h2>
            <p className="text-sm text-emerald-800 mt-1">
              Your reference is <strong className="font-mono">{lastOrderRef}</strong>. Receipt registered to{' '}
              <strong className="font-mono">{activeUser.email}</strong>.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold uppercase">
              <Link to="/profile" className="text-[#041627] underline hover:text-amber-700">
                View Order History &amp; Receipt
              </Link>
              <Link to="/marketplace" className="text-emerald-800 underline hover:text-emerald-950">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {enrichedCart.length === 0 ? (
              <div className="bg-white border border-[#c4c6cd] rounded-lg p-10 text-center">
                <Package className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-mono text-slate-600">
                  Your dispatch queue is currently empty.
                </p>
                <Link
                  to="/marketplace"
                  className="inline-block mt-4 bg-[#041627] text-white font-mono font-bold text-xs uppercase px-5 py-2.5 rounded hover:bg-slate-800 transition"
                >
                  Browse Containers
                </Link>
              </div>
            ) : (
              enrichedCart.map((item) => (
                <article
                  key={item.itemKey}
                  className="bg-white border border-[#c4c6cd] rounded-lg p-5 shadow-sm flex flex-col sm:flex-row gap-5"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-44 h-36 object-cover rounded border border-slate-200 bg-slate-100 shrink-0"
                    />
                  )}

                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-[#041627]">{item.title}</h3>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">
                          {item.code} • {item.dimensions}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] font-mono uppercase text-slate-400">
                          Unit Cost
                        </span>
                        <span className="text-base font-bold font-mono text-[#041627]">
                          ${item.unitCost.toLocaleString('en-US')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f7fafc] p-3 rounded border border-slate-200">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                          Origin
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={item.origin || ''}
                            onChange={(e) =>
                              setCartOrigin(item.cartItemId || item.containerId, e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded pl-7 pr-2 py-1.5 text-xs text-[#041627]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                          Destination
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={item.destination || ''}
                            onChange={(e) =>
                              setCartDestination(
                                item.cartItemId || item.containerId,
                                e.target.value
                              )
                            }
                            className="w-full bg-white border border-slate-300 rounded pl-7 pr-2 py-1.5 text-xs text-[#041627]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                          Ship Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                          <input
                            type="date"
                            value={item.shipDate || ''}
                            onChange={(e) => handleUpdateShipDate(item.itemKey, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded pl-7 pr-2 py-1.5 text-xs text-[#041627]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId || item.containerId)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>

                      <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right">
                          <span className="block text-[10px] font-mono uppercase text-slate-400">
                            Freight
                          </span>
                          <span className="text-xs font-bold font-mono text-[#041627]">
                            ${item.freight.toLocaleString('en-US')}
                          </span>
                        </div>

                        {activeUser ? (
                          <button
                            type="button"
                            onClick={() => handleSingleDispatch(item)}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs uppercase px-4 py-2 rounded transition cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Dispatch This Container ($
                            {(item.unitCost + item.freight).toLocaleString('en-US')})
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => navigate('/dashboard/login')}
                            className="inline-flex items-center gap-1.5 bg-[#041627] hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase px-4 py-2 rounded transition cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Sign In to Dispatch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="bg-white border border-[#c4c6cd] rounded-lg p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-xl font-bold text-[#041627] border-b border-slate-200 pb-3">
              Order Summary
            </h2>

            <div className="bg-[#f7fafc] border border-slate-200 rounded-md p-3.5 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold uppercase text-slate-600 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-[#041627]" />
                  Receipt Recipient
                </span>
                {activeUser && (
                  <Link
                    to="/profile"
                    className="font-mono text-[11px] text-amber-700 underline hover:text-amber-900"
                  >
                    Edit Info
                  </Link>
                )}
              </div>

              {activeUser ? (
                <div className="space-y-1 text-slate-700">
                  <p>
                    <strong>Name:</strong>{' '}
                    {activeUser.fullName || activeUser.name || 'Registered User'}
                  </p>
                  <p>
                    <strong>Email:</strong> {activeUser.email}
                  </p>
                  <p>
                    <strong>Company:</strong> {activeUser.company || 'Not specified'}
                  </p>
                </div>
              ) : (
                <p className="text-red-700 font-medium">
                  No account signed in. Please register or sign in to issue an invoice/receipt.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 text-sm font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Total Merchandise</span>
                <span className="font-bold text-[#041627]">
                  ${totalMerchandise.toLocaleString('en-US')}.00
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Freight</span>
                <span className="font-bold text-[#041627]">
                  ${totalFreight.toLocaleString('en-US')}.00
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Origin Optimization Savings</span>
                <span>-$0.00</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 flex items-baseline justify-between">
              <span className="text-base font-bold text-[#041627]">Total (USD)</span>
              <span className="text-2xl font-bold font-mono text-[#041627]">
                ${grandTotal.toLocaleString('en-US')}.00
              </span>
            </div>

            <div className="bg-slate-100 rounded p-3 text-xs text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                You can dispatch containers individually on each card or process the entire order below.
              </span>
            </div>

            {activeUser ? (
              <button
                type="button"
                disabled={enrichedCart.length === 0}
                onClick={handleCheckoutAll}
                className="w-full bg-brand-orange hover:brightness-95 disabled:opacity-40 text-[#181c1e] font-mono font-bold text-xs uppercase py-3.5 px-4 rounded transition cursor-pointer flex items-center justify-center gap-2"
              >
                Proceed to Checkout (All)
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/dashboard/login')}
                className="w-full bg-[#041627] hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase py-3.5 px-4 rounded transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Register / Sign In to Checkout
              </button>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}