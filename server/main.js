const request = require('request');
const temperature = require('./temperature');
const server = require('./server');
const url = require('../shared/url').data;
const timestamp = require('./timestamp');
const socket = require('./socket');
const fs = require('fs');
const debug = require('debug')('smart-home:main');

process.on('uncaughtException', function (exception) {
  console.log(exception);
});

setInterval(function () {}, 1000);

(async function () {
const monitor = await require('./monitor')();
const purifier = await require('./purifier')('192.168.0.22', 10000);
const getTemperature = temperature.init(1000, 5);
const tvSocket = await socket({id: '1274756684f3ebb89107', key: '3a954c5db3c97828'});
const downHeatingSocket = await socket({id: '12747566807d3a493f6c', key: '25005fc4127ac363'});
const upHeatingSocket = await socket({id: '1274756684f3ebb897b5', key: 'da9c77e4545107c9'});

function readAndSend () {
  let data = {
    timestamp: timestamp(),
    temperature: getTemperature(),
    purifier: purifier.getData(),
    tvSocket: tvSocket.getData(),
    upHeating: upHeatingSocket.getData(),
    downHeating: downHeatingSocket.getData(),
  };
  debug('broadcast', data);
  server.broadcast('data', data);

  fs.appendFileSync('data.log', JSON.stringify(data) + '\n');
}

// "cron"
setInterval(async function() {
  async function setModeAndLog(mode) {
    debug('trying to set to', mode);
    try {
      await purifier.setMode(mode);
      debug(new Date(), 'setMode(' + mode +') succeeded');
    } catch (e) {
      debug(new Date(), 'setMode(' + mode + ')', e);
    }
  }

  let date = new Date();
  if (date.getHours() === 23 && date.getMinutes() === 0) {
    await setModeAndLog('silent');
    monitor.set(false);
  }

  if (date.getHours() === 9 && date.getMinutes() === 0) {
    await setModeAndLog('auto');
  }

  if (date.getHours() === 6 && date.getMinutes() === 0) {
    monitor.set(true);
  }
}, 10000);

// read every half-minute
setInterval(readAndSend, 30000);
readAndSend();

tvSocket.on('data', readAndSend);
upHeatingSocket.on('data', readAndSend);
downHeatingSocket.on('data', readAndSend);

server.start();
})();
