# TypeScript & Flux/React TodoMVC Example

> TypeScript is a language for application-scale JavaScript development. TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open Source.

> _[TypeScript - typescriptlang.org](http://typescriptlang.org)_

<br>

> Flux is the application architecture that Facebook uses for building client-side web applications. It complements React's composable view components by utilizing a unidirectional data flow.  is a Javascript library for building user interfaces. React uses a virtual DOM diff implementation for ultra-high performance. 

> _[Flux - facebook.github.io/flux](https://facebook.github.io/flux/)_

<br>

> React is a Javascript library for building user interfaces. React uses a virtual DOM diff implementation for ultra-high performance. 

> _[React - facebook.github.io/react](http://facebook.github.io/react)_


## Learning TypeScript

The [TypeScript website](http://typescriptlang.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Tutorial](http://www.typescriptlang.org/Tutorial)
* [Code Playground](http://www.typescriptlang.org/Playground)
* [Documentation](http://typescript.codeplex.com/documentation)
* [Applications built with TypeScript](http://www.typescriptlang.org/Samples)
* [Blog](http://blogs.msdn.com/b/typescript)
* [Source Code](http://typescript.codeplex.com/sourcecontrol/latest#README.txt)

Articles and guides from the community:

* ["Evolving JavaScript with TypeScript" by Anders Hejlsberg](https://www.youtube.com/watch?v=Ut694dsIa8w)
* [Thoughts on TypeScript](http://www.nczonline.net/blog/2012/10/04/thoughts-on-typescript)
* [ScreenCast - Why I Like TypeScript](http://www.leebrimelow.com/why-i-like-typescripts)

Get help from other TypeScript users:

* [TypeScript on StackOverflow](http://stackoverflow.com/questions/tagged/typescript)
* [Forums](http://typescript.codeplex.com/discussions)
* [TypeScript on Twitter](http://twitter.com/typescriptlang)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

This application is a port of the [flux-todomvc](https://github.com/facebook/flux/tree/master/examples/flux-todomvc) example, which is 
part of Facebook's [Flux](https://github.com/facebook/flux) project.

The original example uses [JSX](http://facebook.github.io/react/docs/jsx-in-depth.html), which is a a JavaScript syntax extension that looks similar to XML. 
Transforming JSX to Javascript is pretty easy as James Brantly explained in his recent React.js Conf 2015 talk 
[Static typing with Flow and TypeScript](http://conf.reactjs.com/schedule.html#static-typing-with-flow-and-typescript).

James Brantly's [reactconf](https://github.com/jbrantly/reactconf) uses [webpack](http://webpack.github.io/) and [ts-jsx-loader](https://github.com/jbrantly/ts-jsx-loader).
This project on the other hand uses [grunt](http://gruntjs.com/) and [grunt-text-replace](https://github.com/yoniholmes/grunt-text-replace) with
[react-tools](https://www.npmjs.com/package/react-tools) and [grunt-browserify](https://github.com/jmreidy/grunt-browserify) instead.

The main reason for [choosing browserify over webpack](http://blog.namangoel.com/browserify-vs-webpack-js-drama) is that
browserify injects node.js polyfills like [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter),
which are used by the original [flux-todomvc](https://github.com/facebook/flux/tree/master/examples/flux-todomvc) example.

During the build phase all `*.tsx` and `*.ts` are first being copied to a temporary `./build` folder and then compiled to Javascript using the Typescript compiler.
A second pass then intelligently replaces `React.jsx(...)` with transformed JSX code. For more details see `./grunt/replace.js`.
The build mechanics are all implemented in `./grunt/aliases.js`. The output folder is `./public`.

This project also supports minification using Google's Closure Compiler.


## Running

You must have [npm](https://www.npmjs.org/) and [grunt](http://gruntjs.com/) installed on your computer. From the root project directory run these commands from the command line:

```
npm install
```

That will install all dependencies. To build the project, first run this command:

```
grunt build
```

That will build `public/js/bundle.js`, which are used by `public/index.html`.
Once you've built the project you can open `public/index.html` in your browser.


## Demo

Please try this live demo:<br>
http://bparadie.github.io/fluxts-todomvc





