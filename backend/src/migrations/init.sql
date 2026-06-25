-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  entry_price DECIMAL(15, 2) NOT NULL,
  exit_price DECIMAL(15, 2),
  quantity INT NOT NULL,
  risk_amount DECIMAL(15, 2),
  reward_amount DECIMAL(15, 2),
  pnl DECIMAL(15, 2),
  status VARCHAR(20) DEFAULT 'OPEN',
  strategy VARCHAR(100),
  notes TEXT,
  entry_date TIMESTAMP NOT NULL,
  exit_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create screenshots table
CREATE TABLE IF NOT EXISTS screenshots (
  id SERIAL PRIMARY KEY,
  trade_id INT NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_entry_date ON trades(entry_date);
CREATE INDEX IF NOT EXISTS idx_screenshots_trade_id ON screenshots(trade_id);
