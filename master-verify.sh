#!/bin/bash
# MR.CREAMS Master Verification Script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set default values
DOCKER_AVAILABLE=false
FALLBACK_MODE=true

# Check for Docker and Docker Compose
if command -v docker &> /dev/null; then
  echo -e "${YELLOW}[INFO]${NC} Docker is installed"
  
  if command -v docker-compose &> /dev/null || (docker compose version &> /dev/null); then
    DOCKER_AVAILABLE=true
    FALLBACK_MODE=false
    echo -e "${YELLOW}[INFO]${NC} Docker and Docker Compose are available"
  else
    echo -e "${YELLOW}[INFO]${NC} Docker is installed but Docker Compose is not available"
    echo -e "${YELLOW}[INFO]${NC} To install Docker Compose, visit: https://docs.docker.com/compose/install/"
    echo -e "${YELLOW}[INFO]${NC} Running in fallback mode with limited functionality"
  fi
else
  echo -e "${YELLOW}[INFO]${NC} Docker is not installed"
  echo -e "${YELLOW}[INFO]${NC} To install Docker Desktop, visit: https://www.docker.com/products/docker-desktop/"
  echo -e "${YELLOW}[INFO]${NC} Running in fallback mode with limited functionality"
fi

echo "================================================"
echo "   MR.CREAMS MASTER VERIFICATION SCRIPT   "
echo "================================================"

# Run all verification scripts
echo -e "${YELLOW}[RUNNING]${NC} System verification..."
./verify-system.sh || { echo -e "${RED}System verification failed${NC}"; exit 1; }

echo -e "${YELLOW}[RUNNING]${NC} Database verification..."
if ! ./db-verify.sh; then
  if [ "$FALLBACK_MODE" = true ]; then
    echo -e "${YELLOW}[INFO]${NC} Database verification skipped in fallback mode"
  else
    echo -e "${RED}Database verification failed${NC}"
    exit 1
  fi
fi

echo -e "${YELLOW}[RUNNING]${NC} API verification..."
if ! ./api-verify.sh; then
  if [ "$FALLBACK_MODE" = true ]; then
    echo -e "${YELLOW}[INFO]${NC} API verification skipped in fallback mode"
  else
    echo -e "${RED}API verification failed${NC}"
    exit 1
  fi
fi

echo -e "${YELLOW}[RUNNING]${NC} Frontend verification..."
if ! ./frontend-verify.sh; then
  if [ "$FALLBACK_MODE" = true ]; then
    echo -e "${YELLOW}[INFO]${NC} Frontend verification skipped in fallback mode"
  else
    echo -e "${RED}Frontend verification failed${NC}"
    exit 1
  fi
fi

echo -e "${YELLOW}[RUNNING]${NC} Health report..."
./health-report.sh || { echo -e "${RED}Health report failed${NC}"; exit 1; }

# Final success message
if [ "$FALLBACK_MODE" = true ]; then
  echo -e "\n${YELLOW}VERIFICATION COMPLETED IN FALLBACK MODE${NC}"
  echo "Some checks were skipped due to Docker unavailability"
  echo "To run full verification, please install Docker and Docker Compose"
else
  echo -e "\n${GREEN}ALL VERIFICATION CHECKS PASSED!${NC}"
  echo "MR.CREAMS is ready for use at http://localhost:3000"
  echo "Admin login: admin@mrcreams.local / Admin123!"
fi

exit 0