# Lifecycle methods

- [Usage](#usage)
- [The DOM element lifecycle](#the-dom-element-lifecycle)
- [oninit](#oninit)
- [oncreate](#oncreate)
- [onupdate](#onupdate)
- [onbeforeremove](#onbeforeremove)
- [onremove](#onremove)
- [onbeforeupdate](#onbeforeupdate)
- [Avoid anti-patterns](#avoid-anti-patterns)

---

### Usage

[Components](components.md) and [virtual DOM nodes](vnodes.md) can have lifecycle methods, also known as *hooks*, which are called at various points during the lifetime of a DOM element.

```javascript
// Sample hook in component
var ComponentWithHook = {
	oninit: function(vnode) {
		console.log("initialize component")
	},
	view: function() {
		return "hello"
	}
}

// Sample hook in vnode
function initializeVnode() {
	console.log("initialize vnode")
}

m(ComponentWithHook, {oninit: initializeVnode})
```

All lifecyle methods receive the vnode as their first arguments, and have their `this` keyword bound to `vnode.state`.

Lifecycle methods are only called as a side effect of a [`m.render()`](render.md) call. They are not called if the DOM is modified outside of Mithril.

---

### The DOM element lifecycle

A DOM element is typically created and appended to the document. It may then have attributes or child nodes updated when a UI event is triggered and data is changed; and the element may alternatively be removed from the document.

After an element is removed, it may be temporarily retained in a memory pool. The pooled element may be reused in a subsequent update (in a process called *DOM recycling*). Recycling an element avoids incurring the performance cost of recreating a copy of an element that existed recently.

---

### oninit

The `oninit(vnode)` hook is called before a vnode is touched by the virtual DOM engine. `oninit` is guaranteed to run before its DOM element is attached to the document, and it is guaranteed to run on parent vnodes before their children, but it does not offer any guarantees regarding the existence of ancestor or descendant DOM elements. You should never access the `vnode.dom` from the `oninit` method.

This hook does not get called when an element is updated, but it does get called if an element is recycled.

Like in other hooks, the `this` keyword in the `oninit` callback points to `vnode.state`.

The `oninit` hook is useful for initializing component state based on arguments passed via `vnode.attrs` or `vnode.children`.

```javascript
function ComponentWithState() {
	var initialData
	return {
		oninit: function(vnode) {
			initialData = vnode.attrs.data
		},
		view: function(vnode) {
			return [
				// displays data from initialization time:
				m("div", "Initial: " + initialData),
				// displays current data:
				m("div", "Current: " + vnode.attrs.data)
			]
		}
	}
}

m(ComponentWithState, {data: "Hello"})
```

You should not modify model data synchronously from this method. Since `oninit` makes no guarantees regarding the status of other elements, model changes created from this method may not be reflected in all parts of the UI until the next render cycle.

---

### oncreate

The `oncreate(vnode)` hook is called after a DOM element is created and attached to the document. `oncreate` is guaranteed to run at the end of the render cycle, so it is safe to read layout values such as `vnode.dom.offsetHeight` and `vnode.dom.getBoundingClientRect()` from this method.

This hook does not get called when an element is updated.

Like in other hooks, the `this` keyword in the `oncreate` callback points to `vnode.state`. DOM elements whose vnodes have an `oncreate` hook do not get recycled.

The `oncreate` hook is useful for reading layout values that may trigger a repaint, starting animations and for initializing third party libraries that require a reference to the DOM element.

```javascript
var HeightReporter = {
	oncreate: function(vnode) {
		console.log("Initialized with height of: ", vnode.dom.offsetHeight)
	},
	view: function() {}
}

m(HeightReporter, {data: "Hello"})
```

You should not modify model data synchronously from this method. Since `oncreate` is run at the end of the render cycle, model changes created from this method will not be reflected in the UI until the next render cycle.

---

### onupdate

The `onupdate(vnode)` hook is called after a DOM element is updated, while attached to the document. `onupdate` is guaranteed to run at the end of the render cycle, so it is safe to read layout values such as `vnode.dom.offsetHeight` and `vnode.dom.getBoundingClientRect()` from this method.

This hook is only called if the element existed in the previous render cycle. It is not called when an element is created or when it is recycled.

DOM elements whose vnodes have an `onupdate` hook do not get recycled.

The `onupdate` hook is useful for reading layout values that may trigger a repaint, and for dynamically updating UI-affecting state in third party libraries after model data has been changed.

```javascript
function RedrawReporter() {
	var count = 0
	return {
		onupdate: function() {
			console.log("Redraws so far: ", ++count)
		},
		view: function() {}
	}
}

m(RedrawReporter, {data: "Hello"})
```

---

### onbeforeremove

The `onbeforeremove(vnode)` hook is called before a DOM element is detached from the document. If a Promise is returned, Mithril only detaches the DOM element after the promise completes.

This hook is only called on the DOM element that loses its `parentNode`, but it does not get called in its child elements.

Like in other hooks, the `this` keyword in the `onbeforeremove` callback points to `vnode.state`. DOM elements whose vnodes have an `onbeforeremove` hook do not get recycled.

```javascript
var Fader = {
	onbeforeremove: function(vnode) {
		vnode.dom.classList.add("fade-out")
		return new Promise(function(resolve) {
			setTimeout(resolve, 1000)
		})
	},
	view: function() {
		return m("div", "Bye")
	},
}
```

---

### onremove

The `onremove(vnode)` hook is called before a DOM element is removed from the document. If a `onbeforeremove` hook is also defined, the `onremove` hook runs after the promise returned from `onbeforeremove` is completed.

This hook is called on any element that is removed from the document, regardless of whether it was directly detached from its parent or whether it is a child of another element that was detached.

Like in other hooks, the `this` keyword in the `onremove` callback points to `vnode.state`. DOM elements whose vnodes have an `onremove` hook do not get recycled.

The `onremove` hook is useful for running clean up tasks.

```javascript
function Timer() {
	var timeout = setTimeout(function() {
		console.log("timed out")
	}, 1000)

	return {
		onremove: function() {
			clearTimeout(timeout)
		},
		view: function() {}
	}
}
```

---

### onbeforeupdate

The `onbeforeupdate(vnode, old)` hook is called before a vnode is diffed in a update. If this function is defined and returns false, Mithril prevents a diff from happening to the vnode, and consequently to the vnode's children.

This hook by itself does not prevent a virtual DOM subtree from being generated unless the subtree is encapsulated within a component.

Like in other hooks, the `this` keyword in the `onbeforeupdate` callback points to `vnode.state`.

This hook is useful to reduce lag in updates in cases where there is a overly large DOM tree.

---

### Avoid anti-patterns

Although Mithril is flexible, some code patterns are discouraged:

#### Avoid premature optimizations

You should only use `onbeforeupdate` to skip diffing as a last resort. Avoid using it unless you have a noticeable performance issue.

Typically performance problems that can be fixed via `onbeforeupdate` boil down to one large array of items. In this context, typically "large" means any array that contains a large number of nodes, be it in a wide spread (the infamous 5000 row table), or in a deep, dense tree.

If you do have a performance issue, first consider whether the UI presents a good user experience and change it if it doesn't. For example, it's highly unlikely that a user would ever sift through 5000 rows of raw table data, and highly likely that it would be easier for a user to use a search feature that returns only the top few most relevant items.

If a design-based solution is not feasible, and you must optimize a UI with a large number of DOM element, apply `onbeforeupdate` on the parent node of the largest array and re-evaluate performance. In the vast majority of cases, a single check should be sufficient. In the rare case that it is not, rinse and repeat, but you should be increasingly wary of each new `onbeforeupdate` declaration. Multiple `onbeforeupdate`s are a code smell that indicates prioritization problems in the design workflow.

Avoid applying the optimization to other areas of your application "just-in-case". Remember that, generally speaking, more code incurs a higher maintenance cost than less code, and `onbeforeupdate` related bugs can be especially difficult to troubleshoot if you rely on object identity for its conditional checks.

Again, **the `onbeforeupdate` hook should only be used as a last resort.**
