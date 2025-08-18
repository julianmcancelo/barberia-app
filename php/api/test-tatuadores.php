<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$host = '167.250.5.55';
$user = 'jcancelo_barberia';
$password = 'feelthesky1';
$database = 'jcancelo_barberia';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Probar diferentes consultas
$queries = [
    "SELECT COUNT(*) as count FROM tatuadores",
    "SELECT * FROM tatuadores LIMIT 2",
    "SELECT * FROM tatuadores WHERE activo = 1 LIMIT 2",
    "SELECT * FROM tatuadores WHERE activo = true LIMIT 2"
];

$results = [];

foreach ($queries as $index => $sql) {
    $result = $conn->query($sql);
    if ($result) {
        if ($sql === "SELECT COUNT(*) as count FROM tatuadores") {
            $row = $result->fetch_assoc();
            $results["query_$index"] = ["sql" => $sql, "count" => $row['count']];
        } else {
            $data = [];
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $results["query_$index"] = ["sql" => $sql, "data" => $data];
        }
    } else {
        $results["query_$index"] = ["sql" => $sql, "error" => $conn->error];
    }
}

$conn->close();

echo json_encode($results, JSON_PRETTY_PRINT);
?>
