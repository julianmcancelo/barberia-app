<?php
require_once '../db.php';

header('Content-Type: application/json');

$conn = getDbConnection();

// Obtener parámetros
$fecha = $_GET['fecha'] ?? date('Y-m-d');
$tatuador_id = $_GET['tatuador_id'] ?? null;
$duracion = $_GET['duracion'] ?? 60;

// Generar horarios disponibles para la fecha especificada
$horarios = [];

// Horarios base de 10:00 a 18:00 cada 30 minutos
$hora_inicio = 10;
$hora_fin = 18;

for ($hora = $hora_inicio; $hora < $hora_fin; $hora++) {
    for ($minuto = 0; $minuto < 60; $minuto += 30) {
        $hora_str = sprintf('%02d:%02d:00', $hora, $minuto);
        
        // Verificar si ya hay una reserva en este horario
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM reservas WHERE DATE(fecha_hora) = ? AND TIME(fecha_hora) = ? AND estado != 'cancelada'");
        $stmt->bind_param("ss", $fecha, $hora_str);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];
        
        $disponible = $count == 0;
        
        $horarios[] = [
            'hora' => $fecha . ' ' . $hora_str,
            'disponible' => $disponible
        ];
    }
}

$conn->close();

echo json_encode($horarios);
?>
