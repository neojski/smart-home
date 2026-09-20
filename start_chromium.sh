#!/bin/bash
# https://superuser.com/questions/237608/how-to-hide-chrome-warning-after-crash
export DISPLAY=:0
# Wayfire keeps drawing the desktop arrow until something moves the pointer, so
# fake a mouse once chromium is up. Backgrounded because it retries for 20s.
sudo python3 ~/smart-home/nudge_pointer.py &

# --no-daemon seems important for systemd not to start multiple instances
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences && /usr/bin/chromium-browser --start-fullscreen --no-daemon ~/smart-home/index.html
