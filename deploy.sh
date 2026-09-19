#!/bin/bash
set -e -u -o pipefail

echo 'Running test'
npm test

echo 'Building UI bundle'
npm run ui-build

echo 'Deploying to pi'
# --delete so the pi mirrors dist exactly and old files don't pile up
rsync -avz --delete dist/ pi:~/smart-home/

echo 'Restarting smart-home'
ssh pi pkill -f chromium
