<?php
/**
 * Shared Header Template
 * Personal Expense Tracker
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$currentPage = basename($_SERVER['PHP_SELF']);
$user = isset($_SESSION['user_id']) ? currentUser() : null;
$flash = getFlash();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) . ' - ' : '' ?>Personal Expense Tracker</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom Application CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light">

<?php if ($user): ?>
<div class="d-flex" id="wrapper">
    <!-- Sidebar Navigation -->
    <?php include __DIR__ . '/sidebar.php'; ?>

    <!-- Page Content Wrapper -->
    <div id="page-content-wrapper" class="w-100 min-vh-100 d-flex flex-column">
        <!-- Top Navigation Bar -->
        <nav class="navbar navbar-expand-lg navbar-white bg-white border-bottom px-4 py-3 sticky-top">
            <div class="container-fluid p-0">
                <button class="btn btn-outline-secondary d-md-none me-2" id="sidebarToggle">
                    <i class="bi bi-list fs-5"></i>
                </button>
                <div class="d-flex align-items-center">
                    <h5 class="mb-0 fw-semibold text-slate-800"><?= htmlspecialchars($pageTitle ?? 'Expense Tracker') ?></h5>
                </div>

                <div class="ms-auto d-flex align-items-center gap-3">
                    <div class="dropdown">
                        <button class="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center gap-2 p-0 text-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 38px; height: 38px;">
                                <?= strtoupper(substr($user['name'], 0, 1)) ?>
                            </div>
                            <div class="d-none d-sm-block text-start">
                                <div class="fw-semibold text-dark small lh-1"><?= htmlspecialchars($user['name']) ?></div>
                                <span class="text-muted" style="font-size: 11px;"><?= htmlspecialchars($user['email']) ?></span>
                            </div>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                            <li><a class="dropdown-item py-2" href="profile.php"><i class="bi bi-person me-2 text-secondary"></i>My Profile</a></li>
                            <li><hr class="dropdown-divider my-1"></li>
                            <li><a class="dropdown-item py-2 text-danger" href="logout.php"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content Container -->
        <main class="container-fluid px-4 py-4 flex-grow-1">
            <?php if ($flash): ?>
                <div class="alert alert-<?= htmlspecialchars($flash['type']) ?> alert-dismissible fade show shadow-sm border-0 mb-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="bi <?= $flash['type'] === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger' ?> fs-5 me-2"></i>
                        <span><?= htmlspecialchars($flash['message']) ?></span>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>
<?php endif; ?>
