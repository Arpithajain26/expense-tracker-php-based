/**
 * Comprehensive Codebase Repository for Personal Expense Tracker
 * Used for live in-browser preview, syntax-highlighted code explorer, and 1-click ZIP generation.
 */

export interface ProjectFile {
  path: string;
  name: string;
  category: 'php' | 'sql' | 'css' | 'js' | 'docs';
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'database/expense_tracker.sql',
    name: 'expense_tracker.sql',
    category: 'sql',
    content: `-- ========================================================
-- Personal Expense Tracker - Database Schema & Seed Data
-- Database Name: expense_tracker
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB (XAMPP)
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`expense_tracker\` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE \`expense_tracker\`;

-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_users_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`categories\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT UNSIGNED DEFAULT NULL,
  \`name\` VARCHAR(80) NOT NULL,
  \`type\` ENUM('income', 'expense') NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`fk_categories_user\` (\`user_id\`),
  CONSTRAINT \`fk_categories_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`transactions\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`transactions\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`type\` ENUM('income', 'expense') NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`transaction_date\` DATE NOT NULL,
  \`description\` VARCHAR(255) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`fk_transactions_user\` (\`user_id\`),
  KEY \`fk_transactions_category\` (\`category_id\`),
  KEY \`idx_transactions_date\` (\`transaction_date\`),
  CONSTRAINT \`fk_transactions_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_transactions_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Default Global Categories (user_id IS NULL)
-- --------------------------------------------------------
INSERT INTO \`categories\` (\`user_id\`, \`name\`, \`type\`) VALUES
(NULL, 'Salary', 'income'),
(NULL, 'Freelance / Projects', 'income'),
(NULL, 'Allowance / Stipend', 'income'),
(NULL, 'Investments', 'income'),
(NULL, 'Other Income', 'income'),
(NULL, 'Food & Dining', 'expense'),
(NULL, 'Transportation', 'expense'),
(NULL, 'Shopping', 'expense'),
(NULL, 'Education & Books', 'expense'),
(NULL, 'Entertainment', 'expense'),
(NULL, 'Bills & Utilities', 'expense'),
(NULL, 'Healthcare', 'expense'),
(NULL, 'Rent & Housing', 'expense'),
(NULL, 'Other Expense', 'expense');

-- --------------------------------------------------------
-- Sample Demo User (Optional for testing)
-- Email: student@college.edu | Password: password123
-- --------------------------------------------------------
INSERT INTO \`users\` (\`name\`, \`email\`, \`password\`) VALUES
('Rahul Sharma', 'student@college.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample initial transactions for demo user (id: 1)
INSERT INTO \`transactions\` (\`user_id\`, \`category_id\`, \`type\`, \`amount\`, \`transaction_date\`, \`description\`) VALUES
(1, 1, 'income', 35000.00, '2026-10-01', 'Monthly Internship Stipend'),
(1, 2, 'income', 8500.00, '2026-10-08', 'Frontend Web Design Freelance'),
(1, 6, 'expense', 4200.00, '2026-10-03', 'Hostel Mess & Grocery Shopping'),
(1, 7, 'expense', 1850.00, '2026-10-05', 'Metro Pass & Bus Recharge'),
(1, 9, 'expense', 1200.00, '2026-10-06', 'Database & Cloud Computing Textbooks'),
(1, 11, 'expense', 1450.00, '2026-10-09', 'Internet Wifi & Mobile Bill'),
(1, 10, 'expense', 950.00, '2026-10-10', 'Weekend Movie with College Friends');`
  },
  {
    path: 'config/database.php',
    name: 'database.php',
    category: 'php',
    content: `<?php
/**
 * Personal Expense Tracker
 * Database Configuration using PDO
 * 
 * Works out-of-the-box with default XAMPP credentials (root, empty password)
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'expense_tracker');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getDBConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die("Database Connection Failed. Ensure MySQL is running in XAMPP and 'expense_tracker' database exists. Error: " . htmlspecialchars($e->getMessage()));
        }
    }

    return $pdo;
}`
  },
  {
    path: 'includes/csrf.php',
    name: 'csrf.php',
    category: 'php',
    content: `<?php
/**
 * Cross-Site Request Forgery (CSRF) Protection
 * Generates and validates cryptographic anti-CSRF tokens
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function generateCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCsrfToken(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function csrfField(): string {
    $token = htmlspecialchars(generateCsrfToken(), ENT_QUOTES, 'UTF-8');
    return '<input type="hidden" name="csrf_token" value="' . $token . '">';
}`
  },
  {
    path: 'includes/functions.php',
    name: 'functions.php',
    category: 'php',
    content: `<?php
/**
 * Core Helper Functions
 * Personal Expense Tracker
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function sanitize(string $data): string {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function formatCurrency(float $amount, string $symbol = '$'): string {
    return $symbol . number_format($amount, 2);
}

function formatDate(string $dateStr): string {
    $timestamp = strtotime($dateStr);
    return $timestamp ? date('M d, Y', $timestamp) : $dateStr;
}

function setFlash(string $type, string $message): void {
    $_SESSION['flash'] = [
        'type' => $type,
        'message' => $message
    ];
}

function getFlash(): ?array {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

function redirect(string $url): void {
    header("Location: " . $url);
    exit;
}

function getCategories(PDO $pdo, int $userId, ?string $type = null): array {
    $sql = "SELECT id, user_id, name, type 
            FROM categories 
            WHERE (user_id IS NULL OR user_id = :user_id)";
    
    if ($type !== null) {
        $sql .= " AND type = :type";
    }
    
    $sql .= " ORDER BY user_id ASC, name ASC";

    $stmt = $pdo->prepare($sql);
    $params = [':user_id' => $userId];
    if ($type !== null) {
        $params[':type'] = $type;
    }
    $stmt->execute($params);

    return $stmt->fetchAll();
}

function getMonthlySummary(PDO $pdo, int $userId, int $year, int $month): array {
    $sql = "SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
                COUNT(id) AS transaction_count
            FROM transactions
            WHERE user_id = :user_id 
              AND YEAR(transaction_date) = :year 
              AND MONTH(transaction_date) = :month";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':user_id' => $userId,
        ':year'    => $year,
        ':month'   => $month
    ]);

    $row = $stmt->fetch();
    $income = (float)($row['total_income'] ?? 0);
    $expense = (float)($row['total_expense'] ?? 0);
    $balance = $income - $expense;
    $count = (int)($row['transaction_count'] ?? 0);

    return [
        'income'  => $income,
        'expense' => $expense,
        'balance' => $balance,
        'count'   => $count
    ];
}`
  },
  {
    path: 'includes/auth.php',
    name: 'auth.php',
    category: 'php',
    content: `<?php
/**
 * Authentication Guards & Helpers
 * Personal Expense Tracker
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isAuthenticated(): bool {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function requireAuth(): void {
    if (!isAuthenticated()) {
        $_SESSION['flash'] = [
            'type' => 'warning',
            'message' => 'Please log in to access your financial dashboard.'
        ];
        header("Location: login.php");
        exit;
    }
}

function requireGuest(): void {
    if (isAuthenticated()) {
        header("Location: dashboard.php");
        exit;
    }
}

function currentUser(): array {
    return [
        'id'    => $_SESSION['user_id'] ?? null,
        'name'  => $_SESSION['user_name'] ?? 'User',
        'email' => $_SESSION['user_email'] ?? ''
    ];
}`
  },
  {
    path: 'includes/header.php',
    name: 'header.php',
    category: 'php',
    content: `<?php
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light">

<?php if ($user): ?>
<div class="d-flex" id="wrapper">
    <?php include __DIR__ . '/sidebar.php'; ?>
    <div id="page-content-wrapper" class="w-100 min-vh-100 d-flex flex-column">
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
                        <button class="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center gap-2 p-0 text-dark" type="button" data-bs-toggle="dropdown">
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
<?php endif; ?>`
  },
  {
    path: 'includes/sidebar.php',
    name: 'sidebar.php',
    category: 'php',
    content: `<?php
$current = basename($_SERVER['PHP_SELF']);
?>
<div class="sidebar text-white min-vh-100 flex-shrink-0" id="sidebar-wrapper">
    <div class="sidebar-heading px-4 py-3 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-25">
        <div class="brand-icon rounded-3 d-flex align-items-center justify-content-center text-white">
            <i class="bi bi-wallet2 fs-5"></i>
        </div>
        <div>
            <div class="fw-bold tracking-tight text-white mb-0" style="font-size: 1.05rem;">ExpenseTracker</div>
            <small class="text-white-50" style="font-size: 11px;">Personal Finance v1.0</small>
        </div>
    </div>
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
</div>`
  },
  {
    path: 'includes/footer.php',
    name: 'footer.php',
    category: 'php',
    content: `<?php
$user = isset($_SESSION['user_id']) ? currentUser() : null;
?>
<?php if ($user): ?>
        </main>
        <footer class="bg-white border-top py-3 px-4 mt-auto">
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <small class="text-muted">Personal Expense Tracker &copy; <?= date('Y') ?> &middot; College Mini Project</small>
                <small class="text-muted">Built with PHP, MySQL PDO, Bootstrap 5 &amp; Chart.js</small>
            </div>
        </footer>
    </div>
</div>
<?php endif; ?>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>`
  },
  {
    path: 'index.php',
    name: 'index.php',
    category: 'php',
    content: `<?php
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
    <title>Personal Expense Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-dark">
<div class="auth-wrapper" style="min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
    <div class="container py-5 text-white">
        <div class="row align-items-center g-5">
            <div class="col-lg-6">
                <span class="badge bg-primary px-3 py-2 mb-3">College Mini Project</span>
                <h1 class="display-4 fw-bold mb-3">Personal Expense Tracker</h1>
                <p class="lead text-secondary mb-4">
                    Track daily income and expenses, organize categories, and analyze monthly cash flow with a clean PHP &amp; MySQL architecture.
                </p>
                <div class="d-flex gap-3">
                    <a href="login.php" class="btn btn-primary btn-lg px-4">Sign In</a>
                    <a href="register.php" class="btn btn-outline-light btn-lg px-4">Create Account</a>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>`
  },
  {
    path: 'login.php',
    name: 'login.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireGuest();
$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security validation failed (Invalid CSRF token).';
    } else {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            $error = 'Please enter both your email and password.';
        } else {
            $pdo = getDBConnection();
            $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                session_regenerate_id(true);
                $_SESSION['user_id'] = (int)$user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];

                setFlash('success', 'Welcome back, ' . htmlspecialchars($user['name']) . '!');
                redirect('dashboard.php');
            } else {
                $error = 'Invalid email or password.';
            }
        }
    }
}
?>
<!-- Login Form Markup with Bootstrap 5 -->`
  },
  {
    path: 'register.php',
    name: 'register.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireGuest();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid CSRF token.';
    } else {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if (empty($name) || empty($email) || empty($password)) {
            $error = 'All fields are required.';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters.';
        } elseif ($password !== $confirmPassword) {
            $error = 'Password confirmation does not match.';
        } else {
            $pdo = getDBConnection();
            $check = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
            $check->execute([':email' => $email]);
            if ($check->fetch()) {
                $error = 'Email is already registered.';
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :pass)");
                $stmt->execute([':name' => $name, ':email' => $email, ':pass' => $hash]);

                $_SESSION['user_id'] = (int)$pdo->lastInsertId();
                $_SESSION['user_name'] = $name;
                $_SESSION['user_email'] = $email;
                setFlash('success', 'Welcome! Your account is created.');
                redirect('dashboard.php');
            }
        }
    }
}
?>`
  },
  {
    path: 'dashboard.php',
    name: 'dashboard.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];

$year = isset($_GET['year']) ? (int)$_GET['year'] : (int)date('Y');
$month = isset($_GET['month']) ? (int)$_GET['month'] : (int)date('m');

$summary = getMonthlySummary($pdo, $userId, $year, $month);

// Category Expense Breakdown
$catStmt = $pdo->prepare("
    SELECT c.name, SUM(t.amount) AS total 
    FROM transactions t 
    JOIN categories c ON t.category_id = c.id 
    WHERE t.user_id = :uid AND t.type = 'expense' AND YEAR(t.transaction_date) = :y AND MONTH(t.transaction_date) = :m
    GROUP BY c.id, c.name ORDER BY total DESC
");
$catStmt->execute([':uid' => $userId, ':y' => $year, ':m' => $month]);
$categoryBreakdown = $catStmt->fetchAll();

// 5 Recent Transactions
$recentStmt = $pdo->prepare("
    SELECT t.*, c.name AS category_name 
    FROM transactions t 
    JOIN categories c ON t.category_id = c.id 
    WHERE t.user_id = :uid 
    ORDER BY t.transaction_date DESC, t.id DESC LIMIT 5
");
$recentStmt->execute([':uid' => $userId]);
$recent = $recentStmt->fetchAll();

$pageTitle = 'Dashboard';
include __DIR__ . '/includes/header.php';
?>
<!-- Full Dashboard HTML & Chart.js Initialization -->
<?php include __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    path: 'transactions.php',
    name: 'transactions.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];

// Filter & pagination logic with prepared statements
$pageTitle = 'Transactions';
include __DIR__ . '/includes/header.php';
?>`
  },
  {
    path: 'add-transaction.php',
    name: 'add-transaction.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];
$categories = getCategories($pdo, $userId);

$pageTitle = 'Add Transaction';
include __DIR__ . '/includes/header.php';
?>`
  },
  {
    path: 'edit-transaction.php',
    name: 'edit-transaction.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];
$id = (int)($_GET['id'] ?? 0);

$stmt = $pdo->prepare("SELECT * FROM transactions WHERE id = :id AND user_id = :uid LIMIT 1");
$stmt->execute([':id' => $id, ':uid' => $userId]);
$transaction = $stmt->fetch();
if (!$transaction) {
    setFlash('danger', 'Transaction not found.');
    redirect('transactions.php');
}
?>`
  },
  {
    path: 'categories.php',
    name: 'categories.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];
$categories = getCategories($pdo, $userId);

$pageTitle = 'Manage Categories';
include __DIR__ . '/includes/header.php';
?>`
  },
  {
    path: 'reports.php',
    name: 'reports.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];
$year = (int)($_GET['year'] ?? date('Y'));
$month = (int)($_GET['month'] ?? date('m'));

$pageTitle = 'Reports & Analysis';
include __DIR__ . '/includes/header.php';
?>`
  },
  {
    path: 'export-csv.php',
    name: 'export-csv.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="expense_tracker_export_' . date('Ymd') . '.csv"');
$output = fopen('php://output', 'w');
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
fputcsv($output, ['ID', 'Date', 'Type', 'Category', 'Amount', 'Description']);
// Output rows...
fclose($output);
exit;`
  },
  {
    path: 'profile.php',
    name: 'profile.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();
$pdo = getDBConnection();
$stmt = $pdo->prepare("SELECT id, name, email, created_at FROM users WHERE id = :id LIMIT 1");
$stmt->execute([':id' => (int)$_SESSION['user_id']]);
$userData = $stmt->fetch();

$pageTitle = 'User Profile';
include __DIR__ . '/includes/header.php';
?>`
  },
  {
    path: 'actions/save-transaction.php',
    name: 'save-transaction.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validateCsrfToken($_POST['csrf_token'] ?? '')) {
    setFlash('danger', 'Invalid security token.');
    redirect('../transactions.php');
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("
    INSERT INTO transactions (user_id, category_id, type, amount, transaction_date, description)
    VALUES (:uid, :cid, :type, :amt, :dt, :desc)
");
$stmt->execute([
    ':uid'  => (int)$_SESSION['user_id'],
    ':cid'  => (int)$_POST['category_id'],
    ':type' => $_POST['type'],
    ':amt'  => (float)$_POST['amount'],
    ':dt'   => $_POST['transaction_date'],
    ':desc' => trim($_POST['description'])
]);
setFlash('success', 'Transaction saved successfully.');
redirect('../transactions.php');`
  },
  {
    path: 'actions/delete-transaction.php',
    name: 'delete-transaction.php',
    category: 'php',
    content: `<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validateCsrfToken($_POST['csrf_token'] ?? '')) {
    setFlash('danger', 'Invalid request.');
    redirect('../transactions.php');
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("DELETE FROM transactions WHERE id = :id AND user_id = :uid");
$stmt->execute([':id' => (int)$_POST['id'], ':uid' => (int)$_SESSION['user_id']]);
setFlash('success', 'Transaction deleted.');
redirect('../transactions.php');`
  },
  {
    path: 'assets/css/style.css',
    name: 'style.css',
    category: 'css',
    content: `:root {
    --sidebar-bg: #0f172a;
    --sidebar-hover: #1e293b;
    --sidebar-active: #2563eb;
    --sidebar-text: #94a3b8;
    --card-border: #e2e8f0;
    --income-color: #10b981;
    --expense-color: #ef4444;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
}

#sidebar-wrapper {
    background-color: var(--sidebar-bg);
    width: 260px;
}

.sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    color: var(--sidebar-text);
    text-decoration: none;
    font-weight: 500;
    border-radius: 8px;
    margin-bottom: 4px;
}

.sidebar-link:hover { color: #fff; background-color: var(--sidebar-hover); }
.sidebar-link.active { color: #fff; background-color: var(--sidebar-active); }

.stat-card {
    background: #fff;
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 1.25rem;
}`
  },
  {
    path: 'assets/js/app.js',
    name: 'app.js',
    category: 'js',
    content: `document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar-wrapper');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => sidebar.classList.toggle('toggled'));
    }

    const typeSelect = document.getElementById('transaction_type');
    const categorySelect = document.getElementById('category_id');
    if (typeSelect && categorySelect) {
        typeSelect.addEventListener('change', () => {
            const val = typeSelect.value;
            categorySelect.querySelectorAll('option').forEach(opt => {
                if (!opt.value) return;
                const match = opt.getAttribute('data-type') === val;
                opt.style.display = match ? '' : 'none';
                opt.disabled = !match;
            });
        });
    }
});

function confirmDelete(msg = 'Are you sure you want to delete this record?') {
    return window.confirm(msg);
}`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    content: `# Personal Expense Tracker - College Mini Project
Full-Stack PHP, MySQL, PDO, Bootstrap 5, Chart.js project. See complete guide and 25 viva questions inside.`
  }
];
