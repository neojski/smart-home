const gpio = require('gpio');
const pin = 3;

let gpio3 = new Promise(function (resolve, reject) {
  let result = gpio.export(pin, {
    direction: 'out',
    ready: function () {
      resolve(result);
    },
  });
});

function toggle () {
  return gpio3.then((gpio3) => {
    gpio3.set(!gpio3.value);
  });
}

function set (b) {
  return gpio3.then((gpio3) => {
    gpio3.set(b);
  });
}

module.exports = {
  toggle,
  set
};
