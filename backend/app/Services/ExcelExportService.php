<?php

namespace App\Services;

use Shuchkin\SimpleXLSXGen;

class ExcelExportService
{
    public function generarExcelDirecto(array $caminoData): string
    {
        $expediente = $caminoData['expediente'];
        $flujos = $caminoData['flujos'];
        $mensajesAgrupados = $caminoData['mensajes_agrupados'];

        // Generar datos para Excel con estilos
        $excelData = $this->generarDatosCaminoConEstilos($expediente, $flujos, $mensajesAgrupados);
        
        // Nombre del archivo
        $nombreArchivo = 'Camino_Expediente_' . $expediente->codigo_expediente . '_' . date('Y-m-d') . '.xlsx';
        
        // Crear archivo temporal
        $tempFile = tempnam(sys_get_temp_dir(), 'excel_') . '.xlsx';
        
        // Generar Excel con estilos
        $xlsx = SimpleXLSXGen::fromArray($excelData);
        $xlsx->saveAs($tempFile);
        
        return $tempFile;
    }

    private function generarDatosCamino($expediente, $flujos, $mensajesAgrupados): array
    {
        $data = [
            // Título principal
            ['CAMINO DEL EXPEDIENTE - Caso Arbitral N° ' . ($expediente->codigo_expediente ?? 'N/A')],
            [''],
            
            // Información básica del expediente
            ['Información General'],
            ['Código Expediente:', $expediente->codigo_expediente ?? 'N/A', '', 'Estado:', $expediente->activo ? 'Activo' : 'Inactivo'],
            ['Fecha Creación:', $expediente->created_at ? date('d/m/Y H:i', strtotime($expediente->created_at)) : 'N/A'],
            [''],
            
            // Headers del timeline
            ['TIMELINE DEL EXPEDIENTE'],
            ['ETAPA', 'SUB-ETAPA', 'ESTADO PLAZO', 'FECHA INICIO', 'FECHA LÍMITE', 'FECHA FIN', 'TOTAL MENSAJES'],
            ['', '', '', '', '', '', '']
        ];

        // Agrupar flujos por etapa para evitar repetición
        if ($flujos && count($flujos) > 0) {
            $flujosPorEtapa = collect($flujos)->groupBy(function($flujo) {
                return $flujo->etapa->nombre ?? 'Sin etapa';
            });

            foreach ($flujosPorEtapa as $nombreEtapa => $flujosDeEtapa) {
                // Agregar título de etapa solo una vez
                $data[] = ['ETAPA: ' . $nombreEtapa, '', '', '', '', '', ''];
                $data[] = ['', '', '', '', '', '', '']; // Separador
                
                // Agregar todas las subetapas de esta etapa
                foreach ($flujosDeEtapa as $flujo) {
                    $mensajesDelFlujo = $mensajesAgrupados->get($flujo->id_flujo, collect([]));
                    
                    // Calcular estado del plazo usando las fechas
                    $estadoPlazo = $this->calcularEstadoPlazo($flujo->fecha_inicio, $flujo->fecha_limite, $flujo->fecha_fin);
                    
                    $data[] = [
                        '',  // Columna etapa vacía porque ya está arriba
                        $flujo->subetapa->nombre ?? 'Sin sub-etapa',
                        $estadoPlazo,  // Usar el estado calculado en lugar del de BD
                        $flujo->fecha_inicio ? date('d/m/Y', strtotime($flujo->fecha_inicio)) : 'Sin fecha',
                        $flujo->fecha_limite ? date('d/m/Y', strtotime($flujo->fecha_limite)) : 'Sin límite',
                        $flujo->fecha_fin ? date('d/m/Y', strtotime($flujo->fecha_fin)) : 'En proceso',
                        $mensajesDelFlujo->count() . ' mensaje(s)'
                    ];
                    
                    // Agregar detalles de mensajes si existen
                    if ($mensajesDelFlujo->count() > 0) {
                        $data[] = ['', '  → MENSAJES:', '', '', '', '', ''];
                        
                        foreach ($mensajesDelFlujo as $mensaje) {
                            $adjuntos = $mensaje->adjuntos && count($mensaje->adjuntos) > 0 
                                ? collect($mensaje->adjuntos)->pluck('nombre_archivo')->implode(', ')
                                : 'Sin adjuntos';
                                
                            $data[] = [
                                '',
                                '    • ' . ($mensaje->usuario->nombre_completo ?? 'Usuario desconocido'),
                                $mensaje->usuario->nombre_rol ?? 'Sin rol',
                                date('d/m/Y', strtotime($mensaje->fecha_envio)),
                                $this->limitarTexto($mensaje->contenido ?? '', 60),
                                $adjuntos,
                                ''
                            ];
                        }
                        $data[] = ['', '', '', '', '', '', '']; // Separador entre subetapas
                    }
                }
                
                // Separador entre etapas
                $data[] = ['', '', '', '', '', '', ''];
            }
        } else {
            $data[] = ['No hay flujos registrados para este expediente'];
        }
        
        // Footer
        $data[] = [''];
        $data[] = ['Generado el: ' . date('d/m/Y H:i:s')];
        $data[] = ['Sistema de Gestión de Expedientes - CIACBLP'];

        return $data;
    }

