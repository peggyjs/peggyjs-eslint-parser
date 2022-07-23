"use strict";

const { parse } = require("./parser");
const Visitor = require("./visitor");
const visitorKeys = require("./visitor-keys");

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

/**
 * @typedef {object} parseOptions
 * @property {string} filePath The file that `code` was read from, used as
 *   grammarSource.
 */

/**
 * Parse Peggy text and return the format that eslint requires.
 *
 * @param {string} code The Peggy grammar.
 * @param {parseOptions?} options Options for parsing.
 * @returns {import("eslint").Linter.ESLintParseResult}
 */
function parseForESLint(code, options = {}) {
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
    if (ex.location.source) {
      ex.message += `  File: "${ex.location.source}"`;
    }
    ex.lineNumber = ex.location.start.line;
    ex.column = ex.location.start.column;
    throw ex;
  }
}

module.exports = {
  parseForESLint,
  Visitor,
  visitorKeys,
};
