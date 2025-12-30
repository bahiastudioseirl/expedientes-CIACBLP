<?php

namespace App\Services;

use App\Models\Flujo;
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

    public function cerrarOAbrirAsunto(int $idAsunto): array
    {
        $asunto = $this->asuntoRepository->obtenerPorId($idAsunto);
        if (!$asunto) {
            throw new \Exception("Asunto no encontrado");
        }

        $cerrar = $asunto->activo;

        if ($cerrar && !$this->asuntoRepository->flujoCompletado($asunto)) {
            throw new \Exception("No se puede cerrar el asunto porque el flujo no está completado");
        }

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
}