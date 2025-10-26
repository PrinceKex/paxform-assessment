#!/bin/sh
# Enhanced health check script that verifies Nginx is actually serving requests

# Check if Nginx is running and the /health endpoint returns 200
if wget --spider -S --timeout=5 "http://127.0.0.1/health" 2>&1 | grep -q "HTTP/1.1 200 OK"; then
    exit 0
fi

# If we got here, something is wrong
exit 1
