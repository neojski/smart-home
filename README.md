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

# Dev notes

- useful commands are in package.json

# Raspberry PI

On raspberry pi I use `n` for managing node version.
