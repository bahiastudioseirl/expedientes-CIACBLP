import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { 
  ListarUsuariosResponse, 
  CambiarEstadoUsuarioResponse, 
  CrearUsuarioResponse, 
  ActualizarUsuarioResponse,
  CrearUsuarioPersonaRequest,
  CrearUsuarioEmpresaRequest,
  ActualizarUsuarioPersonaRequest,
  ActualizarUsuarioEmpresaRequest,
  UsuarioResponse
} from '../schemas/UsuarioSchema';

// Obtener administradores
export const obtenerAdministradores = async (): Promise<ListarUsuariosResponse> => {
  const response = await axiosWithoutMultipart.get<ListarUsuariosResponse>('/usuarios/administradores');
  return response.data;
};

// Obtener secretarios
export const obtenerSecretarios = async (): Promise<ListarUsuariosResponse> => {
  const response = await axiosWithoutMultipart.get<ListarUsuariosResponse>('/usuarios/secretarios');
  return response.data;
};

// Obtener demandantes
export const obtenerDemandantes = async (): Promise<ListarUsuariosResponse> => {
  const response = await axiosWithoutMultipart.get<ListarUsuariosResponse>('/usuarios/demandantes');
  return response.data;
};

// Obtener demandados
export const obtenerDemandados = async (): Promise<ListarUsuariosResponse> => {
  const response = await axiosWithoutMultipart.get<ListarUsuariosResponse>('/usuarios/demandados');
  return response.data;
};

// Obtener árbitros
export const obtenerArbitros = async (): Promise<ListarUsuariosResponse> => {
  const response = await axiosWithoutMultipart.get<ListarUsuariosResponse>('/usuarios/arbitros');
  return response.data;
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (idUsuario: number): Promise<UsuarioResponse> => {
  const response = await axiosWithoutMultipart.get<UsuarioResponse>(`/usuarios/${idUsuario}`);
  return response.data;
};

// Crear administrador
export const crearAdministrador = async (data: CrearUsuarioPersonaRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/administradores', data);
  return response.data;
};

// Crear secretario
export const crearSecretario = async (data: CrearUsuarioPersonaRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/secretarios', data);
  return response.data;
};

// Crear demandante
export const crearDemandante = async (data: CrearUsuarioEmpresaRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/demandantes', data);
  return response.data;
};

// Crear demandado
export const crearDemandado = async (data: CrearUsuarioEmpresaRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/demandados', data);
  return response.data;
};

// Crear árbitro
export const crearArbitro = async (data: CrearUsuarioPersonaRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/arbitros', data);
  return response.data;
};

// Actualizar usuario persona (administrador, secretario, arbitro)
export const actualizarUsuarioPersona = async (idUsuario: number, data: ActualizarUsuarioPersonaRequest): Promise<ActualizarUsuarioResponse> => {
  const response = await axiosWithoutMultipart.patch<ActualizarUsuarioResponse>(`/usuarios/${idUsuario}`, data);
  return response.data;
};

// Actualizar usuario empresa (demandante, demandado)
export const actualizarUsuarioEmpresa = async (idUsuario: number, data: ActualizarUsuarioEmpresaRequest): Promise<ActualizarUsuarioResponse> => {
  const response = await axiosWithoutMultipart.patch<ActualizarUsuarioResponse>(`/usuarios/${idUsuario}`, data);
  return response.data;
};

// Cambiar estado de usuario
export const cambiarEstadoUsuario = async (idUsuario: number): Promise<CambiarEstadoUsuarioResponse> => {
  const response = await axiosWithoutMultipart.put<CambiarEstadoUsuarioResponse>(`/usuarios/${idUsuario}/estado`);
  return response.data;
};