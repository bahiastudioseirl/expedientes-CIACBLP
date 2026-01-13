import { CheckCircle, Mail, User, X } from 'lucide-react';

interface ModalExitoArbitroProps {
  open: boolean;
  onClose: () => void;
  nombreArbitro: string;
  correoArbitro: string;
  mensaje?: string;
}

export default function ModalExitoArbitro({
  open,
  onClose,
  nombreArbitro,
  correoArbitro,
  mensaje = 'Árbitro creado y vinculado exitosamente. Credenciales enviadas por correo'
}: ModalExitoArbitroProps) {
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

            <h3 className="text-xl font-bold text-slate-900 mb-2">¡Árbitro Agregado!</h3>
            <p className="text-slate-600 mb-6">{mensaje}</p>

            {/* Información del árbitro */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">Árbitro Asignado</p>
                  <p className="text-sm text-slate-600 truncate">{nombreArbitro}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">Credenciales enviadas a</p>
                  <p className="text-sm text-slate-600 truncate">{correoArbitro}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}