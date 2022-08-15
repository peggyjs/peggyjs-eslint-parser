# Eslint-style parser for Peggy grammars

For linting [Peggy](https://peggyjs.org/) grammars using [eslint](https://eslint.org/).

## Install

```sh
npm install -D @peggyjs/eslint-parser
```

## API

We'll document this more if anyone else wants to use it.

```js
import { parseForESLint, visitor } from "@peggyjs/eslint-parser";

const parserResults = parseForESLint(text, { filePath: filename });
const v = new visitor.Visitor({
  rule(node) {
    console.log(node.name.value);
  }
});
v.visit(parserResults.ast);
```

## Notes

This uses a slightly different grammar than the one built in to Peggy, in
order to pull out information about more concrete parts of the grammar like
punctuation that don't matter to Peggy semantics.

[![Tests](https://github.com/peggyjs/peggyjs-eslint-parser/actions/workflows/node.js.yml/badge.svg)](https://github.com/peggyjs/peggyjs-eslint-parser/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/peggyjs/peggyjs-eslint-parser/branch/main/graph/badge.svg?token=UCEWE8GY65)](https://codecov.io/gh/peggyjs/peggyjs-eslint-parser)
