# Installation

- [CDN](#cdn)
- [npm](#npm)
- [Quick start with Webpack](#quick-start-with-webpack)
- [TypeScript](#typescript)

### CDN

If you're new to JavaScript or just want a very simple setup to get your feet wet, you can get Mithril from a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network):

```html
<script src="https://unpkg.com/mithril/mithril.js"></script>
```

---

### npm

```bash
$ npm install mithril --save
```

TypeScript type definitions are available from DefinitelyTyped. They can be installed with:

```bash
$ npm install @types/mithril --save-dev
```

For example usage, to file issues or to discuss TypeScript related topics visit: https://github.com/MithrilJS/mithril.d.ts

Type definitions for pre-release versions of Mithril (on the `next` branch) align with the `next` branch of the [types development repo](https://github.com/MithrilJS/mithril.d.ts/tree/next). You can install these types with:

```bash
$ npm install -D MithrilJS/mithril.d.ts#next
```

---

### Quick start with Webpack

1. Initialize the directory as an npm package
```bash
$ npm init --yes
```

2. install required tools
```bash
$ npm install mithril --save
$ npm install webpack webpack-cli --save-dev
```

3. Add a "start" entry to the scripts section in `package.json`.
```javascript
{
	// ...
	"scripts": {
		"start": "webpack src/index.js --output bin/app.js -d --watch"
	}
}
```

4. Create `src/index.js` file.
```javascript
import m from "mithril";
m.render(document.body, "hello world");
```

5. create `index.html`
```html
<!DOCTYPE html>
<body>
    <script src="bin/app.js"></script>
</body>
```

6. run bundler
```bash
$ npm start
```

7. open `index.html` in a browser

#### Step by step

For production-level projects, the recommended way of installing Mithril is to use npm.

npm is the default package manager that is bundled w/ Node.js. It is widely used as the package manager for both client-side and server-side libraries in the JavaScript ecosystem. Download and install [Node](https://nodejs.org); npm is bundled with that and installed alongside it.

To use Mithril via npm, go to your project folder, and run `npm init --yes` from the command line. This will create a file called `package.json`.

```bash
npm init --yes
# creates a file called package.json
```

Then, to install Mithril, run:

```bash
npm install mithril --save
```

This will create a folder called `node_modules`, and a `mithril` folder inside of it. It will also add an entry under `dependencies` in the `package.json` file

You are now ready to start using Mithril. The recommended way to structure code is to modularize it via CommonJS modules:

```javascript
// index.js
var m = require("mithril")

m.render(document.body, "hello world")
```

Modularization is the practice of separating the code into files. Doing so makes it easier to find code, understand what code relies on what code, and test.

CommonJS is a de-facto standard for modularizing JavaScript code, and it's used by Node.js, as well as tools like [Browserify](http://browserify.org/) and [Webpack](https://webpack.js.org/). It's a robust, battle-tested precursor to ES6 modules. Although the syntax for ES6 modules is specified in Ecmascript 6, the actual module loading mechanism is not. If you wish to use ES6 modules despite the non-standardized status of module loading, you can use tools like [Rollup](https://rollupjs.org/) or [Babel](https://babeljs.io/).

Most browser today do not natively support modularization systems (CommonJS or ES6), so modularized code must be bundled into a single JavaScript file before running in a client-side application.

A popular way for creating a bundle is to setup an npm script for [Webpack](https://webpack.js.org/). To install Webpack, run this from the command line:

```bash
npm install webpack webpack-cli --save-dev
```

Open the `package.json` that you created earlier, and add an entry to the `scripts` section:

```json
{
	"name": "my-project",
	"scripts": {
		"start": "webpack src/index.js --output bin/app.js -d --watch"
	}
}
```

Remember this is a JSON file, so object key names such as `"scripts"` and `"start"` must be inside of double quotes.

The `-d` flag tells webpack to use development mode, which produces source maps for a better debugging experience.

The `--watch` flag tells webpack to watch the file system and automatically recreate `app.js` if file changes are detected.

Now you can run the script via `npm start` in your command line window. This looks up the `webpack` command in the npm path, reads `index.js` and creates a file called `app.js` which includes both Mithril and the `hello world` code above. If you want to run the `webpack` command directly from the command line, you need to either add `node_modules/.bin` to your PATH, or install webpack globally via `npm install webpack -g`. It's, however, recommended that you always install webpack locally and use npm scripts, to ensure builds are reproducible in different computers.

```
npm start
```

Now that you have created a bundle, you can then reference the `bin/app.js` file from an HTML file:

```html
<html>
  <head>
    <title>Hello world</title>
  </head>
  <body>
    <script src="bin/app.js"></script>
  </body>
</html>
```

As you've seen above, importing a module in CommonJS is done via the `require` function. You can reference npm modules by their library names (e.g. `require("mithril")` or `require("jquery")`), and you can reference your own modules via relative paths minus the file extension (e.g. if you have a file called `mycomponent.js` in the same folder as the file you're importing to, you can import it by calling `require("./mycomponent")`).

To export a module, assign what you want to export to the special `module.exports` object:

```javascript
// mycomponent.js
module.exports = {
	view: function() {return "hello from a module"}
}
```

In the `index.js`, you would then write this code to import that module:

```javascript
// index.js
var m = require("mithril")

var MyComponent = require("./mycomponent")

m.mount(document.body, MyComponent)
```

Note that in this example, we're using `m.mount`, which wires up the component to Mithril's autoredraw system. In most applications, you will want to use `m.mount` (or `m.route` if your application has multiple screens) instead of `m.render` to take advantage of the autoredraw system, rather than re-rendering manually every time a change occurs.

#### Production build

If you open bin/app.js, you'll notice that the Webpack bundle is not minified, so this file is not ideal for a live application. To generate a minified file, open `package.json` and add a new npm script:

```json
{
	"name": "my-project",
	"scripts": {
		"start": "webpack src/index.js --output bin/app.js -d --watch",
		"build": "webpack src/index.js --output bin/app.js -p",
	}
}
```

You can use hooks in your production environment to run the production build script automatically. Here's an example for [Heroku](https://www.heroku.com/):

```json
{
	"name": "my-project",
	"scripts": {
		"start": "webpack -d --watch",
		"build": "webpack -p",
		"heroku-postbuild": "webpack -p"
	}
}
```

---

### Alternate ways to use Mithril

#### Live reload development environment

Live reload is a feature where code changes automatically trigger the page to reload. [Budo](https://github.com/mattdesl/budo) is one tool that enables live reloading.

```bash
# 1) install
npm install mithril --save
npm install budo -g

# 2) add this line into the scripts section in package.json
#	"scripts": {
#		"start": "budo --live --open index.js"
#	}

# 3) create an `index.js` file

# 4) run budo
npm start
```

The source file `index.js` will be compiled (bundled) and a browser window opens showing the result. Any changes in the source files will instantly get recompiled and the browser will refresh reflecting the changes.

#### Vanilla

If you don't have the ability to run a bundler script due to company security policies, there's an options to not use a module system at all:

```html
<html>
  <head>
    <title>Hello world</title>
  </head>
  <body>
    <script src="https://unpkg.com/mithril/mithril.js"></script>
    <script src="index.js"></script>
  </body>
</html>
```

```javascript
// index.js

// if a CommonJS environment is not detected, Mithril will be created in the global scope
m.render(document.body, "hello world")
```
