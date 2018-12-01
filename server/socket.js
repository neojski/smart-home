const TuyAPI = require('tuyapi');
const timestamp = require('./timestamp');
const EventEmitter = require('events');
const debug = require('debug')('smart-home:socket');

module.exports = function ({id, key}) {
  const emitter = new EventEmitter();
  const device = new TuyAPI({id, key, persistentConnection: true});

  let result = {};

  function resolveId (done) {
    // This fails when one tries to discover multiple devices at the same time
    device.resolveId().then(done).catch((error) => {
      debug('Could not resolveId. Trying again in 5s', error);
      setTimeout(() => { resolveId(done); }, 5000);
    });
  }

  let isOn;

  resolveId(() => {
    let resetting = false;

    device.on('connected', () => { debug('connected'); });
    device.on('disconnected', () => { isOn = null; debug('disconnected'); });
    device.on('error', (e) => { debug('error', e); });

    device.on('data', data => {
      // sometimes this data is garbage
      if (data.dps != null && data.dps['1'] != null) {
        isOn = data.dps['1'];
      }
      result = {
        status: isOn,
        timestamp: timestamp()
      };
      debug('socket data', result, data);
      emitter.emit('data', result);
    });

    device.connect();
  });


  emitter.getData = function () {
    return result;
  };

  return emitter;
};
