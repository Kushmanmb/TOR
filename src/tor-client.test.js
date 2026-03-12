import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createTorClient } from "./tor-client.js";

describe("createTorClient", () => {
  it("throws if apiKey is not a string", () => {
    assert.throws(
      () => createTorClient({ host: "127.0.0.1", port: 9051, apiKey: 12345678 }),
      /must be a string/i
    );
  });

  it("throws if apiKey is shorter than 8 characters", () => {
    assert.throws(
      () => createTorClient({ host: "127.0.0.1", port: 9051, apiKey: "short" }),
      /at least 8 characters/i
    );
  });

  it("throws if apiKey contains a double-quote", () => {
    assert.throws(
      () => createTorClient({ host: "127.0.0.1", port: 9051, apiKey: 'validkey"x' }),
      /illegal characters/i
    );
  });

  it("throws if apiKey contains a backslash", () => {
    assert.throws(
      () => createTorClient({ host: "127.0.0.1", port: 9051, apiKey: "validkey\\x" }),
      /illegal characters/i
    );
  });

  it("throws if apiKey contains a control character", () => {
    assert.throws(
      () => createTorClient({ host: "127.0.0.1", port: 9051, apiKey: "validkey\x00" }),
      /illegal characters/i
    );
  });

  it("returns an object with connect and on methods for a valid key", () => {
    const client = createTorClient({ host: "127.0.0.1", port: 9051, apiKey: "validapikey123" });
    assert.equal(typeof client.connect, "function");
    assert.equal(typeof client.on, "function");
  });
});
