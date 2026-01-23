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
        return Expediente::with([
            'plantilla',
            'solicitud.demandante',
            'solicitud.demandado', 
            'participantes.usuario.rol',
            'asunto.flujo.etapa.subEtapas',
            'asunto.flujo.subetapa'
        ])->get();
    }

    public function obtenerPorUsuario(int $idUsuario): Collection
    {
        return Expediente::whereHas('usuariosExpedientes', function ($query) use ($idUsuario) {
            $query->where('id_usuario', $idUsuario);
        })->with([
            'plantilla',
            'solicitud.demandante', 
            'solicitud.demandado',
            'participantes.usuario.rol',
            'asunto.flujo.etapa.subEtapas',
            'asunto.flujo.subetapa'
        ])->get();
    }

    public function actualizar(int $id, array $data): bool
    {
        $expediente = Expediente::find($id);
        return $expediente ? $expediente->update($data) : false;
    }

    public function obtenerIdPlantillaPorExpediente(int $idExpediente): ?int
    {
        $expediente = Expediente::find($idExpediente);
        return $expediente ? $expediente->id_plantilla : null;
    }

    public function obtenerExpedienteCompleto(int $idExpediente): ?Expediente
    {
        return Expediente::with([
            'plantilla',
            'solicitud.demandante',
            'solicitud.demandado',
            'participantes.usuario',
            'asunto'
        ])->find($idExpediente);
    }

    public function finalizarExpediente(int $idExpediente): bool
    {
        $expediente = Expediente::find($idExpediente);
        if ($expediente) {
            $expediente->activo = false;
            return $expediente->save();
        }
        return false;
    }

}
    