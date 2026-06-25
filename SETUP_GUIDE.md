# Trading Journal Pro - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- OR Node.js 16+ and PostgreSQL

### Method 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/sinasdi/trading_gurnaling.git
cd trading_gurnaling

# Start application
docker-compose up --build

# Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
```

### Method 2: Manual Setup

#### Backend Setup
```bash
cd backend
npm install

# Create .env file with your Supabase credentials
cp .env.example .env

# Update DATABASE_URL with your Supabase connection string

# Run migrations
npm run migrate

# Start server
npm run dev
```

#### Frontend Setup
```bash
cd ../frontend
npm install

# Update .env with backend URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend
npm start
```

## 📊 Supabase Configuration

### 1. Create Supabase Project
- Visit https://supabase.com
- Click "New Project"
- Database Name: `trading_journal`
- Password: Use secure password
- Region: Asia-Pacific (Singapore/Tokyo for Iran)

### 2. Database Setup
- Go to SQL Editor
- Run the migration SQL from `backend/src/migrations/init.sql`
- This creates all tables automatically

### 3. Get Connection String
- Project Settings → Database
- Copy Connection String (URI)
- Replace in `.env`: `DATABASE_URL`

### 4. Get API Keys
- Project Settings → API
- Copy `anon public key` → `SUPABASE_KEY`
- Copy `service_role secret` → `SUPABASE_SERVICE_KEY`
- Copy Project URL → `SUPABASE_URL`

## 🌐 Deployment

### Frontend Deployment (Vercel)
```bash
npm install -g vercel
vercel

# Follow prompts and deploy
```

### Backend Deployment (Railway)
1. Connect GitHub repo to Railway.app
2. Add environment variables
3. Deploy

## 📱 Features

✅ Trade Logging with Screenshots
✅ Real-time Dashboard
✅ Advanced Analytics
✅ P&L Calculations
✅ Performance Milestones (Every 100 Trades)
✅ Strategy Breakdown
✅ Secure Authentication

## 🔑 API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/trades` - Create Trade
- `GET /api/trades` - List Trades
- `POST /api/screenshots/upload` - Upload Screenshot
- `GET /api/analytics/summary` - Get Summary
- `GET /api/analytics/performance-milestone` - Get Milestone Report

## 📧 Support

For issues, check:
- Backend logs: `docker-compose logs backend`
- Frontend console: Browser DevTools
- Supabase dashboard for database issues

## 🎯 Next Steps

1. Setup Supabase account
2. Add credentials to `.env`
3. Run migrations
4. Start application
5. Register and create first trade!

---

**Happy Trading! 📈**
