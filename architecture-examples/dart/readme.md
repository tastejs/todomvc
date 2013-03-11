# Dart • [TodoMVC](http://todomvc.com)

A TodoMVC sample built with Dart. It does not use a MVC framework - it's a Vanilla Dart sample.

Dart firstly targets the development of modern and large scale browser-side web apps. It's an object oriented language with a C-style syntax.

## Run

Dart compiles to JavaScript and thus runs across modern browsers. Dart also can run in its own virtual machine.

Both Dart files and JS compilation result are provided in this sample, therefore it actually works in any browser.

To edit and debug the code, you can use Dart Editor. The editor ships with the [SDK](http://dartlang.org) and [Dartium](http://www.dartlang.org/dartium/), a dedicated version of Chromium with an embedded Dart VM.

## How to compile to JS

```
cd web/dart
dart2js app.dart -oapp.dart.js 
```

The dart2js compilator can be found in the SDK.

The currently provided JS is minified (dart2js [...] --minify).

## Dart syntax analysis

```
cd web/dart
dart_analyzer app.dart --fatal-type-errors --fatal-warnings
```

Dart SDK is still under active development, and new releases include breaking changes. The application is built by drone.io, which proposes a specific build trigger for Dart SDK updates.

[![Build Status](https://drone.io/mlorber/todomvc-dart/status.png)](https://drone.io/mlorber/todomvc-dart/latest)

Build history can be seen [here](https://drone.io/mlorber/todomvc-dart)

## Credit

Made by [Mathieu Lorber](http://mlorber.net)
