# Dart TodoMVC Example

> Dart is a class-based, object-oriented language with lexical scoping, closures, and optional static typing. Dart helps you build structured modern web apps and is easy to learn for a wide range of developers.

> _[Dart - dartlang.org](http://dartlang.org)_


## Learning Dart

The [Dart website](http://www.dartlang.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://www.dartlang.org/docs/technical-overview)
* [API Reference](http://api.dartlang.org/docs/releases/latest)
* [A Tour of the Dart Language](http://www.dartlang.org/docs/dart-up-and-running/contents/ch02.html)
* [Articles](http://www.dartlang.org/articles)
* [Tutorials](http://www.dartlang.org/docs/tutorials)
* [FAQ](http://www.dartlang.org/support/faq.html)

Articles and guides from the community:

* [Getting started with Google Dart](http://www.techrepublic.com/blog/webmaster/getting-started-with-google-dart/931)

Get help from other Dart users:

* [Dart on StackOverflow](http://stackoverflow.com/questions/tagged/dart)
* [Dart on Twitter](http://twitter.com/dart_lang)
* [Dart on Google +](https://plus.google.com/+dartlang/posts)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

Dart compiles to JavaScript and thus runs across modern browsers. Dart also can run in its own virtual machine.

Both Dart files and JS compilation result are provided in this sample, therefore it actually works in any browser.

To edit and debug the code, you can use Dart Editor. The editor ships with the [SDK](http://dartlang.org) and [Dartium](http://www.dartlang.org/dartium/), a dedicated version of Chromium with an embedded Dart VM.


## Compiling

```
cd web/dart
dart2js app.dart -oapp.dart.js
```

The dart2js compilator can be found in the SDK.

The currently provided JS is minified (dart2js [...] --minify).


## Syntax Analysis

```
cd web/dart
dart_analyzer app.dart --fatal-type-errors --fatal-warnings
```

Dart SDK is still under active development, and new releases include breaking changes. The application is built by drone.io, which proposes a specific build trigger for Dart SDK updates.

[![Build Status](https://drone.io/mlorber/todomvc-dart/status.png)](https://drone.io/mlorber/todomvc-dart/latest)

Build history can be seen [here](https://drone.io/mlorber/todomvc-dart)


## Credit

This TodoMVC application was created by [Mathieu Lorber](http://mlorber.net).
