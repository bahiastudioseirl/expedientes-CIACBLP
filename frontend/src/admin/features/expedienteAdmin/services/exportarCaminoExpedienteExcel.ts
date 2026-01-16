import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export const exportarCaminoExpedienteExcel = async (idExpediente: number): Promise<void> => {
  try {
    const response = await axiosWithoutMultipart.get(
      `excel/expediente/${idExpediente}/camino`,
      {
        responseType: 'blob', 
      }
    );

    // Crear un blob con el contenido del archivo
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Crear un URL temporal para el blob
    const url = window.URL.createObjectURL(blob);

    // Crear un elemento anchor temporal para la descarga
    const link = document.createElement('a');
    link.href = url;
    
    // Obtener el nombre del archivo desde los headers si está disponible
    const contentDisposition = response.headers['content-disposition'];
    let filename = `Camino_Expediente_${idExpediente}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="([^"]*)"/) || 
                           contentDisposition.match(/filename=([^;]*)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/"/g, '');
      }
    }
    
    link.download = filename;
    
    // Agregar el link al DOM temporalmente y hacer clic
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    console.error('Error al exportar Excel:', error);
    throw new Error(
      error.response?.data?.message || 
      'Error al descargar el archivo Excel del camino del expediente'
    );
  }
};