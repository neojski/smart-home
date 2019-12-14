import fs from 'fs';
import timestamp from './timestamp';
import { median } from './median';
import { Temperature } from "../shared/Temperature";

const debug = require('debug')('smart-home:temperature');

// https://learn.adafruit.com/adafruits-raspberry-pi-lesson-11-ds18b20-temperature-sensing?view=all
function doRead(deviceId: string) {
  let filename = '/sys/bus/w1/devices/' + deviceId + '/w1_slave';
  let result = fs.readFileSync(filename).toString();
  if (/crc=.*YES/.test(result)) {
    return (+result.match(/t=(-?\d+)/)![1]) / 1000;
  } else {
    throw 'No correct temperature found: ' + filename + '(' + result + ')';
  }
}

let temperatures: number[] = [];
let lastRead: string = timestamp();
function loop(samples: number) {
  try {
    temperatures.push(doRead('28-0216252dbfee'));
    temperatures = temperatures.slice(-samples);
    lastRead = timestamp();
  } catch (e) {
    debug(e);
  }
}

function getResult(): Temperature {
  return {
    timestamp: lastRead,
    data: median(temperatures)
  };
}

export default {
  init: function (span: number, samples: number) {
    setInterval(() => loop(samples), span);
    loop(samples);
    return getResult;
  }
}
