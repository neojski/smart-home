import TuyAPI from 'tuyapi';
import timestamp from './timestamp';
import EventEmitter from 'events';
import { sleep } from './sleep';
import { Socket } from '../shared/Socket';

const debug0 = require('debug')('smart-home:socket');


export default async function ({ id, key }: { id: string, key: string }) {
  let result: Socket = {};

  const emitter = Object.assign(new EventEmitter(), { getData: function () { return result } })

  const device = new TuyAPI({ id, key, persistentConnection: true, version: '3.3' });

  function debug(...args: any) {
    debug0({ id, key }, ...args);
  }


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

  let isOn: boolean | undefined = undefined;

  debug('Device found');

  device.on('connected', () => { debug('connected'); });
  device.on('disconnected', () => { isOn = undefined; debug('disconnected'); });
  device.on('error', (e) => { debug('error', e); });

  device.on('data', data => {
    // sometimes this data is garbage
    isOn = data?.dps?.[1];
    result = {
      status: isOn,
      timestamp: timestamp()
    };
    debug('socket data', result, data);
    emitter.emit('data', result);
  });
  device.connect();


  return emitter;
};
