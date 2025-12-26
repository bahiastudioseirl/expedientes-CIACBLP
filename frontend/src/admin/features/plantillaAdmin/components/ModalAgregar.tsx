import { X, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CrearPlantillaRequest } from "../schemas/PlantillaSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (plantilla: CrearPlantillaRequest) => Promise<void> | void;
  loading?: boolean;
};

interface SubEtapaForm {
  nombre: string;
  tiene_tiempo: boolean;
  duracion_dias: number | null;
  es_opcional: boolean;
}

interface EtapaForm {
  nombre: string;
  sub_etapas: SubEtapaForm[];
}

export default function ModalAgregar({ open, onClose, onSave, loading }: Props) {
  const [nombre, setNombre] = useState("");
  const [etapas, setEtapas] = useState<EtapaForm[]>([]);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setNombre("");
      setEtapas([{
        nombre: "Etapa 1",
        sub_etapas: [{
          nombre: "Sub Etapa 1",
          tiene_tiempo: false,
          duracion_dias: null,
          es_opcional: false
        }]
      }]);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const agregarEtapa = () => {
    setEtapas([...etapas, {
      nombre: `Etapa ${etapas.length + 1}`,
      sub_etapas: [{
        nombre: "Sub Etapa 1",
        tiene_tiempo: false,
        duracion_dias: null,
        es_opcional: false
      }]
    }]);
  };

  const eliminarEtapa = (index: number) => {
    setEtapas(etapas.filter((_, i) => i !== index));
  };

  const actualizarEtapa = (index: number, campo: string, valor: any) => {
    const nuevasEtapas = [...etapas];
    (nuevasEtapas[index] as any)[campo] = valor;
    setEtapas(nuevasEtapas);
  };

  const agregarSubEtapa = (etapaIndex: number) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[etapaIndex].sub_etapas.push({
      nombre: `Sub Etapa ${nuevasEtapas[etapaIndex].sub_etapas.length + 1}`,
      tiene_tiempo: false,
      duracion_dias: null,
      es_opcional: false
    });
    setEtapas(nuevasEtapas);
  };

  const eliminarSubEtapa = (etapaIndex: number, subIndex: number) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[etapaIndex].sub_etapas = nuevasEtapas[etapaIndex].sub_etapas.filter((_, i) => i !== subIndex);
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

    await onSave({
      nombre: value,
      etapas,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />

      <div className="relative z-[61] w-full max-w-4xl mx-4 rounded-xl bg-white shadow-xl border border-slate-200 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">
            Nueva Plantilla
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
                {etapas.map((etapa, etapaIndex) => (
                  <div key={etapaIndex} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
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
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={subEtapa.tiene_tiempo}
                                onChange={(e) => {
                                  actualizarSubEtapa(etapaIndex, subIndex, 'tiene_tiempo', e.target.checked);
                                  if (!e.target.checked) {
                                    actualizarSubEtapa(etapaIndex, subIndex, 'duracion_dias', null);
                                  }
                                }}
                                className="rounded"
                              />
                              Tiene tiempo
                            </label>
                            <div>
                              <input
                                type="number"
                                value={subEtapa.duracion_dias || ''}
                                onChange={(e) => actualizarSubEtapa(etapaIndex, subIndex, 'duracion_dias', e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="Días"
                                disabled={!subEtapa.tiene_tiempo}
                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                              />
                            </div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={subEtapa.es_opcional}
                                onChange={(e) => actualizarSubEtapa(etapaIndex, subIndex, 'es_opcional', e.target.checked)}
                                className="rounded"
                              />
                              Es opcional
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
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
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
