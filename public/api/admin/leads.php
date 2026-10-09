<?php
/**
 * GET  /api/admin/leads.php?status=&kind=&q=&page=1  — paged enquiry inbox
 * POST /api/admin/leads.php {id, status?, notes?}      — update one enquiry
 */

declare(strict_types=1);

require __DIR__ . '/../inc/bootstrap.php';

require_method('GET', 'POST');
require_admin();

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived'];
const LEAD_KINDS = ['campaign', 'adapt', 'contact', 'market', 'creator'];

$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = read_json_body(12000);
    $id = is_string($input['id'] ?? null) ? $input['id'] : '';
    $sets = [];
    $params = [];
    if (array_key_exists('status', $input)) {
        if (!in_array($input['status'], LEAD_STATUSES, true)) {
            json_response(400, ['error' => 'Choose a valid status.']);
        }
        $sets[] = 'status = ?';
        $params[] = $input['status'];
    }
    if (array_key_exists('notes', $input)) {
        if (!is_string($input['notes']) || mb_strlen($input['notes'], 'UTF-8') > 5000) {
            json_response(400, ['error' => 'Keep notes under 5,000 characters.']);
        }
        $sets[] = 'notes = ?';
        $params[] = $input['notes'];
    }
    if (!$sets) {
        json_response(400, ['error' => 'Nothing to update.']);
    }
    $sets[] = 'updated_at = ?';
    $params[] = now_utc();
    $params[] = $id;
    $stmt = $pdo->prepare('UPDATE enquiries SET ' . implode(', ', $sets) . ' WHERE id = ?');
    $stmt->execute($params);
    if ($stmt->rowCount() === 0) {
        json_response(404, ['error' => 'That enquiry no longer exists.']);
    }
    audit('lead_updated', ['id' => $id, 'status' => $input['status'] ?? null]);
    json_response(200, ['ok' => true]);
}

$where = [];
$params = [];
if (in_array($_GET['status'] ?? '', LEAD_STATUSES, true)) {
    $where[] = 'status = ?';
    $params[] = $_GET['status'];
} elseif (($_GET['status'] ?? '') === 'open') {
    $where[] = "status NOT IN ('won', 'lost', 'archived')";
}
if (in_array($_GET['kind'] ?? '', LEAD_KINDS, true)) {
    $where[] = 'kind = ?';
    $params[] = $_GET['kind'];
}
$search = trim(is_string($_GET['q'] ?? null) ? mb_substr($_GET['q'], 0, 100, 'UTF-8') : '');
if ($search !== '') {
    $where[] = '(name LIKE ? OR email LIKE ? OR business LIKE ? OR reference LIKE ? OR message LIKE ?)';
    $like = '%' . addcslashes($search, '%_\\') . '%';
    array_push($params, $like, $like, $like, $like, $like);
}
$clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
$perPage = 25;
$page = max(1, (int)($_GET['page'] ?? 1));
$offset = ($page - 1) * $perPage;

$count = $pdo->prepare("SELECT COUNT(*) FROM enquiries {$clause}");
$count->execute($params);
$total = (int)$count->fetchColumn();

$stmt = $pdo->prepare("SELECT id, reference, kind, name, email, business, message, details, status, notes, created_at, updated_at FROM enquiries {$clause} ORDER BY created_at DESC LIMIT {$perPage} OFFSET {$offset}");
$stmt->execute($params);
$rows = array_map(static function ($r) {
    $r['details'] = json_decode($r['details'] ?? '{}', true) ?: new stdClass();
    return $r;
}, $stmt->fetchAll());

json_response(200, ['total' => $total, 'page' => $page, 'perPage' => $perPage, 'leads' => $rows, 'statuses' => LEAD_STATUSES]);
