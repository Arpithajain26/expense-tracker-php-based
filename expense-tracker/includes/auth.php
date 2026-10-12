<?php
/**
 * Authentication Guards & Helpers
 * Personal Expense Tracker
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if current visitor is authenticated
 */
function isAuthenticated(): bool {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Require authentication - redirect to login.php if guest
 */
function requireAuth(): void {
    if (!isAuthenticated()) {
        $_SESSION['flash'] = [
            'type' => 'warning',
            'message' => 'Please log in to access your dashboard.'
        ];
        header("Location: login.php");
        exit;
    }
}

/**
 * Redirect already logged-in users away from login/register pages
 */
function requireGuest(): void {
    if (isAuthenticated()) {
        header("Location: dashboard.php");
        exit;
    }
}

/**
 * Get current authenticated user details from session
 */
function currentUser(): array {
    return [
        'id'    => $_SESSION['user_id'] ?? null,
        'name'  => $_SESSION['user_name'] ?? 'User',
        'email' => $_SESSION['user_email'] ?? ''
    ];
}
