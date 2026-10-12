<?php
/**
 * User Login Page
 * Personal Expense Tracker
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireGuest();

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedToken = $_POST['csrf_token'] ?? '';
    if (!validateCsrfToken($submittedToken)) {
        $error = 'Security validation failed (Invalid CSRF token). Please try again.';
    } else {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            $error = 'Please enter both your email and password.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } else {
            $pdo = getDBConnection();
            $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                // Password matches! Regenerate session ID to prevent session fixation attacks
                session_regenerate_id(true);
                $_SESSION['user_id'] = (int)$user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];

                setFlash('success', 'Welcome back, ' . htmlspecialchars($user['name']) . '!');
                redirect('dashboard.php');
            } else {
                $error = 'Invalid email address or password. Please try again.';
            }
        }
    }
}

$pageTitle = 'Sign In';
$flash = getFlash();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - Personal Expense Tracker</title>
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
                <i class="bi bi-wallet2 fs-4"></i>
            </div>
            <h4 class="fw-bold text-slate-900 mb-1">Welcome Back</h4>
            <p class="text-muted small">Sign in to manage your income and expenses</p>
        </div>

        <?php if ($flash): ?>
            <div class="alert alert-<?= htmlspecialchars($flash['type']) ?> alert-dismissible fade show small mb-3">
                <?= htmlspecialchars($flash['message']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-danger alert-dismissible fade show small mb-3">
                <i class="bi bi-exclamation-circle-fill me-1"></i>
                <?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <form action="login.php" method="POST" autocomplete="off">
            <?= csrfField() ?>

            <div class="mb-3">
                <label for="email" class="form-label small fw-semibold text-secondary">Email Address</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-envelope"></i></span>
                    <input type="email" class="form-control border-start-0" id="email" name="email" value="<?= htmlspecialchars($email) ?>" placeholder="name@example.com" required autofocus>
                </div>
            </div>

            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <label for="password" class="form-label small fw-semibold text-secondary">Password</label>
                </div>
                <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-lock"></i></span>
                    <input type="password" class="form-control border-start-0" id="password" name="password" placeholder="Enter your password" required>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mt-2">
                Sign In <i class="bi bi-arrow-right ms-1"></i>
            </button>
        </form>

        <div class="card bg-light border-0 mt-4 p-2 text-center">
            <small class="text-muted" style="font-size: 11px;">
                <i class="bi bi-info-circle me-1"></i> Demo Credentials: <strong>student@college.edu</strong> / <strong>password123</strong>
            </small>
        </div>

        <div class="text-center mt-4">
            <span class="text-muted small">Don't have an account? </span>
            <a href="register.php" class="small fw-semibold text-primary text-decoration-none">Create account</a>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
