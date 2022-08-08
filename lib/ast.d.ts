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
export declare type NodeTypes = keyof typeof visitorKeys;
export interface BaseNode<T extends NodeTypes> {
    type: T;
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
export declare type TopLevelInitializer = BaseNode<"top_level_initializer"> & Coded;
export declare type Initializer = BaseNode<"initializer"> & Coded;
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
export declare type ActionExpression = Coded & ExpressionExpression<"action">;
export interface SequenceExpression extends BaseNode<"sequence"> {
    elements: Expression[];
}
export interface LabeledExpression extends ExpressionExpression<"labeled"> {
    name: Name;
    pick: boolean;
}
declare type OperatorExpression<T extends NodeTypes> = ExpressionExpression<T> & Op;
export declare type TextExpression = OperatorExpression<"text">;
export declare type SimpleAndExpression = OperatorExpression<"simple_and">;
export declare type SimpleNotExpression = OperatorExpression<"simple_not">;
export declare type OptionalExpression = OperatorExpression<"optional">;
export declare type ZeroOrMoreExpression = OperatorExpression<"zero_or_more">;
export declare type OneOrMoreExpression = OperatorExpression<"one_or_more">;
export declare type SemanticAndExpression = BaseNode<"semantic_and"> & Coded & Op;
export declare type SemanticNotExpression = BaseNode<"semantic_not"> & Coded & Op;
export declare type GroupExpression = Bracketed & ExpressionExpression<"group">;
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
export declare type DisplayName = QuotedString<"display">;
export interface ClassExpression extends BaseNode<"class"> {
    parts: (string[] | string)[];
    inverted: boolean;
    ignoreCase: boolean;
}
export declare type AnyExpression = BaseNode<"any">;
export declare type Name = ValueExpression<"name">;
export declare type Punctuation = ValueExpression<"punc">;
export declare type Code = Bracketed & ValueExpression<"code">;
export declare type ValueNode = Code | DisplayName | LiteralExpression | Name | Punctuation;
export declare type PrefixedExpression = SimpleAndExpression | SimpleNotExpression | TextExpression;
export declare type SuffixedExpression = OneOrMoreExpression | OptionalExpression | ZeroOrMoreExpression;
export declare type SemanticPredicateExpression = SemanticAndExpression | SemanticNotExpression;
export declare type PrimaryExpression = AnyExpression | ClassExpression | GroupExpression | LiteralExpression | RuleReferenceExpression | SemanticPredicateExpression;
export declare type Expression = ActionExpression | ChoiceExpression | LabeledExpression | NamedExpression | PrefixedExpression | PrimaryExpression | SequenceExpression | SuffixedExpression;
export declare type Node = Code | DisplayName | EStree.Comment | Expression | Grammar | Initializer | Name | Program | Punctuation | Rule | TopLevelInitializer;
export {};
