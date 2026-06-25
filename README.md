# 📈 Professional Trading Journal Web App

> A professional-grade trading journal platform with advanced analytics, screenshot management, and P&L tracking.

## Features

✅ **Trade Logging** - Record entry/exit prices, risk/reward, and outcomes
✅ **Screenshot Management** - Upload and manage trading screenshots
✅ **Dashboard** - Real-time statistics and performance metrics
✅ **Advanced Analytics** - P&L calculations, win rate, and strategy analysis
✅ **Performance Reports** - Detailed statistics after every 100 trades
✅ **Filters & Search** - Find trades by date, symbol, or strategy
✅ **Export Reports** - Download P&L reports as CSV/PDF

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Axios for API calls
- Chart.js for analytics visualization

### Backend
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- Multer for file uploads

### Deployment
- Frontend: Vercel
- Backend: Railway or Heroku
- Database: Supabase

## Installation

### Prerequisites
```bash
Node.js 16+
PostgreSQL
Git
```

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/sinasdi/trading_gurnaling.git
cd trading_gurnaling
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update DATABASE_URL and other configs

# Run migrations
npm run migrate

# Start server
npm run dev
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env

# Update REACT_APP_API_URL

# Start dev server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Trades
- `POST /api/trades` - Create new trade
- `GET /api/trades` - Get all trades (with filters)
- `GET /api/trades/:id` - Get trade details
- `PUT /api/trades/:id` - Update trade
- `DELETE /api/trades/:id` - Delete trade

### Analytics
- `GET /api/analytics/summary` - Overall statistics
- `GET /api/analytics/by-strategy` - Strategy breakdown
- `GET /api/analytics/report` - Detailed P&L report
- `GET /api/analytics/performance-milestone` - After 100 trades

### Screenshots
- `POST /api/screenshots/upload` - Upload screenshot
- `GET /api/screenshots/:tradeId` - Get trade screenshots
- `DELETE /api/screenshots/:id` - Delete screenshot

## Database Schema

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Trades
```sql
CREATE TABLE trades (
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
```

### Screenshots
```sql
CREATE TABLE screenshots (
  id SERIAL PRIMARY KEY,
  trade_id INT NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

1. Register and login
2. Navigate to "New Trade"
3. Enter trade details (symbol, entry, exit, risk/reward)
4. Upload screenshots
5. View dashboard for real-time analytics
6. Get performance reports every 100 trades

## Performance Milestones

Every 100 trades, you'll receive:
- Total P&L
- Win Rate %
- Average Win/Loss
- Best Trade
- Worst Trade
- Risk/Reward Ratio
- Strategy Breakdown

## Support

For issues or suggestions, please open an issue on GitHub.

## License

MIT
