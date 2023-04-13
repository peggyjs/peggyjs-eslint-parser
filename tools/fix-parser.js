"use strict";
const fs = require("fs");
const path = require("path");

const parser = path.resolve(__dirname, "..", "src", "parser.ts");
let src = fs.readFileSync(parser, "utf8");

src = src.replace(/grammarSource\?: string;/, "source?: any;");

fs.writeFileSync(parser, src, "utf8");
