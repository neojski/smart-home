/* Module for fetching data from home assistant */

import { Data } from "./Data";

export default class {
  data: Data;
  update: { (data: Data): void };
  socket: WebSocket;
  next: number;

  send(
    query: any,
    { suppressId }: { suppressId: boolean } = { suppressId: false }
  ) {
    if (!suppressId) {
      const id = this.next++;
      query.id = id;
    }
    this.socket.send(JSON.stringify(query));
  }

  constructor(update: { (data: Data): void }) {
    // CR: actually read data from websockets
    this.update = update;

    // CR: not sure about this error handling
    this.data = {
      aqi: undefined,
      power: undefined,
      upTemperature: undefined,
      downTemperature: undefined,
      weather: "undefined",
    };
    this.next = 1;

    const HA_WS_API_URL = "ws://192.168.1.232:8123/api/websocket";
    const HA_ACCESS_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiM2IxYzI1ZmViOGI0YzE5OTM2ZDYyZWQwM2E4OTNmYyIsImlhdCI6MTY4ODE1NzA5NywiZXhwIjoyMDAzNTE3MDk3fQ.O6sL-X2bB7ztsEitEhkGtzW6z-O_f75JlVee8dUDq24";
    // Connect to Home Assistant WebSocket API
    this.socket = new WebSocket(HA_WS_API_URL);
    this.socket.addEventListener("open", () => {
      console.log("Connected to Home Assistant WebSocket API");

      this.socket.addEventListener("message", (event: any) => {
        const message = JSON.parse(event.data);

        if (message.type === "auth_required") {
          // Authenticate with Home Assistant
          this.send(
            { type: "auth", access_token: HA_ACCESS_TOKEN },
            // auth forbids ids
            { suppressId: true }
          );
        } else if (message.type === "auth_ok") {
          console.log("Authentication successful");

          // This should cause message.type "result". We do it to get initial snapshot of events
          this.send({ type: "get_states" });

          // Also subscribe to events
          //this.send({ type: "subscribe_events" });
        } else if (message.type === "message") {
          // CR this is untested
          this.refresh(message);
        } else if (message.type === "result") {
          if (message.result) {
            console.log(message.result);
            this.refresh(message.result);
          } else {
            console.warn("message.result is falsy", message);
          }
        } else {
          console.warn("ignored message kind", message);
        }
      });
      this.socket.addEventListener("close", () => {
        console.log("Disconnected from Home Assistant WebSocket API");
      });
      this.socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  // CR-someday: sad types
  refresh(results: any[]) {
    for (const result of results) {
      if (result.entity_id === "sensor.openweathermap_temperature") {
        this.data.weather = {
          main: {
            temp: Number(result.state),
          },
          weather: [
            {
              icon: "01d",
              // CR fix
            },
          ],
        };
      }
    }

    function noise(n: number) {
      return n + Math.floor(100 * Math.random());
    }

    // CR other bits
    this.data.power = noise(500);

    this.update(this.data);
  }

  destroy() {
    this.socket.close();
  }
}
