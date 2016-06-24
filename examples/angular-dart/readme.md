# AngularDart TodoMVC Example

> AngularDart is heavily inspired by AngularJS and is supercharged for Dart.
> Core Angular features such as directives, data binding, and dependency
> injection, are all there, and they've taken advantage of Dart's features
> like metadata, types, and classes to feel natural for Dart developers.
> AngularDart is also the first version of Angular to be built on emerging
> web standards like Shadow DOM.

_[AngularDart](http://news.dartlang.org/2013/11/angular-announces-angulardart.html)_

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

Dart compiles to JavaScript and thus runs across modern browsers. Dart also can
run in its own virtual machine.

Both Dart files and JS compilation result are provided in this sample,
therefore it actually works in any browser.

To edit and debug the code, you can use Dart Editor. The editor ships with the
[SDK](http://dartlang.org) and [Dartium](http://www.dartlang.org/dartium/), a
dedicated version of Chromium with an embedded Dart VM.

If you would like to edit the code without an IDE you must install Dart and run `pub get` to install the dependencies from the project root.

## Compiling

```
dart2js web/main.dart -o web/main.js
```

The dart2js compilator can be found in the SDK.

The currently provided JS is minified (dart2js [...] --minify).
