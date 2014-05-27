# React Coffeescript TodoMVC

Implementation of [TodoMVC](http://todomvc.com) using [React](http://facebook.github.io/react/) and [Coffeescript](http://coffeescript.org), following [this](https://news.ycombinator.com/item?id=7232695) discussion.

Heavily influenced by the [TodoMVC official implementation using react](https://github.com/tastejs/todomvc/tree/gh-pages/architecture-examples/react).

In my opinion, this is one of the most developper friendly framework/language combination for web app development in early 2014, and one of the most performant too.

## Demo

The demo is running [here](http://crubier.github.io/todomvc-react-coffee/)

## Running

To install needed packages, `cd` to this project's folder, then:

```
npm install
```

Once installed, you just need to:

```
grunt
```

And as instructed, open the result in your browser when the server is running: 

[http://localhost:8080](http://localhost:8080)

## Debugging using source maps

To debug in the browser, launch the dev task, which builds with (inlined) sourcemaps:

```
grunt dev
```

## Dependencies

The dependencies are installed automatically by npm.

- [React](http://facebook.github.io/react/), of course
- [Coffeescript](http://coffeescript.org), of course
- [Grunt](http://gruntjs.com), to build
- [TodoMVC-Common](https://github.com/tastejs/todomvc-common), for CSS files
- [Bower](http://bower.io), to import TodoMVC Common elements
- [Webpack](http://webpack.github.io), to generate the client-side script bundle
- [Director](https://github.com/flatiron/director), for client-side routing
- [Http Server](https://github.com/nodeapps/http-server), to serve while developping
- And the appropriates grunt modules for those packages




