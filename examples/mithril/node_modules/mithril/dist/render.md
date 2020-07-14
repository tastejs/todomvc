# render(element, vnodes)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)
- [Why Virtual DOM](#why-virtual-dom)
- [Differences from other API methods](#differences-from-other-api-methods)
- [Standalone usage](#standalone-usage)

---

### Description

Renders a template to the DOM

```javascript
m.render(document.body, "hello")
// <body>hello</body>
```

---

### Signature

`m.render(element, vnodes, redraw)`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
`element`   | `Element`            | Yes      | A DOM element that will be the parent node to the subtree
`vnodes`    | `Array<Vnode>|Vnode` | Yes      | The [vnodes](vnodes.md) to be rendered
`redraw`    | `() -> any`          | No       | A callback invoked each time an event handler in the subtree is invoked
**returns** |                      |          | Returns `undefined`

[How to read signatures](signatures.md)

---

### How it works

The `m.render(element, vnodes)` method takes a virtual DOM tree (typically generated via the [`m()` hyperscript function](hyperscript.md)), generates a DOM tree and mounts it on `element`. If `element` already has a DOM tree mounted via a previous `m.render()` call, `vnodes` is diffed against the previous `vnodes` tree and the existing DOM tree is modified only where needed to reflect the changes. Unchanged DOM nodes are not touched at all.

If you pass the optional `redraw` argument, that is invoked each time an event handler anywhere in the subtree is called. This is used by [`m.mount`](mount.md) and [`m.redraw`](redraw.md) to implement the [autoredraw](autoredraw.md) functionality, but it's also exposed for more advanced use cases like integration with some third-party frameworks.

`m.render` is synchronous.

---

### Why Virtual DOM

It may seem wasteful to generate a vnode tree on every redraw, but as it turns out, creating and comparing JavaScript data structures is surprisingly cheap compared to reading and modifying the DOM.

Touching the DOM can be extremely expensive for a couple of reasons. Alternating reads and writes can adversely affect performance by causing several browser repaints to occur in quick succession, whereas comparing virtual dom trees allows writes to be batched into a single repaint. Also, the performance characteristics of various DOM operations vary between implementations and can be difficult to learn and optimize for all browsers. For example, in some implementations, reading `childNodes.length` has a complexity of O(n); in some, reading `parentNode` causes a repaint, etc.

In contrast, traversing a JavaScript data structure has a much more predictable and sane performance profile, and in addition, a vnode tree is implemented in such a way that enables modern JavaScript engines to apply aggressive optimizations such as hidden classes for even better performance.

---

### Differences from other API methods

`m.render()` method is internally called by [`m.mount()`](mount.md), [`m.route()`](route.md), [`m.redraw()`](redraw.md) and [`m.request()`](request.md). It is not called after [stream updates](stream.md)

Unlike with `m.mount()` and `m.route()`, a vnode tree rendered via `m.render()` does not auto-redraw in response to view events, `m.redraw()` calls or `m.request()` calls. It is a low level mechanism suitable for library authors who wish to manually control rendering instead of relying on Mithril's built-in auto-redrawing system.

Another difference is that `m.render` method expects a [vnode](vnodes.md) (or a array of vnodes) as its second parameter, whereas `m.mount()` and `m.route()` expect components.

---

### Standalone usage

`var render = require("mithril/render")`

The `m.render` module is similar in scope to view libraries like Knockout, React and Vue. It implements a virtual DOM diffing engine with a modern search space reduction algorithm and DOM recycling, which translate to top-of-class performance, both in terms of initial page load and re-rendering. It has no dependencies on other parts of Mithril aside from normalization exposed via `require("mithril/render/vnode")` and can be used as a standalone library.

Despite being relatively small, the render module is fully functional and self-sufficient. It supports everything you might expect: SVG, custom elements, and all valid attributes and events - without any weird case-sensitive edge cases or exceptions. Of course, it also fully supports [components](components.md) and [lifecycle methods](lifecycle-methods.md).
