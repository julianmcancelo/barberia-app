<?php
// =================================================================
// PASO 1: Habilitar errores (SOLO PARA DEPURACIÓN)
// ¡¡¡¡BORRAR ESTAS 3 LÍNEAS ANTES DE PASAR A PRODUCCIÓN!!!!
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// =================================================================

// Headers CORS
$allowed_origins = [
    'http://localhost:4200',
    'https://jcancelo.dev'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: https://jcancelo.dev");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json; charset=utf-8');

// --- Función para enviar respuesta y terminar el script ---
function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data);
    exit;
}

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json_response(['status' => 'ok']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response([
        'status' => 'error',
        'message' => 'Method Not Allowed'
    ], 405);
}

// --- Obtener datos del POST ---
$input = json_decode(file_get_contents('php://input'), true);

// Debug: Log received data
error_log('Datos recibidos en reservas.php: ' . print_r($input, true));

$nombre_completo = $input['nombre_completo'] ?? '';
$email = $input['email'] ?? '';
$whatsapp = $input['whatsapp'] ?? '';
$tatuador_id = $input['tatuador_id'] ?? null;
$servicio_id = $input['servicio_id'] ?? '';
$fecha_hora = $input['fecha_hora'] ?? '';

// Debug: Log individual fields
error_log('nombre_completo: ' . $nombre_completo);
error_log('email: ' . $email);
error_log('whatsapp: ' . $whatsapp);
error_log('tatuador_id: ' . $tatuador_id);
error_log('servicio_id: ' . $servicio_id);
error_log('servicio_id type: ' . gettype($servicio_id));
error_log('fecha_hora: ' . $fecha_hora);

if (!$nombre_completo || !$email || !$servicio_id || !$fecha_hora) {
    send_json_response([
        'status' => 'error',
        'message' => 'Faltan campos requeridos'
    ], 400);
}

// --- Conexión a la base de datos ---
$host = '167.250.5.55';
$user = 'jcancelo_barberia';
$password = 'feelthesky1';
$database = 'jcancelo_barberia';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    send_json_response([
        'status' => 'error',
        'message' => 'Falló la conexión a la base de datos: ' . $conn->connect_error
    ], 500);
}

$conn->set_charset('utf8');

$token_reserva = 'RES-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);

// Start transaction
$conn->begin_transaction();

try {
    // Insert main reservation without servicio_id
    $stmt = $conn->prepare('INSERT INTO reservas (token_reserva, tatuador_id, nombre_completo, email, whatsapp, fecha_hora, estado) VALUES (?, ?, ?, ?, ?, ?, ?)');
    
    if (!$stmt) {
        throw new Exception('Error preparando la consulta de reserva: ' . $conn->error);
    }
    
    $estado = 'pendiente';
    $stmt->bind_param('sisssss', $token_reserva, $tatuador_id, $nombre_completo, $email, $whatsapp, $fecha_hora, $estado);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear la reserva: ' . $stmt->error);
    }
    
    $reserva_id = $conn->insert_id;
    
    // Insert services for this reservation
    $servicios_array = explode(',', $servicio_id);
    $stmt_servicio = $conn->prepare('INSERT INTO reserva_servicios (reserva_id, servicio_id) VALUES (?, ?)');
    
    if (!$stmt_servicio) {
        throw new Exception('Error preparando la consulta de servicios: ' . $conn->error);
    }
    
    foreach ($servicios_array as $sid) {
        $sid = trim($sid);
        if (!empty($sid) && is_numeric($sid)) {
            $stmt_servicio->bind_param('ii', $reserva_id, $sid);
            if (!$stmt_servicio->execute()) {
                throw new Exception('Error al insertar servicio: ' . $stmt_servicio->error);
            }
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    send_json_response([
        'status' => 'success',
        'data' => ['token_reserva' => $token_reserva]
    ]);
    
} catch (Exception $e) {
    // Rollback transaction
    $conn->rollback();
    
    send_json_response([
        'status' => 'error',
        'message' => $e->getMessage()
    ], 500);
}

$stmt->close();
$conn->close();
?>
