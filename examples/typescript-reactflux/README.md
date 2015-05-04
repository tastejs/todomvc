# TypeScript & Flux/React TodoMVC Example

> TypeScript is a language for application-scale JavaScript development. TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open Source.

> _[TypeScript - typescriptlang.org](https://typescriptlang.org/)_

<br>

> Flux is the application architecture that Facebook uses for building client-side web applications. It complements React's composable view components by utilizing a unidirectional data flow.  is a Javascript library for building user interfaces. React uses a virtual DOM diff implementation for ultra-high performance.

> _[Flux - facebook.github.io/flux](https://facebook.github.io/flux/)_

<br>

> React is a Javascript library for building user interfaces. React uses a virtual DOM diff implementation for ultra-high performance.

> _[React - facebook.github.io/react](https://facebook.github.io/react/)_


## Learning TypeScript

The [TypeScript website](https://typescriptlang.org/) is a great resource for getting started.

Here are some links you may find helpful:

* [Tutorial](https://www.typescriptlang.org/Tutorial/)
* [Code Playground](https://www.typescriptlang.org/Playground/)
* [Documentation](https://typescript.codeplex.com/documentation/)
* [Applications built with TypeScript](https://www.typescriptlang.org/Samples/)
* [Blog](https://blogs.msdn.com/b/typescript/)
* [Source Code](https://typescript.codeplex.com/sourcecontrol/latest#README.txt/)

Articles and guides from the community:

* ["Evolving JavaScript with TypeScript" by Anders Hejlsberg](https://www.youtube.com/watch?v=Ut694dsIa8w/)
* [Thoughts on TypeScript](https://www.nczonline.net/blog/2012/10/04/thoughts-on-typescript/)
* [ScreenCast - Why I Like TypeScript](https://www.leebrimelow.com/why-i-like-typescripts/)

Get help from other TypeScript users:

* [TypeScript on StackOverflow](https://stackoverflow.com/questions/tagged/typescript/)
* [Forums](https://typescript.codeplex.com/discussions/)
* [TypeScript on Twitter](https://twitter.com/typescriptlang/)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues/)._


## Implementation

This application is a port of the [flux-todomvc](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/) example, which is
part of Facebook's [Flux](https://github.com/facebook/flux/) project.

The original example uses [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html/), which is a a JavaScript syntax extension that looks similar to XML.
Transforming JSX to Javascript is pretty easy as James Brantly explained in his recent React.js Conf 2015 talk
[Static typing with Flow and TypeScript](https://conf.reactjs.com/schedule.html#static-typing-with-flow-and-typescript/).

James Brantly's [reactconf](https://github.com/jbrantly/reactconf/) uses [webpack](https://webpack.github.io/) and [ts-jsx-loader](https://github.com/jbrantly/ts-jsx-loader/).
This project on the other hand uses [grunt](https://gruntjs.com/) and [grunt-text-replace](https://github.com/yoniholmes/grunt-text-replace/) with
[react-tools](https://www.npmjs.com/package/react-tools/) and [grunt-browserify](https://github.com/jmreidy/grunt-browserify/) instead.

The main reason for [choosing browserify over webpack](https://blog.namangoel.com/browserify-vs-webpack-js-drama/) is that
browserify injects node.js polyfills like [EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter/),
which are used by the original [flux-todomvc](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/) example.

During the build phase all `*.tsx` and `*.ts` are first being copied to a temporary `./build` folder and then compiled to Javascript using the Typescript compiler.
A second pass then intelligently replaces `React.jsx(...)` with transformed JSX code. For more details see `./grunt/replace.js`.
The build mechanics are all implemented in `./grunt/aliases.js`. The output folder is `./public`.

This project also supports minification using Google's Closure Compiler.


## Running

You must have [node.js](https://nodejs.org/) installed on your computer, which includes [npm](https://www.npmjs.org/). From the root project directory run these commands from the command line:

```
npm install
```

That will install all dependencies and build `public/js/bundle.js`, which is used by `public/index.html`.
Once you've built the project you can open `public/index.html` in your browser, or simply run `npm start`.


## Demo

Please try this live demo:<br>
https://bparadie.github.io/fluxts-todomvc
