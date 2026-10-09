<?php
/**
 * Shared bootstrap for every Pamsika API endpoint.
 *
 * Loads private configuration from outside the web root, opens the database,
 * and provides JSON, security, rate-limit and session helpers. Endpoints
 * include this file first and never echo anything themselves.
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

const PAMSIKA_CONFIG_FILE = 'pamsika-config.php';

function pamsika_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    // public_html/api/inc/bootstrap.php -> /home/<user>/private/pamsika-config.php
    $candidates = array_filter([
        getenv('PAMSIKA_CONFIG') ?: null,
        dirname(__DIR__, 3) . '/private/' . PAMSIKA_CONFIG_FILE,
        dirname(__DIR__, 4) . '/private/' . PAMSIKA_CONFIG_FILE,
    ]);
    foreach ($candidates as $path) {
        if (is_file($path) && is_readable($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                return $config = $loaded;
            }
        }
    }

    error_log('Pamsika: configuration file not found');
    json_response(503, ['error' => 'The service is not configured yet. Please try again later.']);
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $cfg = pamsika_config()['db'] ?? [];
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 5,
    ];

    try {
        if (($cfg['driver'] ?? 'mysql') === 'sqlite') {
            // Local development only.
            $pdo = new PDO('sqlite:' . $cfg['path'], null, null, $options);
            $pdo->exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=3000;');
        } else {
            $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $cfg['host'] ?? 'localhost', (int)($cfg['port'] ?? 3306), $cfg['database'] ?? '');
            $pdo = new PDO($dsn, $cfg['username'] ?? '', $cfg['password'] ?? '', $options);
            $pdo->exec("SET time_zone = '+00:00'");
        }
    } catch (PDOException $e) {
        error_log('Pamsika: database connection failed: ' . $e->getMessage());
        json_response(503, ['error' => 'The service is temporarily unavailable. Please try again shortly.']);
    }

    return $pdo;
}

function is_sqlite(): bool
{
    return db()->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
}

function now_utc(): string
{
    return gmdate('Y-m-d H:i:s');
}

function json_response(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex, nofollow');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_method(string ...$methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        json_response(405, ['error' => 'Method not allowed.']);
    }
}

/** Rejects cross-site browser requests. Same-origin fetches always send Origin on POST. */
function require_same_origin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' ? 'https' : 'http';
    $self = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? '');
    $allowed = array_merge([$self], pamsika_config()['app']['allowed_origins'] ?? []);
    if ($origin === '' || !in_array($origin, $allowed, true)) {
        json_response(403, ['error' => 'Please use the Pamsika website to send this request.']);
    }
}

/** Reads a bounded JSON body. */
function read_json_body(int $maxBytes = 24000): array
{
    $length = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > $maxBytes) {
        json_response(413, ['error' => 'Your message is too long. Please shorten it.']);
    }
    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || strlen($raw) > $maxBytes) {
        json_response(413, ['error' => 'Your message is too long. Please shorten it.']);
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(400, ['error' => 'Check your details and try again.']);
    }
    return $data;
}

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Salted, non-reversible IP fingerprint. Raw IPs are never stored. */
function ip_hash(): string
{
    return hash_hmac('sha256', client_ip(), pamsika_config()['app']['hash_salt'] ?? '');
}

/**
 * Fixed-window rate limit backed by the database.
 * Returns false when the caller has used up its allowance for this window.
 */
function rate_limit(string $action, int $max, int $windowSeconds): bool
{
    $pdo = db();
    $window = (int)floor(time() / $windowSeconds);
    $key = substr(hash('sha256', $action . '|' . ip_hash() . '|' . $window), 0, 40);
    $expires = gmdate('Y-m-d H:i:s', ($window + 1) * $windowSeconds);

    $sql = is_sqlite()
        ? 'INSERT INTO rate_limits (bucket, hits, expires_at) VALUES (?, 1, ?) ON CONFLICT(bucket) DO UPDATE SET hits = hits + 1'
        : 'INSERT INTO rate_limits (bucket, hits, expires_at) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE hits = hits + 1';
    $pdo->prepare($sql)->execute([$key, $expires]);

    $stmt = $pdo->prepare('SELECT hits FROM rate_limits WHERE bucket = ?');
    $stmt->execute([$key]);
    $hits = (int)$stmt->fetchColumn();

    // Opportunistic cleanup so the table stays small without a cron job.
    if (random_int(1, 50) === 1) {
        $pdo->prepare('DELETE FROM rate_limits WHERE expires_at < ?')->execute([now_utc()]);
    }

    return $hits <= $max;
}

function audit(string $event, array $detail = []): void
{
    try {
        db()->prepare('INSERT INTO audit_log (created_at, event, ip_hash, detail) VALUES (?, ?, ?, ?)')
            ->execute([now_utc(), substr($event, 0, 64), ip_hash(), json_encode($detail, JSON_UNESCAPED_SLASHES)]);
    } catch (Throwable $e) {
        error_log('Pamsika: audit write failed: ' . $e->getMessage());
    }
}

/* ------------------------------------------------------------------------
 * Admin sessions
 * --------------------------------------------------------------------- */

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    session_name($secure ? '__Host-pamsika_admin' : 'pamsika_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.gc_maxlifetime', '28800');
    session_start();

    // Idle timeout: 8 hours.
    if (isset($_SESSION['seen']) && time() - (int)$_SESSION['seen'] > 28800) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['seen'] = time();
}

function csrf_token(): string
{
    start_admin_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

/** Gate for every admin endpoint. State-changing requests also need the CSRF header. */
function require_admin(): array
{
    start_admin_session();
    if (empty($_SESSION['admin'])) {
        json_response(401, ['error' => 'Please sign in.']);
    }
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method !== 'GET') {
        require_same_origin();
        $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!is_string($sent) || !hash_equals(csrf_token(), $sent)) {
            json_response(403, ['error' => 'Your session expired. Refresh the page and try again.']);
        }
    }
    return $_SESSION['admin'];
}
