#!/bin/bash
# Let's Encrypt SSL Setup Script
set -e

DOMAIN=${DOMAIN:-seven7barber.com}
EMAIL=${EMAIL:-admin@seven7barber.com}

echo "Setting up SSL for $DOMAIN..."

# Stop nginx temporarily for certbot
docker compose -f docker-compose.prod.yml down nginx

# Get certificate
certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --keep-until-expiring

# Create ssl directory
mkdir -p nginx/ssl

# Copy certificates
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/

# Restart services
docker compose -f docker-compose.prod.yml up -d

echo "SSL setup complete!"