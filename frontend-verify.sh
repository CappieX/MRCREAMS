#!/bin/bash
# MR.CREAMS Frontend Verification Script

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
    echo -e "${YELLOW}[INFO]${NC} Running in fallback mode with limited functionality"
fi

echo "=== MR.CREAMS FRONTEND VERIFICATION ==="
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
  # Check if frontend is accessible
  echo -e "${BLUE}[INFO]${NC} Checking if frontend is accessible..."
  FRONTEND_URL="http://localhost:3000"
  if ! curl -s "$FRONTEND_URL" | grep -q "MR.CREAMS"; then
    echo -e "${RED}[ERROR]${NC} Frontend is not accessible at $FRONTEND_URL"
    exit 1
  fi
  echo -e "${GREEN}[SUCCESS]${NC} Frontend is accessible"

  # Check login page
  echo -e "${BLUE}[INFO]${NC} Checking login page..."
  if ! curl -s "$FRONTEND_URL/login" | grep -q "Login"; then
    echo -e "${RED}[ERROR]${NC} Login page is not accessible"
    exit 1
  fi
  echo -e "${GREEN}[SUCCESS]${NC} Login page is accessible"

  # Check registration page
  echo -e "${BLUE}[INFO]${NC} Checking registration page..."
  if ! curl -s "$FRONTEND_URL/register" | grep -q "Register"; then
    echo -e "${RED}[ERROR]${NC} Registration page is not accessible"
    exit 1
  fi
  echo -e "${GREEN}[SUCCESS]${NC} Registration page is accessible"
else
  echo -e "${YELLOW}[INFO]${NC} Docker is not available - skipping frontend verification"
  echo -e "${YELLOW}[INFO]${NC} Install Docker Desktop to enable frontend verification capabilities"
  
  # Check if frontend code exists
  echo -e "${BLUE}[INFO]${NC} Checking for frontend code..."
  if [ -d "frontend/src" ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Frontend code found in frontend/src directory"
  else
    echo -e "${YELLOW}[INFO]${NC} Frontend code directory not found or incomplete"
  fi
  
  # Check if package.json exists
  echo -e "${BLUE}[INFO]${NC} Checking for package.json..."
  if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}[SUCCESS]${NC} package.json found in frontend directory"
  else
    echo -e "${YELLOW}[INFO]${NC} package.json not found in frontend directory"
  fi
fi

echo "=== FRONTEND VERIFICATION COMPLETE ==="