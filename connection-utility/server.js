const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");
const rp = require("request-promise");

import { host, root, appPort } from "./config";

const app = express();
const wsApp = expressWs(app);
const port = parseInt(process.argv[2]);

// server up files in dist folder to root
if (port === 80) {
  app.use(express.static("dist"));
}
// used to parse body with req.body
app.use(express.json());

const fetchWith = (url, method, data) => {
  const options = {
    method: method,
    uri: `http://${url}`,
    body: data,
    json: true // Automatically stringifies the body to JSON
  };
  return rp(options);
};

const handleReq = (method, req, res) => {
  const body = req.body;
  const connections = body.connections;
  if (connections) {
    let promises = [];
    const connValues = Object.values(connections);
    console.log("connValues:", connValues);
    connValues.forEach(con => {
      let promise = fetchWith(con.url, method, con);
      promises.push(promise);
    });
    Promise.all(promises).then(resp => {
      res.json([`port ${port} is good (${method})`].concat(resp));
    });
  } else {
    res.json(`port ${port} is good (${method}) [END]`);
  }
};

// Respond to GET request
// app.get(root + "get", function(req, res) {
//   console.log("GET:", req.body);
//   fetch(`http://${host}${appPort}/get`)
//     .then(resp => resp.json())
//     .then(resp => res.json(resp));
// });

// Respond to POST request:
app.post(root, function(req, res) {
  handleReq("POST", req, res);
});

// Respond to a PUT request:
app.put(root, function(req, res) {
  handleReq("PUT", req, res);
});

// Respond to a PATCH request:
app.patch(root, function(req, res) {
  handleReq("PATCH", req, res);
});

// Respond to a DELETE request:
app.delete(root, function(req, res) {
  handleReq("DELETE", req, res);
});

// get all ws clients connected to this app (for broadcast)
const wss = wsApp.getWss(root);

app.ws(root, (ws, req) => {
  console.log("Control Socket Connected");
  ws.send("ws from Server");

  let wsNext = new WebSocket(`ws://${host}${appPort}`);

  wsNext.onerror = e => {
    console.log("Error connecting to app server:", e.message);
  };

  wsNext.on("open", function open() {
    wsNext.send("control->app");
  });

  wsNext.on("message", function incoming(data) {
    ws.send(`From Server: ${JSON.parse(data)}`);
  });

  // broadcast to other clients (optional)
  ws.onmessage = msg => {
    console.log("received: %s", JSON.parse(msg.data));

    // wss.clients.forEach(client => {
    //   if (client !== ws) {
    //     client.send(msg.data);
    //   }
    // });
  };
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
