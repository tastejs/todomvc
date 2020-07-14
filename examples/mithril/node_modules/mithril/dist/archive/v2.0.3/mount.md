# mount(root, component)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)
- [Headless mounts](#headless-mounts)
- [Performance considerations](#performance-considerations)
- [Differences from m.render](#differences-from-mrender)

---

### Description

Activates a component, enabling it to autoredraw on user events

```javascript
var state = {
	count: 0,
	inc: function() {state.count++}
}

var Counter = {
	view: function() {
		return m("div", {onclick: state.inc}, state.count)
	}
}

m.mount(document.body, Counter)
```

To pass arguments when mounting a component use:
```javascript
m.mount(element, {view: function () {return m(Component, attrs)}})
```
---

### Signature

`m.mount(element, Component)`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
`element`   | `Element`            | Yes      | A DOM element that will be the parent node to the subtree
`Component` | `Component|null`     | Yes      | The [component](components.md) to be rendered. `null` unmounts the tree and cleans up internal state.
**returns** |                      |          | Returns nothing

[How to read signatures](signatures.md)

---

### How it works

`m.mount(element, Component)`, when called renders the component into the element and subscribe the `(element, Component)` pair to the redraw subsystem. That tree will be re-rendered when [manual](redraw.md) or [automatic](autoredraw.md) redraws are triggered.

On redraw, the new vDOM tree is compared (or "diffed") with the old one, and the existing DOM tree is modified only where needed to reflect the changes. Unchanged DOM nodes are not touched at all.

#### Replace a component

Running `mount(element, OtherComponent)` where `element` is a current mount point replaces the component previously mounted with `OtherComponent`.

#### Unmount

Using `m.mount(element, null)` on an element with a previously mounted component unmounts it and cleans up Mithril internal state. This can be useful to prevent memory leaks when removing the `root` node manually from the DOM.

#### Headless mounts

In certain more advanced situations, you may want to subscribe and listen for [redraws](autoredraw.md) without rendering anything to the screen. This can be done using a headless mount, created by simply invoking `m.mount` with an element that's not added to the live DOM tree and putting all your useful logic in the component you're mounting with. You still need a `view` in your component, just it doesn't have to return anything useful and it can just return a junk value like `null` or `undefined`.

```javascript
var elem = document.createElement("div")

// Subscribe
m.mount(elem, {
	oncreate: function() {
		// once added
	},
	onupdate: function() {
		// on each redraw
	},
	onremove: function() {
		// clean up whatever you need
	},

	// Necessary boilerplate
	view: function () {},
})

// Unsubscribe
m.mount(elem, null)
```

There's no need to worry about other mount roots. Multiple roots are supported and they won't step on each other. You can even do the above in a component when integrating with another framework, and it won't be a problem.

---

### Performance considerations

It may seem wasteful to generate a vnode tree on every redraw, but as it turns out, creating and comparing JavaScript data structures is surprisingly cheap compared to reading and modifying the DOM.

Touching the DOM can be extremely expensive for a couple of reasons. Alternating reads and writes can adversely affect performance by causing several browser repaints to occur in quick succession, whereas comparing virtual dom trees allows writes to be batched into a single repaint. Also, the performance characteristics of various DOM operations vary between implementations and can be difficult to learn and optimize for all browsers. For example, in some implementations, reading `childNodes.length` has a complexity of O(n); in some, reading `parentNode` causes a repaint, etc.

In contrast, traversing a JavaScript data structure has a much more predictable and sane performance profile, and in addition, a vnode tree is implemented in such a way that enables modern JavaScript engines to apply aggressive optimizations such as hidden classes for even better performance.

---

### Differences from m.render

A component rendered via `m.mount` [automatically redraws](autoredraw.md) in response to view events, `m.redraw()` calls or `m.request()` calls. Vnodes rendered via `m.render()` do not.

`m.mount()` is suitable for application developers integrating Mithril widgets into existing codebases where routing is handled by another library or framework, while still enjoying Mithril's auto-redrawing facilities.

`m.render()` is suitable for library authors who wish to manually control rendering (e.g. when hooking to a third party router, or using third party data-layer libraries like Redux).
