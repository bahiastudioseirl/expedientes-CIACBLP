<?php

namespace App\Repositories;

use App\Models\Asunto;
use App\Models\Flujo;

class AsuntoRepository
{
    public function crear(array $data)
    {
        return Asunto::create($data);
    }

    public function obtenerPorId(int $id): ?Asunto
    {
        return Asunto::find($id);
    }

    public function verAsuntosPorExpediente(int $idExpediente)
    {
        return Asunto::where('id_expediente', $idExpediente)->get();
    }

    public function cerrarOAbrirAsunto(Asunto $asunto, bool $cerrar): bool
    {
        $asunto->activo = !$cerrar;
        return $asunto->save();
    }

    public function flujoCompletado(Asunto $asunto): bool
    {
        $flujo = $asunto->flujo ?? ($asunto->flujo_id ? Flujo::find($asunto->flujo_id) : null);
        return $flujo && $flujo->estado === 'completado';
    }

    public function saberEstadoPorId(int $id): ?bool
    {
        $asunto = Asunto::find($id);
        return $asunto ? $asunto->activo : null;
    }
}
