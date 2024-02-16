"use strict";

module.exports = [
  {
    ignores: [
      "coverage/**",
      "docs/**",
      "lib/**",
      "node_modules/**",
      "src/parser.d.ts",
      "src/parser.js",
      "test/fixtures/*.js",
    ],
  },
  require("@peggyjs/eslint-config/flat/js"),
  require("@peggyjs/eslint-config/flat/mocha"),
  require("@peggyjs/eslint-config/flat/ts"),
  {
    files: ["test/**", "tools/**"],
    languageOptions: {
      globals: require("@peggyjs/eslint-config/flat/globals").node,
      ecmaVersion: 2022,
      sourceType: "commonjs",
    },
  },
];
