-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bstu438_expedientes
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adjuntos`
--

DROP TABLE IF EXISTS `adjuntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adjuntos` (
  `id_adjunto` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre_archivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta_archivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_mensaje` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_adjunto`),
  KEY `adjuntos_id_mensaje_foreign` (`id_mensaje`),
  CONSTRAINT `adjuntos_id_mensaje_foreign` FOREIGN KEY (`id_mensaje`) REFERENCES `mensajes` (`id_mensaje`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adjuntos`
--

LOCK TABLES `adjuntos` WRITE;
/*!40000 ALTER TABLE `adjuntos` DISABLE KEYS */;
/*!40000 ALTER TABLE `adjuntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asuntos`
--

DROP TABLE IF EXISTS `asuntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asuntos` (
  `id_asunto` bigint unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `id_flujo` bigint unsigned NOT NULL,
  `id_expediente` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_asunto`),
  KEY `asuntos_id_flujo_foreign` (`id_flujo`),
  KEY `asuntos_id_expediente_foreign` (`id_expediente`),
  CONSTRAINT `asuntos_id_expediente_foreign` FOREIGN KEY (`id_expediente`) REFERENCES `expedientes` (`id_expediente`) ON DELETE CASCADE,
  CONSTRAINT `asuntos_id_flujo_foreign` FOREIGN KEY (`id_flujo`) REFERENCES `flujos` (`id_flujo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asuntos`
--

LOCK TABLES `asuntos` WRITE;
/*!40000 ALTER TABLE `asuntos` DISABLE KEYS */;
/*!40000 ALTER TABLE `asuntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etapas`
--

DROP TABLE IF EXISTS `etapas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etapas` (
  `id_etapa` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_plantilla` bigint unsigned NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orden` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_etapa`),
  KEY `etapas_id_plantilla_foreign` (`id_plantilla`),
  CONSTRAINT `etapas_id_plantilla_foreign` FOREIGN KEY (`id_plantilla`) REFERENCES `plantillas` (`id_plantilla`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etapas`
--

LOCK TABLES `etapas` WRITE;
/*!40000 ALTER TABLE `etapas` DISABLE KEYS */;
INSERT INTO `etapas` VALUES (1,1,'Presentación de solicitud arbitral',1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(2,1,'Designación de árbitro único',2,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(3,1,'Etapa 3',3,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(4,1,'Fijación de puntos controvertidos y audiencia',4,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(5,1,'Emisión de Laudo',5,'2026-01-23 21:00:07','2026-01-23 21:00:07');
/*!40000 ALTER TABLE `etapas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expedientes`
--

DROP TABLE IF EXISTS `expedientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expedientes` (
  `id_expediente` bigint unsigned NOT NULL AUTO_INCREMENT,
  `codigo_expediente` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_plantilla` bigint unsigned NOT NULL,
  `id_solicitud` bigint unsigned NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `credenciales_demandado_enviadas` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_expediente`),
  UNIQUE KEY `expedientes_codigo_expediente_unique` (`codigo_expediente`),
  KEY `expedientes_id_plantilla_foreign` (`id_plantilla`),
  CONSTRAINT `expedientes_id_plantilla_foreign` FOREIGN KEY (`id_plantilla`) REFERENCES `plantillas` (`id_plantilla`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expedientes`
--

LOCK TABLES `expedientes` WRITE;
/*!40000 ALTER TABLE `expedientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `expedientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flujos`
--

DROP TABLE IF EXISTS `flujos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flujos` (
  `id_flujo` bigint unsigned NOT NULL AUTO_INCREMENT,
  `estado` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_limite` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `id_expediente` bigint unsigned NOT NULL,
  `id_etapa` bigint unsigned DEFAULT NULL,
  `id_subetapa` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_flujo`),
  KEY `flujos_id_expediente_foreign` (`id_expediente`),
  KEY `flujos_id_etapa_foreign` (`id_etapa`),
  KEY `flujos_id_subetapa_foreign` (`id_subetapa`),
  CONSTRAINT `flujos_id_etapa_foreign` FOREIGN KEY (`id_etapa`) REFERENCES `etapas` (`id_etapa`) ON DELETE SET NULL,
  CONSTRAINT `flujos_id_expediente_foreign` FOREIGN KEY (`id_expediente`) REFERENCES `expedientes` (`id_expediente`) ON DELETE CASCADE,
  CONSTRAINT `flujos_id_subetapa_foreign` FOREIGN KEY (`id_subetapa`) REFERENCES `sub_etapas` (`id_sub_etapa`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flujos`
--

LOCK TABLES `flujos` WRITE;
/*!40000 ALTER TABLE `flujos` DISABLE KEYS */;
/*!40000 ALTER TABLE `flujos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `id_mensaje` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contenido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_envio` datetime NOT NULL,
  `id_usuario` bigint unsigned NOT NULL,
  `id_asunto` bigint unsigned NOT NULL,
  `mensaje_padre_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_mensaje`),
  KEY `mensajes_id_usuario_foreign` (`id_usuario`),
  KEY `mensajes_id_asunto_foreign` (`id_asunto`),
  KEY `mensajes_mensaje_padre_id_foreign` (`mensaje_padre_id`),
  CONSTRAINT `mensajes_id_asunto_foreign` FOREIGN KEY (`id_asunto`) REFERENCES `asuntos` (`id_asunto`) ON DELETE CASCADE,
  CONSTRAINT `mensajes_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `mensajes_mensaje_padre_id_foreign` FOREIGN KEY (`mensaje_padre_id`) REFERENCES `mensajes` (`id_mensaje`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_12_05_143114_create_roles_table',1),(5,'2025_12_05_143122_create_usuarios_table',1),(6,'2025_12_23_202658_create_plantillas_table',1),(7,'2025_12_23_204313_create_etapas_table',1),(8,'2025_12_23_204542_create_sub_etapas_table',1),(9,'2026_01_07_205455_create_usuarios_solicitantes_table',1),(10,'2026_01_07_205834_create_solicitudes_codigos_table',1),(11,'2026_01_07_210100_create_solicitudes_table',1),(12,'2026_01_07_211025_create_solicitudes_pretensiones_table',1),(13,'2026_01_07_211557_create_solicitudes_partes_table',1),(14,'2026_01_07_211835_create_solicitudes_representante_table',1),(15,'2026_01_07_212047_create_solicitudes_demandado_extra_table',1),(16,'2026_01_07_212311_create_solicitudes_correos_table',1),(17,'2026_01_07_212449_create_solicitudes_designaciones_table',1),(18,'2026_01_07_212800_create_solicitudes_arbitros_table',1),(19,'2026_01_12_172444_create_tokens_passwords_table',1),(20,'2026_01_12_172446_create_expedientes_table',1),(21,'2026_01_12_174038_create_usuarios_expedientes_table',1),(22,'2026_01_12_174039_create_flujos_table',1),(23,'2026_01_12_174040_create_asuntos_table',1),(24,'2026_01_12_174041_create_mensajes_table',1),(25,'2026_01_12_174045_create_usuarios_mensajes_table',1),(26,'2026_01_12_174047_create_adjuntos_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantillas`
--

DROP TABLE IF EXISTS `plantillas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantillas` (
  `id_plantilla` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_plantilla`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantillas`
--

LOCK TABLES `plantillas` WRITE;
/*!40000 ALTER TABLE `plantillas` DISABLE KEYS */;
INSERT INTO `plantillas` VALUES (1,'Plantilla de Arbitraje Estándar',1,'2026-01-23 21:00:07','2026-01-23 21:00:07');
/*!40000 ALTER TABLE `plantillas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','2026-01-23 21:00:06','2026-01-23 21:00:06'),(2,'Arbitro','2026-01-23 21:00:06','2026-01-23 21:00:06'),(3,'Secretario','2026-01-23 21:00:06','2026-01-23 21:00:06'),(4,'Demandante','2026-01-23 21:00:06','2026-01-23 21:00:06'),(5,'Demandado','2026-01-23 21:00:06','2026-01-23 21:00:06'),(6,'Contador','2026-01-23 21:00:06','2026-01-23 21:00:06');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes`
--

DROP TABLE IF EXISTS `solicitudes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes` (
  `id_solicitud` bigint unsigned NOT NULL AUTO_INCREMENT,
  `estado` enum('pendiente','admitida','rechazada','observada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `resumen_controversia` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumen_controversia_tipo` enum('texto','archivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'texto',
  `resumen_controversia_archivo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medida_cautelar` text COLLATE utf8mb4_unicode_ci,
  `link_anexo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_usuario_solicitante` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `solicitudes_id_usuario_solicitante_foreign` (`id_usuario_solicitante`),
  CONSTRAINT `solicitudes_id_usuario_solicitante_foreign` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuarios_solicitantes` (`id_usuario_solicitante`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes`
--

LOCK TABLES `solicitudes` WRITE;
/*!40000 ALTER TABLE `solicitudes` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_arbitros`
--

DROP TABLE IF EXISTS `solicitudes_arbitros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_arbitros` (
  `id_solicitud_arbitro` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_solicitud_designacion` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_arbitro`),
  KEY `solicitudes_arbitros_id_solicitud_designacion_foreign` (`id_solicitud_designacion`),
  CONSTRAINT `solicitudes_arbitros_id_solicitud_designacion_foreign` FOREIGN KEY (`id_solicitud_designacion`) REFERENCES `solicitudes_designaciones` (`id_solicitud_designacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_arbitros`
--

LOCK TABLES `solicitudes_arbitros` WRITE;
/*!40000 ALTER TABLE `solicitudes_arbitros` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_arbitros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_codigos`
--

DROP TABLE IF EXISTS `solicitudes_codigos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_codigos` (
  `id_solicitud_codigo` bigint unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_expiracion` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `id_usuario_solicitante` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_codigo`),
  UNIQUE KEY `solicitudes_codigos_codigo_unique` (`codigo`),
  KEY `solicitudes_codigos_id_usuario_solicitante_foreign` (`id_usuario_solicitante`),
  CONSTRAINT `solicitudes_codigos_id_usuario_solicitante_foreign` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuarios_solicitantes` (`id_usuario_solicitante`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_codigos`
--

LOCK TABLES `solicitudes_codigos` WRITE;
/*!40000 ALTER TABLE `solicitudes_codigos` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_codigos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_correos`
--

DROP TABLE IF EXISTS `solicitudes_correos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_correos` (
  `id_solicitud_correo` bigint unsigned NOT NULL AUTO_INCREMENT,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_principal` tinyint(1) NOT NULL,
  `id_solicitud_parte` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_correo`),
  KEY `solicitudes_correos_id_solicitud_parte_foreign` (`id_solicitud_parte`),
  CONSTRAINT `solicitudes_correos_id_solicitud_parte_foreign` FOREIGN KEY (`id_solicitud_parte`) REFERENCES `solicitudes_partes` (`id_solicitud_parte`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_correos`
--

LOCK TABLES `solicitudes_correos` WRITE;
/*!40000 ALTER TABLE `solicitudes_correos` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_correos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_demandados_extras`
--

DROP TABLE IF EXISTS `solicitudes_demandados_extras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_demandados_extras` (
  `id_solicitud_demandado_extra` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mesa_partes_virtual` tinyint(1) NOT NULL,
  `direccion_fiscal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_solicitud_parte` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_demandado_extra`),
  KEY `solicitudes_demandados_extras_id_solicitud_parte_foreign` (`id_solicitud_parte`),
  CONSTRAINT `solicitudes_demandados_extras_id_solicitud_parte_foreign` FOREIGN KEY (`id_solicitud_parte`) REFERENCES `solicitudes_partes` (`id_solicitud_parte`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_demandados_extras`
--

LOCK TABLES `solicitudes_demandados_extras` WRITE;
/*!40000 ALTER TABLE `solicitudes_demandados_extras` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_demandados_extras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_designaciones`
--

DROP TABLE IF EXISTS `solicitudes_designaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_designaciones` (
  `id_solicitud_designacion` bigint unsigned NOT NULL AUTO_INCREMENT,
  `arbitro_unico` tinyint(1) NOT NULL,
  `propone_arbitro` tinyint(1) DEFAULT NULL,
  `encarga_ciacblp` tinyint(1) DEFAULT NULL,
  `id_solicitud` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_designacion`),
  KEY `solicitudes_designaciones_id_solicitud_foreign` (`id_solicitud`),
  CONSTRAINT `solicitudes_designaciones_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_designaciones`
--

LOCK TABLES `solicitudes_designaciones` WRITE;
/*!40000 ALTER TABLE `solicitudes_designaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_designaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_partes`
--

DROP TABLE IF EXISTS `solicitudes_partes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_partes` (
  `id_solicitud_parte` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tipo` enum('demandante','demandado') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_razon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_fiscal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_solicitud` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_parte`),
  KEY `solicitudes_partes_id_solicitud_foreign` (`id_solicitud`),
  CONSTRAINT `solicitudes_partes_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_partes`
--

LOCK TABLES `solicitudes_partes` WRITE;
/*!40000 ALTER TABLE `solicitudes_partes` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_partes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_pretensiones`
--

DROP TABLE IF EXISTS `solicitudes_pretensiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_pretensiones` (
  `id_solicitud_pretension` bigint unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `determinada` tinyint(1) NOT NULL,
  `cuantia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_solicitud` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_pretension`),
  KEY `solicitudes_pretensiones_id_solicitud_foreign` (`id_solicitud`),
  CONSTRAINT `solicitudes_pretensiones_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_pretensiones`
--

LOCK TABLES `solicitudes_pretensiones` WRITE;
/*!40000 ALTER TABLE `solicitudes_pretensiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_pretensiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_representantes`
--

DROP TABLE IF EXISTS `solicitudes_representantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_representantes` (
  `id_solicitud_representante` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_solicitud_parte` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_solicitud_representante`),
  KEY `solicitudes_representantes_id_solicitud_parte_foreign` (`id_solicitud_parte`),
  CONSTRAINT `solicitudes_representantes_id_solicitud_parte_foreign` FOREIGN KEY (`id_solicitud_parte`) REFERENCES `solicitudes_partes` (`id_solicitud_parte`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_representantes`
--

LOCK TABLES `solicitudes_representantes` WRITE;
/*!40000 ALTER TABLE `solicitudes_representantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_representantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_etapas`
--

DROP TABLE IF EXISTS `sub_etapas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_etapas` (
  `id_sub_etapa` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_etapa` bigint unsigned NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `orden` int NOT NULL,
  `dias_habiles` int NOT NULL DEFAULT '0',
  `es_habil` tinyint(1) NOT NULL DEFAULT '1',
  `es_obligatorio` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_sub_etapa`),
  KEY `sub_etapas_id_etapa_foreign` (`id_etapa`),
  CONSTRAINT `sub_etapas_id_etapa_foreign` FOREIGN KEY (`id_etapa`) REFERENCES `etapas` (`id_etapa`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_etapas`
--

LOCK TABLES `sub_etapas` WRITE;
/*!40000 ALTER TABLE `sub_etapas` DISABLE KEYS */;
INSERT INTO `sub_etapas` VALUES (1,1,'Sub etapa 1',NULL,1,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(2,1,'Sub etapa 2',NULL,2,5,1,0,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(3,1,'Sub etapa 3',NULL,3,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(4,1,'Sub etapa 4',NULL,4,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(5,1,'Sub etapa 5',NULL,5,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(6,2,'Sub etapa 1',NULL,1,5,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(7,2,'Sub etapa 2',NULL,2,5,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(8,2,'Sub etapa 3',NULL,3,5,1,0,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(9,2,'Sub etapa 4',NULL,4,0,0,0,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(10,3,'Sub etapa 1',NULL,1,5,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(11,3,'Sub etapa 2',NULL,2,3,1,0,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(12,3,'Sub etapa 3',NULL,3,30,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(13,3,'Sub etapa 4',NULL,4,15,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(14,4,'Sub etapa 1',NULL,1,0,0,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(15,4,'Sub etapa 2',NULL,2,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(16,5,'Sub etapa 1',NULL,1,30,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(17,5,'Sub etapa 2',NULL,2,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(18,5,'Sub etapa 3',NULL,3,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(19,5,'Sub etapa 4',NULL,4,10,1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07'),(20,5,'Sub etapa 5 - Cierre del proceso',NULL,5,0,0,1,'2026-01-23 21:00:07','2026-01-23 21:00:07');
/*!40000 ALTER TABLE `sub_etapas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens_passwords`
--

DROP TABLE IF EXISTS `tokens_passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens_passwords` (
  `id_token` bigint unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_expiracion` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `id_usuario` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_token`),
  KEY `tokens_passwords_id_usuario_foreign` (`id_usuario`),
  CONSTRAINT `tokens_passwords_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens_passwords`
--

LOCK TABLES `tokens_passwords` WRITE;
/*!40000 ALTER TABLE `tokens_passwords` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens_passwords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_documento` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `id_rol` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuarios_correo_unique` (`correo`),
  UNIQUE KEY `usuarios_numero_documento_unique` (`numero_documento`),
  KEY `usuarios_id_rol_foreign` (`id_rol`),
  CONSTRAINT `usuarios_id_rol_foreign` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin CIACBLP','12345678','admin@ciacblp.com','$2y$12$9UUx/XhIanCorZI9nsGW2.1/qiM8Dby9gwcCJYKiPgjXW/ULoTHku','123456789',1,1,'2026-01-23 21:00:07','2026-01-23 21:00:07');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_expedientes`
--

DROP TABLE IF EXISTS `usuarios_expedientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_expedientes` (
  `id_usuario_expediente` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint unsigned NOT NULL,
  `id_expediente` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario_expediente`),
  KEY `usuarios_expedientes_id_usuario_foreign` (`id_usuario`),
  KEY `usuarios_expedientes_id_expediente_foreign` (`id_expediente`),
  CONSTRAINT `usuarios_expedientes_id_expediente_foreign` FOREIGN KEY (`id_expediente`) REFERENCES `expedientes` (`id_expediente`) ON DELETE CASCADE,
  CONSTRAINT `usuarios_expedientes_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_expedientes`
--

LOCK TABLES `usuarios_expedientes` WRITE;
/*!40000 ALTER TABLE `usuarios_expedientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_expedientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_mensajes`
--

DROP TABLE IF EXISTS `usuarios_mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_mensajes` (
  `id_usuario_mensaje` bigint unsigned NOT NULL AUTO_INCREMENT,
  `leido` tinyint(1) NOT NULL DEFAULT '0',
  `id_usuario` bigint unsigned NOT NULL,
  `id_mensaje` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario_mensaje`),
  KEY `usuarios_mensajes_id_usuario_foreign` (`id_usuario`),
  KEY `usuarios_mensajes_id_mensaje_foreign` (`id_mensaje`),
  CONSTRAINT `usuarios_mensajes_id_mensaje_foreign` FOREIGN KEY (`id_mensaje`) REFERENCES `mensajes` (`id_mensaje`) ON DELETE CASCADE,
  CONSTRAINT `usuarios_mensajes_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_mensajes`
--

LOCK TABLES `usuarios_mensajes` WRITE;
/*!40000 ALTER TABLE `usuarios_mensajes` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_solicitantes`
--

DROP TABLE IF EXISTS `usuarios_solicitantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_solicitantes` (
  `id_usuario_solicitante` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario_solicitante`),
  UNIQUE KEY `usuarios_solicitantes_numero_documento_unique` (`numero_documento`),
  UNIQUE KEY `usuarios_solicitantes_correo_unique` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_solicitantes`
--

LOCK TABLES `usuarios_solicitantes` WRITE;
/*!40000 ALTER TABLE `usuarios_solicitantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_solicitantes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-23 16:01:10
