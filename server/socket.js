const TuyAPI = require('tuyapi');
const timestamp = require('./timestamp');
const EventEmitter = require('events');


module.exports = function ({id, key}) {
  const emitter = new EventEmitter();
  const device = new TuyAPI({id, key, persistentConnection: true});

  let result;
  let status;

  let theOneDevice;
  async function setup () {
    try {
      if (theOneDevice != null) {
        theOneDevice.disconnect();
      }

      await device.resolveId();
      console.log('resolved socket');

      device.on('connected',() => {theOneDevice = device;});
      device.on('disconnected',() => { setup(); });
      device.on('error',(err) => { setup(); });

      device.on('data', data => {
        console.log('socket data', data);
        if (data.dps['1'] != null) {
          status = data.dps['1'];
        }
        result = {
          status: status,
          timestamp: timestamp()
        };
        emitter.emit('data', result);
      });
      return device.connect();
    } catch(e) {
      console.error('Socket issue, restarting socket connection. Retrying in 5s.', e);
      setTimeout(setup, 5000);
    }
  }

  setup();

  emitter.getData = function () {
    return result;
  };

  return emitter;
};
