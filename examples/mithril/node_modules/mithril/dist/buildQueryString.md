# buildQueryString(object)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)

---

### Description

Turns an object into a string of form `a=1&b=2`

```javascript
var querystring = m.buildQueryString({a: "1", b: "2"})
// "a=1&b=2"
```

---

### Signature

`querystring = m.buildQueryString(object)`

Argument     | Type                                       | Required | Description
------------ | ------------------------------------------ | -------- | ---
`object`     | `Object`                                   | Yes      | A key-value map to be converted into a string
**returns**  | `String`                                   |          | A string representing the input object

[How to read signatures](signatures.md)

---

### How it works

The `m.buildQueryString` creates a querystring from an object. It's useful for manipulating URLs

```javascript
var querystring = m.buildQueryString({a: 1, b: 2})

// querystring is "a=1&b=2"
```

#### Deep data structures

Deep data structures are serialized in a way that is understood by popular web application servers such as PHP, Rails and ExpressJS

```javascript
var querystring = m.buildQueryString({a: ["hello", "world"]})

// querystring is "a[0]=hello&a[1]=world"
```

