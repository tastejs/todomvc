# Polymer 2 TodoMVC Example

> Polymer is a new type of library for the web, built on top of Web Components, and designed to leverage the evolving web platform on modern browsers.

> _[Polymer - www.polymer-project.org](https://www.polymer-project.org/)_

## Learning Polymer

The [Polymer website](https://www.polymer-project.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Get Started](https://www.polymer-project.org/2.0/start/)
* [Browser Support](https://www.polymer-project.org/2.0/docs/browsers)

Get help from Polymer devs and users:

* Find us Slack - polymer.slack.com
* Join the high-traffic [polymer-dev](https://groups.google.com/forum/?fromgroups=#!forum/polymer-dev) Google group or the announcement-only [polymer-announce](https://groups.google.com/forum/?fromgroups=#!forum/polymer-announce) Google group.

## Implementation

The Polymer implementation of TodoMVC has a few key differences with other implementations:

* [Web Components](http://w3c.github.io/webcomponents/explainer/) allow you to create new HTML elements that are reusable, composable, and encapsulated.
* Non-visual elements such as the router and the model are also implemented as custom elements and appear in the DOM. Implementing them as custom elements instead of plain objects allows you to take advantage of Polymer's data binding and event handling throughout the app.

## Compatibility

Polymer and the web component polyfills are intended to work in the latest version of [evergreen browsers](http://tomdale.net/2013/05/evergreen-browsers/). IE9 is not supported. Please refer to [Browser Support](https://www.polymer-project.org/2.0/docs/browsers) for more details.

## Running this sample

1. Install [node.js](nodejs.org) (required for the `polymer` CLI tool)

1. From the `todomvc\polymer2` folder, run `npm install`
1. Start a web server in the `todomvc\polymer2` folder: `python -m SimpleHTTPServer`

1. Browse to the server root: http://localhost:8000/index.html
