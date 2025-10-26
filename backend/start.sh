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
DB_PASSWORD=${MYSQLPASSWORD}

# Verify we have a password
if [ -z "$DB_PASSWORD" ]; then
    echo "ERROR: Database password (MYSQLPASSWORD) is not set"
    exit 1
fi

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
APP_DEBUG=true
APP_URL=

DB_CONNECTION=$DB_CONNECTION
DB_HOST="$DB_HOST"
DB_PORT=$DB_PORT
DB_DATABASE="$DB_DATABASE"
DB_USERNAME="$DB_USERNAME"
DB_PASSWORD="$DB_PASSWORD"

# Force database URL for Laravel to use the correct credentials
DATABASE_URL=mysql://$DB_USERNAME:$(echo "$DB_PASSWORD" | sed 's/&/\&/g')@$DB_HOST:$DB_PORT/$DB_DATABASE

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
cat .env | grep -v 'PASSWORD'  # Show .env content but hide passwords
echo "================================"

# Verify the database is accessible
echo "Testing database connection..."
if ! mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1" "$DB_DATABASE" 2>/dev/null; then
    echo "ERROR: Failed to connect to the database"
    echo "Connection details:"
    echo "Host: $DB_HOST"
    echo "Port: $DB_PORT"
    echo "Database: $DB_DATABASE"
    echo "Username: $DB_USERNAME"
    echo "Password: ${DB_PASSWORD:+[set]}${DB_PASSWORD:+ but not shown for security}"
    exit 1
fi
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
