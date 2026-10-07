<?php
/** GET /api/health.php — deployment check: confirms PHP, config and database are reachable. */

declare(strict_types=1);

require __DIR__ . '/inc/bootstrap.php';

require_method('GET');
db()->query('SELECT 1');
json_response(200, ['ok' => true, 'php' => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION]);
