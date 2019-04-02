const express = require("express");
const expressWs = require("express-ws");

import { appPort, appHttpRoute, appWsRoute } from "./config";

const app = express();
expressWs(app);
app.use(express.json());

// Respond to GET request
app.get(appHttpRoute, function(req, res) {
  console.log("GET:", req.body);
  res.json({ content: "Got a GET request" });
});

// Respond to POST request:
app.post(appHttpRoute, function(req, res) {
  console.log("POST:", req.body);
  res.send(req.body);
});

// Respond to a PUT request:
app.put(appHttpRoute, function(req, res) {
  console.log("PUT:", req.body);
  res.send(req.body);
});

// Respond to a PATCH request:
app.patch(appHttpRoute, function(req, res) {
  console.log("PATCH:", req.body);
  res.send(req.body);
});

// Respond to a DELETE request:
app.delete(appHttpRoute, function(req, res) {
  console.log("DELETE:", req.body);
  res.send(req.body);
});

app.ws(appWsRoute, (ws, req) => {
  console.log("App Socket Connected");

  ws.onmessage = msg => {
    ws.send(msg.data);
    console.log("received: %s", msg.data);
  };
});

app.listen(appPort, () => {
  console.log(`Server listening on port: ${appPort}`);
});
