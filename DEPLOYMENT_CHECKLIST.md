# SwapIt Deployment Checklist

Use this checklist to ensure successful deployment of your SwapIt application.

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to GitHub
- [ ] No sensitive data (passwords, API keys) in code
- [ ] Database schema up to date (`SI2025.sql`)
- [ ] All dependencies documented

### 2. Backend Setup
- [ ] Railway/Render account created
- [ ] MySQL database configured
- [ ] Environment variables set
- [ ] Database imported successfully
- [ ] Test endpoints working

### 3. Frontend Setup
- [ ] Vercel account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Custom domain added (optional)

### 4. Integration
- [ ] Backend URL updated in `config.js`
- [ ] CORS headers configured
- [ ] Google OAuth updated
- [ ] API calls tested

---

## Deployment Steps

### Phase 1: Backend (Railway) ⏱️ ~15 minutes

#### 1.1 Create Railway Project
```bash
# Login to Railway
Visit: https://railway.app
Sign in with GitHub
```

- [ ] New Project created
- [ ] Repository connected
- [ ] Service deployed

#### 1.2 Add MySQL Database
- [ ] Click "New" → "Database" → "MySQL"
- [ ] Wait for database provisioning
- [ ] Note connection details

#### 1.3 Set Environment Variables
Add these in Railway Variables tab:
```
MYSQL_HOST=${{MySQL.RAILWAY_PRIVATE_DOMAIN}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQL_DATABASE=SI2025
DB_HOST=${{MySQL.RAILWAY_PRIVATE_DOMAIN}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=SI2025
DB_PORT=${{MySQL.RAILWAY_TCP_PORT}}
GOOGLE_CLIENT_ID=<your_client_id>
GOOGLE_CLIENT_SECRET=<your_client_secret>
ENVIRONMENT=production
```

- [ ] All variables added
- [ ] Values are correct
- [ ] Service redeployed

#### 1.4 Import Database
```bash
# Option 1: Using Railway MySQL Client
railway connect MySQL
SOURCE /path/to/SI2025.sql;

# Option 2: Using external tool
# Use the connection details provided by Railway
```

- [ ] Database imported
- [ ] Tables created
- [ ] Sample data loaded (if any)

#### 1.5 Test Backend
Visit: `https://your-app.up.railway.app/api/test-db.php`

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

- [ ] Test endpoint responds
- [ ] Database connection works
- [ ] API returns valid JSON

#### 1.6 Note Backend URL
```
Backend URL: https://________________.up.railway.app
```

---

### Phase 2: Frontend (Vercel) ⏱️ ~10 minutes

#### 2.1 Update Config File
Edit: `front_end/public/assets/js/config.js`

Replace:
```javascript
const BACKEND_URL = 'https://your-backend-url.up.railway.app';
```

With your actual Railway URL:
```javascript
const BACKEND_URL = 'https://swapit-production.up.railway.app';
```

- [ ] Config updated
- [ ] Changes committed
- [ ] Changes pushed to GitHub

#### 2.2 Deploy to Vercel
```bash
# Login to Vercel
Visit: https://vercel.com
Sign in with GitHub
```

- [ ] New Project created
- [ ] Repository imported
- [ ] Build settings configured:
  - Root Directory: `./`
  - Output Directory: `front_end/public`
  - Build Command: (leave empty)
  
#### 2.3 Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] Check for errors

#### 2.4 Test Frontend
Visit: `https://your-app.vercel.app`

- [ ] Site loads correctly
- [ ] No console errors
- [ ] Assets load properly

#### 2.5 Note Frontend URL
```
Frontend URL: https://________________.vercel.app
```

---

### Phase 3: Integration ⏱️ ~15 minutes

#### 3.1 Update Backend CORS
Check all API files have correct CORS headers:

```php
header('Access-Control-Allow-Origin: https://your-app.vercel.app');
header('Access-Control-Allow-Credentials: true');
```

- [ ] CORS headers updated
- [ ] Vercel domain whitelisted
- [ ] Changes deployed

#### 3.2 Update Google OAuth

**Google Cloud Console**:
1. Go to: https://console.cloud.google.com
2. Select your project
3. Navigate to: APIs & Services → Credentials

**Update Authorized JavaScript Origins**:
```
https://your-app.vercel.app
https://your-backend.up.railway.app
```

**Update Authorized Redirect URIs**:
```
https://your-backend.up.railway.app/api/google-callback.php
https://your-app.vercel.app/api/google-callback.php
```

- [ ] Origins updated
- [ ] Redirect URIs updated
- [ ] Changes saved

#### 3.3 Test Complete Flow

**Test Authentication**:
- [ ] Visit frontend
- [ ] Click "Sign Up"
- [ ] Fill registration form
- [ ] Check for success
- [ ] Try logging in
- [ ] Test Google OAuth login

**Test Core Features**:
- [ ] Browse listings
- [ ] Create new listing
- [ ] Update profile
- [ ] Add to cart/wishlist
- [ ] Search functionality

**Check Browser Console**:
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] API calls successful

---

## Post-Deployment

### Monitoring
- [ ] Set up error tracking
- [ ] Check Railway logs
- [ ] Check Vercel logs
- [ ] Monitor database usage

### Documentation
- [ ] Update README with live URLs
- [ ] Document deployment process
- [ ] Share credentials with team

### Testing
- [ ] Perform full UAT
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Load testing (optional)

---

## Troubleshooting

### Backend Issues

**Database Connection Fails**
```bash
# Check Railway logs
railway logs

# Verify environment variables
railway variables
```

**API Returns 500 Error**
- Check Railway logs for PHP errors
- Verify database credentials
- Test database connection manually

### Frontend Issues

**API Calls Fail**
- Check browser console for CORS errors
- Verify backend URL in config.js
- Test backend endpoint directly

**404 Errors**
- Check Vercel build logs
- Verify output directory setting
- Check file paths are correct

### OAuth Issues

**Google Login Fails**
- Verify redirect URIs in Google Console
- Check client ID and secret
- Ensure HTTPS is used

---

## Rollback Plan

If deployment fails:

1. **Frontend**: Revert to previous commit on Vercel
2. **Backend**: Railway keeps previous deployments
3. **Database**: Use Railway's backup feature

---

## Success Criteria

✅ Backend API responds correctly
✅ Frontend loads without errors
✅ Users can sign up/login
✅ All features work correctly
✅ No CORS errors
✅ Google OAuth works
✅ Database operations succeed

---

## Time Estimate

- **Backend Setup**: 15-20 minutes
- **Frontend Setup**: 10-15 minutes
- **Integration**: 15-20 minutes
- **Testing**: 20-30 minutes

**Total**: ~1-1.5 hours

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Google OAuth**: https://developers.google.com/identity
- **GitHub Issues**: (Create issue for problems)

---

## Contact

For deployment support:
- Email: support@swapit.com
- Team: @swaphubteam

---

**Last Updated**: December 2025
**Version**: 1.0
