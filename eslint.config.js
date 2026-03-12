import globals from "globals";
import js from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Enforce consistent use of strict equality
      eqeqeq: ["error", "always"],
      // Disallow eval() — security best practice
      "no-eval": "error",
      // Disallow implied eval (setTimeout with string, etc.)
      "no-implied-eval": "error",
      // Disallow use of __proto__
      "no-proto": "error",
      // Disallow assignments in conditions (common source of bugs)
      "no-cond-assign": ["error", "always"],
      // Warn on console usage in production paths
      "no-console": "warn",
      // Require const where variable is never reassigned
      "prefer-const": "error",
      // No unused variables
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // Enforce semicolons
      semi: ["error", "always"],
      // Enforce single quotes
      quotes: ["error", "double"],
    },
  },
  {
    // Ignore build artifacts, dependencies, and generated files
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
    ],
  },
];
