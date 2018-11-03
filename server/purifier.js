const miio = require('miio');

// TODO: Make sure this data is not too old
module.exports = function (address, span) {
  let device = miio.device({address: address, retries: 5});
  let data = {};
  device.then(device => {
    console.log('got device');

    device.setBuzzer(false);

    let properties = new Set(['aqi', 'temperature', 'humidity', 'mode']);

    for (let p of properties) {
      data[p] = device[p];
    }

    device.on('propertyChanged', e => {
      if (properties.has(e.property)) {
        data[e.property] = e.value;
      }
    });
  }).catch(e => {
    console.error (new Date(), e);
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
