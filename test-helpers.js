const { WebSocket } = require("ws");
const AsyncApiValidator = require("asyncapi-validator");

/**
 * Creates a new WebSocket object that connects to the Kraken WebSocket API
 * @returns {WebSocket} The WebSocket object pointing to the Kraken WebSocket API
 */
function connectToKraken() {
  return new WebSocket("wss://ws.kraken.com/v2");
}

/**
 * Asynchronous function that will wait until a message matching the payloadCriteria
 * is sent and validate it before completing the Promise.
 * @param {WebSocket} ws The WebSocket object to listen to
 * @param {Function} payloadCriteria A function that takes a payload and returns a boolean determining whether the payload should be validated or not
 * @returns {Promise<boolean>} Promise that completes once a message has been validated. If `true`, the message was valid. Otherwise, the message was invalid
 */
async function validatePayload(ws, payloadCriteria) {
  const validator = await AsyncApiValidator.fromSource("asyncapi.yaml");

  return await new Promise((callback) => {
    ws.on("message", function (payload) {
      const parsedPayload = JSON.parse(payload);

      if (payloadCriteria(parsedPayload)) {
        try {
          const result = validator.validateByMessageId(
            "publishV2",
            parsedPayload
          );

          ws.close();
          callback(result);
        } catch {
          ws.close();
          callback(false);
        }
      }
    });
  });
}

module.exports = { connectToKraken, validatePayload };
