<?php
/**
 * New-lead notification email using PHP mail(), which Bluehost routes through
 * its local mail server. Set notify.to in the private config to enable it.
 * A failed email never fails the enquiry: the lead is already saved and is
 * visible in the dashboard.
 */

declare(strict_types=1);

const ENQUIRY_LABELS = [
    'campaign' => 'Campaign brief',
    'adapt' => 'Adapt an idea',
    'contact' => 'Contact message',
    'market' => 'Creative Market request',
    'creator' => 'Creator application',
];

function notify_new_enquiry(array $d, string $reference): void
{
    $notify = pamsika_config()['notify'] ?? [];
    $to = $notify['to'] ?? '';
    $from = $notify['from'] ?? '';
    if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        return;
    }

    // Strip CR/LF from anything that reaches a header.
    $clean = static fn(string $v): string => trim(preg_replace('/[\r\n]+/', ' ', $v) ?? '');
    $label = ENQUIRY_LABELS[$d['kind']] ?? 'Enquiry';
    $subject = '=?UTF-8?B?' . base64_encode("New {$label}: {$clean($d['name'])} ({$reference})") . '?=';

    $lines = [
        "{$label} received on the Pamsika website.",
        '',
        "Reference: {$reference}",
        "Name: {$d['name']}",
        "Email: {$d['email']}",
        $d['business'] !== '' ? "Business: {$d['business']}" : null,
        $d['services'] ? 'Services: ' . implode(', ', $d['services']) : null,
        $d['market'] !== '' ? "Market / location: {$d['market']}" : null,
        $d['idea'] !== '' ? "Idea: {$d['idea']}" : null,
        $d['budget'] !== '' ? "Budget: {$d['budget']}" : null,
        $d['timing'] !== '' ? "Timing: {$d['timing']}" : null,
        !empty($d['portfolio']) ? "Portfolio: {$d['portfolio']}" : null,
        '',
        'Message:',
        $d['message'],
        '',
        'Open the dashboard to update its status: ' . rtrim(pamsika_config()['app']['url'] ?? '', '/') . '/admin/',
    ];
    $body = implode("\r\n", array_filter($lines, static fn($l) => $l !== null));

    $headers = [
        'From: Pamsika Website <' . $from . '>',
        'Reply-To: ' . $clean($d['email']),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    try {
        if (!@mail($to, $subject, $body, implode("\r\n", $headers), '-f' . $from)) {
            error_log('Pamsika: lead notification mail() returned false for ' . $reference);
        }
    } catch (Throwable $e) {
        error_log('Pamsika: lead notification failed: ' . $e->getMessage());
    }
}
