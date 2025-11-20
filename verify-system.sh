#!/bin/bash
# MR.CREAMS System Verification Script

set -e  # Exit immediately if a command exits with a non-zero status

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set default values
DOCKER_AVAILABLE=false
FALLBACK_MODE=true
DOCKER_COMPOSE_CMD=""

# Check for Docker first
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}[INFO]${NC} Docker is installed"
    
    # Then check for Docker Compose
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
        DOCKER_AVAILABLE=true
        FALLBACK_MODE=false
        echo -e "${GREEN}[SUCCESS]${NC} Found docker-compose command"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
        DOCKER_AVAILABLE=true
        FALLBACK_MODE=false
        echo -e "${GREEN}[SUCCESS]${NC} Found docker compose command"
    else
        echo -e "${YELLOW}[WARNING]${NC} Docker is installed but Docker Compose is not available"
        echo -e "${YELLOW}[INFO]${NC} To install Docker Compose, visit: https://docs.docker.com/compose/install/"
        echo -e "Running in ${YELLOW}FALLBACK MODE${NC} with limited functionality"
    fi
else
    echo -e "${YELLOW}[WARNING]${NC} Docker is not installed"
    echo -e "Running in ${YELLOW}FALLBACK MODE${NC} with limited functionality"
    echo ""
    echo -e "${BLUE}[INSTALLATION INSTRUCTIONS]${NC}"
    echo "To install Docker Desktop (recommended):"
    echo "1. Visit https://www.docker.com/products/docker-desktop/"
    echo "2. Download and install Docker Desktop for your platform"
    echo "3. Start Docker Desktop and wait for it to initialize"
    echo ""
    echo "For full verification capabilities, please install Docker and run this script again."
    echo ""
fi

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo -e "${YELLOW}[INFO]${NC} Using command: ${DOCKER_COMPOSE_CMD}"
fi

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
}

# Function to display info messages
info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

echo "================================================"
echo "   MR.CREAMS LOCAL SYSTEM VERIFICATION SCRIPT   "
echo "================================================"

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

# Check if we're in the right directory
step "Checking directory structure..."
if [ ! -f "docker-compose.yml" ]; then
  error "docker-compose.yml not found. Please run this script from the MR.CREAMS project root directory."
  exit 1
fi
success "Directory structure looks correct"

