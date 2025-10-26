#!/bin/sh
set -e

# Set default values if not provided
DB_HOST=${DB_HOST:-${RAILWAY_MYSQLHOST:-mysql}}
DB_PORT=${DB_PORT:-${RAILWAY_MYSQLPORT:-3306}}

# Wait for the database to be ready
echo "Waiting for database at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database not ready. Waiting..."
  sleep 2
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
