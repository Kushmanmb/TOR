#!/usr/bin/env node
/**
 * validate-tor-key.js
 *
 * Reads TOR_API_KEY from the environment and validates its format.
 * This script is intentionally minimal so that the secret is never
 * written to stdout, log files, or the filesystem.
 *
 * Exit codes:
 *   0 — key is valid
 *   1 — key is missing or malformed
 */

"use strict";

const key = process.env.TOR_API_KEY;

if (!key) {
  process.stderr.write("ERROR: TOR_API_KEY environment variable is not set.\n");
  process.exit(1);
}

// Basic sanity checks — must be non-empty and contain no whitespace
if (/\s/.test(key)) {
  process.stderr.write("ERROR: TOR_API_KEY must not contain whitespace.\n");
  process.exit(1);
}

// Minimum sensible length for a control password
if (key.length < 8) {
  process.stderr.write("ERROR: TOR_API_KEY is too short (minimum 8 characters).\n");
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(`TOR_API_KEY validation passed (${key.length} chars, no whitespace).`);
process.exit(0);
