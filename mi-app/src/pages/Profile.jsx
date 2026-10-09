import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Globe, Building, Trash2, Edit3, 
  CheckCircle, Ship, Anchor, Truck, UserCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const context = useApp() || {};
  const { user, updateUser, reservations = [], cancelReservation } = context;

  // Perfil por defecto en caso de que user sea null para garantizar cero caídas
  const currentUser = user || {
    id: 'USR-GUEST',
    name: 'Sarah Jenkins',
    email: 's.jenkins@transglobal.com',
    role: 'observer',
    company: 'Logistics Director'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    address: currentUser.address || '',
    country: currentUser.country || '',
    serviceType: currentUser.serviceType || '',
    company: currentUser.company || 'Logistics Director'
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (updateUser) {
      updateUser(formData);
    }
    setIsEditing(false);
  };

  // Cálculo seguro del total acumulado de reservas
  const totalAmount = (reservations || []).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  // Distintivo de Rol Registrado
  const getRoleBadge = (role) => {
    switch (role) {
      case 'provider':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit mt-1">
            <Truck className="w-3 h-3 text-amber-600" /> Prestador de Servicios
          </span>
        );
      case 'port_owner':
        return (
          <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit mt-1">
            <Anchor className="w-3 h-3 text-blue-600" /> Dueño de Puerto
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit mt-1">
            <UserCheck className="w-3 h-3 text-slate-600" /> Observador
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Client Account & Order Summary</h1>
        <p className="text-xs text-slate-500 mt-1">Manage user identity, active container reservations, and quote summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TARJETA DE PERFIL Y DATOS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 self-start">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
                {(currentUser.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">{currentUser.name || 'Usuario'}</h2>
                {getRoleBadge(currentUser.role)}
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-slate-400 hover:text-amber-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              title="Editar Perfil"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-3 text-xs text-slate-600">
              {currentUser.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{currentUser.email}</span>
                </div>
              )}
              {currentUser.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser.country && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>{currentUser.country}</span>
                </div>
              )}
              {currentUser.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{currentUser.address}</span>
                </div>
              )}
              {currentUser.serviceType && (
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
                  <Building className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-800">Servicio / Operación:</strong>
                    <p className="text-slate-600 mt-0.5">{currentUser.serviceType}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">País</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RESUMEN DE RESERVAS / COTIZACIONES (PRE-CHECKOUT) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">Reserved Fleet & Saved Quotes</h2>
                <p className="text-xs text-slate-500">Active container bookings and pre-checkout estimates associated with your account.</p>
              </div>
              <span className="bg-amber-50 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200">
                {(reservations || []).length} {(reservations || []).length === 1 ? 'Unit' : 'Units'}
              </span>
            </div>

            {(reservations || []).length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Ship className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">No active container bookings or saved quotes found.</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Explore the Marketplace to reserve equipment or generate pre-checkout quotes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(reservations || []).map((item, idx) => (
                  <div
                    key={item.bookingId || item.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-950 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Ship className="w-6 h-6 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xs">{item.title}</h3>
                        <p className="text-[11px] text-slate-500">
                          Booking ID: <span className="font-mono text-amber-600 font-bold">{item.bookingId || item.id}</span> | {item.port}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                      <span className="font-mono font-black text-emerald-600 text-sm">
                        ${(Number(item.price) || 2400).toLocaleString()} USD
                      </span>
                      {cancelReservation && (
                        <button
                          onClick={() => cancelReservation(item.id || item.bookingId)}
                          className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Cancelar Reserva"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* RESUMEN TOTAL DE COMPRA */}
                <div className="bg-slate-950 text-white p-5 rounded-xl flex items-center justify-between border border-slate-800 shadow-md">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Estimated Order</span>
                    <span className="text-2xl font-black text-amber-400">${totalAmount.toLocaleString()} USD</span>
                  </div>
                  <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-lg text-xs shadow-md transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}