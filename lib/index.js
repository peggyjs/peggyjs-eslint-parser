"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseForESLint = exports.visitor = void 0;
const visitor = require("./visitor.js");
exports.visitor = visitor;
const parser_js_1 = require("./parser.js");
function isSytnaxError(er) {
    return er instanceof parser_js_1.SyntaxError;
}
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
 * Parse Peggy text and return the format that eslint requires.
 */
function parseForESLint(code, options = {}) {
    try {
        const ast = (0, parser_js_1.parse)(code, {
            grammarSource: options.filePath,
            reservedWords: RESERVED_WORDS,
        });
        return {
            ast,
            visitorKeys: visitor.Visitor.visitorKeys,
        };
    }
    catch (ex) {
        if (isSytnaxError(ex)) {
            if (ex.location?.source) {
                ex.message += `  File: "${ex.location.source}"`;
            }
            // @ts-expect-error Make it compatible with eslint
            ex.lineNumber = ex.location?.start?.line;
            // @ts-expect-error Make it compatible with eslint
            ex.column = ex.location?.start?.column;
        }
        throw ex;
    }
}
exports.parseForESLint = parseForESLint;
