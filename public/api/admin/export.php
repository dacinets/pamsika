<?php
/** GET /api/admin/export.php — all enquiries as CSV (opens in Excel / Google Sheets). */

declare(strict_types=1);

require __DIR__ . '/../inc/bootstrap.php';

require_method('GET');
require_admin();
audit('leads_exported');

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="pamsika-enquiries-' . gmdate('Y-m-d') . '.csv"');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF"); // UTF-8 BOM so Excel reads accents correctly
fputcsv($out, ['Reference', 'Received (UTC)', 'Type', 'Status', 'Name', 'Email', 'Business', 'Services', 'Market / location', 'Budget', 'Timing', 'Idea', 'Portfolio', 'Message', 'Notes'], ',', '"', '');

// Neutralise spreadsheet formulas in user-supplied text.
$safe = static fn($v) => is_string($v) && preg_match('/^[=+\-@\t\r]/', $v) ? "'" . $v : $v;

$stmt = db()->query('SELECT * FROM enquiries ORDER BY created_at DESC');
while ($r = $stmt->fetch()) {
    $d = json_decode($r['details'] ?? '{}', true) ?: [];
    fputcsv($out, array_map($safe, [
        $r['reference'], $r['created_at'], $r['kind'], $r['status'], $r['name'], $r['email'], $r['business'],
        implode(', ', $d['services'] ?? []), $d['market'] ?? '', $d['budget'] ?? '', $d['timing'] ?? '', $d['idea'] ?? '', $d['portfolio'] ?? '',
        $r['message'], $r['notes'] ?? '',
    ]), ',', '"', '');
}
fclose($out);
