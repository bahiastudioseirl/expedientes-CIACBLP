import { X, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Plantilla, ActualizarPlantillaRequest } from "../schemas/PlantillaSchema";

type Props = {
    open: boolean;
    plantilla: Plantilla | null;
    onClose: () => void;
    onSave: (id: number, data: ActualizarPlantillaRequest) => Promise<void>;
    loading?: boolean;
};

interface SubEtapaForm {
    id_sub_etapa?: number;
    nombre: string;
    orden: number;
    dias_habiles: number;
    es_habil: boolean;
    es_obligatorio: boolean;
}

interface EtapaForm {
    id_etapa?: number;
    nombre: string;
    orden: number;
    sub_etapas: SubEtapaForm[];
}

export default function ModalEditar({open, plantilla, onClose, onSave, loading}: Props) {
    const [nombre, setNombre] = useState("");
    const [etapas, setEtapas] = useState<EtapaForm[]>([]);
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && plantilla) {
            setNombre(plantilla.nombre);
            setEtapas(plantilla.etapas.map((etapa, idx) => ({
                id_etapa: etapa.id_etapa,
                nombre: etapa.nombre,
                orden: etapa.orden || (idx + 1),
                sub_etapas: etapa.sub_etapas.map((sub, subIdx) => ({
                    id_sub_etapa: sub.id_sub_etapa,
                    nombre: sub.nombre,
                    orden: sub.orden || (subIdx + 1),
                    dias_habiles: sub.dias_habiles || 0,
                    es_habil: sub.dias_habiles > 0,
                    es_obligatorio: sub.es_obligatorio ?? true
                }))
            })));
            setError("");
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open, plantilla]);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) onClose();
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    const agregarEtapa = () => {
        const nuevoOrden = etapas.length + 1;
        setEtapas([...etapas, {
            nombre: `Etapa ${nuevoOrden}`,
            orden: nuevoOrden,
            sub_etapas: [{
                nombre: "Sub Etapa 1",
                orden: 1,
                dias_habiles: 0,
                es_habil: false,
                es_obligatorio: true
            }]
        }]);
    };

    const eliminarEtapa = (index: number) => {
        const nuevasEtapas = etapas.filter((_, i) => i !== index);
        // Reordenar
        nuevasEtapas.forEach((etapa, idx) => {
            etapa.orden = idx + 1;
        });
        setEtapas(nuevasEtapas);
    };

    const moverEtapa = (index: number, direccion: 'arriba' | 'abajo') => {
        if (direccion === 'arriba' && index === 0) return;
        if (direccion === 'abajo' && index === etapas.length - 1) return;
        
        const nuevasEtapas = [...etapas];
        const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
        [nuevasEtapas[index], nuevasEtapas[nuevoIndex]] = [nuevasEtapas[nuevoIndex], nuevasEtapas[index]];
        
        // Actualizar órdenes
        nuevasEtapas.forEach((etapa, idx) => {
            etapa.orden = idx + 1;
        });
        setEtapas(nuevasEtapas);
    };

    const actualizarEtapa = (index: number, campo: string, valor: any) => {
        const nuevasEtapas = [...etapas];
        (nuevasEtapas[index] as any)[campo] = valor;
        setEtapas(nuevasEtapas);
    };

    const agregarSubEtapa = (etapaIndex: number) => {
        const nuevasEtapas = [...etapas];
        const nuevoOrden = nuevasEtapas[etapaIndex].sub_etapas.length + 1;
        nuevasEtapas[etapaIndex].sub_etapas.push({
            nombre: `Sub Etapa ${nuevoOrden}`,
            orden: nuevoOrden,
            dias_habiles: 0,
            es_habil: false,
            es_obligatorio: true
        });
        setEtapas(nuevasEtapas);
    };

    const eliminarSubEtapa = (etapaIndex: number, subIndex: number) => {
        const nuevasEtapas = [...etapas];
        nuevasEtapas[etapaIndex].sub_etapas = nuevasEtapas[etapaIndex].sub_etapas.filter((_, i) => i !== subIndex);
        // Reordenar
        nuevasEtapas[etapaIndex].sub_etapas.forEach((sub, idx) => {
            sub.orden = idx + 1;
        });
        setEtapas(nuevasEtapas);
    };

    const moverSubEtapa = (etapaIndex: number, subIndex: number, direccion: 'arriba' | 'abajo') => {
        const nuevasEtapas = [...etapas];
        const subEtapas = nuevasEtapas[etapaIndex].sub_etapas;
        
        if (direccion === 'arriba' && subIndex === 0) return;
        if (direccion === 'abajo' && subIndex === subEtapas.length - 1) return;
        
        const nuevoIndex = direccion === 'arriba' ? subIndex - 1 : subIndex + 1;
        [subEtapas[subIndex], subEtapas[nuevoIndex]] = [subEtapas[nuevoIndex], subEtapas[subIndex]];
        
        // Actualizar órdenes
        subEtapas.forEach((sub, idx) => {
            sub.orden = idx + 1;
        });
        setEtapas(nuevasEtapas);
    };

    const actualizarSubEtapa = (etapaIndex: number, subIndex: number, campo: string, valor: any) => {
        const nuevasEtapas = [...etapas];
        (nuevasEtapas[etapaIndex].sub_etapas[subIndex] as any)[campo] = valor;
        setEtapas(nuevasEtapas);
    };

    const handleSave = async () => {
        const value = nombre.trim();

        if (!value) {
            setError("Ingresa el nombre de la plantilla.");
            return;
        }

        if (etapas.length === 0) {
            setError("Debe haber al menos una etapa.");
            return;
        }

        for (let i = 0; i < etapas.length; i++) {
            if (!etapas[i].nombre.trim()) {
                setError(`El nombre de la etapa ${i + 1} es requerido.`);
                return;
            }
            if (etapas[i].sub_etapas.length === 0) {
                setError(`La etapa ${i + 1} debe tener al menos una sub-etapa.`);
                return;
            }
        }

        if (!plantilla) return;

        await onSave(plantilla.id_plantilla, {
            nombre: value,
            etapas
        });
    };

    // Ordenar etapas y sub_etapas por orden antes de mostrar
    const sortedEtapas = (etapas ?? plantilla?.etapas ?? []).slice().sort((a, b) => a.orden - b.orden).map(etapa => ({
        ...etapa,
        sub_etapas: (etapa.sub_etapas ?? []).slice().sort((a, b) => a.orden - b.orden)
    }));

    if (!open || !plantilla) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />
            
            <div className="relative z-[61] w-full max-w-4xl mx-4 rounded-xl bg-white shadow-xl border border-slate-200 max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900">
                        Editar Plantilla
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nombre de la plantilla
                            </label>
                            <input
                                ref={inputRef}
                                type="text"
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value);
                                    setError("");
                                }}
                                placeholder="Ej. Plantilla Arbitral"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-slate-700">Etapas</label>
                                <button
                                    type="button"
                                    onClick={agregarEtapa}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar Etapa
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sortedEtapas.map((etapa, etapaIndex) => (
                                    <div key={etapaIndex} className="border border-slate-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moverEtapa(etapaIndex, 'arriba')}
                                                    disabled={etapaIndex === 0}
                                                    className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30"
                                                    title="Mover arriba"
                                                >
                                                    <MoveUp className="w-3 h-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moverEtapa(etapaIndex, 'abajo')}
                                                    disabled={etapaIndex === etapas.length - 1}
                                                    className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30"
                                                    title="Mover abajo"
                                                >
                                                    <MoveDown className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 w-8">#{etapa.orden}</span>
                                            <input
                                                type="text"
                                                value={etapa.nombre}
                                                onChange={(e) => actualizarEtapa(etapaIndex, 'nombre', e.target.value)}
                                                placeholder="Nombre de la etapa"
                                                className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => eliminarEtapa(etapaIndex)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                                disabled={etapas.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-600">Sub-etapas</span>
                                                <button
                                                    type="button"
                                                    onClick={() => agregarSubEtapa(etapaIndex)}
                                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    Sub-etapa
                                                </button>
                                            </div>

                                            {etapa.sub_etapas.map((subEtapa, subIndex) => (
                                                <div key={subIndex} className="bg-slate-50 rounded p-3 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => moverSubEtapa(etapaIndex, subIndex, 'arriba')}
                                                                disabled={subIndex === 0}
                                                                className="p-0.5 text-slate-500 hover:bg-slate-200 rounded disabled:opacity-30"
                                                            >
                                                                <MoveUp className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moverSubEtapa(etapaIndex, subIndex, 'abajo')}
                                                                disabled={subIndex === etapa.sub_etapas.length - 1}
                                                                className="p-0.5 text-slate-500 hover:bg-slate-200 rounded disabled:opacity-30"
                                                            >
                                                                <MoveDown className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-500 w-6">#{subEtapa.orden}</span>
                                                        <input
                                                            type="text"
                                                            value={subEtapa.nombre}
                                                            onChange={(e) => actualizarSubEtapa(etapaIndex, subIndex, 'nombre', e.target.value)}
                                                            placeholder="Nombre de sub-etapa"
                                                            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => eliminarSubEtapa(etapaIndex, subIndex)}
                                                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                                                            disabled={etapa.sub_etapas.length === 1}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <label className="flex items-center gap-2 mb-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={subEtapa.dias_habiles > 0}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            actualizarSubEtapa(etapaIndex, subIndex, 'dias_habiles', 1);
                                                                            actualizarSubEtapa(etapaIndex, subIndex, 'es_habil', true);
                                                                        } else {
                                                                            actualizarSubEtapa(etapaIndex, subIndex, 'dias_habiles', 0);
                                                                            actualizarSubEtapa(etapaIndex, subIndex, 'es_habil', false);
                                                                        }
                                                                    }}
                                                                    className="rounded"
                                                                />
                                                                <span className="text-xs text-slate-600">Tiene tiempo</span>
                                                            </label>
                                                            {subEtapa.dias_habiles > 0 ? (
                                                                <input
                                                                    type="number"
                                                                    value={subEtapa.dias_habiles}
                                                                    onChange={(e) => {
                                                                        const dias = parseInt(e.target.value) || 1;
                                                                        actualizarSubEtapa(etapaIndex, subIndex, 'dias_habiles', dias);
                                                                        actualizarSubEtapa(etapaIndex, subIndex, 'es_habil', true);
                                                                    }}
                                                                    min="1"
                                                                    placeholder="Días"
                                                                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                                                                />
                                                            ) : (
                                                                <div className="w-full rounded border border-slate-200 bg-slate-100 px-2 py-1 text-sm text-slate-400">
                                                                    Sin días hábiles
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-end">
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={subEtapa.es_obligatorio}
                                                                    onChange={(e) => actualizarSubEtapa(etapaIndex, subIndex, 'es_obligatorio', e.target.checked)}
                                                                    className="rounded"
                                                                />
                                                                Es obligatorio
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (<p className="text-sm text-red-600">{error}</p>)}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#132436] hover:bg-[#224666] disabled:opacity-60"
                    >
                        {loading ? "Guardando..." : "Actualizar"}
                    </button>
                </div>
            </div>
        </div>
    );
}