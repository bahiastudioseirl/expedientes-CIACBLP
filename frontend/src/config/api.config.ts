
export const API_CONFIG = {
  BASE_URL: 'https://api.expedientes.ciacblp.com',          //DOMINIO DEL BACK
  APP_URL: 'https://expedientes.ciacblp.com',               //DOMINIO DEL FRONT
  
  getFullUrl: (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_CONFIG.BASE_URL}${cleanPath}`;
  }
};
