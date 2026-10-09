<?php
/**
 * POST /api/admin/login.php — signs in an administrator listed in the private config.
 * Five attempts per 15 minutes per IP, constant-time comparison, session id rotated.
 */

declare(strict_types=1);

require __DIR__ . '/../inc/bootstrap.php';

require_method('POST');
require_same_origin();

if (!rate_limit('admin_login', 5, 900)) {
    audit('admin_login_locked');
    json_response(429, ['error' => 'Too many sign-in attempts. Wait 15 minutes and try again.']);
}

$input = read_json_body(2000);
$email = strtolower(trim(is_string($input['email'] ?? null) ? $input['email'] : ''));
$password = is_string($input['password'] ?? null) ? $input['password'] : '';

$match = null;
foreach (pamsika_config()['admins'] ?? [] as $admin) {
    if (hash_equals(strtolower($admin['email'] ?? ''), $email)) {
        $match = $admin;
    }
}

// Verify against a dummy hash when the email is unknown so timing does not reveal valid accounts.
$hash = $match['password_hash'] ?? '$2y$10$O2BiVlcUBAhYwJu/k9FdZu6yDMZGMf/bEssLq0YJE1Z6.58PMtwpW';
$valid = password_verify($password, $hash) && $match !== null;

if (!$valid) {
    audit('admin_login_failed', ['email' => substr($email, 0, 80)]);
    json_response(401, ['error' => 'That email and password do not match.']);
}

start_admin_session();
session_regenerate_id(true);
$_SESSION['admin'] = ['email' => $match['email'], 'at' => time()];
unset($_SESSION['csrf']);
audit('admin_login', ['email' => $match['email']]);

json_response(200, ['signedIn' => true, 'email' => $match['email'], 'csrf' => csrf_token()]);
