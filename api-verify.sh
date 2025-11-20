#!/bin/bash
# MR.CREAMS API Verification Script

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

echo "=== MR.CREAMS API VERIFICATION ==="

if [ "$DOCKER_AVAILABLE" = true ]; then
  # Check if backend is running
  echo -e "${BLUE}[INFO]${NC} Checking if backend API is running..."
  if ! curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${RED}[ERROR]${NC} Backend API is not responding"
    exit 1
  fi
  echo -e "${GREEN}[SUCCESS]${NC} Backend API is running"

  # Login and get token
  echo -e "${BLUE}[INFO]${NC} Testing authentication..."
  TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@mrcreams.local","password":"password"}' | grep -o '"token":"[^"]*' | sed 's/"token":"//')

  if [ -z "$TOKEN" ]; then
    echo -e "${RED}[ERROR]${NC} Authentication failed"
    exit 1
  fi
  echo -e "${GREEN}[SUCCESS]${NC} Authentication successful"

  # Test key endpoints
  echo -e "${BLUE}[INFO]${NC} Testing key endpoints..."

  # Test profile endpoint
  echo -n "Profile endpoint: "
  PROFILE=$(curl -s -X GET http://localhost:3001/api/users/profile \
    -H "Authorization: Bearer $TOKEN")
  if echo "$PROFILE" | grep -q "admin@mrcreams.local"; then
    echo -e "${GREEN}OK${NC}"
    echo "$PROFILE" | grep -E "email|role"
  else
    echo -e "${RED}FAIL${NC}"
  fi

  # Test challenges endpoint
  echo -n "Challenges endpoint: "
  CHALLENGES=$(curl -s -X GET http://localhost:3001/api/challenges \
    -H "Authorization: Bearer $TOKEN")
  if echo "$CHALLENGES" | grep -q "id"; then
    echo -e "${GREEN}OK${NC}"
  else
    echo -e "${RED}FAIL${NC}"
  fi

  # Test emotions endpoint
  echo -n "Emotions endpoint: "
  EMOTIONS=$(curl -s -X GET http://localhost:3001/api/emotions \
    -H "Authorization: Bearer $TOKEN")
  if echo "$EMOTIONS" | grep -q "id"; then
    echo -e "${GREEN}OK${NC}"
  else
    echo -e "${RED}FAIL${NC}"
  fi
else
  echo -e "${YELLOW}[INFO]${NC} Docker is not available - skipping API verification"
  echo -e "${YELLOW}[INFO]${NC} Install Docker Desktop to enable API verification capabilities"
  
  # Check if API configuration exists
  echo -e "${BLUE}[INFO]${NC} Checking for API configuration..."
  if [ -f "backend/.env" ]; then
    echo -e "${GREEN}[SUCCESS]${NC} API configuration found in backend/.env file"
  elif [ -f ".env" ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Configuration found in .env file"
  else
    echo -e "${YELLOW}[INFO]${NC} No API configuration found. This is expected in a fresh installation."
  fi
  
  # Check if backend code exists
  echo -e "${BLUE}[INFO]${NC} Checking for backend code..."
  if [ -d "backend/src" ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Backend code found in backend/src directory"
  else
    echo -e "${YELLOW}[INFO]${NC} Backend code directory not found or incomplete"
  fi
fi

echo "=== API VERIFICATION COMPLETE ==="