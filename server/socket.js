const TuyAPI = require('tuyapi');
const timestamp = require('./timestamp');
const EventEmitter = require('events');

module.exports = function ({id, key}) {
  const emitter = new EventEmitter();
  const device = new TuyAPI({id, key, persistentConnection: true});

  let result = {};

  function resolveId (done) {
    // This fails when one tries to discover multiple devices at the same time
    device.resolveId().then(done).catch((error) => {
      console.error('Could not resolveId. Trying again in 5s', error);
      setTimeout(() => { resolveId(done); }, 5000);
    });
  }

  resolveId(() => {
    let resetting = false;
    function reset (reason) {
      // TODO: I'm not sure this makes any sense with persistent connection. It all seems pretty unstable
      if (resetting) {
        return;
      }
      device.disconnect();
      console.error('Restarting socket connection. Retrying in 5s.', reason);
      resetting = true;
      setTimeout(() => {
        resetting = false;
        device.connect ();
      }, 5000);
    }

    device.on('disconnected', () => { reset('disconnected'); });
    device.on('error', (e) => { reset(e); });

    device.on('data', data => {
      console.log('socket data', data);
      // sometimes this data is garbage
      if (data.dps != null && data.dps['1'] != null) {
        status = data.dps['1'];
      }
      result = {
        status: status,
        timestamp: timestamp()
      };
      emitter.emit('data', result);
    });

    device.connect();
  });


  emitter.getData = function () {
    return result;
  };

  return emitter;
};
