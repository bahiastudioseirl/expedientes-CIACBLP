<?php

namespace App\Repositories;

use App\Models\Asunto;
use App\Models\Expediente;
use App\Models\Flujo;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class FlujoRepository
{
    public function crear(array $data): Flujo
    {
        return Flujo::create($data);
    }

    public function obtenerPorId(int $id): ?Flujo
    {
        return Flujo::with(['expediente', 'etapa', 'subetapa'])->find($id);
    }

    public function obtenerPorExpediente(int $idExpediente): Collection
    {
        return Flujo::with(['etapa', 'subetapa'])
                   ->where('id_expediente', $idExpediente)
                   ->orderBy('fecha_inicio')
                   ->get();
    }

    public function actualizar(Flujo $flujo, array $data): bool
    {
        return $flujo->update($data);
    }

    public function obtenerFlujoActual(int $idExpediente): ?Flujo
    {
        return Flujo::with(['etapa', 'subetapa'])
                   ->where('id_expediente', $idExpediente)
                   ->where('estado', 'en proceso')
                   ->first();
    }

    public function completarFlujo(Flujo $flujo): bool
    {
        return $flujo->update([
            'estado' => 'completado',
            'fecha_fin' => now()
        ]);
    }

    public function validarEtapaEnPlantilla(int $idExpediente, int $idEtapa, ?int $idSubetapa = null): bool
    {
        $expediente = Expediente::with('plantilla.etapas.subEtapas')->find($idExpediente);
        
        if (!$expediente || !$expediente->plantilla) {
            return false;
        }

        $etapaValida = $expediente->plantilla->etapas->contains('id_etapa', $idEtapa);
        
        if (!$etapaValida) {
            return false;
        }

        if ($idSubetapa) {
            $etapa = $expediente->plantilla->etapas->where('id_etapa', $idEtapa)->first();
            return $etapa && $etapa->subEtapas->contains('id_sub_etapa', $idSubetapa);
        }

        return true;
    }

    public function crearAsuntoParaFlujo(int $idExpediente, int $idFlujo, string $asunto): void
    {
        $expediente = Expediente::with('participantes.usuario')->find($idExpediente);
        if (!$expediente) {
            throw new Exception("Expediente no encontrado para crear el asunto");
        }

        $demandante = null;
        $demandado = null;
        
        foreach ($expediente->participantes as $participante) {
            if ($participante->rol_en_expediente === 'Demandante') {
                $demandante = $participante->usuario->nombre_empresa ?? 'Demandante';
            } elseif ($participante->rol_en_expediente === 'Demandado') {
                $demandado = $participante->usuario->nombre_empresa ?? 'Demandado';
            }
        }

        $titulo = ($demandante ?? 'Demandante') . ' - ' . ($demandado ?? 'Demandado') . 
                  ' // Caso arbitral ' . $expediente->codigo_expediente . 
                  ' | ' . $asunto;

        Asunto::create([
            'titulo' => $titulo,
            'activo' => true,
            'id_flujo' => $idFlujo,
            'id_expediente' => $idExpediente
        ]);
    }

    public function listarFlujosPorExpediente(int $idExpediente): Collection
    {
        return Flujo::with(['expediente', 'etapa', 'subetapa'])
                   ->where('id_expediente', $idExpediente)
                   ->orderBy('fecha_inicio', 'desc')
                   ->get()
                   ->map(function ($flujo) {
                       $estado = $flujo->estado;
                       
                       if ($estado === 'en proceso' && $flujo->fecha_fin_estimada) {
                           $fechaFin = Carbon::parse($flujo->fecha_fin_estimada);
                           $ahora = Carbon::now();
                           
                           if ($ahora->gt($fechaFin)) {
                               $estado = 'vencido';
                           } elseif ($ahora->diffInDays($fechaFin) <= 3) {
                               $estado = 'por vencer';
                           }
                       }
                       
                       $flujo->estado_calculado = $estado;
                       return $flujo;
                   });
    }
}