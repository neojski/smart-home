const TuyAPI = require('tuyapi');
const timestamp = require('./timestamp');

module.exports = function ({id, key}) {
  let result = {};
  setInterval(function () {
    const device = new TuyAPI({id, key, persistentConnection: true});

    device.resolveId().then(() => {
      console.log('resolved socket');

      device.on('connected',() => { console.log('connected to socket');});
      device.on('disconnected',() => { console.log('disconnected from socket');});
      device.on('error',(err) => { console.error('socket error', err); device.disconnect(); });

      device.on('data', data => {
        console.log('socket data', data);
        const status = data.dps['1'];
        result = {
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
      return result;
    }
  };
};
