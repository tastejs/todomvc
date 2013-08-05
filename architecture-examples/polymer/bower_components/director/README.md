<img src="https://github.com/flatiron/director/raw/master/img/director.png" />

# Synopsis
Director is a router. Routing is the process of determining what code to run when a URL is requested.

# Motivation
A routing library that works in both the browser and node.js environments with as few differences as possible. Simplifies the development of Single Page Apps and Node.js applications. Dependency free (doesn't require jQuery or Express, etc).

# Status
[![Build Status](https://secure.travis-ci.org/flatiron/director.png?branch=master)](http://travis-ci.org/flatiron/director)

# Features
* [Client-Side Routing](#client-side)
* [Server-Side HTTP Routing](#http-routing)
* [Server-Side CLI Routing](#cli-routing)


# Usage
* [API Documentation](#api-documentation)
* [Frequently Asked Questions](#faq)

<a name="client-side"></a>
## Client-side Routing
It simply watches the hash of the URL to determine what to do, for example:

```
http://foo.com/#/bar
```

Client-side routing (aka hash-routing) allows you to specify some information about the state of the application using the URL. So that when the user visits a specific URL, the application can be transformed accordingly.

<img src="https://github.com/flatiron/director/raw/master/img/hashRoute.png" />

Here is a simple example:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>A Gentle Introduction</title>
    <script src="https://raw.github.com/flatiron/director/master/build/director.min.js"></script>
    <script>

      var author = function () { console.log("author"); },
          books = function () { console.log("books"); },
          viewBook = function(bookId) { console.log("viewBook: bookId is populated: " + bookId); };

      var routes = {
        '/author': author,
        '/books': [books, function() { console.log("An inline route handler."); }],
        '/books/view/:bookId': viewBook
      };

      var router = Router(routes);
      router.init();

    </script>
  </head>
  <body>
    <ul>
      <li><a href="#/author">#/author</a></li>
      <li><a href="#/books">#/books</a></li>
      <li><a href="#/books/view/1">#/books/view/1</a></li>
    </ul>
  </body>
</html>
```

Director works great with your favorite DOM library, such as jQuery.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>A Gentle Introduction 2</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="https://raw.github.com/flatiron/director/master/build/director.min.js"></script>
    <script>
    $('document').ready(function(){
      //
      // create some functions to be executed when
      // the correct route is issued by the user.
      //
      var showAuthorInfo = function () { console.log("showAuthorInfo"); },
          listBooks = function () { console.log("listBooks"); },
          allroutes = function() {
            var route = window.location.hash.slice(2),
                sections = $('section'),
                section;
            if ((section = sections.filter('[data-route=' + route + ']')).length) {
              sections.hide(250);
              section.show(250);
            }
          };

      //
      // define the routing table.
      //
      var routes = {
        '/author': showAuthorInfo,
        '/books': listBooks
      };

      //
      // instantiate the router.
      //
      var router = Router(routes);

      //
      // a global configuration setting.
      //
      router.configure({
        on: allroutes
      });
      router.init();
    });
    </script>
  </head>
  <body>
    <section data-route="author">Author Name</section>
    <section data-route="books">Book1, Book2, Book3</section>
    <ul>
      <li><a href="#/author">#/author</a></li>
      <li><a href="#/books">#/books</a></li>
    </ul>
  </body>
</html>
```

You can find a browser-specific build of `director` [here][1] which has all of the server code stripped away.

<a name="http-routing"></a>
## Server-Side HTTP Routing

Director handles routing for HTTP requests similar to `journey` or `express`:

```js
  //
  // require the native http module, as well as director.
  //
  var http = require('http'),
      director = require('director');

  //
  // create some logic to be routed to.
  //
  function helloWorld() {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' })
    this.res.end('hello world');
  }

  //
  // define a routing table.
  //
  var router = new director.http.Router({
    '/hello': {
      get: helloWorld
    }
  });

  //
  // setup a server and when there is a request, dispatch the
  // route that was requested in the request object.
  //
  var server = http.createServer(function (req, res) {
    router.dispatch(req, res, function (err) {
      if (err) {
        res.writeHead(404);
        res.end();
      }
    });
  });

  //
  // You can also do ad-hoc routing, similar to `journey` or `express`.
  // This can be done with a string or a regexp.
  //
  router.get('/bonjour', helloWorld);
  router.get(/hola/, helloWorld);

  //
  // set the server to listen on port `8080`.
  //
  server.listen(8080);
```

### See Also:

 - Auto-generated Node.js API Clients for routers using [Director-Reflector](http://github.com/flatiron/director-reflector)
 - RESTful Resource routing using [restful](http://github.com/flatiron/restful)
 - HTML / Plain Text views of routers using [Director-Explorer](http://github.com/flatiron/director-explorer)

<a name="cli-routing"></a>
## CLI Routing

Director supports Command Line Interface routing. Routes for cli options are based on command line input (i.e. `process.argv`) instead of a URL.

``` js
  var director = require('director');

  var router = new director.cli.Router();

  router.on('create', function () {
    console.log('create something');
  });

  router.on(/destroy/, function () {
    console.log('destroy something');
  });

  // You will need to dispatch the cli arguments yourself
  router.dispatch('on', process.argv.slice(2).join(' '));
```

Using the cli router, you can dispatch commands by passing them as a string. For example, if this example is in a file called `foo.js`:

``` bash
$ node foo.js create
create something
$ node foo.js destroy
destroy something
```

<a name="api-documentation"></a>
# API Documentation

* [Constructor](#constructor)
* [Routing Table](#routing-table)
* [Adhoc Routing](#adhoc-routing)
* [Scoped Routing](#scoped-routing)
* [Routing Events](#routing-events)
* [Configuration](#configuration)
* [URL Matching](#url-matching)
* [URL Params](#url-params)
* [Route Recursion](#route-recursion)
* [Async Routing](#async-routing)
* [Resources](#resources)
* [History API](#history-api)
* [Instance Methods](#instance-methods)
* [Attach Properties to `this`](#attach-to-this)
* [HTTP Streaming and Body Parsing](#http-streaming-body-parsing)

<a name="constructor"></a>
## Constructor

``` js
  var router = Router(routes);
```

<a name="routing-table"></a>
## Routing Table

An object literal that contains nested route definitions. A potentially nested set of key/value pairs. The keys in the object literal represent each potential part of the URL. The values in the object literal contain references to the functions that should be associated with them. *bark* and *meow* are two functions that you have defined in your code.

``` js
  //
  // Assign routes to an object literal.
  //
  var routes = {
    //
    // a route which assigns the function `bark`.
    //
    '/dog': bark,
    //
    // a route which assigns the functions `meow` and `scratch`.
    //
    '/cat': [meow, scratch]
  };

  //
  // Instantiate the router.
  //
  var router = Router(routes);
```

<a name="adhoc-routing"></a>
## Adhoc Routing

When developing large client-side or server-side applications it is not always possible to define routes in one location. Usually individual decoupled components register their own routes with the application router. We refer to this as _Adhoc Routing._ Lets take a look at the API `director` exposes for adhoc routing:

**Client-side Routing**

``` js
  var router = new Router().init();

  router.on('/some/resource', function () {
    //
    // Do something on `/#/some/resource`
    //
  });
```

**HTTP Routing**

``` js
  var router = new director.http.Router();

  router.get(/\/some\/resource/, function () {
    //
    // Do something on an GET to `/some/resource`
    //
  });
```

<a name="scoped-routing"></a>
## Scoped Routing

In large web appliations, both [Client-side](#client-side) and [Server-side](#http-routing), routes are often scoped within a few individual resources. Director exposes a simple way to do this for [Adhoc Routing](#adhoc-routing) scenarios:

``` js
  var router = new director.http.Router();

  //
  // Create routes inside the `/users` scope.
  //
  router.path(/\/users\/(\w+)/, function () {
    //
    // The `this` context of the function passed to `.path()`
    // is the Router itself.
    //

    this.post(function (id) {
      //
      // Create the user with the specified `id`.
      //
    });

    this.get(function (id) {
      //
      // Retreive the user with the specified `id`.
      //
    });

    this.get(/\/friends/, function (id) {
      //
      // Get the friends for the user with the specified `id`.
      //
    });
  });
```

<a name="routing-events"></a>
## Routing Events

In `director`, a "routing event" is a named property in the [Routing Table](#routing-table) which can be assigned to a function or an Array of functions to be called when a route is matched in a call to `router.dispatch()`.

* **on:** A function or Array of functions to execute when the route is matched.
* **before:** A function or Array of functions to execute before calling the `on` method(s).

**Client-side only**

* **after:** A function or Array of functions to execute when leaving a particular route.
* **once:** A function or Array of functions to execute only once for a particular route.

<a name="configuration"></a>
## Configuration

Given the flexible nature of `director` there are several options available for both the [Client-side](#client-side) and [Server-side](#http-routing). These options can be set using the `.configure()` method:

``` js
  var router = new director.Router(routes).configure(options);
```

The `options` are:

* **recurse:** Controls [route recursion](#route-recursion). Use `forward`, `backward`, or `false`. Default is `false` Client-side, and `backward` Server-side.
* **strict:** If set to `false`, then trailing slashes (or other delimiters) are allowed in routes. Default is `true`.
* **async:** Controls [async routing](#async-routing). Use `true` or `false`. Default is `false`.
* **delimiter:** Character separator between route fragments. Default is `/`.
* **notfound:** A function to call if no route is found on a call to `router.dispatch()`.
* **on:** A function (or list of functions) to call on every call to `router.dispatch()` when a route is found.
* **before:** A function (or list of functions) to call before every call to `router.dispatch()` when a route is found.

**Client-side only**

* **resource:** An object to which string-based routes will be bound. This can be especially useful for late-binding to route functions (such as async client-side requires).
* **after:** A function (or list of functions) to call when a given route is no longer the active route.
* **html5history:** If set to `true` and client supports `pushState()`, then uses HTML5 History API instead of hash fragments. See [History API](#history-api) for more information.
* **run_handler_in_init:** If `html5history` is enabled, the route handler by default is executed upon `Router.init()` since with real URIs the router can not know if it should call a route handler or not. Setting this to `false` disables the route handler initial execution.

<a name="url-matching"></a>
## URL Matching

``` js
  var router = Router({
    //
    // given the route '/dog/yella'.
    //
    '/dog': {
      '/:color': {
        //
        // this function will return the value 'yella'.
        //
        on: function (color) { console.log(color) }
      }
    }
  });
```

Routes can sometimes become very complex, `simple/:tokens` don't always suffice. Director supports regular expressions inside the route names. The values captured from the regular expressions are passed to your listener function.

``` js
  var router = Router({
    //
    // given the route '/hello/world'.
    //
    '/hello': {
      '/(\\w+)': {
        //
        // this function will return the value 'world'.
        //
        on: function (who) { console.log(who) }
      }
    }
  });
```

``` js
  var router = Router({
    //
    // given the route '/hello/world/johny/appleseed'.
    //
    '/hello': {
      '/world/?([^\/]*)\/([^\/]*)/?': function (a, b) {
        console.log(a, b);
      }
    }
  });
```

<a name="url-params"></a>
## URL Parameters

When you are using the same route fragments it is more descriptive to define these fragments by name and then use them in your [Routing Table](#routing-table) or [Adhoc Routes](#adhoc-routing). Consider a simple example where a `userId` is used repeatedly.

``` js
  //
  // Create a router. This could also be director.cli.Router() or
  // director.http.Router().
  //
  var router = new director.Router();

  //
  // A route could be defined using the `userId` explicitly.
  //
  router.on(/([\w-_]+)/, function (userId) { });

  //
  // Define a shorthand for this fragment called `userId`.
  //
  router.param('userId', /([\\w\\-]+)/);

  //
  // Now multiple routes can be defined with the same
  // regular expression.
  //
  router.on('/anything/:userId', function (userId) { });
  router.on('/something-else/:userId', function (userId) { });
```

<a name="route-recursion"></a>
## Route Recursion

Can be assigned the value of `forward` or `backward`. The recurse option will determine the order in which to fire the listeners that are associated with your routes. If this option is NOT specified or set to null, then only the listeners associated with an exact match will be fired.

### No recursion, with the URL /dog/angry

``` js
  var routes = {
    '/dog': {
      '/angry': {
        //
        // Only this method will be fired.
        //
        on: growl
      },
      on: bark
    }
  };

  var router = Router(routes);
```

### Recursion set to `backward`, with the URL /dog/angry

``` js
  var routes = {
    '/dog': {
      '/angry': {
        //
        // This method will be fired first.
        //
        on: growl
      },
      //
      // This method will be fired second.
      //
      on: bark
    }
  };

  var router = Router(routes).configure({ recurse: 'backward' });
```

### Recursion set to `forward`, with the URL /dog/angry

``` js
  var routes = {
    '/dog': {
      '/angry': {
        //
        // This method will be fired second.
        //
        on: growl
      },
      //
      // This method will be fired first.
      //
      on: bark
    }
  };

  var router = Router(routes).configure({ recurse: 'forward' });
```

### Breaking out of recursion, with the URL /dog/angry

``` js
  var routes = {
    '/dog': {
      '/angry': {
        //
        // This method will be fired first.
        //
        on: function() { return false; }
      },
      //
      // This method will not be fired.
      //
      on: bark
    }
  };

  //
  // This feature works in reverse with recursion set to true.
  //
  var router = Router(routes).configure({ recurse: 'backward' });
```

<a name="async-routing"></a>
## Async Routing

Before diving into how Director exposes async routing, you should understand [Route Recursion](#route-recursion). At it's core route recursion is about evaluating a series of functions gathered when traversing the [Routing Table](#routing-table).

Normally this series of functions is evaluated synchronously. In async routing, these functions are evaluated asynchronously. Async routing can be extremely useful both on the client-side and the server-side:

* **Client-side:** To ensure an animation or other async operations (such as HTTP requests for authentication) have completed before continuing evaluation of a route.
* **Server-side:** To ensure arbitrary async operations (such as performing authentication) have completed before continuing the evaluation of a route.

The method signatures for route functions in synchronous and asynchronous evaluation are different: async route functions take an additional `next()` callback.

### Synchronous route functions

``` js
  var router = new director.Router();

  router.on('/:foo/:bar/:bazz', function (foo, bar, bazz) {
    //
    // Do something asynchronous with `foo`, `bar`, and `bazz`.
    //
  });
```

### Asynchronous route functions

``` js
  var router = new director.http.Router().configure({ async: true });

  router.on('/:foo/:bar/:bazz', function (foo, bar, bazz, next) {
    //
    // Go do something async, and determine that routing should stop
    //
    next(false);
  });
```

<a name="resources"></a>
## Resources

**Available on the Client-side only.** An object literal containing functions. If a host object is specified, your route definitions can provide string literals that represent the function names inside the host object. A host object can provide the means for better encapsulation and design.

``` js

  var router = Router({

    '/hello': {
      '/usa': 'americas',
      '/china': 'asia'
    }

  }).configure({ resource: container }).init();

  var container = {
    americas: function() { return true; },
    china: function() { return true; }
  };

```

<a name="history-api"></a>
## History API

**Available on the Client-side only.** Director supports using HTML5 History API instead of hash fragments for navigation. To use the API, pass `{html5history: true}` to `configure()`. Use of the API is enabled only if the client supports `pushState()`.

Using the API gives you cleaner URIs but they come with a cost. Unlike with hash fragments your route URIs must exist. When the client enters a page, say http://foo.com/bar/baz, the web server must respond with something meaningful. Usually this means that your web server checks the URI points to something that, in a sense, exists, and then serves the client the JavaScript application.

If you're after a single-page application you can not use plain old `<a href="/bar/baz">` tags for navigation anymore. When such link is clicked, web browsers try to ask for the resource from server which is not of course desired for a single-page application. Instead you need to use e.g. click handlers and call the `setRoute()` method yourself.

<a name="attach-to-this"></a>
## Attach Properties To `this`

Generally, the `this` object bound to route handlers, will contain the request in `this.req` and the response in `this.res`. One may attach additional properties to `this` with the `router.attach` method:

```js
  var director = require('director');

  var router = new director.http.Router().configure(options);

  //
  // Attach properties to `this`
  //
  router.attach(function () {
    this.data = [1,2,3];
  });

  //
  // Access properties attached to `this` in your routes!
  //
  router.get('/hello', function () {
    this.res.writeHead(200, { 'content-type': 'text/plain' });

    //
    // Response will be `[1,2,3]`!
    //
    this.res.end(this.data);
  });
```

This API may be used to attach convenience methods to the `this` context of route handlers.

<a name="http-streaming-body-parsing">
## HTTP Streaming and Body Parsing

When you are performing HTTP routing there are two common scenarios:

* Buffer the request body and parse it according to the `Content-Type` header (usually `application/json` or `application/x-www-form-urlencoded`).
* Stream the request body by manually calling `.pipe` or listening to the `data` and `end` events.

By default `director.http.Router()` will attempt to parse either the `.chunks` or `.body` properties set on the request parameter passed to `router.dispatch(request, response, callback)`. The router instance will also wait for the `end` event before firing any routes.

**Default Behavior**

``` js
  var director = require('director');

  var router = new director.http.Router();

  router.get('/', function () {
    //
    // This will not work, because all of the data
    // events and the end event have already fired.
    //
    this.req.on('data', function (chunk) {
      console.log(chunk)
    });
  });
```

In [flatiron][2], `director` is used in conjunction with [union][3] which uses a `BufferedStream` proxy to the raw `http.Request` instance. [union][3] will set the `req.chunks` property for you and director will automatically parse the body. If you wish to perform this buffering yourself directly with `director` you can use a simple request handler in your http server:

``` js
  var http = require('http'),
      director = require('director');

  var router = new director.http.Router();

  var server = http.createServer(function (req, res) {
    req.chunks = [];
    req.on('data', function (chunk) {
      req.chunks.push(chunk.toString());
    });

    router.dispatch(req, res, function (err) {
      if (err) {
        res.writeHead(404);
        res.end();
      }

      console.log('Served ' + req.url);
    });
  });

  router.post('/', function () {
    this.res.writeHead(200, { 'Content-Type': 'application/json' })
    this.res.end(JSON.stringify(this.req.body));
  });
```

**Streaming Support**

If you wish to get access to the request stream before the `end` event is fired, you can pass the `{ stream: true }` options to the route.

``` js
  var director = require('director');

  var router = new director.http.Router();

  router.get('/', { stream: true }, function () {
    //
    // This will work because the route handler is invoked
    // immediately without waiting for the `end` event.
    //
    this.req.on('data', function (chunk) {
      console.log(chunk);
    });
  });
```

<a name="instance-methods"></a>
## Instance methods

### configure(options)
* `options` {Object}: Options to configure this instance with.

Configures the Router instance with the specified `options`. See [Configuration](#configuration) for more documentation.

### param(token, matcher)
* token {string}: Named parameter token to set to the specified `matcher`
* matcher {string|Regexp}: Matcher for the specified `token`.

Adds a route fragment for the given string `token` to the specified regex `matcher` to this Router instance. See [URL Parameters](#url-params) for more documentation.

### on(method, path, route)
* `method` {string}: Method to insert within the Routing Table (e.g. `on`, `get`, etc.).
* `path` {string}: Path within the Routing Table to set the `route` to.
* `route` {function|Array}: Route handler to invoke for the `method` and `path`.

Adds the `route` handler for the specified `method` and `path` within the [Routing Table](#routing-table).

### path(path, routesFn)
* `path` {string|Regexp}: Scope within the Routing Table to invoke the `routesFn` within.
* `routesFn` {function}: Adhoc Routing function with calls to `this.on()`, `this.get()` etc.

Invokes the `routesFn` within the scope of the specified `path` for this Router instance.

### dispatch(method, path[, callback])
* method {string}: Method to invoke handlers for within the Routing Table
* path {string}: Path within the Routing Table to match
* callback {function}: Invoked once all route handlers have been called.

Dispatches the route handlers matched within the [Routing Table](#routing-table) for this instance for the specified `method` and `path`.

### mount(routes, path)
* routes {object}: Partial routing table to insert into this instance.
* path {string|Regexp}: Path within the Routing Table to insert the `routes` into.

Inserts the partial [Routing Table](#routing-table), `routes`, into the Routing Table for this Router instance at the specified `path`.

## Instance methods (Client-side only)

### init([redirect])
* `redirect` {String}: This value will be used if '/#/' is not found in the URL. (e.g., init('/') will resolve to '/#/', init('foo') will resolve to '/#foo').

Initialize the router, start listening for changes to the URL.

### getRoute([index])
* `index` {Number}: The hash value is divided by forward slashes, each section then has an index, if this is provided, only that section of the route will be returned.

Returns the entire route or just a section of it.

### setRoute(route)
* `route` {String}: Supply a route value, such as `home/stats`.

Set the current route.

### setRoute(start, length)
* `start` {Number} - The position at which to start removing items.
* `length` {Number} - The number of items to remove from the route.

Remove a segment from the current route.

### setRoute(index, value)
* `index` {Number} - The hash value is divided by forward slashes, each section then has an index.
* `value` {String} - The new value to assign the the position indicated by the first parameter.

Set a segment of the current route.

<a name="faq"></a>
# Frequently Asked Questions

## What About SEO?

Is using a Client-side router a problem for SEO? Yes. If advertising is a requirement, you are probably building a "Web Page" and not a "Web Application". Director on the client is meant for script-heavy Web Applications.

# Licence

(The MIT License)

Copyright (c) 2010 Nodejitsu Inc. <http://www.twitter.com/nodejitsu>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: http://github.com/flatiron/director
[1]: https://github.com/flatiron/director/blob/master/build/director.min.js
[2]: http://github.com/flatiron/flatiron
[3]: http://github.com/flatiron/union
