<?php
// Usage: php tools/hash-password.php 'a-long-unique-password'
if ($argc < 2 || strlen($argv[1]) < 12) { fwrite(STDERR, "Give a password of at least 12 characters.\n"); exit(1); }
echo password_hash($argv[1], PASSWORD_DEFAULT), "\n";
