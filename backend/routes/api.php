<?php

use App\Http\Controllers\AsuntoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlantillaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ExpedienteController;
use App\Http\Controllers\FlujoController;
use App\Http\Controllers\MensajeController;
use App\Http\Controllers\UsuarioSolicitanteController;
use App\Http\Controllers\SolicitudController;
use Tymon\JWTAuth\Facades\JWTAuth;

// Manejar solicitudes OPTIONS para CORS
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:3000, http://localhost:5173, http://expedientes.ciacblp.com, https://expedientes.ciacblp.com')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true')
        ->header('Access-Control-Max-Age', '1728000');
})->where('any', '.*');

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
|   Aquí puedes registrar rutas API para tu aplicación. Estas rutas 
|   son cargadas por RouteServiceProvider y todas se asignarán al grupo 
|   de middleware "api". ¡Crea algo increíble!
|
*/

// Rutas de autenticación (con force.json)
Route::middleware(['force.json'])->prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Rutas públicas para usuarios solicitantes (sin autenticación)
Route::middleware(['force.json'])->prefix('usuario-solicitante')->group(function () {
    Route::post('/registrar', [UsuarioSolicitanteController::class, 'registrar']);
    Route::post('/verificar-codigo', [UsuarioSolicitanteController::class, 'verificarCodigo']);
    Route::post('/reenviar-codigo', [UsuarioSolicitanteController::class, 'reenviarCodigo']);
});

// Rutas protegidas para usuarios solicitantes autenticados
Route::middleware(['force.json', 'solicitante.auth'])->prefix('solicitudes')->group(function () {
    Route::post('/', [SolicitudController::class, 'crear']);
    
    // Obtener información del usuario solicitante autenticado
    Route::get('/me', function (Request $request) {
        $usuario = $request->attributes->get('usuario_solicitante');
        return response()->json([
            'usuario' => [
                'id' => $usuario->id_usuario_solicitante,
                'numero_documento' => $usuario->numero_documento,
                'nombre_completo' => $usuario->nombre_completo,
                'correo' => $usuario->correo
            ]
        ]);
    });
    
    // Logout para usuarios solicitantes
    Route::post('/logout', function (Request $request) {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión'
            ], 500);
        }
    });
});

// Rutas con solo autenticación (cualquier usuario logueado)
Route::middleware(['force.json', \App\Http\Middleware\JWTAuthMiddleware::class])->group(function () {
    
    // Cerrar sesión
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    Route::get('/me', function (Request $request) {
        $user = auth('api')->user();
        return response()->json([
            'user' => [
                'id' => $user->id_usuario,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'nombre_empresa' => $user->nombre_empresa,
                'correo' => $user->correo,
                'rol' => $user->rol->nombre ?? null,
                'activo' => $user->activo
            ]
        ]);
    });
    

    // Rutas disponibles para todos los usuarios autenticados
    Route::get('expedientes/asignados', [ExpedienteController::class, 'listarExpedientesAsignados']);
    
    // Rutas de mensajes para usuarios autenticados
    Route::prefix('mensajes')->middleware(\App\Http\Middleware\HandlePostTooLarge::class)->group(function () {
        Route::post('/', [MensajeController::class, 'crearMensaje']);
        Route::get('/asunto/{idAsunto}', [MensajeController::class, 'listarMensajesPorAsunto']);
        Route::put('/{idMensaje}/leer', [MensajeController::class, 'marcarMensajeComoLeido']);
        Route::post('/{idMensajePadre}/responder', [MensajeController::class, 'responderMensaje']);
        Route::get('/{idMensaje}/hilo', [MensajeController::class, 'obtenerHiloMensaje']);
    });

    Route::prefix('asuntos')->group(function () {
        Route::get('/expediente/{idExpediente}', [AsuntoController::class, 'verAsuntosPorExpediente']);
    });

    Route::prefix('flujo')->group(function () {
        Route::get('/expediente/{idExpediente}/actual', [FlujoController::class, 'obtenerFlujoActual']);
        Route::get('/expediente/{idExpediente}/listar', [FlujoController::class, 'listarFlujosPorExpediente']);
    });
    
    
});





