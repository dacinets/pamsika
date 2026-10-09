<?php
/**
 * Server-side enquiry validation. Mirrors lib/enquiry-validation.mjs so the
 * browser and the server agree on every rule; tests/api.test.mjs runs the
 * same cases against both.
 */

declare(strict_types=1);

const CAMPAIGN_SERVICES = ['Creative strategy', 'Commercial production', 'Social campaigns', 'Brand and design'];
const MARKET_SERVICES = ['Film and video', 'Design and branding', 'Photography', 'Writing and content', 'Sound and voice', 'Animation and motion', 'Illustration and 3D design', 'Translation and localisation', 'Web design and development', 'User experience and interface design', 'E-commerce', 'AI and business automation', 'Software and app development', 'Search and campaign analytics'];
const ENQUIRY_KINDS = ['campaign', 'adapt', 'contact', 'market', 'creator'];

/** @return array{success:bool, errors?:array<string,string>, data?:array<string,mixed>} */
function validate_enquiry(array $raw): array
{
    $errors = [];
    $text = static function (string $key, int $max, bool $required = false) use ($raw, &$errors): string {
        $value = is_string($raw[$key] ?? null) ? trim($raw[$key]) : '';
        if ($required && $value === '') {
            $errors[$key] = 'Complete this field.';
        }
        if (mb_strlen($value, 'UTF-8') > $max) {
            $errors[$key] = "Keep this under {$max} characters.";
        }
        return $value;
    };

    $kind = $text('kind', 20, true);
    if (!in_array($kind, ENQUIRY_KINDS, true)) {
        $errors['kind'] = 'Choose a valid enquiry type.';
    }
    $isMarket = in_array($kind, ['market', 'creator'], true);

    $name = $text('name', 120, true);
    $email = $text('email', 254, true);
    $business = $text('business', 180, !in_array($kind, ['contact', 'creator'], true));
    $message = $text('message', 5000, true);

    if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/u', $email)) {
        $errors['email'] = 'Add a valid email address so we can reply.';
    }
    if (mb_strlen($message, 'UTF-8') < 10) {
        $errors['message'] = 'Tell us a little more, using at least 10 characters.';
    }
    $consent = ($raw['consent'] ?? null) === true;
    if (!$consent) {
        $errors['consent'] = 'Agree to be contacted about this enquiry.';
    }

    $idea = $text('idea', 1000, $kind === 'adapt');
    $market = $text('market', 180, $kind === 'creator');
    $budget = $text('budget', 80);
    $timing = $text('timing', 100);

    $allowed = $isMarket ? MARKET_SERVICES : CAMPAIGN_SERVICES;
    $services = [];
    if (is_array($raw['services'] ?? null)) {
        foreach ($raw['services'] as $service) {
            if (is_string($service) && in_array($service, $allowed, true)) {
                $services[] = $service;
            }
        }
    }
    if ($isMarket && count($services) === 0) {
        $errors['services'] = 'Choose at least one creative discipline.';
    }

    $portfolio = '';
    if ($kind === 'creator') {
        $portfolio = $text('portfolio', 2000, true);
        $parts = parse_url($portfolio);
        if (!is_array($parts) || ($parts['scheme'] ?? '') !== 'https' || isset($parts['user']) || isset($parts['pass']) || !str_contains($parts['host'] ?? '', '.')) {
            $errors['portfolio'] = 'Add a public HTTPS link to your portfolio or work profile.';
        }
    }

    $requestId = $text('requestId', 36, true);
    if (!preg_match('/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i', $requestId)) {
        $errors['requestId'] = 'Refresh the page and try again.';
    }

    if ($errors) {
        return ['success' => false, 'errors' => $errors];
    }

    $data = compact('kind', 'name', 'email', 'business', 'message', 'consent', 'idea', 'market', 'budget', 'timing', 'services');
    if ($kind === 'creator') {
        $data['portfolio'] = $portfolio;
    }
    $data['requestId'] = strtolower($requestId);
    return ['success' => true, 'data' => $data];
}
