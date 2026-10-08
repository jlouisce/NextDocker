import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { cartCatalog, ports } from '../data/mockData';
import productMain from '../assets/figma/product-main.jpg';
import productDetail1 from '../assets/figma/product-detail-1.jpg';
import productDetail2 from '../assets/figma/product-detail-2.jpg';
import iconSpecs from '../assets/figma/icon-specs.svg';
import iconAddCart from '../assets/figma/icon-add-cart.svg';
import iconOptimizer from '../assets/figma/icon-optimizer.svg';
import iconSelectArrow from '../assets/figma/icon-select-arrow.svg';
import iconAnchor from '../assets/figma/icon-anchor.svg';
import iconSwap from '../assets/figma/icon-swap.svg';
import iconLocation from '../assets/figma/icon-location.svg';
import iconCalc from '../assets/figma/icon-calc.svg';
import iconTrustIso from '../assets/figma/icon-trust-iso.svg';
import iconTrustWarranty from '../assets/figma/icon-trust-warranty.svg';
import iconTrustCsc from '../assets/figma/icon-trust-csc.svg';

const money = (value) => `$${value.toLocaleString('en-US')}`;
const transitDays = { CNSHA: '18 - 24 Days', NLRTM: '14 - 21 Days', USLAX: '21 - 28 Days' };

const statusStyles = {
  Available: 'bg-[#dcfce7] text-[#166534]',
  Limited: 'bg-[#b8c7ff] text-[#162765]',
};

const tag = 'rounded-[3px] px-[11px] py-[5px] font-mono font-bold text-base tracking-[0.05em] uppercase';
const darkCard =
  'relative overflow-hidden bg-[#1a2b3c] border border-[rgba(210,228,251,0.2)] rounded-[5px] p-[34px] flex flex-col gap-8 shadow-[0_27px_34px_-7px_rgba(0,0,0,0.1),0_13px_13px_-7px_rgba(0,0,0,0.04)]';

