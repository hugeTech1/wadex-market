#!/bin/bash

# Extract the "name" value from package.json
SERVER_NAME=$(jq -r '.name' package.json)

# Check if the SERVER_NAME was successfully retrieved
if [ -z "$SERVER_NAME" ]; then
  echo "Failed to retrieve server name from package.json."
  exit 1
fi

export PATH="$(npm bin -g):$PATH"

pm2 stop "$SERVER_NAME"
pm2 delete "$SERVER_NAME"
git fetch origin
git reset --hard origin/production
rm -rf ../../public_html/*
rsync -av --no-times --exclude='.git' ./ ../../public_html/
cd ../../public_html
npm install
npm run build
pm2 start ecosystem.config.cjs --env production



