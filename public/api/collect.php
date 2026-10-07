<?php
/**
 * POST /api/collect.php — first-party, cookie-free analytics beacon.
 *
 * Stores no IP address, cookie or persistent identifier. A visitor is counted
 * once per day with a hash of (daily salt, IP, user agent) that cannot be
 * linked across days. Browsers that send Do Not Track or Global Privacy
 * Control are never recorded (the client also skips sending).
 */

declare(strict_types=1);

require __DIR__ . '/inc/bootstrap.php';

require_method('POST');

// Beacons are fire-and-forget: always answer 204 so nothing leaks to the page.
function done(): never
{
    http_response_code(204);
    header('Cache-Control: no-store');
    exit;
}

if (($_SERVER['HTTP_DNT'] ?? '') === '1' || ($_SERVER['HTTP_SEC_GPC'] ?? '') === '1') {
    done();
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin === '' || parse_url($origin, PHP_URL_HOST) !== parse_url('//' . $host, PHP_URL_HOST)) {
    done();
}

$ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 400);
if ($ua === '' || preg_match('/bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|axios|scrapy/i', $ua)) {
    done();
}

$raw = file_get_contents('php://input', false, null, 0, 4097);
if ($raw === false || strlen($raw) > 4096) {
    done();
}
$e = json_decode($raw, true);
if (!is_array($e)) {
    done();
}

if (!rate_limit('collect', 240, 3600)) {
    done();
}

const ALLOWED_EVENTS = ['pageview', 'cta_click', 'form_view', 'form_start', 'form_review', 'form_submit', 'form_error', 'faq_search', 'faq_open', 'outbound'];

$type = is_string($e['t'] ?? null) && in_array($e['t'], ALLOWED_EVENTS, true) ? $e['t'] : null;
if ($type === null) {
    done();
}

// Paths only (no query strings), normalised to a trailing slash.
$path = is_string($e['p'] ?? null) ? (string)parse_url($e['p'], PHP_URL_PATH) : '/';
$path = '/' . trim(substr(preg_replace('#[^A-Za-z0-9/_\-.]#', '', $path) ?? '', 0, 200), '/');
$path = $path === '/' ? '/' : $path . '/';

$label = is_string($e['l'] ?? null) ? mb_substr(trim(strip_tags($e['l'])), 0, 120, 'UTF-8') : '';

$referrer = '';
if (is_string($e['r'] ?? null) && $e['r'] !== '') {
    $refHost = strtolower((string)parse_url($e['r'], PHP_URL_HOST));
    if ($refHost !== '' && $refHost !== strtolower(parse_url('//' . $host, PHP_URL_HOST) ?? '')) {
        $referrer = substr(preg_replace('/^www\./', '', $refHost) ?? '', 0, 120);
    }
}

$utm = is_string($e['u'] ?? null) ? strtolower(substr(preg_replace('/[^A-Za-z0-9_\-.]/', '', $e['u']) ?? '', 0, 60)) : '';

$width = (int)($e['w'] ?? 0);
$device = $width > 0 && $width < 768 ? 'mobile' : ($width >= 768 && $width < 1100 ? 'tablet' : 'desktop');
if ($width <= 0) {
    $device = preg_match('/Mobi|Android|iPhone/i', $ua) ? 'mobile' : (preg_match('/iPad|Tablet/i', $ua) ? 'tablet' : 'desktop');
}

$browser = match (true) {
    str_contains($ua, 'Edg/') => 'Edge',
    str_contains($ua, 'OPR/') || str_contains($ua, 'Opera') => 'Opera',
    str_contains($ua, 'SamsungBrowser') => 'Samsung',
    str_contains($ua, 'Firefox/') => 'Firefox',
    str_contains($ua, 'Chrome/') => 'Chrome',
    str_contains($ua, 'Safari/') => 'Safari',
    default => 'Other',
};

$lang = is_string($e['g'] ?? null) ? strtolower(substr(preg_replace('/[^A-Za-z\-]/', '', $e['g']) ?? '', 0, 10)) : '';

$day = gmdate('Y-m-d');
$salt = pamsika_config()['app']['hash_salt'] ?? '';
$visitor = substr(hash_hmac('sha256', client_ip() . '|' . $ua, $salt . '|' . $day), 0, 16);

try {
    db()->prepare('INSERT INTO analytics_events (created_at, day, type, path, label, referrer, utm_source, device, browser, lang, visitor) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        ->execute([now_utc(), $day, $type, $path, $label, $referrer, $utm, $device, $browser, $lang, $visitor]);
} catch (Throwable $err) {
    error_log('Pamsika: analytics write failed: ' . $err->getMessage());
}

done();
