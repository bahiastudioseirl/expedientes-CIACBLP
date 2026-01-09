<?php

namespace App\Services;

use App\DTOs\Solicitudes\CrearSolicitudDTO;
use App\Repositories\Solicitud\SolicitudRepository;
use App\Services\Solicitud\SolicitudParteService;
use App\Services\Solicitud\SolicitudPretensionService;
use App\Services\Solicitud\SolicitudDesignacionService;
use App\Models\Solicitud;
use App\Models\UsuarioSolicitante;
use Illuminate\Support\Facades\Mail;
use App\Mail\SolicitudCreada;
use App\Mail\NotificarAdminSolicitud;
use App\Models\Usuarios;
use App\Repositories\UsuarioRepository;
use App\Repositories\UsuarioSolicitanteRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class SolicitudService
{
    public function __construct(
        private SolicitudRepository $solicitudRepository,
        private SolicitudParteService $parteService,
        private SolicitudPretensionService $pretensionService,
        private SolicitudDesignacionService $designacionService,
        private UsuarioSolicitanteRepository $usuarioSolicitanteRepository,
        private UsuarioRepository $usuarioRepository,
    ) {}

    public function crear(CrearSolicitudDTO $dto, int $id_usuario_solicitante): Solicitud
    {
        return DB::transaction(function () use ($dto, $id_usuario_solicitante) {
            // 1. Crear solicitud base
            $solicitud = $this->crearSolicitudBase($dto, $id_usuario_solicitante);
            
            // 2. Crear demandante
            $this->parteService->crearParteCompleta(
                $dto->demandante,
                $dto->correos_demandante,
                $dto->representante_demandante,
                $solicitud->id_solicitud
            );
            
            // 3. Crear demandado
            $this->parteService->crearParteCompleta(
                $dto->demandado,
                $dto->correos_demandado,
                $dto->representante_demandado,
                $solicitud->id_solicitud,
                $dto->demandado_extra
            );
            
            // 5. Crear pretensiones
            $this->pretensionService->crearPretensiones($dto->pretensiones, $solicitud->id_solicitud);
            
            // 6. Crear designación arbitral
            $this->designacionService->crearDesignacion(
                $dto->designacion,
                $dto->arbitros,
                $solicitud->id_solicitud
            );
            
            $solicitudCompleta = $this->solicitudRepository->obtenerPorId($solicitud->id_solicitud);

            // Enviar correo de notificación al usuario solicitante
            $usuario = $this->usuarioSolicitanteRepository->buscarPorId($id_usuario_solicitante);
            if ($usuario && $usuario->correo) {
                Mail::to($usuario->correo)->send(new SolicitudCreada($usuario));
            }

            // Enviar correo al administrador
            $admin = $this->usuarioRepository->obtenerUsuarioPorRolYEstado(1, true);
            if ($admin && $admin->correos && $admin->correos->count() > 0) {
                $correoAdmin = $admin->correos->first()->direccion;
                Mail::to($correoAdmin)->send(new NotificarAdminSolicitud());
            }

            return $solicitudCompleta->load(['partes.correos', 'partes.representante', 'partes.demandadoExtra', 'pretensiones', 'designacion.arbitro']);
        });
    }

    public function obtenerPorId(int $id): ?Solicitud
    {
        return $this->solicitudRepository->obtenerPorId($id);
    }

    public function obtenerPorUsuario(int $id_usuario): Collection
    {
        return $this->solicitudRepository->obtenerPorUsuario($id_usuario);
    }


    private function crearSolicitudBase(CrearSolicitudDTO $dto, int $id_usuario_solicitante): Solicitud
    {
        return $this->solicitudRepository->crear([
            'estado' => 'pendiente',
            'resumen_controversia' => $dto->resumen_controversia,
            'medida_cautelar' => $dto->medida_cautelar,
            'link_anexo' => $dto->link_anexo,
            'id_usuario_solicitante' => $id_usuario_solicitante
        ]);
    }
}