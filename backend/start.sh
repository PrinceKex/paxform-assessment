#!/bin/sh
set -e

# Debug: Print current directory and files
pwd
ls -la

# Debug: Print environment variables
echo "=== Environment Variables ==="
printenv | sort
echo "==========================="

# Set database connection details
# First try Railway's default MySQL variables, then fall back to standard ones
DB_HOST=${MYSQLHOST:-${DB_HOST:-mysql}}
DB_PORT=${MYSQLPORT:-${DB_PORT:-3306}}

# Debug: Print database connection info
echo "Using database host: $DB_HOST"
echo "Using database port: $DB_PORT"

# Wait for the database to be ready
echo "Waiting for database at $DB_HOST:$DB_PORT..."

# Use a counter to prevent infinite loops
MAX_RETRIES=30
COUNTER=0

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database not ready. Waiting..."
  sleep 2
  COUNTER=$((COUNTER+1))
  if [ $COUNTER -ge $MAX_RETRIES ]; then
    echo "Error: Could not connect to database after $MAX_RETRIES attempts"
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
