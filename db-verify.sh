#!/bin/bash
# MR.CREAMS Database Verification Script

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Set default values
DOCKER_AVAILABLE=false
FALLBACK_MODE=true

# Check for docker-compose or docker compose
DOCKER_COMPOSE_CMD=""
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    DOCKER_AVAILABLE=true
    FALLBACK_MODE=false
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    DOCKER_AVAILABLE=true
    FALLBACK_MODE=false
else
    echo -e "${YELLOW}[INFO]${NC} Neither docker-compose nor docker compose is available"
    echo -e "${YELLOW}[INFO]${NC} To install Docker Desktop, visit: https://www.docker.com/products/docker-desktop/"
    echo -e "${YELLOW}[INFO]${NC} Running in fallback mode with limited functionality"
fi

echo "=== MR.CREAMS DATABASE VERIFICATION ==="
echo ""

# Define helper functions
step() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

info() {
  echo -e "${YELLOW}[INFO]${NC} $1"
}

if [ "$DOCKER_AVAILABLE" = true ]; then
  # Check database connection
  step "Checking database connection..."
  if ! $DOCKER_COMPOSE_CMD exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    error "Cannot connect to PostgreSQL database"
    exit 1
  fi
  success "Database connection successful"

  # List tables
  step "Listing database tables..."
  TABLES=$($DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -t -c "\dt")
  if [ -z "$TABLES" ]; then
    error "No tables found in database"
    exit 1
  fi
  success "Database tables found"
  echo "$TABLES"

  # Count records in key tables
  step "Counting records in key tables..."
  echo "Users:"
  $DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -c "SELECT COUNT(*) FROM users;"
  echo "Challenges:"
  $DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -c "SELECT COUNT(*) FROM challenges;"
  echo "Emotions:"
  $DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -c "SELECT COUNT(*) FROM emotions;"
  echo "Resources:"
  $DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -c "SELECT COUNT(*) FROM resources;"

  # Verify admin user
  step "Verifying admin user exists..."
  ADMIN_EXISTS=$($DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -t -c "SELECT COUNT(*) FROM users WHERE email = 'admin@mrcreams.local';")
  if [ -z "$ADMIN_EXISTS" ] || [ "$ADMIN_EXISTS" -eq 0 ]; then
    error "Admin user not found in database"
    exit 1
  fi
  success "Admin user exists"
else
  info "Docker is not available - skipping database verification"
  info "Install Docker Desktop to enable database verification capabilities"
  
  # Check if database configuration exists
  step "Checking for database configuration..."
  if [ -f ".env" ] && grep -q "DATABASE_URL" .env; then
    success "Database configuration found in .env file"
  elif [ -f "backend/.env" ] && grep -q "DATABASE_URL" backend/.env; then
    success "Database configuration found in backend/.env file"
  else
    info "No database configuration found. This is expected in a fresh installation."
  fi
fi

echo "=== DATABASE VERIFICATION COMPLETE ==="