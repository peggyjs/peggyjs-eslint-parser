"use strict";
const visitorKeys = require("./visitor-keys");

class Visitor {
  constructor(functions) {
    this.functions = functions;
    this.star = this.functions["*"];
    this.starExit = this.functions["*:exit"];
  }

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
