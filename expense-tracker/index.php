<?php
/**
 * Personal Expense Tracker - Welcome / Landing Page
 * Redirects authenticated users to dashboard
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

if (isAuthenticated()) {
    redirect('dashboard.php');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Expense Tracker - Track Income &amp; Expenses Easily</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .hero-section {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body class="bg-dark">

<div class="hero-section">
    <div class="container py-5">
        <div class="row align-items-center g-5">
            <div class="col-lg-6">
                <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4);">
                    <i class="bi bi-mortarboard-fill text-primary"></i>
                    <span class="small text-info fw-semibold">College Mini Project &middot; PHP &amp; MySQL</span>
                </div>
                <h1 class="display-4 fw-bold mb-3 tracking-tight">Master Your Daily Spending With Confidence</h1>
                <p class="lead text-secondary mb-4">
                    A clean, secure, and modern Personal Expense Tracker designed to record daily income, categorize expenses, visualize monthly financial health, and export reports.
                </p>
                <div class="d-flex flex-wrap gap-3">
                    <a href="login.php" class="btn btn-primary btn-lg px-4 shadow-sm fw-semibold">
                        <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                    </a>
                    <a href="register.php" class="btn btn-outline-light btn-lg px-4 fw-semibold">
                        <i class="bi bi-person-plus me-2"></i>Create Free Account
                    </a>
                </div>

                <div class="mt-5 pt-4 border-top border-secondary border-opacity-25 d-flex gap-4 text-secondary small">
                    <div><i class="bi bi-shield-check text-success me-1"></i> Bcrypt Passwords</div>
                    <div><i class="bi bi-database-check text-primary me-1"></i> MySQL Prepared Statements</div>
                    <div><i class="bi bi-pie-chart-fill text-warning me-1"></i> Chart.js Visuals</div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="row g-3">
                    <div class="col-sm-6">
                        <div class="feature-card">
                            <div class="stat-icon income mb-3">
                                <i class="bi bi-arrow-down-left"></i>
                            </div>
                            <h5 class="fw-semibold text-white">Income Tracking</h5>
                            <p class="text-secondary small mb-0">Record salaries, stipends, and freelance earnings by custom sources.</p>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="feature-card">
                            <div class="stat-icon expense mb-3">
                                <i class="bi bi-arrow-up-right"></i>
                            </div>
                            <h5 class="fw-semibold text-white">Expense Categorization</h5>
                            <p class="text-secondary small mb-0">Break down spending into food, travel, rent, education, and leisure.</p>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="feature-card">
                            <div class="stat-icon balance mb-3">
                                <i class="bi bi-graph-up-arrow"></i>
                            </div>
                            <h5 class="fw-semibold text-white">Visual Analytics</h5>
                            <p class="text-secondary small mb-0">Interactive bar and doughnut charts powered by Chart.js.</p>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="feature-card">
                            <div class="stat-icon count mb-3">
                                <i class="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <h5 class="fw-semibold text-white">CSV Export</h5>
                            <p class="text-secondary small mb-0">Download filtered transactions directly into Excel or Google Sheets.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
