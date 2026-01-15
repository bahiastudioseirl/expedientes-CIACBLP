<?php

namespace App\Services;

use App\Repositories\MensajeRepository;
use App\Repositories\UsuarioMensajeRepository;
use App\Repositories\UsuarioRepository;
use App\Mail\NotificacionMensaje;
use Illuminate\Support\Facades\Mail;

class NotificacionMensajeService
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository,
        private readonly UsuarioMensajeRepository $usuarioMensajeRepository
    ) {}

    /**
     * Enviar notificaciones por correo de un mensaje
     */
    public function enviarNotificacionesMensaje(int $idMensaje, array $usuariosDestinatarios): void
    {
        foreach ($usuariosDestinatarios as $idUsuario) {
            $usuario = $this->usuarioRepository->obtenerPorId($idUsuario);
            
            if ($usuario && $usuario->correo) {
                Mail::to($usuario->correo)->send(
                    new NotificacionMensaje($idMensaje, $usuario)
                );
            }
        }
    }
}