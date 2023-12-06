# TodoMvc

## Description

This application was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

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

## TodoMVC specific details

- All styles are included from local packages: [todomvc-app.css](https://www.npmjs.com/package/todomvc-app-css) & [todomvc-common](https://www.npmjs.com/package/todomvc-common).
- A hash router was used to ensure the app has consistent behavior with other apps.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