// Icono con el recorte (25.93% abajo/derecha) que usa el diseño en los íconos de campos
function InsetIcon({ src, className }) {
  return (
    <span className={className}>
      <span className="relative block size-full">
        <img src={src} alt="" className="absolute block max-w-none inset-[0_25.93%_25.93%_0]" />
      </span>
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { containers, cart, addToCart } = useApp();
  const container = containers.find((c) => c.id === id);

  const [origin, setOrigin] = useState('CNSHA');
  const [destination, setDestination] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState('');

  if (!container) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7fafc] font-sans">
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-[#041627]">
          <h1 className="text-3xl font-bold">Container not found</h1>
          <Link to="/marketplace" className="font-mono font-bold underline">Back to Marketplace</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const inCart = cart.some((item) => item.containerId === container.id);
  const catalog = cartCatalog[container.id];

  const handleAddToCart = () => {
    addToCart(container.id, origin);
    navigate('/logistics');
  };

  const handleEstimate = () => {
    if (!destination.trim()) {
      setError('Enter a destination port to estimate shipping.');
      setEstimate(null);
      return;
    }
    setError('');
    const freight = catalog?.origins.find((o) => o.code === origin)?.freight ?? 1500;
    setEstimate({
      range: `${money(Math.round((freight * 0.9) / 50) * 50)} - ${money(Math.round((freight * 1.05) / 50) * 50)}`,
      transit: transitDays[origin] ?? '18 - 24 Days',
    });
  };

  const header = (
    <div className="flex flex-col gap-[11px]">
      <div className="flex flex-wrap items-center gap-[11px]">
        <span className={`${tag} bg-[#e0e3e5] text-[#181c1e]`}>Container</span>
        <span className={`${tag} bg-[#e5e9eb] text-[#041627]`}>{container.badge}</span>
        <span className={`${tag} ${statusStyles[container.status] ?? statusStyles.Available}`}>{container.status}</span>
      </div>
      <h1 className="text-4xl lg:text-[65px] font-bold text-[#041627] tracking-[-0.02em] leading-[1.17]">
        {container.detailTitle || container.title}
      </h1>
      <p className="text-lg lg:text-[24px] text-[#44474c] leading-[1.56] max-w-[1000px]">{container.longDescription}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#041627] font-sans">
      <main className="flex-1 w-full max-w-[1728px] mx-auto px-6 lg:px-[54px] pt-8 lg:pt-[50px] pb-[43px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[32px] items-start">

        {/* Columna izquierda: galería y especificaciones */}
        <div className="lg:col-span-8 flex flex-col gap-[43px] min-w-0">
          {header}

          <div className="grid grid-cols-2 gap-[11px]">
            <div className="col-span-2 h-[260px] md:h-[540px] bg-white border border-[#e0e3e5] rounded-[5px] overflow-hidden p-[1px] shadow-[0_5px_8px_-1px_rgba(0,0,0,0.1),0_3px_5px_-1px_rgba(0,0,0,0.06)]">
              <img src={productMain} alt={container.title} className="size-full object-cover" />
            </div>
            <div className="h-[150px] md:h-[270px] bg-white border border-[#e0e3e5] rounded-[5px] overflow-hidden p-[1px]">
              <img src={productDetail1} alt="" className="size-full object-cover" />
            </div>
            <div className="h-[150px] md:h-[270px] bg-white border border-[#e0e3e5] rounded-[5px] overflow-hidden p-[1px]">
              <img src={productDetail2} alt="" className="size-full object-cover" />
            </div>
          </div>

          <section className="pt-[22px]">
            <div className="bg-white border border-[#e0e3e5] rounded-[5px] overflow-hidden shadow-[0_5px_8px_-1px_rgba(0,0,0,0.1),0_3px_5px_-1px_rgba(0,0,0,0.06)]">
              <div className="bg-[#e0e3e5] border-b border-[#c4c6cd] px-8 py-[22px] flex items-center gap-[11px]">
                <img src={iconSpecs} alt="" className="h-[16.2px] w-[27px]" />
                <h2 className="text-[27px] font-semibold leading-[38px]">Technical Specifications</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] font-mono text-[19px] text-left">
                  <thead>
                    <tr className="bg-[#f7fafc] border-b border-[#c4c6cd] text-[#44474c] font-semibold">
                      <th className="font-semibold px-8 py-4 w-[38%]">Specification</th>
                      <th className="font-semibold px-8 py-4 w-[29%]">Metric (mm / kg)</th>
                      <th className="font-semibold px-8 py-4">Imperial (ft / lbs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {container.specs.map(([label, metric, imperial], index) => (
                      <tr key={label} className={`${index % 2 === 1 ? 'bg-[#f7fafc]' : 'bg-white'} ${index > 0 ? 'border-t border-[#e0e3e5]' : ''}`}>
                        <td className="px-8 py-[22px] font-semibold">{label}</td>
                        <td className="px-8 py-[22px] font-medium text-[#44474c]">{metric}</td>
                        <td className="px-8 py-[22px] font-medium text-[#44474c]">{imperial}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Columna derecha: precio, optimizador y confianza */}
        <aside className="lg:col-span-4 flex flex-col gap-[22px] min-w-0">
          <div className="bg-white border border-[#e0e3e5] rounded-[5px] p-[34px] flex flex-col gap-[22px] shadow-[0_5px_8px_-1px_rgba(0,0,0,0.1),0_3px_5px_-1px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-[5px]">
              <div className="font-mono font-bold text-base text-[#44474c] tracking-[0.05em] uppercase leading-[22px]">
                Base price (FOB Shanghai)
              </div>
              <div className="flex items-baseline gap-[11px] flex-wrap">
                <span className="text-5xl xl:text-[65px] font-bold tracking-[-0.02em] leading-[1.17]">{money(container.price)}</span>
                <span className="text-[22px] text-[#44474c]">USD / unit</span>
              </div>
            </div>
            <hr className="border-[#e0e3e5]" />
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-brand-orange hover:brightness-95 transition rounded-[5px] py-[22px] flex items-center justify-center gap-[11px] font-mono font-bold text-base tracking-[0.05em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
            >
              <img src={iconAddCart} alt="" className="h-[28.35px] w-[27.945px]" />
              {inCart ? 'View in Logistics Cart' : 'Add to Logistics Cart'}
            </button>
            <p className="text-center text-[19px] text-[#44474c] pt-[11px]">Volume discounts applied at checkout.</p>
          </div>

          <div className={darkCard}>
            <div className="absolute -right-[86px] -top-[86px] size-[173px] rounded-[16px] bg-[rgba(210,228,251,0.1)] blur-[16px]" />
            <div className="relative flex flex-col gap-[5px]">
              <div className="flex items-center gap-[11px]">
                <img src={iconOptimizer} alt="" className="size-[24.3px]" />
                <h2 className="text-[27px] font-semibold text-white leading-[38px]">Logistics Optimizer</h2>
              </div>
              <p className="text-[19px] text-[#b7c8de] leading-[27px]">
                Calculate real-time freight rates and estimated transit schedules.
              </p>
            </div>

            <form
              className="relative flex flex-col gap-[22px]"
              onSubmit={(e) => {
                e.preventDefault();
                handleEstimate();
              }}
            >
              <div className="flex flex-col gap-[5px]">
                <label htmlFor="origin-port" className="font-mono font-bold text-base text-[#d2e4fb] tracking-[0.05em] uppercase">Origin port</label>
                <div className="relative">
                  <InsetIcon src={iconAnchor} className="absolute left-4 top-1/2 -translate-y-1/2 h-[27px] w-[24.3px] pointer-events-none" />
                  <select
                    id="origin-port"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="appearance-none w-full bg-[rgba(247,250,252,0.1)] border border-[rgba(210,228,251,0.3)] rounded-[5px] pl-[55px] pr-[55px] py-3 text-[21.6px] text-white focus:outline-none focus:border-[#d2e4fb]"
                  >
                    {ports.map((p) => (
                      <option key={p.code} value={p.code} className="text-[#041627]">{p.port} ({p.code})</option>
                    ))}
                  </select>
                  <img src={iconSelectArrow} alt="" className="absolute right-3 top-1/2 -translate-y-1/2 size-[32.4px] pointer-events-none" />
                </div>
              </div>

              <div className="relative h-[19px] flex justify-center">
                <span className="absolute -top-[11px] bg-[#1a2b3c] border border-[rgba(210,228,251,0.3)] rounded-[16px] p-[7px]">
                  <InsetIcon src={iconSwap} className="size-[12.6px]" />
                </span>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label htmlFor="destination-port" className="font-mono font-bold text-base text-[#d2e4fb] tracking-[0.05em] uppercase">Destination port</label>
                <div className="relative">
                  <InsetIcon src={iconLocation} className="absolute left-4 top-1/2 -translate-y-1/2 h-[27px] w-[21.6px] pointer-events-none" />
                  <input
                    id="destination-port"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Los Angeles (USLAX)"
                    className="w-full bg-white border border-[#74777d] rounded-[5px] pl-[55px] pr-[23px] py-[15px] text-[21.6px] text-[#041627] placeholder:text-[#6b7280] focus:outline-none focus:border-brand-orange"
                  />
                </div>
                {error && <p role="alert" className="text-sm text-[#ffb4ab]">{error}</p>}
              </div>

              <button
                type="submit"
                className="mt-[11px] bg-white hover:bg-[#f1f4f6] transition-colors border border-[#c4c6cd] rounded-[5px] py-[17px] flex items-center justify-center gap-[11px] font-mono font-bold text-base text-[#041627] tracking-[0.05em]"
              >
                <img src={iconCalc} alt="" className="size-[24.3px]" />
                Estimate Shipping
              </button>
            </form>

            {estimate && (
              <div className="relative bg-[rgba(247,250,252,0.05)] border border-[rgba(210,228,251,0.1)] rounded-[3px] p-[23px] flex flex-col gap-[11px]">
                <div className="flex items-center justify-between gap-4 text-[19px]">
                  <span className="text-[#b7c8de]">Est. Ocean Freight</span>
                  <span className="font-mono font-semibold text-white">{estimate.range}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[19px]">
                  <span className="text-[#b7c8de]">Transit Time</span>
                  <span className="font-mono font-semibold text-white">{estimate.transit}</span>
                </div>
              </div>
            )}
          </div>

          {container.extras && (
            <div className={darkCard}>
              <div className="absolute -right-[86px] -top-[86px] size-[173px] rounded-[16px] bg-[rgba(210,228,251,0.1)] blur-[16px]" />
              <div className="relative flex flex-col gap-[5px]">
                <div className="flex items-center gap-[11px]">
                  <img src={iconOptimizer} alt="" className="size-[24.3px]" />
                  <h2 className="text-[27px] font-semibold text-white leading-[38px]">Additional Specs</h2>
                </div>
                <p className="text-[19px] text-[#b7c8de] leading-[27px]">Specifications for the refrigerated container.</p>
              </div>
              <div className="relative bg-[rgba(247,250,252,0.05)] border border-[rgba(210,228,251,0.1)] rounded-[3px] p-[23px] flex flex-col gap-[11px]">
                {container.extras.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 text-[19px]">
                    <span className="text-[#b7c8de]">{label}</span>
                    <span className="font-mono font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ul className="pt-[22px] flex flex-col gap-4 text-[19px] text-[#44474c]">
            <li className="flex items-center gap-4"><img src={iconTrustIso} alt="" className="h-[22.5px] w-[18px]" />ISO 9001 Certified Manufacturing</li>
            <li className="flex items-center gap-4"><img src={iconTrustWarranty} alt="" className="h-[22.5px] w-[18px]" />5-Year Structural Warranty</li>
            <li className="flex items-center gap-4"><img src={iconTrustCsc} alt="" className="h-[22.5px] w-[20.752px]" />CSC Plated for International Freight</li>
          </ul>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
