<?php
/**
 * POST /api/enquiry.php
 * Stores a campaign, adaptation, contact, Creative Market or creator enquiry.
 * Same-origin, rate limited, honeypot protected and idempotent per requestId.
 */

declare(strict_types=1);

require __DIR__ . '/inc/bootstrap.php';
require __DIR__ . '/inc/validation.php';
require __DIR__ . '/inc/mailer.php';

require_method('POST');
require_same_origin();
if (!str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
    json_response(415, ['error' => 'Use the enquiry form to send your message.']);
}

$input = read_json_body();

// Bots fill the hidden "website" field. Answer like a failure so they learn nothing useful.
if (!empty($input['website'])) {
    audit('enquiry_honeypot');
    json_response(400, ['error' => 'We could not submit this enquiry. Please try again.']);
}

$limits = pamsika_config()['security'] ?? [];
if (!rate_limit('enquiry', (int)($limits['enquiries_per_hour'] ?? 6), 3600)) {
    audit('enquiry_rate_limited');
    json_response(429, ['error' => 'You have sent several enquiries in a short time. Please wait a little and try again.']);
}

$result = validate_enquiry($input);
if (!$result['success']) {
    json_response(400, ['error' => 'Check the highlighted fields.', 'errors' => $result['errors']]);
}
$d = $result['data'];

$details = json_encode([
    'idea' => $d['idea'], 'market' => $d['market'], 'budget' => $d['budget'], 'timing' => $d['timing'],
    'services' => $d['services'], 'portfolio' => $d['portfolio'] ?? '',
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$hash = hash('sha256', json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
$reference = 'PAM-' . strtoupper(substr($d['requestId'], 0, 8));
$now = now_utc();

try {
    $pdo = db();
    $insert = is_sqlite()
        ? 'INSERT INTO enquiries (id, reference, kind, name, email, business, message, details, payload_hash, status, ip_hash, consent_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,\'new\',?,?,?,?) ON CONFLICT(id) DO NOTHING'
        : 'INSERT IGNORE INTO enquiries (id, reference, kind, name, email, business, message, details, payload_hash, status, ip_hash, consent_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,\'new\',?,?,?,?)';
    $stmt = $pdo->prepare($insert);
    $stmt->execute([$d['requestId'], $reference, $d['kind'], $d['name'], $d['email'], $d['business'], $d['message'], $details, $hash, ip_hash(), $now, $now, $now]);
    $isNew = $stmt->rowCount() === 1;

    $saved = $pdo->prepare('SELECT reference, payload_hash FROM enquiries WHERE id = ?');
    $saved->execute([$d['requestId']]);
    $row = $saved->fetch();
    if (!$row || !hash_equals($row['payload_hash'], $hash)) {
        json_response(409, ['error' => 'This submission reference was already used. Refresh the page before sending a new enquiry.']);
    }
} catch (Throwable $e) {
    error_log('Pamsika: enquiry save failed: ' . $e->getMessage());
    json_response(503, ['error' => 'Your enquiry could not be saved. Your details are still here; please try again.']);
}

if ($isNew) {
    notify_new_enquiry($d, $reference);
}

json_response(201, ['reference' => $row['reference']]);
