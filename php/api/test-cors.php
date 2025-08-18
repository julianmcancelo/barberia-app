<?php
// =================================================================
// PASO 1: Habilitar errores (SOLO PARA DEPURACIÓN)
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
    header("Access-Control-Allow-Origin: http://localhost:4200");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['status' => 'ok', 'method' => 'OPTIONS']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo json_encode(['status' => 'success', 'method' => 'POST', 'message' => 'CORS test successful']);
} else {
    echo json_encode(['status' => 'success', 'method' => $_SERVER['REQUEST_METHOD'], 'message' => 'CORS test successful']);
}
?>
