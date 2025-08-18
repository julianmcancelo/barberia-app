-- Database schema for Tattoo Reservation System
-- Created: 2025-08-17

-- Create database (uncomment if needed)
-- CREATE DATABASE barberia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE barberia_db;

-- Table: tatuadores (Tattoo Artists)
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

-- Table: servicios (Services)
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

-- Table: reservas (Reservations)
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token_reserva VARCHAR(50) UNIQUE NOT NULL,
    tatuador_id INT,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20),
    fecha_hora DATETIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tatuador_id) REFERENCES tatuadores(id) ON DELETE SET NULL,
    
    INDEX idx_fecha_hora (fecha_hora),
    INDEX idx_tatuador_fecha (tatuador_id, fecha_hora),
    INDEX idx_token (token_reserva)
);

-- Table: reserva_servicios (Reservation Services - Many to Many)
CREATE TABLE reserva_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    servicio_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_reserva_servicio (reserva_id, servicio_id),
    INDEX idx_reserva (reserva_id),
    INDEX idx_servicio (servicio_id)
);

-- Table: horarios_disponibles (Available Time Slots)
CREATE TABLE horarios_disponibles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tatuador_id INT,
    dia_semana TINYINT NOT NULL COMMENT '0=Sunday, 1=Monday, ..., 6=Saturday',
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (tatuador_id) REFERENCES tatuadores(id) ON DELETE CASCADE,
    
    INDEX idx_tatuador_dia (tatuador_id, dia_semana)
);

-- Table: excepciones_horario (Schedule Exceptions)
CREATE TABLE excepciones_horario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tatuador_id INT,
    fecha DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    tipo ENUM('no_disponible', 'horario_especial') NOT NULL,
    motivo VARCHAR(200),
    
    FOREIGN KEY (tatuador_id) REFERENCES tatuadores(id) ON DELETE CASCADE,
    
    INDEX idx_tatuador_fecha (tatuador_id, fecha)
);
