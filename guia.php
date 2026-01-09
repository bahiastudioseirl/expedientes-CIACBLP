<?php
include("error_reporting.php");
include("conexion_db.php");
include("config.php");

// Obtener la fecha de cierre desde la tabla configuracion
$sql = "SELECT fecha_cierre FROM configuraciones LIMIT 1";
$result = $mysqli->query($sql);
$row = $result->fetch_array();
$fecha_cierre = new DateTime($row['fecha_cierre']);
$result->free_result();

$hoy = new DateTime();
$anio_actual = (int) $hoy->format('Y');

// Determinar el próximo período de habilitación
$anio_reapertura = ($hoy > $fecha_cierre) ? $anio_actual + 1 : $anio_actual;
$fecha_reapertura = new DateTime("{$anio_reapertura}-01-01");
$fecha_finalizacion = new DateTime(($anio_reapertura + 2) . "-11-30");

?>
<!DOCTYPE html>
<html lang="zxx" class="js">

<head>
    <meta charset="utf-8">
    <meta name="author" content="Bahia.pe">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Formulario de registro de postulantes para adjudicadores en CIACBLP.">
    <!-- Fav Icon  -->
    <link rel="shortcut icon" href="<?php echo $base_url; ?>images/favicon.png">
    <!-- Page Title  -->
    <title>Registro de Postulantes Adjudicadores - CIACBLP</title>
    <!-- StyleSheets  -->
    <link rel="stylesheet" href="<?php echo $base_url; ?>assets/css/dashlite.css?ver=3.2.3">
    <link id="skin-default" rel="stylesheet" href="<?php echo $base_url; ?>assets/css/theme.css?ver=3.2.3">
</head>

