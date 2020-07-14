# Migrating from v1.x

v2.x is almost entirely API-compatible with v1.x, but there are some breaking changes.

- [Assigning to `vnode.state`](#assigning-to-vnodestate)
- [Changes to route anchors](#changes-to-route-anchors)
- [Changes to `m.request` errors](#changes-to-mrequest-errors)
- [`m.withAttr` removed](#mwithattr-removed)
- [`m.route.prefix`](#mrouteprefix)
- [`m.request`/`m.jsonp` params and body](#mrequest-params-and-body)
- [Path templates](#path-templates)
- [Lifecycle call order](#lifecycle-call-order)
- [`m.redraw` synchronicity](#mredraw)
- [Selector attribute precedence](#selector-attribute-precedence)
- [Children normalization](#children-normalization)
- [Default `responseType` for `m.request`](#default-responsetype-for-mrequest)
- [`m.request` headers](#mrequest-headers)
- [Query parameters in hash strings in routes](#query-parameters-in-hash-strings-in-routes)
- [Keys](#keys)
- [`m.version` removed](#mversion-removed)

---

## Assigning to `vnode.state`

In v1.x, you could manipulate `vnode.state` and assign anything you wanted. In v2.x, an error will be thrown if it changes. Migration may vary, but most cases, it's as simple as changing references `vnode.state` to `vnode.state.foo`, picking an appropriate name for `foo` (like maybe `count` if it's a counter's current value).

### v1.x

```javascript
var Counter = {
    oninit: function(vnode) { vnode.state = 0 },
    view: function(vnode) {
        return m(".counter", [
            m("button", {onclick: function() { vnode.state-- }}, "-")
            vnode.state,
            m("button", {onclick: function() { vnode.state++ }}, "+")
        ])
    }
}
```

### v2.x

```javascript
var Counter = {
    oninit: function(vnode) { vnode.state.count = 0 },
    view: function(vnode) {
        return m(".counter", [
            m("button", {onclick: function() { vnode.state.count-- }}, "-")
            vnode.state.count,
            m("button", {onclick: function() { vnode.state.count++ }}, "+")
        ])
    }
}
```

*When v1.0 first released, class and closure components didn't exist, so it just pulled what it needed from `vnode.tag`. This implementation detail is what allowed you to do it, and some began to rely on it. It was also implied as possible in some places within the docs. Now, things are different, and this makes it a little easier to manage from an implementation standpoint as there's only one reference to state, not two.*

---

## Changes to route anchors

In v1.x, you previously used `oncreate: m.route.link` and, if the link could change, `onupdate: m.route.link` as well, each as lifecycle hooks on the vnode that could be routed with. In v2.x, you now use an [`m.route.Link` component](route.md#mroutelink). The selector can be specified via a `selector:` attribute in case you were using anything other than `m("a", ...)`, options can be specified via `options:`, you can disable it via `disabled:`, and other attributes can be specified inline including `href:` (required). The `selector:` itself can contain be any selector valid as the first argument for `m`, and the attributes `[href=...]` and `[disabled]` can be specified in the selector as well as the normal options.

### v1.x

```javascript
m("a", {
    href: "/path",
    oncreate: m.route.link,
})

m("button", {
    href: "/path",
    oncreate: m.route.link,
})

m("button.btn[href=/path]", {
    oncreate: m.route.link,
})
```

### v2.x

```javascript
m(m.route.Link, {
    href: "/path",
})

m(m.route.Link, {
    selector: "button",
    href: "/path",
})

m(m.route.Link, {
    selector: "button.btn[href=/path]",
})
```

---

## Changes to `m.request` errors

In v1.x, `m.request` parsed errors from JSON calls and assigned the resulting parsed object's properties to the response. So, if you received a response with status 403 and a body of `{"code": "backoff", "timeout": 1000}`, the error would have two extra properties: `err.code = "backoff"` and `err.timeout = 1000`.

In v2.x, the response is assigned to a `response` property on the result instead, and a `code` property contains the resulting status code. So if you received a response with status 403 and a body of `{"code": "backoff", "timeout": 1000}`, the error would have assigned to it two properties: `err.response = {code: "backoff", timeout: 1000}` and `err.code = 403`.

---

## `m.withAttr` removed

In v1.x, event listeners could use `oninput: m.withAttr("value", func)` and similar. In v2.x, just read them directly from the event's target. It synergized well with streams, but since the idiom of `m.withAttr("value", stream)` was not *nearly* as common as `m.withAttr("value", prop)`, `m.withAttr` lost most of its usefulness and so it was removed.

### v1.x

```javascript
var value = ""

// In your view
m("input[type=text]", {
    value: value(),
    oninput: m.withAttr("value", function(v) { value = v }),
})

// OR

var value = m.stream("")

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

// OR

var value = m.stream("")

// In your view
m("input[type=text]", {
    value: value(),
    oninput: function (ev) { value(ev.target.value) },
})
```

---

## `m.route.prefix`

In v1.x, `m.route.prefix` was a function called via `m.route.prefix(prefix)`. It's now a property you set to via `m.route.prefix = prefix`

### v1.x

```javascript
m.route.prefix("/root")
```

### v2.x

```javascript
m.route.prefix = "/root"
```

---

## `m.request`/`m.jsonp` params and body

The `data` and `useBody` were refactored into `params`, query parameters interpolated into the URL and appended to the request, and `body`, the body to send in the underlying XHR. This gives you much better control over the actual request sent and allows you to both interpolate into query parameters with `POST` requests and create `GET` requests with bodies.

`m.jsonp`, having no meaningful "body", just uses `params`, so renaming `data` to `params` is sufficient for that method.

### v1.x

```javascript
m.request("https://example.com/api/user/:id", {
	method: "GET",
    data: {id: user.id}
})

m.request("https://example.com/api/user/create", {
	method: "POST",
    data: userData
})
```

### v2.x

```javascript
m.request("https://example.com/api/user/:id", {
	method: "GET",
    params: {id: user.id}
})

m.request("https://example.com/api/user/create", {
	method: "POST",
    body: userData
})
```

---

## Path templates

In v1.x, there were three separate path template syntaxes that, although they were similar, had 2 separately designed syntaxes and 3 different implementations. It was defined in a fairly ad-hoc way, and parameters weren't generally escaped. Now, everything is either encoded if it's `:key`, raw if it's `:key...`. If things are unexpectedly encoded, use `:path...`. It's that simple.

Concretely, here's how it affects each method:

### `m.request` and `m.jsonp` URLs, `m.route.set` paths

Path components in v2.x are escaped automatically when interpolated. Suppose you invoke `m.route.set("/user/:name/photos/:id", {name: user.name, id: user.id})`. Previously, if `user` was `{name: "a/b", id: "c/d"}`, this would set the route to `/user/a%2Fb/photos/c/d`, but it will now set it to `/user/a%2Fb/photos/c%2Fd`. If you deliberately *want* to interpolate a key unescaped, use `:key...` instead.

Keys in v2.x cannot contain any instances of `.` or `-`. In v1.x, they could contain anything other than `/`.

Interpolations in inline query strings, like in `/api/search?q=:query`, are not performed in v2.x. Pass those via `params` with appropriate key names instead, without specifying it in the query string.

### `m.route` route patterns

Path keys of the form `:key...` return their URL decoded in v1.x, but return the raw URL in v2.x.

Previously, stuff like `:key.md` were erroneously accepted, with the resulting parameter's value set to `keymd: "..."`. This is no longer the case - the `.md` is part of the pattern now, not the name.

---

## Lifecycle call order

In v1.x, attribute lifecycle hooks on component vnodes were called *before* the component's own lifecycle hooks in all cases. In v2.x, this is the case only for `onbeforeupdate`. So you may need to adjust your code accordingly.

### v1.x

```javascript
var Comp = {
    oncreate: function() {
        console.log("Component oncreate")
    },
    view: function() {
        return m("div")
    },
}

m.mount(document.body, {
    view: function() {
        return m(Comp, {
            oncreate: function() {
                console.log("Attrs oncreate")
            },
        })
    }
})

// Logs:
// Attrs oncreate
// Component oncreate
```

### v2.x

```javascript
var Comp = {
    oncreate: function() {
        console.log("Component oncreate")
    },
    view: function() {
        return m("div")
    },
}

m.mount(document.body, {
    view: function() {
        return m(Comp, {
            oncreate: function() {
                console.log("Attrs oncreate")
            },
        })
    }
})

// Logs:
// Component oncreate
// Attrs oncreate
```

---

## `m.redraw` synchronicity

`m.redraw()` in v2.x is always async. You can specifically request a synchronous redraw via `m.redraw.sync()` provided no redraw is currently occurring.

---

## Selector attribute precedence

In v1.x, selector attributes took precedence over attributes specified in the attributes object. For instance, `m("[a=b]", {a: "c"}).attrs` returned `{a: "b"}`.

In v2.x, attributes specified in the attributes object take precedence over selector attributes. For instance, `m("[a=b]", {a: "c"}).attrs` returns `{a: "c"}`.

Note that this is technically reverting to v0.2.x behavior.

---

## Children normalization

In v1.x, component vnode children were normalized like other vnodes. In v2.x, this is no longer the case and you will need to plan accordingly. This does not affect the normalization done on render.

---

## `m.request` headers

In v1.x, Mithril set these two headers on all non-`GET` requests, but only when `useBody` was set to `true` (the default) and the other conditions listed hold:

- `Content-Type: application/json; charset=utf-8` for requests with JSON bodies
- `Accept: application/json, text/*` for requests expecting JSON responses

In v2.x, Mithril sets the first for all requests with JSON bodies that are `!= null` and omits it by default otherwise, and this is done independent of which method is chosen, including on `GET` requests.

The first of the two headers, `Content-Type`, will trigger a CORS prefetch as it [is not a CORS-safelisted request header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header) due to the specified content type, and that could introduce new errors depending on how CORS is configured on your server. If you run into issues with this, you may need to override that header in question by passing `headers: {"Content-Type": "text/plain"}`. (The `Accept` header doesn't trigger anything, so you don't need to override that.)

*The only content types that the Fetch spec lets avoid CORS prefetch checks are `application/x-www-form-urlencoded`, `multipart/form-data`, and `text/plain`. It doesn't allow anything else, and it intentionally disallows JSON.*

---

## Query parameters in hash strings in routes

In v1.x, you could specify query parameters for routes in both the query string and hash string, so `m.route.set("/route?foo=1&bar=2")`, `m.route.set("/route?foo=1#bar=2")`, and `m.route.set("/route#foo=1&bar=2")` were all equivalent and the attributes extracted from them would have been `{foo: "1", bar: "2"}`.

In v2.x, the contents of hash strings are ignored but preserved. So the attributes extracted from each would be this:

- `m.route.set("/route?foo=1&bar=2")` &rarr; `{foo: "1", bar: "2"}`
- `m.route.set("/route?foo=1#bar=2")` &rarr; `{foo: "1"}`
- `m.route.set("/route#foo=1&bar=2")` &rarr; `{}`

The reason for doing this is because URLs like `https://example.com/#!/route#key` are technically invalid per the [URL spec](https://url.spec.whatwg.org/#url-code-points) and were even invalid per the [RFC that preceded it](https://tools.ietf.org/html/rfc3986#appendix-A), and it's only a quirk of the HTML spec that they're allowed. (The HTML spec should've required IDs and location fragments to be valid URL fragments from the start instead if it wanted to follow spec.)

Or in short, stop using invalid URLs!

---

## Keys

In v1.x, you could mix keyed and unkeyed vnodes freely. If the first node is keyed, a keyed diff is performed, assuming every element has a key and just ignoring holes as it goes. Otherwise, an iterative diff is performed, and if a node has a key, it would be checked that it didn't change at the same time tags and similar are checked.

In v2.x, children lists of both fragments and elements must be either all keyed or all unkeyed. Holes are considered unkeyed for the purposes of this check, too - it no longer ignores them.

If you need to work around it, use the idiom of a fragment containing a single vnode, like `[m("div", {key: whatever})]`.

---

## `m.version` removed

It served little use in general, and you can always add it back yourself. You should prefer feature detection for knowing what features are available, and the v2.x API is designed to better enable this.
