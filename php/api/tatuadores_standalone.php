<?php
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
header('Content-Type: application/json');

// Conexión directa a la base de datos
$host = '167.250.5.55';
$user = 'jcancelo_barberia';
$password = 'feelthesky1';
$database = 'jcancelo_barberia';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT * FROM tatuadores WHERE activo = 1 ORDER BY nombre";
$result = $conn->query($sql);

$tatuadores = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $tatuadores[] = $row;
    }
}

$conn->close();

echo json_encode(['result' => $tatuadores]);
?>
