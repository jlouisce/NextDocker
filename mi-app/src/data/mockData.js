export const equipmentOptions = [
  { id: '20ft-standard', name: "20' Standard Steel Container", type: 'Standard' },
  { id: '40ft-hc', name: "40' High Cube Container", type: 'High Cube' },
  { id: 'reefer', name: "40' Refrigerated (Reefer)", type: 'Reefer' },
];

export const lanesData = [
  {
    id: 'lane-1',
    carrier: 'Oceania Line',
    code: 'CNSHA → USLAX',
    origin: 'Shanghai (CNSHA)',
    destination: 'Los Angeles (USLAX)',
    transitTime: '14 Days',
    frequency: 'Weekly',
    rate: 1350,
    status: 'AVAILABLE',
  },
  {
    id: 'lane-2',
    carrier: 'Pacific Direct',
    code: 'CNSHA → NLRTM',
    origin: 'Shanghai (CNSHA)',
    destination: 'Rotterdam (NLRTM)',
    transitTime: '22 Days',
    frequency: 'Bi-weekly',
    rate: 1400,
    status: 'AVAILABLE',
  },
  {
    id: 'lane-3',
    carrier: 'Express Cargo',
    code: 'USLAX → NLRTM',
    origin: 'Los Angeles (USLAX)',
    destination: 'Rotterdam (NLRTM)',
    transitTime: '18 Days',
    frequency: 'Weekly',
    rate: 1650,
    status: 'LIMITED',
  },
];

export const containersData = [
  {
    id: '20ft-standard',
    title: "20' Standard Steel Container",
    description: 'Durable, weather-resistant steel container suitable for general intermodal freight.',
    image: '/assets/figma/cart-20ft.jpg',
    price: 2100,
    unitCost: 2100,
    sku: 'STD-20-BLU-441',
    payload: '21,770 kg',
    origins: [
      { port: 'Shanghai', code: 'CNSHA', freight: 1200 },
      { port: 'Rotterdam', code: 'NLRTM', freight: 1400 },
      { port: 'Los Angeles', code: 'USLAX', freight: 1300 },
    ],
  },
  {
    id: '40ft-hc',
    title: "40' High Cube Container",
    description: 'Maximum volume efficiency. Designed for lighter, voluminous cargo demanding extra headspace.',
    image: '/assets/figma/container-40ft-hc.png',
    price: 3458,
    unitCost: 3200,
    sku: 'HC3-40-BLU-E92',
    payload: '28,600 kg',
    origins: [
      { port: 'Shanghai', code: 'CNSHA', freight: 1800 },
      { port: 'Rotterdam', code: 'NLRTM', freight: 2100 },
      { port: 'Los Angeles', code: 'USLAX', freight: 1950 },
    ],
  },
  {
    id: 'reefer',
    title: "40' Refrigerated (Reefer)",
    description: 'Precision temperature-controlled environment for perishable food, pharmaceuticals, and sensitive freight.',
    image: '/assets/figma/container-reefer.png',
    price: 4950,
    unitCost: 4500,
    sku: 'RFR-40-WHT-107',
    payload: '28,180 kg',
    origins: [
      { port: 'Shanghai', code: 'CNSHA', freight: 2600 },
      { port: 'Rotterdam', code: 'NLRTM', freight: 2900 },
      { port: 'Los Angeles', code: 'USLAX', freight: 2800 },
    ],
  },
];

export const cartCatalog = {
  '20ft-standard': {
    title: "20' Standard Steel Container",
    sku: 'STD-20-BLU-441',
    payload: '21,770 kg',
    unitCost: 2100,
    baseOrigin: 'Shanghai (CNSHA)',
    image: '/assets/figma/cart-20ft.jpg',
  },
  '40ft-hc': {
    title: "40' High Cube Container",
    sku: 'HC3-40-BLU-E92',
    payload: '28,600 kg',
    unitCost: 3200,
    baseOrigin: 'Shanghai (CNSHA)',
    image: '/assets/figma/container-40ft-hc.png',
  },
  'reefer': {
    title: "40' Refrigerated (Reefer)",
    sku: 'RFR-40-WHT-107',
    payload: '28,180 kg',
    unitCost: 4500,
    baseOrigin: 'Shanghai (CNSHA)',
    image: '/assets/figma/container-reefer.png',
  },
};