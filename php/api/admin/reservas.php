<?php
require_once '../../db.php';

header('Content-Type: application/json');

$conn = getDbConnection();

$sql = "
    SELECT 
        r.id, 
        r.fecha_hora, 
        r.token_reserva, 
        c.nombre_completo, 
        c.email, 
        c.whatsapp, 
        s.nombre as servicio_nombre, 
        s.duracion as servicio_duracion, 
        s.precio as servicio_precio
    FROM Reservas r
    JOIN Clientes c ON r.cliente_id = c.id
    JOIN Servicios s ON r.servicio_id = s.id
    ORDER BY r.fecha_hora DESC
";

$result = $conn->query($sql);

$reservas = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Asegurar tipos de datos consistentes
        $row['id'] = (int)$row['id'];
        $row['servicio_duracion'] = (int)$row['servicio_duracion'];
        $reservas[] = $row;
    }
}

$conn->close();

echo json_encode(['result' => $reservas]);
?>
