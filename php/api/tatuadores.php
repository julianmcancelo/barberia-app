<?php
/**
 * API Endpoint completa para gestión de tatuadores - EQUINOCCIO STUDIO
 * Soporta operaciones CRUD: GET, POST, PUT, DELETE
 * Maneja imágenes y validación completa de datos
 */

// =================================================================
// CABECERAS (Headers)
// Configuración CORS para permitir acceso desde Angular
// =================================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejo de petición preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// =================================================================
// FUNCIONES DE UTILIDAD
// =================================================================

function getDbConnection() {
    $host = '167.250.5.55';
    $user = 'jcancelo_barberia';
    $password = 'feelthesky1';
    $database = 'jcancelo_barberia';

    $conn = new mysqli($host, $user, $password, $database);

    if ($conn->connect_error) {
        throw new Exception('Falló la conexión a la base de datos: ' . $conn->connect_error);
    }

    $conn->set_charset('utf8');
    return $conn;
}

function sendResponse($status, $data = null, $message = '', $httpCode = 200) {
    http_response_code($httpCode);
    $response = ['status' => $status];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    if (!empty($message)) {
        $response['message'] = $message;
    }
    
    echo json_encode($response);
    exit;
}

function validateTatuadorData($data, $isUpdate = false) {
    $errors = [];
    
    // Validaciones requeridas para crear
    if (!$isUpdate || isset($data['nombre'])) {
        if (empty($data['nombre']) || strlen(trim($data['nombre'])) < 2) {
            $errors[] = 'El nombre es requerido y debe tener al menos 2 caracteres';
        }
    }
    
    if (!$isUpdate || isset($data['especialidad'])) {
        if (empty($data['especialidad'])) {
            $errors[] = 'La especialidad es requerida';
        }
    }
    
    if (!$isUpdate || isset($data['descripcion'])) {
        if (empty($data['descripcion']) || strlen(trim($data['descripcion'])) < 10) {
            $errors[] = 'La descripción es requerida y debe tener al menos 10 caracteres';
        }
    }
    
    if (!$isUpdate || isset($data['telefono'])) {
        if (empty($data['telefono'])) {
            $errors[] = 'El teléfono es requerido';
        } elseif (!preg_match('/^[0-9+\-\s()]+$/', $data['telefono'])) {
            $errors[] = 'Formato de teléfono inválido';
        }
    }
    
    if (!$isUpdate || isset($data['email'])) {
        if (empty($data['email'])) {
            $errors[] = 'El email es requerido';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Formato de email inválido';
        }
    }
    
    if (!$isUpdate || isset($data['experiencia'])) {
        if (empty($data['experiencia'])) {
            $errors[] = 'La experiencia es requerida';
        }
    }
    
    // Validaciones opcionales
    if (isset($data['instagram']) && !empty($data['instagram'])) {
        if (!preg_match('/^@?[a-zA-Z0-9._]+$/', $data['instagram'])) {
            $errors[] = 'Formato de Instagram inválido';
        }
    }
    
    return $errors;
}

function sanitizeInput($data) {
    $sanitized = [];
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $sanitized[$key] = trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
        } else {
            $sanitized[$key] = $value;
        }
    }
    return $sanitized;
}

// =================================================================
// LÓGICA PRINCIPAL DE LA API - ROUTER
// =================================================================
try {
    $conn = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            handleGet($conn);
            break;
        case 'POST':
            handlePost($conn, $input);
            break;
        case 'PUT':
            handlePut($conn, $input);
            break;
        case 'DELETE':
            handleDelete($conn);
            break;
        default:
            sendResponse('error', null, 'Método no permitido', 405);
    }

} catch (Exception $e) {
    sendResponse('error', null, 'Error del servidor: ' . $e->getMessage(), 500);
}

// =================================================================
// HANDLERS PARA CADA MÉTODO HTTP
// =================================================================

function handleGet($conn) {
    $sql = "SELECT id, nombre, especialidad, descripcion, telefono, email, instagram, experiencia, imagen, activo, created_at, updated_at 
            FROM tatuadores 
            WHERE activo = 1 
            ORDER BY nombre";
    
    $result = $conn->query($sql);
    
    if ($result === false) {
        sendResponse('error', null, 'Error en la consulta: ' . $conn->error, 500);
    }
    
    $tatuadores = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $row['id'] = (int)$row['id'];
            $row['activo'] = (bool)$row['activo'];
            $tatuadores[] = $row;
        }
    }
    
    $conn->close();
    sendResponse('success', $tatuadores);
}

