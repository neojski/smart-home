const miio = require('miio');

// TODO: Make sure this data is not too old
module.exports = function (address, span) {
  let device = miio.device({address: address, retries: 5});
  device.then(device => {
    device.setBuzzer(false)
    
    let properties = new Set(['aqi', 'temperature', 'humidity', 'mode']);
  
    let data = {};
    for (let p of properties) {
      data[p] = device[p];
    }
  
    device.on('propertyChanged', e => {
      if (properties.has(e.property)) {
        data[e.property] = e.value;
      }
    });

    return {
      getData: function () {
        return data;
      },
      setMode: function (mode) {
        return device.setMode(mode);
      },
    };
  });
};