// Rutas solo para Admin
Route::middleware(['force.json', \App\Http\Middleware\JWTAuthMiddleware::class, 'admin'])->group(function () {
    
    Route::prefix('usuarios')->group(function () {
        Route::post('/', [UsuarioController::class, 'crearUsuario']);
        Route::post('/administradores', [UsuarioController::class, 'crearAdministrador']);
        Route::post('/secretarios', [UsuarioController::class, 'crearSecretario']);
        Route::post('/demandantes', [UsuarioController::class, 'crearDemandante']);
        Route::post('/demandados', [UsuarioController::class, 'crearDemandado']);
        Route::post('/arbitros', [UsuarioController::class, 'crearArbitro']);
        Route::get('/', [UsuarioController::class, 'listarUsuarios']);
        Route::get('/administradores', [UsuarioController::class, 'listarAdministradores']);
        Route::get('/arbitros', [UsuarioController::class, 'listarArbitros']);
        Route::get('/secretarios', [UsuarioController::class, 'listarSecretarios']);
        Route::get('/demandantes', [UsuarioController::class, 'listarDemandantes']);
        Route::get('/demandados', [UsuarioController::class, 'listarDemandados']);
        Route::get('/{id}', [UsuarioController::class, 'obtenerUsuarioPorId']);
        Route::patch('/{id}', [UsuarioController::class, 'actualizarUsuario']);
        Route::put('/{id}/estado', [UsuarioController::class, 'cambiarEstadoUsuario']);
    });

    Route::prefix('plantillas')->group(function () {
        Route::post('/', [PlantillaController::class, 'crearPlantilla']);
        Route::get('/', [PlantillaController::class, 'listarPlantillas']);
        Route::get('/{id}', [PlantillaController::class, 'obtenerPlantillaPorId']);
        Route::get('/{id}/etapas', [PlantillaController::class, 'obtenerEtapasPlantilla']);
        Route::patch('/{id}', [PlantillaController::class, 'actualizarPlantilla']);
        Route::put('/{id}/estado', [PlantillaController::class, 'cambiarEstadoPlantilla']);
    });

    Route::prefix('expedientes')->group(function () {
        Route::post('/', [ExpedienteController::class, 'crearExpediente']);
        Route::get('/', [ExpedienteController::class, 'listarExpedientes']);
        Route::get('/{id}', [ExpedienteController::class, 'obtenerExpedientePorId']);
        Route::patch('/{id}', [ExpedienteController::class, 'actualizarExpediente']);
        Route::get('/codigo/{codigo}', [ExpedienteController::class, 'obtenerPorCodigoExpediente']);
        Route::put('/{id}/estado', [ExpedienteController::class, 'cambiarEstadoExpediente']);
        Route::get('/verificar-usuario/{numeroDocumento}', [ExpedienteController::class, 'verificarUsuarioPorDocumento']);
    });
});








// Rutas para (Administrador, Secretario, Árbitro)
Route::middleware(['force.json', \App\Http\Middleware\JWTAuthMiddleware::class, 'staff'])->group(function () {
    Route::prefix('asuntos')->group(function () {
        Route::put('/{idAsunto}/mensajear', [AsuntoController::class, 'cerrarOAbrirAsunto']);
    });

    Route::prefix('flujo')->group(function(){
        Route::post('/cambiar-etapa-subetapa', [FlujoController::class, 'cambiarEtapaSubetapa']);
        Route::patch('/{idFlujo}/actualizar-flujo-asunto', [FlujoController::class, 'actualizarFlujoYAsunto']);
    });
    

});











// Rutas para Participantes (Demandante, Demandado) - id_rol 4, 5
Route::middleware(['force.json', \App\Http\Middleware\JWTAuthMiddleware::class, 'participant'])->group(function () {
    
});