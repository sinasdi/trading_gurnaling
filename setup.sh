#!/bin/bash

# Trading Journal Setup Script
echo "🚀 Trading Journal Pro - Automatic Setup"
echo "========================================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker found"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose found"

# Create environment files
echo ""
echo "📝 Creating environment files..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << 'EOF'
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@postgres:5432/trading_journal
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_KEY=your_service_key
MAX_FILE_SIZE=10485760
EOF
    echo "✅ backend/.env created"
else
    echo "⏭️  backend/.env already exists"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env..."
    echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env
    echo "✅ frontend/.env created"
else
    echo "⏭️  frontend/.env already exists"
fi

echo ""
echo "📦 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting application..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo ""
echo "📝 Next steps:"
echo "   1. Setup Supabase account (supabase.com)"
echo "   2. Update backend/.env with Supabase credentials"
echo "   3. Run database migrations"
echo ""
echo "View logs with: docker-compose logs -f"
echo "Stop services with: docker-compose down"
