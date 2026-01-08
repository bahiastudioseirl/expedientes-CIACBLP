<?php

namespace App\Repositories;

use App\Models\SolicitudCodigo;
use Carbon\Carbon;

class SolicitudCodigoRepository
{
    public function crear(array $data): SolicitudCodigo
    {
        return SolicitudCodigo::create($data);
    }
    
    public function buscarCodigoValido(string $codigo): ?SolicitudCodigo
    {
        return SolicitudCodigo::where('codigo', $codigo)
            ->where('usado', false)
            ->where('fecha_expiracion', '>', Carbon::now())
            ->first();
    }
    
    public function marcarComoUsado(int $idSolicitudCodigo): bool
    {
        $codigo = SolicitudCodigo::find($idSolicitudCodigo);
        if ($codigo) {
            $codigo->usado = true;
            return $codigo->save();
        }
        return false;
    }
    
    public function invalidarCodigosAnteriores(int $idUsuarioSolicitante): void
    {
        SolicitudCodigo::where('id_usuario_solicitante', $idUsuarioSolicitante)
            ->where('usado', false)
            ->update(['usado' => true]);
    }
}