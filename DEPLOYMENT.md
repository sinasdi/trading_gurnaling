# Production Deployment Guide

## 🌍 Deploy to Vercel (Frontend)

### Step 1: Prepare
```bash
cd frontend
```

### Step 2: Create Vercel Config
Create `vercel.json`:
```json
{
  "env": [
    {
      "key": "REACT_APP_API_URL",
      "value": "https://your-backend-url.com/api"
    }
  ]
}
```

### Step 3: Deploy
```bash
npm install -g vercel
vercel
```

---

## 🚀 Deploy Backend to Railway

### Step 1: Create Railway Account
- Visit https://railway.app
- Connect GitHub

### Step 2: Create New Service
- Select "Deploy from GitHub repo"
- Choose `trading_gurnaling`

### Step 3: Add Environment Variables
In Railway dashboard:
```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-vercel-app.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_key
```

### Step 4: Deploy
Railway auto-deploys on push to main

---

## 🗄️ Production Database

### Use Supabase
1. Create production project on Supabase
2. Copy connection string
3. Update `DATABASE_URL` in deployment
4. Run migrations on production database

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to strong key
- [ ] Use HTTPS for all URLs
- [ ] Enable CORS only for your domain
- [ ] Use environment variables (never commit secrets)
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Regular database backups

---

## 📊 Monitoring

### Vercel
- Dashboard at vercel.com
- Monitor functions and errors

### Railway
- Real-time logs
- Performance metrics

### Supabase
- Database analytics
- API usage statistics

