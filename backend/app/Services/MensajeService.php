<?php

namespace App\Services;

use App\DTOs\Mensajes\CrearMensajeDTO;
use App\Repositories\MensajeRepository;
use App\Repositories\AdjuntoRepository;
use App\Repositories\UsuarioMensajeRepository;
use App\Models\Mensajes;
use Illuminate\Http\UploadedFile;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class MensajeService
{
    public function __construct(
        private readonly MensajeRepository $mensajeRepository,
        private readonly AdjuntoRepository $adjuntoRepository,
        private readonly UsuarioMensajeRepository $usuarioMensajeRepository
    ) {}

    public function crearMensaje(CrearMensajeDTO $datos, array $usuariosDestinatarios, ?array $adjuntos = null): Mensajes
    {
        $mensajeData = [
            'contenido' => $datos->contenido,
            'fecha_envio' => Carbon::now('America/Lima')->format('Y-m-d H:i:s'),
            'id_usuario' => $datos->id_usuario,
            'id_asunto' => $datos->id_asunto
        ];

        $mensaje = $this->mensajeRepository->crear($mensajeData);
        $this->crearRelacionesUsuarios($mensaje->id_mensaje, $usuariosDestinatarios);

        if ($adjuntos && count($adjuntos) > 0) {
            $this->procesarAdjuntos($mensaje->id_mensaje, $adjuntos, $datos->id_asunto);
        }

        return $this->mensajeRepository->obtenerPorId($mensaje->id_mensaje);
    }

    public function obtenerMensajesPorAsunto(int $idAsunto): Collection
    {
        return $this->mensajeRepository->obtenerPorAsunto($idAsunto);
    }

    public function obtenerMensajesPorAsuntoYUsuario(int $idAsunto, int $idUsuario): Collection
    {
        return $this->mensajeRepository->obtenerPorAsuntoYUsuario($idAsunto, $idUsuario);
    }

    private function crearRelacionesUsuarios(int $idMensaje, array $usuariosDestinatarios): void
    {
        $relacionesData = [];
        
        foreach ($usuariosDestinatarios as $idUsuario) {
            $relacionesData[] = [
                'id_mensaje' => $idMensaje,
                'id_usuario' => $idUsuario,
                'leido' => false,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        $this->usuarioMensajeRepository->crearMultiples($relacionesData);
    }

    private function procesarAdjuntos(int $idMensaje, array $adjuntos, int $idAsunto): void
    {
        // Obtener código de expediente desde el asunto
        $asunto = \App\Models\Asunto::with('expediente')->find($idAsunto);
        $codigoExpediente = $asunto->expediente->codigo_expediente ?? 'sin-codigo';

        foreach ($adjuntos as $archivo) {
            if ($archivo instanceof UploadedFile) {
                $rutaArchivo = $this->guardarArchivo($archivo, $codigoExpediente);
                
                $this->adjuntoRepository->crear([
                    'id_mensaje' => $idMensaje,
                    'ruta_archivo' => $rutaArchivo
                ]);
            }
        }
    }

    private function guardarArchivo(UploadedFile $archivo, string $codigoExpediente): string
    {
        $extension = $archivo->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');
        $nombreUnico = $timestamp . '_' . uniqid() . '.' . $extension;

        // Guardar en public/codigo_expediente/
        $directorio = public_path($codigoExpediente);
        if (!file_exists($directorio)) {
            mkdir($directorio, 0777, true);
        }
        $archivo->move($directorio, $nombreUnico);

        // Devolver la ruta relativa desde public
        return $codigoExpediente . '/' . $nombreUnico;
    }
}