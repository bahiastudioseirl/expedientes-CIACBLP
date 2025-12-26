import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { LazyWrapper } from './components/LazyWrapper';
import { ProtectedRoute } from './guard/ProtectedRoute';
import { AdminLayout } from '../../layout/components/AdminLayout';

// LOGIN FORMS
const LoginForm = lazy(() =>
    import('../components/auth/LoginForm').then((module) => ({ default: module.LoginForm }))
);


//ADMINISTRADOR
const ExpedienteAdmin = lazy(() =>
    import('../../admin/features/expedienteAdmin/pages/ExpedienteAdmin').then((module) => ({ default: module.default }))
);

const PlantillaAdmin = lazy(() =>
    import('../../admin/features/plantillaAdmin/pages/PlantillaAdmin').then((module) => ({ default: module.default }))
);


export const routes = [
    // RUTAS PÚBLICAS - PÁGINAS DE USUARIO

    // Ruta principal - Página de cursos (pantalla principal)
    {
        path: '/',
        element: (
            <LazyWrapper>
                <LoginForm />
            </LazyWrapper>
        ),
    },

    // Login para usuarios/estudiantes - Acceso con DNI
    {
        path: '/login',
        element: (
            <LazyWrapper>
                <LoginForm />
            </LazyWrapper>
        ),
    },

    // RUTAS ADMINISTRATIVAS
 {
    path: '/administrator',
    element: (
      <ProtectedRoute requiredRole="Administrador">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/administrator/expediente" replace />,
      },
      // Gestión de Expedientes
      {
        path: 'expediente',
        element: (
          <LazyWrapper>
            <ExpedienteAdmin />
          </LazyWrapper>
        ),
      },
      // Gestión de Plantillas
      {
        path: 'plantilla',
        element: (
          <LazyWrapper>
            <PlantillaAdmin />
          </LazyWrapper>
        ),
      },
    ],
  },
    // Ruta 404 - Página no encontrada
  {
    path: '/404',
    element: (
      <div className='flex items-center justify-center min-h-screen p-6 bg-gray-50'>
        <div className='w-full max-w-md p-8 text-center bg-white shadow-lg rounded-xl'>
          <div className='flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full'>
            <svg className='w-10 h-10 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h1 className='mb-2 text-4xl font-bold text-gray-900'>404</h1>
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Página no encontrada</h2>
          <p className='mb-6 text-gray-600'>La página que buscas no existe</p>
          <a
            href='/'
            className='inline-flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700'>
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },

    // Catch all - Redirige a 404
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];