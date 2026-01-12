
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',          //DOMINIO DEL BACK
  APP_URL: 'http://localhost:5173',               //DOMINIO DEL FRONT
  
  getFullUrl: (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_CONFIG.BASE_URL}${cleanPath}`;
  }
};
