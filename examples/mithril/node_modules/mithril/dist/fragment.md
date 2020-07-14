# fragment(attrs, children)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)

---

### Description

Allows attaching lifecycle methods to a fragment [vnode](vnodes.md)

```javascript
var groupVisible = true
var log = function() {
	console.log("group is now visible")
}

m("ul", [
	m("li", "child 1"),
	m("li", "child 2"),
	groupVisible ? m.fragment({oninit: log}, [
		// a fragment containing two elements
		m("li", "child 3"),
		m("li", "child 4"),
	]) : null
])
```

---

### Signature

Generates a fragment [vnode](vnodes.md)

`vnode = m.fragment(attrs, children)`

Argument    | Type                                                | Required | Description
----------- | --------------------------------------------------- | -------- | ---
`attrs`     | `Object`                                            | No       | HTML attributes or element properties
`children`  | `Array<Vnode>|String|Number|Boolean`                | No       | Child [vnodes](vnodes.md#structure). Can be written as [splat arguments](signatures.md#splats)
**returns** | `Vnode`                                             |          | A fragment [vnode](vnodes.md#structure)

[How to read signatures](signatures.md)

---

### How it works

`m.fragment()` creates a [fragment vnode](vnodes.md) with attributes. It is meant for advanced use cases involving [keys](keys.md) or [lifecyle methods](lifecycle-methods.md).

A fragment vnode represents a list of DOM elements. If you want a regular element vnode that represents only one DOM element and don't require keyed logic, you should use [`m()`](hyperscript.md) instead.

Normally you can use simple arrays or splats instead to denote a list of nodes:

```javascript
var groupVisible = true

m("ul",
	m("li", "child 1"),
	m("li", "child 2"),
	groupVisible ? [
		// a fragment containing two elements
		m("li", "child 3"),
		m("li", "child 4"),
	] : null
)
```

However, JavaScript arrays cannot be keyed or hold lifecycle methods. One option would be to create a wrapper element to host the key or lifecycle method, but sometimes it is not desirable to have an extra element (for example in complex table structures). In those cases, a fragment vnode can be used instead.

There are a few benefits that come from using `m.fragment` instead of handwriting a vnode object structure: m.fragment creates [monomorphic objects](vnodes.md#monomorphic-class), which have better performance characteristics than creating objects dynamically. In addition, using `m.fragment` makes your intentions clear to other developers, and it makes it less likely that you'll mistakenly set attributes on the vnode object itself rather than on its `attrs` map.
