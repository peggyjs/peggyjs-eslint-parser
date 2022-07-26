import * as visitor from "./visitor.js";
import type eslint from "eslint";
export { visitor };
interface parseOptions {
    /**
     * The file that `code` was read from, used as grammarSource.
     */
    filePath?: string;
}
/**
 * Parse Peggy text and return the format that eslint requires.
 */
export declare function parseForESLint(code: string, options?: parseOptions): eslint.Linter.ESLintParseResult;
