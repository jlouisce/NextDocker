import React, { useState } from 'react';
import { X, CheckCircle, Ship, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RegisterModal from './RegisterModal';

export default function ContainerModal({ container, onClose }) {
  const { user, addReservation } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!container) return null;

  const executeBooking = () => {
    addReservation(container);
    onClose();
  };

  const handleBookingClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      executeBooking();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* ENCABEZADO */}
          <div className="bg-slate-950 text-white p-6 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Ship className="w-6 h-6 text-amber-500" />
              <div>
                <h2 className="font-extrabold text-lg text-white">{container.title}</h2>
                <p className="text-xs text-amber-400">ID: {container.id} | Location: {container.port}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {container.image ? (
                  <img src={container.image} alt={container.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 text-xs font-bold">No Image Available</div>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Unit Specifications</h3>
                <div className="space-y-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-bold text-slate-800">{container.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-bold text-slate-800">{container.specs?.capacity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Payload:</span>
                    <span className="font-bold text-slate-800">{container.specs?.maxPayload || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensions:</span>
                    <span className="font-bold text-slate-800">{container.specs?.dimensions || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t pt-4">
              {container.description || 'Industrial-grade shipping container inspected and certified for global maritime logistics.'}
            </p>

            {/* BOTÓN DE ACCIÓN */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Standard Rate</span>
                <p className="text-xl font-black text-emerald-600">${(container.price || 2400).toLocaleString()} USD</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={onClose} 
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBookingClick} 
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-2 rounded-lg text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  {user ? <CheckCircle className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />} 
                  {user ? 'Confirm Booking' : 'Pre-Checkout & Guardar'}
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Modal de Registro si falta autenticación */}
      {showAuthModal && (
        <RegisterModal
          initialRole="observer"
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            executeBooking();
          }}
        />
      )}
    </>
  );
}