    private function generarDatosCaminoConEstilos($expediente, $flujos, $mensajesAgrupados): array
    {
        $data = [
            // Título principal con estilo
            [
                '<style bgcolor="#4F46E5" color="#FFFFFF" font-size="16" font-weight="bold">CAMINO DEL EXPEDIENTE - Caso Arbitral N° ' . ($expediente->codigo_expediente ?? 'N/A') . '</style>'
            ],
            [''],
            
            // Información básica con estilos
            ['<style bgcolor="#E5E7EB" font-weight="bold">Información General</style>'],
            [
                '<style font-weight="bold">Código Expediente:</style>', 
                $expediente->codigo_expediente ?? 'N/A', 
                '', 
                '<style font-weight="bold">Estado:</style>', 
                $expediente->activo ? 'Activo' : 'Inactivo'
            ],
            [
                '<style font-weight="bold">Fecha Creación:</style>', 
                $expediente->created_at ? date('d/m/Y', strtotime($expediente->created_at)) : 'N/A'
            ],
            [''],
            
            // Headers del timeline con estilo
            ['<style bgcolor="#6366F1" color="#FFFFFF" font-weight="bold" font-size="14">TIMELINE DEL EXPEDIENTE</style>'],
            [
                '<style bgcolor="#9CA3AF" color="#FFFFFF" font-weight="bold">ETAPA</style>',
                '<style bgcolor="#9CA3AF" color="#FFFFFF" font-weight="bold">SUB-ETAPA</style>',
                '<style bgcolor="#9CA3AF" color="#FFFFFF" font-weight="bold">ESTADO PLAZO</style>',
                '<style bgcolor="#9CA3AF" color="#FFFFFF" font-weight="bold">FECHA INICIO</style>',
                '<style bgcolor="#9CA3AF" color="#FFFFFF" font-weight="bold">FECHA LÍMITE</style>',
                '<style bgcolor="#9CA3AF" color="#FFFFFF" font-weight="bold">FECHA FIN</style>',
                '<style bgcolor="#9CA3AF" color="#FFFFFF" font-weight="bold">TOTAL MENSAJES</style>'
            ],
            ['']
        ];

        // Agrupar flujos por etapa para evitar repetición
        if ($flujos && count($flujos) > 0) {
            $flujosPorEtapa = collect($flujos)->groupBy(function($flujo) {
                return $flujo->etapa->nombre ?? 'Sin etapa';
            });

            foreach ($flujosPorEtapa as $nombreEtapa => $flujosDeEtapa) {
                // Agregar título de etapa con estilo morado
                $data[] = [
                    '<style bgcolor="#8B5CF6" color="#FFFFFF" font-weight="bold">ETAPA: ' . $nombreEtapa . '</style>',
                    '', '', '', '', '', ''
                ];
                $data[] = ['', '', '', '', '', '', '']; // Separador
                
                // Agregar todas las subetapas de esta etapa
                foreach ($flujosDeEtapa as $flujo) {
                    $mensajesDelFlujo = $mensajesAgrupados->get($flujo->id_flujo, collect([]));
                    
                    // Calcular estado del plazo usando las fechas
                    $estadoPlazo = $this->calcularEstadoPlazo($flujo->fecha_inicio, $flujo->fecha_limite, $flujo->fecha_fin);
                    
                    // Obtener color según estado
                    $colorEstado = $this->getColorEstado($estadoPlazo);
                    
                    $data[] = [
                        '',  // Columna etapa vacía
                        '<style bgcolor="#F3F4F6">' . ($flujo->subetapa->nombre ?? 'Sin sub-etapa') . '</style>',
                        '<style bgcolor="' . $colorEstado . '" color="#FFFFFF" font-weight="bold">' . $estadoPlazo . '</style>',
                        $flujo->fecha_inicio ? date('d/m/Y', strtotime($flujo->fecha_inicio)) : 'Sin fecha',
                        $flujo->fecha_limite ? date('d/m/Y', strtotime($flujo->fecha_limite)) : 'Sin límite',
                        $flujo->fecha_fin ? date('d/m/Y', strtotime($flujo->fecha_fin)) : 'En proceso',
                        $mensajesDelFlujo->count() . ' mensaje(s)'
                    ];
                    
                    // Agregar detalles de mensajes si existen
                    if ($mensajesDelFlujo->count() > 0) {
                        $data[] = ['', '<style bgcolor="#EFF6FF" font-style="italic">→ MENSAJES:</style>', '', '', '', '', ''];
                        
                        foreach ($mensajesDelFlujo as $mensaje) {
                            $adjuntos = $mensaje->adjuntos && count($mensaje->adjuntos) > 0 
                                ? collect($mensaje->adjuntos)->pluck('nombre_archivo')->implode(', ')
                                : 'Sin adjuntos';
                                
                            $data[] = [
                                '',
                                '<style bgcolor="#F9FAFB">• ' . ($mensaje->usuario->nombre_completo ?? 'Usuario desconocido') . '</style>',
                                $mensaje->usuario->nombre_rol ?? 'Sin rol',
                                date('d/m/Y', strtotime($mensaje->fecha_envio)),
                                $this->limitarTexto($mensaje->contenido ?? '', 60),
                                $adjuntos,
                                ''
                            ];
                        }
                        $data[] = ['', '', '', '', '', '', '']; // Separador entre subetapas
                    }
                }
                
                // Separador entre etapas
                $data[] = ['', '', '', '', '', '', ''];
            }
        } else {
            $data[] = ['No hay flujos registrados para este expediente'];
        }
        
        // Footer con estilo
        $data[] = [''];
        $data[] = ['<style font-style="italic">Generado el: ' . date('d/m/Y H:i:s') . '</style>'];
        $data[] = ['<style font-weight="bold" color="#4F46E5">Sistema de Gestión de Expedientes - CIACBLP</style>'];

        return $data;
    }

