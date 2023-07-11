#!/bin/bash
set -e -u -o pipefail

function info {
  RED="\033[0;32m"
  NC="\033[0m"
  echo -e "${RED}${1}${NC}"
}

git_arg=""
while [[ $# -gt 0 ]]; do
  key="$1"
  case "$key" in
    --force)
      git_arg=--force
      shift
      ;;
    *)
      echo unexpected argument "$1"
      exit 1
      ;;
  esac
done

info 'Pushing to github'
git push git@github.com:neojski/smart-home.git $git_arg

info 'Running pull on pi'
ssh pi 'cd ~/smart-home && git pull'

info 'Deploying to pi'
rsync -avz dist pi:~/smart-home

info 'Restarting smart-home on pi'
ssh pi 'pm2 restart smart-home'
ssh pi 'pm2 restart start_chromium'
