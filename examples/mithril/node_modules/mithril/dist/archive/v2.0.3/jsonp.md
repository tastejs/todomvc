# jsonp(options)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)
- [Typical usage](#typical-usage)

---

### Description

Makes JSON-P requests. Typically, it's useful to interact with servers that allow JSON-P but that don't have CORS enabled.

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

### Signature

`promise = m.jsonp(options)`

Argument               | Type                              | Required | Description
---------------------- | --------------------------------- | -------- | ---
`options`              | `Object`                          | Yes      | The request options to pass.
`options.url`          | `String`                          | Yes      | The [path name](paths.md) to send the request to, optionally interpolated with values from `options.params`.
`options.params`       | `Object`                          | No       | The data to be interpolated into the URL and serialized into the querystring.
`options.type`         | `any = Function(any)`             | No       | A constructor to be applied to each object in the response. Defaults to the [identity function](https://en.wikipedia.org/wiki/Identity_function).
`options.callbackName` | `String`                          | No       | The name of the function that will be called as the callback. Defaults to a randomized string (e.g. `_mithril_6888197422121285_0({a: 1})`
`options.callbackKey`  | `String`                          | No       | The name of the querystring parameter name that specifies the callback name. Defaults to `callback` (e.g. `/someapi?callback=_mithril_6888197422121285_0`)
`options.background`   | `Boolean`                         | No       | If `false`, redraws mounted components upon completion of the request. If `true`, it does not. Defaults to `false`.
**returns**            | `Promise`                         |          | A promise that resolves to the response data, after it has been piped through `type` method

`promise = m.jsonp(url, options)`

Argument    | Type      | Required | Description
----------- | --------- | -------- | ---
`url`       | `String`  | Yes      | The [path name](paths.md) to send the request to. `options.url` overrides this when present.
`options`   | `Object`  | No       | The request options to pass.
**returns** | `Promise` |          | A promise that resolves to the response data, after it has been piped through the `type` method

This second form is mostly equivalent to `m.jsonp(Object.assign({url: url}, options))`, just it does not depend on the ES6 global `Object.assign` internally.

[How to read signatures](signatures.md)

---

#### How it works

The `m.jsonp` utility is useful for third party APIs that can return data in [JSON-P](https://en.wikipedia.org/wiki/JSONP) format.

In a nutshell, JSON-P consists of creating a `script` tag whose `src` attribute points to a script that lives in the server outside of your control. Typically, you are required to define a global function and specify its name in the querystring of the script's URL. The response will return code that calls your global function, passing the server's data as the first parameter.

JSON-P has several limitations: it can only use GET requests, it implicitly trusts that the third party server won't serve malicious code and it requires polluting the global JavaScript scope. Nonetheless, it is sometimes the only available way to retrieve data from a service (for example, if the service doesn't support [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)).

---

### Typical usage

Some services follow the de-facto convention of responding with JSON-P if a `callback` querystring key is provided, thus making `m.jsonp` automatically work without any effort:

```javascript
m.jsonp({url: "https://api.github.com/users/lhorie"}).then(function(response) {
	console.log(response.data.login) // logs "lhorie"
})
```

Some services do not follow conventions and therefore you must specify the callback key that the service expects:

```javascript
m.jsonp({
	url: "https://api.flickr.com/services/feeds/photos_public.gne?tags=kitten&format=json",
	callbackKey: "jsoncallback",
})
.then(function(response) {
	console.log(response.link) // logs "https://www.flickr.com/photos/tags/kitten/"
})
```

And sometimes, you just want to take advantage of HTTP caching for GET requests for rarely-modified data:

```javascript
// this request is always called with the same querystring, and therefore it is cached
m.jsonp({
	url: "https://api.github.com/users/lhorie",
	callbackName: "__callback",
})
.then(function(response) {
	console.log(response.data.login) // logs "lhorie"
})
```
