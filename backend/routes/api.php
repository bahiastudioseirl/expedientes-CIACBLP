<?php

use App\Http\Controllers\AsuntoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlantillaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ExpedienteController;

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

    Route::get('expedientes/{id}/asuntos', [AsuntoController::class, 'verAsuntosPorExpediente']);
});





// Rutas solo para Admin
Route::middleware(['force.json', \App\Http\Middleware\JWTAuthMiddleware::class, 'admin'])->group(function () {
    
    Route::prefix('usuarios')->group(function () {
        Route::post('/', [UsuarioController::class, 'crearUsuario']);
        Route::get('/', [UsuarioController::class, 'listarUsuarios']);
        Route::get('/administradores', [UsuarioController::class, 'listarAdministradores']);
        Route::get('/{id}', [UsuarioController::class, 'obtenerUsuarioPorId']);
        Route::patch('/{id}', [UsuarioController::class, 'actualizarUsuario']);
        Route::put('/{id}/estado', [UsuarioController::class, 'cambiarEstadoUsuario']);
    });

    Route::prefix('plantillas')->group(function () {
        Route::post('/', [PlantillaController::class, 'crearPlantilla']);
        Route::get('/', [PlantillaController::class, 'listarPlantillas']);
        Route::get('/{id}', [PlantillaController::class, 'obtenerPlantillaPorId']);
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
    

});











// Rutas para Participantes (Demandante, Demandado) - id_rol 4, 5
Route::middleware(['force.json', \App\Http\Middleware\JWTAuthMiddleware::class, 'participant'])->group(function () {
    
});