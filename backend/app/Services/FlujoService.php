<?php

namespace App\Services;

use App\Repositories\FlujoRepository;

class FlujoService
{
    public function __construct(
        private readonly FlujoRepository $flujoRepository
    )
    {}

    public function obtenerFlujosPorExpediente(int $idExpediente)
    {
        return $this->flujoRepository->obtenerPorExpediente($idExpediente);
    }

    public function obtenerFlujoActual(int $idExpediente)
    {
        return $this->flujoRepository->obtenerFlujoActual($idExpediente);
    }
}