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

# Set database connection details
# First try Railway's default MySQL variables, then fall back to standard ones
DB_HOST=${MYSQLHOST:-${DB_HOST:-mysql}}

# Handle MYSQLPORT - if it's not set or contains ${MYSQLPORT}, use default 3306
if [ -z "$MYSQLPORT" ] || [ "$MYSQLPORT" = "\${MYSQLPORT}" ]; then
    DB_PORT=3306
    echo "Warning: MYSQLPORT not set or contains template literal, using default port 3306"
else
    DB_PORT=$MYSQLPORT
fi

# Debug: Print database connection info
echo "=== Database Connection ==="
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "MYSQLHOST: ${MYSQLHOST:-Not set}"
echo "MYSQLPORT: ${MYSQLPORT:-Not set or invalid}"
echo "=========================="

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
