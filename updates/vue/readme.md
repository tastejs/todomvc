# TodoMVC: Vue

## Description

This application uses Vue.js 3.2.47 to implement the TodoMVC application.

-   [Vue.js](https://vuejs.org/) provides efficient MVVM data bindings with a simple and flexible API. It uses plain JavaScript object models, DOM-based templating and extendable directives and filters..

## Implementation details

Vue.js is focused on the ViewModel layer of the MVVM pattern. It connects the View and the Model via two way data bindings. Actual DOM manipulations and output formatting are abstracted away into Directives and Filters.

MVC:\
Model: maintains the data and behavior of an application\
View: displays the model in the ui\
Controller: serves as an interface between view & model components

## Built steps

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
```