<body class="nk-body ui-rounder npc-general pg-survey">
    <div class="nk-app-root">
        <!-- main @s -->
        <div class="nk-main ">
            <!-- wrap @s -->
            <div class="nk-wrap nk-wrap-nosidebar">
                <!-- content @s -->
                <div class="nk-content ">
                    <div class="nk-split nk-split-page nk-split-lg">
                        <div class="nk-split-content bg-dark is-dark p-5 d-flex justify-between flex-column text-center">
                            <a href="html/index.html" class="logo-link nk-sidebar-logo">
                                <img class="logo-light logo-img logo-img-lg" src="<?php echo $base_url; ?>images/logo.png" srcset="<?php echo $base_url; ?>images/logo2x.png 2x" alt="logo">
                                <img class="logo-dark logo-img logo-img-lg" src="<?php echo $base_url; ?>images/logo-dark.png" srcset="<?php echo $base_url; ?>images/logo-dark2x.png 2x" alt="logo-dark">
                                <!-- <img class="logo-img-dark" src="<?php echo $base_url; ?>images/logo-contienda-dark-h.png" alt="logo"> -->
                            </a>
                            <div class="text-block wide-xs mx-auto">
                                <h3 class="text-white" id="titulo-formulario">Registro de Adjudicadores</h3>
                                <p class="text-sub" id="descripcion-formulario">Usa este formulario para registrarte en nuestra base de datos de postulantes a adjudicadores.</p>
                                <img class="nk-survey-gfx mt-5 img-landing" src="<?php echo $base_url; ?>images/gfx/job-survey.svg" alt="">
                            </div>
                            <p class="text-sub">&copy; <?php echo date("Y"); ?> CIACBLP. Todos los derechos reservados</p>
                        </div><!-- .nk-split-content -->
                        <div class="nk-split-content nk-split-stretch bg-white p-5 d-flex justify-center align-center flex-column">
                            <div class="wide-xs-fix">
                                <?php if (!($hoy >= $fecha_cierre && $hoy < $fecha_reapertura)) { ?>


                                    <form class="nk-stepper stepper-init is-alter" action="#" id="stepper-survey-v2">
                                        <div class="nk-stepper-content">
                                            <div class="nk-stepper-progress stepper-progress mb-4">
                                                <div class="stepper-progress-count mb-2"></div>
                                                <div class="progress progress-md">
                                                    <div class="progress-bar stepper-progress-bar"></div>
                                                </div>
                                            </div>
                                            <div class="nk-stepper-steps stepper-steps">
                                                <div class="nk-stepper-step">
                                                    <div class="nk-stepper-step-head mb-4">
                                                        <h5 class="title">PASO 1: Datos Generales</h5>
                                                        <p>Ingresa tus datos generales para iniciar.</p>
                                                    </div>
                                                    <div class="row g-4">
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="nombres_adju">Nombres</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="text" class="form-control" id="nombres_adju" name="nombres_adju" placeholder="Juan" minlength="2" maxlength="50" required>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="apellidos_adju">Apellidos</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="text" class="form-control" id="apellidos_adju" name="apellidos_adju" placeholder="Pérez" minlength="2" maxlength="50" required>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="dni_pasaporte_adju">DNI/Pasaporte</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="number" class="form-control" id="dni_pasaporte_adju" name="dni_pasaporte_adju" placeholder="45828982" minlength="8" maxlength="15" required>
                                                                </div>
                                                                <div id="dni-validation-message" class="error-message" style="display: none;"></div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="direccion_adju">Dirección</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="text" class="form-control" id="direccion_adju" name="direccion_adju" placeholder="Av. Ayacucho 182, Lima" minlength="10" maxlength="50" required>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="correo_adju">Correo</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="email" class="form-control" id="correo_adju" name="correo_adju" placeholder="usuario@correo.com" minlength="5" maxlength="50" required>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="telefono_adju">Teléfono</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="number" class="form-control" id="telefono_adju" name="telefono_adju" placeholder="+51 959 132 928" minlength="9" maxlength="15" required>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="profesion_adju">Profesión</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="text" class="form-control" id="profesion_adju" name="profesion_adju" placeholder="Abogado, Ingeniero, etc." minlength="3" maxlength="100" required>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="form-group">
                                                                <label class="form-label" for="lugar_trabajo_adju">Lugar de trabajo</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="text" class="form-control" id="lugar_trabajo_adju" name="lugar_trabajo_adju" placeholder="Universidad Privada San Pablo II" minlength="10" maxlength="100" required>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="nk-stepper-step" id="preguntas1">
                                                    <div class="nk-stepper-step-head mb-4">
                                                        <h5 class="title">PARTE 2: Preguntas</h5>
                                                        <p>Complete las respuestas de cada pregunta, todas son obligatorias.</p>
                                                    </div>
                                                    <div class="row g-3">

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta1">1. ¿Cuenta con experiencia mínima de dos (2) años como supervisor de obras y/o en contratos de suministro?</label>
                                                                <div class="form-control-wrap mb-2">
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta1_si" name="pregunta1_radio" class="custom-control-input" value="SI" onclick="togglePreguntaInput('pregunta1', true)" required>
                                                                        <label class="custom-control-label" for="pregunta1_si">SI</label>
                                                                    </div>
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta1_no" name="pregunta1_radio" class="custom-control-input" value="NO" onclick="togglePreguntaInput('pregunta1', false)" required>
                                                                        <label class="custom-control-label" for="pregunta1_no">NO</label>
                                                                    </div>
                                                                </div>
                                                                <div class="form-control-wrap" id="pregunta1_input_wrap" style="display:none;">
                                                                    <label for="pregunta1" class="form-label">Indicar donde.</label>
                                                                    <input type="text" class="form-control" id="pregunta1" name="pregunta1" placeholder="Escriba aquí..." minlength="2" maxlength="500">
                                                                </div>
                                                                <!-- Campo oculto para capturar el valor del radio button -->
                                                                <input type="hidden" id="pregunta1_si_no" name="pregunta1_si_no" value="0">
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta2">2. ¿En cuántas Juntas de Resolución de Disputas, DB, DABs o DRBs ha participado como adjudicador único, co adjudicador o presidente del panel (o equivalente), en los últimos cinco (5) años?</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="number" class="form-control" id="pregunta2" name="pregunta2" placeholder="5" minlength="1" maxlength="4" required>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta3">3. ¿En cuántas Juntas de Resolución de Disputas, DB, DABs o DRBs ha participado como abogado, representante, apoderado, encargado (o similares) de alguna de las partes en los últimos cinco (5) años?</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="number" class="form-control" id="pregunta3" name="pregunta3" placeholder="5" minlength="1" maxlength="4" required>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta4">4 ¿Ha llevado cursos de especialización en Junta de Resolución de Disuputas, DB, DABs, DRBs, vinculados o similares?</label>
                                                                <div class="form-control-wrap mb-2">
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta4_si" name="pregunta4_radio" class="custom-control-input" value="SI" onclick="togglePreguntaInput('pregunta4', true)" required>
                                                                        <label class="custom-control-label" for="pregunta4_si">SI</label>
                                                                    </div>
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta4_no" name="pregunta4_radio" class="custom-control-input" value="NO" onclick="togglePreguntaInput('pregunta4', false)" required>
                                                                        <label class="custom-control-label" for="pregunta4_no">NO</label>
                                                                    </div>
                                                                </div>
                                                                <div class="form-control-wrap" id="pregunta4_input_wrap" style="display:none;">
                                                                    <label for="pregunta4" class="form-label">Indique los tres últimos, cuáles, dónde y el periodo (ENTER para escribir el siguiente)</label>
                                                                    <div class="form-control-wrap">
                                                                        <textarea class="form-control" id="pregunta4" name="pregunta4" placeholder="Nombre del curso // Nombre de la institución // Del dd/mm/aa al dd/mm/aa" minlength="2" maxlength="1000"></textarea>
                                                                    </div>
                                                                </div>
                                                                <!-- Campo oculto para capturar el valor del radio button -->
                                                                <input type="hidden" id="pregunta4_si_no" name="pregunta4_si_no" value="0">
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta5">5. Número de recusaciones fundadas</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="number" class="form-control" id="pregunta5" name="pregunta5" placeholder="0" minlength="1" maxlength="4" required>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>


                                                <div class="nk-stepper-step" id="preguntas2">
                                                    <div class="nk-stepper-step-head mb-4">
                                                        <h5 class="title">PARTE 2: Preguntas</h5>
                                                        <p>Todas las respuestas son obligatorias</p>
                                                    </div>
                                                    <div class="row g-3">
                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta6">6. ¿Cuántos JRPD tiene en curso a la fecha de presentación de este formato?</label>
                                                                <div class="form-control-wrap">
                                                                    <input type="number" class="form-control" id="pregunta6" name="pregunta6" placeholder="0" minlength="1" maxlength="4" required>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta7">7. ¿Ha participado como ponente en eventos sobre temas de Junta de Resolución de Disputas, DB, DABS? </label>
                                                                <div class="form-control-wrap mb-2">
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta7_si" name="pregunta7_radio" class="custom-control-input" value="SI" onclick="togglePreguntaInput('pregunta7', true)" required>
                                                                        <label class="custom-control-label" for="pregunta7_si">SI</label>
                                                                    </div>
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta7_no" name="pregunta7_radio" class="custom-control-input" value="NO" onclick="togglePreguntaInput('pregunta7', false)" required>
                                                                        <label class="custom-control-label" for="pregunta7_no">NO</label>
                                                                    </div>
                                                                </div>
                                                                <div class="form-control-wrap" id="pregunta7_input_wrap" style="display:none;">
                                                                    <label for="pregunta7" class="form-label">Indique los tres últimos y sus fechas. (ENTER para escribir el siguiente)</label>
                                                                    <div class="form-control-wrap">
                                                                        <textarea class="form-control" id="pregunta7" name="pregunta7" placeholder="Nombre del evento / Periodo: Del dd/mm/aa al dd/mm/aa" minlength="2" maxlength="1000"></textarea>
                                                                    </div>
                                                                </div>
                                                                <!-- Campo oculto para capturar el valor del radio button -->
                                                                <input type="hidden" id="pregunta7_si_no" name="pregunta7_si_no" value="0">
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta8">8. ¿Es, o ha sido, docente universitario? </label>
                                                                <div class="form-control-wrap mb-2">
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta8_si" name="pregunta8_radio" class="custom-control-input" value="SI" onclick="togglePreguntaInput('pregunta8', true)" required>
                                                                        <label class="custom-control-label" for="pregunta8_si">SI</label>
                                                                    </div>
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta8_no" name="pregunta8_radio" class="custom-control-input" value="NO" onclick="togglePreguntaInput('pregunta8', false)" required>
                                                                        <label class="custom-control-label" for="pregunta8_no">NO</label>
                                                                    </div>
                                                                </div>
                                                                <div class="form-control-wrap" id="pregunta8_input_wrap" style="display:none;">
                                                                    <label for="pregunta8" class="form-label">Indique dónde, el nombre del/los cursos y el/los periodos, de ser el caso. (ENTER para escribir el siguiente)</label>
                                                                    <div class="form-control-wrap">
                                                                        <textarea class="form-control" id="pregunta8" name="pregunta8" placeholder="Lugar / Nombre del curso / Del dd/mm/aa al dd/mm/aa" minlength="2" maxlength="1000"></textarea>
                                                                    </div>
                                                                </div>
                                                                <!-- Campo oculto para capturar el valor del radio button -->
                                                                <input type="hidden" id="pregunta8_si_no" name="pregunta8_si_no" value="0">
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label" for="pregunta9">9. Ha llevado algún seminario/curso/diplomado/taller etc., de Ética profesional?</label>
                                                                <div class="form-control-wrap mb-2">
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta9_si" name="pregunta9_radio" class="custom-control-input" value="SI" onclick="togglePreguntaInput('pregunta9', true)" required>
                                                                        <label class="custom-control-label" for="pregunta9_si">SI</label>
                                                                    </div>
                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" id="pregunta9_no" name="pregunta9_radio" class="custom-control-input" value="NO" onclick="togglePreguntaInput('pregunta9', false)" required>
                                                                        <label class="custom-control-label" for="pregunta9_no">NO</label>
                                                                    </div>
                                                                </div>
                                                                <div class="form-control-wrap" id="pregunta9_input_wrap" style="display:none;">
                                                                    <label for="pregunta9" class="form-label">Indique en dónde y cuándo.</label>
                                                                    <input type="text" class="form-control" id="pregunta9" name="pregunta9" placeholder="Lugar / Periodo: Del dd/mm/aa al dd/mm/aa" minlength="2" maxlength="500">
                                                                </div>
                                                                <!-- Campo oculto para capturar el valor del radio button -->
                                                                <input type="hidden" id="pregunta9_si_no" name="pregunta9_si_no" value="0">
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12">
                                                            <div class="form-group">
                                                                <label class="form-label">10. Para acceder a beneficios en los cursos que se pudieran dictar a través de convenios en otros países:</label>
                                                                <div class="card card-bordered">
                                                                    <div class="card-inner">
                                                                        <div class="gy-3">
                                                                            <div class="row g-3 align-center">
                                                                                <div class="col-md-8">
                                                                                    <span>¿Cuenta con visa?</span>
                                                                                </div>
                                                                                <div class="col-md-4">
                                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                                        <input type="radio" id="visa_si" name="visa" class="custom-control-input" value="SI" required>
                                                                                        <label class="custom-control-label" for="visa_si">SI</label>
                                                                                    </div>
                                                                                    <div class="custom-control custom-radio custom-control-inline">
                                                                                        <input type="radio" id="visa_no" name="visa" class="custom-control-input" value="NO" required>
                                                                                        <label class="custom-control-label" for="visa_no">NO</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>





                                                <div class="nk-stepper-step" id="preguntas3">
                                                    <div class="nk-stepper-step-head mb-4">
                                                        <h5 class="title">PARTE 2: Preguntas</h5>
                                                        <p>Complete las respuestas de cada pregunta, todas son obligatorias.</p>
                                                    </div>
                                                    <div class="row g-g3">
                                                        <div class="col-sm-12">
                                                            <div class="card">
                                                                <div class="card-inner">
                                                                    <div class="form-group">
                                                                        <label class="form-label">11. Asimismo, declaro lo siguiente:</label>
                                                                        <div class="w-100">
                                                                            <table class="table table-bordered table-hover">
                                                                                <thead class="table-light">
                                                                                    <tr>
                                                                                        <th class="fw-bold">Declaraciones</th>
                                                                                        <th class="text-center">V</th>
                                                                                        <th class="text-center">F</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>1. Dentro de los últimos cinco (5) años, cuento con experiencia acreditada conforme a lo dispuesto por el artículo 77.7 de la Ley 32069 y el numeral 329.1 del artículo 329° del Reglamento de la Ley 32069, en lo que corresponde. </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="exp_obj_contr_v" name="exp_objeto_contrato" value="V" required><label class="custom-control-label" for="exp_obj_contr_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="exp_obj_contr_f" name="exp_objeto_contrato" value="F" required><label class="custom-control-label" for="exp_obj_contr_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>2. No me encuentro en ninguno de los impedimentos establecidos en el artículo 77.9 de la Ley N.º 32069, su Reglamento y las directivas del OECE.</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="sin_impedimentos_v" name="sin_impedimentos" value="V" required><label class="custom-control-label" for="sin_impedimentos_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="sin_impedimentos_f" name="sin_impedimentos" value="F" required><label class="custom-control-label" for="sin_impedimentos_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>3. No he sido condenado por delito doloso</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="delito_v" name="delito_doloso" value="V" required><label class="custom-control-label" for="delito_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="delito_f" name="delito_doloso" value="F" required><label class="custom-control-label" for="delito_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>4. No me encuentro incluido en investigación o proceso penal alguno</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="proceso_v" name="proceso_penal" value="V" required><label class="custom-control-label" for="proceso_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="proceso_f" name="proceso_penal" value="F" required><label class="custom-control-label" for="proceso_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>5. No estoy reportado como moroso en el sistema crediticio/financiero</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="moroso_v" name="moroso_crediticio" value="V" required><label class="custom-control-label" for="moroso_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="moroso_f" name="moroso_crediticio" value="F" required><label class="custom-control-label" for="moroso_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>6. No tengo deudas tributarias exigibles en cobranza coactiva</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="deudas_v" name="deudas_tributarias" value="V" required><label class="custom-control-label" for="deudas_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="deudas_f" name="deudas_tributarias" value="F" required><label class="custom-control-label" for="deudas_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>7. No tengo abierto proceso concursal como persona natural</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="concursal_v" name="proceso_concursal" value="V" required><label class="custom-control-label" for="concursal_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="concursal_f" name="proceso_concursal" value="F" required><label class="custom-control-label" for="concursal_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>8. No estoy en el Registro de Deudores Familiares (REDAM) (o equivalente en su país, de ser el caso).</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="redam_v" name="redam" value="V" required><label class="custom-control-label" for="redam_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="redam_f" name="redam" value="F" required><label class="custom-control-label" for="redam_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>9. No tengo antecedentes sobre recusaciones y sanciones en el Organismo Supervisor de Contrataciones con el Estado (OSCE) (o el equivalente en su país, de ser el caso).</td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="osce_v" name="recusaciones_osce" value="V" required><label class="custom-control-label" for="osce_v"></label></div>
                                                                                        </td>
                                                                                        <td class="text-center">
                                                                                            <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="osce_f" name="recusaciones_osce" value="F" required><label class="custom-control-label" for="osce_f"></label></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <p class="mt-3"><strong>V = Verdadero / F = Falso</strong></p>
                                                                        <div class="form-group">
                                                                            <label class="form-label" for="adicionalfalso"><em>* Si en alguno de los puntos se ha marcado "F", escriba aquí del hecho correspondiente.</em></label>
                                                                            <div class="form-control-wrap">
                                                                                <textarea class="form-control" id="adicionalfalso" name="adicionalfalso" placeholder="Escriba..." minlength="10" maxlength="1000"></textarea>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row g-3 m-2">
                                                        <div class="col-md-12">

                                                            <div class="form-group"> <label class="form-label" for="archivo_pdf">12. Adjuntar Curriculum Vitae Documentado en formato PDF:</label>
                                                                <div class="form-control-wrap">
                                                                    <div class="form-file"> <input type="file" class="form-file-input" name="archivo_pdf" id="archivo_pdf" accept=".pdf" required> <label class="form-file-label" for="archivo_pdf">Seleccionar archivo</label> </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div class="row g-3 m-2">
                                                        <div class="col-md-12">

                                                            <div class="form-group"> <label class="form-label" for="archivo_cul">13. Adjuntar Certificado Único Laboral (CUL) en formato PDF:</label>
                                                                <div class="form-control-wrap">
                                                                    <div class="form-file"> <input type="file" class="form-file-input" name="archivo_cul" id="archivo_cul" accept=".pdf" required> <label class="form-file-label" for="archivo_cul">Seleccionar archivo</label> </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div class="row g-3 m-2">
                                                        <div class="col-md-12">

                                                            <div class="form-group"> <label class="form-label" for="archivo_redam">14. Adjuntar Registro de Deudores Alimentarios Morosos (REDAM) en formato PDF:</label>
                                                                <div class="form-control-wrap">
                                                                    <div class="form-file"> <input type="file" class="form-file-input" name="archivo_redam" id="archivo_redam" accept=".pdf" required> <label class="form-file-label" for="archivo_redam">Seleccionar archivo</label> </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div class="row g-3 m-2">
                                                        <div class="col-md-12">

                                                            <div class="alert alert-warning alert-icon mt-2">
                                                                <em class="icon ni ni-info"></em>
                                                                <div class="alert-text">
                                                                    Nota: Toda la información aquí consignada es confidencial, no obstante, en caso de ser admitido en la nómina,
                                                                    el Centro queda autorizado, a publicar en su página institucional, información relativa al número de casos
                                                                    arbitrales en los que se encuentra participando o ha participado en el pasado y el estado actual de los mismos,
                                                                    la participación que ostenta u ostentó en dichos JPRD, así como información referida a recusaciones o sanciones fundadas.
                                                                    <br><br>El presente formulario tiene carácter de Declaración Jurada.
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <!-- Agregar el checkbox para aceptar términos y condiciones -->
                                                    <div class="row g-3 m-2">
                                                        <div class="col-md-12">
                                                            <div class="form-group">
                                                                <div class="custom-control custom-checkbox">
                                                                    <input type="checkbox" class="custom-control-input" id="aceptar_terminos" name="aceptar_terminos" required>
                                                                    <label class="custom-control-label" for="aceptar_terminos">Acepto que toda la información aquí consignada es veraz y tiene caracter de Declaración Jurada.</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                            <ul class="nk-stepper-pagination pt-4 gx-4 gy-2 stepper-pagination notermino">
                                                <li class="step-prev"><button class="btn btn-dim btn-primary">Atrás</button></li>
                                                <li class="step-next"><button class="btn btn-primary">Continuar</button></li>
                                                <li class="step-submit"><input type="submit" class="btn btn-primary" id="enviar" value="Enviar" /></li>
                                            </ul>
                                        </div>
                                    </form>

                                <?php } else {
                                    // Se calcula la fecha de reapertura: 1 de enero del siguiente año
                                    $anio_reapertura = $hoy->format('Y') + 1;
                                    $fecha_reapertura = new DateTime("{$anio_reapertura}-01-01");

                                    $anio_vigencia_fin = $anio_reapertura + 1;
                                    $fecha_vigencia_fin = DateTime::createFromFormat(
                                        'Y-m-d',
                                        $anio_vigencia_fin . '-' . $fecha_cierre->format('m-d')
                                    );
                                ?>
                                    <div class="text-center">
                                        <div class="alert alert-warning p-4">
                                            <em class="icon ni ni-alert-circle fs-50 text-warning"></em>
                                            <h3 class="mt-3">El registro de postulaciones ha concluido</h3>
                                            <p class="mt-2">
                                                El formulario de registro estará disponible nuevamente el <strong><?php echo $fecha_reapertura->format('d/m/Y'); ?></strong>.
                                                <br> La próxima vigencia será hasta el <strong><?php echo $fecha_vigencia_fin->format('d/m/Y'); ?></strong>.
                                            </p>
                                        </div>
                                    </div>
                                <?php } ?>
                            </div>
                        </div><!-- .nk-split-content -->
                    </div><!-- .nk-split -->
                </div>
                <!-- wrap @e -->
            </div>
            <!-- content @e -->
        </div>
        <!-- main @e -->
    </div>
    <!-- app-root @e -->
    <!-- JavaScript -->
    <script src="<?php echo $base_url; ?>assets/js/bundle.js?ver=3.2.3"></script>
    <script src="<?php echo $base_url; ?>assets/js/scripts.js?ver=3.2.3"></script>
    <script type="text/javascript">
        // Mostrar/ocultar inputs de preguntas con radio SI/NO
        function togglePreguntaInput(pregunta, show, preserveValue = false) {
            var inputWrap = document.getElementById(pregunta + '_input_wrap');
            var input = document.getElementById(pregunta);
            var hiddenSiNo = document.getElementById(pregunta + '_si_no');

            if (show) {
                inputWrap.style.display = 'block';
                input.required = true;
                // Solo limpiar el valor si no se debe preservar (cuando es interacción del usuario)
                if (!preserveValue) {
                    input.value = '';
                }
                hiddenSiNo.value = '1'; // Marcar como SI (1)
            } else {
                inputWrap.style.display = 'none';
                input.required = false;
                // Establecer el valor como "NO" cuando se oculta
                input.value = 'NO';
                hiddenSiNo.value = '0'; // Marcar como NO (0)
            }
        }

        $(document).ready(function() {
            // Inicialmente deshabilitar el botón "Enviar"
            $("#enviar").prop("disabled", true);

            // Habilitar o deshabilitar el botón "Enviar" según el estado del checkbox
            $("#aceptar_terminos").on("change", function() {
                if ($(this).is(":checked")) {
                    $("#enviar").prop("disabled", false);
                } else {
                    $("#enviar").prop("disabled", true);
                }
            });

            // Capturamos el evento submit del formulario
            $("#stepper-survey-v2").on("submit", function(e) {
                e.preventDefault();
                // Eliminar mensajes previos
                $(".form-messages").remove();

                var valid = true;
                var errorMessages = [];

                // Validar checkbox de términos y condiciones
                if (!$("#aceptar_terminos").is(":checked")) {
                    valid = false;
                    errorMessages.push("Debe aceptar los términos y condiciones.");
                }

                // Validar campos de texto
                var nombres = $("#nombres_adju").val().trim();
                if (nombres.length < 2 || nombres.length > 50) {
                    valid = false;
                    errorMessages.push("El campo 'Nombres' debe tener entre 2 y 50 caracteres.");
                }

                var apellidos = $("#apellidos_adju").val().trim();
                if (apellidos.length < 2 || apellidos.length > 50) {
                    valid = false;
                    errorMessages.push("El campo 'Apellidos' debe tener entre 2 y 50 caracteres.");
                }

                var direccion = $("#direccion_adju").val().trim();
                if (direccion.length < 10 || direccion.length > 50) {
                    valid = false;
                    errorMessages.push("El campo 'Dirección' debe tener entre 10 y 50 caracteres.");
                }

                var correo = $("#correo_adju").val().trim();
                if (correo.length < 5 || correo.length > 50) {
                    valid = false;
                    errorMessages.push("El campo 'Correo' debe tener entre 5 y 50 caracteres.");
                }

                var lugarTrabajo = $("#lugar_trabajo_adju").val().trim();
                if (lugarTrabajo.length < 10 || lugarTrabajo.length > 100) {
                    valid = false;
                    errorMessages.push("El campo 'Lugar de trabajo' debe tener entre 10 y 100 caracteres.");
                }

                var profesion = $("#profesion_adju").val().trim();
                if (profesion.length < 3 || profesion.length > 100) {
                    valid = false;
                    errorMessages.push("El campo 'Profesión' debe tener entre 3 y 100 caracteres.");
                }

                // Validar DNI
                if (!dniValido) {
                    valid = false;
                    errorMessages.push("El DNI/Pasaporte no es válido o ya está registrado. Por favor verifique.");
                }


                // Validar pregunta 1 solo si SI está seleccionado
                var pregunta1Radio = $("input[name='pregunta1_radio']:checked").val();
                if (pregunta1Radio === 'SI') {
                    var pregunta1 = $("#pregunta1").val().trim();
                    if (pregunta1.length < 2 || pregunta1.length > 500) {
                        valid = false;
                        errorMessages.push("El campo 'Pregunta 1' debe tener entre 2 y 500 caracteres.");
                    }
                }

                // Validar pregunta 4 solo si SI está seleccionado
                var pregunta4Radio = $("input[name='pregunta4_radio']:checked").val();
                if (pregunta4Radio === 'SI') {
                    var pregunta4 = $("#pregunta4").val().trim();
                    if (pregunta4.length < 2 || pregunta4.length > 1000) {
                        valid = false;
                        errorMessages.push("El campo 'Pregunta 4' debe tener entre 2 y 1000 caracteres.");
                    }
                }

                // Validar pregunta 7 solo si SI está seleccionado
                var pregunta7Radio = $("input[name='pregunta7_radio']:checked").val();
                if (pregunta7Radio === 'SI') {
                    var pregunta7 = $("#pregunta7").val().trim();
                    if (pregunta7.length < 2 || pregunta7.length > 1000) {
                        valid = false;
                        errorMessages.push("El campo 'Pregunta 7' debe tener entre 2 y 1000 caracteres.");
                    }
                }

                // Validar pregunta 8 solo si SI está seleccionado
                var pregunta8Radio = $("input[name='pregunta8_radio']:checked").val();
                if (pregunta8Radio === 'SI') {
                    var pregunta8 = $("#pregunta8").val().trim();
                    if (pregunta8.length < 2 || pregunta8.length > 500) {
                        valid = false;
                        errorMessages.push("El campo 'Pregunta 8' debe tener entre 2 y 500 caracteres.");
                    }
                }

                // Validar pregunta 9 solo si SI está seleccionado
                var pregunta9Radio = $("input[name='pregunta9_radio']:checked").val();
                if (pregunta9Radio === 'SI') {
                    var pregunta9 = $("#pregunta9").val().trim();
                    if (pregunta9.length < 2 || pregunta9.length > 500) {
                        valid = false;
                        errorMessages.push("El campo 'Pregunta 9' debe tener entre 2 y 500 caracteres.");
                    }
                }

                // Validar campos numéricos
                var numberFields = [{
                        id: "dni_pasaporte_adju",
                        label: "DNI/Pasaporte",
                        min: 8,
                        max: 15
                    },
                    {
                        id: "pregunta2",
                        label: "Pregunta 2 - Participación en Juntas como adjudicador"
                    },
                    {
                        id: "pregunta3",
                        label: "Pregunta 3 - Participación como abogado/representante"
                    },
                    {
                        id: "pregunta5",
                        label: "Pregunta 5 - Número de recusaciones fundadas"
                    },
                    {
                        id: "pregunta6",
                        label: "Pregunta 6 - JRPD en curso"
                    }
                ];
                $.each(numberFields, function(i, field) {
                    var valor = $("#" + field.id).val().trim();
                    if (valor === "" || isNaN(valor)) {
                        valid = false;
                        errorMessages.push("El campo '" + field.label + "' debe ser un número válido.");
                    } else {
                        if (field.min && valor.length < field.min) {
                            valid = false;
                            errorMessages.push("El campo '" + field.label + "' debe tener al menos " + field.min + " dígitos.");
                        }
                        if (field.max && valor.length > field.max) {
                            valid = false;
                            errorMessages.push("El campo '" + field.label + "' debe tener máximo " + field.max + " dígitos.");
                        }
                    }
                });

                // Validar radios de preguntas SI/NO y visa
                var radioGroups = [{
                        name: "pregunta1_radio",
                        label: "Pregunta 1 - Experiencia como supervisor"
                    },
                    {
                        name: "pregunta4_radio",
                        label: "Pregunta 4 - Cursos de especialización en JRD"
                    },
                    {
                        name: "pregunta7_radio",
                        label: "Pregunta 7 - ¿Ha participado como ponente en eventos?"
                    },
                    {
                        name: "pregunta8_radio",
                        label: "Pregunta 8 - ¿Es o ha sido docente universitario?"
                    },
                    {
                        name: "pregunta9_radio",
                        label: "Pregunta 9 - ¿Ha llevado algún seminario de Ética profesional?"
                    },
                    {
                        name: "visa",
                        label: "¿Cuenta con visa?"
                    }
                ];
                $.each(radioGroups, function(i, group) {
                    if (!$("input[name='" + group.name + "']:checked").val()) {
                        valid = false;
                        errorMessages.push("Debe seleccionar una opción para '" + group.label + "'.");
                    }
                });

                // Validar declaraciones (Preguntas 11)
                var declaraciones = [
                    {
                        name: "exp_objeto_contrato",
                        label: "Experiencia vinculada con el objeto del contrato según artículo 329"
                    },
                    {
                        name: "sin_impedimentos",
                        label: "No me encuentro incurso en impedimentos del artículo 77.9 de la Ley 32069"
                    },
                    {
                        name: "delito_doloso",
                        label: "No he sido condenado por delito doloso"
                    },
                    {
                        name: "proceso_penal",
                        label: "No me encuentro incluido en investigación o proceso penal alguno"
                    },
                    {
                        name: "moroso_crediticio",
                        label: "No estoy reportado como moroso en el sistema crediticio/financiero"
                    },
                    {
                        name: "deudas_tributarias",
                        label: "No tengo deudas tributarias exigibles en cobranza coactiva"
                    },
                    {
                        name: "proceso_concursal",
                        label: "No tengo abierto proceso concursal como persona natural"
                    },
                    {
                        name: "redam",
                        label: "No estoy en el Registro de Deudores Familiares (REDAM)"
                    },
                    {
                        name: "recusaciones_osce",
                        label: "No tengo antecedentes sobre recusaciones y sanciones en el OSCE"
                    }
                ];
                // Validar que todas las declaraciones estén seleccionadas
                var hayFalso = false;
                $.each(declaraciones, function(i, decl) {
                    var valorSeleccionado = $("input[name='" + decl.name + "']:checked").val();
                    if (!valorSeleccionado) {
                        valid = false;
                        errorMessages.push("Debe seleccionar una opción para la declaración: '" + decl.label + "'.");
                    } else if (valorSeleccionado === 'F') {
                        hayFalso = true;
                    }
                });

                // Validar textarea adicionalfalso solo si hay al menos un "F" marcado
                var adicionalfalso = $("#adicionalfalso").val().trim();
                if (hayFalso) {
                    if (adicionalfalso.length < 10 || adicionalfalso.length > 1000) {
                        valid = false;
                        errorMessages.push("Debe explicar los hechos correspondientes a las declaraciones marcadas como 'F' (entre 10 y 1000 caracteres).");
                    }
                } else {
                    // Si no hay ninguna F marcada, el campo puede estar vacío pero si tiene contenido debe ser válido
                    if (adicionalfalso.length > 0 && (adicionalfalso.length < 10 || adicionalfalso.length > 1000)) {
                        valid = false;
                        errorMessages.push("El campo de explicación adicional debe tener entre 10 y 1000 caracteres.");
                    }
                }

                // Validar archivos PDF
                // CV es obligatorio
                var fileInputCV = $("#archivo_pdf");
                var filePathCV = fileInputCV.val();
                if (filePathCV === "") {
                    valid = false;
                    errorMessages.push("Debe adjuntar el archivo PDF del Curriculum Vitae.");
                } else {
                    var allowedExtensions = /(\.pdf)$/i;
                    if (!allowedExtensions.exec(filePathCV)) {
                        valid = false;
                        errorMessages.push("El archivo del Curriculum Vitae debe tener formato PDF.");
                    }
                }

                // CUL es obligatorio
                var fileInputCUL = $("#archivo_cul");
                var filePathCUL = fileInputCUL.val();
                if (filePathCUL === "") {
                    valid = false;
                    errorMessages.push("Debe adjuntar el archivo PDF del Certificado Único Laboral (CUL).");
                } else {
                    var allowedExtensions = /(\.pdf)$/i;
                    if (!allowedExtensions.exec(filePathCUL)) {
                        valid = false;
                        errorMessages.push("El archivo del Certificado Único Laboral (CUL) debe tener formato PDF.");
                    }
                }

                // REDAM es obligatorio
                var fileInputREDAM = $("#archivo_redam");
                var filePathREDAM = fileInputREDAM.val();
                if (filePathREDAM === "") {
                    valid = false;
                    errorMessages.push("Debe adjuntar el archivo PDF del Registro de Deudores Alimentarios Morosos (REDAM).");
                } else {
                    var allowedExtensions = /(\.pdf)$/i;
                    if (!allowedExtensions.exec(filePathREDAM)) {
                        valid = false;
                        errorMessages.push("El archivo del Registro de Deudores Alimentarios Morosos (REDAM) debe tener formato PDF.");
                    }
                }

                // Si hay errores, se muestran encima de los botones
                if (!valid) {
                    var errorHtml = '<div class="alert alert-danger form-messages">';
                    $.each(errorMessages, function(i, msg) {
                        errorHtml += "<p>" + msg + "</p>";
                    });
                    errorHtml += "</div>";
                    $(".nk-stepper-pagination").before(errorHtml);
                    return false;
                }

                // Bloquear botones y mostrar loading
                $(".step-prev, .step-next, .step-submit").prop("disabled", true);
                var loadingHtml = '<div class="loading-message">Enviando...</div>';
                $(".nk-stepper-pagination").after(loadingHtml);

                // Si la validación es correcta, se envían los datos mediante AJAX
                var formData = new FormData(this);

                // Enviar formulario de adjudicador - siempre es registro nuevo

                $.ajax({
                    url: "registro_registrar_adjudicadores.php", // Archivo PHP encargado de procesar los datos de adjudicadores
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    success: function(response) {
                        // Eliminar mensajes previos
                        $(".form-messages").remove();
                        $(".loading-message").remove();
                        if (response.success) {
                            // Ocultar los botones de la paginación
                            $(".step-prev, .step-next, .step-submit").hide();

                            // Mensaje de éxito para registro de adjudicador
                            var successHtml =
                                '<div class="alert alert-success alert-icon">' +
                                '<em class="icon ni ni-check-circle"></em>' +
                                '<div class="alert-text">' + response.message + '</div>' +
                                '</div>' +
                                // Bloque adicional informativo
                                '<div class="alert alert-info alert-icon mt-2">' +
                                '<em class="icon ni ni-mail"></em>' +
                                '<div class="alert-text">' +
                                'Se ha enviado un correo electrónico (revisa tu bandeja de spam) confirmando tu registro como postulante a adjudicador. ' +
                                'Si hubo algún error, puedes volver a enviar el formulario completo nuevamente.' +
                                '</div>' +
                                '</div>' +
                                // Botón suave para recargar la página
                                '<button type="button" class="btn btn-dim btn-secondary mt-3 reload-btn">' +
                                'Registrar otro adjudicador' +
                                '</button>';

                            // Reemplazar el contenido del último paso con el mensaje de éxito
                            $("#preguntas3").html(successHtml);
                        } else {
                            var errorHtml = '<div class="alert alert-danger form-messages">';
                            if (Array.isArray(response.errors)) {
                                $.each(response.errors, function(i, err) {
                                    errorHtml += "<p>" + err + "</p>";
                                });
                            } else {
                                errorHtml += "<p>" + response.message + "</p>";
                            }
                            errorHtml += "</div>";
                            $(".nk-stepper-pagination").before(errorHtml);
                            // Desbloquear botones
                            $(".step-prev, .step-next, .step-submit").prop("disabled", false);
                        }
                    },
                    error: function(xhr, status, error) {
                        $(".form-messages").remove();
                        $(".loading-message").remove();
                        var errorHtml =
                            '<div class="alert alert-danger form-messages"><p>Error al enviar el formulario. Intente nuevamente.</p></div>';
                        $(".nk-stepper-pagination").before(errorHtml);
                        // Desbloquear botones
                        $(".step-prev, .step-next, .step-submit").prop("disabled", false);
                    }
                });
            });

            // Prevenir el envío del formulario al presionar Enter en campos que no sean textarea
            $(document).on("keydown", function(event) {
                if (event.key === "Enter" && !$(event.target).is("textarea")) {
                    event.preventDefault();
                    var focusableElements = $('input, select, textarea, button').filter(':visible');
                    var index = focusableElements.index(event.target) + 1;
                    if (index >= focusableElements.length) index = 0;
                    focusableElements.eq(index).focus();
                }
            });

            // Botón para recargar la página y volver al formulario inicial
            $(document).on("click", ".reload-btn", function() {
                location.reload();
            });

            // Código de carga de postulante eliminado - Este es un formulario nuevo para adjudicadores

            // Variable para controlar si el DNI es válido
            let dniValido = true;

            // Validación de DNI existente
            $('#dni_pasaporte_adju').on('blur', function() {
                const dni = $(this).val().trim();
                const messageDiv = $('#dni-validation-message');

                if (dni === '') {
                    messageDiv.hide();
                    dniValido = true;
                    return;
                }

                if (dni.length < 8) {
                    messageDiv.text('El DNI debe tener al menos 8 dígitos.').css('color', 'red').show();
                    dniValido = false;
                    return;
                }

                // Verificar si el DNI ya existe en la base de datos
                $.ajax({
                    url: 'validar_dni_adjudicadores.php',
                    type: 'POST',
                    data: {
                        dni: dni
                    },
                    dataType: 'json',
                    success: function(response) {
                        if (response.existe) {
                            messageDiv.text(response.message).css('color', 'red').show();
                            dniValido = false;
                        } else {
                            messageDiv.text('DNI disponible.').css('color', 'green').show();
                            dniValido = true;
                        }
                    },
                    error: function() {
                        messageDiv.text('Error al validar el DNI. Intente nuevamente.').css('color', 'red').show();
                        dniValido = false;
                    }
                });
            });

            // Limpiar mensaje cuando se escribe en el campo
            $('#dni_pasaporte_adju').on('input', function() {
                $('#dni-validation-message').hide();
                dniValido = true;
            });

            // Interceptar el evento de navegación del stepper para validar DNI en el primer paso
            $(document).on('click', '.step-next', function(e) {
                // Solo validar en el primer paso
                const currentStep = $('.nk-stepper-step.current');
                if (currentStep.length === 0 || currentStep.index() === 0) {
                    const dni = $('#dni_pasaporte_adju').val().trim();

                    // Validar que el DNI esté completo
                    if (dni === '') {
                        $('#dni-validation-message').text('El DNI/Pasaporte es obligatorio.').css('color', 'red').show();
                        e.preventDefault();
                        return false;
                    }

                    if (dni.length < 8) {
                        $('#dni-validation-message').text('El DNI debe tener al menos 8 dígitos.').css('color', 'red').show();
                        e.preventDefault();
                        return false;
                    }

                    // Validar que el DNI no esté duplicado
                    if (!dniValido) {
                        $('#dni-validation-message').text('Este DNI ya está registrado. Si desea actualizar sus datos comuníquese a vchavezarispe@ciacblp.com').css('color', 'red').show();
                        e.preventDefault();
                        return false;
                    }
                }
            });

            // Modal de bienvenida eliminado
        });


    </script>
    <style type="text/css">
        .tablafondo {
            background-color: #F0F0F0;
            padding: 0px 20px;
            border-radius: 10px;
        }

        .rowfondo {
            background-color: #FFF;
        }

        .error-message {
            color: red;
            font-size: 12px;
            margin-top: 0px;
            margin-bottom: 10px;
        }

        .text-sub {
            color: #FFFFFF80;
        }

        .logo-link {
            margin-bottom: 20px;
        }

        .logo-img-dark {
            max-height: 80px;
            margin-bottom: 25px;
        }

        .img-landing {
            margin: 25px 0px;
        }

        .alert-warning {
            background-color: #fff3cd;
            border-color: #ffeeba;
            color: #856404;
            border-radius: 10px;
        }

        .alert-warning h3 {
            font-size: 24px;
            font-weight: bold;
        }

        .alert-warning p {
            font-size: 16px;
        }

        .icon {
            font-size: 50px;
        }

        /* Estilos para los modales de bienvenida - BLUR BLANCO SIMPLE */
        .modal-backdrop {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
        }

        .modal-content {
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
            border-bottom: 1px solid #f1f3f4;
            border-radius: 15px 15px 0 0;
        }

        .btn-block {
            width: 100%;
            margin-bottom: 10px;
        }

        .btn-lg {
            padding: 12px 24px;
            font-size: 16px;
        }

        .fs-2 {
            font-size: 2rem;
        }
    </style>



</html>