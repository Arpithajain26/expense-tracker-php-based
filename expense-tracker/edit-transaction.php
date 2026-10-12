<?php
/**
 * Edit Existing Transaction Form
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

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Fetch transaction ensuring user ownership
$stmt = $pdo->prepare("SELECT * FROM transactions WHERE id = :id AND user_id = :user_id LIMIT 1");
$stmt->execute([':id' => $id, ':user_id' => $userId]);
$transaction = $stmt->fetch();

if (!$transaction) {
    setFlash('danger', 'Transaction not found or you do not have permission to edit it.');
    redirect('transactions.php');
}

// Fetch all available categories
$allCategories = getCategories($pdo, $userId);

$pageTitle = 'Edit Transaction';
include __DIR__ . '/includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
        <div class="card border-0 shadow-sm rounded-3 bg-white">
            <div class="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
                <div>
                    <h5 class="fw-bold mb-0 text-slate-900">Edit Transaction #<?= $transaction['id'] ?></h5>
                    <small class="text-muted">Modify existing income or expense details</small>
                </div>
                <a href="transactions.php" class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-arrow-left me-1"></i>Back
                </a>
            </div>

            <div class="card-body p-4">
                <form action="actions/update-transaction.php" method="POST" autocomplete="off">
                    <?= csrfField() ?>
                    <input type="hidden" name="id" value="<?= $transaction['id'] ?>">

                    <!-- Transaction Type -->
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-secondary">Transaction Type <span class="text-danger">*</span></label>
                        <select name="type" id="transaction_type" class="form-select" required>
                            <option value="expense" <?= $transaction['type'] === 'expense' ? 'selected' : '' ?>>Expense (Money Out)</option>
                            <option value="income" <?= $transaction['type'] === 'income' ? 'selected' : '' ?>>Income (Money In)</option>
                        </select>
                    </div>

                    <!-- Category -->
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-secondary">Category <span class="text-danger">*</span></label>
                        <select name="category_id" id="category_id" class="form-select" required>
                            <option value="">-- Choose Category --</option>
                            <?php foreach ($allCategories as $cat): ?>
                                <option value="<?= $cat['id'] ?>" 
                                        data-type="<?= $cat['type'] ?>" 
                                        <?= (int)$cat['id'] === (int)$transaction['category_id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($cat['name']) ?> (<?= ucfirst($cat['type']) ?>)
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <!-- Amount -->
                    <div class="mb-3">
                        <label for="amount" class="form-label small fw-semibold text-secondary">Amount ($) <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">$</span>
                            <input type="number" step="0.01" min="0.01" max="99999999.99" class="form-control" id="amount" name="amount" value="<?= htmlspecialchars($transaction['amount']) ?>" required>
                        </div>
                    </div>

                    <!-- Date -->
                    <div class="mb-3">
                        <label for="transaction_date" class="form-label small fw-semibold text-secondary">Transaction Date <span class="text-danger">*</span></label>
                        <input type="date" class="form-control" id="transaction_date" name="transaction_date" value="<?= htmlspecialchars($transaction['transaction_date']) ?>" required>
                    </div>

                    <!-- Description -->
                    <div class="mb-4">
                        <label for="description" class="form-label small fw-semibold text-secondary">Description / Notes <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="description" name="description" value="<?= htmlspecialchars($transaction['description']) ?>" maxlength="255" required>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary fw-medium px-4">
                            <i class="bi bi-arrow-repeat me-1"></i>Update Transaction
                        </button>
                        <a href="transactions.php" class="btn btn-light border px-4">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
