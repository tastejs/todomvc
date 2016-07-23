# soma.js TodoMVC App

This is a todo app built using [soma.js](http://somajs.github.io/somajs/).

## Framework

soma.js is a framework created to build scalable and maintainable javascript applications.

The success to build large-scale applications will rely on smaller single-purposed parts of a larger system. soma.js provides tools to create a loosely-coupled architecture broken down into smaller pieces.

The different components of an application can be modules, models, views, plugins or widgets. soma.js will not dictate its own structure, the framework can be used as a model-view-controller framework, can be used to create independent modules, sandboxed widgets or anything that will fit a specific need.

For a system to grow and be maintainable, its parts must have a very limited knowledge of their surrounding. The components must not be tied to each other (Law of Demeter), in order to be re-usable, interchangeable and allow the system to scale up.

soma.js is a set of tools and design patterns to build a long term architecture that are decoupled and easily testable. The tools provided by the framework are dependency injection, observer pattern, mediator pattern, facade pattern, command pattern, OOP utilities and a DOM manipulation template engine as an optional plugin.

## Implementation

The application starts by instantiating the application main entry point (/js/app.js).

The application contains two models:

* A router model ([Director](https://github.com/flatiron/director)) to handle the routes: all/active/completed.
* A todo model saving the todo items to the local storage.

The todo app DOM element has been cut into 3 views:

* A header view handling the input that creates todo items.
* A main view displaying the list of todo items and the buttons to manage them.
* A footer view displaying information, the filters and the clear completed button.

The application instance creates 2 mapping rules: "router" and "model", so the two models can be injected in the templates seamlessly using their injection names.

The application instance also creates three templates that represent DOM Elements using the optional plugin [soma-template](http://soundstep.github.io/soma-template/) (web template engine).

Finally, the application dispatches a custom event "render", that all templates are listening to, to render the DOM with the right content.

## Running

Install the libraries needed using bower ([soma.js](http://somajs.github.io/somajs/), [soma-template](http://soundstep.github.io/soma-template/), [director](https://github.com/flatiron/director), [require.js](http://requirejs.org/docs/api.html)):

	bower install

To run the app, spin up an HTTP server and visit `examples/somajs_require/`.
