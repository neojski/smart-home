import timestamp from './timestamp';
import EventEmitter from 'events';

import { Device } from "@tuyapi/driver"
import { Socket } from '../shared/Socket';

const debug0 = require('debug')('smart-home:socket');

export default class {
  data: Socket
  emitter: EventEmitter

  constructor({ id, key, ip }: { id: string, key: string, ip: string }) {
    this.emitter = new EventEmitter();
    this.data = {};

    this.initialize({ id, key, ip });
  }

  async initialize({ id, key, ip }: { id: string, key: string, ip: string }) {
    let device = new Device({ id, key, ip });

    function debug(...args: any) {
      debug0({ id, key }, ...args);
    }

    let isOn: boolean | undefined = undefined;

    device.on('connected', () => { debug('connected'); });

    device.on('disconnected', () => {
      const reconnectTimeout = 10000;
      isOn = undefined; debug('disconnected; reconnecting in', { reconnectTimeout });

      // TuyAPI used to have persistent connection but it was removed. We call
      // [device.connect] periodically to make it recover after disconnection.
      setTimeout(function () {
        device.connect();
      }, reconnectTimeout);
    });

    device.on('error', (e) => { debug('error', e); });

    device.on('data', _frame => {
      const raw = device.get() as any;

      // sometimes this data is garbage
      isOn = raw[1] ?? isOn;
      const data = {
        status: isOn,
        timestamp: timestamp()
      };
      this.data = data;
      debug('socket data', { data, raw });
      this.emitter.emit('data', data);
    });
    device.connect();
  }

  onData(callback: { (): void }) {
    this.emitter.on('data', callback)
  }

  getData() {
    return this.data;
  }
};
