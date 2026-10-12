<?php
/**
 * User Logout Script
 * Destroys current session and redirects to login
 */
require_once __DIR__ . '/includes/functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Unset all session values
$_SESSION = [];

// Destroy cookie if set
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

session_destroy();

// Start fresh session just for the flash feedback
session_start();
setFlash('info', 'You have been signed out successfully.');
redirect('login.php');
