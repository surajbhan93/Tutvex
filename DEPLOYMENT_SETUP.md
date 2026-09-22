# 🚀 TutVex Deployment Setup Guide

## 📋 Pre-requisites
- Node.js 18+ installed on server
- MongoDB Atlas or local MongoDB
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

---

## 🔧 Backend Deployment

### 1. Server Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Navigate to project directory
cd ~/Tutvex/tutoredge-backend

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### 2. Environment Variables (.env)
Make sure `.env` file has production values:
```env
MONGO_URI=mongodb+srv://Tutvex123:Tutvex123@tutvex-cluster.xhgwaiv.mongodb.net/tutvex
PORT=3001
JWT_SECRET=tutvex_secure_jwt_secret_key_2024_production
FRONTEND_URL=https://tutvex.com
ALLOWED_ORIGINS=https://tutvex.com,https://www.tutvex.com,http://localhost:3000

# Razorpay Live
RAZORPAY_KEY=rzp_live_TeAgaGLkXoAxv9
RAZORPAY_SECRET=d0PiEuS2MqnbQjlHh3iZ51SI

# Email
EMAIL_USER=tutvex@gmail.com
EMAIL_PASS=iplemqecjwhoiqsj

# Cloudinary
CLOUDINARY_CLOUD_NAME=dmljfhxig
CLOUDINARY_API_KEY=261436276772397
CLOUDINARY_API_SECRET=LEItcz-j6tU9GEon7_3LlmuYD68

# Firebase (for push notifications)
FIREBASE_PROJECT_ID=tutvex-15db4
# Add Firebase Admin credentials:
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tutvex-15db4.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. PM2 Setup
```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start npm --name "tutvex-backend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

### 4. PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs tutvex-backend

# Restart
pm2 restart tutvex-backend

# Stop
pm2 stop tutvex-backend

# Monitor
pm2 monit
```

---

## 🌐 Frontend Deployment

### 1. Build Setup
```bash
cd ~/Tutvex/tutoredge-frontend

# Pull latest changes
git pull origin main

# Install dependencies
npm install --legacy-peer-deps

# Build for production
npm run build
```

### 2. Environment Variables (.env.production)
```env
NEXT_PUBLIC_API_URL=https://tutvex.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_TeAgaGLkXoAxv9
NEXT_PUBLIC_GA_ID=G-HJCCQ8JW83
NEXT_PUBLIC_INVESTOR_MODE=true

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA3-H_6fedsF_XPusOTDgUzPjulTpmSznI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tutvex-15db4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tutvex-15db4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tutvex-15db4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1099194329466
NEXT_PUBLIC_FIREBASE_APP_ID=1:1099194329466:web:08f77c4f300f16a9a70ec3
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BEGBC3nQk8V8ttb0qAr0v72beSDvhfgbltK_AvgyX_8Yq3tZWeAPJmPcbw8vZR-lIh8CJDLpbFy5GvkoAB57uSU
```

### 3. PM2 Setup for Frontend
```bash
# Start frontend with PM2
pm2 start npm --name "tutvex-frontend" -- start

# Save PM2 configuration
pm2 save
```

---

## 🔒 Nginx Configuration

### Backend Reverse Proxy (`/etc/nginx/sites-available/tutvex-api`)
```nginx
server {
    listen 80;
    server_name tutvex.com www.tutvex.com;

    # API routes
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://tutvex.com' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Static uploads
    location /uploads/ {
        proxy_pass http://localhost:3001/uploads/;
        proxy_set_header Host $host;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable site and reload Nginx
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/tutvex-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔐 SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d tutvex.com -d www.tutvex.com

# Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

---

## 🚀 Quick Deployment Script

Create `deploy-all.sh` in project root:

```bash
#!/bin/bash
set -e

echo "🚀 Starting Full Deployment..."

# Backend
echo "📦 Deploying Backend..."
cd ~/Tutvex/tutoredge-backend
git pull origin main
npm install
npm run build
pm2 restart tutvex-backend

# Frontend
echo "🌐 Deploying Frontend..."
cd ~/Tutvex/tutoredge-frontend
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart tutvex-frontend

echo "✅ Deployment Complete!"
pm2 status
```

Make it executable:
```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

---

## 🔍 Troubleshooting

### Check if services are running
```bash
pm2 status
sudo systemctl status nginx
```

### Check logs
```bash
# Backend logs
pm2 logs tutvex-backend

# Frontend logs
pm2 logs tutvex-frontend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Check ports
```bash
# Check if ports are listening
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :80
```

### Restart everything
```bash
pm2 restart all
sudo systemctl restart nginx
```

---

## ✅ Verification

After deployment, verify:

1. **Frontend**: https://tutvex.com
2. **Backend API**: https://tutvex.com/api/v1/health (if health check exists)
3. **Swagger Docs**: https://tutvex.com/api/v1/docs

---

## 🔥 Important Notes

1. ✅ **CORS is now configured** to accept both localhost and production
2. ✅ **Environment variables** are set for production
3. ✅ **SSL certificate** must be installed for HTTPS
4. ✅ **Firebase push notifications** require admin credentials in .env
5. ✅ **PM2** will auto-restart services if they crash
6. ✅ **Nginx** handles reverse proxy and SSL termination

---

## 📞 Support

For issues:
- Check PM2 logs: `pm2 logs`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Restart services: `pm2 restart all && sudo systemctl restart nginx`
