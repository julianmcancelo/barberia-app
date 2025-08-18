<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli('167.250.5.55', 'jcancelo_barberia', 'feelthesky1', 'jcancelo_barberia');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed']));
}

$result = $conn->query("SELECT * FROM servicios");
$servicios = [];

while($row = $result->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['duracion'] = (int)$row['duracion'];
    $row['precio'] = (string)$row['precio'];
    $servicios[] = $row;
}

echo json_encode(['result' => $servicios]);
$conn->close();
?>
