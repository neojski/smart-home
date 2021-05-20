# https://superuser.com/questions/237608/how-to-hide-chrome-warning-after-crash
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences && /usr/bin/chromium-browser --kiosk 127.0.0.1:3000
