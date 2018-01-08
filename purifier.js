const miio = require('miio');

// TODO: Make sure this data is not too old
data = null;

function update (getDevice) {
  getDevice().then(device => {
    data = {
      aqi: device.aqi,
      temperature: device.temperature,
      humidity: device.humidity,
      mode: device.mode,
    };
  }).catch(console.error);
}

function getData () {
  return data;
}

function setMode(getDevice, mode) {
  return getDevice().then(device => {
    return device.setMode(mode);
  }).catch(console.error);
}

module.exports = function (address, span) {
  let getDevice = function () {
    return miio.device({address: address, retries: 0});
  };

  getDevice().then(device => {device.setBuzzer(false)}).catch(console.error);

  setInterval(function () {
    update(getDevice);
  }, span);
  update(getDevice);

  return {
    getData: getData,
    setMode: function (mode) {
      return setMode(getDevice, mode);
    },
  };
};
