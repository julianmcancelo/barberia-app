-- Complete database setup for jcancelo_barberia
-- Run this script to create all tables and initial data

USE jcancelo_barberia;

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS excepciones_horario;
DROP TABLE IF EXISTS horarios_disponibles;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS tatuadores;

-- Create tables
CREATE TABLE tatuadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    descripcion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT NOT NULL COMMENT 'Duration in minutes',
    precio DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token_reserva VARCHAR(50) UNIQUE NOT NULL,
    tatuador_id INT,
    servicio_id INT NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20),
    fecha_hora DATETIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tatuador_id) REFERENCES tatuadores(id) ON DELETE SET NULL,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
    
    INDEX idx_fecha_hora (fecha_hora),
    INDEX idx_tatuador_fecha (tatuador_id, fecha_hora),
    INDEX idx_token (token_reserva)
);

-- Insert initial data
INSERT INTO tatuadores (nombre, especialidad, descripcion, telefono, email) VALUES
('Carlos Mendoza', 'Realismo', 'Especialista en tatuajes realistas y retratos. 15 años de experiencia.', '+54 11 1234-5678', 'carlos@barberia.com'),
('Ana García', 'Traditional', 'Experta en tatuajes tradicionales y old school. Estilo único y colorido.', '+54 11 2345-6789', 'ana@barberia.com'),
('Miguel Torres', 'Blackwork', 'Maestro del blackwork y geometric. Diseños minimalistas y elegantes.', '+54 11 3456-7890', 'miguel@barberia.com'),
('Sofía Ruiz', 'Acuarela', 'Artista especializada en tatuajes estilo acuarela y diseños delicados.', '+54 11 4567-8901', 'sofia@barberia.com');

INSERT INTO servicios (nombre, descripcion, duracion, precio) VALUES
('Tatuaje Pequeño', 'Tatuajes de hasta 5cm. Ideal para primeros tatuajes o diseños minimalistas.', 60, 8000.00),
('Tatuaje Mediano', 'Tatuajes de 5-15cm. Perfecto para diseños con detalle moderado.', 120, 15000.00),
('Tatuaje Grande', 'Tatuajes de 15-25cm. Para diseños complejos y detallados.', 180, 25000.00),
('Sesión Completa', 'Sesión de 4-6 horas para tatuajes grandes o múltiples piezas.', 300, 40000.00),
('Retoque', 'Retoque de tatuajes existentes. Incluye pequeñas correcciones.', 45, 5000.00),
('Consulta y Diseño', 'Consulta personalizada y diseño custom. No incluye tatuaje.', 30, 3000.00);
