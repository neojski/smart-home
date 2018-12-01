const miio = require('miio');
const timestamp = require('./timestamp');
const debug = require('debug')('smart-home:purifier');

module.exports = function (address, span) {
  let device = miio.device({address: address, retries: 5});
  let data = {};
  device.then(device => {
    debug('purifier detected');

    device.setBuzzer(false);

    let properties = new Set(['aqi', 'temperature', 'humidity', 'mode']);

    for (let p of properties) {
      data[p] = device[p];
    }

    device.on('propertyChanged', e => {
      if (properties.has(e.property)) {
        data[e.property] = e.value;
        data.timestamp = timestamp();
      }
    });
  }).catch(e => {
    debug('purifier issue', new Date(), e);
  });

  return {
    getData: function () {
      return data;
    },
    setMode: function (mode) {
      return device.then(device => {
        return device.setMode(mode);
      });
    }
  };
};
