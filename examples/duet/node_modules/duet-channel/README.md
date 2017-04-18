# duet-channel

Create a namespaced channel to plug your own API into [duet](https://github.com/colingourlay/duet)'s delegator.

```
$ npm install duet-channel
```

## Getting started

As an example, we're going to write a (very superfluous) way to convert a string to uppercase, by passing it from the worker thread into the main thread, uppercasing it, then passing it back so it can be logged to the console. Let's get started...

In a module (`channel.js`), we create and export a channel with a unique namespace:

```javascript
module.exports = require('duet-channel')('UPPERCASER');
```

Now, in another module, we import the channel and use its methods to define the API, of which certain code paths will be reachable in a duet app, depending on the thread it is running in.

Here's an example API (`uppercaser.js`) which exports a single function for use in your duet app:

```javascript
var channel = require('./channel');

function uppercaser(text) {
    channel.postMessageToMain({
        type: 'TEXT',
        data: text
    });
}

channel.on('TEXT', function (text) {
    channel.postMessageToWorker({
        type: 'UPPER_TEXT',
        data: text.toUpperCase()
    });
});

channel.on('UPPER_TEXT', function (upperText) {
    console.log(upperText);
});

module.exports = uppercaser;
```

Now, you can use this in any duet app by registering the channel, then calling the API after duet has initialised:

```javascript
var duet = require('duet');
var channel = require('./channel');
var uppercaser = require('./uppercaser');

var options = {logger: console.debug.bind(console)};

duet([channel], function () {
    uppercaser('foo');
}, options);
```

With duet's logging bound to `console.debug`, the async console output looks like:

```
UPPERCASER::TEXT foo                [delegator.js]
UPPERCASER::UPPER_TEXT FOO          [delegator.js]
FOO                                     [index.js]
```

## API

### `duetChannel(namespace[, callback])`

If you provide the optional callback, it will be called once in each thread after duet has connected to the channel. In the worker, it will be called with a single argument: `'worker'`. In the main thread, it will be called with `'main'`. This is useful if you want your API to be able initiate actions from the main thread, such as listen to events on the `window` object:

```javascript
var duetChannel = require('duet-channel');

var channel = duetChannel('LOCATION', function (threadName) {
    if (threadName === 'main') {
        window.onpopstate = function () {
            channel.postMessageToWorker({
                type: 'CHANGE',
                data: document.location.href
            });
        }
    }
});

module.exports = channel;
```

### `channel.*`

When you import a channel you've created, it has the following methods available:

* `postMessageToMain(message)` - In the context of the worker thread, it sends a message to the main thread.
* `postMessageToWorker(message)` - In the context of the main thread, it sends a message to the worker thread.
* `on(type, callback)` - In either context, provide a callback to handle data from messages of the specified type.

Note: all messages should have the signature `{type, data}`, where `type` is a string and `data` is anything that can be serialised as JSON.

## License

ISC
