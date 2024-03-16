#!/bin/bash
set -e -u -o pipefail

echo 'Deploying to pi'
rsync -avz --exclude .git --exclude node_modules . pi:~/smart-home
