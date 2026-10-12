<?php
/**
 * User Registration Page
 * Personal Expense Tracker
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireGuest();

$error = '';
$name = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedToken = $_POST['csrf_token'] ?? '';
    if (!validateCsrfToken($submittedToken)) {
        $error = 'Security validation failed (Invalid CSRF token). Please try again.';
    } else {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if (empty($name) || empty($email) || empty($password) || empty($confirmPassword)) {
            $error = 'Please fill in all required fields.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please provide a valid email address.';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters long.';
        } elseif ($password !== $confirmPassword) {
            $error = 'Password confirmation does not match.';
        } else {
            $pdo = getDBConnection();
            
            // 1. Check for duplicate email
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            if ($stmt->fetch()) {
                $error = 'This email address is already registered. Please sign in instead.';
            } else {
                // 2. Hash password securely
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

                // 3. Insert new user record
                $insertStmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
                $success = $insertStmt->execute([
                    ':name'     => $name,
                    ':email'    => $email,
                    ':password' => $hashedPassword
                ]);

                if ($success) {
                    $newUserId = (int)$pdo->lastInsertId();

                    // Optional: auto-login
                    session_regenerate_id(true);
                    $_SESSION['user_id'] = $newUserId;
                    $_SESSION['user_name'] = $name;
                    $_SESSION['user_email'] = $email;

                    setFlash('success', 'Registration successful! Welcome to your Expense Tracker.');
                    redirect('dashboard.php');
                } else {
                    $error = 'An unexpected error occurred while creating your account. Please try again.';
                }
            }
        }
    }
}

$pageTitle = 'Create Account';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account - Personal Expense Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light">

<div class="auth-wrapper">
    <div class="auth-card">
        <div class="text-center mb-4">
            <div class="brand-icon rounded-3 mx-auto mb-3 d-flex align-items-center justify-content-center text-white" style="width: 44px; height: 44px;">
                <i class="bi bi-person-plus fs-4"></i>
            </div>
            <h4 class="fw-bold text-slate-900 mb-1">Create Account</h4>
            <p class="text-muted small">Start tracking your personal finances in seconds</p>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-danger alert-dismissible fade show small mb-3">
                <i class="bi bi-exclamation-circle-fill me-1"></i>
                <?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <form action="register.php" method="POST" autocomplete="off">
            <?= csrfField() ?>

            <div class="mb-3">
                <label for="name" class="form-label small fw-semibold text-secondary">Full Name</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control border-start-0" id="name" name="name" value="<?= htmlspecialchars($name) ?>" placeholder="e.g. Rahul Sharma" required autofocus>
                </div>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label small fw-semibold text-secondary">Email Address</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-envelope"></i></span>
                    <input type="email" class="form-control border-start-0" id="email" name="email" value="<?= htmlspecialchars($email) ?>" placeholder="student@college.edu" required>
                </div>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label small fw-semibold text-secondary">Password</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-lock"></i></span>
                    <input type="password" class="form-control border-start-0" id="password" name="password" placeholder="At least 6 characters" required>
                </div>
            </div>

            <div class="mb-3">
                <label for="confirm_password" class="form-label small fw-semibold text-secondary">Confirm Password</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-shield-lock"></i></span>
                    <input type="password" class="form-control border-start-0" id="confirm_password" name="confirm_password" placeholder="Re-type password" required>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mt-2">
                Register Now <i class="bi bi-arrow-right ms-1"></i>
            </button>
        </form>

        <div class="text-center mt-4">
            <span class="text-muted small">Already have an account? </span>
            <a href="login.php" class="small fw-semibold text-primary text-decoration-none">Sign in here</a>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
