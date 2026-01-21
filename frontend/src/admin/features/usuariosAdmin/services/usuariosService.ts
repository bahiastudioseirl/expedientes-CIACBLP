import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { 
  ListarUsuariosResponse, 
  CambiarEstadoUsuarioResponse, 
  CrearUsuarioResponse, 
  ActualizarUsuarioResponse,
  CrearUsuarioRequest,
  ActualizarUsuarioRequest,
  UsuarioResponse,
  ListarExpedientesResponse,
  ParticipantesExpedienteResponse,
  AgregarParticipanteRequest,
  AgregarParticipanteResponse
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

// Obtener contadores
export const obtenerContadores = async (): Promise<ListarUsuariosResponse> => {
  const response = await axiosWithoutMultipart.get<ListarUsuariosResponse>('/usuarios/contadores');
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
export const crearAdministrador = async (data: CrearUsuarioRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/administradores', data);
  return response.data;
};

// Crear secretario
export const crearSecretario = async (data: CrearUsuarioRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/secretarios', data);
  return response.data;
};

//Crear contador
export const crearContador = async (data: CrearUsuarioRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/contadores', data);
  return response.data;
};

// Crear árbitro
export const crearArbitro = async (data: CrearUsuarioRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/arbitros', data);
  return response.data;
};

// Crear demandante
export const crearDemandante = async (data: CrearUsuarioRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/demandantes', data);
  return response.data;
};

// Crear demandado
export const crearDemandado = async (data: CrearUsuarioRequest): Promise<CrearUsuarioResponse> => {
  const response = await axiosWithoutMultipart.post<CrearUsuarioResponse>('/usuarios/demandados', data);
  return response.data;
};

// Actualizar usuario
export const actualizarUsuario = async (idUsuario: number, data: ActualizarUsuarioRequest): Promise<ActualizarUsuarioResponse> => {
  const response = await axiosWithoutMultipart.patch<ActualizarUsuarioResponse>(`/usuarios/${idUsuario}`, data);
  return response.data;
};






// Cambiar estado de usuario
export const cambiarEstadoUsuario = async (idUsuario: number): Promise<CambiarEstadoUsuarioResponse> => {
  const response = await axiosWithoutMultipart.put<CambiarEstadoUsuarioResponse>(`/usuarios/${idUsuario}/estado`);
  return response.data;
};

// Servicios para gestión de participantes en expedientes

// Obtener todos los expedientes
export const obtenerExpedientes = async (): Promise<ListarExpedientesResponse> => {
  const response = await axiosWithoutMultipart.get<ListarExpedientesResponse>('/expedientes');
  return response.data;
};

// Obtener participantes de un expediente específico
export const obtenerParticipantesExpediente = async (idExpediente: number): Promise<ParticipantesExpedienteResponse> => {
  const response = await axiosWithoutMultipart.get<ParticipantesExpedienteResponse>(`/usuarios/expediente/${idExpediente}/participantes/partes`);
  return response.data;
};

// Agregar participante a expediente
export const agregarParticipanteExpediente = async (idExpediente: number, data: AgregarParticipanteRequest): Promise<AgregarParticipanteResponse> => {
  const response = await axiosWithoutMultipart.post<AgregarParticipanteResponse>(`/usuarios/partes/agregar-a-expediente/${idExpediente}`, data);
  return response.data;
};

// Buscar árbitros por nombre
export const buscarArbitros = async (nombre: string) => {
  const response = await axiosWithoutMultipart.get(`/arbitros/buscar-bd-primaria?nombre=${encodeURIComponent(nombre)}`);
  return response.data;
};

// Buscar secretarios por nombre
export const buscarSecretarios = async (nombre: string) => {
  const response = await axiosWithoutMultipart.get(`/secretarios/buscar?nombre=${encodeURIComponent(nombre)}`);
  return response.data;
};

export const buscarContadores = async (nombre: string) => {
  const response = await axiosWithoutMultipart.get(`/contadores/buscar?nombre=${encodeURIComponent(nombre)}`);
  return response.data;
}

// Vincular staff (árbitro, secretario o contador) a expediente
export const vincularStaffAExpediente = async (idExpediente: number, data: { id_usuario: number }) => {
  const response = await axiosWithoutMultipart.post(`/expedientes/${idExpediente}/vincular-staff`, data);
  return response.data;
};

// Obtener staff (árbitros y secretarios) de un expediente
export const obtenerStaffExpediente = async (idExpediente: number) => {
  const response = await axiosWithoutMultipart.get(`/usuarios/expediente/${idExpediente}/staff`);
  return response.data;
};

// Desvincular staff de un expediente
export const desvincularStaffDeExpediente = async (idUsuario: number, idExpediente: number) => {
  const response = await axiosWithoutMultipart.delete(`/usuarios/${idUsuario}/expediente/${idExpediente}`);
  return response.data;
};