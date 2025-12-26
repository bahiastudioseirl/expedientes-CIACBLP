// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  // Para producción cambiar a: 'https://api.tudominio.com'
  
  // Helper para construir URLs completas
  getFullUrl: (path: string) => {
    // Si la ruta ya tiene http/https, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Si no, concatenar con la base URL
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_CONFIG.BASE_URL}${cleanPath}`;
  }
};
