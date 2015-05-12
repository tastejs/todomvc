# Webrx TodoMVC Example

## About WebRx

WebRx is a browser-based MVVM-Framework that combines functional-reactive programming with declarative Data-Binding, Templating and Client-Side Routing.

The framework is written in [Typescript](http://www.typescriptlang.org/) and built on top of [ReactiveX for Javascript (RxJs)](http://reactivex.io) which is a
powerful set of libraries for processing and querying asynchronous data-streams that can originate from diverse sources such as Http-Requests, Input-Events, Timers and much more.

## Routing

The routing implementation in the example uses the HTML5 history and thus does
not create valid URLs when run without a proper server configuration. This issue
is tracked as [#1293](https://github.com/tastejs/todomvc/issues/1293).

## TodoMVC

This TodoMVC implementation demonstrates many of the framework's built-in core features:

- [View-Models](http://webrxjs.org/docs#topic-mvvm-intro)
- [Observable Properties](http://webrxjs.org/docs/observable-properties.html) and [Output Properties](http://webrxjs.org/docs/output-properties.html)
- [Observable Lists](http://webrxjs.org/docs/observable-lists.html) and Projections
- [Commands](http://webrxjs.org/docs/commands.html)
- [Data-Binding](http://webrxjs.org/docs/binding-syntax.html)
- [Routing](http://webrxjs.org/docs/routing-overview.html)

## Learning WebRx

Here are some links you may find helpful:

* [Website](http://webrxjs.org) is a great resource for getting started.
* [Documentation](http://webrxjs.org/docs/)
