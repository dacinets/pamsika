<?php
/** GET /api/admin/session.php — who is signed in, plus the CSRF token for writes. */

declare(strict_types=1);

require __DIR__ . '/../inc/bootstrap.php';

require_method('GET');
start_admin_session();
if (empty($_SESSION['admin'])) {
    json_response(200, ['signedIn' => false]);
}
json_response(200, ['signedIn' => true, 'email' => $_SESSION['admin']['email'], 'csrf' => csrf_token()]);
