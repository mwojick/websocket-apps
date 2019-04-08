const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");
const rp = require("request-promise");

import { root } from "./config";

const app = express();
expressWs(app);
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
  const d = new Date();
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  if (connections) {
    let promises = [];
    const connValues = Object.values(connections);
    connValues.forEach(con => {
      let promise = fetchWith(con.url, method, con);
      promises.push(promise);
    });
    Promise.all(promises).then(resp => {
      res.json(
        [`Port ${port} is good (${method}) ; time: ${time}`].concat(resp)
      );
    });
  } else {
    res.json(`Port ${port} is good (${method}) [END] ; time: ${time}`);
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

app.ws(root, (ws, req) => {
  console.log("Socket Connected, Port:", port);

  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);

    const connections = data.connections;
    if (connections) {
      let promises = [];
      const connValues = Object.values(connections);

      connValues.forEach(con => {
        let promise = new Promise((res, rej) => {
          let wsNext = new WebSocket(`ws://${con.url}`);
          wsNext.onerror = e => {
            console.log("Error connecting to server:", e.message);
          };
          wsNext.on("open", () => {
            wsNext.send(JSON.stringify(con));
          });
          wsNext.on("message", msg => {
            res(JSON.parse(msg));
          });
        });
        promises.push(promise);
      });

      Promise.all(promises).then(resp => {
        ws.send(JSON.stringify([`Port ${port} is good (ws)`].concat(resp)));
      });
    } else {
      ws.send(JSON.stringify([`Port ${port} is good (ws)`]));
    }
  };
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
