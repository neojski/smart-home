import fs from 'fs';
import timestamp from './timestamp';
import { median } from './median';
import { Temperature } from "../shared/Temperature";

const debug = require('debug')('smart-home:temperature');

export default class {
  temperatures: number[]
  lastRead?: string
  id: string;
  samples: number;

  constructor(id: string, span: number, samples: number) {
    this.temperatures = [];
    this.id = id;
    this.samples = samples;

    setInterval(() => this.loop, span);
    this.loop();
  }

  // https://learn.adafruit.com/adafruits-raspberry-pi-lesson-11-ds18b20-temperature-sensing?view=all
  doRead() {
    let filename = '/sys/bus/w1/devices/' + this.id + '/w1_slave';
    let result = fs.readFileSync(filename).toString();
    if (/crc=.*YES/.test(result)) {
      return (+result.match(/t=(-?\d+)/)![1]) / 1000;
    } else {
      throw 'No correct temperature found: ' + filename + '(' + result + ')';
    }
  }

  loop() {
    try {
      this.temperatures.push(this.doRead());
      this.temperatures = this.temperatures.slice(-this.samples);
      this.lastRead = timestamp();
    } catch (e) {
      debug(e);
    }
  }

  get(): Temperature {
    return {
      timestamp: this.lastRead,
      data: median(this.temperatures)
    };
  }
}
