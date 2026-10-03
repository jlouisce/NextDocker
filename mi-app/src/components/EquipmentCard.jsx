import React from 'react';

export default function EquipmentCard({ 
  title, 
  description, 
  capacity, 
  maxWeight, 
  status = "Available", 
  imageUrl,
  onViewInventory 
}) {
  const isAvailable = status === "Available";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Imagen y Badge de Estado */}
      <div className="relative h-48 bg-gray-100">
        <img 
          src={imageUrl || "https://via.placeholder.com/400x250?text=Container"} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <span 
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isAvailable 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
              : 'bg-amber-100 text-amber-700 border border-amber-300'
          }`}
        >
          ● {status}
        </span>
      </div>

      {/* Contenido principal */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs text-gray-600 mb-4 line-clamp-2">{description}</p>
        </div>

        {/* Especificaciones */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-md border border-gray-100 mb-4">
          <div>
            <span className="text-gray-400 block">Cap:</span>
            <span className="font-semibold text-gray-700">{capacity}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Max:</span>
            <span className="font-semibold text-gray-700">{maxWeight}</span>
          </div>
        </div>

        {/* Botón de acción */}
        <button 
          onClick={onViewInventory}
          className="w-full py-2 px-4 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          View Inventory
        </button>
      </div>
    </div>
  );
}