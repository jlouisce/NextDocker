import React from 'react';
import { FileText } from 'lucide-react';

export default function RateBreakdown({ items, total = '3,250' }) {
  const defaultBreakdown = [
    { label: 'Base Ocean Freight', amount: '$2,450' },
    { label: 'BAF (Fuel)', amount: '$380' },
    { label: 'CAF', amount: '$120' },
    { label: 'Port Handling (THC)', amount: '$250' },
    { label: 'Documentation', amount: '$50' },
  ];

  const list = items || defaultBreakdown;

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <FileText className="size-4 text-slate-700" />
        <h3 className="font-bold text-slate-900 text-sm font-sans">
          Rate Breakdown
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-4 font-sans leading-relaxed">
        Estimated average breakdown for standard 40' HC on this lane.
      </p>

      <div className="flex flex-col gap-2.5 font-mono text-xs">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-slate-600 border-b border-dashed border-slate-200 pb-1.5"
          >
            <span>{item.label}</span>
            <span className="font-semibold text-slate-900">{item.amount}</span>
          </div>
        ))}

        <div className="flex justify-between items-center pt-3 mt-1 bg-slate-100 p-2.5 rounded border border-slate-200 text-slate-900 font-bold">
          <span>Estimated Total</span>
          <span className="text-sm font-mono">${total}</span>
        </div>
      </div>
    </div>
  );
}