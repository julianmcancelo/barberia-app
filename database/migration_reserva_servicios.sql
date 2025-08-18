-- Migration to add reserva_servicios table for multiple services per reservation
-- Run this AFTER the existing schema

-- Create the new table for reservation services
CREATE TABLE IF NOT EXISTS reserva_servicios (
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

-- Remove the servicio_id column from reservas table (if it exists)
-- ALTER TABLE reservas DROP COLUMN servicio_id;
-- Note: Uncomment the above line only if you want to remove the old servicio_id column
