<?php

namespace App\Http\Controllers;

use App\DTOs\Usuarios\ActualizarPerfilDTO;
use App\DTOs\Usuarios\CrearUsuarioDTO;
use App\Http\Requests\Usuarios\AgregarUsuarioExpedienteRequest;
use App\Http\Requests\Usuarios\CrearUsuarioRequest;
use App\Http\Requests\Usuarios\ActualizarPerfilRequest;     
use App\DTOs\Usuarios\ActualizarUsuarioDTO;
use App\Http\Requests\Usuarios\AgregarUsuarioStaffExpedienteRequest;
use App\Services\UsuarioService;
use App\Http\Responses\UsuarioResponse;
use App\Exceptions\UltimoUsuarioException;
use App\Http\Requests\Usuarios\ActualizarUsuarioRequest;
use App\Http\Requests\Usuarios\AgregarUsuarioExpediente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\JsonResponse;

class UsuarioController extends Controller
{
    public function __construct(
        private readonly UsuarioService $usuarioService
    ) {}

    public function crearUsuario(CrearUsuarioRequest $request)
    {

    }




    public function obtenerUsuarioPorId($id): JsonResponse
    {
        try {
            $usuario = $this->usuarioService->obtenerUsuarioPorId($id);

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            return UsuarioResponse::usuario($usuario);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function listarSecretarios(): JsonResponse
    {
        try {
            $secretarios = $this->usuarioService->listarUsuariosSecretarios();
            return UsuarioResponse::usuarios($secretarios);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar usuarios secretarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarArbitros(): JsonResponse
    {
        try {
            $arbitros = $this->usuarioService->listarUsuariosArbitros();
            return UsuarioResponse::usuarios($arbitros);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar usuarios árbitros',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarContadores(): JsonResponse
    {
        try {
            $contadores = $this->usuarioService->listarUsuariosContadores();
            return UsuarioResponse::usuarios($contadores);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar usuarios contadores',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function listarAdministradores(): JsonResponse
    {
        try {
            $administradores = $this->usuarioService->listarUsuariosAdministradores();
            return UsuarioResponse::usuarios($administradores);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar usuarios administradores',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarPerfil(ActualizarPerfilRequest $request): JsonResponse
    {
        try {
            $userId = $request->user()->id_usuario;
            
            $dto = ActualizarPerfilDTO::fromRequest(
                $request->validated(),
                $userId
            );

            $usuarioActualizado = $this->usuarioService->actualizarPerfil($dto);

            return UsuarioResponse::perfilActualizado($usuarioActualizado);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function agregarCrearUsuarioParteExpediente(AgregarUsuarioExpedienteRequest $request, int $idExpediente): JsonResponse
    {
        try {
            $data = $request->validated();
            $usuarioExpediente = $this->usuarioService->agregarCrearUsuarioParteAExpediente($data, $idExpediente);
            
            return UsuarioResponse::usuarioCreadoAgregadoExpediente($usuarioExpediente);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function listarParticipantesPartesExpediente(int $idExpediente): JsonResponse
    {
        try {
            $participantes = $this->usuarioService->listarParticipantesPartesExpediente($idExpediente);
            
            return UsuarioResponse::participantesExpediente($participantes);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function listarArbitroYSecretarioYContadorExpediente(int $idExpediente): JsonResponse
    {
        try {
            $staff = $this->usuarioService->obtenerArbitroYSecretarioYContadorExpediente($idExpediente);
            
            return UsuarioResponse::staffExpediente($staff);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function cambiarEstadoUsuario($id): JsonResponse
    {
        try {
            $result = $this->usuarioService->cambiarEstadoUsuario($id);

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Estado del usuario cambiado exitosamente'
            ]);
        } catch (UltimoUsuarioException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado del usuario'
            ], 500);
        }
    }


    public function actualizarUsuario($id, ActualizarUsuarioRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $dto = ActualizarUsuarioDTO::fromRequest($data);
            $usuarioActualizado = $this->usuarioService->actualizarUsuario($id, $dto);

            if (!$usuarioActualizado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            return UsuarioResponse::usuarioActualizado($usuarioActualizado);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function crearUsuarioSecretario(CrearUsuarioRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            
            $dto = CrearUsuarioDTO::fromArray([
                'nombre_completo' => $data['nombre_completo'],
                'numero_documento' => null,
                'correo' => $data['correo'],
                'telefono' => $data['telefono'] ?? null,
                'id_rol' => 3, // Rol secretario
                'activo' => true
            ]);
            
            $usuarioCreado = $this->usuarioService->crearUsuarioSecretario($dto);

            return UsuarioResponse::usuarioCreado($usuarioCreado['usuario']);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el usuario secretario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function crearUsuarioArbitro(CrearUsuarioRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            
            // Crear DTO con los datos del request
            $dto = CrearUsuarioDTO::fromArray([
                'nombre_completo' => $data['nombre_completo'],
                'numero_documento' => null,
                'correo' => $data['correo'],
                'telefono' => $data['telefono'] ?? null,
                'id_rol' => 2, // Rol árbitro
                'activo' => true
            ]);
            
            $usuarioCreado = $this->usuarioService->crearUsuarioArbitro($dto);

            return UsuarioResponse::usuarioCreado($usuarioCreado['usuario']);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el usuario árbitro',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function crearUsuarioContador(CrearUsuarioRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            
            // Crear DTO con los datos del request
            $dto = CrearUsuarioDTO::fromArray([
                'nombre_completo' => $data['nombre_completo'],
                'numero_documento' => null,
                'correo' => $data['correo'],
                'telefono' => $data['telefono'] ?? null,
                'id_rol' => 6, // Rol contador
                'activo' => true
            ]);
            
            $usuarioCreado = $this->usuarioService->crearUsuarioContador($dto);

            return UsuarioResponse::usuarioCreado($usuarioCreado['usuario']);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el usuario contador',
                'error' => $e->getMessage()
            ], 500);
        }
    }




    public function buscarSecretarios(Request $request): JsonResponse
    {
        try {
            $nombre = $request->query('nombre', '');
            $secretarios = $this->usuarioService->buscarSecretariosPorNombre($nombre);

            return response()->json([
                'success' => true,
                'data' => $secretarios
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar secretarios'
            ], 500);
        }
    }

    public function buscarContadores(Request $request): JsonResponse
    {
        try {
            $nombre = $request->query('nombre', '');
            $contadores = $this->usuarioService->buscarContadoresPorNombre($nombre);

            return response()->json([
                'success' => true,
                'data' => $contadores
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar contadores'
            ], 500);
        }
    }

    public function vincularStaffAExpediente(AgregarUsuarioStaffExpedienteRequest $request, int $idExpediente): JsonResponse
    {
        try {    
            $data = $request->validated();
            $resultado = $this->usuarioService->agregarUsuarioStaffAExpediente(
                $data, 
                $idExpediente
            );

            return UsuarioResponse::staffVinculado($resultado);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function desvincularUsuarioDeExpediente(int $idUsuario, int $idExpediente): JsonResponse
    {
        try {
            $this->usuarioService->desvincularUsuarioDeExpediente($idUsuario, $idExpediente);

            return response()->json([
                'success' => true,
                'message' => 'Usuario desvinculado del expediente exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
}
