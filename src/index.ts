import * as visitor from "./visitor.js";
import { PeggySyntaxError, parse } from "./parser.js";
import type ESlint from "eslint";

export { visitor };

function isSytnaxError(er: any): er is PeggySyntaxError {
  return er instanceof PeggySyntaxError;
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
  "arguments", // Conflicts with a special variable available inside functions.
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

interface parseOptions {
  /**
   * The file that `code` was read from, used as grammarSource.
   */
  filePath?: string;
}

/**
 * Parse Peggy text and return the format that eslint requires.
 */
export function parseForESLint(code: string, options: parseOptions = {}):
  ESlint.Linter.ESLintParseResult {
  try {
    const ast = parse(code, {
      grammarSource: options.filePath,
      reservedWords: RESERVED_WORDS,
    });

    return {
      ast,
      visitorKeys: visitor.Visitor.visitorKeys,
    };
  } catch (ex) {
    if (isSytnaxError(ex)) {
      if (options.filePath) {
        ex.message = ex.format([{
          grammarSource: options.filePath,
          text: code,
        }]);
      }
      // @ts-expect-error Make it compatible with eslint
      ex.lineNumber = ex.location?.start?.line;
      // @ts-expect-error Make it compatible with eslint
      ex.column = ex.location?.start?.column;
    }
    throw ex;
  }
}