function handlePost($conn, $input) {
    if (!$input) {
        sendResponse('error', null, 'Datos no válidos', 400);
    }
    
    $data = sanitizeInput($input);
    $errors = validateTatuadorData($data);
    
    if (!empty($errors)) {
        sendResponse('error', null, implode(', ', $errors), 400);
    }
    
    // Verificar email único
    $emailCheck = $conn->prepare("SELECT id FROM tatuadores WHERE email = ? AND activo = 1");
    $emailCheck->bind_param("s", $data['email']);
    $emailCheck->execute();
    
    if ($emailCheck->get_result()->num_rows > 0) {
        sendResponse('error', null, 'El email ya está registrado', 400);
    }
    
    $stmt = $conn->prepare("INSERT INTO tatuadores (nombre, especialidad, descripcion, telefono, email, instagram, experiencia, imagen, activo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())");
    
    $instagram = isset($data['instagram']) ? $data['instagram'] : null;
    $imagen = isset($data['imagen']) ? $data['imagen'] : null;
    
    $stmt->bind_param("ssssssss", 
        $data['nombre'], 
        $data['especialidad'], 
        $data['descripcion'], 
        $data['telefono'], 
        $data['email'], 
        $instagram, 
        $data['experiencia'], 
        $imagen
    );
    
    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        $conn->close();
        sendResponse('success', ['id' => $newId], 'Tatuador creado exitosamente', 201);
    } else {
        sendResponse('error', null, 'Error al crear tatuador: ' . $stmt->error, 500);
    }
}

function handlePut($conn, $input) {
    if (!$input || !isset($input['id'])) {
        sendResponse('error', null, 'ID requerido para actualizar', 400);
    }
    
    $id = (int)$input['id'];
    $data = sanitizeInput($input);
    
    // Verificar que el tatuador existe
    $checkStmt = $conn->prepare("SELECT id FROM tatuadores WHERE id = ? AND activo = 1");
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        sendResponse('error', null, 'Tatuador no encontrado', 404);
    }
    
    $errors = validateTatuadorData($data, true);
    
    if (!empty($errors)) {
        sendResponse('error', null, implode(', ', $errors), 400);
    }
    
    // Verificar email único (excluyendo el registro actual)
    if (isset($data['email'])) {
        $emailCheck = $conn->prepare("SELECT id FROM tatuadores WHERE email = ? AND id != ? AND activo = 1");
        $emailCheck->bind_param("si", $data['email'], $id);
        $emailCheck->execute();
        
        if ($emailCheck->get_result()->num_rows > 0) {
            sendResponse('error', null, 'El email ya está registrado', 400);
        }
    }
    
    // Construir query dinámico
    $updateFields = [];
    $types = "";
    $values = [];
    
    $allowedFields = ['nombre', 'especialidad', 'descripcion', 'telefono', 'email', 'instagram', 'experiencia', 'imagen'];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateFields[] = "$field = ?";
            $types .= "s";
            $values[] = $data[$field];
        }
    }
    
    if (empty($updateFields)) {
        sendResponse('error', null, 'No hay campos para actualizar', 400);
    }
    
    $updateFields[] = "updated_at = NOW()";
    $types .= "i";
    $values[] = $id;
    
    $sql = "UPDATE tatuadores SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);
    
    if ($stmt->execute()) {
        $conn->close();
        sendResponse('success', null, 'Tatuador actualizado exitosamente');
    } else {
        sendResponse('error', null, 'Error al actualizar tatuador: ' . $stmt->error, 500);
    }
}

function handleDelete($conn) {
    if (!isset($_GET['id'])) {
        sendResponse('error', null, 'ID requerido para eliminar', 400);
    }
    
    $id = (int)$_GET['id'];
    
    // Verificar que el tatuador existe
    $checkStmt = $conn->prepare("SELECT id FROM tatuadores WHERE id = ? AND activo = 1");
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        sendResponse('error', null, 'Tatuador no encontrado', 404);
    }
    
    // Soft delete - marcar como inactivo
    $stmt = $conn->prepare("UPDATE tatuadores SET activo = 0, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        $conn->close();
        sendResponse('success', null, 'Tatuador eliminado exitosamente');
    } else {
        sendResponse('error', null, 'Error al eliminar tatuador: ' . $stmt->error, 500);
    }
}
?>