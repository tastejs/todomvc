# request(options)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)
- [Typical usage](#typical-usage)
- [Error handling](#error-handling)
- [Loading icons and error messages](#loading-icons-and-error-messages)
- [Dynamic URLs](#dynamic-urls)
- [Aborting requests](#aborting-requests)
- [File uploads](#file-uploads)
- [Monitoring progress](#monitoring-progress)
- [Casting response to a type](#casting-response-to-a-type)
- [Non-JSON responses](#non-json-responses)
- [Retrieving response details](#retrieving-response-details)
- [Why JSON instead of HTML](#why-json-instead-of-html)
- [Why XHR instead of fetch](#why-xhr-instead-of-fetch)
- [Avoid anti-patterns](#avoid-anti-patterns)

---

### Description

Makes XHR (aka AJAX) requests, and returns a [promise](promise.md)

```javascript
m.request({
	method: "PUT",
	url: "/api/v1/users/:id",
	params: {id: 1},
	body: {name: "test"}
})
.then(function(result) {
	console.log(result)
})
```

---

### Signature

`promise = m.request(options)`

Argument                  | Type                              | Required | Description
------------------------- | --------------------------------- | -------- | ---
`options`                 | `Object`                          | Yes      | The request options to pass.
`options.method`          | `String`                          | No       | The HTTP method to use. This value should be one of the following: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` or `OPTIONS`. Defaults to `GET`.
`options.url`             | `String`                          | Yes      | The [path name](paths.md) to send the request to, optionally interpolated with values from `options.params`.
`options.params`            | `Object`                        | No       | The data to be interpolated into the URL and/or serialized into the query string.
`options.body`            | `Object`                          | No       | The data to be serialized into the body (for other types of requests).
`options.async`           | `Boolean`                         | No       | Whether the request should be asynchronous. Defaults to `true`.
`options.user`            | `String`                          | No       | A username for HTTP authorization. Defaults to `undefined`.
`options.password`        | `String`                          | No       | A password for HTTP authorization. Defaults to `undefined`. This option is provided for `XMLHttpRequest` compatibility, but you should avoid using it because it sends the password in plain text over the network.
`options.withCredentials` | `Boolean`                         | No       | Whether to send cookies to 3rd party domains. Defaults to `false`
`options.timeout`         | `Number`                          | No       | The amount of milliseconds a request can take before automatically being [terminated](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout).  Defaults to `undefined`.
`options.responseType`    | `String`                          | No       | The expected [type](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType) of the response. Defaults to `""` if `extract` is defined, `"json"` if missing. If `responseType: "json"`, it internally performs `JSON.parse(responseText)`.
`options.config`          | `xhr = Function(xhr)`             | No       | Exposes the underlying XMLHttpRequest object for low-level configuration and optional replacement (by returning a new XHR).
`options.headers`         | `Object`                          | No       | Headers to append to the request before sending it (applied right before `options.config`).
`options.type`            | `any = Function(any)`             | No       | A constructor to be applied to each object in the response. Defaults to the [identity function](https://en.wikipedia.org/wiki/Identity_function).
`options.serialize`       | `string = Function(any)`          | No       | A serialization method to be applied to `body`. Defaults to `JSON.stringify`, or if `options.body` is an instance of [`FormData`](https://developer.mozilla.org/en/docs/Web/API/FormData), defaults to the [identity function](https://en.wikipedia.org/wiki/Identity_function) (i.e. `function(value) {return value}`).
`options.deserialize`     | `any = Function(any)`          | No       | A deserialization method to be applied to the `xhr.response` or normalized `xhr.responseText`. Defaults to the [identity function](https://en.wikipedia.org/wiki/Identity_function). If `extract` is defined, `deserialize` will be skipped.
`options.extract`         | `any = Function(xhr, options)`    | No       | A hook to specify how the XMLHttpRequest response should be read. Useful for processing response data, reading headers and cookies. By default this is a function that returns `options.deserialize(parsedResponse)`, throwing an exception when the server response status code indicates an error or when the response is syntactically invalid. If a custom `extract` callback is provided, the `xhr` parameter is the XMLHttpRequest instance used for the request, and `options` is the object that was passed to the `m.request` call. Additionally, `deserialize` will be skipped and the value returned from the extract callback will be left as-is when the promise resolves.
`options.background`      | `Boolean`                         | No       | If `false`, redraws mounted components upon completion of the request. If `true`, it does not. Defaults to `false`.
**returns**               | `Promise`                         |          | A promise that resolves to the response data, after it has been piped through the `extract`, `deserialize` and `type` methods

`promise = m.request(url, options)`

Argument    | Type      | Required | Description
----------- | --------- | -------- | ---
`url`       | `String`  | Yes      | The [path name](paths.md) to send the request to. `options.url` overrides this when present.
`options`   | `Object`  | No       | The request options to pass.
**returns** | `Promise` |          | A promise that resolves to the response data, after it has been piped through the `extract`, `deserialize` and `type` methods

This second form is mostly equivalent to `m.request(Object.assign({url: url}, options))`, just it does not depend on the ES6 global `Object.assign` internally.

[How to read signatures](signatures.md)

---

### How it works

The `m.request` utility is a thin wrapper around [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), and allows making HTTP requests to remote servers in order to save and/or retrieve data from a database.

```javascript
m.request({
	method: "GET",
	url: "/api/v1/users",
})
.then(function(users) {
	console.log(users)
})
```

A call to `m.request` returns a [promise](promise.md) and triggers a redraw upon completion of its promise chain.

By default, `m.request` assumes the response is in JSON format and parses it into a JavaScript object (or array).

If the HTTP response status code indicates an error, the returned Promise will be rejected. Supplying an extract callback will prevent the promise rejection.

---

### Typical usage

Here's an illustrative example of a component that uses `m.request` to retrieve some data from a server.

```javascript
var Data = {
	todos: {
		list: [],
		fetch: function() {
			m.request({
				method: "GET",
				url: "/api/v1/todos",
			})
			.then(function(items) {
				Data.todos.list = items
			})
		}
	}
}

var Todos = {
	oninit: Data.todos.fetch,
	view: function(vnode) {
		return Data.todos.list.map(function(item) {
			return m("div", item.title)
		})
	}
}

m.route(document.body, "/", {
	"/": Todos
})
```

Let's assume making a request to the server URL `/api/items` returns an array of objects in JSON format.

When `m.route` is called at the bottom, the `Todos` component is initialized. `oninit` is called, which calls `m.request`. This retrieves an array of objects from the server asynchronously. "Asynchronously" means that JavaScript continues running other code while it waits for the response from server. In this case, it means `fetch` returns, and the component is rendered using the original empty array as `Data.todos.list`. Once the request to the server completes, the array of objects `items` is assigned to `Data.todos.list` and the component is rendered again, yielding a list of `<div>`s containing the titles of each `todo`.

---

### Error handling

When a non-`file:` request returns with any status other than 2xx or 304, it rejects with an error. This error is a normal [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) instance, but with a few special properties.

- `error.message` is set to the raw response text.
- `error.code` is set to the status code itself.
- `error.response` is set to the parsed response, using `options.extract` and `options.deserialize` as is done with normal responses.

This is useful in many cases where errors are themselves things you can account for. If you want to detect if a session expired - you can do `if (error.code === 401) return promptForAuth().then(retry)`. If you hit an API's throttling mechanism and it returned an error with a `"timeout": 1000`, you could do a `setTimeout(retry, error.response.timeout)`.

---

### Loading icons and error messages

Here's an expanded version of the example above that implements a loading indicator and an error message:

```javascript
var Data = {
	todos: {
		list: null,
		error: "",
		fetch: function() {
			m.request({
				method: "GET",
				url: "/api/v1/todos",
			})
			.then(function(items) {
				Data.todos.list = items
			})
			.catch(function(e) {
				Data.todos.error = e.message
			})
		}
	}
}

var Todos = {
	oninit: Data.todos.fetch,
	view: function(vnode) {
		return Data.todos.error ? [
			m(".error", Data.todos.error)
		] : Data.todos.list ? [
			Data.todos.list.map(function(item) {
				return m("div", item.title)
			})
		] : m(".loading-icon")
	}
}

m.route(document.body, "/", {
	"/": Todos
})
```

There are a few differences between this example and the one before. Here, `Data.todos.list` is `null` at the beginning. Also, there's an extra field `error` for holding an error message, and the view of the `Todos` component was modified to displays an error message if one exists, or display a loading icon if `Data.todos.list` is not an array.

---

### Dynamic URLs

Request URLs may contain interpolations:

```javascript
m.request({
	method: "GET",
	url: "/api/v1/users/:id",
	params: {id: 123},
}).then(function(user) {
	console.log(user.id) // logs 123
})
```

In the code above, `:id` is populated with the data from the `params` object, and the request becomes `GET /api/v1/users/123`.

Interpolations are ignored if no matching data exists in the `params` property.

```javascript
m.request({
	method: "GET",
	url: "/api/v1/users/foo:bar",
	params: {id: 123},
})
```

In the code above, the request becomes `GET /api/v1/users/foo:bar?id=123`

---

### Aborting requests

Sometimes, it is desirable to abort a request. For example, in an autocompleter/typeahead widget, you want to ensure that only the last request completes, because typically autocompleters fire several requests as the user types and HTTP requests may complete out of order due to the unpredictable nature of networks. If another request finishes after the last fired request, the widget would display less relevant (or potentially wrong) data than if the last fired request finished last.

`m.request()` exposes its underlying `XMLHttpRequest` object via the `options.config` parameter, which allows you to save a reference to that object and call its `abort` method when required:

```javascript
var searchXHR = null
function search() {
	abortPreviousSearch()

	m.request({
		method: "GET",
		url: "/api/v1/users",
		params: {search: query},
		config: function(xhr) {searchXHR = xhr}
	})
}
function abortPreviousSearch() {
	if (searchXHR !== null) searchXHR.abort()
	searchXHR = null
}
```

---

### File uploads

To upload files, first you need to get a reference to a [`File`](https://developer.mozilla.org/en/docs/Web/API/File) object. The easiest way to do that is from a `<input type="file">`.

```javascript
m.render(document.body, [
	m("input[type=file]", {onchange: upload})
])

function upload(e) {
	var file = e.target.files[0]
}
```

The snippet above renders a file input. If a user picks a file, the `onchange` event is triggered, which calls the `upload` function. `e.target.files` is a list of `File` objects.

Next, you need to create a [`FormData`](https://developer.mozilla.org/en/docs/Web/API/FormData) object to create a [multipart request](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html), which is a specially formatted HTTP request that is able to send file data in the request body.

```javascript
function upload(e) {
	var file = e.target.files[0]

	var body = new FormData()
	body.append("myfile", file)
}
```

Next, you need to call `m.request` and set `options.method` to an HTTP method that uses body (e.g. `POST`, `PUT`, `PATCH`) and use the `FormData` object as `options.body`.

```javascript
function upload(e) {
	var file = e.target.files[0]

	var body = new FormData()
	body.append("myfile", file)

	m.request({
		method: "POST",
		url: "/api/v1/upload",
		body: body,
	})
}
```

Assuming the server is configured to accept multipart requests, the file information will be associated with the `myfile` key.

#### Multiple file uploads

It's possible to upload multiple files in one request. Doing so will make the batch upload atomic, i.e. no files will be processed if there's an error during the upload, so it's not possible to have only part of the files saved. If you want to save as many files as possible in the event of a network failure, you should consider uploading each file in a separate request instead.

To upload multiple files, simply append them all to the `FormData` object. When using a file input, you can get a list of files by adding the `multiple` attribute to the input:

```javascript
m.render(document.body, [
	m("input[type=file][multiple]", {onchange: upload})
])

function upload(e) {
	var files = e.target.files

	var body = new FormData()
	for (var i = 0; i < files.length; i++) {
		body.append("file" + i, files[i])
	}

	m.request({
		method: "POST",
		url: "/api/v1/upload",
		body: body,
	})
}
```

---

### Monitoring progress

Sometimes, if a request is inherently slow (e.g. a large file upload), it's desirable to display a progress indicator to the user to signal that the application is still working.

`m.request()` exposes its underlying `XMLHttpRequest` object via the `options.config` parameter, which allows you to attach event listeners to the XMLHttpRequest object:

```javascript
var progress = 0

m.mount(document.body, {
	view: function() {
		return [
			m("input[type=file]", {onchange: upload}),
			progress + "% completed"
		]
	}
})

function upload(e) {
	var file = e.target.files[0]

	var body = new FormData()
	body.append("myfile", file)

	m.request({
		method: "POST",
		url: "/api/v1/upload",
		body: body,
		config: function(xhr) {
			xhr.upload.addEventListener("progress", function(e) {
				progress = e.loaded / e.total

				m.redraw() // tell Mithril that data changed and a re-render is needed
			})
		}
	})
}
```

In the example above, a file input is rendered. If the user picks a file, an upload is initiated, and in the `config` callback, a `progress` event handler is registered. This event handler is fired whenever there's a progress update in the XMLHttpRequest. Because the XMLHttpRequest's progress event is not directly handled by Mithril's virtual DOM engine, `m.redraw()` must be called to signal to Mithril that data has changed and a redraw is required.

---

### Casting response to a type

Depending on the overall application architecture, it may be desirable to transform the response data of a request to a specific class or type (for example, to uniformly parse date fields or to have helper methods).

You can pass a constructor as the `options.type` parameter and Mithril will instantiate it for each object in the HTTP response.

```javascript
function User(data) {
	this.name = data.firstName + " " + data.lastName
}

m.request({
	method: "GET",
	url: "/api/v1/users",
	type: User
})
.then(function(users) {
	console.log(users[0].name) // logs a name
})
```

In the example above, assuming `/api/v1/users` returns an array of objects, the `User` constructor will be instantiated (i.e. called as `new User(data)`) for each object in the array. If the response returned a single object, that object would be used as the `body` argument.

---

### Non-JSON responses

Sometimes a server endpoint does not return a JSON response: for example, you may be requesting an HTML file, an SVG file, or a CSV file. By default Mithril attempts to parse a response as if it was JSON. To override that behavior, define a custom `options.deserialize` function:

```javascript
m.request({
	method: "GET",
	url: "/files/icon.svg",
	deserialize: function(value) {return value}
})
.then(function(svg) {
	m.render(document.body, m.trust(svg))
})
```

In the example above, the request retrieves an SVG file, does nothing to parse it (because `deserialize` merely returns the value as-is), and then renders the SVG string as trusted HTML.

Of course, a `deserialize` function may be more elaborate:

```javascript
m.request({
	method: "GET",
	url: "/files/data.csv",
	deserialize: parseCSV
})
.then(function(data) {
	console.log(data)
})

function parseCSV(data) {
	// naive implementation for the sake of keeping example simple
	return data.split("\n").map(function(row) {
		return row.split(",")
	})
}
```

Ignoring the fact that the parseCSV function above doesn't handle a lot of cases that a proper CSV parser would, the code above logs an array of arrays.

Custom headers may also be helpful in this regard. For example, if you're requesting an SVG, you probably want to set the content type accordingly. To override the default JSON request type, set `options.headers` to an object of key-value pairs corresponding to request header names and values.

```javascript
m.request({
	method: "GET",
	url: "/files/image.svg",
	headers: {
		"Content-Type": "image/svg+xml; charset=utf-8",
		"Accept": "image/svg, text/*"
	},
	deserialize: function(value) {return value}
})
```

---


### Retrieving response details

By default Mithril attempts to parse `xhr.responseText` as JSON and returns the parsed object. It may be useful to inspect a server response in more detail and process it manually. This can be accomplished by passing a custom `options.extract` function:

```javascript
m.request({
	method: "GET",
	url: "/api/v1/users",
	extract: function(xhr) {return {status: xhr.status, body: xhr.responseText}}
})
.then(function(response) {
	console.log(response.status, response.body)
})
```

The parameter to `options.extract` is the XMLHttpRequest object once its operation is completed, but before it has been passed to the returned promise chain, so the promise may still end up in an rejected state if processing throws an exception.

---

### Why JSON instead of HTML

Many server-side frameworks provide a view engine that interpolates database data into a template before serving HTML (on page load or via AJAX) and then employ jQuery to handle user interactions.

By contrast, Mithril is framework designed for thick client applications, which typically download templates and data separately and combine them in the browser via JavaScript. Doing the templating heavy-lifting in the browser can bring benefits like reducing operational costs by freeing server resources. Separating templates from data also allow template code to be cached more effectively and enables better code reusability across different types of clients (e.g. desktop, mobile). Another benefit is that Mithril enables a [retained mode](https://en.wikipedia.org/wiki/Retained_mode) UI development paradigm, which greatly simplifies development and maintenance of complex user interactions.

By default, `m.request` expects response data to be in JSON format. In a typical Mithril application, that JSON data is then usually consumed by a view.

You should avoid trying to render server-generated dynamic HTML with Mithril. If you have an existing application that does use a server-side templating system, and you wish to re-architecture it, first decide whether the effort is feasible at all to begin with. Migrating from a thick server architecture to a thick client architecture is typically a somewhat large effort, and involves refactoring logic out of templates into logical data services (and the testing that goes with it).

Data services may be organized in many different ways depending on the nature of the application. [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) architectures are popular with API providers, and [service oriented architectures](https://en.wikipedia.org/wiki/Service-oriented_architecture) are often required where there are lots of highly transactional workflows.

---

### Why XHR instead of fetch

[`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is a newer Web API for fetching resources from servers, similar to `XMLHttpRequest`.

Mithril's `m.request` uses `XMLHttpRequest` instead of `fetch()` for a number of reasons:

- `fetch` is not fully standardized yet, and may be subject to specification changes.
- `XMLHttpRequest` calls can be aborted before they resolve (e.g. to avoid race conditions in for instant search UIs).
- `XMLHttpRequest` provides hooks for progress listeners for long running requests (e.g. file uploads).
- `XMLHttpRequest` is supported by all browsers, whereas `fetch()` is not supported by Internet Explorer, Safari and Android (non-Chromium).

Currently, due to lack of browser support, `fetch()` typically requires a [polyfill](https://github.com/github/fetch), which is over 11kb uncompressed - nearly three times larger than Mithril's XHR module.

Despite being much smaller, Mithril's XHR module supports many important and not-so-trivial-to-implement features like [URL interpolation](#dynamic-urls), querystring serialization and [JSON-P requests](jsonp.md), in addition to its ability to integrate seamlessly to Mithril's autoredrawing subsystem. The `fetch` polyfill does not support any of those, and requires extra libraries and boilerplates to achieve the same level of functionality.

In addition, Mithril's XHR module is optimized for JSON-based endpoints and makes that most common case appropriately terse - i.e. `m.request(url)` - whereas `fetch` requires an additional explicit step to parse the response data as JSON: `fetch(url).then(function(response) {return response.json()})`

The `fetch()` API does have a few technical advantages over `XMLHttpRequest` in a few uncommon cases:

- it provides a streaming API (in the "video streaming" sense, not in the reactive programming sense), which enables better latency and memory consumption for very large responses (at the cost of code complexity).
- it integrates to the [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), which provides an extra layer of control over how and when network requests happen. This API also allows access to push notifications and background synchronization features.

In typical scenarios, streaming won't provide noticeable performance benefits because it's generally not advisable to download megabytes of data to begin with. Also, the memory gains from repeatedly reusing small buffers may be offset or nullified if they result in excessive browser repaints. For those reasons, choosing `fetch()` streaming instead of `m.request` is only recommended for extremely resource intensive applications.

---

### Avoid anti-patterns

#### Promises are not the response data

The `m.request` method returns a [Promise](promise.md), not the response data itself. It cannot return that data directly because an HTTP request may take a long time to complete (due to network latency), and if JavaScript waited for it, it would freeze the application until the data was available.

```javascript
// AVOID
var users = m.request("/api/v1/users")
console.log("list of users:", users)
// `users` is NOT a list of users, it's a promise

// PREFER
m.request("/api/v1/users").then(function(users) {
	console.log("list of users:", users)
})
```
