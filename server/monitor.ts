const debug = require("debug")("smart-home:monitor");

import gpio, { Gpio } from "gpio";

export default class {
  private gpio: Promise<Gpio>;
  constructor(pin: number) {
    this.gpio = new Promise(function (resolve) {
      const result = gpio.export(pin, {
        direction: "out",
        ready: function () {
          result.set(true);
          resolve(result);
        },
      });
    });
  }
  async toggle() {
    debug("toggle");
    const gpio = await this.gpio;
    gpio.set(!gpio.value);
  }
  async set(b: boolean) {
    debug("set", b);
    const gpio = await this.gpio;
    gpio.set(b);
  }
  async get() {
    const gpio = await this.gpio;
    return gpio.value;
  }
}
