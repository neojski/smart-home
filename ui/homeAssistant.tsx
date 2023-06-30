/* Module for fetching data from home assistant */

import { Data } from "./Data";

export default class {
  interval;
  update: { (data: Data): void };

  constructor(update: { (data: Data): void }) {
    // CR: actually read data from websockets
    this.update = update;
    this.interval = setInterval(this.refresh.bind(this), 5000);
    this.refresh();
  }

  refresh() {
    function noise(n: number) {
      return n + Math.floor(100 * Math.random());
    }
    this.update({
      aqi: 999,
      power: noise(500),
      upTemperature: 999,
      downTemperature: 999,
      weather: { main: { temp: 999 }, weather: [{ icon: "01d" }] },
    });
  }

  destroy() {
    clearInterval(this.interval);
  }
}

// Configuration
const HA_WS_API_URL = "ws://192.168.1.232:8123/api/websocket";
const HA_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiM2IxYzI1ZmViOGI0YzE5OTM2ZDYyZWQwM2E4OTNmYyIsImlhdCI6MTY4ODE1NzA5NywiZXhwIjoyMDAzNTE3MDk3fQ.O6sL-X2bB7ztsEitEhkGtzW6z-O_f75JlVee8dUDq24";
// Connect to Home Assistant WebSocket API
const socket = new WebSocket(HA_WS_API_URL);
socket.addEventListener("open", () => {
  console.log("Connected to Home Assistant WebSocket API");

  // Authenticate with Home Assistant
  socket.send(JSON.stringify({ type: "auth", access_token: HA_ACCESS_TOKEN }));
});
socket.addEventListener("message", (event: any) => {
  const message = JSON.parse(event.data);

  if (message.type === "auth_ok") {
    console.log("Authentication successful");

    socket.send(JSON.stringify({ id: 1, type: "subscribe_events" }));
  }

  console.log(event);
});
socket.addEventListener("close", () => {
  console.log("Disconnected from Home Assistant WebSocket API");
});
socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});