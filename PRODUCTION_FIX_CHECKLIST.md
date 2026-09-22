# 🔧 Production API 404 Fix Checklist

## ❌ Current Issues
- `GET /api/v1/leads/admin/student-leads` → 404 Not Found
- `GET /api/v1/leads/public/preview` → 404 Not Found
- Local environment: ✅ Working
- Production environment: ❌ Not working

---

## 🔍 Root Causes (Most Likely)

### 1. **Backend Not Restarted After Latest Push**
Production server is still running old code without the latest routes.

**Fix:**
```bash
ssh root@mail
cd ~/Tutvex/tutoredge-backend
git pull origin main
npm install
npm run build
pm2 restart tutvex-backend
pm2 logs tutvex-backend
```

### 2. **Environment Variables Missing**
Backend `.env` doesn't have `ALLOWED_ORIGINS` set.

**Fix:**
Check `/root/Tutvex/tutoredge-backend/.env` has:
```env
ALLOWED_ORIGINS=https://tutvex.com,https://www.tutvex.com
FRONTEND_URL=https://tutvex.com
```

### 3. **Nginx Not Configured Properly**
Nginx might not be proxying `/api/v1/*` requests to backend.

**Fix:**
Check `/etc/nginx/sites-available/tutvex`:
```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Then:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. **PM2 Process Not Running**
Backend process crashed or not started.

**Fix:**
```bash
pm2 status
pm2 start npm --name "tutvex-backend" -- start
```

---

## ✅ Step-by-Step Fix (Run on Production Server)

### Step 1: SSH into Server
```bash
ssh root@mail
```

### Step 2: Pull Latest Code
```bash
cd ~/Tutvex
git pull origin main
```

### Step 3: Update Backend
```bash
cd ~/Tutvex/tutoredge-backend

# Check if .env has production values
cat .env | grep ALLOWED_ORIGINS
# Should show: ALLOWED_ORIGINS=https://tutvex.com,https://www.tutvex.com

# If not, add it:
echo "ALLOWED_ORIGINS=https://tutvex.com,https://www.tutvex.com" >> .env
echo "FRONTEND_URL=https://tutvex.com" >> .env

# Install and build
npm install
npm run build

# Restart backend
pm2 restart tutvex-backend

# Check logs
pm2 logs tutvex-backend --lines 50
```

### Step 4: Update Frontend
```bash
cd ~/Tutvex/tutoredge-frontend

# Check if .env has production API URL
cat .env.local | grep NEXT_PUBLIC_API_URL
# Should show: NEXT_PUBLIC_API_URL=https://tutvex.com/api/v1

# If not, update it:
echo "NEXT_PUBLIC_API_URL=https://tutvex.com/api/v1" >> .env.local

# Install and build
npm install --legacy-peer-deps
npm run build

# Restart frontend
pm2 restart tutvex-frontend
```

### Step 5: Verify Nginx
```bash
# Check Nginx config
sudo cat /etc/nginx/sites-available/tutvex | grep -A 10 "location /api"

# Test Nginx config
sudo nginx -t

# Reload if needed
sudo systemctl reload nginx
```

### Step 6: Check PM2 Status
```bash
pm2 status
pm2 logs tutvex-backend --lines 20
```

---

## 🧪 Verification Steps

### 1. Test Health Check
```bash
curl https://tutvex.com/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-22T...",
  "uptime": 123.45,
  "environment": "production",
  "version": "1.0.0",
  "cors": {
    "allowedOrigins": ["https://tutvex.com", "https://www.tutvex.com"]
  }
}
```

### 2. Test Lead Routes (with auth token)
```bash
# Get your JWT token from browser DevTools (Application → Local Storage → token)
TOKEN="your_jwt_token_here"

curl -H "Authorization: Bearer $TOKEN" https://tutvex.com/api/v1/leads/admin/student-leads
```

### 3. Test Public Routes
```bash
curl https://tutvex.com/api/v1/leads/public/preview
```

### 4. Check Browser Console
Open `https://tutvex.com/admin/leads` and check console:
- Should see: `Fetching leads with auth token...`
- Should NOT see: `404 Not Found`
- Should NOT see: `CORS error`

---

## 🔍 Debugging Commands

### Check if Backend is Running
```bash
sudo netstat -tulpn | grep :3001
# Should show: tcp  0  0.0.0.0:3001  LISTEN  12345/node
```

### Check Backend Logs
```bash
pm2 logs tutvex-backend --lines 100
# Look for:
# ✅ "Server running on http://localhost:3001"
# ✅ "All routes registered successfully"
# ❌ Any error messages
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Test API Directly (Bypass Nginx)
```bash
# From the server itself
curl http://localhost:3001/api/v1/health

# If this works but external doesn't, problem is Nginx
```

### Check CORS Headers
```bash
curl -H "Origin: https://tutvex.com" -I https://tutvex.com/api/v1/health
# Look for: Access-Control-Allow-Origin header
```

---

## 🚨 Common Mistakes

1. ❌ **Forgot to restart PM2** after code changes
   ```bash
   pm2 restart tutvex-backend
   ```

2. ❌ **Frontend still pointing to localhost**
   Check `.env.local` has: `NEXT_PUBLIC_API_URL=https://tutvex.com/api/v1`

3. ❌ **Old build files cached**
   ```bash
   cd ~/Tutvex/tutoredge-backend
   rm -rf dist/
   npm run build
   ```

4. ❌ **Nginx not reloaded**
   ```bash
   sudo systemctl reload nginx
   ```

5. ❌ **JWT token expired**
   Logout and login again to get fresh token

---

## 📋 Quick Command Summary

```bash
# On production server (root@mail)
cd ~/Tutvex
git pull origin main

# Backend
cd tutoredge-backend
npm install && npm run build
pm2 restart tutvex-backend

# Frontend
cd ../tutoredge-frontend
npm install --legacy-peer-deps && npm run build
pm2 restart tutvex-frontend

# Check
pm2 status
pm2 logs tutvex-backend --lines 20
curl https://tutvex.com/api/v1/health
```

---

## ✅ Success Indicators

When fixed, you should see:

1. ✅ `pm2 status` shows both processes running
2. ✅ `curl https://tutvex.com/api/v1/health` returns JSON
3. ✅ Browser console shows no 404 errors
4. ✅ Admin panel loads leads successfully
5. ✅ No CORS errors in browser console

---

## 📞 Still Not Working?

If routes still showing 404 after all fixes:

1. Check PM2 logs for errors:
   ```bash
   pm2 logs tutvex-backend --err --lines 50
   ```

2. Check if port 3001 is listening:
   ```bash
   sudo netstat -tulpn | grep :3001
   ```

3. Test backend directly:
   ```bash
   curl http://localhost:3001/api/v1/health
   ```

4. Restart everything:
   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ```

5. Check firewall:
   ```bash
   sudo ufw status
   # Port 3001 should be allowed from localhost
   ```