# Docker-based checks
if [ "$DOCKER_AVAILABLE" = true ]; then
  # Check if containers are running
  step "Checking if containers are running..."
  if ! $DOCKER_COMPOSE_CMD ps | grep -q "Up"; then
    error "MR.CREAMS containers are not running. Please start them with '$DOCKER_COMPOSE_CMD up -d'"
    exit 1
  fi
  success "MR.CREAMS containers are running"

  # Verify database connection
  step "Verifying database connection..."
  if ! $DOCKER_COMPOSE_CMD exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    error "Cannot connect to PostgreSQL database"
    exit 1
  fi
  success "Database connection successful"

  # Verify database schema
  step "Verifying database schema..."
  TABLES=$($DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
  if [ -z "$TABLES" ] || [ "$TABLES" -lt 5 ]; then
    error "Database schema verification failed. Expected tables not found."
    exit 1
  fi
  success "Database schema verified (found $TABLES tables)"

  # Verify admin user exists
  step "Verifying admin user exists..."
  ADMIN_EXISTS=$($DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -t -c "SELECT COUNT(*) FROM users WHERE email = 'admin@mrcreams.local';")
  if [ -z "$ADMIN_EXISTS" ] || [ "$ADMIN_EXISTS" -eq 0 ]; then
    error "Admin user not found in database"
    
    info "Attempting to create admin user..."
    $DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -c "
    INSERT INTO users (email, password_hash, role, is_admin) 
    VALUES ('admin@mrcreams.local', '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true) 
    ON CONFLICT DO NOTHING;"
    
    # Verify again
    ADMIN_EXISTS=$($DOCKER_COMPOSE_CMD exec -T postgres psql -U postgres -d mrcreams_local -t -c "SELECT COUNT(*) FROM users WHERE email = 'admin@mrcreams.local';")
    if [ -z "$ADMIN_EXISTS" ] || [ "$ADMIN_EXISTS" -eq 0 ]; then
      error "Failed to create admin user"
      exit 1
    fi
    success "Admin user created successfully"
  else
    success "Admin user exists"
  fi
else
  # Fallback mode - basic checks without Docker
  step "Checking project structure..."
  if [ -f "docker-compose.yml" ] && [ -d "frontend" ] && [ -d "backend" ]; then
    success "Project structure looks correct"
  else
    error "Project structure verification failed. Expected docker-compose.yml, frontend/ and backend/ directories"
    exit 1
  fi
  
  info "Docker is not available - skipping container and database checks"
  info "Install Docker Desktop to enable full verification capabilities"
fi

# Verify backend API is responding
step "Verifying backend API..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  if ! curl -s http://localhost:5000/api/health | grep -q "ok"; then
    error "Backend API is not responding correctly"
    exit 1
  fi
  success "Backend API is responding correctly"
else
  info "Docker is not available - skipping backend API check"
  info "Install Docker Desktop to enable full verification capabilities"
  
  # Basic check for backend directory in fallback mode
  if [ -d "backend" ]; then
    success "Backend directory exists"
  else
    error "Backend directory not found"
  fi
fi

# Verify frontend is accessible
step "Verifying frontend access..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  if ! curl -s http://localhost:3001 | grep -q "MR.CREAMS"; then
    error "Frontend is not accessible"
    exit 1
  fi
  success "Frontend is accessible"
else
  info "Docker is not available - skipping frontend access check"
  
  # Basic check for frontend directory in fallback mode
  if [ -d "frontend" ]; then
    success "Frontend directory exists"
  else
    error "Frontend directory not found"
  fi
fi

# Verify JWT authentication
step "Verifying JWT authentication..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}' | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  if [ -z "$TOKEN" ]; then
    error "JWT authentication failed - could not obtain token"
    exit 1
  fi
  success "JWT authentication working correctly"
else
  info "Docker is not available - skipping JWT authentication check"
  info "Install Docker Desktop to enable full verification capabilities"
fi

# Verify protected endpoint access
step "Verifying protected endpoint access..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/admin/users)
  if ! echo "$RESPONSE" | grep -q "users"; then
    error "Protected endpoint access failed"
    exit 1
  fi
  success "Protected endpoint access working correctly"
else
  info "Docker is not available - skipping protected endpoint access check"
  info "Install Docker Desktop to enable full verification capabilities"
fi

# Check system resources
step "Checking system resources..."
if [ "$DOCKER_AVAILABLE" = true ]; then
  CONTAINER_STATS=$(docker stats --no-stream --format "{{.Name}}: CPU {{.CPUPerc}}, MEM {{.MemPerc}}")
  echo "$CONTAINER_STATS"
  success "Docker system resources check completed"
else
  # Basic system check in fallback mode
  DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}')
  info "Available disk space: $DISK_SPACE"
  success "Basic system resources check completed"
fi

# Final verification summary
echo ""
echo "================================================"
echo "          VERIFICATION SUMMARY                  "
echo "================================================"
echo ""

if [ "$FALLBACK_MODE" = true ]; then
  echo "🔶 FALLBACK MODE ACTIVE - Limited verification performed"
  echo "✅ Directory structure is correct"
  echo "✅ Project structure is correct"
  echo "❓ Docker is not available"
  echo "❓ Container status not checked"
  echo "❓ Database connection not verified"
  echo "❓ Backend API not verified"
  echo "❓ Frontend not verified"
  echo "❓ Authentication not verified"
  echo ""
  echo "================================================"
  echo "          INSTALLATION INSTRUCTIONS             "
  echo "================================================"
  echo ""
  echo "To enable full verification capabilities:"
  echo "1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/"
  echo "2. Start Docker Desktop and wait for it to initialize"
  echo "3. Run this script again"
  echo ""
  echo "System verification completed with limited functionality."
else
  echo "✅ Docker is running"
  echo "✅ Directory structure is correct"
  echo "✅ Containers are running"
  echo "✅ Database connection is successful"
  echo "✅ Database schema is verified"
  echo "✅ Admin user exists"
  echo "✅ Backend API is responding"
  echo "✅ Frontend is accessible"
  echo "✅ JWT authentication is working"
  echo "✅ Protected endpoints are accessible"
  echo ""
  echo "================================================"
  echo "          SYSTEM ACCESS INFORMATION             "
  echo "================================================"
  echo ""
  echo "Frontend URL: http://localhost:3000"
  echo "Backend API: http://localhost:5000/api"
  echo "Admin Login: admin@mrcreams.local / Admin123!"
  echo ""
  echo "To check container status: $DOCKER_COMPOSE_CMD ps"
  echo "To view logs: $DOCKER_COMPOSE_CMD logs"
  echo "To restart: $DOCKER_COMPOSE_CMD restart"
  echo ""
  echo "System verification completed successfully!"
fi

exit 0