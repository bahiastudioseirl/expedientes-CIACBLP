<?php

namespace App\Services;

use App\Repositories\AsuntoRepository;

class AsuntoService
{
    public function __construct(
        private readonly AsuntoRepository $asuntoRepository
    ){}

    public function verAsuntosPorExpediente(int $idExpediente)
    {
        return $this->asuntoRepository->verAsuntosPorExpediente($idExpediente);
    }
}