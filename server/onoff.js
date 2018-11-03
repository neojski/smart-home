#!/usr/bin/env node
var gpio = require('gpio');

var gpio4 = gpio.export(3, {
  direction: 'out',
  ready: function () {
    var mode = (process.argv.length > 2) ? 1 : 0;
    gpio4.set(mode);
  }
});
