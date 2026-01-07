
export const obtenerNombreCompleto = (usuario: any): string => {
  if (!usuario) {
    return 'Usuario no identificado';
  }
  if (usuario.nombre_empresa?.trim()) {
    return usuario.nombre_empresa.trim();
  }
  if (usuario.nombre?.trim()) {
    const nombre = usuario.nombre.trim();
    const apellido = usuario.apellido?.trim();
    return apellido ? `${nombre} ${apellido}` : nombre;
  }
  if (usuario.email?.trim()) {
    return usuario.email.trim();
  }
  return `Usuario ${usuario.id_usuario || 'desconocido'}`;
};

/**
 * Extrae solo la parte del título después del | (pipe)
 * Ejemplo: "Bahia - Facebook // Caso arbitral 001-2026-CIACBLP | Entrega de documentos" -> "Entrega de documentos"
 */
export const extraerTituloCorto = (titulo: string): string => {
  if (!titulo?.trim()) return 'Sin título';
  
  const partes = titulo.split('|');
  if (partes.length > 1) {
    return partes[partes.length - 1].trim();
  }
  
  return titulo.trim();
};


export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


export const formatDateOnly = (dateString: string): string => {
  return formatTime(dateString).split(',')[0];
};


export const isMyMessage = (mensaje: any, currentUser: any): boolean => {
  return currentUser && mensaje.usuario_remitente?.id_usuario === currentUser.id_usuario;
};


export const canManageAsunto = (currentUser: any): boolean => {
  return currentUser && [1, 2, 3].includes(currentUser.id_rol);
};

export const getValidParticipantes = (expediente: any) => {
  return expediente?.participantes?.filter((p: any) => 
    p?.usuario?.id_usuario
  ) || [];
};


export const getAllParticipanteIds = (expediente: any): number[] => {
  return getValidParticipantes(expediente).map((p: any) => p.usuario.id_usuario);
};