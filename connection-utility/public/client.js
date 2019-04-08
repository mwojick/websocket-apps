import { host, nginxPort, httpConnections, wsConnections } from "../config";

const fetchWith = method => {
  return fetch(`http://${host}${nginxPort}`, {
    method: method,
    body: JSON.stringify(httpConnections),
    headers: { "Content-Type": "application/json" }
  }).then(resp => resp.json());
};

// fetch(`http://${host}${nginxPort}/get`)
//   .then(resp => resp.json())
//   .then(console.log);

fetchWith("POST").then(console.log);
fetchWith("PUT").then(console.log);
fetchWith("PATCH").then(console.log);
fetchWith("DELETE").then(console.log);

let ws;
const connect = () => {
  ws = new WebSocket(`ws://${host}${nginxPort}`);

  ws.addEventListener("open", function open() {
    ws.send(JSON.stringify(wsConnections));

    if (window.timerID) {
      window.clearInterval(window.timerID);
      window.timerID = null;
    }
  });

  ws.addEventListener("message", function incoming(event) {
    console.log("ws Data: ", JSON.parse(event.data));
  });

  // handle disconnect
  ws.addEventListener("close", function close() {
    console.log("disconnected");
    ws = null;
    // Avoid firing a new setInterval, after one has been done
    if (!window.timerID) {
      window.timerID = setInterval(function() {
        connect();
      }, 5000);
    }
  });
};
// ###################
// connect();
//
//
