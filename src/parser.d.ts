// Originally generated with ts-pegjs, then hand-maintained.

import type * as ast from "./ast";
export interface FilePosition {
    offset: number;
    line: number;
    column: number;
}
export interface FileRange {
    start: FilePosition;
    end: FilePosition;
    source: string;
}
export interface LiteralExpectation {
    type: "literal";
    text: string;
    ignoreCase: boolean;
}
export interface ClassParts extends Array<string | ClassParts> {
}
export interface ClassExpectation {
    type: "class";
    parts: ClassParts;
    inverted: boolean;
    ignoreCase: boolean;
}
export interface AnyExpectation {
    type: "any";
}
export interface EndExpectation {
    type: "end";
}
export interface OtherExpectation {
    type: "other";
    description: string;
}
export type Expectation = LiteralExpectation | ClassExpectation | AnyExpectation | EndExpectation | OtherExpectation;
declare class _PeggySyntaxError extends Error {
    static buildMessage(expected: Expectation[], found: string | null): string;
    message: string;
    expected: Expectation[];
    found: string | null;
    location: FileRange;
    name: string;
    constructor(message: string, expected: Expectation[], found: string | null, location: FileRange);
    format(sources: {
        source?: any;
        text: string;
    }[]): string;
}
export interface TraceEvent {
    type: string;
    rule: string;
    result?: any;
    location: FileRange;
}
export interface ParseOptions {
    filename?: string;
    startRule?: "Program";
    tracer?: any;
    [key: string]: any;
}
export type ParseFunction = <Options extends ParseOptions>(input: string, options?: Options) => Options extends {
    startRule: infer StartRule;
} ? StartRule extends "Program" ? Program : Program : Program;
export declare const parse: ParseFunction;
export declare const SyntaxError: typeof _PeggySyntaxError;
export type SyntaxError = _PeggySyntaxError;
export type Program = ast.Node;
export {};
