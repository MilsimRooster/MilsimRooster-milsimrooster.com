CREATE TABLE IF NOT EXISTS recipe_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_recipe_ratings_slug_created
  ON recipe_ratings (recipe_slug, created_at DESC);

CREATE TABLE IF NOT EXISTS recipe_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_slug TEXT NOT NULL,
  name TEXT,
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recipe_comments_slug_status_created
  ON recipe_comments (recipe_slug, status, created_at DESC);

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

CREATE TABLE IF NOT EXISTS api_write_throttle (
  bucket TEXT NOT NULL,
  client_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  first_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (bucket, client_hash, window_start)
);

CREATE INDEX IF NOT EXISTS idx_api_write_throttle_window
  ON api_write_throttle (window_start DESC, hits DESC);
