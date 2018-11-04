const TuyAPI = require('tuyapi');
const timestamp = require('./timestamp');

module.exports = function ({id, key}) {
  let data = {};
  setInterval(function () {
    const device = new TuyAPI({id, key, persistentConnection: true});

    device.resolveId().then(() => {

      //device.on('connected',() => {});
      //device.on('disconnected',() => {});
      //device.on('error',(err) => {});

      device.on('data', data => {
        const status = data.dps['1'];
        data = {
          status: status,
          timestamp: timestamp()
        };

        device.disconnect();
      });

      device.connect();
    });
  }, 30000);

  return {
    getData: function () {
      return data;
    }
  };
};
