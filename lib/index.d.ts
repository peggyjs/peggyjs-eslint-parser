import * as visitor from "./visitor.js";
import type ESlint from "eslint";
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
export declare function parseForESLint(code: string, options?: parseOptions): ESlint.Linter.ESLintParseResult;
