montage-todomvc
==============

This is a Montage implementation of the TodoMVC application.

TL;DR: The unbundled application code included is for reference only; it is not being executed.

The [source code for this application is available](https://github.com/mczepiel/montage-todomvc) but
in an effort to not include an unminified version of Montage itself in TodoMVC we have run the
application through our build tool, [mop](https://github.com/Motorola-Mobility/montage/tree/master/tools/mop).

Montage applications are authored as CommonJS modules using our own XHR-based dependency management,
enabling us to write pure-HTML templates and boiler-plate-free JavaScript.

Mopping bundles the framework, application code, and HTML templates together into a handful of files
formatted using AMD-style dependency management.

While it would be technically possible to bundle the framework and manually wrap unminified
application code in an AMD-compatible manner for the purposes of this example, it would
not give an accurate impression of how to author Montage applications.

In the future we hope to aid debugging deployed applications with sourcemaps.

[Montage Framework Project](https://github.com/Motorola-Mobility/montage)
