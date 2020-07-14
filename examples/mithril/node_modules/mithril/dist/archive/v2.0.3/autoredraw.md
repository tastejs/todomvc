# The auto-redraw system

Mithril implements a virtual DOM diffing system for fast rendering, and in addition, it offers various mechanisms to gain granular control over the rendering of an application.

When used idiomatically, Mithril employs an auto-redraw system that synchronizes the DOM whenever changes are made in the data layer. The auto-redraw system becomes enabled when you call `m.mount` or `m.route` (but it stays disabled if your app is bootstrapped solely via `m.render` calls).

The auto-redraw system simply consists of triggering a re-render function behind the scenes after certain functions complete.

### After event handlers

Mithril automatically redraws after DOM event handlers that are defined in a Mithril view:

```javascript
var MyComponent = {
	view: function() {
		return m("div", {onclick: doSomething})
	}
}

function doSomething() {
	// a redraw happens synchronously after this function runs
}

m.mount(document.body, MyComponent)
```

You can disable an auto-redraw for specific events by setting `e.redraw` to `false`.

```javascript
var MyComponent = {
	view: function() {
		return m("div", {onclick: doSomething})
	}
}

function doSomething(e) {
	e.redraw = false
	// no longer triggers a redraw when the div is clicked
}

m.mount(document.body, MyComponent)
```


### After m.request

Mithril automatically redraws after [`m.request`](request.md) completes:

```javascript
m.request("/api/v1/users").then(function() {
	// a redraw happens after this function runs
})
```

You can disable an auto-redraw for a specific request by setting the `background` option to true:

```javascript
m.request("/api/v1/users", {background: true}).then(function() {
	// does not trigger a redraw
})
```


### After route changes

Mithril automatically redraws after [`m.route.set()`](route.md#mrouteset) calls and after route changes via links using [`m.route.Link`](route.md#mroutelink).

```javascript
var RoutedComponent = {
	view: function() {
		return [
			// a redraw happens asynchronously after the route changes
			m(m.route.Link, {href: "/"}),
			m("div", {
				onclick: function() {
					m.route.set("/")
				}
			}),
		]
	}
}

m.route(document.body, "/", {
	"/": RoutedComponent,
})
```

---

### When Mithril does not redraw

Mithril does not redraw after `setTimeout`, `setInterval`, `requestAnimationFrame`, raw `Promise` resolutions and 3rd party library event handlers (e.g. Socket.io callbacks). In those cases, you must manually call [`m.redraw()`](redraw.md).

Mithril also does not redraw after lifecycle methods. Parts of the UI may be redrawn after an `oninit` handler, but other parts of the UI may already have been redrawn when a given `oninit` handler fires. Handlers like `oncreate` and `onupdate` fire after the UI has been redrawn.

If you need to explicitly trigger a redraw within a lifecycle method, you should call `m.redraw()`, which will trigger an asynchronous redraw.

```javascript
function StableComponent() {
	var height = 0

	return {
		oncreate: function(vnode) {
			height = vnode.dom.offsetHeight
			m.redraw()
		},
		view: function() {
			return m("div", "This component is " + height + "px tall")
		}
	}
}
```

Mithril does not auto-redraw vnode trees that are rendered via `m.render`. This means redraws do not occur after event changes and `m.request` calls for templates that were rendered via `m.render`. Thus, if your architecture requires manual control over when rendering occurs (as can sometimes be the case when using libraries like Redux), you should use `m.render` instead of `m.mount`.

Remember that `m.render` expects a vnode tree, and `m.mount` expects a component:

```javascript
// wrap the component in a m() call for m.render
m.render(document.body, m(MyComponent))

// don't wrap the component for m.mount
m.mount(document.body, MyComponent)
```

Mithril may also avoid auto-redrawing if the frequency of requested redraws is higher than one animation frame (typically around 16ms). This means, for example, that when using fast-firing events like `onresize` or `onscroll`, Mithril will automatically throttle the number of redraws to avoid lag.
