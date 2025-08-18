<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Debug iniciado...<br>";

try {
    echo "1. Intentando incluir db.php...<br>";
    require_once '../db.php';
    echo "2. db.php incluido correctamente<br>";
    
    echo "3. Verificando función getDbConnection...<br>";
    if (function_exists('getDbConnection')) {
        echo "4. Función getDbConnection existe<br>";
        
        echo "5. Intentando conectar a la base de datos...<br>";
        $conn = getDbConnection();
        echo "6. Conexión exitosa<br>";
        
        echo "7. Probando consulta SQL...<br>";
        $sql = "SELECT COUNT(*) as total FROM tatuadores";
        $result = $conn->query($sql);
        
        if ($result) {
            $row = $result->fetch_assoc();
            echo "8. Consulta exitosa. Total tatuadores: " . $row['total'] . "<br>";
        } else {
            echo "8. Error en consulta: " . $conn->error . "<br>";
        }
        
        $conn->close();
        echo "9. Conexión cerrada<br>";
        
    } else {
        echo "4. ERROR: Función getDbConnection NO existe<br>";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "<br>";
}

echo "Debug completado.";
?>
