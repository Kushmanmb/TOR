"use strict";

/**
 * TOR Node — entry point
 *
 * Loads configuration from environment variables and starts the TOR
 * control-port client.  The TOR_API_KEY is consumed here and NEVER
 * logged or persisted beyond the process lifetime.
 */

import "dotenv/config";
import { createTorClient } from "./tor-client.js";

const {
  TOR_API_KEY,
  TOR_CONTROL_HOST = "127.0.0.1",
  TOR_CONTROL_PORT = "9051",
} = process.env;

if (!TOR_API_KEY) {
  // eslint-disable-next-line no-console
  console.error("[tor-node] TOR_API_KEY is not set. Copy .env.example to .env and fill in your values.");
  process.exit(1);
}

const client = createTorClient({
  host: TOR_CONTROL_HOST,
  port: parseInt(TOR_CONTROL_PORT, 10),
  apiKey: TOR_API_KEY,
});

client.connect();
