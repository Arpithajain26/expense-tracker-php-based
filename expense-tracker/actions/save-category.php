<?php
/**
 * Action: Create Custom Category
 * Personal Expense Tracker
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('../categories.php');
}

$token = $_POST['csrf_token'] ?? '';
if (!validateCsrfToken($token)) {
    setFlash('danger', 'Security validation failed (Invalid CSRF token).');
    redirect('../categories.php');
}

$user = currentUser();
$userId = (int)$user['id'];

$name = trim($_POST['name'] ?? '');
$type = trim($_POST['type'] ?? '');

if (empty($name) || strlen($name) > 80) {
    setFlash('danger', 'Category name must be between 1 and 80 characters.');
    redirect('../categories.php');
}

if ($type !== 'income' && $type !== 'expense') {
    setFlash('danger', 'Invalid category type specified.');
    redirect('../categories.php');
}

$pdo = getDBConnection();

// Check if user already has a category with this exact name and type
$dupCheck = $pdo->prepare("
    SELECT id FROM categories 
    WHERE name = :name AND type = :type AND (user_id IS NULL OR user_id = :user_id)
    LIMIT 1
");
$dupCheck->execute([
    ':name'    => $name,
    ':type'    => $type,
    ':user_id' => $userId
]);

if ($dupCheck->fetch()) {
    setFlash('warning', 'A category with the name "' . htmlspecialchars($name) . '" already exists.');
    redirect('../categories.php');
}

$insertStmt = $pdo->prepare("INSERT INTO categories (user_id, name, type) VALUES (:user_id, :name, :type)");
$success = $insertStmt->execute([
    ':user_id' => $userId,
    ':name'    => $name,
    ':type'    => $type
]);

if ($success) {
    setFlash('success', 'Custom category "' . htmlspecialchars($name) . '" created successfully!');
} else {
    setFlash('danger', 'Could not create category due to a database error.');
}

redirect('../categories.php');
