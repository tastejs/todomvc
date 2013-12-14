# Dart TodoMVC Example

> Dart is a class-based, object-oriented language with lexical scoping,
> closures, and optional static typing. Dart helps you build structured modern
> web apps and is easy to learn for a wide range of developers.

> _[Dart - dartlang.org][dart]_

## TodoMVC for Dart

This version of TodoMVC is a "vanilla" Dart implementation. The
core Dart SDK is required, plus one package (`browser`) which provides
a bootstrap file.

## Running this example

First, download Dart Editor or the Dart SDK and put the SDK's bin
directory on the PATH.

### Install dependencies

Dart Editor will automatically run Dart's package manager to install the
`browser` package. If you are not using Dart Editor, you need to manually
install the dependency:

```
pub install
```

### Building the app

You need to compile the app into JavaScript to run in your browser.

```
cd web
pub build
```

The above command will create a `build` directory, complete with HTML files
and a compiled-to-JavaScript version of the app.

### Loading the app

Open `build/


## Learning Dart

The [Dart website][dart] is a great resource for learning
Dart.

Getting started:

* [Try Dart](https://www.dartlang.org/codelabs/darrrt/)

Here are some links you may find helpful:

* [API Reference](https://api.dartlang.org/)
* [A Tour of the Dart Language][langtour]
* [Articles](http://www.dartlang.org/articles)
* [Tutorials](http://www.dartlang.org/docs/tutorials)
* [FAQ](http://www.dartlang.org/support/faq.html)

Get help from other Dart users:

* [Dart on StackOverflow](http://stackoverflow.com/questions/tagged/dart)
* [Support](https://www.dartlang.org/support/)

Follow the Dart project:

* [Dart on Twitter](http://twitter.com/dart_lang)
* [Dart on Google +](https://plus.google.com/+dartlang/posts)

_If you have other helpful links to share, or find any of the links above no
longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._

## Running Dart

Dart compiles to JavaScript and thus runs across modern browsers. Dart also
can run in its own virtual machine.

Both Dart files and JS compilation result are provided in this sample,
therefore it actually works in any browser.

To edit and debug the code, you can use Dart Editor (but you don't have to).
The editor ships with
the [SDK][dart] and [Dartium](http://www.dartlang.org/dartium/),
a dedicated version of Chromium with an embedded Dart VM.


## Syntax Analysis

Dart is designed to be analyzable. You can statically detect errors and warnings
before you run the code.

```
cd web/dart
dart_analyzer app.dart --fatal-type-errors --fatal-warnings
```

[![Build Status](https://drone.io/mlorber/todomvc-dart/status.png)][buildstatus]

Build history can be seen [here][builds].


## Credit

This TodoMVC application was created by [Mathieu Lorber](http://mlorber.net).

[langtour]: http://www.dartlang.org/docs/dart-up-and-running/contents/ch02.html
[dart]: https://www.dartlang.org
[builds]: https://drone.io/mlorber/todomvc-dart
[buildstatus]: https://drone.io/mlorber/todomvc-dart/latest