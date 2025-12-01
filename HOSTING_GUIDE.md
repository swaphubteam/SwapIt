# SwapIt Hosting Guide

Complete guide to deploy your SwapIt application with separated frontend and backend.

## Architecture Overview

- **Frontend**: Vercel (Static HTML/CSS/JS)
- **Backend**: Railway/Render/InfinityFree (PHP API)
- **Database**: MySQL (hosted with backend)

---

## Part 1: Backend Deployment (Railway - Recommended)

### Option A: Railway (Free tier available, supports PHP & MySQL)

#### Step 1: Prepare Backend for Deployment

1. **Create a separate backend repository** (or use the same repo):
   ```bash
   # If using same repo, Railway will deploy from the back_end folder
   ```

2. **Create a `Procfile`** in the root directory:
   ```bash
   web: php -S 0.0.0.0:$PORT -t back_end/api
   ```

3. **Create a `.htaccess`** file in `back_end/api/`:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.php?path=$1 [QSA,L]

   # CORS headers
   Header set Access-Control-Allow-Origin "*"
   Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
   Header set Access-Control-Allow-Headers "Content-Type, Authorization"
   ```

#### Step 2: Deploy to Railway

1. **Sign up at Railway**: https://railway.app
   - Use your GitHub account

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your SwapIt repository

3. **Add MySQL Database**:
   - In your project, click "New"
   - Select "Database" → "MySQL"
   - Railway will create a MySQL instance

4. **Configure Environment Variables**:
   - Go to your service → "Variables" tab
   - Add these variables:
   ```
   MYSQL_HOST=${{MYSQL.RAILWAY_PRIVATE_DOMAIN}}
   MYSQL_PORT=${{MYSQL.RAILWAY_TCP_PORT}}
   MYSQL_USER=${{MYSQL.MYSQLUSER}}
   MYSQL_PASSWORD=${{MYSQL.MYSQLPASSWORD}}
   MYSQL_DATABASE=${{MYSQL.MYSQLDATABASE}}
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. **Update Database Configuration**:
   Create `back_end/config/db_railway.php`:
   ```php
   <?php
   $host = getenv('MYSQL_HOST') ?: 'localhost';
   $username = getenv('MYSQL_USER') ?: 'root';
   $password = getenv('MYSQL_PASSWORD') ?: '';
   $database = getenv('MYSQL_DATABASE') ?: 'SI2025';
   $port = getenv('MYSQL_PORT') ?: 3306;

   $conn = new mysqli($host, $username, $password, $database, $port);

   if ($conn->connect_error) {
       header('Content-Type: application/json');
       echo json_encode([
           'success' => false,
           'error' => 'Database connection failed'
       ]);
       exit;
   }

   $conn->set_charset("utf8mb4");
   ?>
   ```

6. **Import Database**:
   - Use Railway's MySQL client or phpMyAdmin
   - Import `back_end/db/SI2025.sql`

7. **Get your backend URL**:
   - Railway will provide a URL like: `https://your-app-name.up.railway.app`
   - Note this URL for frontend configuration

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

Update `front_end/public/assets/js/config.js`:

```javascript
const SwapItConfig = {
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    get apiBaseUrl() {
        if (this.isProduction) {
            // Replace with your Railway backend URL
            return 'https://your-app-name.up.railway.app/api';
        }
        return 'http://localhost/activity_04_Final_Project/back_end/api';
    },
    
    get googleRedirectUri() {
        if (this.isProduction) {
            return `https://your-vercel-app.vercel.app/api/google-callback.php`;
        }
        return 'http://localhost:3000/api/google-callback.php';
    },
    
    get environment() {
        return this.isProduction ? 'production' : 'development';
    }
};
```

### Step 2: Deploy to Vercel

1. **Sign up at Vercel**: https://vercel.com
   - Use your GitHub account

2. **Import Your Repository**:
   - Click "New Project"
   - Import your GitHub repository
   - Select your SwapIt repo

3. **Configure Project Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: `front_end/public`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a URL like: `https://swapit.vercel.app`

5. **Configure Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain if you have one

---

## Part 3: Connect Frontend & Backend

### Step 1: Update CORS Settings

In your backend API files, ensure CORS headers allow your Vercel domain:

```php
<?php
header('Access-Control-Allow-Origin: https://your-vercel-app.vercel.app');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

### Step 2: Update Google OAuth

1. **Update Authorized Redirect URIs** in Google Cloud Console:
   ```
   https://your-vercel-app.vercel.app/api/google-callback.php
   https://your-railway-app.up.railway.app/api/google-callback.php
   ```

2. **Update Authorized JavaScript Origins**:
   ```
   https://your-vercel-app.vercel.app
   https://your-railway-app.up.railway.app
   ```

---

## Part 4: Alternative Backend Hosting Options

### Option B: Render.com (Free tier available)

1. Sign up at https://render.com
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `composer install` (if using composer)
   - **Start Command**: `php -S 0.0.0.0:$PORT -t back_end/api`
   - Add MySQL database from Render dashboard

### Option C: InfinityFree (Traditional PHP Hosting)

1. Sign up at https://infinityfree.net
2. Create a new account
3. Upload files via FTP:
   - Upload `back_end/` contents to `htdocs/`
4. Create MySQL database from cPanel
5. Import `SI2025.sql` using phpMyAdmin
6. Update `db.php` with provided credentials

---

## Testing Your Deployment

### 1. Test Backend API

Open in browser:
```
https://your-railway-app.up.railway.app/api/test-db.php
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

### 2. Test Frontend

Visit your Vercel URL:
```
https://your-vercel-app.vercel.app
```

### 3. Test Integration

1. Try to sign up/login
2. Check browser console for any CORS errors
3. Verify API calls are reaching your backend

---

## Environment Variables Summary

### Backend (Railway/Render)
```
MYSQL_HOST=<provided by platform>
MYSQL_USER=<provided by platform>
MYSQL_PASSWORD=<provided by platform>
MYSQL_DATABASE=SI2025
GOOGLE_CLIENT_ID=<your client id>
GOOGLE_CLIENT_SECRET=<your client secret>
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
```

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Ensure your backend includes CORS headers for your Vercel domain

### Issue 2: Database Connection Failed
**Solution**: Verify environment variables in Railway/Render dashboard

### Issue 3: API Routes Not Found
**Solution**: Check that your backend is serving from the correct directory

### Issue 4: Google OAuth Fails
**Solution**: Update redirect URIs in Google Cloud Console with production URLs

---

## Monitoring & Logs

### Railway
- View logs: Project → Service → Logs tab
- Monitor usage: Project → Usage tab

### Vercel
- View logs: Project → Deployments → Click deployment → Logs
- Analytics: Project → Analytics tab

---

## Cost Breakdown

### Free Tier Limits

**Railway**:
- $5 free credit/month
- Enough for small projects
- MySQL included

**Vercel**:
- 100GB bandwidth/month
- Unlimited static deployments
- Perfect for frontend

**Total Monthly Cost**: $0 (within free tiers)

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Import database
3. ✅ Update frontend config with backend URL
4. ✅ Deploy frontend to Vercel
5. ✅ Update Google OAuth settings
6. ✅ Test complete application

---

## Support

For issues:
1. Check Railway/Vercel logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for errors

Good luck with your deployment! 🚀
