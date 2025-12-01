<?php
/**
 * Database Configuration for Production
 * Supports environment variables for cloud deployment
 * 
 * @author Athanase Abayo
 * @version 1.0
 */

// Load database credentials from environment variables or use defaults
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_username = getenv('DB_USERNAME') ?: 'root';
$db_password = getenv('DB_PASSWORD') ?: '';
$db_name = getenv('DB_NAME') ?: 'SI2025';
$db_port = getenv('DB_PORT') ?: '3306';

try {
    // Attempt to connect to MySQL database
    $conn = new mysqli($db_host, $db_username, $db_password, $db_name, $db_port);
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Set charset
    $conn->set_charset("utf8mb4");
    
    // Log successful connection
    error_log("SwapIt: Database connected successfully");
    
} catch (Exception $e) {
    // Log error
    error_log("SwapIt Database Error: " . $e->getMessage());
    
    // In production, show generic error
    if (getenv('ENVIRONMENT') === 'production') {
        http_response_code(503);
        echo json_encode([
            'success' => false,
            'error' => 'Database service temporarily unavailable'
        ]);
        exit;
    }
    
    // In development, show detailed error
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'details' => $e->getMessage()
    ]);
    exit;
}
?>
