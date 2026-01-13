<?php

namespace App\Services\Expediente;

use Carbon\Carbon;

class CalculadorDiasHabilesService
{
    private const FERIADOS_FIJOS = [
        '01-01', // Año Nuevo
        '05-01', // Día del Trabajo
        '06-29', // San Pedro y San Pablo
        '07-28', // Fiestas Patrias
        '07-29', // Fiestas Patrias
        '08-30', // Santa Rosa de Lima
        '10-08', // Combate de Angamos
        '11-01', // Todos los Santos
        '12-08', // Inmaculada Concepción
        '12-25', // Navidad
    ];

    public function calcularFechaLimite(Carbon $fechaInicio, int $diasHabiles): Carbon
    {
        $fecha = $fechaInicio->copy();
        $diasContados = 0;

        while ($diasContados < $diasHabiles) {
            $fecha->addDay();
            
            if ($this->esDiaHabil($fecha)) {
                $diasContados++;
            }
        }

        return $fecha;
    }

    public function esDiaHabil(Carbon $fecha): bool
    {
        // Verificar si es sábado o domingo
        if ($fecha->isWeekend()) {
            return false;
        }

        // Verificar si es feriado
        if ($this->esFeriado($fecha)) {
            return false;
        }

        return true;
    }
    private function esFeriado(Carbon $fecha): bool
    {
        $diaMes = $fecha->format('m-d');
        
        if (in_array($diaMes, self::FERIADOS_FIJOS)) {
            return true;
        }

        if ($this->esSemanaSanta($fecha)) {
            return true;
        }

        return false;
    }

    private function esSemanaSanta($fecha): bool
    {
        $anio = $fecha->year;
        $pascua = $this->calcularDomingoPascua($anio);
        
        $juevesSanto = $pascua->copy()->subDays(3);
        $viernesSanto = $pascua->copy()->subDays(2);
        
        return $fecha->isSameDay($juevesSanto) || $fecha->isSameDay($viernesSanto);
    }

    /**
     * Calcular el Domingo de Pascua (algoritmo de Meeus)
     */
    private function calcularDomingoPascua(int $anio): Carbon
    {
        $a = $anio % 19;
        $b = intdiv($anio, 100);
        $c = $anio % 100;
        $d = intdiv($b, 4);
        $e = $b % 4;
        $f = intdiv($b + 8, 25);
        $g = intdiv($b - $f + 1, 3);
        $h = (19 * $a + $b - $d - $g + 15) % 30;
        $i = intdiv($c, 4);
        $k = $c % 4;
        $l = (32 + 2 * $e + 2 * $i - $h - $k) % 7;
        $m = intdiv($a + 11 * $h + 22 * $l, 451);
        $mes = intdiv($h + $l - 7 * $m + 114, 31);
        $dia = (($h + $l - 7 * $m + 114) % 31) + 1;

        return Carbon::create($anio, $mes, $dia);
    }
}