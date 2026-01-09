import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    countdown?: number; // segundos
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ 
    isOpen, 
    onClose, 
    message, 
    countdown = 10 
}) => {
    const [timeLeft, setTimeLeft] = useState(countdown);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(countdown);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    navigate('/registro-solicitante');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onClose, navigate, countdown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px] transition-opacity duration-300"></div>
            
            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 scale-100">
                    {/* Icono de éxito */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    {/* Título */}
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            ¡Solicitud Enviada!
                        </h3>
                        <div className="text-sm text-gray-600 mb-6 leading-relaxed">
                            {message}
                        </div>
                    </div>

                    {/* Cuenta regresiva */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#733AEA] to-purple-600 text-white font-bold text-lg mb-3 relative">
                            <span>{timeLeft}</span>
                            <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="3"
                                    fill="none"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="rgba(255,255,255,0.9)"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 28}`}
                                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeLeft / countdown)}`}
                                    className="transition-all duration-1000 ease-linear"
                                />
                            </svg>
                        </div>
                        <p className="text-xs text-gray-500">
                            Redirigiendo automáticamente en {timeLeft} segundos
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/registro-solicitante');
                            }}
                            className="flex-1 rounded-lg bg-gradient-to-r from-[#733AEA] to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-[#733AEA] transform hover:scale-105 transition-all duration-200"
                        >
                            Ir ahora
                        </button>
                    </div>

                    {/* Decoración */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full opacity-20 animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 -mb-3 -ml-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};