<?php

namespace App\Repositories;

use App\Models\Usuarios;
use App\Repositories\SecondDB\PostulantesArbitroRepository;
use Illuminate\Database\Eloquent\Collection;


class UsuarioRepository
{
    protected $arbitroRepository;

    public function __construct(PostulantesArbitroRepository $arbitroRepository)
    {
        $this->arbitroRepository = $arbitroRepository;
    }

    public function crear(array $data): Usuarios
    {
        return Usuarios::create($data);
    }

    public function actualizar(int $id, array $data): Usuarios
    {
        $usuario = Usuarios::findOrFail($id);
        $usuario->update($data);
        $usuario->refresh();
        $usuario->load(['rol']);
        return $usuario;
    }



    public function obtenerAdministradores(): Collection
    {
        return Usuarios::whereHas('rol', function ($query) {
                            $query->where('nombre', 'Administrador');
                        })
                        ->where('activo', true)
                        ->get();
    }

    public function obtenerPorId(int $id): ?Usuarios
    {
        return Usuarios::with(['rol'])->find($id);
    }


    public function cambiarEstadoUsuario(Usuarios $usuario, bool $activo): bool
    {
        $usuario->activo = $activo;
        return $usuario->save();
    }
    
    public function contarUsuariosActivos(): int
    {
        return Usuarios::where('activo', true)->count();
    }


    public function listarUsuariosSecretarios(): Collection
    {
        return Usuarios::with(['rol'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Secretario');
                        })
                      ->get();
    }

    public function listarUsuariosArbitros(): Collection
    {
        return Usuarios::with(['rol'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Arbitro');
                        })
                      ->get();
    }

    public function listarUsuariosAdministradores(): Collection
    {
        return Usuarios::with(['rol'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Administrador');
                        })
                      ->get();
    }

    public function obtenerUsuarioPorRolYEstado(int $rolId, bool $activo): ?Usuarios
    {
        return Usuarios::where('id_rol', $rolId)
            ->where('activo', $activo)
            ->first();
    }

    public function buscarPorDocumentoOCorreo(string $numeroDocumento, string $correo): ?Usuarios
    {
        return Usuarios::where(function ($query) use ($numeroDocumento, $correo) {
            $query->where('numero_documento', $numeroDocumento)
                  ->orWhere('correo', $correo);
        })
        ->first();
    }

    public function obtenerPorCorreo(string $correo): ?Usuarios
    {
        return Usuarios::where('correo', $correo)->first();
    }

    public function buscarArbitrosPorNombre(string $nombre, int $limite = 10): array
    {
        $resultados = Usuarios::with(['rol'])
            ->whereHas('rol', function ($query) {
                $query->where('nombre', 'Arbitro');
            })
            ->where('nombre_completo', 'like', '%' . $nombre . '%')
            ->limit($limite)
            ->get();

        return $resultados->map(function ($usuario) {
            return [
                'id' => $usuario->id_usuario,
                'nombre_completo' => $usuario->nombre_completo,
                'numero_documento' => $usuario->numero_documento,
                'telefono' => $usuario->telefono,
                'correo' => $usuario->correo,
                'origen' => 'bd_principal'
            ];
        })->toArray();
    }

    public function buscarSecretariosPorNombre(string $nombre, int $limite = 10): array
    {
        $resultados = Usuarios::with(['rol'])
            ->whereHas('rol', function ($query) {
                $query->where('nombre', 'Secretario');
            })
            ->where('nombre_completo', 'like', '%' . $nombre . '%')
            ->limit($limite)
            ->get();

        return $resultados->map(function ($usuario) {
            return [
                'id' => $usuario->id_usuario,
                'nombre_completo' => $usuario->nombre_completo,
                'numero_documento' => $usuario->numero_documento,
                'telefono' => $usuario->telefono,
                'correo' => $usuario->correo,
                'origen' => 'bd_principal'
            ];
        })->toArray();
    }

    public function actualizarPerfil(\App\DTOs\Usuarios\ActualizarPerfilDTO $dto): Usuarios
    {
        $usuario = Usuarios::with('rol')->findOrFail($dto->id_usuario);
        $usuario->nombre_completo = $dto->nombre_completo;
        $usuario->updated_at = now();
        $usuario->save();
        
        return $usuario->fresh(['rol']);
    }
}

