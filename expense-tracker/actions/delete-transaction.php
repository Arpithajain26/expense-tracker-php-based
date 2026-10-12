<?php
/**
 * Action: Delete Transaction
 * Personal Expense Tracker
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('../transactions.php');
}

$token = $_POST['csrf_token'] ?? '';
$id = (int)($_POST['id'] ?? 0);

if (!validateCsrfToken($token)) {
    setFlash('danger', 'Security validation failed (Invalid CSRF token).');
    redirect('../transactions.php');
}

$user = currentUser();
$userId = (int)$user['id'];

$pdo = getDBConnection();

// Execute delete strictly enforcing user ownership
$stmt = $pdo->prepare("DELETE FROM transactions WHERE id = :id AND user_id = :user_id");
$stmt->execute([
    ':id'      => $id,
    ':user_id' => $userId
]);

if ($stmt->rowCount() > 0) {
    setFlash('success', 'Transaction was successfully deleted.');
} else {
    setFlash('warning', 'Could not delete transaction (record not found or access denied).');
}

redirect('../transactions.php');
