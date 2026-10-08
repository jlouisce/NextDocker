import React, { useRef, useState } from 'react';
import Footer from '../components/Footer';
import ContainerModal from '../components/ContainerModal';
import { useApp } from '../context/AppContext';
import heroImage from '../assets/figma/hero-container.png';
import iconPin from '../assets/figma/icon-pin.png';
import iconBox from '../assets/figma/icon-box.png';
import iconSearch from '../assets/figma/icon-search.png';
import dotGreen from '../assets/figma/dot-green.svg';
import dotBlue from '../assets/figma/dot-blue.svg';
import mapWatermark from '../assets/figma/map.svg';
import featureRouting from '../assets/figma/feature-routing.png';
import featureBooking from '../assets/figma/feature-booking.png';
import featureRates from '../assets/figma/feature-rates.png';
import featureCertification from '../assets/figma/feature-certification.png';

const bentoCard = 'border border-[#2c2c2c] rounded-[3px] p-8';

export default function LandingPage() {
  const { containers } = useApp();
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchPort, setSearchPort] = useState('');
  const [selectedContainer, setSelectedContainer] = useState(null);
  const catalogRef = useRef(null);

  const filteredContainers = containers.filter((item) => {
    const matchesType = selectedType === 'ALL' || item.title.toLowerCase().includes(selectedType.toLowerCase());
    return matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f3] text-black font-sans">

      {/* HERO + BUSCADOR */}
      <section className="relative bg-slate-950 text-[#f9f9f9] py-16 lg:py-[98px] px-6 overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-[rgba(24,24,24,0.8)]" />

        <div className="relative z-10 max-w-[1215px] mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-[70px] font-semibold tracking-[-0.05em] leading-tight mb-4">
            Find Containers in Any Port
          </h1>
          <p className="text-base md:text-[26px] font-medium tracking-[-0.03em] max-w-[910px] mx-auto mb-10">
            Global procurement simplified. Source, track, and manage industrial-grade shipping containers across our worldwide network with structural precision
          </p>

          <div className="bg-[#d9d9d9]/60 p-3 lg:px-[13px] lg:py-[6px] grid grid-cols-1 lg:grid-cols-[1fr_1fr_258px] gap-3 lg:gap-[11px] text-left font-mono text-lg text-black lg:mt-[84px]">
            <div>
              <label htmlFor="origin-port" className="block tracking-[-0.01em] mb-1">Origin Port</label>
              <div className="bg-white/90 h-[67px] flex items-center gap-4 px-[18px]">
                <img src={iconPin} alt="" className="h-[36px] w-[30px] object-cover" />
                <input
                  id="origin-port"
                  type="text"
                  value={searchPort}
                  onChange={(e) => setSearchPort(e.target.value)}
                  placeholder="e.g. Shanghai, Rotterdam, Los Angeles"
                  className="w-full bg-transparent focus:outline-none tracking-[-0.04em] placeholder:text-black/80 text-base lg:text-lg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="container-type" className="block tracking-[-0.01em] mb-1">Container type</label>
              <div className="bg-[#f1f4f6]/90 h-[67px] flex items-center gap-4 px-[11px]">
                <img src={iconBox} alt="" className="h-[37px] w-[41px] object-cover" />
                <select
                  id="container-type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-transparent focus:outline-none tracking-[-0.04em] cursor-pointer"
                >
                  <option value="ALL">All Types</option>
                  <option value="20ft">20ft Standard</option>
                  <option value="40ft">40ft High Cube</option>
                  <option value="Refrigerated">Refrigerated (Reefer)</option>
                </select>
              </div>
            </div>

            <div className="flex lg:items-end">
              <button
                type="button"
                onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full h-[67px] bg-brand-orange/90 hover:bg-brand-orange flex items-center justify-center gap-4 text-[15px] tracking-[0.09em] transition-colors"
              >
                <img src={iconSearch} alt="" className="h-[39px] w-[41px] object-cover" />
                Search Fleet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DINÁMICO */}
      <section ref={catalogRef} className="bg-white py-16 lg:py-[66px] px-6 lg:px-[59px]">
        <div className="text-center mb-12 lg:mb-[90px]">
          <h2 className="text-2xl lg:text-[30px] tracking-[0.06em]">Available Equipment</h2>
          <p className="font-roboto font-light text-base lg:text-xl tracking-[0.08em] mt-2">
            Ready for immediate deployment across key global hubs.
          </p>
        </div>

        <div className="max-w-[1633px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-[40px]">
          {filteredContainers.map((item) => (
            <article key={item.id} className="bg-[#f9f9f9] flex flex-col pb-[25px]">
              <div className="relative h-[265px] bg-slate-200 overflow-hidden">
                <img src={item.image} alt={item.title} className="size-full object-cover" />
                <span className="absolute top-[5px] right-[10px] bg-[#f7fafc] rounded-lg h-[34px] px-3 flex items-center gap-2 font-mono text-base tracking-[-0.04em]">
                  <img src={item.statusColor === 'emerald' ? dotGreen : dotBlue} alt="" className="size-3" />
                  {item.status}
                </span>
              </div>

              <div className="px-[21px] pt-[7px] flex-1 flex flex-col">
                <h3 className="text-[28px] lg:text-[32px] leading-[47px]">{item.title}</h3>
                <p className="text-lg lg:text-[21px] font-light min-h-[94px] pr-2">{item.description}</p>
                <div className="font-mono text-base lg:text-xl flex justify-between gap-4 mt-auto mb-[35px] px-[10px]">
                  <span>{item.capLabel || 'Cap'}: {item.cap}</span>
                  <span>{item.maxLabel || 'Max'}: {item.maxWeight}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContainer(item)}
                  className="h-[41px] w-full bg-[#fcfcfc] border border-[#262626] text-[#222] font-mono text-lg hover:bg-[#262626] hover:text-white transition-colors"
                >
                  View Inventory
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="px-6 lg:px-[55px] py-16 lg:py-[67px] mb-8 lg:mb-[128px]">
        <div className="text-center mb-12 lg:mb-[90px]">
          <h2 className="text-2xl lg:text-[30px] tracking-[0.06em]">Smart Logistics Optimization</h2>
          <p className="font-roboto font-light text-base lg:text-xl tracking-[0.08em] mt-2">
            Data-driven procurement for the modern supply chain.
          </p>
        </div>

        <div className="max-w-[1622px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
          <div className={`${bentoCard} relative overflow-hidden min-h-[420px] lg:min-h-[659px] lg:pl-[42px]`}>
            <img src={featureRouting} alt="" className="h-[43px] w-[48px] object-cover -scale-y-100 mt-[10px]" />
            <h3 className="text-xl lg:text-[25px] font-light tracking-[0.06em] mt-[33px]">Dynamic Routing &amp; Sourcing</h3>
            <p className="font-roboto font-light text-lg lg:text-xl tracking-[0.01em] leading-[1.114] max-w-[425px] mt-3">
              Our algorithm identifies the most cost-effective container positioning based on real time-port congestion and freight lane demands.
            </p>
            <img src={mapWatermark} alt="" className="absolute right-0 bottom-8 size-[246px] opacity-20 hidden lg:block" />
          </div>

          <div className="flex flex-col gap-[14px]">
            <div className={`${bentoCard} bg-navy-800 text-white min-h-[200px] lg:min-h-[322px] flex items-start gap-6 lg:pl-[18px] pt-[40px]`}>
              <img src={featureCertification} alt="" className="h-[81px] w-[96px] object-cover shrink-0" />
              <div>
                <h3 className="text-xl lg:text-[28px] font-semibold">Grade-A Certification</h3>
                <p className="font-roboto font-light text-base lg:text-xl text-[#fafafa] tracking-[0.01em] mt-3">
                  Every unit undergoes strict structural integrity testing before listing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              <div className={`${bentoCard} min-h-[322px] flex flex-col lg:px-[22px]`}>
                <img src={featureBooking} alt="" className="h-[41px] w-[43px] object-cover" />
                <h3 className="text-xl lg:text-[25px] font-light tracking-[0.06em] mt-4">Instant Booking</h3>
                <p className="font-roboto font-light text-lg lg:text-xl tracking-[0.01em] leading-[1.114] mt-auto max-w-[273px]">
                  Bypass brokers. Secure assets instantly via secure API.
                </p>
              </div>
              <div className={`${bentoCard} min-h-[322px] flex flex-col lg:px-[18px]`}>
                <img src={featureRates} alt="" className="h-[43px] w-[48px] object-cover" />
                <h3 className="text-xl lg:text-[25px] font-light tracking-[0.06em] mt-3">Market Rates</h3>
                <p className="font-roboto font-light text-lg lg:text-xl tracking-[0.01em] leading-[1.114] mt-auto max-w-[357px]">
                  Transparent pricing historically pegged to global shipping indices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ContainerModal
        container={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </div>
  );
}
