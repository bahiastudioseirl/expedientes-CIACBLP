<?php

namespace App\Repositories;

use App\Models\Asunto;

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
}