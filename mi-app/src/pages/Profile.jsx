import React from 'react';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { user, reservations, cancelReservation } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      {/* Header */}
      <section className="bg-slate-950 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase">
              Verified Logistics Partner
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2">{user.name}</h1>
            <p className="text-slate-400 text-xs mt-1">{user.company} • {user.email}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-left md:text-right">
            <div className="text-[11px] text-slate-400">Active Bookings</div>
            <div className="text-2xl font-black text-amber-500">{reservations.length} Units</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 w-full flex-1">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span>📦</span> Active Equipment Reservations
        </h2>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="text-4xl mb-3">🏷️</div>
            <h3 className="text-base font-bold text-slate-800">No active reservations yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Explore our marketplace and reserve shipping containers directly to your preferred port.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Booking ID: <span className="font-mono font-semibold text-slate-700">{item.id}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Port: <span className="font-semibold text-slate-700">{item.port}</span> • Date: {item.date}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => cancelReservation(item.id)}
                  className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}