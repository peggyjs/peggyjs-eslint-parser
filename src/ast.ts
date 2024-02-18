/* eslint-disable no-use-before-define */
import type * as ESlint from "eslint";
import type * as EStree from "estree";

/**
 * ESlint uses these for visiting the AST.  We'll do the same in visitor.ts.
 */
export const visitorKeys = {
  Program: ["body", "comments"],
  grammar: ["imports", "topLevelInitializer", "initializer", "rules"],
  grammar_import: ["what", "from"],
  binding: ["id"],
  import_binding: ["binding"],
  import_binding_all: ["binding"],
  import_binding_default: ["binding"],
  import_binding_rename: ["rename", "binding"],
  import_module_specifier: ["before", "after"],
  module_export_name: ["before", "after"],
  top_level_initializer: ["open", "code", "close", "semi"],
  initializer: ["code", "semi"],
  rule: ["name", "equals", "expression", "semi"],
  named: ["name", "expression"],
  repeated: ["expression", "pipe1", "boundaries", "delimiter", "pipe2"],
  boundaries: ["min", "dots", "max"],
  delimiter: ["comma", "expression"],
  constant: [],
  variable: [],
  function: ["code"],
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
  library_ref: ["name", "library"],
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

interface Terminated {
  // Semicolons are always optional.
  semi?: Punctuation[];
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
  imports: Import[];
  topLevelInitializer?: TopLevelInitializer;
  initializer?: Initializer;
  rules: Rule[];
}

export interface Import extends BaseNode<"grammar_import"> {
  what: (
    | ImportBinding
    | ImportBindingAll
    | ImportBindingDefault
    | ImportBindingRename
  )[];
  from: ImportModuleSpecifier;
}

export interface ImportBinding extends BaseNode<"import_binding"> {
  binding: Binding;
}

export interface ImportBindingAll extends BaseNode<"import_binding_all"> {
  binding: Binding;
}

export interface ImportBindingDefault extends BaseNode<"import_binding_default"> {
  binding: Binding;
}

export interface ImportBindingRename extends BaseNode<"import_binding_rename"> {
  rename: string;
  binding: Binding;
}

export interface Binding extends BaseNode<"binding"> {
  id?: Name;
}

export type ImportModuleSpecifier = QuotedString<"import_module_specifier">;

export type ModuleExportName = QuotedString<"module_export_name">;

export type TopLevelInitializer = BaseNode<"top_level_initializer">
  & Bracketed & Coded & Terminated;
export type Initializer = BaseNode<"initializer"> & Coded & Terminated;

export interface Rule extends BaseNode<"rule">, Terminated {
  name: Name;
  equals: Punctuation;
  expression: Expression;
}

export interface NamedExpression extends BaseNode<"named"> {
  name: Name;
  expression: Expression;
}

export interface RepeatedExpression extends BaseNode<"repeated"> {
  expression: Expression;
  pipe1: Punctuation;
  boundaries: Boundaries;
  delimiter?: Delimiter;
  pipe2: Punctuation;
}

export interface Boundaries extends BaseNode<"boundaries"> {
  min?: Boundary;
  dots?: Punctuation;
  max?: Boundary;
}

export type Boundary = BoundaryConstant | BoundaryFunction | BoundaryVariable;

export interface BoundaryConstant extends BaseNode<"constant"> {
  value: number;
}

export interface BoundaryVariable extends BaseNode<"variable"> {
  value: string;
}

export interface BoundaryFunction extends BaseNode<"function"> {
  code: Code;
}

export interface Delimiter extends BaseNode<"delimiter"> {
  comma: Punctuation;
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

export interface LibraryReferenceExpression extends BaseNode<"library_ref"> {
  library: Name;
  name: Name;
  libraryNumber: number;
}

interface QuotedString<T extends NodeTypes> extends ValueExpression<T> {
  before: Punctuation;
  after: Punctuation;
  raw: string;
  value: string;
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
  | LibraryReferenceExpression
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
  | RepeatedExpression
  | SequenceExpression
  | SuffixedExpression;

export type ImportDtails
  = Binding
  | Import
  | ImportBinding
  | ImportBindingAll
  | ImportBindingDefault
  | ImportBindingRename
  | ImportModuleSpecifier
  | ModuleExportName;

export type Node
  = Boundaries
  | Boundary
  | BoundaryConstant
  | BoundaryFunction
  | BoundaryVariable
  | Code
  | Comment
  | Delimiter
  | DisplayName
  | Expression
  | Grammar
  | ImportDtails
  | Initializer
  | Name
  | Program
  | Punctuation
  | Rule
  | TopLevelInitializer;
