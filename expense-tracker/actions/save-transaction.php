<?php
/**
 * Action: Save New Transaction
 * Personal Expense Tracker
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('../dashboard.php');
}

$token = $_POST['csrf_token'] ?? '';
if (!validateCsrfToken($token)) {
    setFlash('danger', 'Security validation failed (Invalid CSRF token).');
    redirect('../add-transaction.php');
}

$user = currentUser();
$userId = (int)$user['id'];

$type = trim($_POST['type'] ?? '');
$categoryId = (int)($_POST['category_id'] ?? 0);
$amount = (float)($_POST['amount'] ?? 0);
$transactionDate = trim($_POST['transaction_date'] ?? '');
$description = trim($_POST['description'] ?? '');

// Input Validations
if ($type !== 'income' && $type !== 'expense') {
    setFlash('danger', 'Invalid transaction type specified.');
    redirect('../add-transaction.php');
}

if ($amount <= 0 || $amount > 99999999.99) {
    setFlash('danger', 'Please enter a valid amount greater than zero.');
    redirect('../add-transaction.php');
}

if (empty($transactionDate) || !strtotime($transactionDate)) {
    setFlash('danger', 'Please provide a valid transaction date.');
    redirect('../add-transaction.php');
}

if (empty($description)) {
    setFlash('danger', 'Description cannot be left empty.');
    redirect('../add-transaction.php');
}

$pdo = getDBConnection();

// Verify category exists and belongs to user or is global
$catCheck = $pdo->prepare("SELECT id FROM categories WHERE id = :id AND (user_id IS NULL OR user_id = :user_id) LIMIT 1");
$catCheck->execute([':id' => $categoryId, ':user_id' => $userId]);
if (!$catCheck->fetch()) {
    setFlash('danger', 'Selected category does not exist or access is unauthorized.');
    redirect('../add-transaction.php');
}

// Insert Transaction using Prepared Statement
$insertStmt = $pdo->prepare("
    INSERT INTO transactions (user_id, category_id, type, amount, transaction_date, description)
    VALUES (:user_id, :category_id, :type, :amount, :transaction_date, :description)
");

$success = $insertStmt->execute([
    ':user_id'          => $userId,
    ':category_id'      => $categoryId,
    ':type'             => $type,
    ':amount'           => $amount,
    ':transaction_date' => $transactionDate,
    ':description'      => $description
]);

if ($success) {
    setFlash('success', 'Transaction of $' . number_format($amount, 2) . ' recorded successfully!');
    redirect('../transactions.php');
} else {
    setFlash('danger', 'Failed to save transaction due to a database error.');
    redirect('../add-transaction.php');
}
