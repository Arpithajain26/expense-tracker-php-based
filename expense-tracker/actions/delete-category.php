<?php
/**
 * Action: Delete Custom Category
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
$id = (int)($_POST['id'] ?? 0);

if (!validateCsrfToken($token)) {
    setFlash('danger', 'Security validation failed (Invalid CSRF token).');
    redirect('../categories.php');
}

$user = currentUser();
$userId = (int)$user['id'];

$pdo = getDBConnection();

// Check category exists and belongs to this user (cannot delete default system categories where user_id IS NULL)
$catCheck = $pdo->prepare("SELECT id, name FROM categories WHERE id = :id AND user_id = :user_id LIMIT 1");
$catCheck->execute([':id' => $id, ':user_id' => $userId]);
$cat = $catCheck->fetch();

if (!$cat) {
    setFlash('danger', 'Category not found, or it is a protected system default category.');
    redirect('../categories.php');
}

// Check if any transaction is currently linked to this category
$txCheck = $pdo->prepare("SELECT COUNT(*) FROM transactions WHERE category_id = :category_id AND user_id = :user_id");
$txCheck->execute([':category_id' => $id, ':user_id' => $userId]);
$usageCount = (int)$txCheck->fetchColumn();

if ($usageCount > 0) {
    setFlash('danger', 'Cannot delete "' . htmlspecialchars($cat['name']) . '" because ' . $usageCount . ' transaction(s) are using it. Reassign or delete those transactions first.');
    redirect('../categories.php');
}

$deleteStmt = $pdo->prepare("DELETE FROM categories WHERE id = :id AND user_id = :user_id");
$deleteStmt->execute([':id' => $id, ':user_id' => $userId]);

setFlash('success', 'Custom category "' . htmlspecialchars($cat['name']) . '" deleted successfully.');
redirect('../categories.php');
