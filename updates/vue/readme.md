# TodoMVC: Vue

## Description

This application uses Vue.js 3.3.10 to implement the TodoMVC application.

-   [Vue.js](https://vuejs.org/) provides efficient MVVM data bindings with a simple and flexible API. It uses plain JavaScript object models, DOM-based templating and extendable directives and filters..

## Implementation details

Vue.js is focused on the ViewModel layer of the MVVM pattern. It connects the View and the Model via two way data bindings. Actual DOM manipulations and output formatting are abstracted away into Directives and Filters.

MVC:\
Model: maintains the data and behavior of an application\
View: displays the model in the ui\
Controller: serves as an interface between view & model components

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
