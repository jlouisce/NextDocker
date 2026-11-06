import { Link } from 'react-router-dom';

export default function FreightCard({ rate }) {
  const isFastest = rate.tag === 'Fastest';

  return (
    <div
      className={`bg-white border rounded-md p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isFastest ? 'border-brand-orange shadow-sm' : 'border-slate-200'
      }`}
    >
      {/* Carrier Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="size-12 bg-slate-100 rounded flex items-center justify-center font-mono font-bold text-slate-700 text-sm shrink-0">
          {rate.carrierCode || 'LOG'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-base">{rate.carrier}</h4>
            {rate.tag && (
              <span className="bg-brand-orange text-navy-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {rate.tag}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 mt-0.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            {rate.status || 'AVAILABLE'}
          </span>
        </div>
      </div>

      {/* Route Details */}
      <div className="flex items-center justify-between md:justify-center gap-8 w-full md:w-auto text-xs font-mono text-slate-600">
        <div>
          <span className="block text-[10px] uppercase text-slate-400 font-bold">Transit Time</span>
          <span className="font-semibold text-slate-900">{rate.transitTime}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase text-slate-400 font-bold">Frequency</span>
          <span className="font-semibold text-slate-900">{rate.frequency}</span>
        </div>
      </div>

      {/* Pricing & CTA Actions */}
      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
        <div className="text-right">
          <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">Total Rate</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">${rate.price}</span>
          <span className="text-[10px] font-mono text-slate-500 ml-1">USD</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-mono text-xs font-bold rounded uppercase transition-colors"
          >
            Details
          </button>
          <Link
            to="/cart"
            className="px-4 py-2 bg-navy-900 text-white hover:bg-navy-800 font-mono text-xs font-bold rounded uppercase transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}