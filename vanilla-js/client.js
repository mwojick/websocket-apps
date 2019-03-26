//Establish a WebSocket connection to the echo server
const ws = new WebSocket("ws://localhost:3210", ["json", "xml"]);

// Add a listener that will be triggered when the WebSocket is ready to use
ws.addEventListener("open", () => {
  console.log("opened");

  const data = { message: "Hello from the client!" };
  const json = JSON.stringify(data);
  // Send the message to the WebSocket server
  ws.send(json);
});

// Add a listener in order to process WebSocket messages received from the server
ws.addEventListener("message", event => {
  // The `event` object is a typical DOM event object, and the message data sent
  // by the server is stored in the `data` property

  const data = JSON.parse(event.data);
  console.log(data);
});
