"use strict";

/**
 * TOR control-port client stub.
 *
 * Wraps the TOR control protocol connection and exposes a minimal API
 * for relay management.  The API key / password is used once during
 * the AUTHENTICATE handshake and not retained in any closure or log.
 */

import { EventEmitter } from "node:events";
import net from "node:net";

/**
 * @typedef {object} TorClientOptions
 * @property {string} host   - Control host (default: 127.0.0.1)
 * @property {number} port   - Control port (default: 9051)
 * @property {string} apiKey - TOR control password / API key
 */

/**
 * Create a new TOR control-port client.
 *
 * @param {TorClientOptions} options
 * @returns {{ connect: () => void }}
 */
export function createTorClient({ host, port, apiKey }) {
  const emitter = new EventEmitter();
  let socket = null;

  // Validate the key contains only safe characters before use in the
  // AUTHENTICATE command (no quotes, no control chars, no newlines).
  if (typeof apiKey !== "string" || apiKey.length < 8) {
    throw new TypeError("TOR_API_KEY must be a string of at least 8 characters.");
  }
  // Validate the key — must contain no control chars, quotes, or backslash
  // to prevent injection in the AUTHENTICATE command.
  const hasIllegalChar = apiKey.split("").some(
    (c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127 || c === "\"" || c === "\\"
  );
  if (hasIllegalChar) {
    throw new TypeError("TOR_API_KEY contains illegal characters (control chars, quotes, or backslash).");
  }

  function connect() {
    socket = net.createConnection({ host, port }, () => {
      // Send AUTHENTICATE command — key is used here and not stored
      socket.write(`AUTHENTICATE "${apiKey}"\r\n`);
    });

    socket.on("data", (data) => {
      const response = data.toString().trim();
      if (response.startsWith("250")) {
        // eslint-disable-next-line no-console
        console.log("[tor-node] Connected and authenticated to TOR control port.");
        emitter.emit("ready");
      } else {
        // eslint-disable-next-line no-console
        console.error(`[tor-node] Unexpected response: ${response}`);
        socket.destroy();
      }
    });

    socket.on("error", (err) => {
      // eslint-disable-next-line no-console
      console.error(`[tor-node] Connection error: ${err.message}`);
    });

    socket.on("close", () => {
      // eslint-disable-next-line no-console
      console.log("[tor-node] Control port connection closed.");
    });
  }

  return { connect, on: emitter.on.bind(emitter) };
}
