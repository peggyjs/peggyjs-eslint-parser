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

function parseForESLint(code, options) {
  const ast = parse(code, {
    grammarSource: options.filePath,
    reservedWords: RESERVED_WORDS,
  });

  return {
    // Wrap a Program around the AST so that the
    // default ScopeManager doesn't choke.
    ast,
    visitorKeys: {
      Program: ["grammar"],
      grammar: ["topLevelInitializer", "initializer", "rules"],
      top_level_initializer: ["code"],
      initializer: ["code"],
      rule: ["name", "expression"],
      named: ["expression"],
      choice: ["alternatives"],
      action: ["code", "expression"],
      sequence: ["elements"],
      labeled: ["label", "expression"],
      text: ["expression"],
      simple_and: ["expression"],
      simple_not: ["expression"],
      optional: ["expression"],
      zero_or_more: ["expression"],
      one_or_more: ["expression"],
      group: ["expression"],
      semantic_and: ["code"],
      semantic_not: ["code"],
      rule_ref: [],
      literal: [],
      class: [],
      any: [],
    },
  };
}

module.exports = {
  parseForESLint,
};
