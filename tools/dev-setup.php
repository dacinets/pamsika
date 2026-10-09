<?php
/**
 * Local development setup: creates tools/dev-data/ with a SQLite database and a
 * config file whose admin is dev@pamsika.test / dev-password.
 * Usage: php tools/dev-setup.php [--demo]   (--demo seeds 60 days of sample analytics)
 * Then:  PAMSIKA_CONFIG=tools/dev-data/config.php npm run php:serve
 */
declare(strict_types=1);
$dir = __DIR__ . '/dev-data';
@mkdir($dir, 0700, true);
$db = $dir . '/pamsika.sqlite';
$pdo = new PDO('sqlite:' . $db);
$pdo->exec(file_get_contents(__DIR__ . '/dev-schema.sqlite.sql'));
file_put_contents($dir . '/config.php', "<?php\nreturn " . var_export([
    'db' => ['driver' => 'sqlite', 'path' => $db],
    'app' => ['url' => 'http://127.0.0.1:8080', 'hash_salt' => bin2hex(random_bytes(16)), 'allowed_origins' => []],
    'admins' => [['email' => 'dev@pamsika.test', 'password_hash' => password_hash('dev-password', PASSWORD_DEFAULT)]],
    'notify' => ['to' => '', 'from' => ''],
    'security' => ['enquiries_per_hour' => 50],
], true) . ";\n");
echo "Dev database and config written to {$dir}\n";

if (in_array('--demo', $argv, true)) {
    mt_srand(7);
    $pdo->exec('DELETE FROM analytics_events');
    $pages = ['/' => 40, '/adlab/' => 14, '/creative-market/' => 12, '/work/' => 9, '/faq/' => 8, '/services/' => 6, '/start-a-campaign/' => 5, '/about/' => 4, '/creative-market/photography/' => 3, '/work/made-of-ambition/' => 3, '/contact/' => 2, '/creative-market/join/' => 2];
    $refs = ['' => 45, 'google.com' => 25, 'facebook.com' => 12, 'instagram.com' => 8, 'linkedin.com' => 5, 'wa.me' => 5];
    $devices = ['mobile' => 64, 'desktop' => 28, 'tablet' => 8];
    $browsers = ['Chrome' => 58, 'Safari' => 18, 'Samsung' => 10, 'Opera' => 8, 'Firefox' => 4, 'Edge' => 2];
    $ctas = ['Start a campaign (header)', 'Start a campaign (hero)', 'Explore AdLab', 'Request a match', 'Join as a creator'];
    $searches = ['how much does it cost', 'photography', 'join as creator', 'video ads', 'how long'];
    $pick = static function (array $w) { $r = mt_rand(1, array_sum($w)); foreach ($w as $k => $v) { $r -= $v; if ($r <= 0) return $k; } return array_key_first($w); };
    $ins = $pdo->prepare('INSERT INTO analytics_events (created_at, day, type, path, label, referrer, utm_source, device, browser, lang, visitor) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
    $pdo->beginTransaction();
    for ($i = 59; $i >= 0; $i--) {
        $day = gmdate('Y-m-d', strtotime("-{$i} days"));
        $growth = 1 + (59 - $i) / 40;
        $visitors = (int)round((18 + mt_rand(0, 14)) * $growth * (in_array(gmdate('N', strtotime($day)), ['6', '7'], true) ? 0.7 : 1));
        for ($v = 0; $v < $visitors; $v++) {
            $vid = substr(md5($day . $v), 0, 16);
            $ref = $pick($refs); $dev = $pick($devices); $br = $pick($browsers);
            $utm = mt_rand(1, 10) === 1 ? 'whatsapp-launch' : '';
            $views = mt_rand(1, 10) <= 4 ? 1 : mt_rand(2, 5);
            $at = $day . sprintf(' %02d:%02d:00', mt_rand(6, 22), mt_rand(0, 59));
            for ($p = 0; $p < $views; $p++) {
                $ins->execute([$at, $day, 'pageview', $p === 0 ? '/' : $pick($pages), '', $p === 0 ? $ref : '', $utm, $dev, $br, 'en', $vid]);
            }
            if (mt_rand(1, 5) === 1) $ins->execute([$at, $day, 'cta_click', '/', $ctas[array_rand($ctas)], '', '', $dev, $br, 'en', $vid]);
            if (mt_rand(1, 12) === 1) $ins->execute([$at, $day, 'faq_search', '/faq/', $searches[array_rand($searches)], '', '', $dev, $br, 'en', $vid]);
            if (mt_rand(1, 6) === 1) {
                $ins->execute([$at, $day, 'form_view', '/start-a-campaign/', '', '', '', $dev, $br, 'en', $vid]);
                if (mt_rand(1, 2) === 1) { $ins->execute([$at, $day, 'form_start', '/start-a-campaign/', '', '', '', $dev, $br, 'en', $vid]);
                    if (mt_rand(1, 2) === 1) { $ins->execute([$at, $day, 'form_review', '/start-a-campaign/', '', '', '', $dev, $br, 'en', $vid]);
                        if (mt_rand(1, 4) <= 3) $ins->execute([$at, $day, 'form_submit', '/start-a-campaign/', 'campaign', '', '', $dev, $br, 'en', $vid]); } }
            }
        }
    }
    $pdo->commit();
    $names = [['Chikondi Banda', 'Lake Shore Lodge', 'campaign'], ['Thandiwe Phiri', 'Mzuzu Coffee Co.', 'campaign'], ['Kondwani Mwale', '', 'creator'], ['Grace Chirwa', 'Zomba Organics', 'market'], ['Daniel Nkhoma', 'Nkhoma Motors', 'adapt'], ['Mercy Kumwenda', 'Blantyre Fashion House', 'campaign'], ['Yamikani Gondwe', '', 'contact'], ['Pemphero Jere', 'Lilongwe Bakes', 'market']];
    $statuses = ['new', 'new', 'contacted', 'qualified', 'proposal', 'won', 'new', 'contacted'];
    $pdo->exec('DELETE FROM enquiries');
    $e = $pdo->prepare("INSERT INTO enquiries (id, reference, kind, name, email, business, message, details, payload_hash, status, notes, ip_hash, consent_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,'','',?,?,?)");
    foreach ($names as $n => [$name, $biz, $kind]) {
        for ($k = 0; $k < 3; $k++) {
            $id = sprintf('%08x-%04x-4%03x-a%03x-%012x', mt_rand(), mt_rand(0, 0xffff), mt_rand(0, 0xfff), mt_rand(0, 0xfff), mt_rand());
            $at = gmdate('Y-m-d H:i:s', strtotime('-' . mt_rand(0, 58) . ' days -' . mt_rand(0, 600) . ' minutes'));
            $services = $kind === 'market' || $kind === 'creator' ? ['Photography'] : ['Commercial production', 'Social campaigns'];
            $e->execute([$id, 'PAM-' . strtoupper(substr($id, 0, 8)), $kind, $name, strtolower(str_replace(' ', '.', $name)) . '@example.com', $biz,
                'We are launching a new product line next quarter and want a short brand film plus social cutdowns for Facebook and WhatsApp.',
                json_encode(['idea' => '', 'market' => 'Malawi', 'budget' => 'MWK 1–3 million', 'timing' => 'In 1–3 months', 'services' => $services, 'portfolio' => $kind === 'creator' ? 'https://portfolio.example/work' : '']),
                str_repeat('0', 64), $statuses[($n + $k) % count($statuses)], $at, $at, $at]);
        }
    }
    echo "Demo analytics and enquiries seeded.\n";
}
