"use strict";

const { ESLint } = require("eslint");
const assert = require("assert");
const path = require("path");
const test = require("node:test");
const { parseForESLint } = require("../lib/index");

test("parse", async() => {
  const esl = new ESLint({
    cwd: path.join(__dirname, "fixtures"),
    overrideConfig: {
      parser: path.join(__dirname, "..", "lib", "index.js"),
    },
  });
  const report = await esl.lintFiles(["fizzbuzz.peggy"]);
  assert(report);
  assert.equal(report.length, 1);
  assert.equal(report[0].errorCount, 0);
  assert.equal(report[0].warningCount, 0);
  assert.deepEqual(report[0].messages, []);
  assert.deepEqual(report[0].suppressedMessages, []);
});

test("error", () => {
  assert.throws(() => parseForESLint("foo='"), /SyntaxError: Expected/);
  assert.throws(
    () => parseForESLint("foo='", { filePath: "bar" }),
    /File: "bar"/
  );
});
