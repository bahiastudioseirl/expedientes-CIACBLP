import { useState } from "react";
import { LoginRequest } from "./schemas/LoginSchema";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "./services/IniciarSesion";
import { AuthStore } from "./services/AuthStore";
import { Eye, EyeOff } from "lucide-react";


export const LoginForm = () => {
    const [credentials, setCredentials] = useState<LoginRequest>({
        numero_documento: '',
        contrasena: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await iniciarSesion(credentials);

            AuthStore.clearAll();
            localStorage.setItem('authToken', response.token);
            AuthStore.setUser(response.user);

            if (response.user.rol === 'Administrador') {
                navigate('/administrator');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            console.error('Error en login:', err);

            if (err.response?.status === 401) {
                setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al iniciar sesión. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e4e4e4]/30 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-20 w-60 rounded-full flex items-center justify-center mb-2">
                            <img src="https://postulacionesdev.ciacblp.com/images/logo-dark2x.png" alt="Logo CIACBLP" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    {/* Formulario */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="numero_documento" className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de documento
                                </label>
                                <input
                                    id="numero_documento"
                                    name="numero_documento"
                                    type="text"
                                    autoComplete="off"
                                    required
                                    value={credentials.numero_documento}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] focus:z-10 sm:text-sm"
                                    placeholder="12345678"
                                />
                            </div>

                            <div>
                                <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="contrasena"
                                        name="contrasena"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={credentials.contrasena}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] focus:z-10 sm:text-sm"
                                        placeholder="Ingresa tu contraseña"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span className="text-sm text-red-600">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#733AEA] hover:bg-[#5c2ac6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Verificando...
                                </div>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}