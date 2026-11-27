// Formatea una fecha 'YYYY-MM-DD' para mostrarla en pantalla.
// Se agrega 'T00:00:00' para que se interprete en hora local; con new Date('2026-12-11')
// el navegador la toma como medianoche UTC y en Colombia (UTC-5) mostraria el dia anterior.
export const formatShipDate = (value) => {
  if (!value) return 'Not set';
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
