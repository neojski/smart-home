import timestamp from './timestamp';
import EventEmitter from 'events';

import { Device, Find } from "@tuyapi/driver"
import { Socket } from '../shared/Socket';
import { sleep } from './sleep';

const debug0 = require('debug')('smart-home:socket');

export default class {
  data: Socket
  emitter: EventEmitter

  constructor({ id, key }: { id: string, key: string }) {
    this.emitter = new EventEmitter();
    this.data = {
      connected: false
    };

    this.initialize({ id, key });
  }

  async initialize({ id, key }: { id: string, key: string }) {
    let ip;
    while (true) {
      try {
        ip = await Find.find(id, key);
        break;
      } catch (e) {
        // TODO: return this to user as device general error
        this.data.ip = e;
        await sleep(10000);
      }
    }
    this.data.ip = ip;

    let device = new Device({ id, key, ip, heartbeatInterval: 5000 });

    function debug(...args: any) {
      debug0({ id, key }, ...args);
    }

    let isOn: boolean | undefined = undefined;

    device.on('connect', () => {
      this.data.connected = true;

      debug('connected');
    });

    device.on('disconnected', () => {
      this.data.connected = false;

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
      this.data.status = isOn;
      this.data.timestamp = timestamp();
      const data = this.getData();
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
