<?php
/**
 * Category Management Page
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

// Fetch all categories for user
$allCategories = getCategories($pdo, $userId);

$incomeCategories = array_filter($allCategories, fn($c) => $c['type'] === 'income');
$expenseCategories = array_filter($allCategories, fn($c) => $c['type'] === 'expense');

$pageTitle = 'Manage Categories';
include __DIR__ . '/includes/header.php';
?>

<div class="row g-4">
    <!-- Add Category Card -->
    <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm rounded-3 bg-white">
            <div class="card-header bg-white border-bottom py-3">
                <h6 class="fw-bold mb-0 text-slate-900">Add Custom Category</h6>
                <small class="text-muted">Create a personalized tracking tag</small>
            </div>
            <div class="card-body p-3">
                <form action="actions/save-category.php" method="POST" autocomplete="off">
                    <?= csrfField() ?>

                    <div class="mb-3">
                        <label for="category_name" class="form-label small fw-semibold text-secondary">Category Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="category_name" name="name" placeholder="e.g. Gym & Fitness, Tech Gadgets" maxlength="80" required>
                    </div>

                    <div class="mb-3">
                        <label for="category_type" class="form-label small fw-semibold text-secondary">Type <span class="text-danger">*</span></label>
                        <select class="form-select" id="category_type" name="type" required>
                            <option value="expense">Expense Category</option>
                            <option value="income">Income Category</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 fw-medium">
                        <i class="bi bi-plus-circle me-1"></i>Create Category
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Existing Categories List -->
    <div class="col-12 col-lg-8">
        <div class="row g-4">
            <!-- Expense Categories -->
            <div class="col-12 col-md-6">
                <div class="card border-0 shadow-sm rounded-3 bg-white h-100">
                    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-slate-900">
                            <i class="bi bi-arrow-up-right text-danger me-1"></i> Expense Categories
                        </span>
                        <span class="badge bg-danger-subtle text-danger"><?= count($expenseCategories) ?></span>
                    </div>
                    <ul class="list-group list-group-flush">
                        <?php foreach ($expenseCategories as $cat): ?>
                            <li class="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                                <div>
                                    <span class="fw-medium text-slate-800"><?= htmlspecialchars($cat['name']) ?></span>
                                    <?php if ($cat['user_id'] === null): ?>
                                        <span class="badge bg-light text-muted border ms-1" style="font-size: 10px;">Default</span>
                                    <?php else: ?>
                                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle ms-1" style="font-size: 10px;">Custom</span>
                                    <?php endif; ?>
                                </div>
                                <?php if ($cat['user_id'] !== null): ?>
                                    <form action="actions/delete-category.php" method="POST" class="d-inline" onsubmit="return confirmDelete('Delete custom category &quot;<?= htmlspecialchars(addslashes($cat['name'])) ?>&quot;? Transactions using this category must be reassigned first.');">
                                        <?= csrfField() ?>
                                        <input type="hidden" name="id" value="<?= $cat['id'] ?>">
                                        <button type="submit" class="btn btn-sm btn-link text-danger p-0" title="Delete Category">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>

            <!-- Income Categories -->
            <div class="col-12 col-md-6">
                <div class="card border-0 shadow-sm rounded-3 bg-white h-100">
                    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-slate-900">
                            <i class="bi bi-arrow-down-left text-success me-1"></i> Income Categories
                        </span>
                        <span class="badge bg-success-subtle text-success"><?= count($incomeCategories) ?></span>
                    </div>
                    <ul class="list-group list-group-flush">
                        <?php foreach ($incomeCategories as $cat): ?>
                            <li class="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                                <div>
                                    <span class="fw-medium text-slate-800"><?= htmlspecialchars($cat['name']) ?></span>
                                    <?php if ($cat['user_id'] === null): ?>
                                        <span class="badge bg-light text-muted border ms-1" style="font-size: 10px;">Default</span>
                                    <?php else: ?>
                                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle ms-1" style="font-size: 10px;">Custom</span>
                                    <?php endif; ?>
                                </div>
                                <?php if ($cat['user_id'] !== null): ?>
                                    <form action="actions/delete-category.php" method="POST" class="d-inline" onsubmit="return confirmDelete('Delete custom category &quot;<?= htmlspecialchars(addslashes($cat['name'])) ?>&quot;?');">
                                        <?= csrfField() ?>
                                        <input type="hidden" name="id" value="<?= $cat['id'] ?>">
                                        <button type="submit" class="btn btn-sm btn-link text-danger p-0" title="Delete Category">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
