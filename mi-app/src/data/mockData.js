import container20ft from '../assets/figma/hero-container.png';
import container40ftHc from '../assets/figma/container-40ft-hc.png';
import containerReefer from '../assets/figma/container-reefer.png';
import cart20ft from '../assets/figma/cart-20ft.jpg';
import cart40ft from '../assets/figma/cart-40ft.jpg';

export const containersData = [
  {
    id: '20ft',
    title: '20ft Standard',
    status: 'Available',
    statusColor: 'emerald',
    image: container20ft,
    description: 'The industry workhorse. Ideal for heavy goods and dry cargo across standard shipping lanes.',
    cap: '33.2 CBM',
    maxWeight: '28,200 KG',
    tare: '2,200 KG',
    iso: '22G1'
  },
  {
    id: '40ft-hc',
    title: '40ft High Cube',
    status: 'Available',
    statusColor: 'emerald',
    image: container40ftHc,
    description: 'Maximum volume efficiency. Designed for lighter, voluminous cargo demanding extra headspace.',
    cap: '76.4 CBM',
    maxWeight: '28,600 KG',
    tare: '3,800 KG',
    iso: '45G1'
  },
  {
    id: 'reefer',
    title: 'Refrigerated (Reefer)',
    status: 'Limited',
    statusColor: 'amber',
    image: containerReefer,
    description: 'Precision climate control. Engineered for perishable goods requiring strict temperature adherence.',
    capLabel: 'Temp',
    cap: '-30°C to +30°C',
    maxLabel: 'Power',
    maxWeight: '380/460V AC',
    tare: '4,480 KG',
    iso: '45R1'
  }
];

export const ratesData = [
  { id: 1, route: 'Shanghai (CNSHA) → Rotterdam (NLRTM)', ft20: '$1,850', ft40: '$2,950', reefer: '$3,800', trend: '+1.8%', positive: true },
  { id: 2, route: 'Ningbo (CNNGB) → Los Angeles (USLAX)', ft20: '$2,100', ft40: '$3,200', reefer: '$4,150', trend: '-0.5%', positive: false },
  { id: 3, route: 'Singapore (SGSIN) → Hamburg (DEHAM)', ft20: '$1,720', ft40: '$2,780', reefer: '$3,600', trend: '+2.4%', positive: true },
  { id: 4, route: 'Antwerp (BEANT) → New York (USNYC)', ft20: '$1,450', ft40: '$2,250', reefer: '$3,100', trend: '0.0%', positive: true }
];

// Ítems del carrito (Smart Cart). `freight` por origen es dato de ejemplo hasta tener la API de fletes.
export const cartItemsData = [
  {
    id: 'cart-40ft-hc',
    containerId: '40ft-hc',
    title: '40ft High Cube Dry Container',
    sku: 'HCD-40-BLU-892',
    payload: '28,600 kg',
    unitCost: 3200,
    image: cart40ft,
    baseOrigin: 'NLRTM',
    origins: [
      { code: 'NLRTM', port: 'Rotterdam', freight: 1850 },
      { code: 'CNSHA', port: 'Shanghai', freight: 1500 },
      { code: 'USLAX', port: 'Los Angeles', freight: 2300 },
    ],
  },
  {
    id: 'cart-20ft',
    containerId: '20ft',
    title: '20ft Standard Dry Container',
    sku: 'STD-20-BLU-441',
    payload: '21,770 kg',
    unitCost: 2100,
    image: cart20ft,
    baseOrigin: 'CNSHA',
    origins: [
      { code: 'CNSHA', port: 'Shanghai', freight: 1200 },
      { code: 'NLRTM', port: 'Rotterdam', freight: 1350 },
      { code: 'USLAX', port: 'Los Angeles', freight: 1750 },
    ],
  },
];
