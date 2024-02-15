#!/usr/bin/env node
"use strict";

const { parse } = require("../lib/parser");
const fs = require("fs");
const util = require("util");
const { Visitor } = require("../lib/visitor.js");

const grammarSource = process.argv[2];
const text = fs.readFileSync(grammarSource, "utf8");

try {
  const node = parse(text, { grammarSource });
  const v = new Visitor({
    "*": n => {
      delete n.loc;
      delete n.range;
    },
  });
  v.visit(node);

  console.log(`\
/* eslint-disable @stylistic/array-bracket-spacing */
/* eslint-disable @stylistic/comma-dangle */
/* eslint-disable @stylistic/quotes */
/* eslint-disable @stylistic/operator-linebreak */
"use strict";
`);
  console.log("module.exports =", util.inspect(node, {
    depth: Infinity,
    maxArrayLength: Infinity,
    maxStringLength: Infinity,
    colors: process.stdout.isTTY,
  }) + ";");
} catch (er) {
  if (er.format) {
    console.log(er.format([{ source: grammarSource, text }]));
  } else {
    throw er;
  }
}
