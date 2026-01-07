<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandlePostTooLarge
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el contenido excede el límite
        $contentLength = $request->server('CONTENT_LENGTH');
        $postMaxSize = $this->convertToBytes(ini_get('post_max_size'));
        
        if ($contentLength && $contentLength > $postMaxSize) {
            $maxSizeFormatted = $this->getHumanReadableFileSize(ini_get('post_max_size'));
            
            return response()->json([
                'success' => false,
                'message' => "El archivo que intentas subir es muy pesado. Tamaño máximo permitido: {$maxSizeFormatted}. Por favor, selecciona un archivo más pequeño o comprime el archivo antes de subirlo."
            ], 413);
        }

        return $next($request);
    }
    
    /**
     * Convierte string con unidad a bytes
     */
    private function convertToBytes(string $size): int
    {
        $size = trim($size);
        $unit = strtolower(substr($size, -1));
        $value = (int) substr($size, 0, -1);
        
        return match ($unit) {
            'g' => $value * 1073741824,
            'm' => $value * 1048576,
            'k' => $value * 1024,
            default => (int) $size
        };
    }
    
    /**
     * Convierte bytes a formato legible
     */
    private function getHumanReadableFileSize(string $size): string
    {
        $bytes = $this->convertToBytes($size);
        
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        
        return $bytes . ' bytes';
    }
}
