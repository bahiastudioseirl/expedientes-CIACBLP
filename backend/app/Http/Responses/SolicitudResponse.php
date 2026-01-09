<?php

namespace App\Http\Responses;

use App\Models\Solicitud;
use Illuminate\Http\JsonResponse;

class SolicitudResponse
{

    public static function crear(Solicitud $solicitud): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => '¡Solicitud enviada corretamente! Se evaluará dentro de los próximos 10 días hábiles.',
            'data' => [
                'solicitud' => self::formatSolicitudDetallada($solicitud)
            ]
        ], 201);
    }

    public static function solicitud(Solicitud $solicitud): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'solicitud' => self::formatSolicitudDetallada($solicitud)
            ]
        ]);
    }

    public static function solicitudes($solicitudes): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'solicitudes' => $solicitudes->map(fn($s) => self::formatSolicitudDetallada($s))
            ],
            'meta' => [
                'total' => $solicitudes->count()
            ]
        ]);
    }

    private static function formatSolicitudDetallada(Solicitud $solicitud): array
    {
        $solicitud->load(['partes.correos', 'partes.representante', 'partes.demandadoExtra', 'pretensiones', 'designacion']);
        
        if ($solicitud->designacion) {
            $solicitud->designacion->load('arbitro');
        }

        return [
            'id' => $solicitud->id_solicitud,
            'estado' => $solicitud->estado,
            'partes' => $solicitud->partes->map(function ($parte) {
                $parteData = [
                    'id' => $parte->id_solicitud_parte,
                    'tipo' => $parte->tipo,
                    'nombre_razon' => $parte->nombre_razon,
                    'numero_documento' => $parte->numero_documento,
                    'telefono' => $parte->telefono,
                    'correos' => $parte->correos ? $parte->correos->map(function ($correo) {
                        return [
                            'id' => $correo->id_solicitud_correo,
                            'correo' => $correo->correo,
                            'es_principal' => $correo->es_principal,
                        ];
                    }) : [],
                    'representante' => $parte->representante ? [
                        'id' => $parte->representante->id_solicitud_representante,
                        'nombre_completo' => $parte->representante->nombre_completo,
                        'numero_documento' => $parte->representante->numero_documento,
                        'telefono' => $parte->representante->telefono,
                    ] : null,
                ];

                if ($parte->tipo === 'demandado') {
                    $parteData['demandado_extra'] = $parte->demandadoExtra ? [
                        'id' => $parte->demandadoExtra->id_solicitud_demandado_extra,
                        'mesa_partes_virtual' => $parte->demandadoExtra->mesa_partes_virtual,
                        'direccion_fisica' => $parte->demandadoExtra->direccion_fisica,
                    ] : null;
                }

                return $parteData;
            }),

            'resumen_controversia' => $solicitud->resumen_controversia,

            'pretensiones' => $solicitud->pretensiones->map(function ($pretension) {
                return [
                    'id' => $pretension->id_solicitud_pretension,
                    'descripcion' => $pretension->descripcion,
                    'determinada' => $pretension->determinada ? 'determinada' : 'indeterminada',
                    'cuantia' => $pretension->cuantia,
                ];
            }),

            'medida_cautelar' => $solicitud->medida_cautelar,

            'designacion_arbitral' => $solicitud->designacion ? [
                'id' => $solicitud->designacion->id_solicitud_designacion,
                'arbitro_unico' => $solicitud->designacion->arbitro_unico,
                'propone_arbitro' => $solicitud->designacion->propone_arbitro,
                'encarga_ciacblp' => $solicitud->designacion->encarga_ciacblp,
                'arbitro' => $solicitud->designacion->arbitro ? [
                    'id' => $solicitud->designacion->arbitro->id_solicitud_arbitro,
                    'nombre_completo' => $solicitud->designacion->arbitro->nombre_completo,
                    'correo' => $solicitud->designacion->arbitro->correo,
                    'telefono' => $solicitud->designacion->arbitro->telefono,
                ] : null,
            ] : null,
            
            'link_anexo' => $solicitud->link_anexo,

            'created_at' => $solicitud->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $solicitud->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
