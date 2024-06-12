# TodoMVC: React

## Description

This application uses React 17.0.2 to implement a todo application.

-   [React](https://reactjs.org/) is a JavaScript library for creating user interfaces.

## Implementation details

React focuses mainly on providing composable user interfaces to enable developers to build an appealing website or web app. React does not force the user to utilize a particular design pattern, but it does provide useful hooks to implement an MVC pattern, if desired. 

React:\
Model: Todo reducer (reducer.js)\
View: React ui components\
Controller: App component + useReducer hook

MVC:\
Model: Maintains the data and behavior of an application\
View: Displays the model in the ui\
Controller: Serves as an interface between view & model components

## Build steps

To build the static files, this application utilizes webpack. It minifies and optimizes output files and copies all necessary files to a `dist` folder.

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
2. npm run serve
```
