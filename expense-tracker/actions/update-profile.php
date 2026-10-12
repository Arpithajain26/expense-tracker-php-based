<?php
/**
 * Action: Update Profile Details
 * Personal Expense Tracker
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('../profile.php');
}

$token = $_POST['csrf_token'] ?? '';
if (!validateCsrfToken($token)) {
    setFlash('danger', 'Security validation failed (Invalid CSRF token).');
    redirect('../profile.php');
}

$user = currentUser();
$userId = (int)$user['id'];
$name = trim($_POST['name'] ?? '');

if (empty($name) || strlen($name) > 100) {
    setFlash('danger', 'Please provide a valid name between 1 and 100 characters.');
    redirect('../profile.php');
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("UPDATE users SET name = :name WHERE id = :id");
$success = $stmt->execute([
    ':name' => $name,
    ':id'   => $userId
]);

if ($success) {
    $_SESSION['user_name'] = $name;
    setFlash('success', 'Profile information updated successfully!');
} else {
    setFlash('danger', 'Could not update profile due to a database error.');
}

redirect('../profile.php');
