const debug = require('debug')('smart-home:monitor');

import gpio, { Gpio } from 'gpio';
const pin = 3;

const gpio3: Promise<Gpio> = new Promise(function (resolve) {
  const result = gpio.export(pin, {
    direction: 'out',
    ready: function () {
      result.set(true);
      resolve(result);
    },
  });
});

export default {
  toggle: async function () {
    debug('toggle');
    const gpio = await gpio3;
    gpio.set(!gpio.value);
  },
  set: async function (b: boolean) {
    debug('set', b);
    const gpio = await gpio3;
    gpio.set(b);
  }
};
