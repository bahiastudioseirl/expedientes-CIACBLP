import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:8000/api/',
	headers: {
		'Content-Type': 'multipart/form-data',
	},
});

export const axiosWithoutMultipart = axios.create({
	baseURL: 'http://localhost:8000/api/',
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
		
		// Redirigir al login si no estamos ya ahí
		if (!window.location.pathname.includes('/login')) {
			window.location.href = '/login';
		}
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

