"use strict";

module.exports = {
  root: true,
  extends: ["@peggyjs", "@peggyjs/eslint-config/typescript"],
  ignorePatterns: [
    "coverage/",
    "docs/",
    "lib/", // Generated
    "node_modules/",
    "src/parser.ts", // Generated
  ],
  overrides: [
    {
      files: ["*.js"],
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    {
      files: ["test/**/*.js"],
      extends: [
        "plugin:mocha/recommended",
      ],
      rules: {
        "mocha/no-mocha-arrows": "off",
      },
    },
  ],
};
