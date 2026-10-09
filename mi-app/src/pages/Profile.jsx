import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, PackageCheck, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser, reservations = [], cancelReservation } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const totalAmount = reservations.reduce((acc, item) => acc + (item.price || 2400), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* TARJETA DE PERFIL (EDITABLE) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 h-fit">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center font-extrabold text-slate-950 text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">{user?.name}</h2>
                  <p className="text-xs text-slate-500">{user?.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-slate-400 hover:text-amber-500 p-1"
                title="Edit Profile"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 border-t pt-3">{user?.email}</p>
          </>
        ) : (
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-bold text-slate-800">Edit Profile</span>
              <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-2.5 py-1.5 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Role / Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full border rounded px-2.5 py-1.5 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded px-2.5 py-1.5 text-slate-800"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded flex items-center justify-center gap-1.5 mt-2"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </form>
        )}
      </div>

      {/* RESUMEN DE ORDEN Y PEDIDOS DEL CLIENTE */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-amber-500" /> Client Order Summary & Reserved Fleet
        </h2>

        {reservations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500 shadow-sm">
            No active container bookings or orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((item) => (
              <div key={item.id || item.bookingId} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title || item.type || 'Container Unit'}</h3>
                  <p className="text-xs text-slate-500">
                    Port: {item.port || 'Shanghai'} | ID: {item.id || item.bookingId}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-emerald-600">
                    ${(item.price || 2400).toLocaleString()} USD
                  </span>
                  <button 
                    onClick={() => cancelReservation(item.id || item.bookingId)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1.5"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-slate-900 text-white rounded-xl p-6 flex justify-between items-center mt-6 shadow-md">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Total Order Summary</span>
                <p className="text-2xl font-extrabold text-amber-400">${totalAmount.toLocaleString()} USD</p>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}