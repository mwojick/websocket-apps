const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");

const app = express();
const wsApp = expressWs(app);

const host = "localhost";

app.use(express.static("public"));

const wss = wsApp.getWss("/ws-cont");

// Respond to GET request
app.get("/http-req", function(req, res) {
  res.send("Got a GET request");
});

// Respond to POST request:
app.post("/http-req", function(req, res) {
  res.send("Got a POST request");
});

// Respond to a PUT request:
app.put("/http-req", function(req, res) {
  res.send("Got a PUT request");
});

// Respond to a PATCH request:
app.patch("/http-req", function(req, res) {
  res.send("Got a PATCH request");
});

// Respond to a DELETE request:
app.delete("/http-req", function(req, res) {
  res.send("Got a DELETE request");
});

app.ws("/ws-cont", (ws, req) => {
  console.log("Socket Connected");
  ws.send("From Control Server");

  let wsAppServer = new WebSocket(`ws://${host}:9080/ws-app`);

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

  // broadcast to other clients
  ws.onmessage = msg => {
    console.log("received: %s", msg.data);
    wss.clients.forEach(client => {
      if (client !== ws) {
        client.send(msg.data);
      }
    });
  };
});

const port = 80;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
