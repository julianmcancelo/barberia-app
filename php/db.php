<?php
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

function getDbConnection() {
    $host = '167.250.5.55';
    $user = 'jcancelo_barberia';
    $password = 'feelthesky1';
    $database = 'jcancelo_barberia';

    $conn = new mysqli($host, $user, $password, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}
?>
