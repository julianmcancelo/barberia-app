<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli('167.250.5.55', 'jcancelo_barberia', 'feelthesky1', 'jcancelo_barberia');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed']));
}

$result = $conn->query("SELECT * FROM tatuadores");
$tatuadores = [];

while($row = $result->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $tatuadores[] = $row;
}

echo json_encode(['result' => $tatuadores]);
$conn->close();
?>
