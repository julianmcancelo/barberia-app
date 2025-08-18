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

// Handle POST requests for updating reservation status
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input['action'] === 'update_estado') {
        $reserva_id = $input['reserva_id'] ?? 0;
        $nuevo_estado = $input['estado'] ?? '';
        
        if (!$reserva_id || !$nuevo_estado) {
            send_json_response([
                'status' => 'error',
                'message' => 'Faltan parámetros requeridos'
            ], 400);
        }
        
        // Database connection
        $host = '167.250.5.55';
        $user = 'jcancelo_barberia';
        $password = 'feelthesky1';
        $database = 'jcancelo_barberia';
        
        $conn = new mysqli($host, $user, $password, $database);
        
        if ($conn->connect_error) {
            send_json_response([
                'status' => 'error',
                'message' => 'Database connection failed'
            ], 500);
        }
        
        $conn->set_charset('utf8');
        
        $stmt = $conn->prepare('UPDATE reservas SET estado = ? WHERE id = ?');
        $stmt->bind_param('si', $nuevo_estado, $reserva_id);
        
        if ($stmt->execute()) {
            send_json_response([
                'status' => 'success',
                'message' => 'Estado actualizado correctamente'
            ]);
        } else {
            send_json_response([
                'status' => 'error',
                'message' => 'Error al actualizar el estado'
            ], 500);
        }
        
        $stmt->close();
        $conn->close();
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json_response([
        'status' => 'error',
        'message' => 'Method Not Allowed'
    ], 405);
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

// Get all reservations with tattoo artist and services information
$query = "
    SELECT 
        r.id,
        r.token_reserva,
        r.nombre_completo,
        r.email,
        r.whatsapp,
        r.fecha_hora,
        r.estado,
        r.notas,
        r.created_at,
        t.nombre as tatuador_nombre,
        t.especialidad as tatuador_especialidad,
        GROUP_CONCAT(s.nombre SEPARATOR ', ') as servicios_nombres,
        GROUP_CONCAT(s.id SEPARATOR ',') as servicios_ids,
        SUM(s.duracion) as duracion_total,
        SUM(s.precio) as precio_total
    FROM reservas r
    LEFT JOIN tatuadores t ON r.tatuador_id = t.id
    LEFT JOIN reserva_servicios rs ON r.id = rs.reserva_id
    LEFT JOIN servicios s ON rs.servicio_id = s.id
    GROUP BY r.id
    ORDER BY r.fecha_hora DESC
";

$result = $conn->query($query);

if (!$result) {
    send_json_response([
        'status' => 'error',
        'message' => 'Query error: ' . $conn->error
    ], 500);
}

$reservas = [];
while ($row = $result->fetch_assoc()) {
    $reservas[] = [
        'id' => (int)$row['id'],
        'token_reserva' => $row['token_reserva'],
        'nombre_completo' => $row['nombre_completo'],
        'email' => $row['email'],
        'whatsapp' => $row['whatsapp'],
        'fecha_hora' => $row['fecha_hora'],
        'estado' => $row['estado'],
        'notas' => $row['notas'],
        'created_at' => $row['created_at'],
        'tatuador_nombre' => $row['tatuador_nombre'] ?: 'Cualquier tatuador',
        'tatuador_especialidad' => $row['tatuador_especialidad'] ?: 'General',
        'servicios_nombres' => $row['servicios_nombres'] ?: 'Sin servicios',
        'servicios_ids' => $row['servicios_ids'] ? explode(',', $row['servicios_ids']) : [],
        'duracion_total' => (int)($row['duracion_total'] ?: 0),
        'precio_total' => (float)($row['precio_total'] ?: 0)
    ];
}

send_json_response([
    'status' => 'success',
    'data' => $reservas,
    'count' => count($reservas)
]);

$conn->close();
?>
