import type * as ESlint from "eslint";
import type * as EStree from "estree";

/**
 * ESlint uses these for visiting the AST.  We'll do the same in visitor.ts.
 */
export const visitorKeys = {
  Program: ["body", "comments"],
  grammar: ["topLevelInitializer", "initializer", "rules"],
  top_level_initializer: ["code"],
  initializer: ["code"],
  rule: ["name", "equals", "expression"],
  named: ["expression"],
  choice: ["alternatives"],
  action: ["expression", "code"],
  sequence: ["elements"],
  labeled: ["name", "expression"],
  text: ["expression"],
  simple_and: ["expression"],
  simple_not: ["expression"],
  optional: ["expression"],
  zero_or_more: ["expression"],
  one_or_more: ["expression"],
  group: ["expression"],
  semantic_and: ["code"],
  semantic_not: ["code"],
  rule_ref: ["value"],
  literal: [],
  class: [],
  any: [],
  name: [],
  code: [],
  equals: [],
  Block: [],
  Line: [],
};

export type NodeTypes = keyof typeof visitorKeys;

export interface BaseNode<T extends NodeTypes> {
  type: T;
  loc: EStree.SourceLocation;
  range: [number, number];
}

export interface Program extends BaseNode<"Program"> {
  sourceType: "peggy";
  body: Grammar;
  comments: EStree.Comment[];
  tokens: ESlint.AST.Token[];
}

export interface Grammar extends BaseNode<"grammar"> {
  topLevelInitializer?: TopLevelInitializer;
  initializer?: Initializer;
  rules: Rule[];
}

interface CodeExpression<T extends NodeTypes> extends BaseNode<T> {
  code: Code;
}

export type TopLevelInitializer = CodeExpression<"top_level_initializer">;
export type Initializer = CodeExpression<"initializer">;

export interface Rule extends BaseNode<"rule"> {
  name: Name;
  equals: Equals;
  expression: Expression;
}

export interface NamedExpression extends BaseNode<"named"> {
  value: string;
  expression: Expression;
}

export interface ChoiceExpression extends BaseNode<"choice"> {
  alternatives: Expression[];
}

export interface ActionExpression extends BaseNode<"action"> {
  expression: Expression;
  code: Code;
}

export interface SequenceExpression extends BaseNode<"sequence"> {
  elements: Expression[];
}

interface ExpressionExpression<T extends NodeTypes> extends BaseNode<T> {
  expression: Expression;
}

export interface LabeledExpression extends ExpressionExpression<"labeled"> {
  name: Name;
  pick: boolean;
}

export type TextExpression = ExpressionExpression<"text">;
export type SimpleAndExpression = ExpressionExpression<"simple_and">;
export type SimpleNotExpression = ExpressionExpression<"simple_not">;
export type OptionalExpression = ExpressionExpression<"optional">;
export type ZeroOrMoreExpression = ExpressionExpression<"zero_or_more">;
export type OneOrMoreExpression = ExpressionExpression<"one_or_more">;
export type GroupExpression = ExpressionExpression<"group">;
export type SemanticAndExpression = CodeExpression<"semantic_and">;
export type SemanticNotExpression = CodeExpression<"semantic_not">;

interface ValueExpression<T extends NodeTypes> extends BaseNode<T> {
  value: string;
}

export type RuleReferenceExpression = ValueExpression<"rule_ref">;

export interface LiteralExpression extends ValueExpression<"literal"> {
  ignoreCase: boolean;
}

export interface ClassExpression extends BaseNode<"class"> {
  parts: (string[] | string)[];
  inverted: boolean;
  ignoreCase: boolean;
}

export type AnyExpression = BaseNode<"any">;
export type Name = ValueExpression<"name">;
export type Code = ValueExpression<"code">;
export type Equals = BaseNode<"equals">;

export type PrefixedExpression
  = SimpleAndExpression
  | SimpleNotExpression
  | TextExpression;

export type SuffixedExpression
  = OneOrMoreExpression
  | OptionalExpression
  | ZeroOrMoreExpression;

export type SemanticPredicateExpression
  = SemanticAndExpression
  | SemanticNotExpression;

export type PrimaryExpression
  = AnyExpression
  | ClassExpression
  | GroupExpression
  | LiteralExpression
  | RuleReferenceExpression
  | SemanticPredicateExpression;

export type Expression
  = ActionExpression
  | ChoiceExpression
  | LabeledExpression
  | NamedExpression
  | PrefixedExpression
  | PrimaryExpression
  | SequenceExpression
  | SuffixedExpression;

export type Node
  = Code
  | Equals
  | EStree.Comment
  | Expression
  | Grammar
  | Initializer
  | Name
  | Program
  | Rule
  | TopLevelInitializer;
