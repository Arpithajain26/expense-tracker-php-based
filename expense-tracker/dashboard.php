<?php
/**
 * Main User Dashboard
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

// Month & Year Filter (defaults to current month & year)
$currentYear = (int)date('Y');
$currentMonth = (int)date('m');

$selectedYear = isset($_GET['year']) ? (int)$_GET['year'] : $currentYear;
$selectedMonth = isset($_GET['month']) ? (int)$_GET['month'] : $currentMonth;

// Validate boundary
if ($selectedMonth < 1 || $selectedMonth > 12) $selectedMonth = $currentMonth;
if ($selectedYear < 2000 || $selectedYear > 2099) $selectedYear = $currentYear;

// 1. Fetch Monthly Totals
$summary = getMonthlySummary($pdo, $userId, $selectedYear, $selectedMonth);

// 2. Fetch Category Breakdown for Expense Doughnut Chart
$categorySql = "SELECT c.name, SUM(t.amount) AS total_amount
                FROM transactions t
                JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = :user_id 
                  AND t.type = 'expense'
                  AND YEAR(t.transaction_date) = :year 
                  AND MONTH(t.transaction_date) = :month
                GROUP BY c.id, c.name
                ORDER BY total_amount DESC";

$categoryStmt = $pdo->prepare($categorySql);
$categoryStmt->execute([
    ':user_id' => $userId,
    ':year'    => $selectedYear,
    ':month'   => $selectedMonth
]);
$categoryBreakdown = $categoryStmt->fetchAll();

$chartCategoryLabels = [];
$chartCategoryData = [];
foreach ($categoryBreakdown as $row) {
    $chartCategoryLabels[] = $row['name'];
    $chartCategoryData[] = (float)$row['total_amount'];
}

// 3. Fetch Last 6 Months Trends for Bar Chart
$sixMonthTrends = [];
for ($i = 5; $i >= 0; $i--) {
    $mTime = strtotime("-$i months", strtotime("$selectedYear-$selectedMonth-01"));
    $y = (int)date('Y', $mTime);
    $m = (int)date('m', $mTime);
    $mLabel = date('M Y', $mTime);

    $mSummary = getMonthlySummary($pdo, $userId, $y, $m);
    $sixMonthTrends[] = [
        'label'   => $mLabel,
        'income'  => $mSummary['income'],
        'expense' => $mSummary['expense']
    ];
}

// 4. Fetch 5 Recent Transactions
$recentSql = "SELECT t.*, c.name AS category_name 
              FROM transactions t
              JOIN categories c ON t.category_id = c.id
              WHERE t.user_id = :user_id
              ORDER BY t.transaction_date DESC, t.id DESC
              LIMIT 5";

$recentStmt = $pdo->prepare($recentSql);
$recentStmt->execute([':user_id' => $userId]);
$recentTransactions = $recentStmt->fetchAll();

$pageTitle = 'Financial Dashboard';
include __DIR__ . '/includes/header.php';
?>

<!-- Month & Year Filter Bar -->
<div class="row align-items-center mb-4 g-3">
    <div class="col-12 col-md-auto me-auto">
        <h4 class="fw-bold mb-1 text-slate-900">Dashboard Overview</h4>
        <p class="text-muted small mb-0">
            Showing records for <strong><?= date('F Y', mktime(0, 0, 0, $selectedMonth, 1, $selectedYear)) ?></strong>
        </p>
    </div>
    <div class="col-12 col-md-auto">
        <form method="GET" action="dashboard.php" class="d-flex align-items-center gap-2">
            <select name="month" class="form-select form-select-sm bg-white" style="width: 140px;">
                <?php for ($m = 1; $m <= 12; $m++): ?>
                    <option value="<?= $m ?>" <?= $m === $selectedMonth ? 'selected' : '' ?>>
                        <?= date('F', mktime(0, 0, 0, $m, 1)) ?>
                    </option>
                <?php endfor; ?>
            </select>
            <select name="year" class="form-select form-select-sm bg-white" style="width: 100px;">
                <?php for ($y = $currentYear + 1; $y >= $currentYear - 4; $y--): ?>
                    <option value="<?= $y ?>" <?= $y === $selectedYear ? 'selected' : '' ?>><?= $y ?></option>
                <?php endfor; ?>
            </select>
            <button type="submit" class="btn btn-sm btn-outline-primary fw-medium px-3">
                <i class="bi bi-filter me-1"></i>Filter
            </button>
        </form>
    </div>
    <div class="col-12 col-md-auto d-flex gap-2">
        <a href="add-transaction.php?type=income" class="btn btn-sm btn-success fw-medium">
            <i class="bi bi-plus-lg me-1"></i>Add Income
        </a>
        <a href="add-transaction.php?type=expense" class="btn btn-sm btn-danger fw-medium">
            <i class="bi bi-dash-lg me-1"></i>Add Expense
        </a>
    </div>
</div>

<!-- 4 Key Metric Summary Cards -->
<div class="row g-3 mb-4">
    <!-- Total Income -->
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
            <div class="stat-icon income flex-shrink-0">
                <i class="bi bi-arrow-down-left"></i>
            </div>
            <div>
                <span class="text-muted small fw-medium text-uppercase" style="font-size: 11px;">Total Income</span>
                <h4 class="fw-bold mb-0 text-slate-900"><?= formatCurrency($summary['income']) ?></h4>
            </div>
        </div>
    </div>

    <!-- Total Expenses -->
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
            <div class="stat-icon expense flex-shrink-0">
                <i class="bi bi-arrow-up-right"></i>
            </div>
            <div>
                <span class="text-muted small fw-medium text-uppercase" style="font-size: 11px;">Total Expenses</span>
                <h4 class="fw-bold mb-0 text-slate-900"><?= formatCurrency($summary['expense']) ?></h4>
            </div>
        </div>
    </div>

    <!-- Net Balance -->
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
            <div class="stat-icon balance flex-shrink-0">
                <i class="bi bi-wallet2"></i>
            </div>
            <div>
                <span class="text-muted small fw-medium text-uppercase" style="font-size: 11px;">Net Balance</span>
                <h4 class="fw-bold mb-0 <?= $summary['balance'] >= 0 ? 'text-primary' : 'text-danger' ?>">
                    <?= formatCurrency($summary['balance']) ?>
                </h4>
            </div>
        </div>
    </div>

    <!-- Transactions Count -->
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
            <div class="stat-icon count flex-shrink-0">
                <i class="bi bi-receipt"></i>
            </div>
            <div>
                <span class="text-muted small fw-medium text-uppercase" style="font-size: 11px;">Monthly Entries</span>
                <h4 class="fw-bold mb-0 text-slate-900"><?= $summary['count'] ?></h4>
            </div>
        </div>
    </div>
</div>

<!-- Charts Section -->
<div class="row g-4 mb-4">
    <!-- Trend Chart (Bar Chart) -->
    <div class="col-12 col-lg-7">
        <div class="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-semibold text-slate-900 mb-0">Income vs. Expense Trend</h6>
                <span class="badge bg-light text-secondary border">Last 6 Months</span>
            </div>
            <div style="position: relative; height: 280px;">
                <canvas id="monthlyTrendChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Category Breakdown Doughnut Chart -->
    <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-semibold text-slate-900 mb-0">Expense by Category</h6>
                <span class="badge bg-light text-secondary border"><?= date('M Y', mktime(0, 0, 0, $selectedMonth, 1, $selectedYear)) ?></span>
            </div>
            <div style="position: relative; height: 280px;">
                <?php if (empty($chartCategoryData)): ?>
                    <div class="h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted">
                        <i class="bi bi-pie-chart text-secondary opacity-50 display-4 mb-2"></i>
                        <p class="small mb-0">No expense records found for this month.</p>
                        <a href="add-transaction.php?type=expense" class="btn btn-sm btn-link text-decoration-none">Record Expense</a>
                    </div>
                <?php else: ?>
                    <canvas id="categoryDoughnutChart"></canvas>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Recent Transactions Table -->
<div class="card border-0 shadow-sm rounded-3 bg-white">
    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <div>
            <h6 class="fw-semibold text-slate-900 mb-0">Recent Transactions</h6>
            <small class="text-muted">Showing latest 5 activity entries</small>
        </div>
        <a href="transactions.php" class="btn btn-sm btn-outline-secondary">
            View All <i class="bi bi-chevron-right ms-1"></i>
        </a>
    </div>
    <div class="table-responsive">
        <table class="table table-hover table-custom mb-0">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th class="text-end">Amount</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($recentTransactions)): ?>
                    <tr>
                        <td colspan="6" class="text-center py-5 text-muted">
                            <i class="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                            No transactions recorded yet. <br>
                            <a href="add-transaction.php" class="btn btn-sm btn-primary mt-2">Add First Transaction</a>
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($recentTransactions as $tx): ?>
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
                            <td class="fw-medium text-slate-800"><?= htmlspecialchars($tx['description']) ?></td>
                            <td class="text-end <?= $tx['type'] === 'income' ? 'text-income' : 'text-expense' ?>">
                                <?= ($tx['type'] === 'income' ? '+ ' : '- ') . formatCurrency($tx['amount']) ?>
                            </td>
                            <td class="text-center">
                                <a href="edit-transaction.php?id=<?= $tx['id'] ?>" class="btn btn-sm btn-light border text-secondary px-2 py-1 me-1" title="Edit">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <form action="actions/delete-transaction.php" method="POST" class="d-inline" onsubmit="return confirmDelete('Are you sure you want to delete this transaction?');">
                                    <?= csrfField() ?>
                                    <input type="hidden" name="id" value="<?= $tx['id'] ?>">
                                    <button type="submit" class="btn btn-sm btn-light border text-danger px-2 py-1" title="Delete">
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
</div>

<!-- Chart.js Scripts Initialization -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    // 1. Bar Chart: Monthly Trends
    const trendCtx = document.getElementById('monthlyTrendChart');
    if (trendCtx) {
        const trendData = <?= json_encode($sixMonthTrends) ?>;
        new Chart(trendCtx, {
            type: 'bar',
            data: {
                labels: trendData.map(d => d.label),
                datasets: [
                    {
                        label: 'Income',
                        data: trendData.map(d => d.income),
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    },
                    {
                        label: 'Expense',
                        data: trendData.map(d => d.expense),
                        backgroundColor: '#ef4444',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    // 2. Doughnut Chart: Category Breakdown
    const categoryCtx = document.getElementById('categoryDoughnutChart');
    if (categoryCtx) {
        const catLabels = <?= json_encode($chartCategoryLabels) ?>;
        const catData = <?= json_encode($chartCategoryData) ?>;
        
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: catLabels,
                datasets: [{
                    data: catData,
                    backgroundColor: [
                        '#ef4444', '#f97316', '#f59e0b', '#10b981', 
                        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
});
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
