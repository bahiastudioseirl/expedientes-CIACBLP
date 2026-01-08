<?php

namespace App\Services\Solicitud;

use App\DTOs\Solicitudes\SolicitudParte\CrearSolicitudParteDTO;
use App\DTOs\Solicitudes\SolicitudCorreo\CrearSolicitudCorreoDTO;
use App\DTOs\Solicitudes\SolicitudRepresentante\CrearSolicitudRepresentanteDTO;
use App\DTOs\Solicitudes\SolicitudDemandadoExtra\CrearSolicitudDemandadoExtraDTO;
use App\Repositories\Solicitud\SolicitudParteRepository;
use App\Repositories\Solicitud\SolicitudCorreoRepository;
use App\Repositories\Solicitud\SolicitudRepresentanteRepository;
use App\Repositories\Solicitud\SolicitudDemandadoExtraRepository;
use App\Models\SolicitudParte;

class SolicitudParteService
{
    public function __construct(
        private SolicitudParteRepository $parteRepository,
        private SolicitudCorreoRepository $correoRepository,
        private SolicitudRepresentanteRepository $representanteRepository,
        private SolicitudDemandadoExtraRepository $demandadoExtraRepository,
    ) {}

    public function crearParteCompleta(
        CrearSolicitudParteDTO $parteDTO,
        array $correosDTO,
        ?CrearSolicitudRepresentanteDTO $representanteDTO,
        int $id_solicitud,
        ?CrearSolicitudDemandadoExtraDTO $demandadoExtraDTO = null
    ): SolicitudParte {
        $parte = $this->crearParte($parteDTO, $id_solicitud);
        
        $this->crearCorreos($correosDTO, $parte->id_solicitud_parte);
        
        if ($representanteDTO) {
            $this->crearRepresentante($representanteDTO, $parte->id_solicitud_parte);
        }
        
        if ($demandadoExtraDTO && $parteDTO->getTipo() === 'demandado') {
            $this->crearDemandadoExtra($demandadoExtraDTO, $parte->id_solicitud_parte);
        }
        
        return $parte;
    }

    private function crearParte(CrearSolicitudParteDTO $parteDTO, int $id_solicitud): SolicitudParte
    {
        $data = $parteDTO->toArray();
        $data['id_solicitud'] = $id_solicitud;
        return $this->parteRepository->crear($data);
    }

    private function crearCorreos(array $correosDTO, int $id_solicitud_parte): void
    {
        $correos = array_map(function(CrearSolicitudCorreoDTO $correoDTO) use ($id_solicitud_parte) {
            $data = $correoDTO->toArray();
            $data['id_solicitud_parte'] = $id_solicitud_parte;
            $data['created_at'] = now();
            $data['updated_at'] = now();
            return $data;
        }, $correosDTO);

        $this->correoRepository->crearMultiples($correos);
    }

    private function crearRepresentante(CrearSolicitudRepresentanteDTO $representanteDTO, int $id_solicitud_parte): void
    {
        $data = $representanteDTO->toArray();
        $data['id_solicitud_parte'] = $id_solicitud_parte;
        $this->representanteRepository->crear($data);
    }

    private function crearDemandadoExtra(CrearSolicitudDemandadoExtraDTO $demandadoExtraDTO, int $id_solicitud_parte): void
    {
        $data = $demandadoExtraDTO->toArray();
        $data['id_solicitud_parte'] = $id_solicitud_parte;
        $this->demandadoExtraRepository->crear($data);
    }
}