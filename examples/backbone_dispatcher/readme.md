# Backbone.js TodoMVC Example

> Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.

> _[Backbone.js - backbonejs.org](http://backbonejs.org)_


> Flux is the application architecture that Facebook uses for building client-side web applications. It complements React's composable view components by utilizing a unidirectional data flow. It's more of a pattern rather than a formal framework, and you can start using Flux immediately without a lot of new code.

> _[Facebook - https://facebook.github.io/flux/](https://facebook.github.io/flux/)_

[Backbone Dispatcher](https://github.com/talyssonoc/backbone-dispatcher/) let's you use Flux architecture with Backbone instead of React, where Collections/Models are the Stores, like this:

```
╔════════════╗       ╔════════════════════╗       ╔═══════╗
║ Dispatcher ║──────>║ Models/Collections ║──────>║ Views ║
╚════════════╝       ╚════════════════════╝       ╚═══════╝
     ^                                                │
     └────────────────────────────────────────────────┘

``` 

## Learning Backbone.js

The [Backbone.js website](http://backbonejs.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Annotated source code](http://backbonejs.org/docs/backbone.html)
* [Applications built with Backbone.js](http://backbonejs.org/#examples)
* [FAQ](http://backbonejs.org/#faq)

Articles and guides from the community:

* [Developing Backbone.js Applications](http://addyosmani.github.io/backbone-fundamentals)
* [Collection of tutorials, blog posts, and example sites](https://github.com/documentcloud/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites)

Get help from other Backbone.js users:

* [Backbone.js on StackOverflow](http://stackoverflow.com/questions/tagged/backbone.js)
* [Google Groups mailing list](https://groups.google.com/forum/#!forum/backbonejs)
* [Backbone.js on Twitter](http://twitter.com/documentcloud)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Learning the Flux Architecture

[Facebook Flux website](https://facebook.github.io/flux/docs/overview.html#content) has a great explanation of how the Flux architecture works, why it's different
and easier to debug than MVC.