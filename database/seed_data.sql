-- Initial data for Tattoo Reservation System
-- Created: 2025-08-17

-- Insert sample tattoo artists
INSERT INTO tatuadores (nombre, especialidad, descripcion, telefono, email) VALUES
('Carlos Mendoza', 'Realismo', 'Especialista en tatuajes realistas y retratos. 15 años de experiencia.', '+54 11 1234-5678', 'carlos@barberia.com'),
('Ana García', 'Traditional', 'Experta en tatuajes tradicionales y old school. Estilo único y colorido.', '+54 11 2345-6789', 'ana@barberia.com'),
('Miguel Torres', 'Blackwork', 'Maestro del blackwork y geometric. Diseños minimalistas y elegantes.', '+54 11 3456-7890', 'miguel@barberia.com'),
('Sofía Ruiz', 'Acuarela', 'Artista especializada en tatuajes estilo acuarela y diseños delicados.', '+54 11 4567-8901', 'sofia@barberia.com');

-- Insert sample services
INSERT INTO servicios (nombre, descripcion, duracion, precio) VALUES
('Tatuaje Pequeño', 'Tatuajes de hasta 5cm. Ideal para primeros tatuajes o diseños minimalistas.', 60, 8000.00),
('Tatuaje Mediano', 'Tatuajes de 5-15cm. Perfecto para diseños con detalle moderado.', 120, 15000.00),
('Tatuaje Grande', 'Tatuajes de 15-25cm. Para diseños complejos y detallados.', 180, 25000.00),
('Sesión Completa', 'Sesión de 4-6 horas para tatuajes grandes o múltiples piezas.', 300, 40000.00),
('Retoque', 'Retoque de tatuajes existentes. Incluye pequeñas correcciones.', 45, 5000.00),
('Consulta y Diseño', 'Consulta personalizada y diseño custom. No incluye tatuaje.', 30, 3000.00);

-- Insert default working hours (Monday to Friday, 10:00 - 18:00)
INSERT INTO horarios_disponibles (tatuador_id, dia_semana, hora_inicio, hora_fin) VALUES
-- Carlos Mendoza (ID: 1)
(1, 1, '10:00:00', '18:00:00'), -- Monday
(1, 2, '10:00:00', '18:00:00'), -- Tuesday
(1, 3, '10:00:00', '18:00:00'), -- Wednesday
(1, 4, '10:00:00', '18:00:00'), -- Thursday
(1, 5, '10:00:00', '18:00:00'), -- Friday
(1, 6, '10:00:00', '16:00:00'), -- Saturday

-- Ana García (ID: 2)
(2, 1, '11:00:00', '19:00:00'), -- Monday
(2, 2, '11:00:00', '19:00:00'), -- Tuesday
(2, 3, '11:00:00', '19:00:00'), -- Wednesday
(2, 4, '11:00:00', '19:00:00'), -- Thursday
(2, 5, '11:00:00', '19:00:00'), -- Friday

-- Miguel Torres (ID: 3)
(3, 2, '09:00:00', '17:00:00'), -- Tuesday
(3, 3, '09:00:00', '17:00:00'), -- Wednesday
(3, 4, '09:00:00', '17:00:00'), -- Thursday
(3, 5, '09:00:00', '17:00:00'), -- Friday
(3, 6, '09:00:00', '15:00:00'), -- Saturday

-- Sofía Ruiz (ID: 4)
(4, 1, '12:00:00', '20:00:00'), -- Monday
(4, 3, '12:00:00', '20:00:00'), -- Wednesday
(4, 4, '12:00:00', '20:00:00'), -- Thursday
(4, 5, '12:00:00', '20:00:00'), -- Friday
(4, 6, '12:00:00', '18:00:00'); -- Saturday

-- Insert some sample reservations for testing
INSERT INTO reservas (token_reserva, tatuador_id, servicio_id, nombre_completo, email, whatsapp, fecha_hora, estado) VALUES
('RES-2025-001', 1, 2, 'Juan Pérez', 'juan.perez@email.com', '+54 11 9876-5432', '2025-08-20 14:00:00', 'confirmada'),
('RES-2025-002', 2, 1, 'María González', 'maria.gonzalez@email.com', '+54 11 8765-4321', '2025-08-21 16:00:00', 'pendiente'),
('RES-2025-003', 3, 3, 'Pedro Rodríguez', 'pedro.rodriguez@email.com', '+54 11 7654-3210', '2025-08-22 10:00:00', 'confirmada');
