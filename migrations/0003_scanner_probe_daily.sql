CREATE TABLE IF NOT EXISTS scanner_probe_daily (
  day TEXT NOT NULL,
  country TEXT NOT NULL,
  asn INTEGER NOT NULL DEFAULT 0,
  as_organization TEXT NOT NULL,
  method TEXT NOT NULL,
  path_bucket TEXT NOT NULL,
  user_agent_family TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  first_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, country, asn, as_organization, method, path_bucket, user_agent_family)
);

CREATE INDEX IF NOT EXISTS idx_scanner_probe_daily_day_hits
  ON scanner_probe_daily (day DESC, hits DESC);
