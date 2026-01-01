#!/bin/bash

# Extract the "name" value from package.json
SERVER_NAME=$(jq -r '.name' package.json)

# Check if the SERVER_NAME was successfully retrieved
if [ -z "$SERVER_NAME" ]; then
  echo "Failed to retrieve server name from package.json."
  exit 1
fi

# Stop the PM2 process using the server name
pm2 stop "$SERVER_NAME"
pm2 delete "$SERVER_NAME"
git fetch origin
git reset --hard origin/production
npm install
npm run build
pm2 start ecosystem.config.cjs --env production


