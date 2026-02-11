#!/bin/bash

# SafeLanka Verification Script
# This script helps verify that your fixes and changes are working correctly

set -e

echo "=========================================="
echo "   SafeLanka Verification Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print info
info() {
    echo -e "ℹ $1"
}

# Check Node.js
echo "1. Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    success "Node.js installed: $NODE_VERSION"
else
    error "Node.js is not installed"
    exit 1
fi

# Check npm
echo ""
echo "2. Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    success "npm installed: $NPM_VERSION"
else
    error "npm is not installed"
    exit 1
fi

# Check MongoDB
echo ""
echo "3. Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    success "MongoDB Shell (mongosh) installed"
    # Try to connect to MongoDB
    if mongosh --eval "db.runCommand({ ping: 1 })" --quiet "mongodb://localhost:27017/safelanka" &> /dev/null; then
        success "MongoDB is running and accessible"
    else
        warning "MongoDB Shell found but cannot connect to database"
        info "Make sure MongoDB is running: sudo systemctl start mongod"
    fi
elif command -v mongo &> /dev/null; then
    success "MongoDB Shell (mongo) installed"
    if mongo --eval "db.runCommand({ ping: 1 })" --quiet "mongodb://localhost:27017/safelanka" &> /dev/null; then
        success "MongoDB is running and accessible"
    else
        warning "MongoDB Shell found but cannot connect to database"
        info "Make sure MongoDB is running: sudo systemctl start mongod"
    fi
else
    warning "MongoDB Shell not found. Install MongoDB to verify database connectivity."
fi

# Check Backend Directory
echo ""
echo "4. Checking Backend setup..."
if [ -d "backend" ]; then
    success "Backend directory exists"
    
    if [ -f "backend/package.json" ]; then
        success "Backend package.json found"
    else
        error "Backend package.json not found"
    fi
    
    if [ -d "backend/node_modules" ]; then
        success "Backend dependencies installed"
    else
        warning "Backend node_modules not found. Run: cd backend && npm install"
    fi
    
    if [ -f "backend/.env" ]; then
        success "Backend .env file exists"
    else
        warning "Backend .env file not found. Copy from .env.example"
    fi
else
    error "Backend directory not found"
fi

# Check Frontend Directory
echo ""
echo "5. Checking Frontend setup..."
if [ -d "frontend" ]; then
    success "Frontend directory exists"
    
    if [ -f "frontend/package.json" ]; then
        success "Frontend package.json found"
    else
        error "Frontend package.json not found"
    fi
    
    if [ -d "frontend/node_modules" ]; then
        success "Frontend dependencies installed"
    else
        warning "Frontend node_modules not found. Run: cd frontend && npm install"
    fi
    
    if [ -f "frontend/.env" ]; then
        success "Frontend .env file exists"
    else
        warning "Frontend .env file not found. You may need to create it from .env.example"
    fi
else
    error "Frontend directory not found"
fi

# Check if backend server is running
echo ""
echo "6. Checking if services are running..."
if curl -s http://localhost:5080/health &> /dev/null; then
    success "Backend server is running on port 5080"
    
    # Check health endpoint response
    HEALTH_RESPONSE=$(curl -s http://localhost:5080/health)
    if echo "$HEALTH_RESPONSE" | grep -q "OK"; then
        success "Backend health check passed"
        echo "$HEALTH_RESPONSE" | grep -o '"database":"[^"]*"' | sed 's/"database":"/Database: /' | sed 's/"$//'
    fi
else
    warning "Backend server is not running"
    info "Start it with: cd backend && npm run dev"
fi

if curl -s http://localhost:5173 &> /dev/null; then
    success "Frontend server is running on port 5173"
else
    warning "Frontend server is not running"
    info "Start it with: cd frontend && npm run dev"
fi

# Summary
echo ""
echo "=========================================="
echo "   Verification Summary"
echo "=========================================="
echo ""

if [ -f "backend/.env" ] && [ -f "backend/node_modules" ]; then
    success "Backend is ready"
else
    warning "Backend needs configuration"
    info "1. Copy backend/.env.example to backend/.env"
    info "2. Run: cd backend && npm install"
fi

if [ -f "frontend/node_modules" ]; then
    success "Frontend is ready"
else
    warning "Frontend needs configuration"
    info "Run: cd frontend && npm install"
fi

echo ""
echo "Next Steps:"
echo "1. Review VERIFICATION.md for detailed verification steps"
echo "2. Review TESTING.md for testing procedures"
echo "3. Run backend: cd backend && npm run dev"
echo "4. Run frontend: cd frontend && npm run dev"
echo "5. Check database: cd backend && node check-database.js"
echo ""
echo "=========================================="
