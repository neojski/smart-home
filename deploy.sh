#!/bin/bash

function info {
  RED="\033[0;32m"
  NC="\033[0m"
  echo -e "${RED}${1}${NC}"
}

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

info 'Deploying to github'
git push git@github.com:neojski/smart-home.git $git_arg

# TODO: do we want to continue deploying to digitalocean?
#info 'Deploying UI'
#ssh neo@digitalocean 'cd ~/smart-home && git config --local receive.denyCurrentBranch updateInstead'
#git push neo@digitalocean:~/smart-home $git_arg
#ssh neo@digitalocean 'cd ~/smart-home && npm install && npm run browserify'

info 'Deploying to pi'
ssh pi 'cd ~/smart-home && git config --local receive.denyCurrentBranch updateInstead'
git push pi:~/smart-home $git_arg
ssh pi 'cd ~/smart-home && npm install && npm run browserify' 
