"use strict";

/** @type import("eslint").SourceCode.VisitorKeys */
module.exports = {
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
};
