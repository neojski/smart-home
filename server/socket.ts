import timestamp from "./timestamp";
import EventEmitter from "events";

import { Device, Find } from "@tuyapi/driver";
import { sleep } from "./sleep";
import { Socket } from "../shared/Socket";

const debug0 = require("debug")("smart-home:socket");

const reconnectTimeout = 10000;

export default class {
  emitter: EventEmitter;

  key: string;
  id: string;
  ip: string | undefined;
  connected: boolean;
  timestamp: string | undefined;
  status: boolean | undefined;

  // TODO: I don't know if this should be a different error or maybe state
  // machine with error state?
  error: Error | undefined;

  constructor({ id, key }: { id: string; key: string }) {
    this.emitter = new EventEmitter();

    this.connected = false;
    this.id = id;
    this.key = key;

    this.connect();
  }

  setError(error?: Error) {
    this.error = error ?? this.error;
  }

  clearError() {
    this.error = undefined;
  }

  async discoverIp() {
    let ip;
    while (true) {
      try {
        ip = await Find.find(this.id, this.key);
        this.clearError();
        break;
      } catch (error) {
        this.debug("discoverIp failed; retrying", { reconnectTimeout, error });
        this.setError(new Error(error));
        await sleep(reconnectTimeout);
      }
    }
    return ip;
  }

  debug(...args: any) {
    debug0({ id: this.id, key: this.key }, ...args);
  }

  // Call when we think the device may be in the bad state. This should clean up
  // and try to reconnect.
  handleDisconnected(device: Device, error?: Error) {
    this.debug("disconnected; cleaning up and reconnecting", {
      reconnectTimeout,
      error
    });

    this.setError(error);

    // clean up device handler
    device.disconnect();
    device.removeAllListeners();

    this.connected = false;
    this.status = undefined;

    setTimeout(() => {
      this.connect();
    }, reconnectTimeout);
  }

  handleData(raw: object, isOn: boolean) {
    this.status = isOn;

    const data = this.getData();
    this.debug("socket data", { data, raw });
    this.emitter.emit("data", data);
  }

  handleHeartbeat() {
    this.timestamp = timestamp();
  }

  async connect() {
    // When the device disconnected the next time it connects may be using
    // different ip so we try to rediscover it first.
    this.ip = await this.discoverIp();

    let device = new Device({
      id: this.id,
      key: this.key,
      ip: this.ip,
      heartbeatInterval: 5000
    });

    device.on("connect", () => {
      this.connected = true;
      this.debug("connected");
    });

    device.on("disconnected", () => {
      this.handleDisconnected(device);
    });
    device.on("error", e => {
      this.handleDisconnected(device, e);
    });

    device.on("data", _frame => {
      this.handleHeartbeat();

      const raw: { 1?: any } = device.get();
      const dp1 = raw[1];
      if (typeof dp1 === "boolean") {
        this.handleData(raw, dp1);
      } else {
        this.debug("Received weird data where dp1 isn't a boolean", { raw });
      }
    });

    device.connect();
  }

  onData(callback: { (): void }) {
    this.emitter.on("data", callback);
  }

  getData(): Socket {
    return {
      status: this.status,
      timestamp: this.timestamp,
      connected: this.connected,
      ip: this.ip
    };
  }
}
