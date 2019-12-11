const TuyAPI = require('tuyapi');
const timestamp = require('./timestamp');
const EventEmitter = require('events');
const debug0 = require('debug')('smart-home:socket');

function sleep (ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

module.exports = async function ({id, key}) {
  const emitter = new EventEmitter();
  const device = new TuyAPI({id, key, persistentConnection: true, version: '3.3'});

  function debug (...args) {
    debug0({id, key}, ...args);
  }

  let result = {};

  while (true) {
    try {
      debug('trying to find socket');
      await device.find();
      break;
    } catch (error) {
      debug('Could not find device. Trying again in 5s', error);
      await sleep(5000);
    }
  }

  let isOn;

  debug('Device found');

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

  emitter.getData = function () {
    return result;
  };

  return emitter;
};
