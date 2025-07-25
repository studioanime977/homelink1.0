-- =====================================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN HOMELINK
-- Base de datos y flujo de compras
-- =====================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `homelink` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `homelink`;

-- =====================================================
-- TABLA: usuarios
-- =====================================================
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` varchar(40) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar usuario de prueba
INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `foto`) VALUES
('0292f49f-591e-11f0-86ca-0a0027000010', 'ESTEBAN MANUEL LOPEZ RIVERO', 'studiootaku6@gmail.com', '$2b$10$5g1TEZYsVfvUzzNszL0tD.XR8UavPqYEDxxg/jlhDNQJmrIhr..Ia', NULL);

-- =====================================================
-- TABLA: productos
-- =====================================================
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar productos con nombres exactos del frontend
INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`) VALUES
(1, 'ASUS RT-AC86U', 'Wi-Fi Doble Banda AC2900, 4 puertos Gigabit LAN, USB 3.1 y USB 2.0, Soporte OpenVPN nativo, CPU Dual-Core 1.8GHz', 199.99, 10),
(2, 'TP-Link Archer C2300', 'Wi-Fi Dual Band AC2300, 4 puertos LAN Gigabit, USB 3.0 y USB 2.0, Soporte OpenVPN y PPTP, MU-MIMO + Beamforming', 179.99, 15),
(3, 'Cudy WR3000E', 'Wi-Fi Dual Band AC2300, 5 puertos LAN Gigabit, USB 3.0 y USB 2.0, WireGuard, OpenVPN, IPsec, Zerotier, PPTP y L2TP, MU-MIMO + Beamforming', 179.99, 20),
(4, 'Netgear X4S D7800', 'Wi-Fi AC2600 (hasta 2.53 Gbps), 4 puertos Gigabit LAN, USB 3.0, Compatible con OpenVPN, Procesador Dual-Core 1.4GHz', 249.99, 5);

-- =====================================================
-- TABLA: compras
-- =====================================================
DROP TABLE IF EXISTS `compras`;
CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` varchar(40) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `detalles` text DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_compras_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLA: detalle_compras
-- =====================================================
DROP TABLE IF EXISTS `detalle_compras`;
CREATE TABLE `detalle_compras` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `id_compra` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_compra` (`id_compra`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `fk_detalle_compra` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`) ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLA: metodos_pago
-- =====================================================
DROP TABLE IF EXISTS `metodos_pago`;
CREATE TABLE `metodos_pago` (
  `id_metodo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_metodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `metodos_pago` (`id_metodo`, `nombre`) VALUES
(1, 'Tarjeta Crédito'),
(2, 'Tarjeta Débito'),
(3, 'PayPal'),
(4, 'PSE');

-- =====================================================
-- TABLA: pagos
-- =====================================================
DROP TABLE IF EXISTS `pagos`;
CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_compra` int(11) NOT NULL,
  `id_metodo` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pago`),
  KEY `id_compra` (`id_compra`),
  KEY `id_metodo` (`id_metodo`),
  CONSTRAINT `fk_pago_compra` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`) ON DELETE CASCADE,
  CONSTRAINT `fk_pago_metodo` FOREIGN KEY (`id_metodo`) REFERENCES `metodos_pago` (`id_metodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLAS ADICIONALES PARA FUNCIONALIDADES FUTURAS
-- =====================================================

