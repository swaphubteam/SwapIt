# Railway Database Setup - Fix ERROR 1049

## Problem
Railway created a MySQL database, but the `SI2025` database doesn't exist yet, causing:
```
ERROR 1049 (42000): Unknown database 'SI2025'
```

## Solution Options

### Option 1: Let the Code Auto-Create (Recommended for Empty DB)

I've updated `back_end/config/db_production.php` to automatically create the `SI2025` database when it doesn't exist. This will work if:
- Your MySQL user has `CREATE DATABASE` privileges (Railway default user usually does)
- You just need an empty database structure

**Steps:**
1. Commit and push the updated config:
   ```bash
   git add back_end/config/db_production.php
   git commit -m "Auto-create SI2025 database on Railway"
   git push origin main
   ```

2. Railway will auto-deploy the changes

3. The database will be created on first API call

4. You'll still need to import the schema (see Option 2, Step 3)

---

### Option 2: Manual Database Creation & Import (Recommended for Full Setup)

#### Step 1: Install Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

#### Step 2: Link to Your Project

```bash
# Navigate to your project folder
cd "C:\Users\Athanase\OneDrive\Desktop\Group_5_activity_04_Final_Project\activity_04_Final_Project"

# Link to Railway project
railway link
```

Select your project from the list.

#### Step 3: Connect to MySQL

```bash
# Connect to your Railway MySQL database
railway connect MySQL
```

This opens a MySQL shell connected to your Railway database.

#### Step 4: Create Database

In the MySQL shell:
```sql
-- Create the SI2025 database
CREATE DATABASE IF NOT EXISTS SI2025 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Switch to the database
USE SI2025;

-- Verify it's empty
SHOW TABLES;

-- Exit MySQL shell
EXIT;
```

#### Step 5: Import Your Database Schema

**Method A: Using Railway CLI (Recommended)**

```bash
# Import the SQL file
railway connect MySQL < back_end/db/SI2025.sql
```

**Method B: Using MySQL Client Directly**

First, get your Railway MySQL connection details:
```bash
railway variables
```

Look for:
- `MYSQL_HOST` (or `MYSQLTCPHOST`)
- `MYSQL_USER` (or `MYSQLUSER`)
- `MYSQL_PASSWORD` (or `MYSQLPASSWORD`)
- `MYSQL_PORT` (or `MYSQLTCPPORT`)

Then import:
```bash
mysql -h [MYSQL_HOST] -P [MYSQL_PORT] -u [MYSQL_USER] -p[MYSQL_PASSWORD] SI2025 < back_end/db/SI2025.sql
```

**Method C: Using Railway MySQL Shell**

```bash
railway connect MySQL
```

Then in MySQL shell:
```sql
USE SI2025;
SOURCE back_end/db/SI2025.sql;
```

Note: `SOURCE` command may not work if Railway doesn't have access to your local files. Use Method A or B instead.

#### Step 6: Verify Import

```bash
railway connect MySQL
```

In MySQL shell:
```sql
USE SI2025;

-- Show all tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- Count records (if you have sample data)
SELECT COUNT(*) FROM users;

EXIT;
```

#### Step 7: Test Your Backend

Visit your Railway backend URL:
```
https://your-app.up.railway.app/api/test-db.php
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful",
  "database": "SI2025"
}
```

---

### Option 3: Use Railway Dashboard (GUI Method)

#### Step 1: Access MySQL

1. Open your Railway project dashboard
2. Click on your MySQL service
3. Go to the **"Connect"** tab
4. Note the connection details

#### Step 2: Use a MySQL Client

**Using MySQL Workbench:**
1. Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Create new connection with Railway credentials
3. Connect
4. Execute: `CREATE DATABASE SI2025;`
5. File → Run SQL Script → Select `back_end/db/SI2025.sql`
6. Execute

**Using phpMyAdmin:**
Railway doesn't provide phpMyAdmin by default, so use CLI methods instead.

---

## Environment Variables Check

Make sure these are set in Railway (Variables tab):

```env
# Railway auto-sets these when you add MySQL service
MYSQL_HOST=${{MySQL.RAILWAY_PRIVATE_DOMAIN}}
MYSQL_PORT=${{MySQL.RAILWAY_TCP_PORT}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQL_DATABASE=SI2025

# Also set these for compatibility
DB_HOST=${{MySQL.RAILWAY_PRIVATE_DOMAIN}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=SI2025
DB_PORT=${{MySQL.RAILWAY_TCP_PORT}}

# Application settings
ENVIRONMENT=production
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

## Troubleshooting

### Issue: "railway: command not found"

**Solution:**
```bash
# Check if npm is installed
npm --version

# Install Railway CLI globally
npm install -g @railway/cli

# If using nvm, make sure global packages are accessible
npm config get prefix
```

### Issue: "Access denied for user"

**Solution:**
- Verify you're using the correct Railway MySQL credentials
- Check Railway Variables tab for exact values
- The MySQL user should have all privileges on Railway

### Issue: "Lost connection to MySQL server"

**Solution:**
- Railway MySQL might be starting up
- Wait 30 seconds and try again
- Check Railway service status

### Issue: SQL Import Shows Errors

**Solution:**
```bash
# Check SQL file syntax locally first
mysql -u root -p < back_end/db/SI2025.sql

# If it works locally, then import to Railway
railway connect MySQL < back_end/db/SI2025.sql
```

### Issue: "Could not find a linked project"

**Solution:**
```bash
# Unlink and relink
railway unlink
railway link

# Select your project from the list
```

---

## Quick Command Reference

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View environment variables
railway variables

# Connect to MySQL
railway connect MySQL

# Import database
railway connect MySQL < back_end/db/SI2025.sql

# View logs
railway logs

# Redeploy
railway up
```

---

## Success Checklist

- [ ] Railway CLI installed
- [ ] Logged into Railway
- [ ] Project linked
- [ ] Connected to MySQL
- [ ] SI2025 database created
- [ ] SQL schema imported
- [ ] Tables exist (verify with `SHOW TABLES;`)
- [ ] Backend test endpoint returns success
- [ ] No more ERROR 1049

---

## Next Steps After Database Setup

1. **Test Backend API**
   ```
   https://your-app.up.railway.app/api/test-db.php
   ```

2. **Update Frontend Config**
   - Edit `front_end/public/assets/js/config.js`
   - Replace backend URL placeholder

3. **Deploy Frontend to Vercel**
   - Follow `DEPLOYMENT_CHECKLIST.md`

4. **Update Google OAuth**
   - Add production URLs to Google Console

---

## Need Help?

1. Check Railway logs: `railway logs`
2. Verify environment variables: `railway variables`
3. Test database connection manually: `railway connect MySQL`
4. Review `HOSTING_GUIDE.md` for complete deployment guide

**Estimated Time:** 10-15 minutes

Good luck! 🚀
