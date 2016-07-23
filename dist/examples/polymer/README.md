# Polymer TodoMVC Example

> Polymer is a new type of library for the web, built on top of Web Components, and designed to leverage the evolving web platform on modern browsers.

> _[Polymer - www.polymer-project.org](https://www.polymer-project.org/)_

## Learning Polymer

The [Polymer website](https://www.polymer-project.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Getting Started](https://www.polymer-project.org/1.0/docs/start/getting-the-code.html)
* [FAQ](https://www.polymer-project.org/0.5/resources/faq.html) (old)
* [Browser Compatibility](https://www.polymer-project.org/1.0/resources/compatibility.html)

Get help from Polymer devs and users:

* Find us Slack - polymer.slack.com
* Join the high-traffic [polymer-dev](https://groups.google.com/forum/?fromgroups=#!forum/polymer-dev) Google group or the announcement-only [polymer-announce](https://groups.google.com/forum/?fromgroups=#!forum/polymer-announce) Google group.

## Implementation

The Polymer implementation of TodoMVC has a few key differences with other implementations:

* [Web Components](http://w3c.github.io/webcomponents/explainer/) allow you to create new HTML elements that are reusable, composable, and encapsulated.
* Non-visual elements such as the router and the model are also implemented as custom elements and appear in the DOM. Implementing them as custom elements instead of plain objects allows you to take advantage of Polymer's data binding and event handling throughout the app.

## Compatibility

Polymer and the web component polyfills are intended to work in the latest version of [evergreen browsers](http://tomdale.net/2013/05/evergreen-browsers/). IE9 is not supported. Please refer to [Browser Compatibility](https://www.polymer-project.org/1.0/resources/compatibility.html) for more details.

## Running this sample

1. Install [node.js](nodejs.org) (required for `bower` client-side package management)
1. Install bower: `npm install -g bower`

1. From the `todomvc\` folder, run `bower update`
1. Start a web server in the `todomvc\` folder.  Hint: if you have python installed, you can just run:

     `python -m SimpleHTTPServer`

1. Browse to the server root

## Making updates

If you want to make a change to any of the elements in elements/elements.html, you'll need to install `polybuild` (Polymer's build tool) and re-vulcanize elements.build.html.

1. Run `npm install` (first time only)
1. Make a change
1. Run `npm run build`
