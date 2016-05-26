# babelify [![Build Status](https://travis-ci.org/babel/babelify.svg?branch=master)](https://travis-ci.org/babel/babelify)

[Babel](https://github.com/babel/babel) [browserify](https://github.com/substack/node-browserify) transform.

As of [Babel 6.0.0](http://babeljs.io/blog/2015/10/29/6.0.0/) there are **no plugins included by default**. For babelify to be useful, you must also include some [presets](http://babeljs.io/docs/plugins/#presets) and/or [plugins](http://babeljs.io/docs/plugins/#transform).

## Installation

```sh
$ npm install --save-dev babelify
```

## Usage

### CLI

```sh
  $ browserify script.js -o bundle.js -t [ babelify --presets [ es2015 react ] ]
```

### Node

```javascript
var fs = require("fs");
var browserify = require("browserify");
browserify("./script.js")
  .transform("babelify", {presets: ["es2015", "react"]})
  .bundle()
  .pipe(fs.createWriteStream("bundle.js"));
```

**NOTE:** [Presets and plugins](http://babeljs.io/docs/plugins/) need to be installed as separate modules. For the above examples to work, you'd need to also install [`babel-preset-es2015`](https://www.npmjs.com/package/babel-preset-es2015) and [`babel-preset-react`](https://www.npmjs.com/package/babel-preset-react):

```sh
$ npm install --save-dev babel-preset-es2015 babel-preset-react
```

### Options

Selected options are discussed below. See the [babel](http://babeljs.io/) docs for the complete list of [options](http://babeljs.io/docs/usage/options/).

Options may be passed in via standard [browserify](https://github.com/substack/node-browserify#btransformtr-opts) ways:

```sh
$ browserify -t [ babelify --presets [ es2015 react ] ]
```

```js
browserify().transform("babelify", {presets: ["es2015", "react"]});
```

```js
var babelify = require("babelify");
browserify().transform(babelify, {presets: ["es2015", "react"]});
```

Or, with the `configure` method:

```js
browserify().transform(babelify.configure({
  presets: ["es2015", "react"]
}));
```

#### Customizing extensions

By default, all files with the extensions `.js`, `.es`, `.es6` and `.jsx` are compiled. You can change this by passing an array of extensions.

**NOTE:** This will override the default ones so if you want to use any of them
you have to add them back.

```js
browserify().transform("babelify", {extensions: [".babel"]});
```

```sh
$ browserify -t [ babelify --extensions .babel ]
```

Now you can use:

```js
import NavBar from "nav-bar.babel";
var Panels = require("panels.babel");
```

**NOTE:** By default, Browserify will only lookup `.js` and `.json` files when the extension is ommited (like node's `require`). To lookup additional extensions, use browserify's [`extensions` option](https://github.com/substack/node-browserify#browserifyfiles--opts).

```js
browserify({
  extensions: [".babel"]
}).transform("babelify", {
  extensions: [".babel"]
});
```

```sh
$ browserify --extensions=.babel -t [ babelify --extensions .babel ]
```

Now you can omit the extension and compile `.babel` files:

```js
import NavBar from "nav-bar";
var Panels = require("panels");
```

#### Source maps

By default, browserify sets the source map sources paths relative to the basedir (or to `process.cwd()` if not set). To make the sources paths absolute, set the `sourceMapsAbsolute` option on babelify:

```js
browserify().transform("babelify", {
  sourceMapsAbsolute: true
});
```

```sh
$ browserify -t [ babelify --sourceMapsAbsolute ]
```

#### Additional options

```javascript
browserify().transform(babelify.configure({
  // Optional ignore regex - if any filenames **do** match this regex then
  // they aren't compiled
  ignore: /regex/,

  // Optional only regex - if any filenames **don't** match this regex
  // then they aren't compiled
  only: /my_es6_folder/
}))
```

```sh
$ browserify -t [ babelify --ignore regex --only my_es6_folder ]
```

#### Babel result (metadata and others)

Babelify emits a `babelify` event with Babel's full result object as the first
argument, and the filename as the second. Browserify doesn't pass-through the
events emitted by a transform, so it's necessary to get a reference to the
transform instance before you can attach a listener for the event:

```js
var b = browserify().transform(babelify);

b.on("transform", function(tr) {
  if (tr instanceof babelify) {
    tr.once("babelify", function(result, filename) {
      result; // => { code, map, ast, metadata }
    });
  }
});
```

## FAQ

### Why aren't files in `node_modules` being transformed?

This is the default browserify behavior.

A possible solution is to add:

```json
{
  "browserify": {
    "transform": ["babelify"]
  }
}
```

to the root of all your modules `package.json` that you want to be transformed. If you'd like to
specify options then you can use:

```json
{
  "browserify": {
    "transform": [["babelify", { "presets": ["es2015"] }]]
  }
}
```

Another solution (proceed with caution!) is to run babelify as a [global](https://github.com/substack/node-browserify#btransformtr-opts) transform. Use the babel [`ignore` option](http://babeljs.io/docs/usage/options/) to narrow the number of files transformed:

```js
browserify().transform(babelify, {
  global: true,
  ignore: /\/node_modules\/(?!app\/)/
});
```

The above example will transform all files except those in the `node_modules` directory that are not in `node_modules/app`.

### Why am I not getting source maps?

To use source maps, enable them in browserify with the [`debug`](https://github.com/substack/node-browserify#browserifyfiles--opts) option:

```js
browserify({debug: true}).transform("babelify");
```

```sh
$ browserify -d -t [ babelify ]
```

If you want the source maps to be of the post-transpiled code, then leave `debug` on, but turn off babelify's `sourceMaps`:

```js
browserify({debug: true}).transform("babelify", {sourceMaps: false});
```

```sh
$ browserify -d -t [ babelify --no-sourceMaps ]
```
