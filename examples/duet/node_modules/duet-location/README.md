# duet-location

Subscribe to in-app navigation & history state changes from [duet](https://github.com/colingourlay/duet)'s worker thread.

```javascript
var duet      = require('duet');
var channel   = require('duet-location/channel');
var subscribe = require('duet-location');

duet([channel], function () {
    subscribe(function (pathname) {
        console.log('pathname changed:', pathname);
    });
    subscribe(function (hash) {
        console.log('hash changed:', hash);
    }, true);
});
```

## API

### `subscribe(callback[, isHashSubscriber])`

Your callback function will be called with a single argument: the current pathname, whenever it changes due to internal navigation events (which are cancelled and passed to `history.pushState`), or `history.onpopstate` events.

If you pass `true` as the optional `isHashSubscriber` argument, your callback will be called whenever the hash changes, instead of the pathname.

When you subscribe, your callback will be called as soon as the initial location has been fetched.

## Example

An example can be seen in the [duet TodoMVC example app](https://github.com/colingourlay/todomvc/tree/master/examples/duet), supplying changes to the hash router.
