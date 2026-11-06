import { useState } from 'react';
import { TrendingDown } from 'lucide-react';

export default function MarketTrend() {
  const [timeframe, setTimeframe] = useState('30D');

  return (
    <div className="bg-navy-900 text-white rounded-md p-5 shadow-lg border border-slate-800 flex flex-col gap-4">
      {/* Header & Filter Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm font-sans flex items-center gap-2">
          <TrendingDown className="size-4 text-brand-orange" />
          Market Trend
        </h3>
        <div className="flex gap-1 bg-navy-800 p-1 rounded text-[10px] font-mono">
          {['30D', '60D', '90D'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-2 py-0.5 rounded ${
                timeframe === t ? 'bg-white text-navy-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Highlight */}
      <div className="flex items-baseline gap-2 font-mono">
        <span className="text-3xl font-extrabold text-brand-orange">-4.2%</span>
        <span className="text-xs text-slate-400">vs last period</span>
      </div>

      {/* Bar Chart Visualizer */}
      <div className="h-28 flex items-end gap-2 pt-2 border-b border-slate-800 pb-2">
        <div className="flex-1 bg-slate-700/80 rounded-t h-[80%]" title="Week 1" />
        <div className="flex-1 bg-slate-700/80 rounded-t h-[95%]" title="Week 2" />
        <div className="flex-1 bg-slate-700/80 rounded-t h-[85%]" title="Week 3" />
        <div className="flex-1 bg-slate-700/80 rounded-t h-[65%]" title="Week 4" />
        <div className="flex-1 bg-brand-orange rounded-t h-[55%]" title="Current" />
      </div>

      {/* Historical Trend Note */}
      <p className="text-xs text-slate-400 leading-relaxed font-sans">
        Rates on the <strong className="text-white">SHA → LAX</strong> lane have stabilized after a minor drop mid-month. Capacity remains tight for early next month.
      </p>
    </div>
  );
}