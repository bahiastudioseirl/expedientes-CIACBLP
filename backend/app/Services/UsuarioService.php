<?php

namespace App\Services;

use App\DTOs\Usuarios\ActualizarUsuarioDTO;
use App\DTOs\Usuarios\CrearUsuarioDTO;
use App\DTOs\Usuarios\ActualizarPerfilDTO;
use App\DTOs\Usuarios\AgregarUsuarioExpedienteDTO;
use App\Models\Usuarios;
use App\Models\Correos;
use App\Repositories\UsuarioRepository;
use App\Repositories\CorreoRepository;
use App\Repositories\ExpedienteRepository;
use App\Repositories\Solicitud\SolicitudParteRepository;
use App\Repositories\Solicitud\SolicitudCorreoRepository;
use App\Repositories\UsuarioExpedienteRepository;
use App\Services\Expediente\CreadorUsuariosExpedienteService;
use App\Services\Expediente\GeneradorCredencialesService;
use App\Repositories\RolRepository;
use App\Exceptions\UltimoUsuarioException;
use App\Repositories\SecondDB\PostulantesArbitroRepository;
use App\Mail\CredencialesSecretario;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;
use Exception;

class UsuarioService
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository,
        private readonly PostulantesArbitroRepository $postulantesArbitroRepository,
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly SolicitudParteRepository $solicitudParteRepository,
        private readonly SolicitudCorreoRepository $solicitudCorreoRepository,
        private readonly UsuarioExpedienteRepository $usuarioExpedienteRepository,
        private readonly CreadorUsuariosExpedienteService $creadorUsuarios,
        private readonly GeneradorCredencialesService $generadorCredenciales,
        private readonly RolRepository $rolRepository
    ){}

    public function obtenerUsuarioPorId(int $id): ?Usuarios
    {
        return $this->usuarioRepository->obtenerPorId($id);
    }





    public function cambiarEstadoUsuario(int $id): bool
    {
        $usuario = $this->usuarioRepository->obtenerPorId($id);
        if (!$usuario) {
            return false;
        }
        
        if ($usuario->activo) {
            $usuariosActivos = $this->usuarioRepository->contarUsuariosActivos();
            if ($usuariosActivos <= 1) {
                throw new UltimoUsuarioException();
            }
            return $this->usuarioRepository->cambiarEstadoUsuario($usuario, false);
        } else {
            return $this->usuarioRepository->cambiarEstadoUsuario($usuario, true);
        }
    }


    public function crearUsuarioSecretario(CrearUsuarioDTO $dto): array
    {
        $contrasenaGenerada = $this->generarContrasena();
        
        $usuario = $this->usuarioRepository->crear([
            'correo' => $dto->correo,
            'contrasena' => bcrypt($contrasenaGenerada),
            'nombre_completo' => $dto->nombre_completo,
            'numero_documento' => $dto->numero_documento,
            'telefono' => $dto->telefono,
            'activo' => true,
            'id_rol' => 3, // Rol secretario
        ]);
        
        // Enviar correo con credenciales
        Mail::to($usuario->correo)->send(new \App\Mail\CredencialesUsuario(
            $usuario->nombre_completo,
            $usuario->correo,
            $contrasenaGenerada
        ));
        
        return [
            'usuario' => $usuario,
            'contrasena' => $contrasenaGenerada
        ];
    }

    public function crearUsuarioArbitro(CrearUsuarioDTO $dto): array
    {
        $contrasenaGenerada = $this->generarContrasena();
        
        $usuario = $this->usuarioRepository->crear([
            'correo' => $dto->correo,
            'contrasena' => bcrypt($contrasenaGenerada),
            'nombre_completo' => $dto->nombre_completo,
            'numero_documento' => $dto->numero_documento,
            'telefono' => $dto->telefono,
            'activo' => true,
            'id_rol' => 2, // Rol árbitro
        ]);
        
        // Enviar correo con credenciales
        Mail::to($usuario->correo)->send(new \App\Mail\CredencialesUsuario(
            $usuario->nombre_completo,
            $usuario->correo,
            $contrasenaGenerada
        ));
        
        return [
            'usuario' => $usuario,
            'contrasena' => $contrasenaGenerada
        ];
    }

    public function crearUsuarioContador(CrearUsuarioDTO $dto): array
    {
        $contrasenaGenerada = $this->generarContrasena();
        
        $usuario = $this->usuarioRepository->crear([
            'correo' => $dto->correo,
            'contrasena' => bcrypt($contrasenaGenerada),
            'nombre_completo' => $dto->nombre_completo,
            'numero_documento' => $dto->numero_documento,
            'telefono' => $dto->telefono,
            'activo' => true,
            'id_rol' => 6, // Rol contador
        ]);
        
        // Vincular contador a todos los expedientes existentes
        $this->vincularContadorATodosLosExpedientes($usuario->id_usuario);
        
        // Enviar correo con credenciales
        Mail::to($usuario->correo)->send(new \App\Mail\CredencialesUsuario(
            $usuario->nombre_completo,
            $usuario->correo,
            $contrasenaGenerada
        ));
        
        return [
            'usuario' => $usuario,
            'contrasena' => $contrasenaGenerada
        ];
    }
    
    private function generarContrasena(): string
    {
        return Str::random(8);
    }

    /**
     * Vincula un contador a todos los expedientes existentes
     */
    private function vincularContadorATodosLosExpedientes(int $idUsuario): void
    {
        $expedientes = $this->expedienteRepository->obtenerTodos();
        
        foreach ($expedientes as $expediente) {
            // Verificar si ya existe el vínculo
            if (!$this->usuarioExpedienteRepository->existeVinculo($idUsuario, $expediente->id_expediente)) {
                $this->creadorUsuarios->vincularUsuarioExpediente(
                    idUsuario: $idUsuario,
                    idExpediente: $expediente->id_expediente
                );
            }
        }
    }

    public function listarUsuariosSecretarios(): Collection
    {
        return $this->usuarioRepository->listarUsuariosSecretarios();
    }

    public function listarUsuariosArbitros(): Collection
    {
        return $this->usuarioRepository->listarUsuariosArbitros();
    }

    public function listarUsuariosContadores(): Collection
    {
        return $this->usuarioRepository->listarUsuariosContadores();
    }

    public function listarUsuariosAdministradores(): Collection
    {
        return $this->usuarioRepository->listarUsuariosAdministradores();
    }

    public function buscarSecretariosPorNombre(string $nombre, int $limite = 10): array
    {
        return $this->usuarioRepository->buscarSecretariosPorNombre($nombre, $limite);
    }

    public function buscarContadoresPorNombre(string $nombre, int $limite = 10): array
    {
        return $this->usuarioRepository->buscarContadoresPorNombre($nombre, $limite);
    }

    public function buscarArbitrosPorNombre(string $nombre, int $limite = 10): array
    {
        $resultadosPrincipales = $this->usuarioRepository->buscarArbitrosPorNombre($nombre, $limite);
        
        if (!empty($resultadosPrincipales)) {
            return $resultadosPrincipales;
        }
        
        $resultadosSecundarios = $this->postulantesArbitroRepository->buscarPorNombre($nombre, $limite);
        
        return array_map(function ($arbitro) {
            $arbitro['origen'] = 'bd_secundaria';
            return $arbitro;
        }, $resultadosSecundarios);
    }

    public function actualizarPerfil(ActualizarPerfilDTO $dto): Usuarios
    {
        $usuario = $this->usuarioRepository->obtenerPorId($dto->id_usuario);
        
        if (!$usuario) {
            throw new \Exception('Usuario no encontrado');
        }

        return $this->usuarioRepository->actualizarPerfil($dto);
    }


    public function agregarCrearUsuarioParteAExpediente(array $data, int $id_expediente)
    {
        try {
            $expediente = $this->expedienteRepository->obtenerPorId($id_expediente);
            if (!$expediente) {
                throw new Exception('Expediente no encontrado');
            }

            $idSolicitud = $expediente->id_solicitud;
            $correo = $data['correo'];
            $tipo = $data['tipo']; 

            $solicitudParte = $this->solicitudParteRepository->obtenerPorSolicitudYTipo($idSolicitud, $tipo)->first();
            if (!$solicitudParte) {
                throw new Exception("No se encontró una parte de tipo '{$tipo}' en la solicitud del expediente");
            }

            $correoExistente = $this->solicitudCorreoRepository->obtenerPorSolicitudParte($solicitudParte->id_solicitud_parte)
                ->where('correo', $correo)->first();
            
            if ($correoExistente) {
                throw new Exception("El correo ya está registrado para esta parte en la solicitud");
            }

            $this->solicitudCorreoRepository->crear([
                'correo' => $correo,
                'es_principal' => false, 
                'id_solicitud_parte' => $solicitudParte->id_solicitud_parte
            ]);

            $credenciales = $this->creadorUsuarios->crearUsuariosPorCorreos(
                [$correo], 
                $id_expediente, 
                ucfirst($tipo), 
                '',
                'Credenciales de acceso al expediente ' . $expediente->codigo_expediente
            );

            return [
                'usuario_creado' => $credenciales[$correo],
                'correo_agregado' => $correo,
                'tipo_parte' => $tipo,
                'solicitud_parte_id' => $solicitudParte->id_solicitud_parte
            ];

        } catch (Exception $e) {
            throw new Exception('Error al agregar usuario al expediente: ' . $e->getMessage());
        }
    }

    public function listarParticipantesPartesExpediente(int $idExpediente): array
    {
        try {
            $participantesExpediente = $this->usuarioExpedienteRepository->obtenerPorExpediente($idExpediente);
            
            if ($participantesExpediente->isEmpty()) {
                return [
                    'demandantes' => collect(),
                    'demandados' => collect(),
                    'total' => 0
                ];
            }

            // Separar demandantes y demandados usando partition
            $participantesSeparados = $participantesExpediente
                ->filter(function ($participante) {
                    $rolNombre = $participante->usuario?->rol?->nombre;
                    return in_array($rolNombre, ['Demandante', 'Demandado']);
                })
                ->partition(function ($participante) {
                    return $participante->usuario?->rol?->nombre === 'Demandante';
                });

            $demandantes = collect($participantesSeparados[0])->pluck('usuario');
            $demandados = collect($participantesSeparados[1])->pluck('usuario');

            return [
                'demandantes' => $demandantes,
                'demandados' => $demandados,
                'total' => $demandantes->count() + $demandados->count()
            ];

        } catch (Exception $e) {
            throw new Exception('Error al listar participantes: ' . $e->getMessage());
        }
    }

    public function obtenerArbitroYSecretarioExpediente(int $idExpediente): array
    {
        try {
            $participantesExpediente = $this->usuarioExpedienteRepository->obtenerPorExpediente($idExpediente);
            
            $staff = [];

            foreach ($participantesExpediente as $participante) {
                if (!$participante->usuario) {
                    continue; // Saltar si no hay usuario
                }
                
                $rolNombre = $participante->usuario->rol?->nombre;
                
                if ($rolNombre === 'Arbitro' || $rolNombre === 'Secretario') {
                    $staff[] = $participante->usuario;
                }
            }
            
            return $staff;

        } catch (Exception $e) {
            throw new Exception('Error al obtener staff del expediente: ' . $e->getMessage());
        }
    }

    public function agregarUsuarioStaffAExpediente(array $data, int $idExpediente): array
    {
        try {
            $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
            if (!$expediente) {
                throw new Exception('Expediente no encontrado');
            }

            $tipo = $data['tipo'];
            $correo = $data['correo'] ?? null;
            $numeroDocumento = $data['numero_documento'] ?? null;

            if ($tipo === 'Arbitro') {
                return $this->creadorUsuarios->crearUsuarioArbitro(
                    nombreCompleto: $data['nombre_completo'] ?? '',
                    numeroDocumento: $numeroDocumento ?? '',
                    correo: $correo ?? '',
                    telefono: $data['telefono'] ?? null,
                    idExpediente: $idExpediente
                );
            } elseif ($tipo === 'Secretario') {
                return $this->creadorUsuarios->crearUsuarioSecretario(
                    nombreCompleto: $data['nombre_completo'] ?? '',
                    correo: $correo ?? '',
                    telefono: $data['telefono'] ?? null,
                    idExpediente: $idExpediente
                );
            } else {
                throw new Exception("Tipo de usuario '{$tipo}' no soportado");
            }

        } catch (Exception $e) {
            throw new Exception('Error al agregar usuario staff al expediente: ' . $e->getMessage());
        }
    }

    public function desvincularUsuarioDeExpediente(int $idUsuario, int $idExpediente): bool
    {
        try {
            $usuario = $this->usuarioRepository->obtenerPorId($idUsuario);
            if (!$usuario) {
                throw new Exception('Usuario no encontrado');
            }

            $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
            if (!$expediente) {
                throw new Exception('Expediente no encontrado');
            }

            return $this->usuarioExpedienteRepository->eliminar($idUsuario, $idExpediente);

        } catch (Exception $e) {
            throw new Exception('Error al desvinacular usuario del expediente: ' . $e->getMessage());
        }
    }


    public function actualizarUsuario(int $id, ActualizarUsuarioDTO $dto): Usuarios
    {
        $usuario = $this->usuarioRepository->obtenerPorId($id);
    
        if (!$usuario) {
            throw new \Exception('Usuario no encontrado');
        }

        return $this->usuarioRepository->actualizar($id, $dto->toArray());
    }

}