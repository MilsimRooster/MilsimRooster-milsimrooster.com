CREATE TABLE IF NOT EXISTS traffic_referrer_daily (
  day TEXT NOT NULL,
  referrer_family TEXT NOT NULL,
  referrer_host TEXT NOT NULL,
  landing_page TEXT NOT NULL,
  page_loads INTEGER NOT NULL DEFAULT 0,
  first_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, referrer_family, referrer_host, landing_page)
);

CREATE INDEX IF NOT EXISTS idx_traffic_referrer_daily_day_loads
  ON traffic_referrer_daily (day DESC, page_loads DESC);
