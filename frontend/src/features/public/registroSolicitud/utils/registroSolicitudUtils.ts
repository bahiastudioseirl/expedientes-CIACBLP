
export const validateFormData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (data.correos_demandante?.length > 0) {
    const hasMainEmail = data.correos_demandante.some((correo: any) => correo.es_principal);
    if (!hasMainEmail) errors.push('Debe marcar al menos un correo como principal para el demandante');
  }
  
  if (data.correos_demandado?.length > 0) {
    const hasMainEmail = data.correos_demandado.some((correo: any) => correo.es_principal);
    if (!hasMainEmail) errors.push('Debe marcar al menos un correo como principal para el demandado');
  }
  
  return errors;
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};