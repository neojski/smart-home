# smart home

Server and UI for smart mirror that controls my home

Most data is fetched from my local instance of home assistant

# install systemd
1. Copy service to /lib/systemd/system/kiosk.service
2. sudo systemctl daemon-reload
3. sudo systemctl start kiosk
4. sudo systemctl enable kiosk
