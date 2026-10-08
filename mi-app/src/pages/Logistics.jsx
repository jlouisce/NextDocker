import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { cartCatalog } from '../data/mockData';
import iconTrash from '../assets/figma/icon-trash.svg';
import iconRoute from '../assets/figma/icon-route.svg';
import iconSelectArrow from '../assets/figma/icon-image.svg';
import iconInfo from '../assets/figma/icon-info.svg';

const money = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const moneyShort = (value) => `$${value.toLocaleString('en-US')}`;

export default function Logistics() {
  const navigate = useNavigate();
  const { cart: cartState, setCartOrigin, removeFromCart, clearCart, reserveContainer } = useApp();
  // El estado guarda { containerId, origin }; el resto de los datos sale del catálogo.
  const cart = cartState
    .filter(({ containerId }) => cartCatalog[containerId])
    .map(({ containerId, origin }) => ({ id: containerId, containerId, origin, ...cartCatalog[containerId] }));

  const originOf = (item, code = item.origin) => item.origins.find((o) => o.code === code);

  const setOrigin = (id, origin) => setCartOrigin(id, origin);
  const removeItem = (id) => removeFromCart(id);

  const merchandise = cart.reduce((sum, item) => sum + item.unitCost, 0);
  const freight = cart.reduce((sum, item) => sum + originOf(item).freight, 0);
  const savings = cart.reduce((sum, item) => sum + Math.max(0, originOf(item, item.baseOrigin).freight - originOf(item).freight), 0);
  // El flete ya refleja el origen elegido, así que `savings` es solo informativo y no se resta otra vez.
  const total = merchandise + freight;

  const handleCheckout = () => {
    cart.forEach((item) => {
      const origin = originOf(item);
      reserveContainer(item.containerId, `${origin.port} (${origin.code})`);
    });
    clearCart();
    navigate('/tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-[1728px] mx-auto px-6 lg:px-[54px] py-8 lg:py-[43px] flex flex-col lg:flex-row gap-8 lg:gap-[43px] items-start">

        {/* Lista de ítems */}
        <section className="flex-1 min-w-0 w-full flex flex-col gap-[22px]">
          <div className="border-b border-[#c4c6cd] pb-3">
            <h1 className="text-[32px] font-semibold leading-[43px]">Smart Cart</h1>
            <p className="text-lg lg:text-[19px] text-[#44474c] mt-1">
              {cart.length} {cart.length === 1 ? 'Container' : 'Containers'} selected for dispatch.
            </p>
          </div>

          {cart.length === 0 && (
            <div className="bg-white border border-[#c4c6cd] rounded-[5px] p-10 text-center text-[#44474c]">
              Your cart is empty.
            </div>
          )}

          {cart.map((item) => {
            const origin = originOf(item);
            return (
              <article
                key={item.id}
                className="bg-white border border-[#c4c6cd] rounded-[5px] p-[23px] flex flex-col md:flex-row gap-[22px] shadow-[0_5px_8px_-1px_rgba(0,0,0,0.1),0_3px_5px_-1px_rgba(0,0,0,0.06)]"
              >
                <div className="bg-[#ebeef0] h-[173px] w-full md:w-[259px] shrink-0 rounded-[3px] overflow-hidden">
                  <img src={item.image} alt={item.title} className="size-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-[11px] pb-[22px]">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl lg:text-[27px] font-semibold leading-[38px]">{item.title}</h2>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="pb-[3px] hover:opacity-60 transition-opacity shrink-0"
                      >
                        <img src={iconTrash} alt="" className="h-[20.25px] w-[18px]" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-[11px] font-mono font-medium">
                      <div>
                        <div className="text-base text-[#74777d] uppercase leading-[22px]">SKU</div>
                        <div className="text-[19px] text-[#44474c] leading-[27px]">{item.sku}</div>
                      </div>
                      <div>
                        <div className="text-base text-[#74777d] uppercase leading-[22px]">Payload</div>
                        <div className="text-[19px] text-[#44474c] leading-[27px]">{item.payload}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f1f4f6] border border-[#c4c6cd] rounded-[3px] p-3 flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-3">
                    <div className="flex items-center gap-[11px] text-[19px]">
                      <img src={iconRoute} alt="" className="size-[14px] shrink-0" />
                      <span>
                        Origin: <strong className="font-bold">{origin.port} ({origin.code})</strong>
                      </span>
                    </div>

                    <div className="relative min-w-0 2xl:flex-1 2xl:max-w-[374px]">
                      <select
                        value={item.origin}
                        onChange={(e) => setOrigin(item.id, e.target.value)}
                        aria-label={`Origin for ${item.title}`}
                        className="appearance-none w-full bg-white border border-[#c4c6cd] rounded-[3px] pl-[18px] pr-[45px] py-[9px] font-mono font-medium text-[19px] cursor-pointer focus:outline-none focus:border-[#041627]"
                      >
                        {item.origins.map((o) => (
                          <option key={o.code} value={o.code}>
                            {o.port} ({o.code}){o.code === item.baseOrigin ? ' - Base' : ''}
                          </option>
                        ))}
                      </select>
                      <img src={iconSelectArrow} alt="" className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 size-[28px]" />
                    </div>
                  </div>
                </div>

                <div className="md:border-l border-[#c4c6cd] md:w-[173px] shrink-0 md:pl-[23px] flex md:flex-col justify-between items-end gap-4 text-right">
                  <div>
                    <div className="font-mono font-bold text-base text-[#74777d] tracking-[0.05em] leading-[22px]">UNIT COST</div>
                    <div className="font-mono font-bold text-[19px] leading-[27px]">{moneyShort(item.unitCost)}</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-base text-[#74777d] tracking-[0.05em] leading-[22px]">FREIGHT</div>
                    <div className="font-mono font-medium text-[19px] leading-[27px]">{moneyShort(origin.freight)}</div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Resumen del pedido */}
        <aside className="w-full lg:w-[432px] shrink-0">
          <div className="bg-[#041627] text-white rounded-[5px] p-[22px] flex flex-col gap-[22px]">
            <h2 className="text-[27px] font-semibold leading-[38px] border-b border-[#38485a] pb-3">Order Summary</h2>

            <div className="flex flex-col gap-4 pb-[22px] font-mono font-medium text-[19px] leading-[27px]">
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
              <div className="flex justify-between gap-4 border-t border-[#38485a] pt-[18px] font-bold text-[24px] leading-[38px]">
                <span>Total (USD)</span>
                <span>{money(total)}</span>
              </div>
            </div>

            <div className="bg-[#0b1d2d] rounded-[3px] p-4 flex gap-[11px] items-start text-[#b7c8de] text-[19px] leading-[26px]">
              <img src={iconInfo} alt="" className="h-[18.45px] w-[15.75px] mt-[2px] shrink-0" />
              <p>
                Optimize your origins to reduce total freight costs. Estimated delivery for current routing is{' '}
                <strong className="font-bold">14-21 days</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="bg-brand-orange hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed text-[#181c1e] font-mono font-bold text-base tracking-[0.05em] py-4 rounded-[3px] transition"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
