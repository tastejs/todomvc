# TodoMVC: Angular

## Description

This application uses Angular version 14.2.11. to implement a todo application.

[Angular](https://angular.dev) is a development platform, built on TypeScript. As a platform, Angular includes:

- A component-based framework for building scalable web applications
- A collection of well-integrated libraries that cover a wide variety of features, including routing, forms management, client-server communication, and more
- A suite of developer tools to help you develop, build, test, and update your code

With Angular, you're taking advantage of a platform that can scale from single-developer projects to enterprise-level applications. Angular is designed to make updating as straightforward as possible, so take advantage of the latest developments with minimal effort. Best of all, the Angular ecosystem consists of a diverse group of over 1.7 million developers, library authors, and content creators.

## Implementation details

In Angular, a service can make data and code available to other components, which lends itself to take on the responsiblity of the model. In this case, the todos service handles all CRUD operations of the todos data. 
This application is also organized in components, to allow a modular design of the header, footer and content (todo list + todo items). Each component folder contains a html file for the view and a ts file to act as a controller.

Angular:\
Model: todos.service\
View: Angular component's html\
ViewModel: Angular component's ts

MVC:\
Model: maintains the data and behavior of an application\
View: displays the model in the ui\
Controller: serves as an interface between view & model components

## Build Steps

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

## Local Preview

```
terminal:
1. npm install
2. npm run dev
```
