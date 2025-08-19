-- Script para crear todas las tablas necesarias
-- Ejecutar en la base de datos jcancelo_barberia

-- Tabla de tatuadores (si no existe)
CREATE TABLE IF NOT EXISTS tatuadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    descripcion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    instagram VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de servicios (si no existe)
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion INT NOT NULL COMMENT 'Duración en minutos',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de reservas (si no existe)
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    servicio_id INT NOT NULL,
    tatuador_id INT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    notas TEXT,
    precio_total DECIMAL(10,2),
    descuento_aplicado DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (tatuador_id) REFERENCES tatuadores(id)
);

-- Sistema de Cupones y Descuentos
CREATE TABLE IF NOT EXISTS cupones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_descuento ENUM('porcentaje', 'monto_fijo') NOT NULL,
    valor_descuento DECIMAL(10,2) NOT NULL,
    monto_minimo DECIMAL(10,2) DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_expiracion DATE NOT NULL,
    usos_maximos INT DEFAULT NULL,
    usos_actuales INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    solo_primera_vez BOOLEAN DEFAULT FALSE,
    tatuador_especifico INT DEFAULT NULL,
    servicio_especifico INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tatuador_especifico) REFERENCES tatuadores(id) ON DELETE SET NULL,
    FOREIGN KEY (servicio_especifico) REFERENCES servicios(id) ON DELETE SET NULL
);

-- Tabla para rastrear el uso de cupones
CREATE TABLE IF NOT EXISTS cupones_usados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cupon_id INT NOT NULL,
    reserva_id INT NOT NULL,
    cliente_email VARCHAR(255),
    cliente_telefono VARCHAR(20),
    descuento_aplicado DECIMAL(10,2) NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE CASCADE,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cupones_codigo ON cupones(codigo);
CREATE INDEX IF NOT EXISTS idx_cupones_activo ON cupones(activo);
CREATE INDEX IF NOT EXISTS idx_cupones_fechas ON cupones(fecha_inicio, fecha_expiracion);
CREATE INDEX IF NOT EXISTS idx_cupones_usados_cupon ON cupones_usados(cupon_id);
CREATE INDEX IF NOT EXISTS idx_cupones_usados_email ON cupones_usados(cliente_email);

-- Datos de ejemplo para tatuadores
INSERT IGNORE INTO tatuadores (id, nombre, especialidad, descripcion, telefono, email, instagram, activo) VALUES
(1, 'Carlos Mendez', 'Realismo', 'Especialista en tatuajes realistas y retratos. Más de 10 años de experiencia.', '+54 11 1234-5678', 'carlos@equinocciostudio.com', '@carlos_tattoo', TRUE),
(2, 'Ana Rodriguez', 'Tradicional', 'Experta en tatuajes tradicionales y old school. Estilo único y colorido.', '+54 11 2345-6789', 'ana@equinocciostudio.com', '@ana_traditional', TRUE),
(3, 'Miguel Santos', 'Geométrico', 'Diseños geométricos y minimalistas. Precisión y arte en cada línea.', '+54 11 3456-7890', 'miguel@equinocciostudio.com', '@miguel_geometric', TRUE),
(4, 'Sofia Gutierrez', 'Acuarela', 'Tatuajes estilo acuarela y arte abstracto. Colores vibrantes y técnicas innovadoras.', '+54 11 4567-8901', 'sofia@equinocciostudio.com', '@sofia_watercolor', TRUE);

-- Datos de ejemplo para servicios
INSERT IGNORE INTO servicios (id, nombre, descripcion, precio, duracion, activo) VALUES
(1, 'Tatuaje Pequeño', 'Tatuajes de hasta 5cm', 5000.00, 60, TRUE),
(2, 'Tatuaje Mediano', 'Tatuajes de 5-15cm', 12000.00, 120, TRUE),
(3, 'Tatuaje Grande', 'Tatuajes de más de 15cm', 25000.00, 240, TRUE),
(4, 'Sesión de Retoque', 'Retoque de tatuajes existentes', 3000.00, 60, TRUE),
(5, 'Diseño Personalizado', 'Consulta y diseño personalizado', 2000.00, 30, TRUE);

-- Datos de ejemplo para cupones
INSERT IGNORE INTO cupones (codigo, nombre, descripcion, tipo_descuento, valor_descuento, monto_minimo, fecha_inicio, fecha_expiracion, usos_maximos, solo_primera_vez) VALUES
('BIENVENIDO20', 'Descuento de Bienvenida', 'Descuento del 20% para nuevos clientes', 'porcentaje', 20.00, 5000.00, '2024-01-01', '2024-12-31', NULL, TRUE),
('VERANO2024', 'Promoción de Verano', 'Descuento especial de temporada', 'porcentaje', 15.00, 3000.00, '2024-12-01', '2024-03-31', 100, FALSE),
('DESCUENTO500', 'Descuento Fijo', '$500 de descuento en cualquier servicio', 'monto_fijo', 500.00, 2000.00, '2024-01-01', '2024-12-31', 50, FALSE),
('AMIGO10', 'Descuento por Referido', '10% de descuento por traer un amigo', 'porcentaje', 10.00, 1000.00, '2024-01-01', '2024-12-31', NULL, FALSE);
