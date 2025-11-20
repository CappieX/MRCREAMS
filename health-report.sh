#!/bin/bash
# MR.CREAMS System Health Report

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

echo "=== MR.CREAMS SYSTEM HEALTH REPORT ==="
echo "Generated: $(date)"
echo

if [ "$DOCKER_AVAILABLE" = true ]; then
  # Check container status
  echo -e "${BLUE}[CONTAINERS]${NC}"
  $DOCKER_COMPOSE_CMD ps

  # Check container resource usage
  echo -e "\n${BLUE}[RESOURCE USAGE]${NC}"
  docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

  # Check disk space
  echo -e "\n${BLUE}[DISK SPACE]${NC}"
  df -h | grep -E "Filesystem|/dev/disk"

  # Check logs for errors
  echo -e "\n${BLUE}[RECENT ERRORS]${NC}"
  $DOCKER_COMPOSE_CMD logs --tail=20 | grep -i "error\|exception\|fail" || echo "No recent errors found"
else
  echo -e "${YELLOW}[INFO]${NC} Docker is not available - skipping container health checks"
  echo -e "${YELLOW}[INFO]${NC} Install Docker Desktop to enable full health monitoring capabilities"
  
  # Check system resources
  echo -e "\n${BLUE}[SYSTEM RESOURCES]${NC}"
  
  # Check CPU usage
  if command -v top &> /dev/null; then
    echo "CPU Usage:"
    top -b -n 1 | head -n 10
  fi
  
  # Check memory usage
  if command -v free &> /dev/null; then
    echo "Memory Usage:"
    free -h
  fi
  
  # Check disk space
  echo -e "\n${BLUE}[DISK SPACE]${NC}"
  df -h
  
  # Check project directory size
  echo -e "\n${BLUE}[PROJECT SIZE]${NC}"
  du -sh .
fi

echo -e "\n=== HEALTH REPORT COMPLETE ==="