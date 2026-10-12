<?php
/**
 * Action: Update Existing Transaction
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
    redirect('../edit-transaction.php?id=' . $id);
}

$user = currentUser();
$userId = (int)$user['id'];

$type = trim($_POST['type'] ?? '');
$categoryId = (int)($_POST['category_id'] ?? 0);
$amount = (float)($_POST['amount'] ?? 0);
$transactionDate = trim($_POST['transaction_date'] ?? '');
$description = trim($_POST['description'] ?? '');

// Input validations
if ($type !== 'income' && $type !== 'expense') {
    setFlash('danger', 'Invalid transaction type specified.');
    redirect('../edit-transaction.php?id=' . $id);
}

if ($amount <= 0 || $amount > 99999999.99) {
    setFlash('danger', 'Please enter a valid amount greater than zero.');
    redirect('../edit-transaction.php?id=' . $id);
}

if (empty($transactionDate) || !strtotime($transactionDate)) {
    setFlash('danger', 'Please provide a valid transaction date.');
    redirect('../edit-transaction.php?id=' . $id);
}

if (empty($description)) {
    setFlash('danger', 'Description cannot be left empty.');
    redirect('../edit-transaction.php?id=' . $id);
}

$pdo = getDBConnection();

// Check ownership of the transaction
$ownCheck = $pdo->prepare("SELECT id FROM transactions WHERE id = :id AND user_id = :user_id LIMIT 1");
$ownCheck->execute([':id' => $id, ':user_id' => $userId]);
if (!$ownCheck->fetch()) {
    setFlash('danger', 'Transaction not found or you are not authorized to edit this record.');
    redirect('../transactions.php');
}

// Verify category exists
$catCheck = $pdo->prepare("SELECT id FROM categories WHERE id = :id AND (user_id IS NULL OR user_id = :user_id) LIMIT 1");
$catCheck->execute([':id' => $categoryId, ':user_id' => $userId]);
if (!$catCheck->fetch()) {
    setFlash('danger', 'Selected category does not exist.');
    redirect('../edit-transaction.php?id=' . $id);
}

// Update Transaction using Prepared Statement
$updateStmt = $pdo->prepare("
    UPDATE transactions 
    SET category_id = :category_id,
        type = :type,
        amount = :amount,
        transaction_date = :transaction_date,
        description = :description
    WHERE id = :id AND user_id = :user_id
");

$success = $updateStmt->execute([
    ':category_id'      => $categoryId,
    ':type'             => $type,
    ':amount'           => $amount,
    ':transaction_date' => $transactionDate,
    ':description'      => $description,
    ':id'               => $id,
    ':user_id'          => $userId
]);

if ($success) {
    setFlash('success', 'Transaction updated successfully!');
    redirect('../transactions.php');
} else {
    setFlash('danger', 'Failed to update transaction due to database error.');
    redirect('../edit-transaction.php?id=' . $id);
}
