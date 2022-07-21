"use strict";

module.exports = {
  root: true,
  extends: "@peggyjs",
  ignorePatterns: [
    "docs/",
    "lib/parser.js", // Generated
    "node_modules/",
  ],
  overrides: [
    {
      files: ["*.js"],
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
  ],
};
