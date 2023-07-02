# smart home

Server and UI for smart mirror that controls my home

Server runs on raspberry pi and collects data from various sources:

- temperature sensor
- air purifier
- (TODO) smart sockets

UI displays the data:

- time
- air quality
- temperatures (inside and outside)
- tube deparatures

The server is run using pm2 that's, in turn, started by systemd (http://pm2.keymetrics.io/docs/usage/startup).

# Compilation

- run build from vscode
- then run ui-dev from package.json

# Purifier

I got token using these instructions:

https://www.home-assistant.io/integrations/xiaomi_miio/#retrieving-the-access-token

aka

https://github.com/PiotrMachowski/Xiaomi-cloud-tokens-extractor

# Raspberry PI

- On raspberry pi I use `n` for managing node version.
- Enabled auto-login through `sudo raspi-config` -> `Boot Options` -> `Desktop / CLI` -> `Console Autologin`
- Copied over `node_modules/@tuyapi/driver/` to raspberry pi. This seems really bad

# Testing websocket disconnections

`sudo tcpkill port 8123 -i lo`
