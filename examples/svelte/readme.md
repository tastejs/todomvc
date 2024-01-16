# TodoMVC: Svelte

## Description

This application uses Svelte 3.58.0 to implement a todoMVC application.

-   [Svelte](https://svelte.dev/) is a tool for building fast web applications. It is similar to JavaScript frameworks such as React and Vue, which share a goal of making it easy to build slick interactive user interfaces.
    But there's a crucial difference: Svelte converts your app into ideal JavaScript at build time, rather than interpreting your application code at run time. This means you don't pay the performance cost of the framework's abstractions, and you don't incur a penalty when your app first loads.

## Implementation details

This app has been inspired by the [official Svelte Todomvc app](https://github.com/sveltejs/svelte-todomvc).

To showcase how a larger application could be architected, we opted to build the todoMVC app with multiple components. 
Components can communicate through events to trigger changes in other components. For example, the Item component dispatchtes the `removeItem` event, which the App component listens for and updates the todo array. 
Additionally, component bindings are used to update automatically any item that changed from within the Item component (`item.description` and `item.completed`). 

Svelte doesn't try to force a specific architectural pattern and instead is a component framework. 
A loose mapping of an MVC pattern:

Svelte:
Model: App component
View: UI components
Controller: App component + component bindings

MVC:
Model: Maintains the data and behavior of an application
View: Displays the model in the ui
Controller: Serves as an interface between view & model components

## Build steps

```
terminal:
1. npm run build
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
