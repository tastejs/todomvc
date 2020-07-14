# Migrating from v0.2.x

v1.x and v2.x are largely API-compatible with v0.2.x, but there are some breaking changes. Migrating to v2.x is nearly identical, so the notes below apply mostly to both.

If you are migrating, consider using the [mithril-codemods](https://www.npmjs.com/package/mithril-codemods) tool to help automate the most straightforward migrations.

- [`m.prop` removed](#mprop-removed)
- [`m.component` removed](#mcomponent-removed)
- [`m.withAttr` removed](#mwithattr-removed)
- [`m.version` removed](#mversion-removed)
- [`config` function](#config-function)
- [Changes in redraw behaviour](#changes-in-redraw-behaviour)
	- [No more redraw locks](#no-more-redraw-locks)
	- [Cancelling redraw from event handlers](#cancelling-redraw-from-event-handlers)
	- [Synchronous redraw changed](#synchronous-redraw)
	- [`m.startComputation`/`m.endComputation` removed](#mstartcomputationmendcomputation-removed)
- [Component `controller` function](#component-controller-function)
- [Component arguments](#component-arguments)
- [Component vnode children](#component-children)
- [DOM vnode children](#dom-vnode-children)
- [Keys](#keys)
- [`view()` parameters](#view-parameters)
- [Passing components to `m()`](#passing-components-to-m)
- [Passing vnodes to `m.mount()` and `m.route()`](#passing-vnodes-to-mmount-and-mroute)
- [`m.route.mode`](#mroutemode)
- [`m.route()` and anchor tags](#mroute-and-anchor-tags)
- [Path templates](#path-templates)
- [Reading/writing the current route](#readingwriting-the-current-route)
- [Accessing route params](#accessing-route-params)
- [Building/Parsing query strings](#buildingparsing-query-strings)
- [Preventing unmounting](#preventing-unmounting)
- [Run code on component removal](#run-code-on-component-removal)
- [`m.request`](#mrequest)
- [Default `responseType` for `m.request`](#default-responsetype-for-mrequest)
- [`m.deferred` removed](#mdeferred-removed)
- [`m.sync` removed](#msync-removed)
- [`xlink` namespace required](#xlink-namespace-required)
- [Nested arrays in views](#nested-arrays-in-views)
- [`vnode` equality checks](#vnode-equality-checks)

---

## `m.prop` removed

In v2.x, `m.prop()` was converted into now a more powerful stream micro-library, but it's no longer part of core. You can read about how to use the optional Streams module in [the documentation](stream.md).

### v0.2.x

```javascript
var m = require("mithril")

var num = m.prop(1)
```

### v2.x

```javascript
var m = require("mithril")
var prop = require("mithril/stream")

var num = prop(1)
var doubled = num.map(function(n) { return n * 2 })
```

---

## `m.component` removed

In v0.2.x components could be created using either `m(Component)` or `m.component(Component)`. v2.x only support `m(Component)`.

### v0.2.x

```javascript
// These are equivalent
m.component(Component)
m(Component)
```

### v2.x

```javascript
m(Component)
```

---

## `m.withAttr` removed

In v0.2.x event listeners could use `oninput: m.withAttr("value", func)` and similar. In v2.x, just read them directly from the event's target. It synergized well with `m.prop`, but since that was removed in favor of an out of core solution and v1.x didn't see similar broad, idiomatic usage of streams, `m.withAttr` lost most of its usefulness.

### v0.2.x

```javascript
var value = m.prop("")

// In your view
m("input[type=text]", {
	value: value(),
	oninput: m.withAttr("value", value),
})
```

### v2.x

```javascript
var value = ""

// In your view
m("input[type=text]", {
	value: value,
	oninput: function (ev) { value = ev.target.value },
})
```

---

## `m.version` removed

It served little use in general, and you can always add it back yourself. You should prefer feature detection for knowing what features are available, and the v2.x API is designed to better enable this.

---

## `config` function

In v0.2.x mithril provided a single lifecycle method, `config`. v2.x provide much more fine-grained control over the lifecycle of a vnode.

### v0.2.x

```javascript
m("div", {
	config: function(element, isInitialized) {
		// runs on each redraw
		// isInitialized is a boolean representing if the node has been added to the DOM
	}
})
```

### v2.x

More documentation on these new methods is available in [lifecycle-methods.md](lifecycle-methods.md).

```javascript
m("div", {
	// Called before the DOM node is created
	oninit: function(vnode) { /*...*/ },
	// Called after the DOM node is created
	oncreate: function(vnode) { /*...*/ },
	// Called before the node is updated, return false to cancel
	onbeforeupdate: function(vnode, old) { /*...*/ },
	// Called after the node is updated
	onupdate: function(vnode) { /*...*/ },
	// Called before the node is removed, return a Promise that resolves when
	// ready for the node to be removed from the DOM
	onbeforeremove: function(vnode) { /*...*/ },
	// Called before the node is removed, but after onbeforeremove calls done()
	onremove: function(vnode) { /*...*/ }
})
```

If available the DOM-Element of the vnode can be accessed at `vnode.dom`.

---

## Changes in redraw behaviour

Mithril's rendering engine still operates on the basis of semi-automated global redraws, but some APIs and behaviours differ:

### No more redraw locks

In v0.2.x, Mithril allowed 'redraw locks' which temporarily prevented blocked draw logic: by default, `m.request` would lock the draw loop on execution and unlock when all pending requests had resolved - the same behaviour could be invoked manually using `m.startComputation()` and `m.endComputation()`. The latter APIs and the associated behaviour has been removed in v2.x without replacement. Redraw locking can lead to buggy UIs: the concerns of one part of the application should not be allowed to prevent other parts of the view from updating to reflect change.

### Cancelling redraw from event handlers

`m.mount()` and `m.route()` still automatically redraw after a DOM event handler runs. Cancelling these redraws from within your event handlers is now done by setting the `redraw` property on the passed-in event object to `false`.

#### v0.2.x

```javascript
m("div", {
	onclick: function(e) {
		m.redraw.strategy("none")
	}
})
```

#### v2.x

```javascript
m("div", {
	onclick: function(e) {
		e.redraw = false
	}
})
```

### Synchronous redraw changed

In v0.2.x it was possible to force mithril to redraw immediately by passing a truthy value to `m.redraw()`. In v2.x, this functionality was split into two different methods for clarity.

#### v0.2.x

```javascript
m.redraw(true) // redraws immediately & synchronously
```

#### v2.x

```javascript
m.redraw() // schedules a redraw on the next requestAnimationFrame tick
m.redraw.sync() // invokes a redraw immediately and waits for it to complete
```

### `m.startComputation`/`m.endComputation` removed

They are considered anti-patterns and have a number of problematic edge cases, so they were removed without replacement in v2.x.

---

## Component `controller` function

In v2.x, there is no more `controller` property in components - use `oninit` instead.

### v0.2.x

```javascript
m.mount(document.body, {
	controller: function() {
		var ctrl = this

		ctrl.fooga = 1
	},

	view: function(ctrl) {
		return m("p", ctrl.fooga)
	}
})
```

### v2.x

```javascript
m.mount(document.body, {
	oninit: function(vnode) {
		vnode.state.fooga = 1
	},

	view: function(vnode) {
		return m("p", vnode.state.fooga)
	}
})

// OR

m.mount(document.body, {
	// this is bound to vnode.state by default
	oninit: function(vnode) {
		this.fooga = 1
	},

	view: function(vnode) {
		return m("p", this.fooga)
	}
})
```

---

## Component arguments

Arguments to a component in v2.x must be an object, simple values like `String`/`Number`/`Boolean` will be treated as text children. Arguments are accessed within the component by reading them from the `vnode.attrs` object.

### v0.2.x

```javascript
var Component = {
	controller: function(options) {
		// options.fooga === 1
	},

	view: function(ctrl, options) {
		// options.fooga === 1
	}
}

m("div", m.component(Component, { fooga: 1 }))
```

### v2.x

```javascript
var Component = {
	oninit: function(vnode) {
		// vnode.attrs.fooga === 1
	},

	view: function(vnode) {
		// vnode.attrs.fooga === 1
	}
}

m("div", m(Component, { fooga: 1 }))
```

---

## Component vnode children

In v0.2.x, component vnode children were not normalized, just passed as extra arguments, and they were not flattened, either. (Internally, it was just returning a partially applied component that was diffed based on the component being partially applied.) In v2.x, component vnode children are passed via `vnode.children` as a resolved array of children, but like v0.2.x, the individual children themselves are not normalized, nor is the children array flattened.

### v0.2.x

```javascript
var Component = {
	controller: function(value, renderProp) {
		// value === "value"
		// typeof renderProp === "function"
	},

	view: function(ctrl, value, renderProp) {
		// value === "value"
		// typeof renderProp === "function"
	}
}

m("div", m.component(Component, "value", function(key) { return "child" }))
```

### v2.x

```javascript
var Component = {
	oninit: function(vnode) {
		// vnode.children[0] === "value"
		// typeof vnode.children[1] === "function"
	},

	view: function(vnode) {
		// vnode.children[0] === "value"
		// typeof vnode.children[1] === "function"
	},
}

m("div", m(Component, "value", function(key) { return "child" }))
```

---

## DOM vnode children

In v0.2.x, the children of DOM nodes were represented literally with no normalization aside from using the children directly if only a single array child is present. It returned a structure more like this, with the strings represented literally.

```javascript
m("div", "value", ["nested"])

// Becomes:
{
	tag: "div",
	attrs: {},
	children: [
		"value",
		["nested"],
	]
}
```

In v2.x, children of DOM vnodes are normalized to objects of a single consistent structure.

```javascript
m("div", "value", ["nested"])

// Becomes roughly:
{
	tag: "div",
	attrs: null,
	children: [
		{tag: "#", children: "value"},
		{tag: "[", children: [
			{tag: "#", children: "nested"},
		]},
	]
}
```

If only a single text child is present on a DOM vnode, it instead sets `text` to that value.

```javascript
m("div", "value")

// Becomes roughly:
{
	tag: "div",
	attrs: null,
	text: "",
	children: undefined,
}
```

See [the vnode docs](vnodes.md) for more details on the v2.x vnode structure and how things are normalized.

*Most of the v2.x vnode properties here are omitted for brevity.*

---

## Keys

In v0.2.x, you could mix keyed and unkeyed vnodes freely.

In v2.x, children lists of both fragments and elements must be either all keyed or all unkeyed. Holes are considered unkeyed for the purposes of this check, too - it no longer ignores them.

If you need to work around it, use the idiom of a fragment containing a single vnode, like `[m("div", {key: whatever})]`.

---

## `view()` parameters

In v0.2.x view functions are passed a reference to the `controller` instance and (optionally) any options passed to the component. In v2.x they are passed **only** the `vnode`, exactly like the `controller` function.

### v0.2.x

```javascript
m.mount(document.body, {
	controller: function() {},

	view: function(ctrl, options) {
		// ...
	}
})
```

### v2.x

```javascript
m.mount(document.body, {
	oninit: function(vnode) {
		// ...
	},

	view: function(vnode) {
		// Use vnode.state instead of ctrl
		// Use vnode.attrs instead of options
	}
})
```

---

## Passing components to `m()`

In v0.2.x you could pass components as the second argument of `m()` w/o any wrapping required. To help with consistency in v2.x they must always be wrapped with a `m()` invocation.

### v0.2.x

```javascript
m("div", Component)
```

### v2.x

```javascript
m("div", m(Component))
```

---

## Passing vnodes to `m.mount()` and `m.route()`

In v0.2.x, `m.mount(element, component)` tolerated [vnodes](vnodes.md) as second arguments instead of [components](components.md) (even though it wasn't documented). Likewise, `m.route(element, defaultRoute, routes)` accepted vnodes as values in the `routes` object.

In v2.x, components are required instead in both cases.

### v0.2.x

```javascript
m.mount(element, m('i', 'hello'))
m.mount(element, m(Component, attrs))

m.route(element, '/', {
	'/': m('b', 'bye')
})
```

### v2.x

```javascript
m.mount(element, {view: function () {return m('i', 'hello')}})
m.mount(element, {view: function () {return m(Component, attrs)}})

m.route(element, '/', {
	'/': {view: function () {return m('b', 'bye')}}
})
```

---

## `m.route.mode`

In v0.2.x the routing mode could be set by assigning a string of `"pathname"`, `"hash"`, or `"search"` to `m.route.mode`. In `v.1.x` it is replaced by `m.route.prefix = prefix` where `prefix` can any prefix. If it starts with `#`, it works in "hash" mode, `?` for "search" mode, and any other character (or the empty string) for "pathname" mode. It also supports combinations of the above like `m.route.prefix = "/path/#!"` or `?#`.

The default was changed to also use a `#!` (hashbang) prefix instead of just `#`. So if you were using the default behavior and want to retain your existing URLs, specify `m.route.prefix = "#"` before initializing the routes.

### v0.2.x

```javascript
m.route.mode = "hash"
m.route.mode = "pathname"
m.route.mode = "search"
```

### v2.x

```javascript
// Direct equivalents
m.route.prefix = "#"
m.route.prefix = ""
m.route.prefix = "?"
```

---

## `m.route()` and anchor tags

Handling routable links now uses a special built-in component instead of an attribute. If you were using this on `<button>`s and the like, you can specify that tag name using a `selector: "button"` attribute.

### v0.2.x

```javascript
// When clicked this link will load the "/path" route instead of navigating
m("a", {
	href: "/path",
	config: m.route
})
```

### v2.x

```javascript
// When clicked this link will load the "/path" route instead of navigating
m(m.route.Link, {
	href: "/path",
})
```

---

## Path templates

In v1.x, there were three separate path template syntaxes that, although they were similar, had 2 separately designed syntaxes and 3 different implementations. It was defined in a fairly ad-hoc way, and parameters weren't generally escaped. Now, everything is either encoded if it's `:key`, raw if it's `:key...`. If things are unexpectedly encoded, use `:path...`. It's that simple.

Concretely, here's how it affects each method:

### `m.request` URLs

Path components in v2.x are escaped automatically when interpolated and they read their values from `params`. In v0.2.x, `m.request({url: "/user/:name/photos/:id", data: {name: "a/b", id: "c/d"}})` would send its request with the URL set to `/user/a%2Fb/photos/c/d`. In v2.x, the corresponding `m.request({url: "/user/:name/photos/:id", params: {name: "a/b", id: "c/d"}})` would send its request to `/user/a%2Fb/photos/c%2Fd`. If you deliberately *want* to interpolate a key unescaped, use `:key...` instead.

Interpolations in inline query strings, like in `/api/search?q=:query`, are not performed in v2.x. Pass those via `params` with appropriate key names instead, without specifying it in the query string.

Do note that this applies to `m.jsonp` as well. When migrating from `m.request` + `dataType: "jsonp"` to `m.jsonp`, you also need to be aware of this.

### `m.route(route, params, shouldReplaceHistoryEntry)` paths

These permit interpolations now, and they work identically to that of `m.request`.

### `m.route` route patterns

Path keys of the form `:key...` return their URL decoded in v1.x, but return the raw URL in v2.x.

Previously, stuff like `:key.md` were erroneously accepted, with the resulting parameter's value set to `keymd: "..."`. This is no longer the case - the `.md` is part of the pattern now, not the name.

---

## Reading/writing the current route

In v0.2.x all interaction w/ the current route happened via `m.route()`. In v2.x this has been broken out into two functions.

### v0.2.x

```javascript
// Getting the current route
m.route()

// Setting a new route
m.route("/other/route")
```

### v2.x

```javascript
// Getting the current route
m.route.get()

// Setting a new route
m.route.set("/other/route")
```

---

## Accessing route params

In v0.2.x reading route params was entirely handled through `m.route.param()`. This API is still available in v2.x, and additionally any route params are passed as properties in the `attrs` object on the vnode.

### v0.2.x

```javascript
m.route(document.body, "/booga", {
	"/:attr": {
		controller: function() {
			m.route.param("attr") // "booga"
		},
		view: function() {
			m.route.param("attr") // "booga"
		}
	}
})
```

### v2.x

```javascript
m.route(document.body, "/booga", {
	"/:attr": {
		oninit: function(vnode) {
			vnode.attrs.attr // "booga"
			m.route.param("attr") // "booga"
		},
		view: function(vnode) {
			vnode.attrs.attr // "booga"
			m.route.param("attr") // "booga"
		}
	}
})
```

---

## Building/Parsing query strings

v0.2.x used methods hanging off of `m.route`, `m.route.buildQueryString()` and `m.route.parseQueryString()`. In v2.x these have been broken out and moved to the root `m`.

### v0.2.x

```javascript
var qs = m.route.buildQueryString({ a: 1 });

var obj = m.route.parseQueryString("a=1");
```

### v2.x

```javascript
var qs = m.buildQueryString({ a: 1 });

var obj = m.parseQueryString("a=1");
```

Also, in v2.x, `{key: undefined}` is serialized as `key=undefined` by `m.buildQueryString` and methods that use it like `m.request`. In v0.2.x, the key was omitted and this carried over to `m.request`. If you were previously relying on this, change your code to omit the keys from the object entirely. It may be worth using a simple utility to strip all keys from an object whose values are `undefined` if you can't easily do that and you need to retain v0.2.x behavior.

```javascript
// Call whenever you need to omit `undefined` parameters from an object.
function omitUndefineds(object) {
	var result = {}

	for (var key in object) {
		if ({}.hasOwnProperty.call(object, key)) {
			var value = object[key]
			if (Array.isArray(value)) {
				result[key] = value.map(omitUndefineds)
			} else if (value != null && typeof value === "object") {
				result[key] = omitUndefineds(value)
			} else if (value !== undefined) {
				result[key] = value
			}
		}
	}

	return result
}
```

---

## Preventing unmounting

It is no longer possible to prevent unmounting via `onunload`'s `e.preventDefault()`. Instead you should explicitly call `m.route.set` when the expected conditions are met.

### v0.2.x

```javascript
var Component = {
	controller: function() {
		this.onunload = function(e) {
			if (condition) e.preventDefault()
		}
	},
	view: function() {
		return m("a[href=/]", {config: m.route})
	}
}
```

### v2.x

```javascript
var Component = {
	view: function() {
		return m("a", {
			onclick: function() { if (!condition) m.route.set("/") },
		})
	}
}
```

---

## Run code on component removal

Components no longer call `this.onunload` when they are being removed. They now use the standardized lifecycle hook `onremove`.

### v0.2.x

```javascript
var Component = {
	controller: function() {
		this.onunload = function(e) {
			// ...
		}
	},
	view: function() {
		// ...
	}
}
```

### v2.x

```javascript
var Component = {
	onremove: function() {
		// ...
	}
	view: function() {
		// ...
	}
}
```

---

## `m.request`

Promises returned by [m.request](request.md) are no longer `m.prop` getter-setters. In addition, `initialValue`, `unwrapSuccess` and `unwrapError` are no longer supported options.

In addition, requests no longer have `m.startComputation`/`m.endComputation` semantics. Instead, redraws are always triggered when a request promise chain completes (unless `background: true` is set).

The `data` parameter has now been split into `params`, query parameters interpolated into the URL and appended to the request, and `body`, the body to send in the underlying XHR.

In v0.2.x, you would use a `dataType: "jsonp"` to initiate a JSONP request. In v2.x, you now use [`m.jsonp`](jsonp.md), which carries mostly the same API as `m.request` without the XHR-related parts.

### v0.2.x

```javascript
var data = m.request({
	method: "GET",
	url: "https://api.github.com/",
	initialValue: [],
})

setTimeout(function() {
	console.log(data())
}, 1000)

m.request({
	method: "POST",
	url: "https://api.github.com/",
	data: someJson,
})
```

### v2.x

```javascript
var data = []
m.request({
	method: "GET",
	url: "https://api.github.com/",
})
.then(function (responseBody) {
	data = responseBody
})

setTimeout(function() {
	console.log(data) // note: not a getter-setter
}, 1000)

m.request({
	method: "POST",
	url: "https://api.github.com/",
	body: someJson,
})

// OR

var data = []
m.request("https://api.github.com/")
.then(function (responseBody) {
	data = responseBody
})

setTimeout(function() {
	console.log(data) // note: not a getter-setter
}, 1000)

m.request("https://api.github.com/", {
	method: "POST",
	body: someJson,
})
```

Additionally, if the `extract` option is passed to `m.request` the return value of the provided function will be used directly to resolve the request promise, and the `deserialize` callback is ignored.

---

## `m.request` headers

In v0.2.x, Mithril didn't set any headers on requests by default. Now, it sets up to 2 headers:

- `Content-Type: application/json; charset=utf-8` for requests with JSON bodies that are `!= null`
- `Accept: application/json, text/*` for requests expecting JSON responses

The first of the two headers, `Content-Type`, will trigger a CORS prefetch as it [is not a CORS-safelisted request header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header) due to the specified content type, and that could introduce new errors depending on how CORS is configured on your server. If you run into issues with this, you may need to override that header in question by passing `headers: {"Content-Type": "text/plain"}`. (The `Accept` header doesn't trigger anything, so you don't need to override that.)

*The only content types that the Fetch spec lets avoid CORS prefetch checks are `application/x-www-form-urlencoded`, `multipart/form-data`, and `text/plain`. It doesn't allow anything else, and it intentionally disallows JSON.*

---

## `m.deferred` removed

v0.2.x used its own custom asynchronous contract object, exposed as `m.deferred`, which was used as the basis for `m.request`. v2.x uses Promises instead, and implements a [polyfill](promises.md) in non-supporting environments. In situations where you would have used `m.deferred`, you should use Promises instead.

### v0.2.x

```javascript
var greetAsync = function() {
	var deferred = m.deferred()
	setTimeout(function() {
		deferred.resolve("hello")
	}, 1000)
	return deferred.promise
}

greetAsync()
	.then(function(value) {return value + " world"})
	.then(function(value) {console.log(value)}) //logs "hello world" after 1 second
```

### v2.x

```javascript
var greetAsync = function() {
	return new Promise(function(resolve){
		setTimeout(function() {
			resolve("hello")
		}, 1000)
	})
}

greetAsync()
	.then(function(value) {return value + " world"})
	.then(function(value) {console.log(value)}) //logs "hello world" after 1 second
```

---

## `m.sync` removed

Since v2.x uses standards-compliant Promises, `m.sync` is redundant. Use `Promise.all` instead.

### v0.2.x

```javascript
m.sync([
	m.request({ method: 'GET', url: 'https://api.github.com/users/lhorie' }),
	m.request({ method: 'GET', url: 'https://api.github.com/users/isiahmeadows' }),
])
.then(function (users) {
	console.log("Contributors:", users[0].name, "and", users[1].name)
})
```

### v2.x

```javascript
Promise.all([
	m.request({ method: 'GET', url: 'https://api.github.com/users/lhorie' }),
	m.request({ method: 'GET', url: 'https://api.github.com/users/isiahmeadows' }),
])
.then(function (users) {
	console.log("Contributors:", users[0].name, "and", users[1].name)
})
```

---

## `xlink` namespace required

In v0.2.x, the `xlink` namespace was the only supported attribute namespace, and it was supported via special casing behavior. Now namespace parsing is fully supported, and namespaced attributes should explicitly declare their namespace.

### v0.2.x

```javascript
m("svg",
	// the `href` attribute is namespaced automatically
	m("image[href='image.gif']")
)
```

### v2.x

```javascript
m("svg",
	// User-specified namespace on the `href` attribute
	m("image[xlink:href='image.gif']")
)
```

---

## Nested arrays in views

Arrays now represent [fragments](fragment.md), which are structurally significant in v2.x virtual DOM. Whereas nested arrays in v0.2.x would be flattened into one continuous list of virtual nodes for the purposes of diffing, v2.x preserves the array structure - the children of any given array are not considered siblings of those of adjacent arrays.

---

## `vnode` equality checks

If a vnode is strictly equal to the vnode occupying its place in the last draw, v2.x will skip that part of the tree without checking for mutations or triggering any lifecycle methods in the subtree. The component documentation contains [more detail on this issue](components.md#avoid-creating-component-instances-outside-views).
