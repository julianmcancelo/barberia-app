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
            if (isset($_GET['action'])) {
                switch ($_GET['action']) {
                    case 'validate':
                        // Validar cupón
                        $codigo = $_GET['codigo'] ?? '';
                        $monto = floatval($_GET['monto'] ?? 0);
                        $email = $_GET['email'] ?? '';
                        
                        if (!$codigo) {
                            sendResponse('error', null, 'Código de cupón requerido');
                        }
                        
                        $sql = "SELECT c.*, 
                                       (SELECT COUNT(*) FROM cupones_usados cu WHERE cu.cupon_id = c.id AND cu.cliente_email = ?) as usos_cliente
                                FROM cupones c 
                                WHERE c.codigo = ? AND c.activo = 1 
                                AND c.fecha_inicio <= CURDATE() 
                                AND c.fecha_expiracion >= CURDATE()";
                        
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param("ss", $email, $codigo);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        
                        if ($result->num_rows === 0) {
                            sendResponse('error', null, 'Cupón no válido o expirado');
                        }
                        
                        $cupon = $result->fetch_assoc();
                        
                        // Validaciones
                        if ($cupon['usos_maximos'] && $cupon['usos_actuales'] >= $cupon['usos_maximos']) {
                            sendResponse('error', null, 'Cupón agotado');
                        }
                        
                        if ($cupon['solo_primera_vez'] && $cupon['usos_cliente'] > 0) {
                            sendResponse('error', null, 'Cupón solo válido para nuevos clientes');
                        }
                        
                        if ($monto < $cupon['monto_minimo']) {
                            sendResponse('error', null, 'Monto mínimo no alcanzado: $' . number_format($cupon['monto_minimo'], 0));
                        }
                        
                        // Calcular descuento
                        $descuento = 0;
                        if ($cupon['tipo_descuento'] === 'porcentaje') {
                            $descuento = ($monto * $cupon['valor_descuento']) / 100;
                        } else {
                            $descuento = $cupon['valor_descuento'];
                        }
                        
                        // No puede ser mayor al monto total
                        $descuento = min($descuento, $monto);
                        
                        sendResponse('success', [
                            'cupon' => $cupon,
                            'descuento' => $descuento,
                            'monto_final' => $monto - $descuento
                        ]);
                        break;
                        
                    default:
                        // Obtener todos los cupones activos
                        $sql = "SELECT * FROM cupones WHERE activo = 1 ORDER BY created_at DESC";
                        $result = $conn->query($sql);
                        
                        $cupones = [];
                        if ($result && $result->num_rows > 0) {
                            while($row = $result->fetch_assoc()) {
                                $row['id'] = (int)$row['id'];
                                $row['valor_descuento'] = (float)$row['valor_descuento'];
                                $row['monto_minimo'] = (float)$row['monto_minimo'];
                                $row['usos_maximos'] = $row['usos_maximos'] ? (int)$row['usos_maximos'] : null;
                                $row['usos_actuales'] = (int)$row['usos_actuales'];
                                $row['activo'] = (bool)$row['activo'];
                                $row['solo_primera_vez'] = (bool)$row['solo_primera_vez'];
                                $cupones[] = $row;
                            }
                        }
                        
                        sendResponse('success', $cupones);
                }
            }
            break;
            
        case 'POST':
            // Crear nuevo cupón
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['codigo']) || !isset($input['nombre'])) {
                sendResponse('error', null, 'Código y nombre son requeridos');
            }
            
            $stmt = $conn->prepare("INSERT INTO cupones (codigo, nombre, descripcion, tipo_descuento, valor_descuento, monto_minimo, fecha_inicio, fecha_expiracion, usos_maximos, solo_primera_vez, tatuador_especifico, servicio_especifico) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->bind_param("ssssddssiiis",
                $input['codigo'],
                $input['nombre'],
                $input['descripcion'] ?? '',
                $input['tipo_descuento'],
                $input['valor_descuento'],
                $input['monto_minimo'] ?? 0,
                $input['fecha_inicio'],
                $input['fecha_expiracion'],
                $input['usos_maximos'] ?? null,
                $input['solo_primera_vez'] ?? false,
                $input['tatuador_especifico'] ?? null,
                $input['servicio_especifico'] ?? null
            );
            
            if ($stmt->execute()) {
                $newId = $conn->insert_id;
                sendResponse('success', ['id' => $newId], 'Cupón creado exitosamente');
            } else {
                sendResponse('error', null, 'Error al crear cupón: ' . $stmt->error);
            }
            break;
            
        case 'PUT':
            // Actualizar cupón
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['id'])) {
                sendResponse('error', null, 'ID es requerido para actualizar');
            }
            
            $stmt = $conn->prepare("UPDATE cupones SET codigo = ?, nombre = ?, descripcion = ?, tipo_descuento = ?, valor_descuento = ?, monto_minimo = ?, fecha_inicio = ?, fecha_expiracion = ?, usos_maximos = ?, solo_primera_vez = ?, activo = ?, tatuador_especifico = ?, servicio_especifico = ? WHERE id = ?");
            
            $stmt->bind_param("ssssddssiiisii",
                $input['codigo'],
                $input['nombre'],
                $input['descripcion'],
                $input['tipo_descuento'],
                $input['valor_descuento'],
                $input['monto_minimo'],
                $input['fecha_inicio'],
                $input['fecha_expiracion'],
                $input['usos_maximos'],
                $input['solo_primera_vez'],
                $input['activo'] ?? 1,
                $input['tatuador_especifico'],
                $input['servicio_especifico'],
                $input['id']
            );
            
            if ($stmt->execute()) {
                sendResponse('success', null, 'Cupón actualizado exitosamente');
            } else {
                sendResponse('error', null, 'Error al actualizar cupón: ' . $stmt->error);
            }
            break;
            
        case 'DELETE':
            // Eliminar cupón (soft delete)
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                sendResponse('error', null, 'ID es requerido para eliminar');
            }
            
            $stmt = $conn->prepare("UPDATE cupones SET activo = 0 WHERE id = ?");
            $stmt->bind_param("i", $id);
            
            if ($stmt->execute()) {
                sendResponse('success', null, 'Cupón eliminado exitosamente');
            } else {
                sendResponse('error', null, 'Error al eliminar cupón: ' . $stmt->error);
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
