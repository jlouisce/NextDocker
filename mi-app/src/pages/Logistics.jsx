import { useState } from 'react';
import { Calendar, ChevronDown, Info, Route, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { cartCatalog } from '../data/mockData';
import { formatShipDate } from '../utils/formatDate';

const money = (value) => `$${(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const moneyShort = (value) => `$${(value || 0).toLocaleString('en-US')}`;

const generarReferencia = () => `RES-${Math.floor(100000 + Math.random() * 900000)}`;

const DEFAULT_DESTINATIONS = [
  { port: 'Los Angeles', code: 'USLAX' },
  { port: 'Rotterdam', code: 'NLRTM' },
  { port: 'Singapore', code: 'SGSIN' },
  { port: 'Hamburg', code: 'DEHAM' },
  { port: 'Shanghai', code: 'CNSHA' },
];

export default function Logistics() {
  const [orderRef, setOrderRef] = useState(null);

  const {
    cart: cartState = [],
    setCartOrigin,
    setCartDestination,
    removeFromCart,
    clearCart,
    setReservations,
    searchParams = {},
  } = useApp();

  const cart = cartState
    .map((rawItem, index) => {
      const containerId = rawItem.containerId || rawItem.id;
      const catalogData = cartCatalog[containerId] || {};
      return {
        cartItemId: rawItem.cartItemId || `${containerId}-${index}`,
        containerId,
        origin: rawItem.origin || searchParams.origin || 'Shanghai (CNSHA)',
        destination: rawItem.destination || searchParams.destination || 'Los Angeles (USLAX)',
        shipDate: rawItem.shipDate || searchParams.shipDate || new Date().toISOString().split('T')[0],
        ...catalogData,
      };
    })
    .filter((item) => item.title || item.unitCost);

  const originOf = (item, code = item.origin) => {
    const defaultOrigins = item?.origins || [
      { port: 'Shanghai', code: 'CNSHA', freight: 1200 },
      { port: 'Rotterdam', code: 'NLRTM', freight: 1400 },
      { port: 'Los Angeles', code: 'USLAX', freight: 1300 },
    ];

    if (!code) return defaultOrigins[0];

    if (typeof code === 'string' && code.trim() !== '') {
      if (code.includes('(')) {
        const portName = code.split('(')[0].trim();
        const portCode = code.split('(')[1]?.replace(')', '').trim() || 'PORT';
        const matched = defaultOrigins.find((o) => o.code.toLowerCase() === portCode.toLowerCase());
        return matched || { port: portName, code: portCode, freight: 1350 };
      }

      const found = defaultOrigins.find(
        (o) => o.code.toLowerCase() === code.toLowerCase() || o.port.toLowerCase().includes(code.toLowerCase())
      );
      if (found) return found;

      return {
        port: code.charAt(0).toUpperCase() + code.slice(1),
        code: code.toUpperCase(),
        freight: 1350,
      };
    }

    return defaultOrigins[0];
  };

  const destinationOf = (code) => {
    if (!code) return DEFAULT_DESTINATIONS[0];

    if (typeof code === 'string' && code.trim() !== '') {
      if (code.includes('(')) {
        const portName = code.split('(')[0].trim();
        const portCode = code.split('(')[1]?.replace(')', '').trim() || 'PORT';
        return { port: portName, code: portCode };
      }

      const found = DEFAULT_DESTINATIONS.find(
        (d) => d.code.toLowerCase() === code.toLowerCase() || d.port.toLowerCase().includes(code.toLowerCase())
      );
      if (found) return found;

      return {
        port: code.charAt(0).toUpperCase() + code.slice(1),
        code: code.toUpperCase(),
      };
    }

    return DEFAULT_DESTINATIONS[0];
  };

  const setOrigin = (id, origin) => setCartOrigin(id, origin);
  const setDestination = (id, destination) => {
    if (typeof setCartDestination === 'function') {
      setCartDestination(id, destination);
    }
  };
  const removeItem = (targetId) => removeFromCart(targetId);

  const merchandise = cart.reduce((sum, item) => sum + (item.unitCost || 0), 0);
  const freight = cart.reduce((sum, item) => sum + (originOf(item).freight || 0), 0);
  const savings = cart.reduce((sum, item) => {
    const orig = originOf(item);
    const baseOrig = originOf(item, item.baseOrigin);
    return sum + Math.max(0, (baseOrig.freight || 0) - (orig.freight || 0));
  }, 0);
  const total = merchandise + freight;

  const handleSingleCheckout = (itemToProcess) => {
    const originObj = originOf(itemToProcess);
    const destObj = destinationOf(itemToProcess.destination);
    const originLabel = `${originObj.port} (${originObj.code})`;
    const destinationLabel = `${destObj.port} (${destObj.code})`;
    const newRef = generarReferencia();

    const processedItem = {
      ...itemToProcess,
      orderRef: newRef,
      origin: originLabel,
      selectedOrigin: originLabel,
      destination: destinationLabel,
      selectedDestination: destinationLabel,
    };

    if (typeof setReservations === 'function') {
      setReservations((prev) => [...(prev || []), processedItem]);
    }

    removeItem(itemToProcess.cartItemId);
    setOrderRef(newRef);
  };

  const handleCheckoutAll = () => {
    if (cart.length === 0) return;

    const newRef = generarReferencia();

    const itemsToProcess = cart.map((item) => {
      const originObj = originOf(item);
      const destObj = destinationOf(item.destination);
      const originLabel = `${originObj.port} (${originObj.code})`;
      const destinationLabel = `${destObj.port} (${destObj.code})`;
      return {
        ...item,
        orderRef: newRef,
        origin: originLabel,
        selectedOrigin: originLabel,
        destination: destinationLabel,
        selectedDestination: destinationLabel,
      };
    });

    if (typeof setReservations === 'function') {
      setReservations((prevHistory) => [...(prevHistory || []), ...itemsToProcess]);
    }

    clearCart();
    setOrderRef(newRef);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col lg:flex-row gap-8 items-start">
        <section className="flex-1 min-w-0 w-full flex flex-col gap-6">
          <div className="border-b border-[#c4c6cd] pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#041627]">Smart Cart</h1>
            <p className="text-sm sm:text-base text-[#44474c] mt-1">
              {cart.length} {cart.length === 1 ? 'Container' : 'Containers'} selected for dispatch.
            </p>
          </div>

          {cart.length === 0 && (
            <div role="status" className="bg-white border border-[#c4c6cd] rounded-[5px] p-10 text-center text-[#44474c] flex flex-col items-center gap-3">
              {orderRef ? (
                <>
                  <p className="text-2xl font-semibold text-[#041627]">Order placed successfully!</p>
                  <p>
                    Your reference is <span className="font-mono font-bold text-[#041627]">{orderRef}</span>. Check your profile order history for details.
                  </p>
                </>
              ) : (
                <p>Your cart is empty.</p>
              )}
              <Link className="font-mono font-bold text-sm tracking-[0.05em] text-[#041627] underline" to="/marketplace">
                Continue shopping
              </Link>
            </div>
          )}

          {cart.map((item) => {
            const originObj = originOf(item);
            const destObj = destinationOf(item.destination);

            const baseOrigins = item.origins || [
              { port: 'Shanghai', code: 'CNSHA', freight: 1200 },
              { port: 'Rotterdam', code: 'NLRTM', freight: 1400 },
              { port: 'Los Angeles', code: 'USLAX', freight: 1300 },
            ];

            const hasOriginMatch = baseOrigins.some(
              (o) => o.code === originObj.code || o.port.toLowerCase() === originObj.port.toLowerCase()
            );
            const originsList = hasOriginMatch ? baseOrigins : [originObj, ...baseOrigins];

            const hasDestMatch = DEFAULT_DESTINATIONS.some(
              (d) => d.code === destObj.code || d.port.toLowerCase() === destObj.port.toLowerCase()
            );
            const destinationsList = hasDestMatch ? DEFAULT_DESTINATIONS : [destObj, ...DEFAULT_DESTINATIONS];

            const itemTotal = (item.unitCost || 0) + (originObj.freight || 0);

            return (
              <article
                key={item.cartItemId}
                className="bg-white border border-[#c4c6cd] rounded-[5px] p-5 flex flex-col md:flex-row gap-5 shadow-[0_5px_8px_-1px_rgba(0,0,0,0.1),0_3px_5px_-1px_rgba(0,0,0,0.06)]"
              >
                <div className="bg-[#ebeef0] h-40 w-full md:w-56 shrink-0 rounded-[3px] overflow-hidden">
                  <img src={item.image} alt={item.title} className="size-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-[#041627]">{item.title}</h2>
                      <button
                        type="button"
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label={`Remove ${item.title}`}
                        className="p-1 hover:opacity-60 transition-opacity shrink-0 cursor-pointer"
                      >
                        <Trash2 aria-hidden="true" className="size-5 text-[#44474c]" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 font-mono font-medium">
                      <div>
                        <div className="text-xs text-[#74777d] uppercase">SKU</div>
                        <div className="text-sm text-[#44474c]">{item.sku}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#74777d] uppercase">Payload</div>
                        <div className="text-sm text-[#44474c]">{item.payload}</div>
                      </div>
                    </div>
                  </div>

                  {/* Route Selector: Origin & Destination */}
                  <div className="bg-[#f1f4f6] border border-[#c4c6cd] rounded-[3px] p-3 flex flex-col gap-3">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Route aria-hidden="true" className="size-4 shrink-0" />
                        <span>
                          Origin: <strong className="font-bold">{originObj.port} ({originObj.code})</strong>
                        </span>
                      </div>

                      <div className="relative min-w-0 xl:w-64">
                        <select
                          value={originObj.code}
                          onChange={(e) => setOrigin(item.cartItemId, e.target.value)}
                          aria-label={`Origin for ${item.title}`}
                          className="appearance-none w-full bg-white border border-[#c4c6cd] rounded-[3px] pl-3 pr-9 py-2 font-mono font-medium text-sm cursor-pointer focus:outline-none focus:border-[#041627]"
                        >
                          {originsList.map((o) => (
                            <option key={o.code} value={o.code}>
                              {o.port} ({o.code})
                            </option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[#6b7280]" />
                      </div>
                    </div>

                    <div className="border-t border-[#c4c6cd]/60 pt-3 flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Route aria-hidden="true" className="size-4 shrink-0 text-amber-600" />
                        <span>
                          Destination: <strong className="font-bold">{destObj.port} ({destObj.code})</strong>
                        </span>
                      </div>

                      <div className="relative min-w-0 xl:w-64">
                        <select
                          value={destObj.code}
                          onChange={(e) => setDestination(item.cartItemId, e.target.value)}
                          aria-label={`Destination for ${item.title}`}
                          className="appearance-none w-full bg-white border border-[#c4c6cd] rounded-[3px] pl-3 pr-9 py-2 font-mono font-medium text-sm cursor-pointer focus:outline-none focus:border-[#041627]"
                        >
                          {destinationsList.map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.port} ({d.code})
                            </option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[#6b7280]" />
                      </div>
                    </div>

                    {/* Fecha de embarque elegida en el filtro del Marketplace / Rates */}
                    <div className="border-t border-[#c4c6cd]/60 pt-3 flex items-center gap-2 text-sm">
                      <Calendar aria-hidden="true" className="size-4 shrink-0 text-amber-600" />
                      <span>
                        Ship Date: <strong className="font-bold">{formatShipDate(item.shipDate)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSingleCheckout(item)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs uppercase px-4 py-2.5 rounded flex items-center gap-2 transition cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Dispatch This Container ({moneyShort(itemTotal)})
                    </button>
                  </div>
                </div>

                <div className="md:border-l border-[#c4c6cd] md:w-36 shrink-0 md:pl-5 flex md:flex-col justify-between items-end gap-4 text-right">
                  <div>
                    <div className="font-mono font-bold text-xs text-[#74777d] tracking-[0.05em]">UNIT COST</div>
                    <div className="font-mono font-bold text-base">{moneyShort(item.unitCost)}</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs text-[#74777d] tracking-[0.05em]">FREIGHT</div>
                    <div className="font-mono font-medium text-base">{moneyShort(originObj.freight)}</div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="w-full lg:w-[380px] shrink-0">
          <div className="bg-[#041627] text-white rounded-[5px] p-6 flex flex-col gap-5">
            <h2 className="text-xl font-semibold border-b border-[#38485a] pb-3">Order Summary</h2>

            <div className="flex flex-col gap-3 pb-4 font-mono font-medium text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#8192a7]">Total Merchandise</span>
                <span>{money(merchandise)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#8192a7]">Estimated Freight</span>
                <span>{money(freight)}</span>
              </div>
              <div className="flex justify-between gap-4 text-[#a88c69]">
                <span>Origin Optimization Savings</span>
                <span>-{money(savings)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#38485a] pt-4 font-bold text-lg">
                <span>Total (USD)</span>
                <span>{money(total)}</span>
              </div>
            </div>

            <div className="bg-[#0b1d2d] rounded-[3px] p-3.5 flex gap-3 items-start text-[#b7c8de] text-xs leading-5">
              <Info aria-hidden="true" className="size-4 mt-0.5 shrink-0 text-brand-orange" />
              <p>
                You can dispatch containers individually on each card or process the entire order below.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckoutAll}
              disabled={cart.length === 0}
              className="bg-brand-orange hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed text-[#181c1e] font-mono font-bold text-sm tracking-[0.05em] py-3.5 rounded-[3px] transition cursor-pointer"
            >
              PROCEED TO CHECKOUT (ALL)
            </button>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}