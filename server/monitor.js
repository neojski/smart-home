const debug = require('debug')('smart-home:monitor');

const gpio = require('gpio');
const pin = 3;

const gpio3 = new Promise(function (resolve, reject) {
  const result = gpio.export(pin, {
    direction: 'out',
    ready: function () {
      resolve(result);
    },
  });
});

module.exports = async function () {
  return {
    toggle: async function () {
      debug('toggle');
      const gpio = await gpio3;
      gpio.set(!gpio.value);
    },
    set: async function (b) {
      debug('set', b);
      const gpio = await gpio3;
      gpio.set(b);
    }
  };
}
