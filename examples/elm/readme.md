# Elm TodoMVC Example

> A functional language for interactive applications

> _[Elm](http://elm-lang.org/)_


## Learning Elm

The [Elm website](http://elm-lang.org/) is a great resource for getting
started.

Here are some links you may find helpful:

* [Try Elm](http://elm-lang.org/try)
* [Learn Elm](http://elm-lang.org/Learn.elm)
* [An Introduction to Elm](http://guide.elm-lang.org/)

Get help from other Elm users:

* [elm-discuss mailing list](https://groups.google.com/forum/?fromgroups#!forum/elm-discuss)
* [@elmlang on Twitter](https://twitter.com/elmlang)
* [@czaplic on Twitter](https://twitter.com/czaplic)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._



## Project Structure

All of the Elm code lives in `Todo.elm` and `Todo/Task.elm` and relies
on the [elm-html][] and [elm-navigation][] packages.

[elm-html]: http://package.elm-lang.org/packages/elm-lang/html/latest/
[elm-navigation]: http://package.elm-lang.org/packages/elm-lang/navigation/latest/

There also is a port handler set up in `index.html` to set the focus on
particular text fields when necessary.

## Build Instructions

You need to install [elm](http://elm-lang.org/install)
on your machine first.

Run the following commands from the root of this project:

```bash
elm-package install -y
elm-make Todo.elm --output build/elm.js
```

Then open `index.html` in your browser!

## Credit

This TodoMVC application was created by [@evancz](https://github.com/evancz), and imported into TasteJS by [@passy](https://twitter.com/passy).
