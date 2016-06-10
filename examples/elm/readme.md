# Elm TodoMVC Example

> A functional reactive language for interactive applications

> _[Elm](http://elm-lang.org/)_


## Learning Elm

The [Elm website](http://elm-lang.org/) is a great resource for getting
started.

Here are some links you may find helpful:

* [Try Elm](http://elm-lang.org/try)
* [Learn Elm](http://elm-lang.org/Learn.elm)
* [Elm Snippets](http://www.share-elm.com/)

Get help from other Elm users:

* [elm-discuss mailing list](https://groups.google.com/forum/?fromgroups#!forum/elm-discuss)
* [@elmlang on Twitter](https://twitter.com/elmlang)
* [@czaplic on Twitter](https://twitter.com/czaplic)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._



## Project Structure

All of the Elm code lives in `Todo.elm` and `Task.elm` and relies
on the [elm-html][] library.

[elm-html]: http://library.elm-lang.org/catalog/evancz-elm-html/latest

There also is a port handler set up in `index.html` to set the focus on
particular text fields when necessary.

## Build Instructions

You need to install
[elm](https://github.com/elm-lang/elm-platform/blob/master/README.md#elm-platform)
on your machine first.

Run the following commands from the root of this project:

```bash
elm-package install
elm-make Todo.elm --output build/Todo.js
```

Then open `index.html` in your browser!

## Credit

This TodoMVC application was created by [@evancz](https://github.com/evancz), and imported into TasteJS by [@passy](https://twitter.com/passy).
