import * as AST from "./ast";
import type eslint from "eslint";

type Keys = AST.NodeTypes;
type KeysExit = `${Keys}:exit`;
type FunctionNames = Keys | KeysExit | "*:exit" | "*";

interface VisitorOptions<T> {
  name?: string;
  parent?: AST.Node;
  array: boolean;
  parentResult?: T;
  thisResult?: T;
}

type VisitorFunction<T> =
  (node: AST.Node, opts?: VisitorOptions<T>) => T | undefined;

type VisitorFunctionMap<T> = {
  [key in FunctionNames]?: VisitorFunction<T>;
};

/**
 * Visit some or all of the nodes in an AST.
 */
export class Visitor<T> {
  public static visitorKeys: eslint.SourceCode.VisitorKeys = AST.visitorKeys;

  private functions: VisitorFunctionMap<T>;

  private star?: VisitorFunction<T>;

  private starExit?: VisitorFunction<T>;

  /**
   * Create an instance.
   */
  public constructor(functions: VisitorFunctionMap<T>) {
    this.functions = functions;
    this.star = this.functions["*"];
    this.starExit = this.functions["*:exit"];
  }

  /**
   * Visit each node, applying any visitor functions found in our function map.
   */
  public visit(node: AST.Node, opts: VisitorOptions<T>): void {
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
      const child = node[name] as AST.Node;
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
