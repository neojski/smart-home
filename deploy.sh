#!/bin/bash


function info {
  RED="\033[0;32m"
  NC="\033[0m"
  echo -e "${RED}${1}${NC}"
}

info 'Deploying to github'
git push git@github.com:neojski/smart-home.git

info 'Deploying server'
ssh pi 'cd ~/smart-home && git config --local receive.denyCurrentBranch updateInstead'
git push pi:~/smart-home
ssh pi 'cd ~/smart-home && npm install' 

info 'Deploying UI'
ssh neo@digitalocean 'cd ~/smart-home && git config --local receive.denyCurrentBranch updateInstead'
git push neo@digitalocean:~/smart-home
ssh neo@digitalocean 'cd ~/smart-home && npm install && npm run browserify'
