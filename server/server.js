const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const child_process = require('child_process');

app.use(express.static(__dirname + '/../ui'));

function onConnection(socket){
  console.log('socket.io client connected');
// TODO: cleanup
//  socket.on('drawing', (data) => {
//    let arg = '';
//    if (data) {
//      arg += ' 1';
//    }
//    let cmd = __dirname + '/onoff.js' + arg;
//    console.log(cmd);
//    child_process.exec(cmd);
//  });
}

module.exports = {
  start: function () {
    io.on('connection', onConnection);
    http.listen(port, () => console.log('listening on port ' + port));
  },
  broadcast: function (event, data) {
    io.emit(event, data);
  },
};
