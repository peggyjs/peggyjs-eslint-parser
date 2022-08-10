import type ESlint from "eslint";
import type EStree from "estree";

/**
 * ESlint uses these for visiting the AST.  We'll do the same in visitor.ts.
 */
export const visitorKeys = {
  Program: ["body", "comments"],
  grammar: ["topLevelInitializer", "initializer", "rules"],
  top_level_initializer: ["code"],
  initializer: ["code"],
  rule: ["name", "equals", "expression"],
  named: ["name", "expression"],
  choice: ["alternatives", "slashes"],
  action: ["expression", "code"],
  sequence: ["elements"],
  labeled: ["at", "name", "colon", "expression"],
  text: ["operator", "expression"],
  simple_and: ["operator", "expression"],
  simple_not: ["operator", "expression"],
  optional: ["expression", "operator"],
  zero_or_more: ["expression", "operator"],
  one_or_more: ["expression", "operator"],
  group: ["open", "expression", "close"],
  semantic_and: ["operator", "code"],
  semantic_not: ["operator", "code"],
  rule_ref: ["name"],
  literal: ["before", "after"],
  display: ["before", "after"],
  class: [],
  any: [],
  name: [],
  code: ["open", "close"],
  punc: [],
  Block: [],
  Line: [],
};

export type NodeTypes = keyof typeof visitorKeys;

export interface BaseNode<T extends NodeTypes> {
  type: T;
  parent?: Node;
  loc: EStree.SourceLocation;
  range: [number, number];
}

interface Coded {
  code: Code;
}

interface Bracketed {
  open: Punctuation;
  close: Punctuation;
}

interface Op {
  operator: Punctuation;
}

interface ExpressionExpression<T extends NodeTypes> extends BaseNode<T> {
  expression: Expression;
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

export type TopLevelInitializer = BaseNode<"top_level_initializer"> & Coded;
export type Initializer = BaseNode<"initializer"> & Coded;

export interface Rule extends BaseNode<"rule"> {
  name: Name;
  equals: Punctuation;
  expression: Expression;
}

export interface NamedExpression extends BaseNode<"named"> {
  name: Name;
  expression: Expression;
}

export interface ChoiceExpression extends BaseNode<"choice"> {
  alternatives: Expression[];
  slashes: Punctuation[];
}

export type ActionExpression = Coded & ExpressionExpression<"action">;

export interface SequenceExpression extends BaseNode<"sequence"> {
  elements: Expression[];
}

export interface LabeledExpression extends ExpressionExpression<"labeled"> {
  name: Name;
  at: Punctuation;
  colon: Punctuation;
  pick: boolean;
}

type OpEx<T extends NodeTypes> = ExpressionExpression<T> & Op;
export type TextExpression = OpEx<"text">;
export type SimpleAndExpression = OpEx<"simple_and">;
export type SimpleNotExpression = OpEx<"simple_not">;
export type OptionalExpression = OpEx<"optional">;
export type ZeroOrMoreExpression = OpEx<"zero_or_more">;
export type OneOrMoreExpression = OpEx<"one_or_more">;
export type SemanticAndExpression = BaseNode<"semantic_and"> & Coded & Op;
export type SemanticNotExpression = BaseNode<"semantic_not"> & Coded & Op;

export type GroupExpression = Bracketed & ExpressionExpression<"group">;

export interface ValueExpression<T extends NodeTypes> extends BaseNode<T> {
  value: string;
}

export interface RuleReferenceExpression extends BaseNode<"rule_ref"> {
  name: Name;
}

interface QuotedString<T extends NodeTypes> extends ValueExpression<T> {
  before: Punctuation;
  after: Punctuation;
  raw: string;
}

export interface LiteralExpression extends QuotedString<"literal"> {
  ignoreCase: boolean;
}

export type DisplayName = QuotedString<"display">;

export interface ClassExpression extends BaseNode<"class"> {
  parts: (string[] | string)[];
  inverted: boolean;
  ignoreCase: boolean;
}

export type AnyExpression = BaseNode<"any">;
export type Name = ValueExpression<"name">;
export type Punctuation = ValueExpression<"punc">;
export type Code = Bracketed & ValueExpression<"code">;
export type BlockComment = BaseNode<"Block"> & EStree.Comment;
export type LineComment = BaseNode<"Line"> & EStree.Comment;

export type Comment
  = BlockComment
  | LineComment;

export type OperatorExpression
  = OneOrMoreExpression
  | OptionalExpression
  | SemanticAndExpression
  | SemanticNotExpression
  | SimpleAndExpression
  | SimpleNotExpression
  | TextExpression
  | ZeroOrMoreExpression;

export type ValueNode
  = Code
  | DisplayName
  | LiteralExpression
  | Name
  | Punctuation;

export type PrefixedExpression
  = SimpleAndExpression
  | SimpleNotExpression
  | TextExpression;

export type PrefixedOperatorExpression
  = PrefixedExpression
  | SemanticPredicateExpression;

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
  | Comment
  | DisplayName
  | Expression
  | Grammar
  | Initializer
  | Name
  | Program
  | Punctuation
  | Rule
  | TopLevelInitializer;
