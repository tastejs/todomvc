# Riot.js TodoMVC example

> Riot is a 1kb client-side MVP library. A fast, powerful yet tiny tool for building large scale web applications.

> _[Riot.js - moot.it/riotjs](https://moot.it/riotjs)_

## Learning Riot.js

The [Riot.js website](https://moot.it/riotjs) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](https://moot.it/riotjs/docs/)
* [Original Blog post](https://moot.it/blog/technology/riotjs-the-1kb-mvp-framework.html)
* [Frameworkless JavaScript](https://moot.it/blog/technology/frameworkless-javascript.html)
* [Riot.js on GitHub](https://github.com/moot/riotjs)
* [Demo: administration panel](https://moot.it/riotjs/demo/)

Articles and guides from the community:

* [Handmade code and classic programming skills](https://medium.com/code-adventures/22d94cc295bc)
* [Riot.js vs Angular (Chinese)](https://speakerdeck.com/mrorz/wu-ji-bi-fan-riot-dot-js-yu-angular-dot-js-za-tan)


## Implementation

The TodoMVC application is structured according to the [Riot documentation](https://moot.it/riotjs/docs/) about "Building modular applications with Riot.js".

Riot's applications should be divided in well defined modules. Those modules should loosely coupled modules to make then easy reused and tested.

* **Models**: Haddles the data and events related to the its changes.
* **Presenters**: Handles the UI and can bind or trigger events to the given **model**.
* **Routers**: Handle changes on the route and can trigger events on the given **model**.
* **Tests**: Riot's also include a very simple BDD framework that can be used on node or the browser.


## Running

To run Riot's Todo APP just open `todomvc/labs/architecture-examples/riotjs/index.html` in a browser, you can also run the test suite on `todomvc/labs/architecture-examples/riotjs/test/index.html`.

## Credit

This TodoMVC application was created by [Marcelo Eden](https://github.com/3den).
