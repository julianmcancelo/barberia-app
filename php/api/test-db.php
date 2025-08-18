<?php
require_once '../db.php';

header('Content-Type: application/json');

try {
    $conn = getDbConnection();
    
    // Test 1: Check connection
    $result = ['status' => 'success', 'tests' => []];
    
    // Test 2: Check if tables exist
    $tables = ['tatuadores', 'servicios', 'reservas'];
    foreach ($tables as $table) {
        $sql = "SHOW TABLES LIKE '$table'";
        $tableResult = $conn->query($sql);
        $result['tests'][] = [
            'test' => "Table $table exists",
            'result' => $tableResult->num_rows > 0 ? 'PASS' : 'FAIL'
        ];
    }
    
    // Test 3: Count records in each table
    foreach ($tables as $table) {
        $sql = "SELECT COUNT(*) as count FROM $table";
        $countResult = $conn->query($sql);
        if ($countResult) {
            $count = $countResult->fetch_assoc()['count'];
            $result['tests'][] = [
                'test' => "Records in $table",
                'result' => $count . ' records'
            ];
        } else {
            $result['tests'][] = [
                'test' => "Records in $table",
                'result' => 'ERROR: ' . $conn->error
            ];
        }
    }
    
    // Test 4: Sample servicios query
    $sql = "SELECT * FROM servicios WHERE activo = 1 LIMIT 3";
    $serviciosResult = $conn->query($sql);
    if ($serviciosResult) {
        $servicios = [];
        while ($row = $serviciosResult->fetch_assoc()) {
            $servicios[] = $row;
        }
        $result['sample_servicios'] = $servicios;
    } else {
        $result['servicios_error'] = $conn->error;
    }
    
    $conn->close();
    echo json_encode($result, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
