# TodoMVC: React-Redux

## Description

This application uses React in combination with Redux to implement the TodoMVC application.

-   [React](https://reactjs.org/) is a JavaScript library for creating user interfaces.
-   [Redux](https://redux.js.org/) centralizes your application's state.
-   [React-Redux](https://react-redux.js.org/) is designed to work with React's component model.

## Implementation details

This implementation uses Redux to manage state and data flow of the application.
The Redux pattern is similar to a mvc pattern, with the main difference that Redux is unidirectional.
Redux uses actions to dispatch a change, which is captured by reducers that update a central store.
Once the state in the store updates, the view receives the new state and can reflect those changes to the user.

Redux:\
Model: Redux store\
View: React ui components\
Controller: React connected components + Redux reducers

MVC:\
Model: maintains the data and behavior of an application\
View: displays the model in the ui\
Controller: serves as an interface between view & model components

The storage solution uses an in-memory data object that implements a simple array to hold the todos.

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
2. npm run dev
browser:
1. http://localhost:7001/
```
