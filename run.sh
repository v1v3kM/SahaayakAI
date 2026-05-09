#!/bin/bash
# ============================================================
#  Sahaayak AI — Setup & Run Script
#  India's AI-Powered Citizen Safety Platform
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║          🛡️  Sahaayak AI — Setup Script          ║${NC}"
echo -e "${CYAN}${BOLD}║   India's AI-Powered Citizen Safety Platform     ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# --- Step 1: Check prerequisites ---
echo -e "${BLUE}[1/6]${NC} Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ required. Found: $(node -v)${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} Node.js $(node -v)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} npm $(npm -v)"
echo ""

# --- Step 2: Install dependencies ---
echo -e "${BLUE}[2/6]${NC} Installing dependencies..."
npm install --silent 2>&1 | tail -3
echo -e "  ${GREEN}✓${NC} Dependencies installed"
echo ""

# --- Step 3: Setup environment ---
echo -e "${BLUE}[3/6]${NC} Setting up environment..."
if [ ! -f .env ]; then
    echo 'DATABASE_URL="file:./db/sahaayak.db"' > .env
    echo -e "  ${GREEN}✓${NC} Created .env file"
else
    echo -e "  ${GREEN}✓${NC} .env file exists"
fi
echo ""

# --- Step 4: Setup database ---
echo -e "${BLUE}[4/6]${NC} Setting up database..."
mkdir -p prisma/db
npx prisma generate --no-hints 2>&1 | grep -E "Generated|✔" || true
npx prisma db push --skip-generate --accept-data-loss 2>&1 | grep -E "sync|created|Done" || true
echo -e "  ${GREEN}✓${NC} Database ready (SQLite)"
echo ""

# --- Step 5: Start development server ---
echo -e "${BLUE}[5/6]${NC} Starting development server..."
echo ""

# Kill any existing process on port 3000
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Start the server in the background
npm run dev &
SERVER_PID=$!

# Wait for server to be ready
echo -e "  ${YELLOW}⏳ Waiting for server...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Server running on http://localhost:3000"
        break
    fi
    sleep 1
done
echo ""

# --- Step 6: Seed database ---
echo -e "${BLUE}[6/6]${NC} Seeding database with demo data..."
SEED_RESPONSE=$(curl -s -X POST http://localhost:3000/api/seed 2>/dev/null)
if echo "$SEED_RESPONSE" | grep -q "success\|already exists"; then
    echo -e "  ${GREEN}✓${NC} Database seeded (9 incidents across India)"
else
    echo -e "  ${YELLOW}⚠${NC} Seed response: $SEED_RESPONSE"
fi
echo ""

# --- Done ---
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║            ✅  Sahaayak AI is RUNNING!            ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  🌐  ${BOLD}App:${NC}    http://localhost:3000"
echo -e "  📊  ${BOLD}API:${NC}    http://localhost:3000/api/incidents"
echo -e "  🗄️   ${BOLD}DB:${NC}     prisma/db/sahaayak.db"
echo ""
echo -e "  ${CYAN}Demo Accounts:${NC}"
echo -e "    👤 Rajesh Kumar    — 9876543210  (Credibility: 95)"
echo -e "    👤 Priya Sharma    — 9876543211  (Credibility: 78)"
echo -e "    👤 Amit Patel      — 9876543212  (Credibility: 45, Rate Limited)"
echo -e "    👤 Kavitha Nair    — 9876543214  (Credibility: 88)"
echo -e "    🏛️  Inspector Deshmukh — 9876543213 (NDRF)"
echo -e "    🔧 Admin Control   — 9876543200  (Admin Portal)"
echo ""
echo -e "  ${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Keep the script running so Ctrl+C stops everything
wait $SERVER_PID
