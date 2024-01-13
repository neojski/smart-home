/* Module for fetching data from home assistant */

import { Data } from "./Data";

const HA_WS_API_URL = "ws://192.168.0.176:8123/api/websocket";
const HA_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNTFmMjgzMGEwMDQ0ZTg5YmQ3YmIwNDhhMzAyNDYzZiIsImlhdCI6MTY4OTEwMTk4NywiZXhwIjoyMDA0NDYxOTg3fQ.yOGKRAXrtWfHOwJ4JPdIUUAmyswkuSF9GqfjmtGq-Tc";

export default class {
  update: { (data: Data): void };
  socket: WebSocket;
  nextId: number;
  entityStates: Map<
    string,
    { state: string; attributes?: { media_title?: string } }
  >; // map from entity id to state

  send(
    query: any,
    { suppressId }: { suppressId: boolean } = { suppressId: false }
  ) {
    if (!suppressId) {
      const id = this.nextId++;
      query.id = id;
    }
    this.socket.send(JSON.stringify(query));
  }

  constructor(update: { (data: Data): void }) {
    this.update = update;
    this.nextId = 1;
    this.entityStates = new Map();
    this.socket = this.connect();
  }

  connect() {
    console.log("Connecting to Home Assistant WebSocket");
    this.socket = new WebSocket(HA_WS_API_URL);
    this.socket.addEventListener("open", this.onOpen.bind(this));
    this.socket.addEventListener("close", this.onClose.bind(this));
    this.socket.addEventListener("error", this.onError.bind(this));
    return this.socket;
  }

  onOpen() {
    console.log("Connected to Home Assistant WebSocket API");
    this.socket.addEventListener("message", this.onMessage.bind(this));
  }

  onClose() {
    console.error(
      "Disconnected from Home Assistant WebSocket API. Reconnecting"
    );
    setTimeout(this.connect.bind(this), 1000);
  }

  onError(error: Event) {
    console.error("WebSocket error:", error);
    this.socket.close();
  }

  onMessage(event: any) {
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

      // Subscribe to events
      this.send({ type: "subscribe_events" });
    } else if (message.type === "event") {
      if (message.event.event_type === "state_changed") {
        this.entityStates.set(
          message.event.data.entity_id,
          message.event.data.new_state
        );
        this.refresh();
      } else {
        console.warn("ignored event", message);
      }
    } else if (message.type === "result") {
      if (message.result) {
        console.info("initial states", message.result);
        const results: { entity_id: string; state: string }[] = message.result;

        this.entityStates = new Map(
          results.map((result) => [result.entity_id, result])
        );

        this.refresh();
      } else {
        console.warn("message.result is falsy", message);
      }
    } else {
      console.warn("ignored message kind", message);
    }
  }

  refresh() {
    // A little trick to make sure that we list all the keys of Data
    // CR-someday: is this a bug in typescript that I can't do this in one go?
    type X<T> = {
      [P in keyof T]-?: T[P];
    };
    type Y<T> = {
      [P in keyof T]: T[P] | undefined;
    };

    const data: Y<X<Data>> = {
      sun: this.entityStates.get("sun.sun")?.state,
      weatherIcon: this.entityStates.get("sensor.openweathermap_weather_code")
        ?.state,
      outsideTemperature: this.entityStates.get("sensor.outside_temperature")
        ?.state,
      power: this.entityStates.get(
        "sensor.octopus_energy_electricity_21l4161923_1012954708140_current_demand"
      )?.state,
      aqi: this.entityStates.get("sensor.air_purifier_pm2_5")?.state,
      upTemperature: this.entityStates.get("sensor.shellyht_007c72_temperature")
        ?.state,
      downTemperature: this.entityStates.get("sensor.home_temperature")?.state,
      kitchenMusic: this.entityStates.get("media_player.kitchen"),
    };
    this.update(data);
  }

  destroy() {
    this.socket.close();
  }
}
