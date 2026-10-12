<?php
/**
 * Reports and Analytics Page
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

$currentYear = (int)date('Y');
$currentMonth = (int)date('m');

$selectedYear = isset($_GET['year']) ? (int)$_GET['year'] : $currentYear;
$selectedMonth = isset($_GET['month']) ? (int)$_GET['month'] : $currentMonth;

// 1. Monthly Summary
$summary = getMonthlySummary($pdo, $userId, $selectedYear, $selectedMonth);

// 2. Category Breakdown with Percentage Share
$catSql = "SELECT c.name, c.type, SUM(t.amount) AS total_amount, COUNT(t.id) as tx_count
           FROM transactions t
           JOIN categories c ON t.category_id = c.id
           WHERE t.user_id = :user_id 
             AND YEAR(t.transaction_date) = :year 
             AND MONTH(t.transaction_date) = :month
           GROUP BY c.id, c.name, c.type
           ORDER BY total_amount DESC";

$catStmt = $pdo->prepare($catSql);
$catStmt->execute([
    ':user_id' => $userId,
    ':year'    => $selectedYear,
    ':month'   => $selectedMonth
]);
$categoryBreakdown = $catStmt->fetchAll();

// Expense categories breakdown for chart
$expenseBreakdown = array_filter($categoryBreakdown, fn($c) => $c['type'] === 'expense');
$chartLabels = [];
$chartValues = [];
foreach ($expenseBreakdown as $row) {
    $chartLabels[] = $row['name'];
    $chartValues[] = (float)$row['total_amount'];
}

// 3. Full 12-Month Annual Breakdown for Selected Year
$annualTrends = [];
for ($m = 1; $m <= 12; $m++) {
    $mSummary = getMonthlySummary($pdo, $userId, $selectedYear, $m);
    $annualTrends[] = [
        'month'   => date('M', mktime(0, 0, 0, $m, 1)),
        'income'  => $mSummary['income'],
        'expense' => $mSummary['expense']
    ];
}

$pageTitle = 'Financial Reports & Analytics';
include __DIR__ . '/includes/header.php';
?>

<!-- Filter & Export Controls -->
<div class="row align-items-center mb-4 g-3">
    <div class="col-12 col-md-auto me-auto">
        <h4 class="fw-bold mb-1 text-slate-900">Financial Reports &amp; Analytics</h4>
        <p class="text-muted small mb-0">
            Comprehensive breakdown for <strong><?= date('F Y', mktime(0, 0, 0, $selectedMonth, 1, $selectedYear)) ?></strong>
        </p>
    </div>
    <div class="col-12 col-md-auto d-flex gap-2">
        <form method="GET" action="reports.php" class="d-flex align-items-center gap-2">
            <select name="month" class="form-select form-select-sm bg-white" style="width: 130px;">
                <?php for ($m = 1; $m <= 12; $m++): ?>
                    <option value="<?= $m ?>" <?= $m === $selectedMonth ? 'selected' : '' ?>>
                        <?= date('F', mktime(0, 0, 0, $m, 1)) ?>
                    </option>
                <?php endfor; ?>
            </select>
            <select name="year" class="form-select form-select-sm bg-white" style="width: 95px;">
                <?php for ($y = $currentYear + 1; $y >= $currentYear - 4; $y--): ?>
                    <option value="<?= $y ?>" <?= $y === $selectedYear ? 'selected' : '' ?>><?= $y ?></option>
                <?php endfor; ?>
            </select>
            <button type="submit" class="btn btn-sm btn-outline-primary fw-medium">
                <i class="bi bi-filter"></i> Apply
            </button>
        </form>
        <a href="export-csv.php?month=<?= $selectedMonth ?>&year=<?= $selectedYear ?>" class="btn btn-sm btn-success fw-medium">
            <i class="bi bi-file-earmark-spreadsheet me-1"></i>Download CSV
        </a>
    </div>
</div>

<!-- 3 Quick Metrics -->
<div class="row g-3 mb-4">
    <div class="col-12 col-md-4">
        <div class="stat-card">
            <span class="text-muted small fw-medium text-uppercase" style="font-size: 11px;">Selected Month Income</span>
            <h3 class="fw-bold text-success mb-1 mt-1"><?= formatCurrency($summary['income']) ?></h3>
            <small class="text-muted">Total earned in this cycle</small>
        </div>
    </div>
    <div class="col-12 col-md-4">
        <div class="stat-card">
            <span class="text-muted small fw-medium text-uppercase" style="font-size: 11px;">Selected Month Expenses</span>
            <h3 class="fw-bold text-danger mb-1 mt-1"><?= formatCurrency($summary['expense']) ?></h3>
            <small class="text-muted">Total outflows across all categories</small>
        </div>
    </div>
    <div class="col-12 col-md-4">
        <div class="stat-card">
            <span class="text-muted small fw-medium text-uppercase" style="font-size: 11px;">Net Savings / Balance</span>
            <h3 class="fw-bold mb-1 mt-1 <?= $summary['balance'] >= 0 ? 'text-primary' : 'text-danger' ?>">
                <?= formatCurrency($summary['balance']) ?>
            </h3>
            <small class="text-muted">Savings Rate: <?= $summary['income'] > 0 ? round(($summary['balance'] / $summary['income']) * 100, 1) . '%' : 'N/A' ?></small>
        </div>
    </div>
</div>

<!-- Charts Grid -->
<div class="row g-4 mb-4">
    <div class="col-12 col-lg-7">
        <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-semibold text-slate-900 mb-0">Annual Cash Flow (Year <?= $selectedYear ?>)</h6>
                <span class="badge bg-light text-secondary border">12-Month Overview</span>
            </div>
            <div style="position: relative; height: 300px;">
                <canvas id="annualBarChart"></canvas>
            </div>
        </div>
    </div>

    <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-semibold text-slate-900 mb-0">Category Expense Distribution</h6>
                <span class="badge bg-light text-secondary border"><?= date('M Y', mktime(0, 0, 0, $selectedMonth, 1, $selectedYear)) ?></span>
            </div>
            <div style="position: relative; height: 300px;">
                <?php if (empty($chartValues)): ?>
                    <div class="h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted">
                        <i class="bi bi-pie-chart text-secondary opacity-50 display-4 mb-2"></i>
                        <p class="small mb-0">No recorded expenses for this period.</p>
                    </div>
                <?php else: ?>
                    <canvas id="categoryPieChart"></canvas>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Detailed Category Breakdown Table -->
<div class="card border-0 shadow-sm rounded-3 bg-white">
    <div class="card-header bg-white border-bottom py-3">
        <h6 class="fw-semibold text-slate-900 mb-0">Category Breakdown Table</h6>
        <small class="text-muted">Spending &amp; earnings divided by active categories</small>
    </div>
    <div class="table-responsive">
        <table class="table table-hover table-custom mb-0">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Transactions</th>
                    <th class="text-end">Total Amount</th>
                    <th class="text-end">Share of <?= $selectedMonth ?></th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($categoryBreakdown)): ?>
                    <tr>
                        <td colspan="5" class="text-center py-4 text-muted">
                            No transactions recorded for the selected month.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($categoryBreakdown as $row): ?>
                        <?php 
                            $baseTotal = $row['type'] === 'expense' ? $summary['expense'] : $summary['income'];
                            $pct = $baseTotal > 0 ? round(($row['total_amount'] / $baseTotal) * 100, 1) : 0;
                        ?>
                        <tr>
                            <td class="fw-semibold text-slate-800"><?= htmlspecialchars($row['name']) ?></td>
                            <td>
                                <?php if ($row['type'] === 'income'): ?>
                                    <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Income</span>
                                <?php else: ?>
                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Expense</span>
                                <?php endif; ?>
                            </td>
                            <td><?= $row['tx_count'] ?> transaction(s)</td>
                            <td class="text-end <?= $row['type'] === 'income' ? 'text-income' : 'text-expense' ?>">
                                <?= formatCurrency($row['total_amount']) ?>
                            </td>
                            <td class="text-end fw-medium"><?= $pct ?>%</td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // 1. Annual Flow Chart
    const annualCtx = document.getElementById('annualBarChart');
    if (annualCtx) {
        const annualData = <?= json_encode($annualTrends) ?>;
        new Chart(annualCtx, {
            type: 'bar',
            data: {
                labels: annualData.map(d => d.month),
                datasets: [
                    {
                        label: 'Income',
                        data: annualData.map(d => d.income),
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    },
                    {
                        label: 'Expense',
                        data: annualData.map(d => d.expense),
                        backgroundColor: '#ef4444',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: v => '$' + v.toLocaleString() }
                    }
                }
            }
        });
    }

    // 2. Category Pie Chart
    const pieCtx = document.getElementById('categoryPieChart');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: <?= json_encode($chartLabels) ?>,
                datasets: [{
                    data: <?= json_encode($chartValues) ?>,
                    backgroundColor: [
                        '#ef4444', '#f97316', '#f59e0b', '#10b981', 
                        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
                    ]
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
