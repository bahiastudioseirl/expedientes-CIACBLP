<?php

namespace App\Services\Solicitud;

use App\DTOs\Solicitudes\SolicitudPretension\CrearSolicitudPretensionDTO;
use App\Repositories\Solicitud\SolicitudPretensionRepository;

class SolicitudPretensionService
{
    public function __construct(
        private SolicitudPretensionRepository $pretensionRepository,
    ) {}
    public function crearPretensiones(array $pretensionesDTO, int $id_solicitud): void
    {
        $pretensiones = array_map(function(CrearSolicitudPretensionDTO $pretensionDTO) use ($id_solicitud) {
            $data = $pretensionDTO->toArray();
            $data['id_solicitud'] = $id_solicitud;
            $data['created_at'] = now();
            $data['updated_at'] = now();
            return $data;
        }, $pretensionesDTO);

        $this->pretensionRepository->crearMultiples($pretensiones);
    }
}