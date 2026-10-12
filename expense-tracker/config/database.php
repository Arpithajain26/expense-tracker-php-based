<?php
/**
 * Personal Expense Tracker
 * Database Configuration using PDO
 * 
 * Works out-of-the-box with default XAMPP credentials (root, empty password)
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'expense_tracker');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getDBConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // For production / submission safety, do not display raw database credentials
            die("Database Connection Failed. Please ensure MySQL is running in XAMPP and the database 'expense_tracker' exists. Error: " . htmlspecialchars($e->getMessage()));
        }
    }

    return $pdo;
}
