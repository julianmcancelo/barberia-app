-- Sistema de Cupones y Descuentos
-- Tabla para gestionar cupones de descuento

CREATE TABLE cupones (
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
CREATE TABLE cupones_usados (
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
CREATE INDEX idx_cupones_codigo ON cupones(codigo);
CREATE INDEX idx_cupones_activo ON cupones(activo);
CREATE INDEX idx_cupones_fechas ON cupones(fecha_inicio, fecha_expiracion);
CREATE INDEX idx_cupones_usados_cupon ON cupones_usados(cupon_id);
CREATE INDEX idx_cupones_usados_email ON cupones_usados(cliente_email);

-- Datos de ejemplo
INSERT INTO cupones (codigo, nombre, descripcion, tipo_descuento, valor_descuento, monto_minimo, fecha_inicio, fecha_expiracion, usos_maximos, solo_primera_vez) VALUES
('BIENVENIDO20', 'Descuento de Bienvenida', 'Descuento del 20% para nuevos clientes', 'porcentaje', 20.00, 5000.00, '2024-01-01', '2024-12-31', NULL, TRUE),
('VERANO2024', 'Promoción de Verano', 'Descuento especial de temporada', 'porcentaje', 15.00, 3000.00, '2024-12-01', '2024-03-31', 100, FALSE),
('DESCUENTO500', 'Descuento Fijo', '$500 de descuento en cualquier servicio', 'monto_fijo', 500.00, 2000.00, '2024-01-01', '2024-12-31', 50, FALSE),
('AMIGO10', 'Descuento por Referido', '10% de descuento por traer un amigo', 'porcentaje', 10.00, 1000.00, '2024-01-01', '2024-12-31', NULL, FALSE);
