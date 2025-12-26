<?php

namespace App\Repositories;

use App\Models\Expediente;
use App\Models\ExpedienteParticipante;
use Illuminate\Database\Eloquent\Collection;

class ExpedienteRepository
{
    public function crear(array $data): Expediente
    {
        return Expediente::create($data);
    }

    public function actualizar(Expediente $expediente, array $data): bool
    {
        return $expediente->update($data);
    }

    public function listarExpedientes(): Collection
    {
        return Expediente::with(['plantilla', 'usuario', 'participantes.usuario.correos'])
                        ->where('activo', true)
                        ->get();
    }

    public function obtenerPorId(int $id): ?Expediente
    {
        return Expediente::with(['plantilla', 'usuario', 'participantes.usuario.correos'])->find($id);
    }

    public function eliminar(Expediente $expediente): bool
    {
        return $expediente->delete();
    }

    public function cambiarEstado(Expediente $expediente, bool $activo): bool
    {
        $expediente->activo = $activo;
        return $expediente->save();
    }

    public function crearParticipante(array $data): ExpedienteParticipante
    {
        return ExpedienteParticipante::create($data);
    }

    public function obtenerPorCodigoExpediente(string $codigo): ?Expediente
    {
        return Expediente::with(['plantilla', 'usuario', 'participantes.usuario.correos'])
                        ->where('codigo_expediente', $codigo)
                        ->first();
    }

    public function eliminarParticipantes(int $idExpediente): bool
    {
        return ExpedienteParticipante::where('id_expediente', $idExpediente)->delete();
    }

    public function obtenerParticipantes(int $idExpediente): Collection
    {
        return ExpedienteParticipante::with('usuario.correos')
                                   ->where('id_expediente', $idExpediente)
                                   ->get();
    }
}