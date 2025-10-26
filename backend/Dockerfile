FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    netcat-openbsd  # For database connection check

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Install production dependencies
RUN composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader

# Set proper permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Copy start script and make it executable
COPY start.sh /var/www/
RUN chmod +x /var/www/start.sh

# Set working directory and permissions
WORKDIR /var/www
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/start.sh

# Start the application
CMD ["/var/www/start.sh"]

# Expose port 9000
EXPOSE 9000
