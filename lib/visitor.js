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
exports.Visitor = void 0;
const AST = __importStar(require("./ast"));
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
            // @ts-expect-error Can't get correct node type here
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
                // @ts-expect-error Something went wrong with the types.
                exitFun(node, opts);
            }
            if (this.starExit) {
                this.starExit(node, opts);
            }
        }
    }
}
Visitor.visitorKeys = AST.visitorKeys;
exports.Visitor = Visitor;
