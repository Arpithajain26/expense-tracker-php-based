<?php
/**
 * Action: Change User Password
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

$currentPassword = $_POST['current_password'] ?? '';
$newPassword = $_POST['new_password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
    setFlash('danger', 'Please fill in all password fields.');
    redirect('../profile.php');
}

if (strlen($newPassword) < 6) {
    setFlash('danger', 'New password must be at least 6 characters long.');
    redirect('../profile.php');
}

if ($newPassword !== $confirmPassword) {
    setFlash('danger', 'New password confirmation does not match.');
    redirect('../profile.php');
}

$pdo = getDBConnection();

// Fetch current password hash
$stmt = $pdo->prepare("SELECT password FROM users WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $userId]);
$row = $stmt->fetch();

if (!$row || !password_verify($currentPassword, $row['password'])) {
    setFlash('danger', 'Your current password was entered incorrectly.');
    redirect('../profile.php');
}

// Hash new password
$newHash = password_hash($newPassword, PASSWORD_BCRYPT);
$updateStmt = $pdo->prepare("UPDATE users SET password = :password WHERE id = :id");
$success = $updateStmt->execute([
    ':password' => $newHash,
    ':id'       => $userId
]);

if ($success) {
    setFlash('success', 'Your password has been changed securely!');
} else {
    setFlash('danger', 'Could not update password due to a database error.');
}

redirect('../profile.php');
