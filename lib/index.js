"use strict";

const { parse } = require("./parser");

const RESERVED_WORDS = [
  // Reserved keywords as of ECMAScript 2015
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  // "yield", // encountered twice on the web page

  // Special constants
  "null",
  "true",
  "false",

  // These are always reserved:
  "enum",

  // The following are only reserved when they are found in strict mode code
  // Peggy generates code in strictly mode, so it applicable to it
  "implements",
  "interface",
  "let",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "yield",

  // The following are only reserved when they are found in module code:
  "await",
];

const visitorKeys = {
  Program: ["body"],
  grammar: ["topLevelInitializer", "initializer", "rules"],
  top_level_initializer: ["value"],
  initializer: ["value"],
  rule: ["name", "equals", "expression"],
  named: ["expression"],
  choice: ["alternatives"],
  action: ["expression", "code"],
  sequence: ["elements"],
  labeled: ["name", "expression"],
  text: ["expression"],
  simple_and: ["expression"],
  simple_not: ["expression"],
  optional: ["expression"],
  zero_or_more: ["expression"],
  one_or_more: ["expression"],
  group: ["expression"],
  semantic_and: ["value"],
  semantic_not: ["value"],
  rule_ref: [],
  literal: [],
  class: [],
  any: [],
};

function parseForESLint(code, options) {
  try {
    const ast = parse(code, {
      grammarSource: options.filePath,
      reservedWords: RESERVED_WORDS,
    });

    return {
      ast,
      visitorKeys,
    };
  } catch (ex) {
    ex.message += `  File: "${ex.location.source}"`;
    ex.lineNumber = ex.location.start.line;
    ex.column = ex.location.start.column;
    throw ex;
  }
}

module.exports = {
  parseForESLint,
};
