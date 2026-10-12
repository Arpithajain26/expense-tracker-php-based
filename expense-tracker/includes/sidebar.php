<?php
/**
 * Modern Dark Navy Sidebar Navigation
 * Personal Expense Tracker
 */
$current = basename($_SERVER['PHP_SELF']);
?>
<div class="sidebar text-white min-vh-100 flex-shrink-0" id="sidebar-wrapper">
    <!-- Brand / Logo -->
    <div class="sidebar-heading px-4 py-3 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-25">
        <div class="brand-icon rounded-3 d-flex align-items-center justify-content-center text-white">
            <i class="bi bi-wallet2 fs-5"></i>
        </div>
        <div>
            <div class="fw-bold tracking-tight text-white mb-0" style="font-size: 1.05rem;">ExpenseTracker</div>
            <small class="text-white-50" style="font-size: 11px;">Personal Finance v1.0</small>
        </div>
    </div>

    <!-- Navigation Menu -->
    <div class="list-group list-group-flush pt-3 px-3">
        <div class="menu-label text-uppercase text-secondary fw-semibold px-3 mb-2" style="font-size: 10px; letter-spacing: 0.08em;">
            Core Menus
        </div>

        <a href="dashboard.php" class="sidebar-link <?= $current === 'dashboard.php' ? 'active' : '' ?>">
            <i class="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
        </a>

        <a href="transactions.php" class="sidebar-link <?= ($current === 'transactions.php' || $current === 'edit-transaction.php') ? 'active' : '' ?>">
            <i class="bi bi-receipt-cutoff"></i>
            <span>Transactions</span>
        </a>

        <a href="add-transaction.php" class="sidebar-link <?= $current === 'add-transaction.php' ? 'active' : '' ?>">
            <i class="bi bi-plus-circle-fill"></i>
            <span>Add Transaction</span>
        </a>

        <a href="categories.php" class="sidebar-link <?= $current === 'categories.php' ? 'active' : '' ?>">
            <i class="bi bi-tags-fill"></i>
            <span>Categories</span>
        </a>

        <a href="reports.php" class="sidebar-link <?= $current === 'reports.php' ? 'active' : '' ?>">
            <i class="bi bi-bar-chart-line-fill"></i>
            <span>Reports & Analysis</span>
        </a>

        <div class="menu-label text-uppercase text-secondary fw-semibold px-3 mt-4 mb-2" style="font-size: 10px; letter-spacing: 0.08em;">
            Account & Security
        </div>

        <a href="profile.php" class="sidebar-link <?= $current === 'profile.php' ? 'active' : '' ?>">
            <i class="bi bi-person-gear"></i>
            <span>My Profile</span>
        </a>

        <a href="logout.php" class="sidebar-link text-danger-subtle hover-danger">
            <i class="bi bi-box-arrow-right"></i>
            <span>Sign Out</span>
        </a>
    </div>

    <!-- College Viva / Project Footer Widget in Sidebar -->
    <div class="mt-auto p-3 m-3 rounded-3 project-badge-card">
        <div class="d-flex align-items-center gap-2 mb-1">
            <i class="bi bi-mortarboard-fill text-primary"></i>
            <span class="small fw-semibold text-white">College Mini Project</span>
        </div>
        <p class="mb-0 text-white-50" style="font-size: 11px;">PHP 8 + MySQL (PDO) + Bootstrap 5 + Chart.js</p>
    </div>
</div>
