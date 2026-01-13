import { CheckCircle, X } from 'lucide-react';

interface ModalNotificacionProps {
  open: boolean;
  onClose: () => void;
  mensaje: string;
}

export default function ModalNotificacion({ open, onClose, mensaje }: ModalNotificacionProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">¡Solicitud Admitida!</h3>
            <p className="text-slate-600 mb-6">{mensaje}</p>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
