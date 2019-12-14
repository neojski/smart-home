import miio, { mode } from 'miio';
import timestamp from './timestamp';
import { Purifier } from '../shared/Purifier';

const debug = require('debug')('smart-home:purifier');


export default async function (address: string, span: number) {
  let device = await miio.device({ address: address, retries: 5 });
  debug('purifier detected', device);

  let data: Purifier;
  device.setBuzzer(false);

  function setData(property: "aqi" | "temperature" | "humidity", value: number) {
    debug(property, value);
    data[property] = value;
    data.timestamp = timestamp();
  }

  device.on('temperatureChanged', v => {
    setData('temperature', v.value);
  });

  device.on('pm2.5Changed', v => {
    setData('aqi', v);
  });

  device.on('relativeHumidityChanged', v => {
    setData('humidity', v);
  });

  return {
    getData: function () {
      return data;
    },
    setMode: function (mode: mode) {
      return device.setMode(mode);
    }
  };
};