-- TABLA: dispositivos
DROP TABLE IF EXISTS `dispositivos`;
CREATE TABLE `dispositivos` (
  `id_dispositivo` varchar(40) NOT NULL,
  `id_usuario` varchar(40) NOT NULL,
  `modelo` varchar(40) NOT NULL,
  `tipo` varchar(40) NOT NULL,
  `sistema_operativo` varchar(40) NOT NULL,
  PRIMARY KEY (`id_dispositivo`),
  KEY `fk_disp_user` (`id_usuario`),
  CONSTRAINT `fk_disp_user` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TABLA: redes
DROP TABLE IF EXISTS `redes`;
CREATE TABLE `redes` (
  `id_red` varchar(40) NOT NULL,
  `nombre_red` varchar(40) NOT NULL,
  `contrasena` varchar(40) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL,
  PRIMARY KEY (`id_red`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TABLA: conexion_vpn
DROP TABLE IF EXISTS `conexion_vpn`;
CREATE TABLE `conexion_vpn` (
  `id_red` varchar(40) NOT NULL,
  `direccion_ip` varchar(40) NOT NULL,
  `consumo_datos` varchar(40) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL,
  PRIMARY KEY (`id_red`),
  UNIQUE KEY `uq_ip` (`direccion_ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TABLA: configuraciones
DROP TABLE IF EXISTS `configuraciones`;
CREATE TABLE `configuraciones` (
  `id_config` varchar(40) NOT NULL,
  `id_dispositivo` varchar(40) NOT NULL,
  `id_red` varchar(40) NOT NULL,
  `id_vpn` varchar(40) NOT NULL,
  `asignacion_automatica_dispositivos` varchar(40) NOT NULL,
  `generacion_de_configuracion` varchar(40) NOT NULL,
  `detencion_de_router` varchar(40) NOT NULL,
  PRIMARY KEY (`id_config`),
  KEY `fk_conf_disp` (`id_dispositivo`),
  KEY `fk_conf_red` (`id_red`),
  KEY `fk_conf_vpn` (`id_vpn`),
  CONSTRAINT `fk_conf_disp` FOREIGN KEY (`id_dispositivo`) REFERENCES `dispositivos` (`id_dispositivo`) ON DELETE CASCADE,
  CONSTRAINT `fk_conf_red` FOREIGN KEY (`id_red`) REFERENCES `redes` (`id_red`) ON DELETE CASCADE,
  CONSTRAINT `fk_conf_vpn` FOREIGN KEY (`id_vpn`) REFERENCES `conexion_vpn` (`id_red`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TABLA: usuario_redes
DROP TABLE IF EXISTS `usuario_redes`;
CREATE TABLE `usuario_redes` (
  `id_usuario` varchar(40) NOT NULL,
  `id_red` varchar(40) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_red`),
  KEY `fk_ur_red` (`id_red`),
  CONSTRAINT `fk_ur_red` FOREIGN KEY (`id_red`) REFERENCES `redes` (`id_red`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar todas las tablas creadas
SHOW TABLES;

-- Verificar productos
SELECT 'PRODUCTOS:' as info;
SELECT * FROM productos ORDER BY id_producto;

-- Verificar usuario
SELECT 'USUARIO:' as info;
SELECT id_usuario, nombre, correo FROM usuarios;

-- Verificar métodos de pago
SELECT 'MÉTODOS DE PAGO:' as info;
SELECT * FROM metodos_pago;

-- Verificar estructura de compras
SELECT 'ESTRUCTURA COMPRAS:' as info;
DESCRIBE compras;

-- Verificar estructura detalle_compras
SELECT 'ESTRUCTURA DETALLE_COMPRAS:' as info;
DESCRIBE detalle_compras;

-- =====================================================
-- FLUJO DE COMPRA - EXPLICACIÓN
-- =====================================================
/*
FLUJO COMPLETO DE COMPRA:

1. USUARIO SE REGISTRA/LOGUEA:
   - Se crea/verifica en tabla 'usuarios'
   - Se almacena sesión en localStorage del frontend

2. USUARIO AGREGA PRODUCTOS AL CARRITO:
   - Frontend almacena en localStorage
   - Productos deben existir en tabla 'productos' con nombres exactos

3. USUARIO VA A PAGAR:
   - Frontend envía POST a /comprar con:
     * userSession: {email, isLoggedIn}
     * cart: array de productos
     * datos: información personal

4. BACKEND PROCESA COMPRA:
   - Busca usuario por email en tabla 'usuarios'
   - Inserta compra en tabla 'compras'
   - Para cada producto del carrito:
     * Busca id_producto por nombre en tabla 'productos'
     * Inserta detalle en tabla 'detalle_compras'

5. USUARIO VE SUS COMPRAS:
   - Frontend envía POST a /miscompras
   - Backend consulta compras del usuario
   - Devuelve compras con productos asociados

PRODUCTOS DISPONIBLES:
- ASUS RT-AC86U ($199.99)
- TP-Link Archer C2300 ($179.99)
- Cudy WR3000E ($179.99)
- Netgear X4S D7800 ($249.99)
*/ 