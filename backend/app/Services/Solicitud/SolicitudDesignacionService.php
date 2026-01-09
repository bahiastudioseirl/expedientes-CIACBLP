<?php

namespace App\Services\Solicitud;

use App\DTOs\Solicitudes\SolicitudDesignacion\CrearSolicitudDesignacionDTO;
use App\DTOs\Solicitudes\SolicitudArbitro\CrearSolicitudArbitroDTO;
use App\Repositories\Solicitud\SolicitudDesignacionRepository;

class SolicitudDesignacionService
{
    public function __construct(
        private SolicitudDesignacionRepository $designacionRepository,
    ) {}

    public function crearDesignacion(
        CrearSolicitudDesignacionDTO $designacionDTO, 
        array $arbitrosDTO, 
        int $id_solicitud
    ): void {
        $dataDesignacion = $designacionDTO->toArray();
        $dataDesignacion['id_solicitud'] = $id_solicitud;
        $designacion = $this->designacionRepository->crear($dataDesignacion);

        // Solo crear árbitro si hay datos en el array
        if (!empty($arbitrosDTO)) {
            $arbitroDTO = $arbitrosDTO[0]; // Solo el primer árbitro
            $data = $arbitroDTO->toArray();
            $data['id_solicitud_designacion'] = $designacion->id_solicitud_designacion;
            $this->designacionRepository->crearArbitro($data);
        }
    }
}