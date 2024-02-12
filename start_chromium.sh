#!/bin/bash
# https://superuser.com/questions/237608/how-to-hide-chrome-warning-after-crash
export DISPLAY=:0
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences && /usr/bin/chromium-browser --start-fullscreen ~/smart-home/ui/index.html
