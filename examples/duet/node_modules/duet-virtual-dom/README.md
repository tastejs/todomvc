# duet-virtual-dom

Use a virtual DOM with [duet](https://github.com/colingourlay/duet) by passing patches from the worker thread to the main thread, and expected DOM events back in.

```javascript
var duet    = require('duet');
var channel = require('duet-virtual-dom/channel');
var vdom    = require('duet-virtual-dom');
var h       = require('virtual-dom/h');

duet([channel], function () {
    var update = vdom('body');

    function view(state) {
        return h('button', {dataset: {click: onClick}}, state);
    }

    function onClick(event, value) {
        render();
    }

    function render() {
        update(view((new Date()).toLocaleTimeString()));
    }

    render();
});
```

## API

### `vdom(selector[, options])`

Creates a virtual dom in the main thread's document inside (or at) the selector provided, returning an `update` method you can call with subsequent virtual dom trees.

* `selector` - used to select an element in the DOM. By default your virtual dom's root will be inserted into it.
* `options` - an optional object which may contain:
    * `tree` - an initial virtal dom tree.
    * `isTarget` - a boolean specifying whether the selector is for an element that should be replaced by your virtual dom, rather than a container your virtual dom will be inserted into.

### `update(tree)`

Call this with a virtual dom tree. The tree will be diffed with the last tree, new event handlers (if any) will be registered, and the resulting patch will be serialised and sent to the main thread and applied.

Any event handlers you specify by name (click, select, etc.) in your virtual dom tree as properties of a node's dataset will be replaced by references, which will be sent back from the main thread when they occur. Your event handler will be called with two arguments:

* `event` - The event object itself (well, all that was fit to serialize), including a `target` property which contains all non-dom-specific data.
* `value` - An object containing the value of the event's target, if it was a named input, or all named child inputs if the event's target was a form element.

## Example

An example can be seen in the [duet example app](https://github.com/colingourlay/duet-example-app).
