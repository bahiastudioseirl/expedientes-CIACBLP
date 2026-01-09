import { useState } from "react";

interface RegistroSolicitanteFormProps {
  onSuccess: (usuario: any) => void;
  error?: string;
  loading?: boolean;
  successMsg?: string;
  setError?: (msg: string) => void;
}

export const RegistroSolicitanteForm = ({ onSuccess, error, loading, successMsg, setError }: RegistroSolicitanteFormProps) => {
  const [form, setForm] = useState({
    nombre_completo: "",
    numero_documento: "",
    correo: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error && setError) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(form);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            id="nombre_completo"
            name="nombre_completo"
            type="text"
            required
            value={form.nombre_completo}
            onChange={handleChange}
            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] sm:text-sm"
            placeholder="Ej: Daniel Carrasco"
          />
        </div>
        <div>
          <label htmlFor="numero_documento" className="block text-sm font-medium text-gray-700 mb-1">
            Número de documento (DNI o RUC)
          </label>
          <input
            id="numero_documento"
            name="numero_documento"
            type="text"
            required
            value={form.numero_documento}
            onChange={handleChange}
            maxLength={12}
            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] sm:text-sm"
            placeholder="12345678"
          />
        </div>
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            required
            value={form.correo}
            onChange={handleChange}
            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] sm:text-sm"
            placeholder="ejemplo@correo.com"
          />
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">{error}</div>}
      {successMsg && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700">{successMsg}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#733AEA] hover:bg-[#5c2ac6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Registrando..." : "Registrarme"}
      </button>
    </form>
  );
};