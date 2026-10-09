import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const specLabel = 'font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#74777d]';

export default function ContainerModal({ container, onClose }) {
  const { addToCart, cart } = useApp();
  const [added, setAdded] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    if (!container) return undefined;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [container, onClose]);

  if (!container) return null;

  const inCart = cart.some((item) => item.containerId === container.id);

  // Retroalimentación breve ("Added") antes de cerrar
  const handleAdd = () => {
    addToCart(container.id);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#041627]/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={container.title}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[5px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#c4c6cd]"
      >
        <div className="relative h-48 sm:h-56 bg-[#041627]">
          <img src={container.image} alt="" className="size-full object-cover opacity-90" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 bg-[#041627]/80 hover:bg-[#041627] text-white size-9 rounded-full flex items-center justify-center"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="font-mono font-bold text-xs tracking-[0.05em] uppercase bg-brand-orange text-[#181c1e] px-2.5 py-1 rounded-[3px]">
              {container.status}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">{container.title}</h2>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <p className="text-base text-[#44474c] leading-relaxed">{container.description}</p>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f7fafc] p-4 rounded-[4px] border border-[#ebeef0]">
            <div>
              <dt className={specLabel}>Volume cap</dt>
              <dd className="font-mono font-semibold text-sm text-[#041627] mt-1">{container.cap}</dd>
            </div>
            <div>
              <dt className={specLabel}>Max payload</dt>
              <dd className="font-mono font-semibold text-sm text-[#041627] mt-1">{container.maxWeight}</dd>
            </div>
            <div>
              <dt className={specLabel}>Tare weight</dt>
              <dd className="font-mono font-semibold text-sm text-[#041627] mt-1">{container.tare}</dd>
            </div>
            <div>
              <dt className={specLabel}>ISO code</dt>
              <dd className="font-mono font-semibold text-sm text-[#041627] mt-1">{container.iso}</dd>
            </div>
          </dl>
        </div>

        <div className="px-6 py-4 bg-[#f7fafc] border-t border-[#ebeef0] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Link
            to={`/containers/${container.id}`}
            className="px-5 py-3 text-center border border-[#041627] text-[#041627] font-mono font-bold text-xs tracking-[0.05em] uppercase rounded-[4px] hover:bg-[#041627] hover:text-white transition-colors"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            disabled={added || inCart}
            className="px-5 py-3 bg-brand-orange hover:brightness-95 transition text-[#181c1e] font-mono font-bold text-xs tracking-[0.05em] uppercase rounded-[4px] disabled:opacity-60"
          >
            {inCart ? 'Already in cart' : added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
