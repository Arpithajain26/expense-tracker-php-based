<?php
/**
 * Shared Footer Template
 * Personal Expense Tracker
 */
$user = isset($_SESSION['user_id']) ? currentUser() : null;
?>
<?php if ($user): ?>
        </main>
        
        <!-- App Bottom Footer -->
        <footer class="bg-white border-top py-3 px-4 mt-auto">
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <small class="text-muted">Personal Expense Tracker &copy; <?= date('Y') ?> &middot; College Mini Project</small>
                <small class="text-muted">Built with PHP, MySQL PDO, Bootstrap 5 &amp; Chart.js</small>
            </div>
        </footer>
    </div><!-- End #page-content-wrapper -->
</div><!-- End #wrapper -->
<?php endif; ?>

<!-- Bootstrap 5.3 Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- Chart.js 4.4 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
<!-- Application Script -->
<script src="assets/js/app.js"></script>
</body>
</html>
