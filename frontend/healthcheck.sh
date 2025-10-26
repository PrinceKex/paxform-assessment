#!/bin/sh
# Simple health check script that returns HTTP 200 when Nginx is ready
if [ -f /var/run/nginx.pid ]; then
    exit 0
fi
exit 1
