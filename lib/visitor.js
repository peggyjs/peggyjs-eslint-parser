"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const AST = require("./ast");
/**
 * Visit some or all of the nodes in an AST.
 */
class Visitor {
    /**
     * Create an instance.
     */
    constructor(functions) {
        this.functions = functions;
        this.star = this.functions["*"];
        this.starExit = this.functions["*:exit"];
    }
    /**
     * Visit each node, applying any visitor functions found in our function map.
     */
    visit(node, opts) {
        let parentResult = opts?.parentResult;
        if (this.star) {
            parentResult = this.star(node, opts);
        }
        const enterFun = this.functions[node.type];
        if (enterFun) {
            parentResult = enterFun(node, opts);
        }
        const vk = AST.visitorKeys[node.type];
        for (const name of vk) {
            // @ts-expect-error Can't access objects by name in TS?
            const child = node[name];
            if ((child !== null) && (child !== undefined)) {
                if (Array.isArray(child)) {
                    for (const c of child) {
                        this.visit(c, {
                            name,
                            parent: node,
                            array: true,
                            parentResult,
                        });
                    }
                }
                else {
                    this.visit(child, {
                        name,
                        parent: node,
                        array: false,
                        parentResult,
                    });
                }
            }
        }
        const exitFun = this.functions[`${node.type}:exit`];
        if (this.starExit || exitFun) {
            if (!opts) {
                opts = {
                    name: undefined,
                    parent: undefined,
                    array: false,
                    parentResult: undefined,
                };
            }
            opts.thisResult = parentResult;
            if (exitFun) {
                opts.thisResult = parentResult;
                exitFun(node, opts);
            }
            if (this.starExit) {
                this.starExit(node, opts);
            }
        }
    }
}
exports.Visitor = Visitor;
Visitor.visitorKeys = AST.visitorKeys;
