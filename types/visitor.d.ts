export = Visitor;
/**
 * @typedef {{[id: string]: Node?}} AnyNode
 */
/**
 * @typedef {import("estree").BaseNodeWithoutComments & AnyNode} Node
 */
/**
 * @typedef {object} VisitorOptions
 * @property {string} [name]
 * @property {Node} [parent]
 * @property {boolean} array
 * @property {unknown} [parentResult]
 * @property {unknown} [thisResult]
 */
/**
 * @callback VisitorFunction
 * @param {Node} node
 * @param {VisitorOptions} [opts]
 */
/**
 * @typedef {{[name: string]: VisitorFunction}} VisitorFunctionMap
 */
/**
 * Visit some or all of the nodes in an AST.
 */
declare class Visitor {
    /**
     * Create an instance.
     *
     * @param {VisitorFunctionMap} functions
     */
    constructor(functions: VisitorFunctionMap);
    functions: VisitorFunctionMap;
    star: VisitorFunction;
    starExit: VisitorFunction;
    /**
     * Visit each node, applying any visitor functions found in our function map.
     *
     * @param {Node} node
     * @param {VisitorOptions} [opts]
     */
    visit(node: Node, opts?: VisitorOptions | undefined): void;
}
declare namespace Visitor {
    export { AnyNode, Node, VisitorOptions, VisitorFunction, VisitorFunctionMap };
}
type VisitorFunctionMap = {
    [name: string]: VisitorFunction;
};
type VisitorFunction = (node: Node, opts?: VisitorOptions | undefined) => any;
type Node = import("estree").BaseNodeWithoutComments & AnyNode;
type VisitorOptions = {
    name?: string | undefined;
    parent?: Node | undefined;
    array: boolean;
    parentResult?: unknown;
    thisResult?: unknown;
};
type AnyNode = {
    [id: string]: Node | null;
};
