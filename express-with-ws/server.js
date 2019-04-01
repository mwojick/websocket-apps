const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server: server, path: "/ws-path" });

app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    // Broadcast to everyone else
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send("From Server");
});

const port = 3210;
server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
