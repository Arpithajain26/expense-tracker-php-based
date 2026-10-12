/**
 * Personal Expense Tracker - Client-Side JavaScript
 * Handles sidebar toggling, category filtering, delete confirmation, and UI enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarWrapper = document.getElementById('sidebar-wrapper');

    if (sidebarToggle && sidebarWrapper) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarWrapper.classList.toggle('toggled');
        });
    }

    // 2. Dynamic Category Filtering on Transaction Form
    const typeSelect = document.getElementById('transaction_type');
    const categorySelect = document.getElementById('category_id');

    if (typeSelect && categorySelect) {
        function filterCategories() {
            const selectedType = typeSelect.value; // 'income' or 'expense'
            const options = categorySelect.querySelectorAll('option');

            let firstVisibleSelected = false;

            options.forEach(option => {
                if (!option.value) return; // Keep the placeholder "Select Category"

                const optType = option.getAttribute('data-type');
                if (optType === selectedType) {
                    option.style.display = '';
                    option.disabled = false;
                    if (!firstVisibleSelected && option.selected) {
                        firstVisibleSelected = true;
                    }
                } else {
                    option.style.display = 'none';
                    option.disabled = true;
                    if (option.selected) {
                        option.selected = false;
                    }
                }
            });

            // If current selected category was disabled, select first valid option
            if (!categorySelect.value) {
                const firstValid = Array.from(options).find(o => o.value && !o.disabled && o.style.display !== 'none');
                if (firstValid) {
                    firstValid.selected = true;
                }
            }
        }

        typeSelect.addEventListener('change', filterCategories);
        // Run on initial load
        filterCategories();
    }

    // 3. Auto-dismiss alerts after 5 seconds
    const autoAlerts = document.querySelectorAll('.alert-dismissible');
    autoAlerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            if (bsAlert) {
                bsAlert.close();
            }
        }, 5000);
    });
});

/**
 * Global Delete Confirmation Dialog
 */
function confirmDelete(message = 'Are you sure you want to delete this record? This action cannot be undone.') {
    return window.confirm(message);
}
