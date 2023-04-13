"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseForESLint = exports.visitor = void 0;
const visitor = __importStar(require("./visitor"));
exports.visitor = visitor;
const parser_1 = require("./parser");
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
    // Special constants
    "null",
    "true",
    "false",
    // These are always reserved:
    "enum",
    // The following are only reserved when they are found in strict mode code
    // Peggy generates code in strict mode, so they are applicable
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
    // The following are reserved as future keywords by ECMAScript 1..3
    // specifications, but not any more in modern ECMAScript. We don't need these
    // because the code-generation of Peggy only targets ECMAScript >= 5.
    //
    // - abstract
    // - boolean
    // - byte
    // - char
    // - double
    // - final
    // - float
    // - goto
    // - int
    // - long
    // - native
    // - short
    // - synchronized
    // - throws
    // - transient
    // - volatile
    // These are not reserved keywords, but using them as variable names is problematic.
    "arguments",
    "eval", // Redeclaring eval() is prohibited in strict mode
    // A few identifiers have a special meaning in some contexts without being
    // reserved words of any kind. These we don't need to worry about as they can
    // all be safely used as variable names.
    //
    // - as
    // - async
    // - from
    // - get
    // - of
    // - set
];
/**
 * Parse Peggy text and return the format that eslint requires.
 */
function parseForESLint(code, options = {}) {
    try {
        const ast = (0, parser_1.parse)(code, {
            grammarSource: options.filePath,
            reservedWords: RESERVED_WORDS,
        });
        return {
            ast: ast,
            visitorKeys: visitor.Visitor.visitorKeys,
        };
    }
    catch (ex) {
        if (ex instanceof parser_1.PeggySyntaxError) {
            if (options.filePath) {
                ex.message = ex.format([{
                        source: options.filePath,
                        text: code,
                    }]);
            }
            // @ts-expect-error Extending type
            ex.lineNumber = ex.location?.start?.line;
            // @ts-expect-error Extending type
            ex.column = ex.location?.start?.column;
        }
        throw ex;
    }
}
exports.parseForESLint = parseForESLint;
