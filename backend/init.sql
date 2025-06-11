CREATE TABLE IF NOT EXISTS integrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  base_url TEXT NOT NULL,
  usage_limit INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO integrations (name, api_key, base_url, usage_limit, is_active)
VALUES 
  ('Frankfurter', '', 'https://api.frankfurter.app', 1000, true),
  ('ExchangeRate API', '', 'https://v6.exchangerate-api.com/v6/demo/latest', 1000, true);
