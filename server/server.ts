import express from 'express';
import socket_io from 'socket.io';
import http0 from 'http';
import monitor from './monitor';
const debug = require('debug')('smart-home:server');

const app = express();
const http = new http0.Server(app);
const io = socket_io(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../ui'));

function onConnection(socket: socket_io.Socket) {
  // TODO: better type to match UI
  socket.on('toggle-power', function () {
    monitor.toggle();
  });
}

export default {
  start: function () {
    io.on('connection', onConnection);
    http.listen(port, () => debug('listening on port ' + port));
  },
  // TODO: better types
  broadcast: function (event: string, data: object) {
    io.emit(event, data);
  },
};
