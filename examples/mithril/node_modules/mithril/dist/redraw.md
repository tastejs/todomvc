# redraw()

- [Description](#description)
- [Signature](#signature)
	- [Static members](#static-members)
		-[m.redraw.sync()](#mredrawsync)
- [How it works](#how-it-works)

---

### Description

Updates the DOM after a change in the application data layer.

You DON'T need to call it if data is modified within the execution context of an event handler defined in a Mithril view, or after request completion when using `m.request`/`m.jsonp`. The [autoredraw](autoredraw.md) system, which is built on top of `m.redraw()` will take care of it.

You DO need to call it in `setTimeout`/`setInterval`/`requestAnimationFrame` callbacks, or callbacks from 3rd party libraries.

---

### Signature

`m.redraw()`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
**returns** |                      |          | Returns nothing

#### Static members

##### m.redraw.sync

`m.redraw.sync()`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
**returns** |                      |          | Returns nothing

---

### How it works

When callbacks outside of Mithril run, you need to notify Mithril's rendering engine that a redraw is needed. External callbacks could be `setTimeout`/`setInterval`/`requestAnimationFrame` callbacks, web socket library callbacks, event handlers in jQuery plugins, third party XHR request callbacks, etc.

To trigger a redraw, call `m.redraw()`. Note that `m.redraw` only works if you used `m.mount` or `m.route`. If you rendered via `m.render`, you should use `m.render` to redraw.

`m.redraw()` always triggers an asynchronous redraws, whereas `m.redraw.sync()` triggers a synchronous one. `m.redraw()` is tied to `window.requestAnimationFrame()`. It will thus typically fire at most 60 times per second. It may fire faster if your monitor has a higher refresh rate.

`m.redraw.sync()` is mostly intended to make videos play work in iOS. That only works in response to user-triggered events. It comes with several caveat:

- You should not call `m.redraw.sync()` from a [lifecycle method](lifecycle-methods.md) or the `view()` method of a component. Doing so will result in undefined behavior (it throws an error when possible).
- `m.redraw.sync()` called from an event handler can cause the DOM to be modified while an event is bubbling. Depending on the structure of the old and new DOM trees, the event can finish the bubbling phase in the new tree and trigger unwanted handlers.
- It is not throttled. One call to `m.redraw.sync()` causes immediately one `m.render()` call per root registered with [`m.mount()`](mount.md) or [`m.route()`](route.md).

`m.redraw()` doesn't have any of those issues, you can call it from wherever you like.
