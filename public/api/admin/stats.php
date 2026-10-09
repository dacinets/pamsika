<?php
/**
 * GET /api/admin/stats.php?days=30
 * Everything the dashboard overview needs, for the chosen period and the
 * period before it (for change indicators).
 */

declare(strict_types=1);

require __DIR__ . '/../inc/bootstrap.php';

require_method('GET');
require_admin();

$days = (int)($_GET['days'] ?? 30);
if (!in_array($days, [7, 30, 90, 365], true)) {
    $days = 30;
}

$pdo = db();
$today = new DateTimeImmutable('today', new DateTimeZone('UTC'));
$start = $today->modify('-' . ($days - 1) . ' days')->format('Y-m-d');
$end = $today->format('Y-m-d');
$prevStart = $today->modify('-' . (2 * $days - 1) . ' days')->format('Y-m-d');
$prevEnd = $today->modify('-' . $days . ' days')->format('Y-m-d');

function q(string $sql, array $params = []): array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function scalar(string $sql, array $params = []): int
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return (int)$stmt->fetchColumn();
}

function totals(string $from, string $to): array
{
    $visitors = scalar("SELECT COUNT(*) FROM (SELECT DISTINCT day, visitor FROM analytics_events WHERE type = 'pageview' AND day BETWEEN ? AND ?) v", [$from, $to]);
    $pageviews = scalar("SELECT COUNT(*) FROM analytics_events WHERE type = 'pageview' AND day BETWEEN ? AND ?", [$from, $to]);
    $enquiries = scalar('SELECT COUNT(*) FROM enquiries WHERE created_at BETWEEN ? AND ?', [$from . ' 00:00:00', $to . ' 23:59:59']);
    $sessionsWithOnePage = scalar("SELECT COUNT(*) FROM (SELECT day, visitor FROM analytics_events WHERE type = 'pageview' AND day BETWEEN ? AND ? GROUP BY day, visitor HAVING COUNT(*) = 1) s", [$from, $to]);
    return [
        'visitors' => $visitors,
        'pageviews' => $pageviews,
        'enquiries' => $enquiries,
        'conversion' => $visitors > 0 ? round($enquiries / $visitors * 100, 2) : 0,
        'pagesPerVisit' => $visitors > 0 ? round($pageviews / $visitors, 2) : 0,
        'bounceRate' => $visitors > 0 ? round($sessionsWithOnePage / $visitors * 100, 1) : 0,
    ];
}

// Daily series with zero-filled gaps.
$series = [];
for ($d = new DateTimeImmutable($start); $d <= $today; $d = $d->modify('+1 day')) {
    $series[$d->format('Y-m-d')] = ['day' => $d->format('Y-m-d'), 'visitors' => 0, 'pageviews' => 0, 'enquiries' => 0];
}
foreach (q("SELECT day, COUNT(*) AS pageviews, COUNT(DISTINCT visitor) AS visitors FROM analytics_events WHERE type = 'pageview' AND day BETWEEN ? AND ? GROUP BY day", [$start, $end]) as $r) {
    $series[$r['day']]['pageviews'] = (int)$r['pageviews'];
    $series[$r['day']]['visitors'] = (int)$r['visitors'];
}
foreach (q('SELECT SUBSTR(created_at, 1, 10) AS day, COUNT(*) AS n FROM enquiries WHERE created_at BETWEEN ? AND ? GROUP BY SUBSTR(created_at, 1, 10)', [$start . ' 00:00:00', $end . ' 23:59:59']) as $r) {
    if (isset($series[$r['day']])) {
        $series[$r['day']]['enquiries'] = (int)$r['n'];
    }
}

$range = [$start, $end];
$breakdown = static fn(string $column, int $limit = 10) => array_map(
    static fn($r) => ['name' => $r['name'], 'visitors' => (int)$r['visitors'], 'pageviews' => (int)$r['pageviews']],
    q("SELECT {$column} AS name, COUNT(DISTINCT day, visitor) AS visitors, COUNT(*) AS pageviews FROM analytics_events WHERE type = 'pageview' AND day BETWEEN ? AND ? GROUP BY {$column} ORDER BY visitors DESC, pageviews DESC LIMIT {$limit}", $range)
);

// SQLite has no multi-column COUNT(DISTINCT): count visitor-days via a derived key instead.
if (is_sqlite()) {
    $breakdown = static fn(string $column, int $limit = 10) => array_map(
        static fn($r) => ['name' => $r['name'], 'visitors' => (int)$r['visitors'], 'pageviews' => (int)$r['pageviews']],
        q("SELECT {$column} AS name, COUNT(DISTINCT day || visitor) AS visitors, COUNT(*) AS pageviews FROM analytics_events WHERE type = 'pageview' AND day BETWEEN ? AND ? GROUP BY {$column} ORDER BY visitors DESC, pageviews DESC LIMIT {$limit}", $range)
    );
}

$funnelSteps = ['form_view' => 'Viewed a form', 'form_start' => 'Started typing', 'form_review' => 'Reached review', 'form_submit' => 'Sent enquiry'];
$funnel = [];
foreach ($funnelSteps as $type => $label) {
    $funnel[] = ['step' => $label, 'visitors' => scalar('SELECT COUNT(*) FROM (SELECT DISTINCT day, visitor FROM analytics_events WHERE type = ? AND day BETWEEN ? AND ?) f', [$type, $start, $end])];
}

$ctas = array_map(
    static fn($r) => ['name' => $r['name'], 'clicks' => (int)$r['clicks']],
    q("SELECT label AS name, COUNT(*) AS clicks FROM analytics_events WHERE type = 'cta_click' AND label <> '' AND day BETWEEN ? AND ? GROUP BY label ORDER BY clicks DESC LIMIT 8", $range)
);

$searches = array_map(
    static fn($r) => ['name' => $r['name'], 'count' => (int)$r['n']],
    q("SELECT label AS name, COUNT(*) AS n FROM analytics_events WHERE type = 'faq_search' AND label <> '' AND day BETWEEN ? AND ? GROUP BY label ORDER BY n DESC LIMIT 8", $range)
);

$referrers = array_map(static function ($r) {
    $r['name'] = $r['name'] === '' ? 'Direct / none' : $r['name'];
    return $r;
}, $breakdown('referrer'));

json_response(200, [
    'range' => ['days' => $days, 'start' => $start, 'end' => $end],
    'totals' => totals($start, $end),
    'previous' => totals($prevStart, $prevEnd),
    'series' => array_values($series),
    'pages' => $breakdown('path', 12),
    'referrers' => $referrers,
    'campaigns' => array_values(array_filter($breakdown('utm_source'), static fn($r) => $r['name'] !== '')),
    'devices' => $breakdown('device', 3),
    'browsers' => $breakdown('browser', 6),
    'funnel' => $funnel,
    'ctas' => $ctas,
    'searches' => $searches,
    'enquiryKinds' => array_map(static fn($r) => ['name' => $r['kind'], 'count' => (int)$r['n']], q('SELECT kind, COUNT(*) AS n FROM enquiries WHERE created_at BETWEEN ? AND ? GROUP BY kind ORDER BY n DESC', [$start . ' 00:00:00', $end . ' 23:59:59'])),
    'pipeline' => array_map(static fn($r) => ['name' => $r['status'], 'count' => (int)$r['n']], q('SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status')),
]);
