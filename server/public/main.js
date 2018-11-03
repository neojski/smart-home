'use strict';

(function() {
  const socket = io();
  var state = true;
  document.addEventListener('mouseup', onMouseUp, false);
  function onMouseUp(e){
    state = !state;
    socket.emit('drawing', state);
  }
})();
