#!/bin/bash
set -e

# === CONFIGURATION ===
APP_DIR="/home/naser/owjamlak"
CHAT_DIR="/home/naser/chat-app"
BACKUP_DIR="/home/naser/_deploy_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Enable logging
LOG_FILE="$BACKUP_DIR/deploy_${TIMESTAMP}.log"
mkdir -p "$BACKUP_DIR"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=================================================================="
echo "🚀 Starting deployment at $TIMESTAMP"
echo "Log file: $LOG_FILE"
echo "=================================================================="

# === FUNCTIONS ===
rollback() {
  echo "❌ Deployment failed — starting rollback..."
  if [ -d "$BACKUP_DIR/public_${TIMESTAMP}" ]; then
    echo "Restoring public/uploads..."
    rm -rf "$APP_DIR/public/uploads"
    mkdir -p "$APP_DIR/public"
    cp -r "$BACKUP_DIR/public_${TIMESTAMP}/uploads" "$APP_DIR/public/"
  fi

  if [ -d "$BACKUP_DIR/data_${TIMESTAMP}" ]; then
    echo "Restoring data folder..."
    rm -rf "$APP_DIR/data"
    cp -r "$BACKUP_DIR/data_${TIMESTAMP}/data" "$APP_DIR/"
  fi

  if [ -f "$BACKUP_DIR/env_owjamlak_${TIMESTAMP}.backup" ]; then
    echo "Restoring owjamlak env..."
    cp "$BACKUP_DIR/env_owjamlak_${TIMESTAMP}.backup" "$APP_DIR/.env.production"
  fi

  if [ -f "$BACKUP_DIR/env_chat_${TIMESTAMP}.backup" ]; then
    echo "Restoring chat-app env..."
    cp "$BACKUP_DIR/env_chat_${TIMESTAMP}.backup" "$CHAT_DIR/.env"
  fi

  echo "Reverting git changes..."
  git -C "$APP_DIR" reset --hard HEAD@{1} || true
  git -C "$CHAT_DIR" reset --hard HEAD@{1} || true

  echo "Restarting old version..."
  cd "$APP_DIR"
  docker compose up -d || echo "⚠️ Warning: rollback containers might not start properly."
  echo "Rollback complete."
}

trap 'rollback' ERR

# === BACKUP STEP ===
echo "==> Backing up data and uploads..."
mkdir -p "$BACKUP_DIR/public_${TIMESTAMP}" "$BACKUP_DIR/data_${TIMESTAMP}"

if [ -d "$APP_DIR/public/uploads" ]; then
  cp -r "$APP_DIR/public/uploads" "$BACKUP_DIR/public_${TIMESTAMP}/" || echo "No uploads to backup."
fi

if [ -d "$APP_DIR/data" ]; then
  cp -r "$APP_DIR/data" "$BACKUP_DIR/data_${TIMESTAMP}/" || echo "No data folder to backup."
fi

# Backup envs
if [ -f "$APP_DIR/.env.production" ]; then
  cp "$APP_DIR/.env.production" "$BACKUP_DIR/env_owjamlak_${TIMESTAMP}.backup"
fi
if [ -f "$CHAT_DIR/.env" ]; then
  cp "$CHAT_DIR/.env" "$BACKUP_DIR/env_chat_${TIMESTAMP}.backup"
fi

# === STOP CONTAINERS ===
echo "==> Stopping containers..."
cd "$APP_DIR"
docker compose down

# === UPDATE CODE ===
echo "==> Pulling latest code..."
# Fix Git dubious ownership warnings
git config --global --add safe.directory "$APP_DIR"
git config --global --add safe.directory "$CHAT_DIR"

git -C "$APP_DIR" fetch --all
git -C "$APP_DIR" reset --hard origin/main

git -C "$CHAT_DIR" fetch --all
git -C "$CHAT_DIR" reset --hard origin/main

# === RESTORE ENVS ===
if [ -f "$BACKUP_DIR/env_owjamlak_${TIMESTAMP}.backup" ]; then
  cp "$BACKUP_DIR/env_owjamlak_${TIMESTAMP}.backup" "$APP_DIR/.env.production"
fi
if [ -f "$BACKUP_DIR/env_chat_${TIMESTAMP}.backup" ]; then
  cp "$BACKUP_DIR/env_chat_${TIMESTAMP}.backup" "$CHAT_DIR/.env"
fi

# === CLEAN DOCKER CACHE ===
echo "==> Cleaning Docker images..."
docker image prune -a -f

# === RESTORE PERSISTENT DATA ===
echo "==> Restoring data and uploads..."
mkdir -p "$APP_DIR/public/uploads"
if [ -d "$BACKUP_DIR/public_${TIMESTAMP}/uploads" ]; then
  cp -r "$BACKUP_DIR/public_${TIMESTAMP}/uploads/." "$APP_DIR/public/uploads/"
fi

mkdir -p "$APP_DIR/data"
if [ -d "$BACKUP_DIR/data_${TIMESTAMP}/data" ]; then
  cp -r "$BACKUP_DIR/data_${TIMESTAMP}/data/." "$APP_DIR/data/"
fi

# === START CONTAINERS ===
echo "==> Starting containers..."
cd "$APP_DIR"
docker compose up -d --build

# === VERIFY APP HEALTH ===
echo "==> Verifying containers health..."
sleep 10
APP_CONTAINER=$(docker ps --format '{{.Names}}' | grep 'owjamlak-app' | head -n 1)
if [ -z "$APP_CONTAINER" ]; then
  echo "❌ App container not found — triggering rollback..."
  rollback
  exit 1
fi

# === FIX PERMISSIONS ===
echo "==> Fixing uploads permissions..."
docker exec -u root "$APP_CONTAINER" chown -R nextjs:nodejs /app/public/uploads || echo "⚠️ Permission fix failed"
docker exec -u root "$APP_CONTAINER" chown -R nextjs:nodejs /app/data || echo "⚠️ Permission fix failed"

# === CLEANUP BACKUPS ===
echo "==> Cleaning old backups..."
rm -rf "$BACKUP_DIR/public_${TIMESTAMP}"
rm -rf "$BACKUP_DIR/data_${TIMESTAMP}"
rm -f "$BACKUP_DIR/env_owjamlak_${TIMESTAMP}.backup"
rm -f "$BACKUP_DIR/env_chat_${TIMESTAMP}.backup"

# Clean old backups (keep only last 3 days)
find "$BACKUP_DIR" -type d -name "public_*" -mtime +3 -exec rm -rf {} \; 2>/dev/null || true
find "$BACKUP_DIR" -type d -name "data_*" -mtime +3 -exec rm -rf {} \; 2>/dev/null || true
find "$BACKUP_DIR" -type f -name "env_*" -mtime +3 -exec rm -f {} \; 2>/dev/null || true
find "$BACKUP_DIR" -type f -name "deploy_*.log" -mtime +7 -exec rm -f {} \; 2>/dev/null || true

echo "================================================================== done by wolfix"
echo "==================================================================aa"