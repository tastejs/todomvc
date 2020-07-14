# Path Handling

- [Path types](#path-types)
- [Path parameters](#path-parameters)
- [Parameter normalization](#parameter-normalization)
- [Path normalization](#path-normalization)
- [Path escaping](#path-escaping)

-----

[`m.route`](route.md), [`m.request`](request.md), and [`m.jsonp`](jsonp.md) each have a concept called a path. This is used to generate the URL you route to or fetch from.

### Path types

There are two general types of paths: raw paths and parameterized paths.

- Raw paths are simply strings used directly as URLs. Nothing is substituted or even split. It's just normalized with all the parameters appended to the end.
- Parameterized paths let you insert values into paths, escaped by default for convenience and safety against URL injection.

For [`m.request`](request.md) and [`m.jsonp`](jsonp.md), these can be pretty much any URL, but for [routes](route.md), these can only be absolute URL path names without schemes or domains.

### Path parameters

Path parameters are themselves pretty simple. They come in two forms:

- `:foo` - This injects a simple `params.foo` into the URL, escaping its value first.
- `:foo...` - This injects a raw `params.foo` path into the URL without escaping anything.

You're probably wondering what that `params` object is supposed to be. It's pretty simple: it's the `params` in either [`m.route.set(path, params)`](route.md#mrouteset), [`m.request({url, params})`](request.md#signature), or [`m.jsonp({url, params})`](jsonp.md#signature).

When receiving routes via [`m.route(root, defaultRoute, routes)`](route.md#signature), you can use these parameters to *extract* values from routes. They work basically the same way as generating the paths, just in the opposite direction.

```javascript
// Edit a single item
m.route(document.body, "/edit/1", {
	"/edit/:id": {
    	view: function() {
    		return [
    			m(Menu),
    			m("h1", "Editing user " + m.route.param("id"))
    		]
    	}
    },
})

// Edit an item identified by path
m.route(document.body, "/edit/pictures/image.jpg", {
	"/edit/:file...": {
    	view: function() {
    		return [
    			m(Menu),
    			m("h1", "Editing file " + m.route.param("file"))
    		]
    	}
    },
})
```

In the first example, assuming you're navigating to the default route in each, `m.route.param("id")` would be read as `"1"` and `m.route.param("file")` would be read as `pictures/image.jpg`.

Path parameters may be delimited by either a `/`, `-`, or `.`. This lets you have dynamic path segments, and they're considerably more flexible than just a path name. For example, you could match against routes like `"/edit/:name.:ext"` for editing based on file extension or `"/:lang-:region/view"` for a localized route.

Path parameters are greedy: given a declared route `"/edit/:name.:ext"`, if you navigate to `/edit/file.test.png`, the parameters extracted will be `{name: "file.test", ext: "png"}`, not `{name: "file", ext: "test.png"}`. Similarly, given `"/route/:path.../view/:child..."`, if you go to `/route/foo/view/bar/view/baz`, the parameters extracted will be `{path: "foo/view/bar", child: "baz"}`.

### Parameter normalization

Path parameters that are interpolated into path names are omitted from the query string, for convenience and to keep the path name reasonably readable. For example, this sends a server request of `GET /api/user/1/connections?sort=name-asc`, omitting the duplicate `id=1` in the URL string.

```javascript
m.request({
    url: "https://example.com/api/user/:userID/connections",
    params: {
        userID: 1,
        sort: "name-asc"
    }
})
```

You can also specify parameters explicitly in the query string itself, such as in this, which is equivalent to the above:

```javascript
m.request({
    url: "https://example.com/api/user/:userID/connections?sort=name-asc",
    params: {
        userID: 1
    }
})
```

And of course, you can mix and match. This fires a request to `GET /api/user/1/connections?sort=name-asc&first=10`.

```javascript
m.request({
    url: "https://example.com/api/user/:userID/connections?sort=name-asc",
    params: {
        userID: 1,
        first: 10
    }
})
```

This even extends to route matching: you can match against a route *with* explicit query strings. It retains the matched parameter for convenience, so you can still access them via vnode parameters or via [`m.route.param`](route.md#mrouteparam). Note that although this *is* possible, it's not generally recommended, since you should prefer paths for pages. It could sometimes useful if you need to generate a somewhat different view just for a particular file type, but it still logically is a query-like parameter, not a whole separate page.

```javascript
// Note: this is generally *not* recommended - you should prefer paths for route
// declarations, not query strings.
m.route(document.body, "/edit/1", {
	"/edit?type=image": {
    	view: function() {
    		return [
    			m(Menu),
    			m("h1", "Editing photo")
    		]
    	}
    },
    "/edit": {
        view: function() {
    		return [
    			m(Menu),
    			m("h1", "Editing " + m.route.param("type"))
    		]
    	}
    }
})
```

Query parameters are implicitly consumed - you don't need to name them to accept them. You can match based on an existing value, like in `"/edit?type=image"`, but you don't need to use `"/edit?type=:type"` to accept the value. In fact, Mithril would treat that as you trying to literally match against `m.route.param("type") === ":type"`, so you probably don't want to do that. In short, use `m.route.param("key")` or route component attributes to read query parameters.

### Path normalization

Parsed paths are always returned with all the duplicate parameters and extra slashes dropped, and they always start with a slash. These little differences often get in the way, and it makes routing and path handling a lot more complicated than it should be. Mithril internally normalizes paths for routing, but it does not expose the current, normalized route directly. (You could compute it via [`m.parsePathname(m.route.get()).path`](parsePathname.md).)

When parameters are deduplicated during matching, parameters in the query string are preferred over parameters in the path name, and parameters towards the end of the URL are preferred over parameters closer to the start of the URL.

### Path escaping

There are some characters that, if you want to use them literally, you need to escape. Conveniently, `encodeURIComponent` encodes these (and more), and when you substitute parameters and add query parameters, they're encoded as necessary using this. Here's the ones Mithril interprets:

- `:` = `%3A`
- `/` = `%2F` (required only in paths)
- `%` = `%25`
- `?` = `%3F` (required only in paths)
- `#` = `%23`

Of course, there's others you have to escape per the URL spec, like spaces. But as already noted, `encodeURIComponent` does that for you, and Mithril uses that implicitly when you substitute parameters. So you only really need to care if you're specifying parameters explicitly like in `m.request("https://example.com/api/user/User%20Name/:field", {params: {field: ...}})`.
