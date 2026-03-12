import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Security-focused rules
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-proto": "error",
      "eqeqeq": ["error", "always"],
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
    },
  },
  {
    // Test files can use test globals
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
