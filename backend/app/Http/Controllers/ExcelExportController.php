<?php

namespace App\Http\Controllers;

use App\Services\ExcelExportService;
use App\Services\FlujoService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ExcelExportController extends Controller
{
    private $flujoService;
    private $excelExportService;

    public function __construct(FlujoService $flujoService, ExcelExportService $excelExportService)
    {
        $this->flujoService = $flujoService;
        $this->excelExportService = $excelExportService;
    }

    public function exportarCaminoExpediente(Request $request, int $idExpediente)
    {
        try {
            // Obtener datos usando la misma lógica que la API que funciona
            $caminoData = $this->flujoService->obtenerCaminoExpediente($idExpediente);
            
            // Generar el Excel y obtener la ruta del archivo
            $rutaArchivo = $this->excelExportService->generarExcelDirecto($caminoData);
            
            // Obtener el nombre del archivo
            $nombreArchivo = 'Camino_Expediente_' . $caminoData['expediente']->codigo_expediente . '_' . date('Y-m-d') . '.xlsx';
            
            // Retornar el archivo para descarga
            return response()->download($rutaArchivo, $nombreArchivo)->deleteFileAfterSend(true);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el Excel: ' . $e->getMessage()
            ], 500);
        }
    }
}
