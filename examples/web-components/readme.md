# TodoMVC: Web Components

## Description

A todoMVC application implemented with native web components.
It utilizes custom elements and html templates to build reusable components.

In contrast to other workloads, this application uses an updated set of css rules and an optimized dom structure to ensure the application follows best practices in regards to accessibility.

## Implementation Details

This example uses custom events, originating from user interactions, that the app is listening for. 
The app in this case has two roles: it is the model as well as the controller.

Web Components Example:
Model: App (todo-app)
View: Components (todo-bottombar, todo-item, todo-list, todo-topbar)
Controller: App (todo-app)

MVC:
Model: Maintains the data and behavior of an application
View: Displays the model in the ui
Controller: Serves as an interface between view & model components

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
1. http://localhost:7005/
```
