const express = require("express");
const expressWs = require("express-ws");

const app = express();
const wsApp = expressWs(app);

app.ws("/ws-app", (ws, req) => {
  console.log("Socket Connected");

  ws.onmessage = msg => {
    ws.send(msg.data);
    console.log("received: %s", msg.data);
  };
});

const port = 9080;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
