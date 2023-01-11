const { connectToKraken, validatePayload } = require("./test-helpers");

describe("Validate the schema of messages sent from Kraken", function () {
  test("the schema of a 'subscribe' response message on the 'book' channel is valid", function () {
    const ws = connectToKraken();

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          method: "subscribe",
          req_id: 34534536456,
          params: {
            channel: "book",
            snapshot: false,
            symbol: ["BTC/USD"],
          },
        })
      );
    });

    return expect(
      validatePayload(
        ws,
        (payload) =>
          payload.method === "subscribe" && payload.result?.channel === "book"
      )
    ).resolves.toBeTruthy();
  });

  test("the schema of an 'update' message on the 'book' channel is valid", function () {
    const ws = connectToKraken();

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          method: "subscribe",
          req_id: 34534536456,
          params: {
            channel: "book",
            snapshot: false,
            symbol: ["BTC/USD"],
          },
        })
      );
    });

    return expect(
      validatePayload(
        ws,
        (payload) => payload.channel === "book" && payload.type === "update"
      )
    ).resolves.toBeTruthy();
  });

  test("the schema of a 'snapshot' message on the 'book' channel is valid", function () {
    const ws = connectToKraken();

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          method: "subscribe",
          req_id: 34534536456,
          params: {
            channel: "book",
            snapshot: true,
            symbol: ["BTC/USD"],
          },
        })
      );
    });

    return expect(
      validatePayload(
        ws,
        (payload) => payload.channel === "book" && payload.type === "snapshot"
      )
    ).resolves.toBeTruthy();
  });
});
