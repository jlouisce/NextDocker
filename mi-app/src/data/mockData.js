export const containers = [
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

export const ratesData = [
  { route: 'Shanghai (CNSHA) ➔ Rotterdam (NLRTM)', std20: 1850, hc40: 2950, reefer: 3800, trend: '+1.8%' },
  { route: 'Ningbo (CNNGB) ➔ Los Angeles (USLAX)', std20: 2100, hc40: 3200, reefer: 4150, trend: '-0.5%' },
  { route: 'Singapore (SGSIN) ➔ Hamburg (DEHAM)', std20: 1720, hc40: 2780, reefer: 3600, trend: '+2.4%' },
  { route: 'Antwerp (BEANT) ➔ New York (USNYC)', std20: 1450, hc40: 2250, reefer: 3100, trend: '+0.0%' }
];