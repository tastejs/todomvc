# ES6+ on legacy browsers

- [Setup](#setup)
- [Using Babel with Webpack](#using-babel-with-webpack)

---

Mithril is written in ES5, but it's fully compatible with ES6 and later as well. All modern browsers do support it natively, up to and even including native module syntax. (They don't support Node's magic module resolution, so you can't use `import * as _ from "lodash-es"` or similar. They just support relative and URL paths.) And so you can feel free to use [arrow functions for your closure components and classes for your class components](components.md).

But, if like many of us, you still need to support older browsers like Internet Explorer, you'll need to transpile that down to ES5, and this is what this page is all about, using [Babel](https://babeljs.io) to make modern ES6+ code work on older browsers.

---

### Setup

First, if you haven't already, make sure you have [Node](https://nodejs.org/en/) installed. It comes with [npm](https://www.npmjs.com/) pre-bundled, something we'll need soon.

Once you've got that downloaded, open a terminal and run these commands:

```bash
# Replace this with the actual path to your project. Quote it if it has spaces,
# and single-quote it if you're on Linux/Mac and it contains a `$` anywhere.
cd "/path/to/your/project"

# If you have a `package.json` there already, skip this command.
npm init
```

Now, you can go one of a couple different routes:

- [Use Babel standalone, with no bundler at all](#using-babel-standalone)
- [Use Babel and bundle with Webpack](#using-babel-with-webpack)

#### Using Babel standalone

First, we need to install a couple dependencies we need.

- `@babel/cli` installs the core Babel logic as well as the `babel` command.
- `@babel/preset-env` helps Babel know what to transpile and how to transpile them.

```bash
npm install @babel/cli @babel/preset-env --save-dev
```

Now, create a `.babelrc` file and set up with `@babel/preset-env`.

```json
{
	"presets": ["@babel/preset-env"],
	"sourceMaps": true
}
```

And finally, if you have *very* specific requirements on what you need to support, you may want to [configure Browserslist](https://github.com/browserslist/browserslist) so Babel (and other libraries) know what features to target.

*By default, if you don't configure anything, Browserslist uses a fairly sensible query: `> 0.5%, last 2 versions, Firefox ESR, not dead`. Unless you have very specific circumstances that require you to change this, like if you need to support IE 8 with a lot of polyfills, don't bother with this step.*

Whenever you want to compile your project, run this command, and everything will be compiled.

```bash
babel src --out-dir dist
```

You may find it convenient to use an npm script so you're not having to remember this and typing it out every time. Add a `"build"` field to the `"scripts"` object in your `package.json`:

```json
{
	"scripts": {
		"build": "babel src --out-dir dist"
	}
}
```

And now, the command is a little easier to type and remember.

```bash
npm run build
```

#### Using Babel with Webpack

If you want to use Webpack to bundle, it's a few more steps to set up. First, we need to install all the dependencies we need for both Babel and Webpack.

- `webpack` is the core Webpack code and `webpack-cli` gives you the `webpack` command.
- `@babel/core` is the core Babel code, a peer dependency for `babel-loader`.
- `babel-loader` lets you teach Webpack how to use Babel to transpile your files.
- `@babel/preset-env` helps Babel know what to transpile and how to transpile them.

```bash
npm install webpack webpack-cli @babel/core babel-loader @babel/preset-env --save-dev
```

Now, create a `.babelrc` file and set up with `@babel/preset-env`.

```json
{
	"presets": ["@babel/preset-env"],
	"sourceMaps": true
}
```

Next, if you have *very* specific requirements on what you need to support, you may want to [configure Browserslist](https://github.com/browserslist/browserslist) so Babel (and other libraries) know what features to target.

*By default, if you don't configure anything, Browserslist uses a fairly sensible query: `> 0.5%, last 2 versions, Firefox ESR, not dead`. Unless you have very specific circumstances that require you to change this, like if you need to support IE 8 with a lot of polyfills, don't bother with this step.*

And finally, set up Webpack by creating a file called `webpack.config.js`.

```javascript
const path = require('path')

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js',
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /\/node_modules\//,
			use: {
				loader: 'babel-loader'
			}
		}]
	}
}
```

This configuration assumes the source code file for the application entry point is in `src/index.js`, and this will output the bundle to `dist/app.js`.

Now, to run the bundler, you just run this command:

```bash
webpack -d --watch
```

You may find it convenient to use an npm script so you're not having to remember this and typing it out every time. Add a `"build"` field to the `"scripts"` object in your `package.json`:

```json
{
	"scripts": {
		"start": "webpack -d --watch"
	}
}
```

And now, the command is a little easier to type and remember.

```bash
npm start
```

For production builds, you'll want to minify your scripts. Luckily, this is also pretty easy: it's just running Webpack with a different option.

```bash
webpack -p
```

You may want to also add this to your npm scripts, so you can build it quickly and easily.

```json
{
	"scripts": {
		"start": "webpack -d --watch",
		"build": "webpack -p"
	}
}
```

And then running this is a little easier to remember.

```bash
npm run build
```

And of course, you can do this in automatic production build scripts, too. Here's how it might look if you're using [Heroku](https://www.heroku.com/), for example:

```json
{
	"scripts": {
		"start": "webpack -d --watch",
		"build": "webpack -p",
		"heroku-postbuild": "webpack -p"
	}
}
```
