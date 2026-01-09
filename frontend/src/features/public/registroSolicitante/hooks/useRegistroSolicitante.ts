import { useState } from "react";
import { registrarSolicitante, verificarCodigo } from '../services/registroSolicitanteService';
import { RegistroSolicitanteRequest, RegistroSolicitanteResponse, VerificarCodigoRequest, VerificarCodigoResponse } from '../schemas/RegistroSolicitanteSchema';

export function useRegistroSolicitante() {
  const [usuario, setUsuario] = useState<RegistroSolicitanteResponse["data"]["usuario"] | null>(null);
  const [verificado, setVerificado] = useState(false);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const registrar = async (data: RegistroSolicitanteRequest) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await registrarSolicitante(data);
      setUsuario(res.data.usuario);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const verificar = async (data: VerificarCodigoRequest) => {
    setLoading(true);
    setError("");
    try {
      const res = await verificarCodigo(data);
      setVerificado(true);
      setToken(res.data.token);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Código incorrecto o expirado.");
    } finally {
      setLoading(false);
    }
  };

  return {
    usuario,
    verificado,
    token,
    loading,
    error,
    successMsg,
    registrar,
    verificar,
    setError,
    setSuccessMsg
  };
}
