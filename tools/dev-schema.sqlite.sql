-- Local development only. Production uses database/schema.sql (MySQL). Keep columns in sync.
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, reference TEXT NOT NULL, kind TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, business TEXT NOT NULL DEFAULT '', message TEXT NOT NULL, details TEXT NOT NULL, payload_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', notes TEXT, ip_hash TEXT, consent_at TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
CREATE TABLE IF NOT EXISTS analytics_events (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL, day TEXT NOT NULL, type TEXT NOT NULL, path TEXT NOT NULL, label TEXT NOT NULL DEFAULT '', referrer TEXT NOT NULL DEFAULT '', utm_source TEXT NOT NULL DEFAULT '', device TEXT NOT NULL, browser TEXT NOT NULL, lang TEXT NOT NULL DEFAULT '', visitor TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_events_day_type ON analytics_events(day, type);
CREATE TABLE IF NOT EXISTS rate_limits (bucket TEXT PRIMARY KEY, hits INTEGER NOT NULL DEFAULT 0, expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL, event TEXT NOT NULL, ip_hash TEXT, detail TEXT);
