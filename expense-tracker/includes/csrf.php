<?php
/**
 * Cross-Site Request Forgery (CSRF) Protection
 * Generates and validates cryptographic anti-CSRF tokens
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Generate a secure CSRF token and store it in session
 */
function generateCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate submitted token against session token
 */
function validateCsrfToken(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Render a hidden HTML CSRF input field
 */
function csrfField(): string {
    $token = htmlspecialchars(generateCsrfToken(), ENT_QUOTES, 'UTF-8');
    return '<input type="hidden" name="csrf_token" value="' . $token . '">';
}
