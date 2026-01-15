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

    public function obtenerPorId(int $id_expediente): ?Expediente
    {
        return Expediente::with(['plantilla', 'solicitud'])->find($id_expediente);
    }
    
    public function obtenerUltimoPorAño(int $año): ?Expediente
    {
        return Expediente::whereYear('created_at', $año)
            ->orderBy('created_at', 'desc')
            ->first();
    }

    public function obtenerTodos(): Collection
    {
        return Expediente::all();
    }

    public function obtenerPorUsuario(int $idUsuario): Collection
    {
        return Expediente::whereHas('usuariosExpedientes', function ($query) use ($idUsuario) {
            $query->where('id_usuario', $idUsuario);
        })->get();
    }

    public function actualizar(int $id, array $data): bool
    {
        $expediente = Expediente::find($id);
        return $expediente ? $expediente->update($data) : false;
    }

}
    