# SwapIt - Quick Deployment Reference

## 🚀 Quick Start

### Backend → Railway
1. Sign up: https://railway.app
2. New Project → Deploy from GitHub
3. Add MySQL Database
4. Set environment variables
5. Deploy!

### Frontend → Vercel
1. Sign up: https://vercel.com
2. Import GitHub repository
3. Output directory: `front_end/public`
4. Deploy!

---

## 📋 URLs to Update

### 1. Frontend Config
File: `front_end/public/assets/js/config.js`
```javascript
const BACKEND_URL = 'https://YOUR-APP.up.railway.app';
```

### 2. Google OAuth Console
- Origins: `https://YOUR-APP.vercel.app`
- Redirect: `https://YOUR-BACKEND.up.railway.app/api/google-callback.php`

---

## 🔑 Environment Variables (Railway)

```env
MYSQL_HOST=${{MySQL.RAILWAY_PRIVATE_DOMAIN}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQL_DATABASE=SI2025
DB_HOST=${{MySQL.RAILWAY_PRIVATE_DOMAIN}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=SI2025
DB_PORT=${{MySQL.RAILWAY_TCP_PORT}}
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
ENVIRONMENT=production
```

---

## ✅ Testing Endpoints

### Backend Health Check
```
https://your-backend.up.railway.app/api/test-db.php
```

Expected:
```json
{"success": true, "message": "Database connection successful"}
```

### Frontend
```
https://your-app.vercel.app
```

---

## 🛠️ Common Commands

### Railway CLI
```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Connect to MySQL
railway connect MySQL

# View logs
railway logs
```

### Git
```bash
# Commit changes
git add .
git commit -m "Update backend URL"
git push origin main
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Update backend CORS headers with Vercel URL |
| DB Connection Failed | Check Railway environment variables |
| 404 on API | Verify backend URL in config.js |
| OAuth Fails | Update redirect URIs in Google Console |

---

## 📞 Important Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Console**: https://console.cloud.google.com
- **GitHub Repo**: https://github.com/swaphubteam/SwapIt

---

## ⏱️ Deployment Time
- **Backend**: ~15 min
- **Frontend**: ~10 min
- **Integration**: ~15 min
- **Total**: ~40 min

---

## 💡 Pro Tips

1. **Test locally first** before deploying
2. **Use environment variables** for all configs
3. **Check logs** when something breaks
4. **Keep Google OAuth updated** with new URLs
5. **Document your URLs** for team reference

---

**Good luck! 🎉**
