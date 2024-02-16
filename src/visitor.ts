/* eslint-disable @stylistic/quote-props */
import * as AST from "./ast";
import type ESlint from "eslint";

export type { AST };

interface VisitorOptions<T> {
  name?: string;
  parent?: AST.Node;
  array: boolean;
  parentResult?: T;
  thisResult?: T;
}

type VisitorFunction<T, U extends AST.Node> =
  (node: U, opts: VisitorOptions<T>) => T | undefined;

type VisitorFunctionOptional<T, U extends AST.Node> =
  (node: U, opts?: VisitorOptions<T>) => T | undefined;

interface VisitorFunctionMap<T> {
  // This is the only one with optional options.
  "*"?: VisitorFunctionOptional<T, AST.Node>;
  Program?: VisitorFunctionOptional<T, AST.Program>;
  grammar?: VisitorFunctionOptional<T, AST.Grammar>;
  grammar_import?: VisitorFunctionOptional<T, AST.Import>;
  binding?: VisitorFunctionOptional<T, AST.Binding>;
  import_binding?: VisitorFunctionOptional<T, AST.ImportBinding>;
  import_binding_all?: VisitorFunctionOptional<T, AST.ImportBindingAll>;
  import_binding_default?: VisitorFunctionOptional<T, AST.ImportBindingDefault>;
  import_binding_rename?: VisitorFunctionOptional<T, AST.ImportBindingRename>;
  // eslint-disable-next-line @stylistic/max-len
  import_module_specifier?: VisitorFunctionOptional<T, AST.ImportModuleSpecifier>;
  module_export_name?: VisitorFunctionOptional<T, AST.ModuleExportName>;
  top_level_initializer?: VisitorFunctionOptional<T, AST.TopLevelInitializer>;
  initializer?: VisitorFunctionOptional<T, AST.Initializer>;
  rule?: VisitorFunctionOptional<T, AST.Rule>;
  named?: VisitorFunctionOptional<T, AST.NamedExpression>;
  repeated?: VisitorFunctionOptional<T, AST.RepeatedExpression>;
  boundaries?: VisitorFunctionOptional<T, AST.Boundaries>;
  delimiter?: VisitorFunctionOptional<T, AST.Delimiter>;
  constant?: VisitorFunctionOptional<T, AST.BoundaryConstant>;
  variable?: VisitorFunctionOptional<T, AST.BoundaryVariable>;
  function?: VisitorFunctionOptional<T, AST.BoundaryFunction>;
  choice?: VisitorFunctionOptional<T, AST.ChoiceExpression>;
  action?: VisitorFunctionOptional<T, AST.ActionExpression>;
  sequence?: VisitorFunctionOptional<T, AST.SequenceExpression>;
  labeled?: VisitorFunctionOptional<T, AST.LabeledExpression>;
  text?: VisitorFunctionOptional<T, AST.TextExpression>;
  simple_and?: VisitorFunctionOptional<T, AST.SimpleAndExpression>;
  simple_not?: VisitorFunctionOptional<T, AST.SimpleNotExpression>;
  optional?: VisitorFunctionOptional<T, AST.OptionalExpression>;
  zero_or_more?: VisitorFunctionOptional<T, AST.ZeroOrMoreExpression>;
  one_or_more?: VisitorFunctionOptional<T, AST.OneOrMoreExpression>;
  group?: VisitorFunctionOptional<T, AST.GroupExpression>;
  semantic_and?: VisitorFunctionOptional<T, AST.SemanticAndExpression>;
  semantic_not?: VisitorFunctionOptional<T, AST.SemanticNotExpression>;
  rule_ref?: VisitorFunctionOptional<T, AST.RuleReferenceExpression>;
  library_ref?: VisitorFunctionOptional<T, AST.LibraryReferenceExpression>;
  literal?: VisitorFunctionOptional<T, AST.LiteralExpression>;
  display?: VisitorFunctionOptional<T, AST.DisplayName>;
  class?: VisitorFunctionOptional<T, AST.ClassExpression>;
  // In a grammar, `.` -> any.  NOT the same as "*".
  any?: VisitorFunctionOptional<T, AST.AnyExpression>;
  name?: VisitorFunctionOptional<T, AST.NamedExpression>;
  code?: VisitorFunctionOptional<T, AST.Code>;
  punc?: VisitorFunctionOptional<T, AST.Punctuation>;
  Block?: VisitorFunctionOptional<T, AST.BlockComment>;
  Line?: VisitorFunctionOptional<T, AST.LineComment>;

