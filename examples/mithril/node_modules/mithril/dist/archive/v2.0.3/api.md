# API

### Cheatsheet

Here are examples for the most commonly used methods. If a method is not listed below, it's meant for advanced usage.

#### m(selector, attrs, children) - [docs](hyperscript.md)

```javascript
m("div.class#id", {title: "title"}, ["children"])
```

---

#### m.mount(element, component) - [docs](mount.md)

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

---

#### m.route(root, defaultRoute, routes) - [docs](route.md)

```javascript
var Home = {
	view: function() {
		return "Welcome"
	}
}

m.route(document.body, "/home", {
	"/home": Home, // defines `https://example.com/#!/home`
})
```

#### m.route.set(path) - [docs](route.md#mrouteset)

```javascript
m.route.set("/home")
```

#### m.route.get() - [docs](route.md#mrouteget)

```javascript
var currentRoute = m.route.get()
```

#### m.route.prefix = prefix - [docs](route.md#mrouteprefix)

Invoke this before `m.route()` to change the routing prefix.

```javascript
m.route.prefix = "#!"
```

#### m(m.route.Link, ...) - [docs](route.md#mroutelink)

```javascript
m(m.route.Link, {href: "/Home"}, "Go to home page")
```

---

#### m.request(options) - [docs](request.md)

```javascript
m.request({
	method: "PUT",
	url: "/api/v1/users/:id",
	params: {id: 1, name: "test"}
})
.then(function(result) {
	console.log(result)
})
```

---

#### m.jsonp(options) - [docs](jsonp.md)

```javascript
m.jsonp({
	url: "/api/v1/users/:id",
	params: {id: 1},
	callbackKey: "callback",
})
.then(function(result) {
	console.log(result)
})
```

---

#### m.parseQueryString(querystring) - [docs](parseQueryString.md)

```javascript
var object = m.parseQueryString("a=1&b=2")
// {a: "1", b: "2"}
```

---

#### m.buildQueryString(object) - [docs](buildQueryString.md)

```javascript
var querystring = m.buildQueryString({a: "1", b: "2"})
// "a=1&b=2"
```

---

#### m.trust(htmlString) - [docs](trust.md)

```javascript
m.render(document.body, m.trust("<h1>Hello</h1>"))
```

---

#### m.redraw() - [docs](redraw.md)

```javascript
var count = 0
function inc() {
	setInterval(function() {
		count++
		m.redraw()
	}, 1000)
}

var Counter = {
	oninit: inc,
	view: function() {
		return m("div", count)
	}
}

m.mount(document.body, Counter)
```
