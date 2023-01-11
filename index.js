const { WebSocket } = require("ws");

const ws = new WebSocket("wss://ws.kraken.com/v2");

ws.on("open", function () {
  // Subscribe to the Book channel
  ws.send(
    JSON.stringify({
      method: "subscribe",
      params: {
        channel: "book",
        snapshot: false,
        symbol: ["BTC/USD"],
      },
    })
  );
});

ws.on("message", function (payload) {
  console.log(payload.toString());
});
