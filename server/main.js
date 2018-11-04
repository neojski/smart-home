const request = require('request');
const temperature = require('./temperature');
const server = require('./server');
const url = require('../shared/url').data;
const timestamp = require('./timestamp');
const socket = require('./socket');
const fs = require('fs');

const purifier = require('./purifier')('192.168.0.22', 10000);
const getTemperature = temperature.init(1000, 5);
const tvSocket = socket({id: '1274756684f3ebb89107', key: '3a954c5db3c97828'});
const downHeatingSocket = socket({id: '12747566807d3a493f6c', key: '25005fc4127ac363'});
const upHeatingSocket = socket({id: '1274756684f3ebb897b5', key: 'da9c77e4545107c9'});

function readAndSend () {
  let data = {
    timestamp: timestamp(),
    temperature: getTemperature(),
    purifier: purifier.getData(),
    tvSocket: tvSocket.getData(),
    upHeating: upHeatingSocket.getData(),
    downHeating: downHeatingSocket.getData(),
  };
  console.log('broadcast', data);
  server.broadcast('data', data);

  fs.appendFileSync('data.log', JSON.stringify(data) + '\n');
}

// Purifier "cron"
setInterval(function() {
  function setModeAndLog(mode) {
    console.log('trying to set to', mode);
    purifier.setMode(mode)
      .then(() => console.log(new Date(), 'setMode(' + mode +') succeeded'))
      .catch((e) => console.error(new Date(), 'setMode(' + mode + ')', e));
  }

  let date = new Date();
  if (date.getHours() === 23 && date.getMinutes() === 0) {
    setModeAndLog('silent');
  }

  if (date.getHours() === 9 && date.getMinutes() === 0) {
    setModeAndLog('auto');
  }
}, 10000);

// read every half-minute
setInterval(readAndSend, 30000);
readAndSend();

tvSocket.on('data', readAndSend);
upHeatingSocket.on('data', readAndSend);
downHeatingSocket.on('data', readAndSend);

server.start();
