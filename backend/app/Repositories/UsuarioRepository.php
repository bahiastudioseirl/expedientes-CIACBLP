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

    public function actualizar(Usuarios $usuario, array $data): bool
    {
        return $usuario->update($data);
    }

    
    public function listarUsuarios(): Collection
    {
        return Usuarios::with(['rol', 'correos'])->where('activo', true)->get();
    }

    public function listarAdministradores(): Collection
    {
        return Usuarios::with(['rol', 'correos'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Administrador');
                        })
                      ->get();
    }

    public function obtenerPorId(int $id): ?Usuarios
    {
        return Usuarios::with(['rol', 'correos'])->find($id);
    }

    public function obtenerPorNumeroDocumento(string $numeroDocumento): ?array
    {
        $usuario = Usuarios::with(['rol', 'correos'])->where('numero_documento', $numeroDocumento)->first();
        
        if ($usuario) {
            $rolNombre = $usuario->rol?->nombre;
            $isEmpresa = ($rolNombre === 'Demandante' || $rolNombre === 'Demandado');
            return [
                'id' => $usuario->id_usuario,
                'nombre' => $isEmpresa ? null : ucfirst(strtolower($usuario->nombre)),
                'apellido' => $isEmpresa ? null : ucfirst(strtolower($usuario->apellido)),
                'nombre_empresa' => $isEmpresa ? $usuario->nombre_empresa : null,
                'numero_documento' => $usuario->numero_documento,
                'telefono' => $usuario->telefono,
                'correos' => $usuario->correos->pluck('direccion')->toArray(),
                'tipo' => 'usuario_sistema',
                'rol' => $rolNombre
            ];
        }

        $arbitro = $this->arbitroRepository->obtenerPorNumeroDocumento($numeroDocumento);
        
        return $arbitro;
    }


    public function obtenerPorNumeroDocumentoLegacy(string $numeroDocumento): ?Usuarios
    {
        return Usuarios::with(['rol', 'correos'])->where('numero_documento', $numeroDocumento)->first();
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

    public function listarUsuariosArbitros(): Collection
    {
        return Usuarios::with(['rol', 'correos'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Arbitro');
                        })
                      ->get();
    }

    public function listarUsuariosSecretarios(): Collection
    {
        return Usuarios::with(['rol', 'correos'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Secretario');
                        })
                      ->get();
    }

    public function listarUsuariosDemandantes(): Collection
    {
        return Usuarios::with(['rol', 'correos'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Demandante');
                        })
                      ->get();
    }

    public function listarUsuariosDemandados(): Collection
    {
        return Usuarios::with(['rol', 'correos'])
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Demandado');
                        })
                      ->get();
    }
    

    public function obtenerUsuarioPorRolYEstado(int $rolId, bool $activo): ?Usuarios
    {
        return Usuarios::where('id_rol', $rolId)
            ->where('activo', $activo)
            ->first();
    }

}