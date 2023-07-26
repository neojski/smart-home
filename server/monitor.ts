const debug = require("debug")("smart-home:monitor");

import gpio, { Gpio } from "gpio";

export default class {
  private gpio: Promise<Gpio>;
  constructor(pin: string) {
    this.gpio = new Promise(function (resolve) {
      const result = gpio.export(pin, {
        direction: "out",
        ready: function () {
          result.set("1");
          resolve(result);
        },
      });
    });
  }
  async set(b: boolean) {
    const value = b ? "1" : "0";
    debug("set", value);
    const gpio = await this.gpio;
    gpio.set(value);
  }
  async get() {
    const gpio = await this.gpio;
    return gpio.value;
  }
}
