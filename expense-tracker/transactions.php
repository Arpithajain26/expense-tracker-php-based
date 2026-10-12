<?php
/**
 * Transactions List, Search & Filter Management
 * Personal Expense Tracker
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();

$pdo = getDBConnection();
$user = currentUser();
$userId = (int)$user['id'];

// Filter parameters
$filterType = trim($_GET['type'] ?? '');
$filterCategory = !empty($_GET['category']) ? (int)$_GET['category'] : null;
$filterStartDate = trim($_GET['start_date'] ?? '');
$filterEndDate = trim($_GET['end_date'] ?? '');
$filterSearch = trim($_GET['search'] ?? '');

// Pagination
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

// Base query & bindings
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

if (!empty($filterSearch)) {
    $whereClauses[] = "t.description LIKE :search";
    $params[':search'] = '%' . $filterSearch . '%';
}

$whereSql = implode(' AND ', $whereClauses);

// Count Total Filtered Records
$countSql = "SELECT COUNT(*) FROM transactions t WHERE $whereSql";
$countStmt = $pdo->prepare($countSql);
$countStmt->execute($params);
$totalRecords = (int)$countStmt->fetchColumn();
$totalPages = ceil($totalRecords / $limit);

// Fetch Paginated Transactions
$dataSql = "SELECT t.*, c.name AS category_name 
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE $whereSql
            ORDER BY t.transaction_date DESC, t.id DESC
            LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($dataSql);
foreach ($params as $key => $val) {
    $stmt->bindValue($key, $val);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$transactions = $stmt->fetchAll();

// Fetch Categories for Filter Dropdown
$allCategories = getCategories($pdo, $userId);

$pageTitle = 'Transactions';
include __DIR__ . '/includes/header.php';
?>

<!-- Action Bar -->
<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
    <div>
        <h4 class="fw-bold mb-1 text-slate-900">Transactions Ledger</h4>
        <p class="text-muted small mb-0">Browse, filter, and manage all your historical entries</p>
    </div>
    <div class="d-flex gap-2">
        <a href="export-csv.php?<?= http_build_query($_GET) ?>" class="btn btn-outline-secondary fw-medium">
            <i class="bi bi-download me-1"></i>Export CSV
        </a>
        <a href="add-transaction.php" class="btn btn-primary fw-medium">
            <i class="bi bi-plus-lg me-1"></i>Add Transaction
        </a>
    </div>
</div>

<!-- Filter Panel -->
<div class="card border-0 shadow-sm rounded-3 bg-white mb-4">
    <div class="card-body p-3">
        <form method="GET" action="transactions.php" class="row g-2 align-items-end">
            <!-- Search Keyword -->
            <div class="col-12 col-md-3">
                <label class="form-label small fw-semibold text-secondary mb-1">Search Description</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" name="search" class="form-control border-start-0" placeholder="e.g. Grocery, Stipend" value="<?= htmlspecialchars($filterSearch) ?>">
                </div>
            </div>

            <!-- Type -->
            <div class="col-6 col-md-2">
                <label class="form-label small fw-semibold text-secondary mb-1">Type</label>
                <select name="type" class="form-select form-select-sm">
                    <option value="">All Types</option>
                    <option value="income" <?= $filterType === 'income' ? 'selected' : '' ?>>Income</option>
                    <option value="expense" <?= $filterType === 'expense' ? 'selected' : '' ?>>Expense</option>
                </select>
            </div>

            <!-- Category -->
            <div class="col-6 col-md-2">
                <label class="form-label small fw-semibold text-secondary mb-1">Category</label>
                <select name="category" class="form-select form-select-sm">
                    <option value="">All Categories</option>
                    <?php foreach ($allCategories as $cat): ?>
                        <option value="<?= $cat['id'] ?>" <?= $filterCategory === (int)$cat['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($cat['name']) ?> (<?= ucfirst($cat['type']) ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Start Date -->
            <div class="col-6 col-md-2">
                <label class="form-label small fw-semibold text-secondary mb-1">From Date</label>
                <input type="date" name="start_date" class="form-control form-control-sm" value="<?= htmlspecialchars($filterStartDate) ?>">
            </div>

            <!-- End Date -->
            <div class="col-6 col-md-2">
                <label class="form-label small fw-semibold text-secondary mb-1">To Date</label>
                <input type="date" name="end_date" class="form-control form-control-sm" value="<?= htmlspecialchars($filterEndDate) ?>">
            </div>

            <!-- Submit & Reset Buttons -->
            <div class="col-12 col-md-1 d-flex gap-1">
                <button type="submit" class="btn btn-sm btn-primary w-100" title="Apply Filter">
                    <i class="bi bi-funnel-fill"></i>
                </button>
                <a href="transactions.php" class="btn btn-sm btn-light border w-100" title="Reset Filters">
                    <i class="bi bi-arrow-clockwise"></i>
                </a>
            </div>
        </form>
    </div>
</div>

<!-- Transactions Table -->
<div class="card border-0 shadow-sm rounded-3 bg-white">
    <div class="table-responsive">
        <table class="table table-hover table-custom mb-0">
            <thead>
                <tr>
                    <th style="width: 140px;">Date</th>
                    <th style="width: 110px;">Type</th>
                    <th style="width: 180px;">Category</th>
                    <th>Description</th>
                    <th class="text-end" style="width: 150px;">Amount</th>
                    <th class="text-center" style="width: 110px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($transactions)): ?>
                    <tr>
                        <td colspan="6" class="text-center py-5 text-muted">
                            <i class="bi bi-search fs-2 d-block mb-2 text-secondary"></i>
                            No transactions found matching your criteria.<br>
                            <a href="transactions.php" class="btn btn-sm btn-outline-primary mt-2">Clear All Filters</a>
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($transactions as $tx): ?>
                        <tr>
                            <td class="text-secondary"><?= formatDate($tx['transaction_date']) ?></td>
                            <td>
                                <?php if ($tx['type'] === 'income'): ?>
                                    <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Income</span>
                                <?php else: ?>
                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Expense</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="category-tag"><?= htmlspecialchars($tx['category_name']) ?></span>
                            </td>
                            <td class="fw-medium text-slate-800">
                                <?= htmlspecialchars($tx['description']) ?>
                            </td>
                            <td class="text-end <?= $tx['type'] === 'income' ? 'text-income' : 'text-expense' ?>">
                                <?= ($tx['type'] === 'income' ? '+ ' : '- ') . formatCurrency($tx['amount']) ?>
                            </td>
                            <td class="text-center">
                                <a href="edit-transaction.php?id=<?= $tx['id'] ?>" class="btn btn-sm btn-light border text-secondary px-2 py-1 me-1" title="Edit Record">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <form action="actions/delete-transaction.php" method="POST" class="d-inline" onsubmit="return confirmDelete('Delete transaction &quot;<?= htmlspecialchars(addslashes($tx['description'])) ?>&quot;?');">
                                    <?= csrfField() ?>
                                    <input type="hidden" name="id" value="<?= $tx['id'] ?>">
                                    <button type="submit" class="btn btn-sm btn-light border text-danger px-2 py-1" title="Delete Record">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Pagination Footer -->
    <?php if ($totalPages > 1): ?>
        <div class="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
            <span class="small text-muted">
                Showing <?= $offset + 1 ?> to <?= min($offset + $limit, $totalRecords) ?> of <?= $totalRecords ?> transactions
            </span>
            <nav>
                <ul class="pagination pagination-sm mb-0">
                    <li class="page-item <?= $page <= 1 ? 'disabled' : '' ?>">
                        <a class="page-link" href="?<?= http_build_query(array_merge($_GET, ['page' => $page - 1])) ?>">Previous</a>
                    </li>
                    <?php for ($p = 1; $p <= $totalPages; $p++): ?>
                        <li class="page-item <?= $p === $page ? 'active' : '' ?>">
                            <a class="page-link" href="?<?= http_build_query(array_merge($_GET, ['page' => $p])) ?>"><?= $p ?></a>
                        </li>
                    <?php endfor; ?>
                    <li class="page-item <?= $page >= $totalPages ? 'disabled' : '' ?>">
                        <a class="page-link" href="?<?= http_build_query(array_merge($_GET, ['page' => $page + 1])) ?>">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    <?php endif; ?>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
