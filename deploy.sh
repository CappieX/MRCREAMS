#!/bin/bash
# MR.CREAMS Automated Deployment Script

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting MR.CREAMS deployment process..."

# Configuration
FRONTEND_DIR="./frontend"
BACKEND_DIR="./backend"
DOCKER_COMPOSE_FILE="./docker-compose.yml"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display step information
step() {
  echo -e "${YELLOW}[STEP]${NC} $1"
}

# Function to display success messages
success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to display error messages
error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Check if Docker is running
step "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  error "Docker is not running. Please start Docker and try again."
fi
success "Docker is running"

# Pull latest changes from repository
step "Pulling latest changes from repository..."
git pull || error "Failed to pull latest changes"
success "Latest changes pulled successfully"

# Backend deployment
step "Building and deploying backend..."
cd $BACKEND_DIR || error "Backend directory not found"

# Install dependencies
step "Installing backend dependencies..."
npm install || error "Failed to install backend dependencies"
success "Backend dependencies installed"

# Run tests
step "Running backend tests..."
npm test || error "Backend tests failed"
success "Backend tests passed"

# Build backend
step "Building backend..."
npm run build || error "Failed to build backend"
success "Backend built successfully"

cd ..

# Frontend deployment
step "Building and deploying frontend..."
cd $FRONTEND_DIR || error "Frontend directory not found"

# Install dependencies
step "Installing frontend dependencies..."
npm install || error "Failed to install frontend dependencies"
success "Frontend dependencies installed"

# Run tests
step "Running frontend tests..."
npm test || error "Frontend tests failed"
success "Frontend tests passed"

# Build frontend
step "Building frontend..."
npm run build || error "Failed to build frontend"
success "Frontend built successfully"

cd ..

# Docker deployment
step "Building and starting Docker containers..."
docker-compose -f $DOCKER_COMPOSE_FILE down || echo "No containers to stop"
docker-compose -f $DOCKER_COMPOSE_FILE build || error "Failed to build Docker containers"
docker-compose -f $DOCKER_COMPOSE_FILE up -d || error "Failed to start Docker containers"
success "Docker containers started successfully"

# Verify deployment
step "Verifying deployment..."
sleep 5  # Wait for services to start

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
  success "Backend is running"
else
  error "Backend is not running"
fi

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
  success "Frontend is running"
else
  error "Frontend is not running"
fi

# Final success message
echo -e "\n${GREEN}✅ MR.CREAMS deployment completed successfully!${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend API: http://localhost:5000/api"
echo -e "Monitoring: http://localhost:9090"

exit 0