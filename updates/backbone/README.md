# TodoMVC: Backbone

## Description

This application uses Backbone to implement a todo application.

Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.

[backbonejs.org](https://backbonejs.org/)

## Implementation Details

Backbone.js uses a MV(\*) pattern, which is loosely based on the MVC or MVP patterns.

Backbone.js:\
Model: model files\
View: html file in conjunction with underscore's templating solution (see 'Notes')\
Controller: view and router files

MVC:\
Model: maintains the data and behavior of an application\
View: displays the model in the ui\
Controller: serves as an interface between view & model components

#### Notes

- The storage solution uses an in-memory data object (contained in the sync file).\
- Underscore's `template` utility function compiles JavaScript templates into functions that can be evaluated for rendering ([source](https://underscorejs.org/#template)).

## Build Steps

A simple build script copies all necessary files to a `dist` folder.
It does not rely on compilers or transpilers and serves raw html, css and js files to the user.

```
npm run build
```

## Requirements

The only requirement is an installation of Node, to be able to install dependencies and run scripts to serve a local server.

```
* Node (min version: 18.13.0)
* NPM (min version: 8.19.3)
```

## Local Preview

```
terminal:
1. npm install
2. npm run dev
browser:
1. http://localhost:7001/
```
