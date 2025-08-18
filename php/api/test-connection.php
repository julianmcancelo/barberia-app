<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Iniciando prueba de conexión...<br>";

$host = '167.250.5.55';
$user = 'jcancelo_barberia';
$password = 'feelthesky1';
$database = 'jcancelo_barberia';

echo "Conectando a: $host<br>";
echo "Usuario: $user<br>";
echo "Base de datos: $database<br>";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo "ERROR de conexión: " . $conn->connect_error . "<br>";
    die();
} else {
    echo "✅ Conexión exitosa<br>";
}

$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result) {
    echo "Tablas en la base de datos:<br>";
    while($row = $result->fetch_array()) {
        echo "- " . $row[0] . "<br>";
    }
} else {
    echo "Error al obtener tablas: " . $conn->error . "<br>";
}

$conn->close();
echo "Prueba completada.";
?>
