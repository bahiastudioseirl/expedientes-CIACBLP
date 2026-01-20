<?php

namespace App\Services;

use App\DTOs\Mensajes\CrearMensajeDTO;
use App\Models\Asunto;
use App\Repositories\MensajeRepository;
use App\Repositories\AdjuntoRepository;
use App\Repositories\UsuarioMensajeRepository;
use App\Models\Mensajes;
use App\Repositories\AsuntoRepository;
use App\Repositories\UsuarioRepository;
use App\Repositories\ExpedienteRepository;
use App\Mail\NotificacionNuevoMensaje;
use Illuminate\Http\UploadedFile;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MensajeService
{
    public function __construct(
        private readonly MensajeRepository $mensajeRepository,
        private readonly AdjuntoRepository $adjuntoRepository,
        private readonly UsuarioMensajeRepository $usuarioMensajeRepository,
        private readonly AsuntoRepository $asuntoRepository,
        private readonly UsuarioRepository $usuarioRepository,
        private readonly ExpedienteRepository $expedienteRepository
    ) {}

    public function crearMensaje(CrearMensajeDTO $datos, array $usuariosDestinatarios, ?array $adjuntos = null): Mensajes
    {
        $asuntoActivo = $this->asuntoRepository->saberEstadoPorId($datos->id_asunto);
        if (!$asuntoActivo) {
            throw new Exception('No se puede enviar el mensaje porque el asunto está cerrado o no existe.');
        }

        $mensajeData = [
            'contenido' => $datos->contenido,
            'fecha_envio' => Carbon::now('America/Lima')->format('Y-m-d H:i:s'),
            'id_usuario' => $datos->id_usuario,
            'id_asunto' => $datos->id_asunto
        ];

        $mensaje = $this->mensajeRepository->crear($mensajeData);
        $this->crearRelacionesUsuarios($mensaje->id_mensaje, $usuariosDestinatarios);

        $rutasAdjuntos = [];
        if ($adjuntos && count($adjuntos) > 0) {
            $rutasAdjuntos = $this->procesarAdjuntos($mensaje->id_mensaje, $adjuntos, $datos->id_asunto);
        }

        // Enviar notificaciones por email
        $this->enviarNotificacionesEmail($mensaje, $usuariosDestinatarios, $datos->id_usuario, $rutasAdjuntos);

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

    public function marcarMensajeComoLeido(int $idMensaje, int $idUsuario): bool
    {
        return $this->mensajeRepository->marcarComoLeido($idMensaje, $idUsuario);
    }

    public function responderMensaje(int $idMensajePadre, CrearMensajeDTO $datos, array $usuariosDestinatarios, ?array $adjuntos = null): Mensajes
    {
        // Obtener el mensaje padre para validar y obtener el asunto
        $mensajePadre = $this->mensajeRepository->obtenerPorId($idMensajePadre);
        if (!$mensajePadre) {
            throw new Exception('El mensaje al que intenta responder no existe.');
        }

        $asuntoActivo = $this->asuntoRepository->saberEstadoPorId($mensajePadre->id_asunto);
        if (!$asuntoActivo) {
            throw new Exception('No se puede responder porque el asunto está cerrado.');
        }

        $respuestaData = [
            'contenido' => $datos->contenido,
            'fecha_envio' => Carbon::now('America/Lima')->format('Y-m-d H:i:s'),
            'id_usuario' => $datos->id_usuario,
            'id_asunto' => $mensajePadre->id_asunto, // Heredar el asunto del mensaje padre
            'mensaje_padre_id' => $idMensajePadre
        ];

        $respuesta = $this->mensajeRepository->crear($respuestaData);
        $this->crearRelacionesUsuarios($respuesta->id_mensaje, $usuariosDestinatarios);

        $rutasAdjuntos = [];
        if ($adjuntos && count($adjuntos) > 0) {
            $rutasAdjuntos = $this->procesarAdjuntos($respuesta->id_mensaje, $adjuntos, $mensajePadre->id_asunto);
        }

        // Enviar notificaciones por email para la respuesta
        $this->enviarNotificacionesEmail($respuesta, $usuariosDestinatarios, $datos->id_usuario, $rutasAdjuntos);

        return $this->mensajeRepository->obtenerPorId($respuesta->id_mensaje);
    }

    public function obtenerHiloCompleto(int $idMensaje): Collection
    {
        $mensaje = $this->mensajeRepository->obtenerPorId($idMensaje);
        if (!$mensaje) {
            throw new Exception('El mensaje no existe.');
        }

        // Si es una respuesta, obtener el mensaje principal
        $idMensajePrincipal = $mensaje->esMensajePrincipal() ? $idMensaje : $mensaje->mensaje_padre_id;

        return $this->mensajeRepository->obtenerHiloCompleto($idMensajePrincipal);
    }

    private function crearRelacionesUsuarios(int $idMensaje, array $usuariosDestinatarios): void
    {
        // Obtener todos los administradores para asegurar que siempre reciban los mensajes
        $administradores = $this->usuarioRepository->obtenerAdministradores();
        $idsAdministradores = $administradores->pluck('id_usuario')->toArray();

        // Combinar destinatarios seleccionados con administradores (eliminar duplicados)
        $todosDestinatarios = array_unique(array_merge($usuariosDestinatarios, $idsAdministradores));

        $relacionesData = [];

        foreach ($todosDestinatarios as $idUsuario) {
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

    private function procesarAdjuntos(int $idMensaje, array $adjuntos, int $idAsunto): array
    {
        $asunto = Asunto::with('expediente')->find($idAsunto);
        $codigoExpediente = $asunto->expediente->codigo_expediente ?? 'sin-codigo';

        $archivosGuardados = [];

        foreach ($adjuntos as $archivo) {
            if ($archivo instanceof UploadedFile) {
                $rutaArchivo = $this->guardarArchivo($archivo, $codigoExpediente);

                $this->adjuntoRepository->crear([
                    'id_mensaje' => $idMensaje,
                    'nombre_archivo' => $archivo->getClientOriginalName(),
                    'ruta_archivo' => $rutaArchivo
                ]);

                // Guardar información del archivo para adjuntar en correos
                $archivosGuardados[] = [
                    'nombre' => $archivo->getClientOriginalName(),
                    'ruta' => public_path($rutaArchivo)
                ];
            }
        }

        return $archivosGuardados;
    }

    private function guardarArchivo(UploadedFile $archivo, string $codigoExpediente): string
    {
        $nombreOriginal = pathinfo($archivo->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $archivo->getClientOriginalExtension();
        $timestamp = now()->format('Ymd');
        $baseNombre = $nombreOriginal . '_' . $timestamp;
        $nombreUnico = $baseNombre . '.' . $extension;

        $directorio = public_path($codigoExpediente);
        if (!file_exists($directorio)) {
            mkdir($directorio, 0777, true);
        }

        $contador = 1;
        while (file_exists($directorio . DIRECTORY_SEPARATOR . $nombreUnico)) {
            $nombreUnico = $baseNombre . '(' . $contador . ').' . $extension;
            $contador++;
        }

        $archivo->move($directorio, $nombreUnico);

        return $codigoExpediente . '/' . $nombreUnico;
    }

    private function enviarNotificacionesEmail(Mensajes $mensaje, array $usuariosDestinatarios, int $idRemitente, array $rutasAdjuntos = []): void
    {
        try {
            // Obtener datos del asunto y expediente
            $asunto = $this->asuntoRepository->obtenerPorId($mensaje->id_asunto);
            if (!$asunto) return;

            $expediente = $this->expedienteRepository->obtenerPorId($asunto->id_expediente);
            if (!$expediente) return;

            // Obtener remitente
            $remitente = $this->usuarioRepository->obtenerPorId($idRemitente);
            if (!$remitente) return;

            $nombreRemitente = !empty($remitente->nombre_completo) ? $remitente->nombre_completo : $remitente->correo;

            // Crear lista de destinatarios únicos, incluyendo al remitente y al administrador
            $todosDestinatarios = array_unique(array_merge(
                $usuariosDestinatarios,
                [$idRemitente],
                $this->obtenerAdministradores()
            ));

            // Enviar notificación a cada destinatario
            foreach ($todosDestinatarios as $idDestinatario) {
                $destinatario = $this->usuarioRepository->obtenerPorId($idDestinatario);
                if (!$destinatario || empty($destinatario->correo)) continue;

                $nombreDestinatario = !empty($destinatario->nombre_completo) ? $destinatario->nombre_completo : 'Participante';

                Mail::to($destinatario->correo)->send(new NotificacionNuevoMensaje(
                    nombreRemitente: $nombreRemitente,
                    contenidoMensaje: $mensaje->contenido,
                    codigoExpediente: $expediente->codigo_expediente,
                    asuntoTitulo: $asunto->titulo,
                    rutasAdjuntos: $rutasAdjuntos,
                    nombreDestinatario: $nombreDestinatario
                ));
            }
        } catch (Exception $e) {
            // Log error pero no fallar el envío del mensaje
            Log::error('Error al enviar notificaciones de email: ' . $e->getMessage());
        }
    }

    private function obtenerAdministradores(): array
    {
        // Obtener todos los usuarios con rol de administrador
        $administradores = $this->usuarioRepository->obtenerAdministradores();
        return $administradores->pluck('id_usuario')->toArray();
    }

    public function obtenerAdjuntosPorExpediente(int $idExpediente): Collection
    {
        return $this->adjuntoRepository->obtenerAdjuntosPorExpediente($idExpediente);
    }
}
