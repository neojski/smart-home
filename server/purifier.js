const miio = require('miio');
const timestamp = require('./timestamp');
const debug = require('debug')('smart-home:purifier');

module.exports = function (address, span) {
  let device = miio.device({address: address, retries: 5});
  let data = {};
  device.then(device => {
    debug('purifier detected', device);

    device.setBuzzer(false);

    function setData(property, value) {
      debug(property, value);
      data[property] = value;
      data.timestamp = timestamp();
    }

    device.on('temperatureChanged', v => {
      setData('temperature', v.value);
    });

    device.on('pm2.5Changed', v => {
      setData('aqi', v);
    });

    device.on('relativeHumidityChanged', v => {
      setData('humidity', v);
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
