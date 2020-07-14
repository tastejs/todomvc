# Virtual DOM nodes

- [What is virtual DOM](#what-is-virtual-dom)
- [Basics](#basics)
- [Structure](#structure)
- [Vnode types](#vnode-types)
- [Monomorphic class](#monomorphic-class)
- [Avoid anti-patterns](#avoid-anti-patterns)

---

### What is virtual DOM

A virtual DOM tree is a JavaScript data structure that describes a DOM tree. It consists of nested virtual DOM nodes, also known as *vnodes*.

The first time a virtual DOM tree is rendered, it is used as a blueprint to create a DOM tree that matches its structure.

Typically, virtual DOM trees are then recreated every render cycle, which normally occurs in response to event handlers or to data changes. Mithril *diffs* a vnode tree against its previous version and only modifies DOM elements in spots where there are changes.

It may seem wasteful to recreate vnodes so frequently, but as it turns out, modern JavaScript engines can create hundreds of thousands of objects in less than a millisecond. On the other hand, modifying the DOM is several orders of magnitude more expensive than creating vnodes.

For that reason, Mithril uses a sophisticated and highly optimized virtual DOM diffing algorithm to minimize the amount of DOM updates. Mithril *also* generates carefully crafted vnode data structures that are compiled by JavaScript engines for near-native data structure access performance. In addition, Mithril aggressively optimizes the function that creates vnodes as well.

The reason Mithril goes to such great lengths to support a rendering model that recreates the entire virtual DOM tree on every render is to provide a declarative [immediate mode](https://en.wikipedia.org/wiki/Immediate_mode_(computer_graphics%29) API, a style of rendering that makes it drastically easier to manage UI complexity.

To illustrate why immediate mode is so important, consider the DOM API and HTML. The DOM API is an imperative [retained mode](https://en.wikipedia.org/wiki/Retained_mode) API and requires 1. writing out exact instructions to assemble a DOM tree procedurally, and 2. writing out other instructions to update that tree. The imperative nature of the DOM API means you have many opportunities to micro-optimize your code, but it also means that you have more chances of introducing bugs and more chances to make code harder to understand.

In contrast, HTML is closer to an immediate mode rendering system. With HTML, you can write a DOM tree in a far more natural and readable way, without worrying about forgetting to append a child to a parent, running into stack overflows when rendering extremely deep trees, etc.

Virtual DOM goes one step further than HTML by allowing you to write *dynamic* DOM trees without having to manually write multiple sets of DOM API calls to efficiently synchronize the UI to arbitrary data changes.

---

### Basics

Virtual DOM nodes, or *vnodes*, are JavaScript objects that represent DOM elements (or parts of the DOM). Mithril's virtual DOM engine consumes a tree of vnodes to produce a DOM tree.

Vnodes are created via the [`m()`](hyperscript.md) hyperscript utility:

```javascript
m("div", {id: "test"}, "hello")
```

Hyperscript can also consume [components](components.md):

```javascript
// define a component
var ExampleComponent = {
	view: function(vnode) {
		return m("div", vnode.attrs, ["Hello ", vnode.children])
	}
}

// consume it
m(ExampleComponent, {style: "color:red;"}, "world")

// equivalent HTML:
// <div style="color:red;">Hello world</div>
```

---

### Structure

Virtual DOM nodes, or *vnodes*, are JavaScript objects that represent an element (or parts of the DOM) and have the following properties:

Property   | Type                             | Description
---------- | -------------------------------- | ---
`tag`      | `String|Object`                  | The `nodeName` of a DOM element. It may also be the string `[` if a vnode is a fragment, `#` if it's a text vnode, or `<` if it's a trusted HTML vnode. Additionally, it may be a component.
`key`      | `String?`                        | The value used to map a DOM element to its respective item in a array of data.
`attrs`    | `Object?`                        | A hashmap of [DOM attributes](hyperscript.md#dom-attributes), [events](hyperscript.md#events), [properties](hyperscript.md#properties) and [lifecycle methods](hyperscript.md#lifecycle-methods).
`children` | `(Array|String|Number|Boolean)?` | In most vnode types, the `children` property is an array of vnodes. For text and trusted HTML vnodes, The `children` property is either a string, a number or a boolean.
`text`     | `(String|Number|Boolean)?`       | This is used instead of `children` if a vnode contains a text node as its only child. This is done for performance reasons. Component vnodes never use the `text` property even if they have a text node as their only child.
`dom`      | `Element?`                       | Points to the element that corresponds to the vnode. This property is `undefined` in the `oninit` lifecycle method. In fragments and trusted HTML vnodes, `dom` points to the first element in the range.
`domSize`  | `Number?`                        | This is only set in fragment and trusted HTML vnodes, and it's `undefined` in all other vnode types. It defines the number of DOM elements that the vnode represents (starting from the element referenced by the `dom` property).
`state`    | `Object?`                        | An object that is persisted between redraws. It is provided by the core engine when needed. In POJO component vnodes, the `state` inherits prototypically from the component object/class. In class component vnodes it is an instance of the class. In closure components it is the object returned by the closure.
`events`   | `Object?`                        | An object that is persisted between redraws and that stores event handlers so that they can be removed using the DOM API. The `events` property is `undefined` if there are no event handlers defined. This property is only used internally by Mithril, do not use or modify it.
`instance` | `Object?`                        | For components, a storage location for the value returned by the `view`. This property is only used internally by Mithril, do not use or modify it.


---

### Vnode types

The `tag` property of a vnode determines its type. There are five vnode types:

Vnode type   | Example                        | Description
------------ | ------------------------------ | ---
Element      | `{tag: "div"}`                 | Represents a DOM element.
Fragment     | `{tag: "[", children: []}`     | Represents a list of DOM elements whose parent DOM element may also contain other elements that are not in the fragment. When using the [`m()`](hyperscript.md) helper function, fragment vnodes can only be created by nesting arrays into the `children` parameter of `m()`. `m("[")` does not create a valid vnode.
Text         | `{tag: "#", children: ""}`     | Represents a DOM text node.
Trusted HTML | `{tag: "<", children: "<br>"}` | Represents a list of DOM elements from an HTML string.
Component    | `{tag: ExampleComponent}`      | If `tag` is a JavaScript object with a `view` method, the vnode represents the DOM generated by rendering the component.

Everything in a virtual DOM tree is a vnode, including text. The `m()` utility automatically normalizes its `children` argument and turns strings into text vnodes and nested arrays into fragment vnodes.

Only element tag names and components can be the first argument of the `m()` function. In other words, `[`, `#` and `<` are not valid `selector` arguments for `m()`. Trusted HTML vnodes can be created via [`m.trust()`](trust.md)

---

### Monomorphic class

The `mithril/render/vnode` module is used by Mithril to generate all vnodes. This ensures modern JavaScript engines can optimize virtual dom diffing by always compiling vnodes to the same hidden class.

When creating libraries that emit vnodes, you should use this module instead of writing naked JavaScript objects in order to ensure a high level of rendering performance.

---

### Avoid anti-patterns

#### Avoid memoizing mutable vnodes

Vnodes are supposed to represent the state of the DOM at a certain point in time. Mithril's rendering engine assumes a reused vnode is unchanged, so modifying a vnode that was used in a previous render will result in undefined behavior.

It is possible to reuse vnodes to prevent a diff, but it's preferable to use the `onbeforeupdate` hook to make your intent clear to other developers (or your future self).