  "Program:exit"?: VisitorFunction<T, AST.Program>;
  "grammar:exit"?: VisitorFunction<T, AST.Grammar>;
  "grammar_import:exit"?: VisitorFunction<T, AST.Import>;
  "binding:exit"?: VisitorFunction<T, AST.Binding>;
  "import_binding:exit"?: VisitorFunction<T, AST.ImportBinding>;
  "import_binding_all:exit"?: VisitorFunction<T, AST.ImportBindingAll>;
  "import_binding_default:exit"?: VisitorFunction<T, AST.ImportBindingDefault>;
  "import_binding_rename:exit"?: VisitorFunction<T, AST.ImportBindingRename>;
  "import_module_specifier:exit"?: VisitorFunction<T, AST.ImportModuleSpecifier>;
  "module_export_name:exit"?: VisitorFunction<T, AST.ModuleExportName>;
  "top_level_initializer:exit"?: VisitorFunction<T, AST.TopLevelInitializer>;
  "initializer:exit"?: VisitorFunction<T, AST.Initializer>;
  "rule:exit"?: VisitorFunction<T, AST.Rule>;
  "named:exit"?: VisitorFunction<T, AST.NamedExpression>;
  "repeated:exit"?: VisitorFunction<T, AST.RepeatedExpression>;
  "boundaries:exit"?: VisitorFunction<T, AST.Boundaries>;
  "delimiter:exit"?: VisitorFunction<T, AST.Delimiter>;
  "constant:exit"?: VisitorFunction<T, AST.BoundaryConstant>;
  "variable:exit"?: VisitorFunction<T, AST.BoundaryVariable>;
  "function:exit"?: VisitorFunction<T, AST.BoundaryFunction>;
  "choice:exit"?: VisitorFunction<T, AST.ChoiceExpression>;
  "action:exit"?: VisitorFunction<T, AST.ActionExpression>;
  "sequence:exit"?: VisitorFunction<T, AST.SequenceExpression>;
  "labeled:exit"?: VisitorFunction<T, AST.LabeledExpression>;
  "text:exit"?: VisitorFunction<T, AST.TextExpression>;
  "simple_and:exit"?: VisitorFunction<T, AST.SimpleAndExpression>;
  "simple_not:exit"?: VisitorFunction<T, AST.SimpleNotExpression>;
  "optional:exit"?: VisitorFunction<T, AST.OptionalExpression>;
  "zero_or_more:exit"?: VisitorFunction<T, AST.ZeroOrMoreExpression>;
  "one_or_more:exit"?: VisitorFunction<T, AST.OneOrMoreExpression>;
  "group:exit"?: VisitorFunction<T, AST.GroupExpression>;
  "semantic_and:exit"?: VisitorFunction<T, AST.SemanticAndExpression>;
  "semantic_not:exit"?: VisitorFunction<T, AST.SemanticNotExpression>;
  "rule_ref:exit"?: VisitorFunction<T, AST.RuleReferenceExpression>;
  "library_ref:exit"?: VisitorFunction<T, AST.LibraryReferenceExpression>;
  "literal:exit"?: VisitorFunction<T, AST.LiteralExpression>;
  "display:exit"?:  VisitorFunction<T, AST.DisplayName>;
  "class:exit"?: VisitorFunction<T, AST.ClassExpression>;
  "any:exit"?: VisitorFunction<T, AST.AnyExpression>;
  "name:exit"?: VisitorFunction<T, AST.NamedExpression>;
  "code:exit"?: VisitorFunction<T, AST.Code>;
  "punc:exit"?: VisitorFunction<T, AST.Punctuation>;
  "Block:exit"?: VisitorFunction<T, AST.BlockComment>;
  "Line:exit"?: VisitorFunction<T, AST.LineComment>;
  "*:exit"?: VisitorFunction<T, AST.Node>;
}

/**
 * Visit some or all of the nodes in an AST.
 */
export class Visitor<T> {
  public static visitorKeys: ESlint.SourceCode.VisitorKeys = AST.visitorKeys;
  private functions: VisitorFunctionMap<T>;
  private star?: VisitorFunctionOptional<T, AST.Node>;
  private starExit?: VisitorFunction<T, AST.Node>;

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
  public visit(node: AST.Node, opts?: VisitorOptions<T>): void {
    let parentResult = opts?.parentResult;
    if (this.star) {
      parentResult = this.star(node, opts);
    }

    // @ts-expect-error It looks like ts gets this wrong.
    const enterFun: VisitorFunctionOptional<T, AST.Node> | undefined
      = this.functions[node.type];
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

    // @ts-expect-error It looks like ts gets this wrong.
    const exitFun: VisitorFunction<T, AST.Node> | undefined
      = this.functions[`${node.type}:exit`];
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
        exitFun(node, opts);
      }
      if (this.starExit) {
        this.starExit(node, opts);
      }
    }
  }
}
