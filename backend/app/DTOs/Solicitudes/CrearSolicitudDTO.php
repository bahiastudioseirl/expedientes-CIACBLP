<?php

namespace App\DTOs\Solicitudes;

use App\DTOs\Solicitudes\SolicitudArbitro\CrearSolicitudArbitroDTO;
use App\DTOs\Solicitudes\SolicitudCorreo\CrearSolicitudCorreoDTO;
use App\DTOs\Solicitudes\SolicitudParte\CrearSolicitudParteDTO;
use App\DTOs\Solicitudes\SolicitudRepresentante\CrearSolicitudRepresentanteDTO;
use App\DTOs\Solicitudes\SolicitudDemandadoExtra\CrearSolicitudDemandadoExtraDTO;
use App\DTOs\Solicitudes\SolicitudDesignacion\CrearSolicitudDesignacionDTO;
use App\DTOs\Solicitudes\SolicitudPretension\CrearSolicitudPretensionDTO;

class CrearSolicitudDTO
{
    public function __construct(  
        //Demandante
        public CrearSolicitudParteDTO $demandante,
        public array $correos_demandante,
        public ?CrearSolicitudRepresentanteDTO $representante_demandante = null,
        
        //Demandado
        public CrearSolicitudParteDTO $demandado,
        public array $correos_demandado, 
        public ?CrearSolicitudRepresentanteDTO $representante_demandado = null,
        public ?CrearSolicitudDemandadoExtraDTO $demandado_extra = null,

        //Resumen de la controversia
        public string $resumen_controversia,

        //Pretensiones
        public array $pretensiones,

        //Medida Cautelar
        public ?string $medida_cautelar,

        //Designacion Arbitral
        public CrearSolicitudDesignacionDTO $designacion,
        public array $arbitros,

        public int $id_usuario_solicitante,
        public ?string $link_anexo = null,
        public string $estado = 'pendiente',


    ){}

    public static function fromRequest(array $data): self
    {
        return new self(
            demandante: CrearSolicitudParteDTO::fromArray($data['demandante'] + ['tipo' => 'demandante', 'id_solicitud' => 0]),
            correos_demandante: array_map(
                fn($correo) => CrearSolicitudCorreoDTO::fromArray($correo + ['id_solicitud_parte' => 0]),
                $data['correos_demandante']
            ),
            representante_demandante: isset($data['representante_demandante']) 
                ? CrearSolicitudRepresentanteDTO::fromArray($data['representante_demandante'] + ['id_solicitud_parte' => 0])
                : null,
            
            demandado: CrearSolicitudParteDTO::fromArray($data['demandado'] + ['tipo' => 'demandado', 'id_solicitud' => 0]),
            correos_demandado: array_map(
                fn($correo) => CrearSolicitudCorreoDTO::fromArray($correo + ['id_solicitud_parte' => 0]),
                $data['correos_demandado']
            ),
            representante_demandado: isset($data['representante_demandado'])
                ? CrearSolicitudRepresentanteDTO::fromArray($data['representante_demandado'] + ['id_solicitud_parte' => 0])
                : null,
            demandado_extra: isset($data['demandado_extra'])
                ? CrearSolicitudDemandadoExtraDTO::fromArray($data['demandado_extra'] + ['id_solicitud_parte' => 0])
                : null,
            
            resumen_controversia: $data['resumen_controversia'],
            pretensiones: array_map(
                fn($pretension) => CrearSolicitudPretensionDTO::fromArray($pretension + ['id_solicitud' => 0]),
                $data['pretensiones']
            ),
            medida_cautelar: $data['medida_cautelar'] ?? null,
            
            designacion: CrearSolicitudDesignacionDTO::fromArray($data['designacion'] + ['id_solicitud' => 0]),
            arbitros: array_map(
                fn($arbitro) => CrearSolicitudArbitroDTO::fromArray($arbitro + ['id_solicitud_designacion' => 0]),
                $data['arbitros']
            ),
            id_usuario_solicitante: $data['id_usuario_solicitante'],
            link_anexo: $data['link_anexo'] ?? null,
        );
    }
    public function getSolicitudData(): array
    {
        return [
            'estado' => $this->estado,
            'resumen_controversia' => $this->resumen_controversia,
            'medida_cautelar' => $this->medida_cautelar,
            'link_anexo' => $this->link_anexo,
            'id_usuario_solicitante' => $this->id_usuario_solicitante
        ];
    }


    public function toArray(): array
    {
        $data = [
            'estado' => $this->estado,
            'resumen_controversia' => $this->resumen_controversia,
            'medida_cautelar' => $this->medida_cautelar,
            'link_anexo' => $this->link_anexo,
            'id_usuario_solicitante' => $this->id_usuario_solicitante,
            'demandante' => $this->demandante->toArray(),
            'correos_demandante' => array_map(fn($c) => $c->toArray(), $this->correos_demandante),
            'demandado' => $this->demandado->toArray(),
            'correos_demandado' => array_map(fn($c) => $c->toArray(), $this->correos_demandado),
            'pretensiones' => array_map(fn($p) => $p->toArray(), $this->pretensiones),
            'designacion' => $this->designacion->toArray(),
            'arbitros' => array_map(fn($a) => $a->toArray(), $this->arbitros),
        ];

        if ($this->representante_demandante) {
            $data['representante_demandante'] = $this->representante_demandante->toArray();
        }

        if ($this->representante_demandado) {
            $data['representante_demandado'] = $this->representante_demandado->toArray();
        }

        if ($this->demandado_extra) {
            $data['demandado_extra'] = $this->demandado_extra->toArray();
        }

        return $data;
    }
}