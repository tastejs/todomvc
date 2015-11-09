# JavaScript ES6 (or ES2015) TodoMVC Example

An exact port of the [Vanilla JS Example](http://todomvc.com/examples/vanillajs/), but translated into ES6, also known as ES2015. Uses [Babel JS](https://babeljs.io/) to compile ES6 code to ES5, which is then readable by all browsers.

To learn more about the changes in ES6, visit [ES6 Features](https://github.com/lukehoban/es6features).

## Tooling

Any ES6 compiler will work just fine. For rapid builds and a complete toolkit, [Fannypack](https://github.com/lukeed/fannypack) has been included as the preferred choice.

## Installation
```bash
npm install
```

## Development
Run all compile tasks, then initialize the BrowserSync live-reload server. This will watch file changes & auto-compile your changes:
```bash
npm run gulp
```

## Production
Concatenate & Minify production-ready assets:
```bash
npm run production
```

## Versioning
Append unique hash IDs to your filenames, also known as **Cache Busting**. References (`href` and `src`) inside your HTML file will be updated with your hashed filenames
```bash
npm run version
```

## Production Server
After production assets have been compiled, you can start a production server (no BrowserSync) which will serve the new assets.
```bash
npm run gulp server
```
