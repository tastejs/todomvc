# duet-build

An tiny, opinionated command-line build tool for creating [duet](https://github.com/colingourlay/duet) app bundles.

```
$ npm install --save-dev duet-build
```

## Usage

```
$ duet-build
```

When you run the command with no arguments, it will attempt to bundle `src/index.js` and output the bundled `index.js` and a bare-bones `index.html` file into the `public/` directory.

The project is bundled with browserify, with the babel ES2015 and uglify transforms applied.

## Arguments

* `--entry="path/to/index.js"` - path to the file you want to bundle.
* `--out="output/path"` - path to the directory you want to output to the bundle to.
* `--title="App Title"` - the `<title>` tag in `index.html` will contain the argument's value.
* `--debug` - by passing this flag flag, browserify will run in debug mode and the uglify transform will not be applied.

## Projects using this tool

* [duet example app](https://github.com/colingourlay/duet-example-app)
* [duet TodoMVC example app](https://github.com/colingourlay/todomvc/tree/master/examples/duet)
