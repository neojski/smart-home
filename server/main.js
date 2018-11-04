const request = require('request');
const temperature = require('./temperature');
const controls = require('./controls');
const url = require('../shared/url').data;
const timestamp = require('./timestamp');

const purifier = require('./purifier')('192.168.0.22', 10000);
const getTemperature = temperature.init(1000, 5);

function readAndSend () {
  var temperature = getTemperature();
  var purifierData = purifier.getData();

  let data = {
    timestamp: timestamp()
  };
  if (temperature != null) {
    console.log('got temperature', temperature);
    data.temperature = temperature;
  } else {
    console.error('temperature missing');
  }
  if (purifierData != null) {
    console.log('got purifier data', purifierData);
    data.purifier = purifierData;
  } else {
    console.error('temperature missing');
  }
  console.log('readAndSend: ');
  console.log(data);

  request.post({url, form: {data: JSON.stringify(data)}}, function (error, httpResponse, body) {
    // log?
  });
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

controls.start();
