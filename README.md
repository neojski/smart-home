# smart home

Server and UI for smart mirror that controls my home

Most data is fetched from my local instance of home assistant

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
- I needed to set up some `rfkill unblock all` in cron to fix wifi on rapsberry

# Testing websocket disconnections

`sudo tcpkill port 8123 -i lo`
