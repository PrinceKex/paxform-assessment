#!/bin/sh
set -e

# Debug: Print current directory and files
echo "=== Current Directory ==="
pwd
ls -la
echo "========================"

# Debug: Print environment variables
echo "=== Environment Variables ==="
printenv | sort
echo "==========================="

# Set database connection details from Railway's environment variables
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST:-mysql}
DB_PORT=${MYSQLPORT:-3306}
DB_DATABASE=${MYSQLDATABASE:-paxform}
DB_USERNAME=${MYSQLUSER:-root}
DB_PASSWORD=${MYSQLPASSWORD:-}

# Debug: Print database connection info (without exposing password)
echo "=== Database Connection ==="
echo "DB_CONNECTION: $DB_CONNECTION"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_DATABASE: $DB_DATABASE"
echo "DB_USERNAME: $DB_USERNAME"
echo "MYSQLHOST: ${MYSQLHOST:-Not set}"
echo "MYSQLPORT: ${MYSQLPORT:-Not set, using default 3306}"
echo "MYSQLUSER: ${MYSQLUSER:-Not set, using default root}"
echo "MYSQLDATABASE: ${MYSQLDATABASE:-Not set, using default paxform}"

# Create or update Laravel .env file with database configuration
cat > .env <<EOL
APP_NAME="PaxForm"
APP_ENV=production
APP_DEBUG=false
APP_URL=

DB_CONNECTION=$DB_CONNECTION
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_DATABASE=$DB_DATABASE
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD

# Other necessary Laravel environment variables
LOG_CHANNEL=stderr
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache and session configuration
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Application key
APP_KEY=base64:$(head -c 32 /dev/urandom | base64)
EOL

# Debug: Verify .env was created
echo "=== .env file created/updated ==="
cat .env | grep -v 'DB_PASSWORD'  # Show .env content but hide password
echo "================================"
echo "=========================="

# Export the variables for Laravel to use
export DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD

# Wait for the database to be ready
echo "Waiting for database at $DB_HOST:$DB_PORT..."

# Use a counter to prevent infinite loops
MAX_RETRIES=30
COUNTER=0

while ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  echo "Database not ready. Waiting..."
  sleep 2
  COUNTER=$((COUNTER+1))
  if [ $COUNTER -ge $MAX_RETRIES ]; then
    echo "Error: Could not connect to database after $MAX_RETRIES attempts"
    echo "DB_HOST: $DB_HOST"
    echo "DB_PORT: $DB_PORT"
    exit 1
  fi
done

echo "Database is ready!"

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Clear and cache config
echo "Caching configuration..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ensure storage is writable
echo "Setting storage permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
