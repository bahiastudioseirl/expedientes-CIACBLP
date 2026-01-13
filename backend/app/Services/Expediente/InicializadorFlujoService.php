<?php

namespace App\Services\Expediente;

use App\Models\Expediente;
use App\Models\Flujo;
use App\Repositories\EtapaRepository;
use App\Repositories\SubEtapaRepository;
use App\Repositories\FlujoRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InicializadorFlujoService
{
    public function __construct(
        private readonly CalculadorDiasHabilesService $calculadorDiasHabiles,
        private readonly EtapaRepository $etapaRepository,
        private readonly SubEtapaRepository $subEtapaRepository,
        private readonly FlujoRepository $flujoRepository
    ) {}

    public function inicializarFlujo(Expediente $expediente, Carbon $fechaInicioSolicitud): Flujo
    {
        return DB::transaction(function () use ($expediente, $fechaInicioSolicitud) {
            $etapas = $this->etapaRepository->obtenerEtapasPorPlantilla($expediente->id_plantilla);
            
            if ($etapas->isEmpty()) {
                throw new \Exception("No se encontraron etapas para la plantilla {$expediente->id_plantilla}");
            }
            
            $primeraEtapa = $etapas->first();
            
            if ($primeraEtapa->subEtapas->isEmpty()) {
                throw new \Exception("No se encontraron sub-etapas para la etapa {$primeraEtapa->id_etapa}");
            }
            
            $primeraSubEtapa = $primeraEtapa->subEtapas->first();

            $fechaLimite = $this->calculadorDiasHabiles->calcularFechaLimite(
                fechaInicio: $fechaInicioSolicitud,
                diasHabiles: $primeraSubEtapa->dias_habiles
            );

            $estado = $this->determinarEstado($fechaInicioSolicitud, $fechaLimite);

            return $this->flujoRepository->crear([
                'id_expediente' => $expediente->id_expediente,
                'id_etapa' => $primeraEtapa->id_etapa,
                'id_subetapa' => $primeraSubEtapa->id_sub_etapa,
                'fecha_inicio' => $fechaInicioSolicitud,
                'fecha_limite' => $fechaLimite,
                'estado' => $estado,
            ]);
        });
    }

    /**
     * Determina el estado del flujo basado en las fechas
     */
    private function determinarEstado(Carbon $fechaInicio, Carbon $fechaLimite): string
    {
        $ahora = Carbon::now();

        if ($fechaInicio->isFuture()) {
            return 'pendiente';
        }

        if ($ahora->isAfter($fechaLimite)) {
            return 'vencido';
        }

        return 'en_proceso';
    }
}