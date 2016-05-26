# duet • [TodoMVC](http://todomvc.com)

> _[duet](https://github.com/colingourlay/duet)_ is library for building performant apps, based on web workers, which asynchronously exposes APIs to the worker thread that aren't usually available to it (DOM, localStorage, location, etc). You can write duet apps in ES5, but this example uses some ES2015 (ES6) features.

## Installation

To get started with this example, navigate into the example folder and install the NPM modules.
```bash
cd todomvc/examples/duet
npm install
```

## Compiling ES2015 to ES5

After NPM modules have been installed, use the pre-defined **duet** script to convert the ES2015 `src` files into a single ES5 bundle. Under the hood, this uses Babel and Browserify (and UglifyJS when not using the `--debug` flag).

Start your server of choice in the example directory, then run:

```bash
npm run compile
```

...to compile the JS once, and:


```bash
npm run watch
```

...to compile the JS every time you change the source.

## Support

- [Twitter](https://twitter.com/collypops)
- [GitHub](https://github.com/colingourlay)

## Credit

Created by [Colin Gourlay](http://colin-gourlay.com)
