"use strict";

const assert = require("assert");

const {
  parseForESLint,
  Visitor,
} = require("../lib/index");
const test = require("node:test");
const path = require("path");
const fs = require("fs").promises;

const filePath = path.join(__dirname, "fixtures", "fizzbuzz.peggy");

test("visit all", async() => {
  const source = await fs.readFile(filePath, "utf8");
  const { ast } = parseForESLint(source, { filePath });
  const v = new Visitor({
    "*": (node, opts) => {
      if (opts) {
        if (opts.array) {
          return [...opts.parentResult, opts.name, node.type];
        }
        return [...opts.parentResult, node.type];
      }
      return ["Program"];
    },
    "*:exit": (node, opts) => {
      node.path = opts?.thisResult?.join("/");
    },
  });
  v.visit(ast);

  // Manually visit, and make sure each node has a path.
  function testVisit(o) {
    if (typeof o === "object") {
      if (!o) {
        return;
      }
      if (Array.isArray(o)) {
        for (const child of o) {
          testVisit(child);
        }
      } else {
        if (typeof o.path !== "string") {
          console.log(o);
        }
        assert.equal(typeof o.path, "string");
        for (const [k, child] of Object.entries(o)) {
          if (k !== "loc") {
            testVisit(child);
          }
        }
      }
    }
  }
  // In case.
  // console.log(require("util").inspect(ast, { depth: Infinity, colors: process.stdout.isTTY }));
  testVisit(ast);
});

test("functions", async() => {
  const source = await fs.readFile(filePath, "utf8");
  const { ast } = parseForESLint(source, { filePath });

  const functions = [];
  function addFunction(predicate, params, body) {
    functions.push({
      predicate,
      params,
      body,
    });
  }
  const v = new Visitor({
    rule() {
      return {};
    },
    labeled(node, opts) {
      if (node.name) { // Not plucked
        opts.parentResult[node.name.value] = node.name;
      }
    },
    action(node, opts) {
      return { ...opts.parentResult };
    },
    "action:exit": (node, opts) => {
      addFunction(false, opts.thisResult, node.code);
    },
    "semantic_and:exit": (node, opts) => {
      addFunction(true, opts.thisResult, node.code);
    },
    "semantic_not:exit": (node, opts) => {
      addFunction(true, opts.thisResult, node.code);
    },
  });
  v.visit(ast);

  const src = functions.map(
    ({ params, body }, i) => `function peg$${i}(${Object.keys(params).join(", ")}) {${body.value}}`
  ).join("\n");
  assert.equal(src, `\
function peg$0(c) { return c.filter(fb => fb) }
function peg$1() { return }
function peg$2() { return }
function peg$3(fb) {
    currentNumber++;
    return fb;
  }
function peg$4(n) { return (n === currentNumber) && NUMS.every(d => n % d) }
function peg$5(f, b) { return f + b }
function peg$6() { return currentNumber % 3 }
function peg$7() { return currentNumber % 5 }
function peg$8(n) { return parseInt(n, 16) }
function peg$9(n) { return parseInt(n, 10) }
function peg$10(three) { return three * 3 }
function peg$11(two) { return two * 2}
function peg$12(one) {
  return -one;
}`);
});
