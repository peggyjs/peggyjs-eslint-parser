import * as AST from "./ast";
import type eslint from "eslint";
declare type Keys = AST.NodeTypes;
declare type KeysExit = `${Keys}:exit`;
declare type FunctionNames = Keys | KeysExit | "*:exit" | "*";
interface VisitorOptions<T> {
    name?: string;
    parent?: AST.Node;
    array: boolean;
    parentResult?: T;
    thisResult?: T;
}
declare type VisitorFunction<T> = (node: AST.Node, opts?: VisitorOptions<T>) => T | undefined;
declare type VisitorFunctionMap<T> = {
    [key in FunctionNames]?: VisitorFunction<T>;
};
/**
 * Visit some or all of the nodes in an AST.
 */
export declare class Visitor<T> {
    static visitorKeys: eslint.SourceCode.VisitorKeys;
    private functions;
    private star?;
    private starExit?;
    /**
     * Create an instance.
     */
    constructor(functions: VisitorFunctionMap<T>);
    /**
     * Visit each node, applying any visitor functions found in our function map.
     */
    visit(node: AST.Node, opts: VisitorOptions<T>): void;
}
export {};
