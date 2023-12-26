TodoMVC: JavaScript Es6 with Webpack

## Description

This application uses JavaScript with ES6 language features to implement a todo application.

JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it..

[JavaScript - developer.mozilla.org](http://developer.mozilla.org/en-US/docs/JavaScript)

In addition, this application also relies on [Webpack](https://webpack.js.org/) to generate a build. At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph from one or more entry points and then combines every module your project needs into one or more bundles, which are static assets to serve your content from.

## Implementation Details

This implementation uses an explicit MVC pattern, with a clear file structure to reflect the architecture. The storage solution uses an in-memory data object that implements a simple array to hold the todos.

## Build Steps

To build the static files, this application utilizes webpack. It minifies and optimizes output files and copies all necessary files to a `dist` folder.

```
npm run build
```

## Requirements

The only requirement is an installation of Node, to be able to install dependencies and run scripts to serve a local server.

```
* Node (min version: 18.13.0)
* NPM (min version: 8.19.3)
```

## Local preview

```
terminal:
1. npm install
2. npm run dev

browser:
1. http://localhost:7001/
```
