import Monitor from "./monitor";
import express from "express";

/* This module is really just for publishing data to home assistant. */

const port = 3000;

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.text());

process.on("uncaughtException", function (exception) {
  console.log(exception);
});

console.log(__dirname + "/../");
app.use(express.static(__dirname + "/../"));
app.use(express.static(__dirname + "/../../ui"));

const monitor = new Monitor(3, true);

app.get("/monitor", async function (_req, res) {
  const is_on = monitor.get();
  res.send(is_on ? "ON" : "OFF");
});

app.post("/monitor", async function (req, res) {
  const is_on = req.body === "ON";
  console.log("Got post request", { is_on });
  monitor.set(is_on);
  res.send("Ran set " + is_on);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
