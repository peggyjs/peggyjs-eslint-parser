"use strict";

const assert = require("assert");

const {
  parseForESLint,
  visitor,
} = require("../lib/index");
const AST = require("../lib/ast");

const path = require("path");
const fs = require("fs").promises;

const fizzbuzz = path.join(__dirname, "fixtures", "fizzbuzz.peggy");
const fizzbuzz_import = path.join(__dirname, "fixtures", "fizzbuzz_import.peggy");
const csv = path.join(__dirname, "fixtures", "csv.peggy");

async function checkVisit(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  const { ast } = parseForESLint(source, { filePath });
  const v = new visitor.Visitor({
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
      if (typeof node !== "object") {
        console.log("%o", opts);
        throw new Error("fail");
      }
      node.path = opts?.thisResult?.join("/");
    },
  });
  v.visit(ast);

  // If needed:
  // console.log(require("util").inspect(ast, {
  //   depth: Infinity,
  //   colors: process.stdout.isTTY,
  // }));

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
}

async function typeVisit(filePath, keyCounts) {
  // Hope to catch issues where the VisitorFunctionMap isn't complete
  // or has a typo.
  const source = await fs.readFile(filePath, "utf8");
  const { ast } = parseForESLint(source, { filePath });

  const stack = [];
  const keyFuncs = {
    // Star rules happen before specfic rules
    "*": node => {
      stack.push(node);
    },
    // Star-exit rules happen after specific rules.
    "*:exit": node => {
      stack.pop(node);
    },
  };
  Object.keys(AST.visitorKeys).forEach(k => {
    keyFuncs[k] = node => {
      assert.equal(node.type, k);
      assert.equal(stack[stack.length - 1], node); // NOT deep equal
      keyCounts[node.type]++;
    };
    keyFuncs[`${k}:exit`] = node => {
      assert.equal(node.type, k);
      assert.equal(stack[stack.length - 1], node); // NOT deep equal
      keyCounts[`${node.type}:exit`]++;
    };
    if (typeof keyCounts[k] === "undefined") {
      keyCounts[k] = 0;
    }
    if (typeof keyCounts[`${k}:exit`] === "undefined") {
      keyCounts[`${k}:exit`] = 0;
    }
  });

  const v = new visitor.Visitor(keyFuncs);
  v.visit(ast);
  assert.equal(stack.length, 0);
}

describe("visitor", () => {
  it("visits all in fizzbuzz.peggy", async() => {
    await checkVisit(fizzbuzz);
  });

  it("visits all in fizzbuzz_import.peggy", async() => {
    await checkVisit(fizzbuzz_import);
  });

  it("checks types ", async() => {
    const keyCounts = {};
    await typeVisit(fizzbuzz, keyCounts);
    await typeVisit(fizzbuzz_import, keyCounts);
    await typeVisit(csv, keyCounts);

    // Make sure that we actually hit all of the AST types
    for (const [k, v] of Object.entries(keyCounts)) {
      assert(v > 0, k);
    }
  });

  it("functions", async() => {
    const source = await fs.readFile(fizzbuzz, "utf8");
    const { ast } = parseForESLint(source, { filePath: fizzbuzz });

    const functions = [];
    function addFunction(predicate, params, body) {
      functions.push({
        predicate,
        params,
        body,
      });
    }
    const v = new visitor.Visitor({
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
});
