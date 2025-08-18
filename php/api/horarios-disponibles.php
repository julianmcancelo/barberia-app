<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json_response(['status' => 'ok']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json_response([
        'status' => 'error',
        'message' => 'Method Not Allowed'
    ], 405);
}

// Get parameters
$tatuador_id = $_GET['tatuador_id'] ?? null;
$fecha = $_GET['fecha'] ?? null;
$duracion = $_GET['duracion'] ?? 60;

if (!$tatuador_id || !$fecha) {
    send_json_response([
        'status' => 'error',
        'message' => 'Faltan parámetros requeridos: tatuador_id y fecha'
    ], 400);
}

// --- Database Connection ---
$host = '167.250.5.55';
$user = 'jcancelo_barberia';
$password = 'feelthesky1';
$database = 'jcancelo_barberia';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    send_json_response([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ], 500);
}

$conn->set_charset('utf8');

// Get existing reservations for this tattoo artist on this date
$query = "
    SELECT 
        r.fecha_hora,
        SUM(s.duracion) as duracion_total
    FROM reservas r
    LEFT JOIN reserva_servicios rs ON r.id = rs.reserva_id
    LEFT JOIN servicios s ON rs.servicio_id = s.id
    WHERE r.tatuador_id = ? 
    AND DATE(r.fecha_hora) = ? 
    AND r.estado IN ('pendiente', 'confirmada')
    GROUP BY r.id, r.fecha_hora
";

$stmt = $conn->prepare($query);
$stmt->bind_param('is', $tatuador_id, $fecha);
$stmt->execute();
$result = $stmt->get_result();

$reservas_existentes = [];
while ($row = $result->fetch_assoc()) {
    $inicio = new DateTime($row['fecha_hora']);
    $fin = clone $inicio;
    $fin->add(new DateInterval('PT' . $row['duracion_total'] . 'M'));
    
    $reservas_existentes[] = [
        'inicio' => $inicio,
        'fin' => $fin
    ];
}

// Generate available time slots (9 AM to 6 PM, every 30 minutes)
$horarios_disponibles = [];
$hora_inicio = 9; // 9 AM
$hora_fin = 18; // 6 PM

for ($hora = $hora_inicio; $hora < $hora_fin; $hora++) {
    for ($minuto = 0; $minuto < 60; $minuto += 30) {
        $hora_str = sprintf('%02d:%02d', $hora, $minuto);
        
        // Create datetime for this slot
        $slot_inicio = new DateTime($fecha . ' ' . $hora_str);
        $slot_fin = clone $slot_inicio;
        $slot_fin->add(new DateInterval('PT' . $duracion . 'M'));
        
        // Check if this slot conflicts with existing reservations
        $disponible = true;
        foreach ($reservas_existentes as $reserva) {
            // Check if slots overlap
            if (($slot_inicio < $reserva['fin']) && ($slot_fin > $reserva['inicio'])) {
                $disponible = false;
                break;
            }
        }
        
        // Only add if slot end time doesn't exceed business hours (6 PM)
        if ($slot_fin->format('H') <= 18) {
            $horarios_disponibles[] = [
                'hora' => $hora_str,
                'disponible' => $disponible
            ];
        }
    }
}

// Filter to only return available slots
$horarios_disponibles = array_filter($horarios_disponibles, function($horario) {
    return $horario['disponible'];
});

// Reset array keys
$horarios_disponibles = array_values($horarios_disponibles);

send_json_response([
    'status' => 'success',
    'data' => $horarios_disponibles
]);

$stmt->close();
$conn->close();
?>
