"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorKeys = void 0;
/**
 * ESlint uses these for visiting the AST.  We'll do the same in visitor.ts.
 */
exports.visitorKeys = {
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
