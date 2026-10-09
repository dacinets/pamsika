-- ============================================================================
-- Pamsika website — MySQL 8 / MariaDB 10.4+ schema (Bluehost cPanel)
-- Import once in phpMyAdmin: select the database, Import, choose this file.
-- Safe to re-run: every statement is IF NOT EXISTS.
-- All timestamps are stored in UTC as 'YYYY-MM-DD HH:MM:SS'.
-- ============================================================================

SET NAMES utf8mb4;

-- Enquiries from every website form (campaign, adapt, contact, market, creator).
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` CHAR(36) NOT NULL COMMENT 'Client-generated request UUID; makes retries idempotent',
  `reference` VARCHAR(16) NOT NULL,
  `kind` VARCHAR(20) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `business` VARCHAR(180) NOT NULL DEFAULT '',
  `message` TEXT NOT NULL,
  `details` TEXT NOT NULL COMMENT 'JSON: idea, market, budget, timing, services, portfolio',
  `payload_hash` CHAR(64) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'new',
  `notes` TEXT NULL,
  `ip_hash` CHAR(64) NULL COMMENT 'Salted HMAC; raw IPs are never stored',
  `consent_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_enquiries_created` (`created_at`),
  KEY `idx_enquiries_status` (`status`),
  KEY `idx_enquiries_kind` (`kind`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cookie-free analytics: one row per page view or tracked interaction.
CREATE TABLE IF NOT EXISTS `analytics_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME NOT NULL,
  `day` DATE NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `path` VARCHAR(220) NOT NULL,
  `label` VARCHAR(120) NOT NULL DEFAULT '',
  `referrer` VARCHAR(120) NOT NULL DEFAULT '',
  `utm_source` VARCHAR(60) NOT NULL DEFAULT '',
  `device` VARCHAR(10) NOT NULL,
  `browser` VARCHAR(12) NOT NULL,
  `lang` VARCHAR(10) NOT NULL DEFAULT '',
  `visitor` CHAR(16) NOT NULL COMMENT 'Daily-rotating hash; cannot be linked across days',
  PRIMARY KEY (`id`),
  KEY `idx_events_day_type` (`day`, `type`),
  KEY `idx_events_visitor` (`day`, `visitor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `rate_limits` (
  `bucket` CHAR(40) NOT NULL,
  `hits` INT UNSIGNED NOT NULL DEFAULT 0,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`bucket`),
  KEY `idx_rate_limits_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME NOT NULL,
  `event` VARCHAR(64) NOT NULL,
  `ip_hash` CHAR(64) NULL,
  `detail` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
