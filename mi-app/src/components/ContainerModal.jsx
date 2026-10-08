import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ContainerModal({ container, onClose }) {
  const { reserveContainer } = useApp();
  const [reserved, setReserved] = useState(false);

  if (!container) return null;

  const handleReserve = () => {
    setReserved(true);
    reserveContainer(container.id);
    setTimeout(() => {
      setReserved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="relative h-56 bg-slate-900">
          <img src={container.image} alt={container.title} className="w-full h-full object-cover opacity-90" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded">
              {container.status}
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">{container.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed">{container.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <div className="text-slate-400 font-medium">Volume Cap</div>
              <div className="font-bold text-slate-900 mt-0.5">{container.cap}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Max Payload</div>
              <div className="font-bold text-slate-900 mt-0.5">{container.maxWeight}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Tare Weight</div>
              <div className="font-bold text-slate-900 mt-0.5">{container.tare}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">ISO Code</div>
              <div className="font-bold text-slate-900 mt-0.5 font-mono">{container.iso}</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <Link
            to={`/containers/${container.id}`}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded hover:bg-slate-100"
          >
            View details
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded hover:bg-slate-100"
          >
            Close
          </button>
          <button 
            onClick={handleReserve}
            disabled={reserved}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors shadow disabled:opacity-50"
          >
            {reserved ? 'Reserving...' : 'Reserve Equipment'}
          </button>
        </div>

      </div>
    </div>
  );
}