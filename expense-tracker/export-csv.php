<?php
/**
 * CSV Export Handler
 * Personal Expense Tracker
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();

$pdo = getDBConnection();
$user = currentUser();
$userId = (int)$user['id'];

// Filter parameters from query
$filterType = trim($_GET['type'] ?? '');
$filterCategory = !empty($_GET['category']) ? (int)$_GET['category'] : null;
$filterStartDate = trim($_GET['start_date'] ?? '');
$filterEndDate = trim($_GET['end_date'] ?? '');
$filterSearch = trim($_GET['search'] ?? '');
$filterMonth = !empty($_GET['month']) ? (int)$_GET['month'] : null;
$filterYear = !empty($_GET['year']) ? (int)$_GET['year'] : null;

$whereClauses = ["t.user_id = :user_id"];
$params = [':user_id' => $userId];

if ($filterType === 'income' || $filterType === 'expense') {
    $whereClauses[] = "t.type = :type";
    $params[':type'] = $filterType;
}

if ($filterCategory) {
    $whereClauses[] = "t.category_id = :category_id";
    $params[':category_id'] = $filterCategory;
}

if (!empty($filterStartDate)) {
    $whereClauses[] = "t.transaction_date >= :start_date";
    $params[':start_date'] = $filterStartDate;
}

if (!empty($filterEndDate)) {
    $whereClauses[] = "t.transaction_date <= :end_date";
    $params[':end_date'] = $filterEndDate;
}

if ($filterMonth && $filterYear) {
    $whereClauses[] = "YEAR(t.transaction_date) = :year AND MONTH(t.transaction_date) = :month";
    $params[':year'] = $filterYear;
    $params[':month'] = $filterMonth;
}

if (!empty($filterSearch)) {
    $whereClauses[] = "t.description LIKE :search";
    $params[':search'] = '%' . $filterSearch . '%';
}

$whereSql = implode(' AND ', $whereClauses);

$sql = "SELECT t.id, t.transaction_date, t.type, c.name AS category_name, t.amount, t.description, t.created_at
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE $whereSql
        ORDER BY t.transaction_date DESC, t.id DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

// Clean output buffer to avoid leading spaces/warnings corrupting CSV
if (ob_get_level()) {
    ob_end_clean();
}

$filename = "expense_tracker_export_" . date('Ymd_His') . ".csv";

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Pragma: no-cache');
header('Expires: 0');

$output = fopen('php://output', 'w');

// UTF-8 BOM for MS Excel compatibility
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// CSV Header Row
fputcsv($output, ['ID', 'Date', 'Type', 'Category', 'Amount ($)', 'Description', 'Recorded At']);

foreach ($rows as $row) {
    fputcsv($output, [
        $row['id'],
        $row['transaction_date'],
        strtoupper($row['type']),
        $row['category_name'],
        number_format((float)$row['amount'], 2, '.', ''),
        $row['description'],
        $row['created_at']
    ]);
}

fclose($output);
exit;
