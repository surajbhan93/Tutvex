#!/bin/bash

# TutVex Frontend Deployment Script
echo "🚀 Starting TutVex Frontend Deployment..."

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
echo -e "${YELLOW}📂 Checking directory...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the frontend directory?${NC}"
    exit 1
fi

# Step 2: Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from GitHub...${NC}"
git pull origin main

# Step 3: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --legacy-peer-deps

# Step 4: Build for production
echo -e "${YELLOW}🏗️  Building production bundle...${NC}"
npm run build

# Step 5: Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Step 6: Restart PM2 (if using PM2)
echo -e "${YELLOW}🔄 Restarting application...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 restart tutvex-frontend || pm2 start npm --name "tutvex-frontend" -- start
    echo -e "${GREEN}✅ PM2 restarted${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 not found. Skipping PM2 restart.${NC}"
    echo -e "${YELLOW}💡 Start manually: npm start${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Visit: https://tutvex.com${NC}"
