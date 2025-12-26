import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Empresa } from "../schemas/EmpresaSchema";

type Props = {
    open: boolean;
    empresa: Empresa | null;
    onClose: () => void;
    onSave: (id: number, data: { nombre: string }) => Promise<void>;
    loading?: boolean;
};

export default function ModalEditar({open,empresa,onClose,onSave,loading,}: Props) {
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && empresa) {
            setNombre(empresa.nombre);
            setError("");
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open, empresa]);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) onClose();
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    const handleSave = async () => {
        const value = nombre.trim();

        if (!value) {
            setError("Ingresa el nombre de la empresa.");
            return;
        }

        if (!empresa) return;

        await onSave(empresa.id_empresa, {
            nombre: value,
        });
    };

    if (!open || !empresa) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-[61] w-full max-w-md mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900">
                        Editar Empresa
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                        Nombre de la empresa
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            setError("");
                        }}
                        placeholder="Ej. Sangers S.A.C."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
