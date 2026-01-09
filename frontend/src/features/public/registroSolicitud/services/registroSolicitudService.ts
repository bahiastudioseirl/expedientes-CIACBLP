import { axiosWithoutMultipart, axiosInstance } from '../../../../api/axiosInstance';
import { RegistroSolicitudRequest } from '../schemas/RegistroSolicitudSchema';

export const registrarSolicitud = async (data: RegistroSolicitudRequest) => {
  // Verificar si hay archivo en resumen_controversia
  const tieneArchivo = data.resumen_controversia_tipo === 'archivo' && data.resumen_controversia_archivo;
  
  // Asegurar que siempre haya un correo principal
  const dataToSend = { ...data };
  
  // Verificar correos demandante
  if (dataToSend.correos_demandante?.length > 0) {
    const tienePrincipal = dataToSend.correos_demandante.some(correo => correo.es_principal);
    if (!tienePrincipal) {
      dataToSend.correos_demandante[0].es_principal = true;
    }
  }
  
  // Verificar correos demandado
  if (dataToSend.correos_demandado?.length > 0) {
    const tienePrincipal = dataToSend.correos_demandado.some(correo => correo.es_principal);
    if (!tienePrincipal) {
      dataToSend.correos_demandado[0].es_principal = true;
    }
  }
  
  if (tieneArchivo) {
    // Usar FormData para archivos
    const formData = new FormData();
    
    // Función para normalizar valores booleanos
    const normalizarBoolean = (value: any): string => {
      if (value === true || value === 'true' || value === '1' || value === 1) {
        return '1';
      }
      return '0';
    };
    
    // Convertir objeto a FormData recursivamente
    const appendToFormData = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const formKey = prefix ? `${prefix}[${key}]` : key;
        
        if (value instanceof File) {
          formData.append(formKey, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              appendToFormData(item, `${formKey}[${index}]`);
            } else if (item !== undefined && item !== null) {
              if (typeof item === 'boolean') {
                formData.append(`${formKey}[${index}]`, normalizarBoolean(item));
              } else {
                formData.append(`${formKey}[${index}]`, item.toString());
              }
            } else {
              // Para valores null/undefined en arrays
              formData.append(`${formKey}[${index}]`, '');
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          appendToFormData(value, formKey);
        } else if (value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            formData.append(formKey, normalizarBoolean(value));
          } else if (typeof value === 'number' || key.includes('id_') || key === 'cuantia') {
            // Para campos numéricos, enviar el número como string
            formData.append(formKey, value.toString());
          } else {
            formData.append(formKey, value.toString());
          }
        } else {
          const booleanFields = [
            'mesa_partes_virtual', 
            'es_principal', 
            'determinada', 
            'arbitro_unico', 
            'propone_arbitro', 
            'encarga_ciacblp'
          ];
          
          if (booleanFields.some(field => key.includes(field))) {
            formData.append(formKey, '0'); 
          } else if (key === 'resumen_controversia' && dataToSend.resumen_controversia_tipo === 'archivo') {
            formData.append(formKey, '');
          } else if (key !== 'resumen_controversia_archivo') { 
            formData.append(formKey, '');
          }
        }
      });
    };
    
    appendToFormData(dataToSend);
    
    // Usar axiosInstance para FormData (multipart/form-data)
    const res = await axiosInstance.post('solicitudes/', formData);
    return res.data;
  } else {
    const res = await axiosWithoutMultipart.post('solicitudes/', dataToSend);
    return res.data;
  }
};
