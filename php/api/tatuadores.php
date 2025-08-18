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
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Conexión directa a la base de datos
$host = '167.250.5.55';
$user = 'jcancelo_barberia';
$password = 'feelthesky1';
$database = 'jcancelo_barberia';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

function sendResponse($status, $data = null, $message = null) {
    echo json_encode([
        'status' => $status,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            // Get all active artists
            $sql = "SELECT * FROM tatuadores WHERE activo = 1 ORDER BY nombre";
            $result = $conn->query($sql);
            
            $tatuadores = [];
            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $row['id'] = (int)$row['id'];
                    $row['activo'] = (bool)$row['activo'];
                    $tatuadores[] = $row;
                }
            }
            
            sendResponse('success', $tatuadores);
            break;
            
        case 'POST':
            // Add new artist
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['nombre']) || !isset($input['especialidad'])) {
                sendResponse('error', null, 'Nombre y especialidad son requeridos');
            }
            
            $stmt = $conn->prepare("INSERT INTO tatuadores (nombre, especialidad, descripcion, telefono, email) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", 
                $input['nombre'],
                $input['especialidad'],
                $input['descripcion'] ?? null,
                $input['telefono'] ?? null,
                $input['email'] ?? null
            );
            
            if ($stmt->execute()) {
                $newId = $conn->insert_id;
                sendResponse('success', ['id' => $newId], 'Tatuador agregado exitosamente');
            } else {
                sendResponse('error', null, 'Error al agregar tatuador: ' . $stmt->error);
            }
            break;
            
        case 'PUT':
            // Update artist
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['id'])) {
                sendResponse('error', null, 'ID es requerido para actualizar');
            }
            
            $stmt = $conn->prepare("UPDATE tatuadores SET nombre = ?, especialidad = ?, descripcion = ?, telefono = ?, email = ?, activo = ? WHERE id = ?");
            $stmt->bind_param("sssssii",
                $input['nombre'],
                $input['especialidad'],
                $input['descripcion'] ?? null,
                $input['telefono'] ?? null,
                $input['email'] ?? null,
                $input['activo'] ?? 1,
                $input['id']
            );
            
            if ($stmt->execute()) {
                sendResponse('success', null, 'Tatuador actualizado exitosamente');
            } else {
                sendResponse('error', null, 'Error al actualizar tatuador: ' . $stmt->error);
            }
            break;
            
        case 'DELETE':
            // Soft delete artist (set activo = 0)
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                sendResponse('error', null, 'ID es requerido para eliminar');
            }
            
            $stmt = $conn->prepare("UPDATE tatuadores SET activo = 0 WHERE id = ?");
            $stmt->bind_param("i", $id);
            
            if ($stmt->execute()) {
                sendResponse('success', null, 'Tatuador eliminado exitosamente');
            } else {
                sendResponse('error', null, 'Error al eliminar tatuador: ' . $stmt->error);
            }
            break;
            
        default:
            sendResponse('error', null, 'Método no permitido');
    }
    
} catch (Exception $e) {
    sendResponse('error', null, 'Error del servidor: ' . $e->getMessage());
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
