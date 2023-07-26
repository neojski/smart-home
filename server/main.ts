import Monitor from "./monitor";
import express from "express";

/* This module is really just for publishing data to home assistant. */

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

app.get("/monitor", async function (_req, res) {
  const is_on = await monitor.get();
  res.send(is_on ? "ON" : "OFF");
});

app.post("/monitor", async function (req, _res) {
  const is_on = req.body === "ON";
  monitor.set(is_on);
});
