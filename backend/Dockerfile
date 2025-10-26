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
    libicu-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libxpm-dev \
    netcat-openbsd  # For database connection check

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-xpm \
    && docker-php-ext-install -j$(nproc) pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer.json first
COPY composer.json ./

# Copy composer.lock if it exists, otherwise create an empty one
RUN if [ -f composer.lock ]; then cp composer.lock .; else touch composer.lock; fi

# Install production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

# Copy the rest of the application
COPY . .

# Set file permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Copy and set up start script
COPY backend/start.sh /var/www/start.sh
RUN chmod +x /var/www/start.sh

# Set working directory
WORKDIR /var/www

# Expose port 9000
EXPOSE 9000

# Start the application
CMD ["/var/www/start.sh"]
