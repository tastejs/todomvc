# parsePathname(string)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)

---

### Description

Turns a string of the form `/path/user?a=1&b=2` to an object

```javascript
var object = m.parsePathname("/path/user?a=1&b=2")
// {path: "/path/user", params: {a: "1", b: "2"}}
```

---

### Signature

`object = m.parsePathname(string)`

Argument     | Type     | Required | Description
------------ | -------- | -------- | ---
`string`     | `String` | Yes      | A URL
**returns**  | `Object` |          | A `{path, params}` pair where `path` is the [normalized path](paths.md#path-normalization) and `params` is the [parsed parameters](paths.md#parameter-normalization).

[How to read signatures](signatures.md)

---

### How it works

The `m.parsePathname` method creates an object from a path with a possible query string. It is useful for parsing a local path name into its parts, and it's what [`m.route`](route.md) uses internally to normalize paths to later match them. It uses [`m.parseQueryString`](parseQueryString.md) to parse the query parameters into an object.

```javascript
var data = m.parsePathname("/path/user?a=hello&b=world")

// data.path is "/path/user"
// data.params is {a: "hello", b: "world"}
```

### General-purpose URL parsing

The method is called `parsePathname` because it applies to pathnames. If you want a general-purpose URL parser, you should use [the global `URL` class](https://developer.mozilla.org/en-US/docs/Web/API/URL) instead.