    // Función para obtener color según estado
    private function getColorEstado($estado): string
    {
        switch (strtolower($estado)) {
            case 'a tiempo': return '#10B981'; // Verde
            case 'por vencer': return '#F59E0B'; // Amarillo
            case 'vencido': return '#EF4444'; // Rojo
            default: return '#6B7280'; // Gris
        }
    }

    private function limitarTexto(string $texto, int $limite): string
    {
        if (strlen($texto) <= $limite) {
            return $texto;
        }
        return substr($texto, 0, $limite) . '...';
    }

    // Función para calcular el estado del plazo basado en fechas (igual que en frontend)
    private function calcularEstadoPlazo($fechaInicio, $fechaLimite, $fechaFin): string
    {
        if (!$fechaInicio || !$fechaLimite) {
            return 'Sin datos';
        }
        
        $ahora = new \DateTime();
        $inicio = new \DateTime($fechaInicio);
        $limite = new \DateTime($fechaLimite);
        $fin = $fechaFin ? new \DateTime($fechaFin) : null;
        
        // Si ya se completó la subetapa (tiene fecha_fin)
        if ($fin) {
            // Si la fecha de fin es mayor que el límite → Vencido
            if ($fin > $limite) {
                return 'Vencido';
            }
            // Si completó dentro del plazo → A tiempo
            return 'A tiempo';
        }
        
        // Si no se ha completado (fecha_fin es null)
        // Si la fecha actual ya pasó el límite → Vencido
        if ($ahora > $limite) {
            return 'Vencido';
        }
        
        // Calcular si está "Por vencer" (dentro de los últimos 3 días antes del límite)
        $diasParaVencer = $ahora->diff($limite)->days;
        $esAntes = $ahora < $limite;
        
        // Si faltan 3 días o menos → Por vencer
        if ($esAntes && $diasParaVencer <= 3) {
            return 'Por vencer';
        }
        
        // Si está dentro del rango normal → A tiempo
        if ($ahora >= $inicio && $ahora <= $limite) {
            return 'A tiempo';
        }
        
        // Por defecto
        return 'A tiempo';
    }

    public function obtenerNombreArchivo($expediente): string
    {
        return 'Camino_Expediente_' . $expediente->codigo_expediente . '_' . date('Y-m-d') . '.xlsx';
    }
}