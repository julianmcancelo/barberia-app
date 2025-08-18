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

header("Access-Control-Allow-Headers: *");
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

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    send_json_response([
        'status' => 'error',
        'message' => 'Invalid JSON data'
    ], 400);
}

$nombre_completo = $data['nombre_completo'] ?? null;
$email = $data['email'] ?? null;
$whatsapp = $data['whatsapp'] ?? null;
$servicio_id = $data['servicio_id'] ?? null;
$fecha_hora = $data['fecha_hora'] ?? null;

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

$stmt = $conn->prepare('INSERT INTO reservas (token_reserva, servicio_id, nombre_completo, email, whatsapp, fecha_hora, estado) VALUES (?, ?, ?, ?, ?, ?, ?)');

if (!$stmt) {
    send_json_response([
        'status' => 'error',
        'message' => 'Error preparando consulta: ' . $conn->error
    ], 500);
}

$estado = 'pendiente';
$stmt->bind_param('sisssss', $token_reserva, $servicio_id, $nombre_completo, $email, $whatsapp, $fecha_hora, $estado);

if ($stmt->execute()) {
    send_json_response([
        'status' => 'success',
        'data' => ['token_reserva' => $token_reserva]
    ]);
} else {
    send_json_response([
        'status' => 'error',
        'message' => 'Error al crear la reserva: ' . $stmt->error
    ], 500);
}

$stmt->close();
$conn->close();
?>
