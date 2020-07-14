# bundler.js

Simplistic CommonJS module bundler

Version: 0.1
License: MIT

## About

This bundler attempts to aggressively bundle CommonJS modules by assuming the dependency tree is static, similar to what Rollup does for ES6 modules.

Most browsers don't support ES6 `import/export` syntax, but we can achieve modularity by using CommonJS module syntax and employing [`module.js`](../module/README.md) in browser environments.

Webpack is conservative and treats CommonJS modules as non-statically-analyzable since `require` and `module.exports` are legally allowed everywhere. Therefore, it must generate extra code to resolve dependencies at runtime (i.e. `__webpack_require()`). Rollup only works with ES6 modules. ES6 modules can be bundled more efficiently because they are statically analyzable, but some use cases are difficult to handle due to ES6's support for cyclic dependencies and hosting rules. This bundler assumes code is written in CommonJS style but follows a strict set of rules that emulate statically analyzable code and favors the usage of the factory pattern instead of relying on obscure corners of the Javascript language (hoisting rules and binding semantics).

### Caveats

- Only supports modules that have the `require` and `module.exports` statement declared at the top-level scope before all other code, i.e. it does not support CommonJS modules that rely on dynamic importing/exporting. This means modules should only export a pure function or export a factory function if there are multiple statements and/or internal module state. The factory function pattern allows easier dependency injection in stateful modules, thus making modules testable.
- Changes the semantics of value/binding exporting between unbundled and bundled code, and therefore relying on those semantics is discouraged. Instead, it is recommended that module consumers inject dependencies via the factory function pattern
- Top level strictness is infectious (i.e. if entry file is in `"use strict"` mode, all modules inherit strict mode, and conversely, if the entry file is not in strict mode, all modules are pulled out of strict mode)
- Currently only supports assignments to `module.exports` (i.e. `module.exports.foo = bar` will not work)
- It is tiny and dependency-free because it uses regular expressions, and it only supports the narrow range of import/export declaration patterns outlined above.
