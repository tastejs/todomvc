# duet-local-storage

Use the browser's localStorage API with [duet](https://github.com/colingourlay/duet) by reading and writing asynchronously across threads.

```javascript
var duet         = require('duet');
var channel      = require('duet-local-storage/channel');
var localStorage = require('duet-local-storage');
var logger       = console.log.bind(console);

duet([channel], function () {
    localStorage.clear();
    localStorage.length(logger);
    // > 0
    localStorage.setItem('foo', 'bar');
    localStorage.key(0, logger);
    // > 'foo'
    localStorage.getItem('foo', logger);
    // > 'bar'
    localStorage.removeItem('foo');
});
```

## API

Everything is as you would expect on the localStorage API, except for a couple of things:

* `length` is a method rather than a property.
* All read operations (`getItem`, `key` & `length`) require a callback because they need to be asynchronous.

Also, `localStorage` is a convenience method which execute `getItem` when the second argument is a callback function, and `setItem` when it's a string.

## Example

An example can be seen in the [duet example app](https://github.com/colingourlay/duet-example-app).
