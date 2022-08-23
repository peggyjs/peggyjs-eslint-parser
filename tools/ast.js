#!/usr/bin/env node
"use strict";

const { parse } = require("../lib/parser");
const fs = require("fs");
const util = require("util");

const grammarSource = process.argv[2];
const text = fs.readFileSync(grammarSource, "utf8");

try {
  console.log(util.inspect(parse(text, {
    grammarSource,
  }), {
    depth: Infinity,
    colors: process.stdout.isTTY,
  }));
} catch (er) {
  if (er.format) {
    console.log(er.format([{ source: grammarSource, text }]));
  } else {
    throw er;
  }
}
