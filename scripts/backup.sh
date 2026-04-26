#!/bin/bash
# Database backup script
set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

mkdir -p $BACKUP_DIR

echo "Starting database backup..."

# Get DATABASE_URL from environment
source .env

# Run backup
pg_dump "$DATABASE_URL" > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

echo "Backup complete: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
ls -t $BACKUP_DIR/*.gz 2>/dev/null | tail -n +8 | xargs -r rm

echo "Old backups cleaned up. Latest backups:"
ls -lh $BACKUP_DIR/*.gz 2>/dev/null | tail -3