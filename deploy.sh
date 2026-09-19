#!/bin/bash
set -e -u -o pipefail

echo 'Running test'
npm test

echo 'Building UI bundle'
npm run ui-build

echo 'Deploying to pi'
rsync -avz dist/ pi:~/smart-home/

echo 'Restarting smart-home'
ssh pi pkill -f chromium
