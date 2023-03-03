import type ESlint from "eslint";
import type EStree from "estree";
/**
 * ESlint uses these for visiting the AST.  We'll do the same in visitor.ts.
 */
export declare const visitorKeys: {
    Program: string[];
    grammar: string[];
    top_level_initializer: string[];
    initializer: string[];
    rule: string[];
    named: string[];
    repeated: string[];
    boundaries: string[];
    delimiter: string[];
    constant: never[];
    variable: never[];
    function: string[];
    choice: string[];
    action: string[];
    sequence: string[];
    labeled: string[];
    text: string[];
    simple_and: string[];
    simple_not: string[];
    optional: string[];
    zero_or_more: string[];
    one_or_more: string[];
    group: string[];
    semantic_and: string[];
    semantic_not: string[];
    rule_ref: string[];
    literal: string[];
    display: string[];
    class: never[];
    any: never[];
    name: never[];
    code: string[];
    punc: never[];
    Block: never[];
    Line: never[];
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
    semi?: Punctuation;
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
export type TopLevelInitializer = BaseNode<"top_level_initializer"> & Bracketed & Coded & Terminated;
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
export type Boundary = BoundaryConstant | BoundaryVariable | BoundaryFunction;
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
export type Comment = BlockComment | LineComment;
export type OperatorExpression = OneOrMoreExpression | OptionalExpression | SemanticAndExpression | SemanticNotExpression | SimpleAndExpression | SimpleNotExpression | TextExpression | ZeroOrMoreExpression;
export type ValueNode = Code | DisplayName | LiteralExpression | Name | Punctuation;
export type PrefixedExpression = SimpleAndExpression | SimpleNotExpression | TextExpression;
export type PrefixedOperatorExpression = PrefixedExpression | SemanticPredicateExpression;
export type SuffixedExpression = OneOrMoreExpression | OptionalExpression | ZeroOrMoreExpression;
export type SemanticPredicateExpression = SemanticAndExpression | SemanticNotExpression;
export type PrimaryExpression = AnyExpression | ClassExpression | GroupExpression | LiteralExpression | RuleReferenceExpression | SemanticPredicateExpression;
export type Expression = ActionExpression | ChoiceExpression | LabeledExpression | NamedExpression | PrefixedExpression | PrimaryExpression | RepeatedExpression | SequenceExpression | SuffixedExpression;
export type Node = Boundary | BoundaryConstant | BoundaryFunction | BoundaryVariable | Boundaries | Code | Comment | Delimiter | DisplayName | Expression | Grammar | Initializer | Name | Program | Punctuation | Rule | TopLevelInitializer;
export {};
