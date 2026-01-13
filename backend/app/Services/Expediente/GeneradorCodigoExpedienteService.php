<?php

namespace App\Services\Expediente;

use App\Repositories\ExpedienteRepository;
use Carbon\Carbon;

class GeneradorCodigoExpedienteService
{
    private const PREFIJO = 'CIACBLP';

    public function __construct(
        private readonly ExpedienteRepository $expedienteRepository
    ) {}

    public function generarCodigo(): string
    {
        $año = Carbon::now()->year;
        $correlativo = $this->obtenerSiguienteCorrelativo($año);

        return sprintf('%03d-%d-%s', $correlativo, $año, self::PREFIJO);
    }

    private function obtenerSiguienteCorrelativo(int $año): int
    {
        $ultimoExpediente = $this->expedienteRepository->obtenerUltimoPorAño($año);

        if (!$ultimoExpediente) {
            return 1;
        }

        $partes = explode('-', $ultimoExpediente->codigo_expediente);
        $ultimoCorrelativo = (int) $partes[0];

        return $ultimoCorrelativo + 1;
    }
}