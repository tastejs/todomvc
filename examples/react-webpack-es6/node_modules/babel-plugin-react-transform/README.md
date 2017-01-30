# babel-plugin-react-transform

This Babel plugin wraps all React components into arbitrary transforms written by the community.  
In other words, **it lets you instrument React components** in any custom way.

Such transforms can do a variety of things:

* catch errors inside `render()` like **[react-transform-catch-errors](https://github.com/gaearon/react-transform-catch-errors)**;
* enable hot reloading like **[react-transform-hmr](https://github.com/gaearon/react-transform-hmr)**;
* render an inline prop inspector like **[react-transform-debug-inspector](https://github.com/alexkuz/react-transform-debug-inspector)**;
* highlight parts of the screen when components update like
**[react-transform-render-visualizer](https://github.com/spredfast/react-transform-render-visualizer)**;
* etc.

The limit is your imagination and the time you feel compelled to spend on writing these transforms.  
Time will show whether it is an amazing, or a terrible idea.

[![react-transform channel on slack](https://img.shields.io/badge/slack-react--transform%40reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)

## Demo

Check out **[react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate)** for a demo showing a combination of transforms.

![](http://i.imgur.com/AhGY28T.gif)

## Installation

First, install the plugin:

```
npm install --save-dev babel-plugin-react-transform
```

Then, install the transforms you’re interested in:

```
npm install --save-dev react-transform-hmr
npm install --save-dev react-transform-catch-errors
```

Then edit your `.babelrc` to include `extra.react-transform`.  
It must be an object with a `transforms` property being an array of the transforms you want to use:

```js
{
  "stage": 0,
  "env": {
    // this plugin will be included only in development mode, e.g.
    // if NODE_ENV (or BABEL_ENV) environment variable is not set
    // or is equal to "development"
    "development": {
      "plugins": [
        // Include babel-plugin-react-display-name if you’re
        // using React.createClass() *before* react-transform:
        // "react-display-name",
        "react-transform"
      ],
      "extra": {
        // must be an object
        "react-transform": {
          // must be an array
          "transforms": [{
            // can be an NPM module name or a local path
            "transform": "react-transform-hmr",
            // see specific transform's docs for "imports" and "locals" it needs
            "imports": ["react"],
            "locals": ["module"]
          }, {
            // you can have many transforms, not just one
            "transform": "react-transform-catch-errors",
            "imports": ["react", "redbox-react"]
          }, {
            // can be an NPM module name or a local path
            "transform": "./src/my-custom-transform"
          }]
        },
        // by default we only look for `React.createClass` (and ES6 classes)
        // but you can tell the plugin to look for different component factories:
        // factoryMethods: ["React.createClass", "createClass"]
      }
    }
  }
}
```

As you can see each transform, apart from the `transform` field where you write it name, also has `imports` and `locals` fields. You should consult the docs of each individual transform to learn which `imports` and `locals` it might need, and how it uses them. You probably already guessed that this is just a way to inject local variables (like `module`) or dependencies (like `react`) into the transforms that need them.

Note that when using `React.createClass()` and allowing `babel` to extract the `displayName` property you must ensure that [babel-plugin-react-display-name](https://github.com/babel/babel/tree/development/packages/babel-plugin-react-display-name) is included before `react-transform`. See [this github issue](https://github.com/gaearon/babel-plugin-react-transform/issues/19) for more details.

You may optionally specify an array of strings called `factoryMethods` if you want the plugin to look for components created with a factory method other than `React.createClass`. Note that you don’t have to do anything special to look for ES6 components—`factoryMethods` is only relevant if you use factory methods akin to `React.createClass`.

## Writing a Transform

It’s not hard to write a custom transform! First, make sure you call your NPM package `react-transform-*` so we have uniform naming across the transforms. The only thing you should export from your transform module is a function.

```js
export default function myTransform() {
  // ¯\_(ツ)_/¯
}
```

This function should *return another function*:

```js
export default function myTransform() {
  return function wrap(ReactClass) {
    // ¯\_(ツ)_/¯
    return ReactClass;
  }
}
```

As you can see, you’ll receive `ReactClass` as a parameter. It’s up to you to do something with it: monkeypatch its methods, create another component with the same prototype and a few different methods, wrap it into a higher-order component, etc. Be creative!

```js
export default function logAllUpdates() {
  return function wrap(ReactClass) {
    const displayName = // ¯\_(ツ)_/¯
    const originalComponentDidUpdate = ReactClass.prototype.componentDidUpdate;

    ReactClass.prototype.componentDidUpdate = function componentDidUpdate() {
      console.info(`${displayName} updated:`, this.props, this.state);

      if (originalComponentDidUpdate) {
        originalComponentDidUpdate.apply(this, arguments);
      }
    }

    return ReactClass;
  }
}
```

Oh, how do I get `displayName`?  
Actually, we give your transformation function a single argument called `options`. Yes, `options`:

```js
export default function logAllUpdates(options) {
```

It contains some useful data. For example, your `options` could look like this:

```js
{
  // the file being processed
  filename: '/Users/dan/p/my-projects/src/App.js',
  // remember that "imports" .babelrc option?
  imports: [React],
  // remember that "locals" .babelrc option?
  locals: [module],
  // all components declared in the current file
  components: {
    $_MyComponent: {
      // with their displayName when available
      displayName: 'MyComponent'
    },
    $_SomeOtherComponent: {
      displayName: 'SomeOtherComponent',
      // and telling whether they are defined inside a function
      isInFunction: true
    }
  }
}
```

Of course, you might not want to use *all* options, but isn’t it nice to know that you have access to them in the top scope—which means before the component definitions actually run? (Hint: a hot reloading plugin might use this to decide whether a module is worthy of reloading, even if it contains an error and no React components have yet been wrapped because of it.)

So, to retrieve the `displayName` (or `isInFunction`, when available), use the `options` parameter *and* the second `uniqueId` parameter given to the inner function after `ReactClass`:

```js
export default function logAllUpdates(options) {
  return function wrap(ReactClass, uniqueId) {
    const displayName = options.components[uniqueId].displayName || '<Unknown>';
```

This is it!

Sure, it’s a slightly contrived example, as you can grab `ReactClass.displayName` just fine, but it illustrates a point: you have information about all of the components inside a file before that file executes, which is *very* handy for some transformations.

Here is the complete code for this example transformation function:

```js
export default function logAllUpdates(options) {
  return function wrap(ReactClass, uniqueId) {
    const displayName = options.components[uniqueId].displayName || '<Unknown>';
    const originalComponentDidUpdate = ReactClass.prototype.componentDidUpdate;

    ReactClass.prototype.componentDidUpdate = function componentDidUpdate() {
      console.info(`${displayName} updated:`, this.props, this.state);

      if (originalComponentDidUpdate) {
        originalComponentDidUpdate.apply(this, arguments);
      }
    }

    return ReactClass;
  }
}
```

Now go ahead and write your own!  
Don’t forget to tag it with `react-transform` keyword on npm.

## Ecosystem

* **https://github.com/gaearon/react-transform-boilerplate**
* **https://github.com/gaearon/react-transform-hmr**
* **https://github.com/gaearon/react-transform-catch-errors**
* **https://github.com/alexkuz/react-transform-debug-inspector**
* Feeling inspired? Send a PR!

## Discussion

You can discuss React Transform and related projects in **#react-transform** channel on [Reactiflux Slack](http://reactiflux.com).

## Patrons

The work on React Transform, [React Hot Loader](https://github.com/gaearon/react-hot-loader), [Redux](https://github.com/rackt/redux), and related projects was [funded by the community](https://www.patreon.com/reactdx). Meet some of the outstanding companies that made it possible:

* [Webflow](http://webflow.com/)
* [Chess iX](http://www.chess-ix.com/)

[See the full list of React Transform patrons.](PATRONS.md)

## License

MIT
