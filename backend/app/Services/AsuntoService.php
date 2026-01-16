<?php

namespace App\Services;

use App\DTOs\Asuntos\ActualizarAsuntoDTO;
use App\DTOs\Asuntos\CrearAsuntoDTO;
use App\Models\Asunto;
use App\Models\Flujo;
use App\Repositories\AsuntoRepository;
use App\Repositories\FlujoRepository;
use App\Repositories\ExpedienteRepository;
use Exception;

class AsuntoService
{
    public function __construct(
        private readonly AsuntoRepository $asuntoRepository,
        private readonly FlujoRepository $flujoRepository,
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly SolicitudService $solicitudService,
    ) {}


    public function crearAsunto(CrearAsuntoDTO $crearAsuntoDTO)
    {
        // 1. Obtener el flujo actual
        $flujo = $this->flujoRepository->obtenerFlujoActual($crearAsuntoDTO->id_expediente);
        if (!$flujo) {
            throw new Exception("Flujo no encontrado");
        }

        // 2. Obtener el expediente para sacar el código y la solicitud
        $expediente = $this->expedienteRepository->obtenerPorId($crearAsuntoDTO->id_expediente);
        if (!$expediente) {
            throw new Exception("Expediente no encontrado");
        }

        // 3. Obtener datos de las partes
        $datosPartes = $this->solicitudService->obtenerDatosPartes($expediente->id_solicitud);

        $nombreDemandante = $datosPartes['demandante']->nombre_razon ?? 'Demandante';
        $nombreDemandado = $datosPartes['demandado']->nombre_razon ?? 'Demandado';

        // 4. Construir el título parseado
        $tituloParsed = $nombreDemandante . ' - ' . $nombreDemandado .
            ' // Caso arbitral ' . $expediente->codigo_expediente .
            ' | ' . $crearAsuntoDTO->titulo;

        // 5. Crear el asunto
        return $this->asuntoRepository->crear([
            'titulo' => $tituloParsed,
            'id_flujo' => $flujo->id_flujo,
            'id_expediente' => $crearAsuntoDTO->id_expediente,
            'activo' => true
        ]);
    }


    public function verAsuntosPorExpediente(int $idExpediente)
    {
        return $this->asuntoRepository->verAsuntosPorExpediente($idExpediente);
    }

    public function cerrarOAbrirAsunto(int $idAsunto): array
    {
        $asunto = $this->asuntoRepository->obtenerPorId($idAsunto);
        if (!$asunto) {
            throw new Exception("Asunto no encontrado");
        }

        $cerrar = $asunto->activo;

        $resultado = $this->asuntoRepository->cerrarOAbrirAsunto($asunto, $cerrar);
        $mensaje = '';
        if ($cerrar && $resultado) {
            $mensaje = 'El asunto se cerró correctamente';
        } elseif (!$cerrar && $resultado) {
            $mensaje = 'El asunto se abrió correctamente';
        } else {
            $mensaje = 'No se pudo actualizar el estado del asunto';
        }

        return [
            'success' => $resultado,
            'message' => $mensaje,
            'data' => $resultado ? $this->asuntoRepository->obtenerPorId($idAsunto) : null
        ];
    }

    public function actualizarAsunto(int $idAsunto, ActualizarAsuntoDTO $data): Asunto
    {
        $expediente = $this->expedienteRepository->obtenerPorId($data->id_expediente);
        if (!$expediente) {
            throw new Exception("Expediente no encontrado");
        }

        $datosPartes = $this->solicitudService->obtenerDatosPartes($expediente->id_solicitud);

        $nombreDemandante = $datosPartes['demandante']->nombre_razon ?? 'Demandante';
        $nombreDemandado = $datosPartes['demandado']->nombre_razon ?? 'Demandado';

        $tituloParsed = $nombreDemandante . ' - ' . $nombreDemandado .
            ' // Caso arbitral ' . $expediente->codigo_expediente .
            ' | ' . $data->titulo;
        
        return $this->asuntoRepository->actualizar($idAsunto, [
            'titulo' => $tituloParsed,
        ]);
    }
}
