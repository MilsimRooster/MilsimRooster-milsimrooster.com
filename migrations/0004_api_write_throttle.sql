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
