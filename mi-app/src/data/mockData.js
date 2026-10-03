export const containersData = [
  {
    id: '20ft',
    title: '20ft Standard',
    status: 'Available',
    statusColor: 'emerald',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'Precision climate control. Engineered for perishable goods requiring strict temperature adherence.',
    cap: 'Temp: -30°C to +30°C',
    maxWeight: 'Power: 380/460V',
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