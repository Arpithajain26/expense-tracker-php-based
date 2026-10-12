<?php
/**
 * User Profile & Password Security
 * Personal Expense Tracker
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireAuth();

$pdo = getDBConnection();
$userSession = currentUser();
$userId = (int)$userSession['id'];

// Fetch latest user details from DB
$stmt = $pdo->prepare("SELECT id, name, email, created_at FROM users WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $userId]);
$userData = $stmt->fetch();

$pageTitle = 'User Profile';
include __DIR__ . '/includes/header.php';
?>

<div class="row g-4 justify-content-center">
    <!-- Profile Info & Name Update -->
    <div class="col-12 col-md-6 col-lg-5">
        <div class="card border-0 shadow-sm rounded-3 bg-white h-100">
            <div class="card-header bg-white border-bottom py-3">
                <h6 class="fw-bold mb-0 text-slate-900">Personal Information</h6>
                <small class="text-muted">Manage your identity details</small>
            </div>
            <div class="card-body p-4">
                <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                    <div class="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style="width: 56px; height: 56px;">
                        <?= strtoupper(substr($userData['name'], 0, 1)) ?>
                    </div>
                    <div>
                        <h5 class="fw-bold mb-0 text-slate-900"><?= htmlspecialchars($userData['name']) ?></h5>
                        <div class="text-muted small"><?= htmlspecialchars($userData['email']) ?></div>
                        <small class="text-secondary" style="font-size: 11px;">
                            Member since <?= formatDate($userData['created_at']) ?>
                        </small>
                    </div>
                </div>

                <form action="actions/update-profile.php" method="POST">
                    <?= csrfField() ?>

                    <div class="mb-3">
                        <label for="name" class="form-label small fw-semibold text-secondary">Full Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($userData['name']) ?>" required maxlength="100">
                    </div>

                    <div class="mb-4">
                        <label for="email" class="form-label small fw-semibold text-secondary">Email Address (Read-only)</label>
                        <input type="email" class="form-control bg-light" id="email" value="<?= htmlspecialchars($userData['email']) ?>" readonly disabled>
                        <small class="text-muted" style="font-size: 11px;">Email addresses are permanently tied to account ownership.</small>
                    </div>

                    <button type="submit" class="btn btn-primary fw-medium">
                        <i class="bi bi-save me-1"></i>Save Changes
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Security & Password Change -->
    <div class="col-12 col-md-6 col-lg-5">
        <div class="card border-0 shadow-sm rounded-3 bg-white h-100">
            <div class="card-header bg-white border-bottom py-3">
                <h6 class="fw-bold mb-0 text-slate-900">Change Password</h6>
                <small class="text-muted">Ensure your account remains safe and protected</small>
            </div>
            <div class="card-body p-4">
                <form action="actions/change-password.php" method="POST" autocomplete="off">
                    <?= csrfField() ?>

                    <div class="mb-3">
                        <label for="current_password" class="form-label small fw-semibold text-secondary">Current Password <span class="text-danger">*</span></label>
                        <input type="password" class="form-control" id="current_password" name="current_password" required placeholder="Enter current password">
                    </div>

                    <div class="mb-3">
                        <label for="new_password" class="form-label small fw-semibold text-secondary">New Password <span class="text-danger">*</span></label>
                        <input type="password" class="form-control" id="new_password" name="new_password" required minlength="6" placeholder="Min. 6 characters">
                    </div>

                    <div class="mb-4">
                        <label for="confirm_password" class="form-label small fw-semibold text-secondary">Confirm New Password <span class="text-danger">*</span></label>
                        <input type="password" class="form-control" id="confirm_password" name="confirm_password" required minlength="6" placeholder="Re-type new password">
                    </div>

                    <button type="submit" class="btn btn-outline-danger fw-medium">
                        <i class="bi bi-shield-lock me-1"></i>Update Password
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
