let ws;
const connect = () => {
  ws = new WebSocket("ws://localhost:3210");

  ws.addEventListener("open", function open() {
    ws.send("From Client");

    if (window.timerID) {
      window.clearInterval(window.timerID);
      window.timerID = null;
    }
  });

  ws.addEventListener("message", function incoming(event) {
    console.log(event.data);
  });

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
