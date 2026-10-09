<?php
// Router for `php -S` that mimics Apache on Bluehost for local testing of out/.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = $_SERVER['DOCUMENT_ROOT'] . $path;
if (is_dir($file) && is_file(rtrim($file, '/') . '/index.html')) {
    if (!str_ends_with($path, '/')) { header('Location: ' . $path . '/', true, 301); return true; }
    readfile(rtrim($file, '/') . '/index.html');
    return true;
}
if (str_starts_with($path, '/api/inc/')) { http_response_code(403); return true; }
if (is_file($file)) { return false; }
http_response_code(404);
readfile($_SERVER['DOCUMENT_ROOT'] . '/404.html');
return true;
