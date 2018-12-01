const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const monitor = require('./monitor');
const debug = require('debug')('smart-home:server');
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../ui'));

function onConnection(socket){
  socket.on('toggle-power', function () {
    monitor.toggle();
  });
}

module.exports = {
  start: function () {
    io.on('connection', onConnection);
    http.listen(port, () => debug('listening on port ' + port));
  },
  broadcast: function (event, data) {
    io.emit(event, data);
  },
};
