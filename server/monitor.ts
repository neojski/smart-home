import * as fs from "fs";

export default class {
  pin: number;
  value: boolean;

  constructor(pin: number, value: boolean) {
    this.pin = pin;
    this.value = value;
    const dir = this.dir();
    if (!fs.existsSync(dir)) {
      fs.writeFileSync("/sys/class/gpio/export", String(this.pin));
    }
    fs.writeFileSync(dir + "/direction", "out");
    this.set(this.value);
  }

  dir() {
    return "/sys/class/gpio/gpio" + this.pin;
  }

  set(value: boolean) {
    this.value = value;
    const strValue = this.value ? "1" : "0";
    fs.writeFileSync(this.dir() + "/value", strValue);
  }

  // CR: improve get to actually read the value in case of external changes
  get() {
    return this.value;
  }
}
