const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");
const fetch = require("node-fetch");

import {
  host,
  controlPort,
  controlHttpRoute,
  controlWsRoute,
  appPort,
  appHttpRoute,
  appWsRoute
} from "./config";

const app = express();
const wsApp = expressWs(app);

// server up files in public folder to root
app.use(express.static("public"));
// used to parse body with req.body
app.use(express.json());

const fetchWith = (method, data) => {
  return fetch(`http://${host}${appPort}${appHttpRoute}`, {
    method: method,
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(resp => resp.json());
};

// Respond to GET request
app.get(controlHttpRoute, function(req, res) {
  console.log("GET:", req.body);
  fetch(`http://${host}${appPort}${appHttpRoute}`)
    .then(resp => resp.json())
    .then(resp => res.json(resp));
});

// Respond to POST request:
app.post(controlHttpRoute, function(req, res) {
  console.log("POST:", req.body);
  fetchWith("POST", req.body).then(resp => res.json(resp));
});

// Respond to a PUT request:
app.put(controlHttpRoute, function(req, res) {
  console.log("PUT:", req.body);
  fetchWith("PUT", req.body).then(resp => res.json(resp));
});

// Respond to a PATCH request:
app.patch(controlHttpRoute, function(req, res) {
  console.log("PATCH:", req.body);
  fetchWith("PATCH", req.body).then(resp => res.json(resp));
});

// Respond to a DELETE request:
app.delete(controlHttpRoute, function(req, res) {
  console.log("DELETE:", req.body);
  fetchWith("DELETE", req.body).then(resp => res.json(resp));
});

const wss = wsApp.getWss(controlWsRoute);

app.ws(controlWsRoute, (ws, req) => {
  console.log("Control Socket Connected");
  ws.send("ws from Control Server");

  let wsAppServer = new WebSocket(`ws://${host}${appPort}${appWsRoute}`);

  wsAppServer.onerror = e => {
    console.log("Error connecting to app server:", e.message);
  };

  wsAppServer.on("open", function open() {
    wsAppServer.send("control->app");
  });

  // respond to app server
  wsAppServer.on("message", function incoming(data) {
    console.log("From App Server:", data + "->control");
    ws.send(`From App Server: ${data}->control->client`);
  });

  // broadcast to other clients (optional)
  ws.onmessage = msg => {
    console.log("received: %s", msg.data);
    wss.clients.forEach(client => {
      if (client !== ws) {
        client.send(msg.data);
      }
    });
  };
});

app.listen(controlPort, () => {
  console.log(`Server listening on port: ${controlPort}`);
});
