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
        return Usuarios::with('rol')->where('activo', true)->get();
    }

    public function listarAdministradores(): Collection
    {
        return Usuarios::with('rol')
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Administrador');
                        })
                      ->where('activo', true)
                      ->get();
    }

    public function obtenerPorId(int $id): ?Usuarios
    {
        return Usuarios::with('rol')->find($id);
    }

    public function obtenerPorNumeroDocumento(string $numeroDocumento): ?array
    {
        // Primer búsqueda: BD primaria (usuarios)
        $usuario = Usuarios::with(['rol', 'correos'])->where('numero_documento', $numeroDocumento)->first();
        
        if ($usuario) {
            return [
                'id' => $usuario->id_usuario,
                'nombre' => ucfirst(strtolower($usuario->nombre)),
                'apellido' => ucfirst(strtolower($usuario->apellido)),
                'numero_documento' => $usuario->numero_documento,
                'telefono' => $usuario->telefono,
                'correos' => $usuario->correos->pluck('direccion')->toArray(),
                'tipo' => 'usuario_sistema',
                'rol' => $usuario->rol?->nombre
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
    
}