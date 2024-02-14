"use strict";
const mocha = require("eslint-plugin-mocha");

module.exports = [
  {
    ignores: [
      "coverage/**",
      "docs/**",
      "lib/**",
      "node_modules/**",
      "src/parser.d.ts",
      "src/parser.js",
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
  {
    files: ["test/**/*.js"],
    plugins: {
      mocha,
    },
    rules: {
      ...mocha.configs.recommended.rules,
      "mocha/no-mocha-arrows": "off",
    },
  },
];
