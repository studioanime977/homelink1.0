-- --------------------------------------------------------
-- Esquema completo para la base de datos `homelink`
-- --------------------------------------------------------
DROP DATABASE IF EXISTS `homelink`;
CREATE DATABASE `homelink` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `homelink`;

-- --------------------------------------------------------
-- Tabla: usuarios
-- --------------------------------------------------------
CREATE TABLE `usuarios` (
  `id_usuario` VARCHAR(40) NOT NULL,
  `nombre`     VARCHAR(100) NOT NULL,
  `correo`     VARCHAR(100) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_correo` (`correo`)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Tabla: productos
-- --------------------------------------------------------
CREATE TABLE `productos` (
  `id_producto`   INT AUTO_INCREMENT PRIMARY KEY,
  `nombre`        VARCHAR(100) NOT NULL,
  `descripcion`   TEXT,
  `precio`        DECIMAL(10,2) NOT NULL,
  `stock`         INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Tabla: compras (cabecera)
-- --------------------------------------------------------
CREATE TABLE `compras` (
  `id_compra`   INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario`  VARCHAR(40) NOT NULL,
  `total`       DECIMAL(10,2) NOT NULL,
  `fecha`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (`id_usuario`),
  CONSTRAINT `fk_compras_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Tabla: detalle_compras (líneas de pedido)
-- --------------------------------------------------------
CREATE TABLE `detalle_compras` (
  `id_detalle`   INT AUTO_INCREMENT PRIMARY KEY,
  `id_compra`    INT NOT NULL,
  `id_producto`  INT NOT NULL,
  `cantidad`     INT NOT NULL,
  `precio_unit`  DECIMAL(10,2) NOT NULL,
  INDEX (`id_compra`),
  INDEX (`id_producto`),
  CONSTRAINT `fk_detalle_compra`
    FOREIGN KEY (`id_compra`)
    REFERENCES `compras` (`id_compra`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Tabla: metodos_pago
-- --------------------------------------------------------
CREATE TABLE `metodos_pago` (
  `id_metodo`    INT AUTO_INCREMENT PRIMARY KEY,
  `nombre`       VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

INSERT INTO `metodos_pago` (`nombre`) VALUES
  ('Tarjeta Crédito'),
  ('Tarjeta Débito'),
  ('PayPal'),
  ('PSE');

-- --------------------------------------------------------
-- Tabla: pagos
-- --------------------------------------------------------
CREATE TABLE `pagos` (
  `id_pago`      INT AUTO_INCREMENT PRIMARY KEY,
  `id_compra`    INT NOT NULL,
  `id_metodo`    INT NOT NULL,
  `monto`        DECIMAL(10,2) NOT NULL,
  `fecha`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (`id_compra`),
  INDEX (`id_metodo`),
  CONSTRAINT `fk_pago_compra`
    FOREIGN KEY (`id_compra`)
    REFERENCES `compras` (`id_compra`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_pago_metodo`
    FOREIGN KEY (`id_metodo`)
    REFERENCES `metodos_pago` (`id_metodo`)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Tablas originales de configuración y VPN
-- --------------------------------------------------------
CREATE TABLE `conexion_vpn` (
  `id_red` VARCHAR(40) NOT NULL,
  `direccion_ip` VARCHAR(40) NOT NULL,
  `consumo_datos` VARCHAR(40) NOT NULL,
  `estado` ENUM('Activo','Inactivo') NOT NULL,
  PRIMARY KEY (`id_red`),
  UNIQUE KEY `uq_ip` (`direccion_ip`)
) ENGINE=InnoDB;

CREATE TABLE `redes` (
  `id_red` VARCHAR(40) NOT NULL,
  `nombre_red` VARCHAR(40) NOT NULL,
  `contrasena` VARCHAR(40) NOT NULL,
  `estado` ENUM('Activo','Inactivo') NOT NULL,
  PRIMARY KEY (`id_red`)
) ENGINE=InnoDB;

CREATE TABLE `configuraciones` (
  `id_config` VARCHAR(40) NOT NULL,
  `id_dispositivo` VARCHAR(40) NOT NULL,
  `id_red` VARCHAR(40) NOT NULL,
  `id_vpn` VARCHAR(40) NOT NULL,
  `asignacion_automatica_dispositivos` VARCHAR(40) NOT NULL,
  `generacion_de_configuracion` VARCHAR(40) NOT NULL,
  `detencion_de_router` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id_config`)
) ENGINE=InnoDB;

CREATE TABLE `dispositivos` (
  `id_dispositivo` VARCHAR(40) NOT NULL,
  `id_usuario` VARCHAR(40) NOT NULL,
  `modelo` VARCHAR(40) NOT NULL,
  `tipo` VARCHAR(40) NOT NULL,
  `sistema_operativo` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id_dispositivo`)
) ENGINE=InnoDB;

CREATE TABLE `usuario_redes` (
  `id_usuario` VARCHAR(40) NOT NULL,
  `id_red` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_red`)
) ENGINE=InnoDB;

ALTER TABLE `configuraciones`
  ADD CONSTRAINT `fk_conf_disp`
    FOREIGN KEY (`id_dispositivo`)
    REFERENCES `dispositivos` (`id_dispositivo`)
    ON DELETE CASCADE,
  ADD CONSTRAINT `fk_conf_red`
    FOREIGN KEY (`id_red`)
    REFERENCES `redes` (`id_red`)
    ON DELETE CASCADE,
  ADD CONSTRAINT `fk_conf_vpn`
    FOREIGN KEY (`id_vpn`)
    REFERENCES `conexion_vpn` (`id_red`)
    ON DELETE CASCADE;

ALTER TABLE `dispositivos`
  ADD CONSTRAINT `fk_disp_user`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`)
    ON DELETE CASCADE;

ALTER TABLE `usuario_redes`
  ADD CONSTRAINT `fk_ur_user`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`)
    ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ur_red`
    FOREIGN KEY (`id_red`)
    REFERENCES `redes` (`id_red`)
    ON DELETE CASCADE;

COMMIT;
