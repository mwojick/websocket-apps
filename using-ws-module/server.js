const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3210 });

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
