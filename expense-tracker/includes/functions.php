<?php
/**
 * Core Helper Functions
 * Personal Expense Tracker
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Sanitize string input to prevent XSS
 */
function sanitize(string $data): string {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Format currency with 2 decimals
 */
function formatCurrency(float $amount, string $symbol = '$'): string {
    return $symbol . number_format($amount, 2);
}

/**
 * Format date for display (e.g. Oct 12, 2026)
 */
function formatDate(string $dateStr): string {
    $timestamp = strtotime($dateStr);
    return $timestamp ? date('M d, Y', $timestamp) : $dateStr;
}

/**
 * Set a flash message for feedback
 */
function setFlash(string $type, string $message): void {
    $_SESSION['flash'] = [
        'type' => $type, // 'success', 'danger', 'warning', 'info'
        'message' => $message
    ];
}

/**
 * Retrieve and clear flash message
 */
function getFlash(): ?array {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

/**
 * Redirect to a given path and terminate script
 */
function redirect(string $url): void {
    header("Location: " . $url);
    exit;
}

/**
 * Fetch categories for a specific user (including global system categories)
 */
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

/**
 * Calculate Monthly Totals (Income, Expense, Balance)
 */
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
}
