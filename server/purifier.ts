import miio, { mode, Device } from "miio";
import timestamp from "./timestamp";
import { Purifier } from "../shared/Purifier";

const debug = require("debug")("smart-home:purifier");

export default class {
  device: Promise<Device>;
  data: Purifier;

  constructor(address: string) {
    this.device = miio.device({
      address,
      retries: 5,
      token: "c20040c5ad31333f9f0441ce80fe709e",
    });

    this.data = {};

    this.init();
  }

  async init() {
    let device = await this.device;

    debug("purifier detected", device);
    device.setBuzzer(false);

    const setData = (
      property: "aqi" | "temperature" | "humidity",
      value: number
    ) => {
      debug(property, value);
      this.data[property] = value;
      this.data.timestamp = timestamp();
    };

    device.on("temperatureChanged", (v) => {
      setData("temperature", v.value);
    });

    device.on("pm2.5Changed", (v) => {
      setData("aqi", v);
    });

    device.on("relativeHumidityChanged", (v) => {
      setData("humidity", v);
    });
  }

  getData() {
    return this.data;
  }

  async setMode(mode: mode) {
    let device = await this.device;

    return device.setMode(mode);
  }
}
