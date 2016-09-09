# UNMAINTAINED - Backbone localStorage Adapter v1.1.16

**Looking for a maintainer**

[![Build Status](https://secure.travis-ci.org/jeromegn/Backbone.localStorage.png?branch=master)](http://travis-ci.org/jeromegn/Backbone.localStorage)

Quite simply a localStorage adapter for Backbone. It's a drop-in replacement for Backbone.Sync() to handle saving to a localStorage database.

## Usage

Include Backbone.localStorage after having included Backbone.js:

```html
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbone.localStorage.js"></script>
```

Create your collections like so:

```javascript
window.SomeCollection = Backbone.Collection.extend({
  
  localStorage: new Backbone.LocalStorage("SomeCollection"), // Unique name within your app.
  
  // ... everything else is normal.
  
});
```

If needed, you can use the default `Backbone.sync` (instead of local storage) by passing the `ajaxSync` option flag to any Backbone AJAX function, for example:

```javascript
var myModel = new SomeModel();
myModel.fetch({ ajaxSync: true });
myModel.save({ new: "value" }, { ajaxSync: true });
```

### RequireJS

Include [RequireJS](http://requirejs.org):

```html
<script type="text/javascript" src="lib/require.js"></script>
```

RequireJS config: 
```javascript
require.config({
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        localstorage: "lib/backbone.localStorage"
    }
});
```

Define your collection as a module:
```javascript
define("SomeCollection", ["localstorage"], function() {
    var SomeCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("SomeCollection") // Unique name within your app.
    });
  
    return SomeCollection;
});
```

Require your collection:
```javascript
require(["SomeCollection"], function(SomeCollection) {
  // ready to use SomeCollection
});
```

### CommonJS

If you're using [browserify](https://github.com/substack/node-browserify).

Install using `npm install backbone.localstorage`, and require the module.

```javascript
Backbone.LocalStorage = require("backbone.localstorage");
```

## Contributing

You'll need node and to `npm install` before being able to run the minification script.

1. Fork;
2. Write code, with tests;
3. `make test` or `open spec/runner.html`;
4. Create a pull request.

Have fun!

## Acknowledgments

- [Mark Woodall](https://github.com/llad): initial tests (now refactored);
- [Martin Häcker](https://github.com/dwt): many fixes and the test isolation.

## License

Licensed under MIT license

Copyright (c) 2010 Jerome Gravel-Niquet

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
