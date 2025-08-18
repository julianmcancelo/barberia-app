-- Sample data for testing the tattoo reservation system
-- Run this AFTER creating the schema and migration

-- Insert sample tattoo artists
INSERT INTO tatuadores (nombre, especialidad, descripcion, telefono, email, activo) VALUES
('Carlos Mendoza', 'Realismo', 'Especialista en tatuajes realistas y retratos. 10 años de experiencia.', '+54 11 1234-5678', 'carlos@barberia.com', TRUE),
('Ana Rodriguez', 'Traditional', 'Experta en tatuajes tradicionales y old school. Estilo único y colorido.', '+54 11 2345-6789', 'ana@barberia.com', TRUE),
('Miguel Santos', 'Blackwork', 'Maestro del blackwork y dotwork. Diseños geométricos y tribales.', '+54 11 3456-7890', 'miguel@barberia.com', TRUE),
('Sofia Martinez', 'Acuarela', 'Artista especializada en tatuajes estilo acuarela y minimalistas.', '+54 11 4567-8901', 'sofia@barberia.com', TRUE);

-- Insert sample services
INSERT INTO servicios (nombre, descripcion, duracion, precio, activo) VALUES
('Tatuaje Pequeño', 'Tatuaje de hasta 5cm. Ideal para primeros tatuajes o diseños simples.', 60, 8000.00, TRUE),
('Tatuaje Mediano', 'Tatuaje de 5-15cm. Perfecto para diseños con detalle moderado.', 120, 15000.00, TRUE),
('Tatuaje Grande', 'Tatuaje de 15-25cm. Para diseños complejos y detallados.', 180, 25000.00, TRUE),
('Sesión Completa', 'Sesión de tatuaje de día completo. Hasta 6 horas de trabajo.', 360, 45000.00, TRUE),
('Retoque', 'Retoque de tatuaje existente. Incluye pequeñas correcciones.', 45, 5000.00, TRUE),
('Consulta y Diseño', 'Consulta personalizada y diseño del tatuaje. No incluye tatuado.', 30, 3000.00, TRUE),
('Cover Up', 'Tatuaje para cubrir otro tatuaje existente. Requiere consulta previa.', 240, 35000.00, TRUE);

-- Insert sample reservations
INSERT INTO reservas (token_reserva, tatuador_id, nombre_completo, email, whatsapp, fecha_hora, estado, notas) VALUES
('RES-2025-00001', 1, 'Juan Pérez', 'juan.perez@email.com', '+54 9 11 1111-1111', '2025-08-20 10:00:00', 'confirmada', 'Primera sesión de tatuaje realista en brazo'),
('RES-2025-00002', 2, 'María García', 'maria.garcia@email.com', '+54 9 11 2222-2222', '2025-08-21 14:00:00', 'pendiente', 'Tatuaje tradicional de rosa en antebrazo'),
('RES-2025-00003', 3, 'Pedro López', 'pedro.lopez@email.com', '+54 9 11 3333-3333', '2025-08-22 09:00:00', 'confirmada', 'Diseño geométrico en hombro'),
('RES-2025-00004', 4, 'Laura Fernández', 'laura.fernandez@email.com', '+54 9 11 4444-4444', '2025-08-23 16:00:00', 'pendiente', 'Tatuaje minimalista en muñeca'),
('RES-2025-00005', 1, 'Diego Morales', 'diego.morales@email.com', '+54 9 11 5555-5555', '2025-08-24 11:00:00', 'confirmada', 'Sesión completa para sleeve');

-- Insert services for each reservation (using the new reserva_servicios table)
INSERT INTO reserva_servicios (reserva_id, servicio_id) VALUES
-- Juan Pérez: Tatuaje Grande + Consulta
(1, 3), (1, 6),
-- María García: Tatuaje Mediano
(2, 2),
-- Pedro López: Tatuaje Grande
(3, 3),
-- Laura Fernández: Tatuaje Pequeño + Consulta
(4, 1), (4, 6),
-- Diego Morales: Sesión Completa
(5, 4);

-- Insert available schedules for tattoo artists (Monday to Friday, 9 AM to 6 PM)
INSERT INTO horarios_disponibles (tatuador_id, dia_semana, hora_inicio, hora_fin, activo) VALUES
-- Carlos Mendoza (ID: 1)
(1, 1, '09:00:00', '18:00:00', TRUE), -- Monday
(1, 2, '09:00:00', '18:00:00', TRUE), -- Tuesday
(1, 3, '09:00:00', '18:00:00', TRUE), -- Wednesday
(1, 4, '09:00:00', '18:00:00', TRUE), -- Thursday
(1, 5, '09:00:00', '18:00:00', TRUE), -- Friday

-- Ana Rodriguez (ID: 2)
(2, 1, '10:00:00', '19:00:00', TRUE), -- Monday
(2, 2, '10:00:00', '19:00:00', TRUE), -- Tuesday
(2, 3, '10:00:00', '19:00:00', TRUE), -- Wednesday
(2, 4, '10:00:00', '19:00:00', TRUE), -- Thursday
(2, 5, '10:00:00', '19:00:00', TRUE), -- Friday
(2, 6, '11:00:00', '16:00:00', TRUE), -- Saturday

-- Miguel Santos (ID: 3)
(3, 2, '09:00:00', '17:00:00', TRUE), -- Tuesday
(3, 3, '09:00:00', '17:00:00', TRUE), -- Wednesday
(3, 4, '09:00:00', '17:00:00', TRUE), -- Thursday
(3, 5, '09:00:00', '17:00:00', TRUE), -- Friday
(3, 6, '10:00:00', '15:00:00', TRUE), -- Saturday

-- Sofia Martinez (ID: 4)
(4, 1, '11:00:00', '20:00:00', TRUE), -- Monday
(4, 3, '11:00:00', '20:00:00', TRUE), -- Wednesday
(4, 4, '11:00:00', '20:00:00', TRUE), -- Thursday
(4, 5, '11:00:00', '20:00:00', TRUE), -- Friday
(4, 6, '12:00:00', '18:00:00', TRUE); -- Saturday

-- Insert some schedule exceptions (holidays, vacations, etc.)
INSERT INTO excepciones_horario (tatuador_id, fecha, tipo, motivo) VALUES
(1, '2025-08-25', 'no_disponible', 'Vacaciones de verano'),
(2, '2025-09-01', 'no_disponible', 'Día feriado'),
(3, '2025-08-30', 'no_disponible', 'Conferencia de tatuajes'),
(4, '2025-09-15', 'horario_especial', 'Evento especial - horario reducido');

-- Verify data insertion
SELECT 'Tatuadores insertados:' as info, COUNT(*) as cantidad FROM tatuadores;
SELECT 'Servicios insertados:' as info, COUNT(*) as cantidad FROM servicios;
SELECT 'Reservas insertadas:' as info, COUNT(*) as cantidad FROM reservas;
SELECT 'Servicios por reserva:' as info, COUNT(*) as cantidad FROM reserva_servicios;
SELECT 'Horarios disponibles:' as info, COUNT(*) as cantidad FROM horarios_disponibles;
SELECT 'Excepciones de horario:' as info, COUNT(*) as cantidad FROM excepciones_horario;
