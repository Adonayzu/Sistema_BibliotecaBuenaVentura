-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: biblioteca_buena_ventura
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave primaria de la tabla cliente',
  `nombre` varchar(200) NOT NULL COMMENT 'Nombres del cliente',
  `apellido` varchar(200) NOT NULL COMMENT 'Apellidos del cliente',
  `correo` varchar(250) NOT NULL COMMENT 'Correo electrónico del cliente',
  `numero_identificacion` int(13) NOT NULL COMMENT 'Número de identificación único',
  `telefono` int(8) NOT NULL COMMENT 'Teléfono del cliente',
  `direccion` varchar(300) NOT NULL COMMENT 'Dirección del cliente',
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha de registro del cliente',
  `id_tipo_estado` int(11) NOT NULL DEFAULT 5 COMMENT 'Llave foránea a la tabla de estado',
  `id_estado` int(11) NOT NULL DEFAULT 1 COMMENT 'Llave foránea a la tabla de estado',
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `numero_identificacion` (`numero_identificacion`),
  KEY `id_estado` (`id_estado`,`id_tipo_estado`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_estado`, `id_tipo_estado`) REFERENCES `estado` (`id_estado`, `id_tipo_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla de clientes que pueden solicitar préstamos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado`
--

DROP TABLE IF EXISTS `estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado` (
  `id_estado` int(11) NOT NULL COMMENT 'Llave primaria',
  `id_tipo_estado` int(11) NOT NULL COMMENT 'Llave foranea a la tabla de tipo estado',
  `nombre_estado` varchar(200) NOT NULL COMMENT 'Nombre de estado',
  PRIMARY KEY (`id_estado`,`id_tipo_estado`),
  KEY `id_tipo_estado` (`id_tipo_estado`),
  CONSTRAINT `estado_ibfk_1` FOREIGN KEY (`id_tipo_estado`) REFERENCES `tipo_estado` (`id_tipo_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla que maneja los estados de cada tabla';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado`
--

LOCK TABLES `estado` WRITE;
/*!40000 ALTER TABLE `estado` DISABLE KEYS */;
INSERT INTO `estado` VALUES (0,1,'INACTIVO'),(0,2,'INACTIVO'),(0,3,'INACTIVO'),(0,4,'INACTIVO'),(0,5,'INACTIVO'),(0,6,'CANCELADO'),(1,1,'ACTIVO'),(1,2,'ACTIVO'),(1,3,'ACTIVO'),(1,4,'ACTIVO'),(1,5,'ACTIVO'),(1,6,'ACTIVO'),(2,6,'DEVUELTO');
/*!40000 ALTER TABLE `estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libro`
--

DROP TABLE IF EXISTS `libro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libro` (
  `id_libro` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave primaria de la tabla libro',
  `titulo` varchar(300) NOT NULL COMMENT 'Título del libro',
  `isbn` varchar(13) NOT NULL COMMENT 'ISBN único del libro',
  `anio_publicacion` year(4) NOT NULL COMMENT 'Año de publicación del libro',
  `nombre_autor` varchar(200) NOT NULL COMMENT 'Nombre completo del autor',
  `nombre_editorial` varchar(200) NOT NULL COMMENT 'Nombre de la editorial',
  `cantidad_disponible` int(11) NOT NULL DEFAULT 0 COMMENT 'Cantidad disponible para préstamo',
  `cantidad_total` int(11) NOT NULL DEFAULT 0 COMMENT 'Cantidad total de ejemplares',
  `id_tipo_estado` int(11) NOT NULL DEFAULT 4 COMMENT 'Llave foránea a la tabla de estado',
  `id_estado` int(11) NOT NULL DEFAULT 1 COMMENT 'Llave foránea a la tabla de estado',
  PRIMARY KEY (`id_libro`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `id_estado` (`id_estado`,`id_tipo_estado`),
  CONSTRAINT `libro_ibfk_1` FOREIGN KEY (`id_estado`, `id_tipo_estado`) REFERENCES `estado` (`id_estado`, `id_tipo_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla principal de libros de la biblioteca';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libro`
--

LOCK TABLES `libro` WRITE;
/*!40000 ALTER TABLE `libro` DISABLE KEYS */;
/*!40000 ALTER TABLE `libro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_navegacion`
--

DROP TABLE IF EXISTS `menu_navegacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_navegacion` (
  `id_menu_navegacion` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave foránea de la tabla menu_navegacion',
  `nombre_menu_navegacion` varchar(200) NOT NULL COMMENT 'Nombre de menu a seleccionar',
  `url_menu` varchar(50) NOT NULL COMMENT 'La url del menu',
  `id_modulo` int(11) NOT NULL COMMENT 'Llave foránea a la tabla de modulos',
  `id_tipo_estado` int(11) NOT NULL DEFAULT 2 COMMENT 'Llave foranea a la tabla de estado',
  `id_estado` int(11) NOT NULL DEFAULT 1 COMMENT 'Llave foranea a la tabla de estado',
  PRIMARY KEY (`id_menu_navegacion`),
  KEY `id_modulo` (`id_modulo`),
  KEY `menu_navegacion_estado_FK` (`id_estado`,`id_tipo_estado`),
  CONSTRAINT `menu_navegacion_estado_FK` FOREIGN KEY (`id_estado`, `id_tipo_estado`) REFERENCES `estado` (`id_estado`, `id_tipo_estado`) ON UPDATE CASCADE,
  CONSTRAINT `menu_navegacion_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla que contiene los menus de la interfaz de usuario';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_navegacion`
--

LOCK TABLES `menu_navegacion` WRITE;
/*!40000 ALTER TABLE `menu_navegacion` DISABLE KEYS */;
INSERT INTO `menu_navegacion` VALUES (1,'Gestión De Usuarios','/usuarios',1,2,1),(2,'Gestión De Roles','/roles',1,2,1),(3,'Gestión De Libros','/libros',2,2,1),(4,'Gestión De Clientes','/clientes',2,2,1),(5,'Gestión De Prestamos','/prestamos',2,2,1),(6,'Resportes','/reportes',2,2,1);
/*!40000 ALTER TABLE `menu_navegacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulo` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave primaria',
  `nombre_modulo` varchar(200) NOT NULL COMMENT 'Nombre del modulo',
  PRIMARY KEY (`id_modulo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla que contiene los nombres de los modulos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
INSERT INTO `modulo` VALUES (1,'CONFIGURACIÓN'),(2,'CONTROL DE BIBLIOTECA');
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamo`
--

DROP TABLE IF EXISTS `prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamo` (
  `id_prestamo` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave primaria de la tabla prestamo',
  `id_cliente` int(11) NOT NULL COMMENT 'Llave foránea a la tabla de cliente',
  `id_libro` int(11) NOT NULL COMMENT 'Llave foránea a la tabla de libro',
  `fecha_prestamo` date NOT NULL COMMENT 'Fecha del préstamo',
  `fecha_devolucion` date DEFAULT NULL COMMENT 'Fecha de devolución del libro',
  `observaciones` varchar(500) NOT NULL COMMENT 'Anotaciones de la devolución del libro',
  `id_tipo_estado` int(11) NOT NULL DEFAULT 6 COMMENT 'Llave foránea a la tabla de estado',
  `id_estado` int(11) NOT NULL DEFAULT 1 COMMENT 'Llave foránea a la tabla de estado (1=ACTIVO, 2=DEVUELTO, 3=VENCIDO)',
  PRIMARY KEY (`id_prestamo`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_libro` (`id_libro`),
  KEY `id_estado` (`id_estado`,`id_tipo_estado`),
  CONSTRAINT `prestamo_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `prestamo_ibfk_2` FOREIGN KEY (`id_libro`) REFERENCES `libro` (`id_libro`),
  CONSTRAINT `prestamo_ibfk_3` FOREIGN KEY (`id_estado`, `id_tipo_estado`) REFERENCES `estado` (`id_estado`, `id_tipo_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla de préstamos de libros';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamo`
--

LOCK TABLES `prestamo` WRITE;
/*!40000 ALTER TABLE `prestamo` DISABLE KEYS */;
/*!40000 ALTER TABLE `prestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave primaria de la tabla',
  `id_usuario` int(11) NOT NULL COMMENT 'Llave foránea a la tabla de usuario',
  `id_menu_navegacion` int(11) NOT NULL COMMENT 'Llave foránea a la tabla de menu_navegacion',
  `id_tipo_estado` int(11) NOT NULL DEFAULT 3 COMMENT 'LLave foranea a la tabla de estado',
  `id_estado` int(11) NOT NULL DEFAULT 1 COMMENT 'Llave foranea a la tabla de estado',
  PRIMARY KEY (`id_rol`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_menu_navegacion` (`id_menu_navegacion`),
  KEY `roles_estado_FK` (`id_estado`,`id_tipo_estado`),
  CONSTRAINT `roles_estado_FK` FOREIGN KEY (`id_estado`, `id_tipo_estado`) REFERENCES `estado` (`id_estado`, `id_tipo_estado`) ON UPDATE CASCADE,
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `roles_ibfk_2` FOREIGN KEY (`id_menu_navegacion`) REFERENCES `menu_navegacion` (`id_menu_navegacion`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla que contiene el listado de roles del sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,1,1,3,1),(2,1,2,3,1),(3,1,3,3,1),(4,1,4,3,1),(5,1,5,3,1),(6,1,6,3,1),(7,2,3,3,1),(8,2,4,3,1),(9,2,5,3,1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_estado`
--

DROP TABLE IF EXISTS `tipo_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_estado` (
  `id_tipo_estado` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave primaria de la tabla tipo_estado',
  `nombre_tipo_estado` varchar(200) NOT NULL COMMENT 'Nombre del tipo de estado',
  PRIMARY KEY (`id_tipo_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla que contiene el listado de tablas para asignarle los estados';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_estado`
--

LOCK TABLES `tipo_estado` WRITE;
/*!40000 ALTER TABLE `tipo_estado` DISABLE KEYS */;
INSERT INTO `tipo_estado` VALUES (1,'USUARIO'),(2,'MENU_NAVEGACION'),(3,'ROLES'),(4,'LIBRO'),(5,'CLIENTE'),(6,'PRESTAMO');
/*!40000 ALTER TABLE `tipo_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Llave primaria de la tabla de usuario',
  `usuario` varchar(200) NOT NULL COMMENT 'Usuario de la persona que utilizara el sistema',
  `clave` varchar(200) NOT NULL COMMENT 'Clave o contraseña del usuario',
  `id_tipo_estado` int(11) NOT NULL DEFAULT 1 COMMENT 'Llave foranea a la tabla de estado',
  `id_estado` int(11) NOT NULL DEFAULT 1 COMMENT 'Llave foranea a la tabla de estado',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `usuario_estado_FK` (`id_estado`,`id_tipo_estado`),
  CONSTRAINT `usuario_estado_FK` FOREIGN KEY (`id_estado`, `id_tipo_estado`) REFERENCES `estado` (`id_estado`, `id_tipo_estado`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Tabla del listado de usuarios que pueden ingresar al sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'adonay','$2a$12$r.Kry4U..9xk.81CX5bqN.N.gOO6j1ytXZtfvzkytyNlvBMTd57Pq',1,1),(2,'oscar','$2a$12$Tzx4lAr6.mAKW1KKkdIOfuUGyRdoK75wRA5Uz4LW9WQERIZ8uT/3K',1,1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'biblioteca_buena_ventura'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 10:17:55
