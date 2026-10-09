import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingNumber) return;
    setSearchResult({
      code: trackingNumber,
      status: 'In Transit',
      origin: 'Shanghai (CNSHA)',
      destination: 'Rotterdam (NLRTM)',
      eta: 'Oct 24, 2026'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shipment Tracking</h1>
        <p className="text-xs text-slate-500">Track container status and estimated time of arrival in real time.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Container or Booking ID (e.g., BK-10293)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
        />
        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-lg text-sm flex items-center gap-2">
          <Search className="w-4 h-4" /> Track
        </button>
      </form>

      {searchResult && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="text-xs text-slate-400">Tracking Code</span>
              <p className="font-extrabold text-slate-800">{searchResult.code}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
              {searchResult.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Origin</span>
              <p className="font-bold text-slate-700">{searchResult.origin}</p>
            </div>
            <div>
              <span className="text-slate-400">Destination</span>
              <p className="font-bold text-slate-700">{searchResult.destination}</p>
            </div>
            <div>
              <span className="text-slate-400">Estimated Arrival</span>
              <p className="font-bold text-amber-600">{searchResult.eta}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}