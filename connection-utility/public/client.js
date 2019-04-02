const host = "localhost:";

const controlPort = 80;
const controlHttpRoute = "/http-req";
const controlWsRoute = "/ws-con";

const fetchWith = (method, data) => {
  return fetch(`http://${host}${controlPort}${controlHttpRoute}`, {
    method: method,
    body: JSON.stringify({ content: data }),
    headers: { "Content-Type": "application/json" }
  }).then(resp => resp.json());
};

fetch(`http://${host}${controlPort}${controlHttpRoute}`)
  .then(resp => resp.json())
  .then(console.log);

fetchWith("POST", "Got a POST request").then(console.log);
fetchWith("PUT", "Got a PUT request").then(console.log);
fetchWith("PATCH", "Got a PATCH request").then(console.log);
fetchWith("DELETE", "Got a DELETE request").then(console.log);

let ws;
const connect = () => {
  ws = new WebSocket(`ws://${host}${controlPort}${controlWsRoute}`);

  ws.addEventListener("open", function open() {
    ws.send("ws from Client");

    if (window.timerID) {
      window.clearInterval(window.timerID);
      window.timerID = null;
    }
  });

  ws.addEventListener("message", function incoming(event) {
    console.log(event.data);
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

connect();
