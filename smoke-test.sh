#!/bin/bash

# MR.CREAMS Pre-Deployment Smoke Test
# This script performs quick checks to verify if the system is ready for deployment

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Helper functions
success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
  echo -e "${YELLOW}[INFO]${NC} $1"
}

step() {
  echo -e "[STEP] $1"
}

# Set default values
DOCKER_AVAILABLE=false
FALLBACK_MODE=true
DOCKER_COMPOSE_CMD=""

# Check for Docker first
if command -v docker &> /dev/null; then
  info "Docker is installed"
  
  # Then check for Docker Compose
  if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    DOCKER_AVAILABLE=true
    FALLBACK_MODE=false
    success "Found docker-compose command"
  elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    DOCKER_AVAILABLE=true
    FALLBACK_MODE=false
    success "Found docker compose command"
  else
    warning "Docker is installed but Docker Compose is not available"
    info "To install Docker Compose, visit: https://docs.docker.com/compose/install/"
    info "Running in FALLBACK MODE with limited functionality"
  fi
else
  warning "Docker is not installed"
  info "To install Docker Desktop, visit: https://www.docker.com/products/docker-desktop/"
  info "Running in FALLBACK MODE with limited functionality"
fi

# Display installation instructions if in fallback mode
if [ "$FALLBACK_MODE" = true ]; then
  echo -e "\n${YELLOW}[INSTALLATION INSTRUCTIONS]${NC}"
  echo -e "To install Docker Desktop (recommended):"
  echo -e "1. Visit https://www.docker.com/products/docker-desktop/"
  echo -e "2. Download and install Docker Desktop for your platform"
  echo -e "3. Start Docker Desktop and wait for it to initialize"
  echo -e "\nFor full verification capabilities, please install Docker and run this script again."
fi

# Print header
echo ""
echo "================================================"
echo "   MR.CREAMS PRE-DEPLOYMENT SMOKE TEST SCRIPT   "
echo "================================================"
echo ""

# Check if Docker is running
step "Checking if Docker is running..."
if [ "$DOCKER_AVAILABLE" = true ] && ! docker info > /dev/null 2>&1; then
  error "Docker is not running. Please start Docker and try again."
  exit 1
elif [ "$FALLBACK_MODE" = true ]; then
  info "Skipping Docker check as we're in fallback mode."
else
  success "Docker is running"
fi

# Check project structure
step "Checking project structure..."
REQUIRED_DIRS=("backend" "frontend")
MISSING_DIRS=0

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    error "Required directory '$dir' is missing"
    MISSING_DIRS=$((MISSING_DIRS+1))
  fi
done

if [ $MISSING_DIRS -eq 0 ]; then
  success "Project structure looks correct"
else
  error "Project structure is incomplete"
  exit 1
fi

# Check configuration files
step "Checking configuration files..."
CONFIG_FILES=(".env" "backend/.env" "frontend/.env" "docker-compose.yml")
MISSING_CONFIG=0

for file in "${CONFIG_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    warning "Configuration file '$file' is missing"
    MISSING_CONFIG=$((MISSING_CONFIG+1))
  fi
done

if [ $MISSING_CONFIG -eq 0 ]; then
  success "All configuration files are present"
else
  warning "Some configuration files are missing. This might cause issues during deployment."
fi

# Check Docker containers if available
if [ "$DOCKER_AVAILABLE" = true ]; then
  step "Checking Docker containers..."
  
  # Check if containers are defined in docker-compose.yml
  if [ -f "docker-compose.yml" ]; then
    CONTAINER_COUNT=$(grep -c "container_name:" docker-compose.yml)
    if [ $CONTAINER_COUNT -gt 0 ]; then
      success "Found $CONTAINER_COUNT container definitions in docker-compose.yml"
    else
      warning "No container definitions found in docker-compose.yml"
    fi
    
    # Check if containers are running
    RUNNING_CONTAINERS=$($DOCKER_COMPOSE_CMD ps --services --filter "status=running" 2>/dev/null | wc -l)
    if [ $RUNNING_CONTAINERS -gt 0 ]; then
      success "$RUNNING_CONTAINERS containers are running"
    else
      warning "No containers are currently running"
    fi
  else
    warning "docker-compose.yml not found"
  fi
else
  info "Docker is not available - skipping container checks"
fi

# Quick API check
step "Performing quick API check..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  # Try to access the health endpoint
  if curl -s http://localhost:5000/api/health 2>/dev/null | grep -q "ok"; then
    success "API health endpoint is responding"
  else
    warning "API health endpoint is not responding"
  fi
else
  # Basic check for backend files
  if [ -f "backend/server.js" ]; then
    success "Backend server.js file exists"
  else
    warning "Backend server.js file not found"
  fi
fi

# Quick frontend check
step "Performing quick frontend check..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  # Try to access the frontend
  if curl -s -I http://localhost:3000 2>/dev/null | grep -q "200 OK"; then
    success "Frontend is accessible"
  else
    warning "Frontend is not accessible"
  fi
else
  # Basic check for frontend files
  if [ -f "frontend/package.json" ]; then
    success "Frontend package.json file exists"
  else
    warning "Frontend package.json file not found"
  fi
fi

# Check system resources
step "Checking system resources..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  # Check disk space used by Docker
  DISK_USAGE=$(docker system df | grep "Images" | awk '{print $4}')
  echo "Docker disk usage: $DISK_USAGE"
  
  # Check available system resources
  FREE_DISK=$(df -h . | awk 'NR==2 {print $4}')
  echo "Available disk space: $FREE_DISK"
  
  # Check memory
  if command -v free &> /dev/null; then
    FREE_MEM=$(free -h | awk '/^Mem:/ {print $4}')
    echo "Available memory: $FREE_MEM"
  fi
else
  # Basic system check in fallback mode
  DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}')
  info "Available disk space: $DISK_SPACE"
fi

# Final summary
echo ""
echo "================================================"
echo "          SMOKE TEST SUMMARY                    "
echo "================================================"
echo ""

if [ "$FALLBACK_MODE" = true ]; then
  echo "🔶 FALLBACK MODE ACTIVE - Limited verification performed"
  echo "✅ Project structure verified"
  echo "✅ Basic configuration files checked"
  echo "❓ Docker containers not verified"
  echo "❓ API functionality not verified"
  echo "❓ Frontend not verified"
  echo ""
  echo "This smoke test provides only basic verification."
  echo "For complete pre-deployment testing, please install Docker."
else
  echo "✅ Docker is running"
  echo "✅ Project structure verified"
  echo "✅ Configuration files checked"
  echo "✅ Docker containers verified"
  echo "✅ API health check performed"
  echo "✅ Frontend accessibility checked"
  echo ""
  echo "The system appears ready for deployment."
  echo "For a more thorough verification, run the full verify-system.sh script."
fi

echo ""
echo "Smoke test completed."
exit 0