# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy health check script
COPY healthcheck.sh /usr/local/bin/healthcheck.sh

# Set environment variables
ENV NGINX_PORT=80
ENV NGINX_HOST=0.0.0.0

# Install wget for health check
RUN apk add --no-cache wget

# Make health check script executable
RUN chmod +x /usr/local/bin/healthcheck.sh

# Create nginx.pid directory and set permissions
RUN mkdir -p /run/nginx && \
    chown -R nginx:nginx /run/nginx && \
    chmod -R 755 /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

# Expose the port the app runs on
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD /usr/local/bin/healthcheck.sh || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
