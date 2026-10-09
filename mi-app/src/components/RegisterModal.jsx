import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Anchor, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RegisterModal({ onClose, onSuccess, initialRole = 'observer' }) {
  const { registerUser } = useApp();
  const [activeRole, setActiveRole] = useState(initialRole); // 'observer' | 'provider' | 'port_owner'

  // Estados de formularios
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    serviceType: ''
  });

  const [errors, setErrors] = useState({});

  // Validar formato de email único/válido
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones por Rol
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    }

    if (activeRole !== 'observer') {
      if (!formData.email || !validateEmail(formData.email)) {
        newErrors.email = 'Ingrese un correo electrónico válido.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono de contacto es obligatorio.';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'La dirección comercial es obligatoria.';
      }
      if (!formData.country.trim()) {
        newErrors.country = 'Indique el país de locación.';
      }
      if (!formData.serviceType.trim()) {
        newErrors.serviceType = 'Especifique el servicio ofrecido.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Registrar perfil
    const payload = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      role: activeRole,
      name: formData.name,
      ...(activeRole !== 'observer' && {
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        country: formData.country,
        serviceType: formData.serviceType
      })
    };

    registerUser(payload);
    if (onSuccess) onSuccess(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Encabezado */}
        <div className="bg-slate-950 text-white p-6 flex justify-between items-center border-b border-slate-800">
          <div>
            <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> Registro de Usuario
            </h2>
            <p className="text-xs text-slate-400">Seleccione su perfil operativo en NextDocker.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestañas de Roles */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 border-b border-slate-200 text-[11px] font-bold">
          <button
            onClick={() => { setActiveRole('observer'); setErrors({}); }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeRole === 'observer' ? 'bg-white text-slate-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Observador
          </button>
          
          <button
            onClick={() => { setActiveRole('provider'); setErrors({}); }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeRole === 'provider' ? 'bg-white text-slate-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-500" /> Prestador
          </button>

          <button
            onClick={() => { setActiveRole('port_owner'); setErrors({}); }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeRole === 'port_owner' ? 'bg-white text-slate-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Anchor className="w-3.5 h-3.5 text-amber-500" /> Dueño Puerto
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Nombre / Usuario (Común a todos) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nombre Completo / Usuario *</label>
            <input
              type="text"
              name="name"
              placeholder="Ej. Carlos Mendoza"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 bg-slate-50 focus:outline-none ${
                errors.name ? 'border-rose-500' : 'border-slate-300 focus:border-amber-500'
              }`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Mensaje descriptivo para Observador */}
          {activeRole === 'observer' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-[11px] leading-relaxed">
              <strong>Pre-Checkout Rápido:</strong> Como observador no requiere registro complejo. Ingrese su nombre para asociar y guardar su cotización de contenedor inmediatamente.
            </div>
          )}

          {/* Campos requeridos para Prestadores de Servicio y Dueños de Puertos */}
          {activeRole !== 'observer' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contacto@empresa.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 bg-slate-50 focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-slate-300 focus:border-amber-500'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil / Whatsapp *</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+57 300 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 bg-slate-50 focus:outline-none ${
                      errors.phone ? 'border-rose-500' : 'border-slate-300 focus:border-amber-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dirección Comercial *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Av. Puerto Madero #402"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 bg-slate-50 focus:outline-none ${
                      errors.address ? 'border-rose-500' : 'border-slate-300 focus:border-amber-500'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-rose-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">País de Locación *</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Ej. Colombia, Panamá, China"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 bg-slate-50 focus:outline-none ${
                      errors.country ? 'border-rose-500' : 'border-slate-300 focus:border-amber-500'
                    }`}
                  />
                  {errors.country && <p className="text-[10px] text-rose-500 mt-1">{errors.country}</p>}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {activeRole === 'provider' ? 'Servicios Ofrecidos *' : 'Nombre de Terminal / Servicios Portuarios *'}
                </label>
                <input
                  type="text"
                  name="serviceType"
                  placeholder={
                    activeRole === 'provider'
                      ? 'Ej. Flota de Transporte Terrestre / Venta de Dry Containers 20ft'
                      : 'Ej. Puerto de Buenaventura - Terminal Contenedores y Almacenamiento'
                  }
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 bg-slate-50 focus:outline-none ${
                    errors.serviceType ? 'border-rose-500' : 'border-slate-300 focus:border-amber-500'
                  }`}
                />
                {errors.serviceType && <p className="text-[10px] text-rose-500 mt-1">{errors.serviceType}</p>}
              </div>
            </>
          )}

          {/* Botones de Acción */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-2 rounded-lg shadow-md transition-colors"
            >
              Completar Registro
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}