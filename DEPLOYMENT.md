# Deployment Guide: PaxForm to Railway

This guide provides step-by-step instructions for deploying the PaxForm application to Railway.

## Prerequisites

1. A Railway account (https://railway.app/)
2. GitHub repository with the PaxForm code
3. Docker installed locally (for testing)

## Environment Variables

Create a `.env` file in the project root with the following variables (or set them in Railway's dashboard):

```env
# Application
APP_NAME="PaxForm"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-railway-url.railway.app
APP_KEY=base64:your-app-key-here

# Database (provided by Railway if using their database service)
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

# Frontend
VITE_API_URL=https://your-railway-url.railway.app/api

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache (optional, recommended for production)
CACHE_DRIVER=file
# or for better performance:
# CACHE_DRIVER=redis
# REDIS_HOST=${REDISHOST}
# REDIS_PASSWORD=${REDISPASSWORD}
# REDIS_PORT=${REDISPORT}
```

## Deployment Steps

### 1. Prepare Your Code

1. Push your code to a GitHub repository
2. Ensure all dependencies are properly defined in `package.json` and `composer.json`
3. Verify that `Dockerfile` and `docker-compose.yml` are in the root directory

### 2. Deploy to Railway

#### Option A: Using Railway Dashboard

1. Log in to your Railway dashboard (https://railway.app/dashboard)
2. Click "New Project" and select "Deploy from GitHub repo"
3. Select your GitHub repository
4. Railway will automatically detect the project type and start building
5. Once built, go to the "Variables" tab and add all required environment variables
6. Deploy the application

#### Option B: Using Railway CLI

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
2. Log in to Railway:
   ```bash
   railway login
   ```
3. Link your project:
   ```bash
   railway init
   ```
4. Deploy:
   ```bash
   railway up
   ```
5. Set environment variables:
   ```bash
   railway variables set NODE_ENV=production
   # Add other variables as needed
   ```

### 3. Database Setup

1. In Railway dashboard, add a new MySQL database
2. Link the database to your application
3. Run database migrations:
   ```bash
   railway run php artisan migrate --force
   ```

### 4. Storage Permissions

Ensure the storage directory is writable:

```bash
railway run php artisan storage:link
railway run chmod -R 775 storage bootstrap/cache
```

### 5. Build Frontend Assets

If not handled automatically:

```bash
railway run -- npm install
railway run -- npm run build
```

## Post-Deployment

1. **Verify Application**
   - Visit your Railway URL to ensure the application is running
   - Check the logs in the Railway dashboard for any errors

2. **Set Up SSL** (if not automatic)
   - Railway provides automatic SSL certificates via Let's Encrypt
   - Ensure your custom domain is properly configured if using one

3. **Monitoring**
   - Set up monitoring and alerts in the Railway dashboard
   - Configure log aggregation if needed

## Troubleshooting

- **Build Failures**: Check the build logs in Railway dashboard
- **Database Connection Issues**: Verify database credentials and connection
- **Asset Loading**: Ensure the `VITE_API_URL` matches your backend URL
- **Permission Issues**: Check storage and bootstrap/cache permissions

## Scaling

Railway automatically scales your application based on demand. For production workloads:
- Consider enabling auto-scaling in the Railway dashboard
- Set appropriate resource limits
- Monitor performance metrics

## Backups

- Enable automatic database backups in the Railway dashboard
- Regularly test your backup restoration process

## Security

- Keep your dependencies updated
- Use strong, unique passwords
- Enable 2FA for your Railway account
- Regularly review access controls and permissions
