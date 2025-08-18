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
header('Content-Type: application/json; charset=utf-8');

// --- Función para enviar respuesta y terminar el script ---
function send_json_response($data) {
    echo json_encode($data);
    exit;
}

// --- Conexión a la base de datos ---
$host = '167.250.5.55';
$user = 'jcancelo_barberia';
$password = 'feelthesky1';
$database = 'jcancelo_barberia';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    send_json_response([
        'status' => 'error',
        'message' => 'Falló la conexión a la base de datos: ' . $conn->connect_error
    ]);
}

$conn->set_charset('utf8');

// --- Consulta a la base de datos ---
$sql = "SELECT * FROM tatuadores WHERE activo = 1 ORDER BY nombre";
$result = $conn->query($sql);

if ($result === false) {
    http_response_code(500);
    send_json_response([
        'status' => 'error',
        'message' => 'Error en la consulta SQL: ' . $conn->error
    ]);
}

// --- Procesar resultados ---
$tatuadores = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['activo'] = (bool)$row['activo'];
        $tatuadores[] = $row;
    }
}

$conn->close();

http_response_code(200);
send_json_response([
    'status' => 'success',
    'data' => $tatuadores
]);
?>
