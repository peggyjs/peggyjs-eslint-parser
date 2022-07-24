"use strict";
const visitorKeys = require("./visitor-keys");

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
class Visitor {
  /**
   * Create an instance.
   *
   * @param {VisitorFunctionMap} functions
   */
  constructor(functions) {
    this.functions = functions;
    this.star = this.functions["*"];
    this.starExit = this.functions["*:exit"];
  }

  /**
   * Visit each node, applying any visitor functions found in our function map.
   *
   * @param {Node} node
   * @param {VisitorOptions} [opts]
   */
  visit(node, opts) {
    let parentResult = opts?.parentResult;
    if (this.star) {
      parentResult = this.star(node, opts);
    }
    if (this.functions[node.type]) {
      parentResult = this.functions[node.type](node, opts);
    }

    const vk = visitorKeys[node.type] || [];
    for (const name of vk) {
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
        } else {
          this.visit(child, {
            name,
            parent: node,
            array: false,
            parentResult,
          });
        }
      }
    }
    const exit = `${node.type}:exit`;
    if (this.starExit || this.functions[exit]) {
      if (!opts) {
        opts = {
          name: undefined,
          parent: undefined,
          array: false,
          parentResult: undefined,
        };
      }
      opts.thisResult = parentResult;
      if (this.functions[exit]) {
        opts.thisResult = parentResult;
        this.functions[exit](node, opts);
      }
      if (this.starExit) {
        this.starExit(node, opts);
      }
    }
  }
}

module.exports = Visitor;
