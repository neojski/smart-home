const miio = require('miio');

data = null;

function update () {
  miio.device({ address: '192.168.0.4' }).then(device => {
    data = {
      aqi: device.aqi,
      temperature: device.temperature,
      humidity: device.humidity,
    };
  })
    .catch(console.error);
}

function get_data () {
  return data;
}

module.exports = {
  init: function (span) {
    setInterval(update, span);
    update();

    return get_data;
  }
};
