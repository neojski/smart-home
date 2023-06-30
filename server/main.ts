import Temperature from "./temperature";
import Monitor from "./monitor";
import express from "express";

/* This module is really just for publishing data to home assistant. */

const debug = require("debug")("smart-home:main");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.text());

process.on("uncaughtException", function (exception) {
  console.log(exception);
});

console.log(__dirname + "/../");
app.use(express.static(__dirname + "/../"));
app.use(express.static(__dirname + "/../../ui"));

const monitor = new Monitor(3);
const temperature = new Temperature("28-0216252dbfee", 1000, 300);

// TODO: I think we should push the data instead
// API for home assistant
app.get("/temperature", function (_req, res) {
  const result = temperature.get();
  if (result.data !== undefined) {
    // Round to half a degree
    result.data = Math.round(result.data * 2) / 2;
  }
  res.send(result);
});

app.get("/monitor", async function (_req, res) {
  const is_on = await monitor.get();
  res.send(is_on ? "ON" : "OFF");
});

app.post("/monitor", async function (req, _res) {
  const is_on = req.body === "ON";
  monitor.set(is_on);
});
