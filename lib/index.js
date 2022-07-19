"use strict";

const peggy = require("peggy");

let visit = null;

function modLoc(node) {
  node.loc = {
    start: {
      line: node.location.start.line,
      column: node.location.start.column,
    },
    end: {
      line: node.location.end.line,
      column: node.location.end.column,
    },
  };
  node.range = [
    node.location.start.offset,
    node.location.end.offset,
  ];
  delete node.location;

  if (node.expression) {
    visit(node.expression);
  }
}

function nodify(kind) {
  return node => {
    const loc = `${kind}Location`;
    node[kind] = {
      type: kind,
      [kind]: node[kind],
      location: node[loc],
    };
    delete node[loc];
    modLoc(node[kind]);
    modLoc(node);
  };
}

const extractName = nodify("name");
const extractCode = nodify("code");
const extractLabel = nodify("label");

visit = peggy.compiler.visitor.build({
  grammar(node) {
    modLoc(node);
    if (node.topLevelInitializer) {
      visit(node.topLevelInitializer);
    }

    if (node.initializer) {
      visit(node.initializer);
    }

    node.rules.forEach(rule => visit(rule));
  },
  top_level_initializer: extractCode,
  initializer: extractCode,
  rule: extractName,
  named: modLoc,
  choice(node) {
    modLoc(node);
    node.alternatives.forEach(visit);
  },
  action: extractCode,
  sequence(node) {
    modLoc(node);
    node.elements.forEach(visit);
  },
  labeled: extractLabel,
  text: modLoc,
  simple_and: modLoc,
  simple_not: modLoc,
  optional: modLoc,
  zero_or_more: modLoc,
  one_or_more: modLoc,
  group: modLoc,
  semantic_and: extractCode,
  semantic_not: extractCode,
  rule_ref: modLoc,
  literal: modLoc,
  class: modLoc,
  any: modLoc,
});

// Don't create functions, etc.
const noGeneratePlugin = {
  use(config) {
    config.passes.generate = [];
  },
};

function parseForESLint(code, options) {
  const ast = peggy.generate(code, {
    output: "ast",
    plugins: [noGeneratePlugin],
    grammarSource: options.filePath,
  });

  visit(ast);

  return {
    // Wrap a Program around the AST so that the
    // default ScopeManager doesn't choke.
    ast: {
      type: "Program",
      body: ast,
      comments: [],
      tokens: [],
      sourceType: "peggy",
      loc: ast.loc,
      range: ast.range,
    },
    visitorKeys: {
      Program: ["grammar"],
      grammar: ["topLevelInitializer", "initializer", "rules"],
      top_level_initializer: ["code"],
      initializer: ["code"],
      rule: ["name", "expression"],
      named: ["expression"],
      choice: ["alternatives"],
      action: ["code", "expression"],
      sequence: ["elements"],
      labeled: ["label", "expression"],
      text: ["expression"],
      simple_and: ["expression"],
      simple_not: ["expression"],
      optional: ["expression"],
      zero_or_more: ["expression"],
      one_or_more: ["expression"],
      group: ["expression"],
      semantic_and: ["code"],
      semantic_not: ["code"],
      rule_ref: [],
      literal: [],
      class: [],
      any: [],
    },
  };
}

module.exports = {
  parseForESLint,
};
