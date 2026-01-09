import { useState } from "react";

interface VerificarCodigoFormProps {
  onSuccess: (data: any) => void;
  error?: string;
  loading?: boolean;
  setError?: (msg: string) => void;
}

export const VerificarCodigoForm = ({ onSuccess, error, loading, setError }: VerificarCodigoFormProps) => {
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ codigo });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
          Código de verificación
        </label>
        <input
          id="codigo"
          name="codigo"
          type="text"
          required
          value={codigo}
          onChange={e => {
            setCodigo(e.target.value);
            if (error && setError) setError("");
          }}
          maxLength={6}
          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] sm:text-sm"
          placeholder="Ingresa el código recibido"
        />
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#733AEA] hover:bg-[#5c2ac6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Verificando..." : "Verificar código"}
      </button>
    </form>
  );
};