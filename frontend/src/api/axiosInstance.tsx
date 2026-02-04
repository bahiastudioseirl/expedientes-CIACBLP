import axios from 'axios';

const API_BASE_URL = 'https://api.expedientes.ciacblp.com';         /*URL DEL BACKEND*/


export const axiosInstance = axios.create({
	baseURL: `${API_BASE_URL}/api/`,
	headers: {
		'Content-Type': 'multipart/form-data',
	},
});

export const axiosWithoutMultipart = axios.create({
	baseURL: `${API_BASE_URL}/api/`,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosWithoutMultipart.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas con errores 401 (no autorizado)
const handleUnauthorized = (error: any) => {
	if (error.response?.status === 401) {
		// Token expirado o inválido - solo limpiar el token
		localStorage.removeItem('authToken');
		// No forzar navegación aquí - dejar que cada componente maneje su lógica
	}
	return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
	(response) => response,
	handleUnauthorized
);

axiosWithoutMultipart.interceptors.response.use(
	(response) => response,
	handleUnauthorized
);

