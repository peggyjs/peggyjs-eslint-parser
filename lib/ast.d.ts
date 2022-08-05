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
    literal: never[];
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
export declare type TopLevelInitializer = CodeExpression<"top_level_initializer">;
export declare type Initializer = CodeExpression<"initializer">;
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
export declare type TextExpression = ExpressionExpression<"text">;
export declare type SimpleAndExpression = ExpressionExpression<"simple_and">;
export declare type SimpleNotExpression = ExpressionExpression<"simple_not">;
export declare type OptionalExpression = ExpressionExpression<"optional">;
export declare type ZeroOrMoreExpression = ExpressionExpression<"zero_or_more">;
export declare type OneOrMoreExpression = ExpressionExpression<"one_or_more">;
export declare type GroupExpression = ExpressionExpression<"group">;
export declare type SemanticAndExpression = CodeExpression<"semantic_and">;
export declare type SemanticNotExpression = CodeExpression<"semantic_not">;
export interface ValueExpression<T extends NodeTypes> extends BaseNode<T> {
    value: string;
}
export declare type RuleReferenceExpression = ValueExpression<"rule_ref">;
export interface LiteralExpression extends ValueExpression<"literal"> {
    ignoreCase: boolean;
}
export interface ClassExpression extends BaseNode<"class"> {
    parts: (string[] | string)[];
    inverted: boolean;
    ignoreCase: boolean;
}
export declare type AnyExpression = BaseNode<"any">;
export declare type Name = ValueExpression<"name">;
export declare type Punctuation = ValueExpression<"punc">;
export interface Code extends ValueExpression<"code"> {
    open: Punctuation;
    close: Punctuation;
}
export declare type ValueNode = Code | LiteralExpression | Name | Punctuation | RuleReferenceExpression;
export declare type PrefixedExpression = SimpleAndExpression | SimpleNotExpression | TextExpression;
export declare type SuffixedExpression = OneOrMoreExpression | OptionalExpression | ZeroOrMoreExpression;
export declare type SemanticPredicateExpression = SemanticAndExpression | SemanticNotExpression;
export declare type PrimaryExpression = AnyExpression | ClassExpression | GroupExpression | LiteralExpression | RuleReferenceExpression | SemanticPredicateExpression;
export declare type Expression = ActionExpression | ChoiceExpression | LabeledExpression | NamedExpression | PrefixedExpression | PrimaryExpression | SequenceExpression | SuffixedExpression;
export declare type Node = Code | EStree.Comment | Expression | Grammar | Initializer | Name | Program | Punctuation | Rule | TopLevelInitializer;
export {};
