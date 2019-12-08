const miio = require('miio');
const timestamp = require('./timestamp');
const debug = require('debug')('smart-home:purifier');

module.exports = async function (address, span) {
  let device = await miio.device({address: address, retries: 5});
  debug('purifier detected', device);

  let data = {};
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
