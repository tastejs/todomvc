# module.js

[About](#about) | [Usage](#usage) | [API](#api) | [Goals](#goals)

CommonJS module API polyfill for browsers

Version: 1.0  
License: MIT

## About

- ~30 LOC
- allows running CommonJS modules in browsers without the need for a compile-time bundler like browserify or webpack
- doesn't separate module code into separate environment contexts, so it makes it possible to test private APIs

### Caveats

- pollutes global scope, thus making name collisions possible
- doesn't support out-of-order execution, so script tags for dependencies must appear before the modules that use them
- doesn't support circular dependencies
- runs code for all declared modules, regardless of whether they were `require`d
- only supports relative paths in `require` calls (i.e. won't resolve anything from `node_modules`)
- only supports files with `.js` extension

## Usage

```html
<script src="module.js"></script>
<script src="foo.js"></script>
<script src="bar.js"></script>
```

```javascript
//file: bar.js
var foo = require("./foo")

module.exports = {bar: "baz"}
```

---

## API

### `any require(String module)`

Imports a module. `module` should be the relative path of the module's javascript file, minus the '.js' extension

---

### `any module.exports`

A getter-setter. Assign to this to register a module for exporting

---

## Goals

The best code is no code at all.

This micro-library exists to support a coding style that aims to achieve systematic terseness (in other words, a "less-is-more" philosophy).

Browsers run javascript in a global environment that spans multiple files. Node.js runs each javascript file in a self-contained environment, which can communicate with other files via its CommonJS module API. Node.js' modular quality is desirable for writing scalable codebases, and we want to be able to use its module API both in the browser and in the server, with the ultimate goal of writing code that can run unmodified in both. Ideally this should also be possible without requiring a lot of extra machinery.

Webpack and Browserify are commonly used solutions to solve this issue, but both require a large number of dependencies and a compilation/file watching tool. This micro-library provides an incomplete but usable subset of features of the CommonJS module API in order to aid in development tasks. The plan is to use Node.js' full CommonJS support for production-related tasks, and use this micro-library to run the same source code in-browser for development/testing tasks.
