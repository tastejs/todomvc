# Montage TodoMVC Example

> The Montage framework lets you develop rich HTML5 applications optimized for today and tomorrow’s range of connected devices. You can build rich client-side UI’s, sharing packages and modules with your NodeJS server. Montage opens a new world of opportunity for web developers.

> _[Montage - montagejs.org](http://montagejs.org)_


## Learning Montage

The [Montage website](http://montagejs.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Quick Start](http://montagejs.org/docs/Quick-Start)
* [Documentation](http://montagejs.org/docs)
* [API Reference](http://montagejs.org/apis)
* [Applications built with Montage](http://montagejs.org/apps)
* [Montage on GitHub](https://github.com/montagejs/montage)
* [Minit - Montage Initializer](https://github.com/montagejs/minit)
* [MOP - Montage Optimizer](https://github.com/montagejs/mop)

Articles and guides from the community:

* [YouTube - Getting Started](http://www.youtube.com/watch?v=JfT1ML200JI)

Get help from other Montage users:

* [IRC](http://webchat.freenode.net/?channels=montage)
* [Mailing list on Google Groups](https://groups.google.com/forum/?fromgroups#!forum/montagejs)
* [Montage on Twitter](http://twitter.com/montage_js)
* [Montage on Google +](https://plus.google.com/116915300739108010954)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

TL;DR: The unbundled application code included is for reference only; it is not being executed.

The [source code for this application is available](https://github.com/mczepiel/montage-todomvc), but in an effort to not include an unminified version of Montage itself in TodoMVC we have run the application through our build tool, [mop](https://github.com/Motorola-Mobility/montage/tree/master/tools/mop).

Montage applications are authored as CommonJS modules using our own XHR-based dependency management,
enabling us to write pure-HTML templates and boiler-plate-free JavaScript.

Mopping bundles the framework, application code, and HTML templates together into a handful of files
formatted using AMD-style dependency management.

While it would be technically possible to bundle the framework and manually wrap unminified application code in an AMD-compatible manner for the purposes of this example, it would not give an accurate impression of how to author Montage applications.

In the future we hope to aid debugging deployed applications with sourcemaps.
