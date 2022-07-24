export type parseOptions = {
    /**
     * The file that `code` was read from, used as
     * grammarSource.
     */
    filePath?: string | undefined;
};
/**
 * @typedef {object} parseOptions
 * @property {string} [filePath] The file that `code` was read from, used as
 *   grammarSource.
 */
/**
 * Parse Peggy text and return the format that eslint requires.
 *
 * @param {string} code The Peggy grammar.
 * @param {parseOptions} [options={}] Options for parsing.
 * @returns {import("eslint").Linter.ESLintParseResult}
 */
export function parseForESLint(code: string, options?: parseOptions | undefined): import("eslint").Linter.ESLintParseResult;
import Visitor = require("./visitor");
import visitorKeys = require("./visitor-keys");
export { Visitor, visitorKeys };
