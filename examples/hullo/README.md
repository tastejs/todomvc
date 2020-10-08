# **Hullo** Todo<font face="sans-serif" color=#b12d2b>MVC</font> Example

This example illustrates the usage of **Hullo**s DOM renderer.

[Hullo](https://hullo.dev) is a set of tools based on asynchronous, pressure resolving observables that tie everything together.

What [Hullo](https://hullo.dev) does differently is not just that it is based on its observables - a general reactivity tool. Library itself does not have a notion of component - those will live only in user/conceptual space. Instead, [Hullo](https://hullo.dev) DOM renderer uses observables to build nested streams structure reflecting future changes in DOM - if something is meant for it to be changed in runtime, it gets a stream of values, otherwise - a simple value represents it.

This approach makes it so every DOM element property gets the same attention as components in other frameworks. Since they are precise about what has to change, no diffing occurs in the library.

[hullo.dev](https://hullo.dev)

## Learning Hullo

[Docs](https://hullo.dev)

[Github](https://github.com/arturkulig/hullo)

## Running

```
npm i
npm start
```

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._

## Credit

This TodoMVC application was created by [Artur Kulig](http://arturkulig.pl).
