import Temperature from "./temperature";
import Socket from "./socket";
import fs from "fs";
import Purifier from "./purifier";
import { mode } from "miio";
import { Data } from "../shared/Data";
import Monitor from "./monitor";
import express from "express";
import socket_io from "socket.io";
import http0 from "http";
import { broadcast } from "../shared/const";

const debug = require("debug")("smart-home:main");

const app = express();
const http = new http0.Server(app);
const io = socket_io(http);
const port = process.env.PORT || 3000;

process.on("uncaughtException", function (exception) {
  console.log(exception);
});

console.log(__dirname + "/../");
app.use(express.static(__dirname + "/../"));
app.use(express.static(__dirname + "/../../ui"));

const monitor = new Monitor(3);
const purifier = new Purifier("192.168.0.22");
const temperature = new Temperature("28-0216252dbfee", 1000, 5);
const tvSocket = new Socket({
  id: "1274756684f3ebb89107",
  key: "3a954c5db3c97828",
});
const downHeatingSocket = new Socket({
  id: "12747566807d3a493f6c",
  key: "25005fc4127ac363",
});
const upHeatingSocket = new Socket({
  id: "1274756684f3ebb897b5",
  key: "da9c77e4545107c9",
});

// API for home assistant
app.get("/temperature", function (_req, res) {
  const result = temperature.get();
  if (result.data !== undefined) {
    // Round to half a degree
    result.data = Math.round(result.data * 2) / 2;
  }
  res.send(result);
  res.sendStatus(200);
});

function readAndSend() {
  let data: Data = {
    temperature: temperature.get(),
    purifier: purifier.getData(),
    tvSocket: tvSocket.getData(),
    upHeating: upHeatingSocket.getData(),
    downHeating: downHeatingSocket.getData(),
  };
  debug(broadcast, data);

  io.emit(broadcast, data);

  fs.appendFileSync("data.log", JSON.stringify(data) + "\n");
}

// "cron"
setInterval(async function () {
  async function setModeAndLog(mode: mode) {
    debug("trying to set to", mode);
    try {
      await purifier.setMode(mode);
      debug(new Date(), "setMode(" + mode + ") succeeded");
    } catch (e) {
      debug(new Date(), "setMode(" + mode + ")", e);
    }
  }

  let date = new Date();
  if (date.getHours() === 23 && date.getMinutes() === 0) {
    await setModeAndLog("silent");
    //    await monitor.set(false);
  }

  if (date.getHours() === 9 && date.getMinutes() === 0) {
    await setModeAndLog("auto");
  }

  if (date.getHours() === 6 && date.getMinutes() === 0) {
    //    await monitor.set(true);
  }
}, 10000);

// read every half-minute
setInterval(readAndSend, 30000);

tvSocket.onData(readAndSend);
upHeatingSocket.onData(readAndSend);
downHeatingSocket.onData(readAndSend);

io.on("connection", function (socket: socket_io.Socket) {
  // TODO: better type to match UI
  socket.on("toggle-power", function () {
    monitor.toggle();
  });

  readAndSend();
});
http.listen(port, () => debug("listening on port " + port));
