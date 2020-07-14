# stream()

- [Description](#description)
- [Signature](#signature)
	- [Static members](#static-members)
		- [Stream.combine](#streamcombine)
		- [Stream.merge](#streammerge)
		- [Stream.scan](#streamscan)
		- [Stream.scanMerge](#streamscanmerge)
		- [Stream.lift](#streamlift)
		- [Stream.SKIP](#streamskip)
		- [Stream["fantasy-land/of"]](#streamfantasy-landof)
	- [Instance members](#instance-members)
		- [stream.map](#streammap)
		- [stream.end](#streamend)
		- [stream["fantasy-land/of"]](#streamfantasy-landof-1)
		- [stream["fantasy-land/map"]](#streamfantasy-landmap)
		- [stream["fantasy-land/ap"]](#streamfantasy-landap)
- [Basic usage](#basic-usage)
	- [Streams as variables](#streams-as-variables)
	- [Bidirectional bindings](#bidirectional-bindings)
	- [Computed properties](#computed-properties)
- [Chaining streams](#chaining-streams)
- [Combining streams](#combining-streams)
- [Stream states](#stream-states)
- [Serializing streams](#serializing-streams)
- [Streams do not trigger rendering](#streams-do-not-trigger-rendering)
- [What is Fantasy Land](#what-is-fantasy-land)

---

### Description

A Stream is a reactive data structure, similar to cells in spreadsheet applications.

For example, in a spreadsheet, if `A1 = B1 + C1`, then changing the value of `B1` or `C1` automatically changes the value of `A1`.

Similarly, you can make a stream depend on other streams so that changing the value of one automatically updates the other. This is useful when you have very expensive computations and want to only run them when necessary, as opposed to, say, on every redraw.

Streams are NOT bundled with Mithril's core distribution. To include the Streams module, use:

```javascript
var Stream = require("mithril/stream")
```

You can also download the module directly if your environment does not support a bundling toolchain:

```html
<script src="https://unpkg.com/mithril/stream/stream.js"></script>
```

When loaded directly with a `<script>` tag (rather than required), the stream library will be exposed as `window.m.stream`. If `window.m` is already defined (e.g. because you also use the main Mithril script), it will attach itself to the existing object. Otherwise it creates a new `window.m`. If you want to use streams in conjunction with Mithril as raw script tags, you should include Mithril in your page before `mithril/stream`, because `mithril` will otherwise overwrite the `window.m` object defined by `mithril/stream`. This is not a concern when the libraries are consumed as CommonJS modules (using `require(...)`).

---

### Signature

Creates a stream

`stream = Stream(value)`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
`value`     | `any`                | No       | If this argument is present, the value of the stream is set to it
**returns** | `Stream`             |          | Returns a stream

[How to read signatures](signatures.md)

---

#### Static members

##### Stream.combine

Creates a computed stream that reactively updates if any of its upstreams are updated. See [combining streams](#combining-streams)

`stream = Stream.combine(combiner, streams)`

Argument    | Type                        | Required | Description
----------- | --------------------------- | -------- | ---
`combiner`  | `(Stream..., Array) -> any` | Yes      | See [combiner](#combiner) argument
`streams`   | `Array<Stream>`             | Yes      | A list of streams to be combined
**returns** | `Stream`                    |          | Returns a stream

[How to read signatures](signatures.md)

---

###### combiner

Specifies how the value of a computed stream is generated. See [combining streams](#combining-streams)

`any = combiner(streams..., changed)`

Argument     | Type                 | Required | Description
------------ | -------------------- | -------- | ---
`streams...` | splat of `Streams`   | No       | Splat of zero or more streams that correspond to the streams passed as the second argument to [`stream.combine`](#stream-combine)
`changed`    | `Array<Stream>`      | Yes      | List of streams that were affected by an update
**returns**  | `any`                |          | Returns a computed value

[How to read signatures](signatures.md)

---

##### Stream.merge

Creates a stream whose value is the array of values from an array of streams

`stream = Stream.merge(streams)`

Argument     | Type                 | Required | Description
------------ | -------------------- | -------- | ---
`streams`    | `Array<Stream>`      | Yes      | A list of streams
**returns**  | `Stream`             |          | Returns a stream whose value is an array of input stream values

[How to read signatures](signatures.md)

---

##### Stream.scan

Creates a new stream with the results of calling the function on every value in the stream with an accumulator and the incoming value.

Note that you can prevent dependent streams from being updated by returning the special value `stream.SKIP` inside the accumulator function.

`stream = Stream.scan(fn, accumulator, stream)`

Argument      | Type                             | Required | Description
------------- | -------------------------------- | -------- | ---
`fn`          | `(accumulator, value) -> result \| SKIP` | Yes      | A function that takes an accumulator and value parameter and returns a new accumulator value of the same type
`accumulator` | `any`                            | Yes      | The starting value for the accumulator
`stream`      | `Stream`                         | Yes      | Stream containing the values
**returns**   | `Stream`                         |          | Returns a new stream containing the result

[How to read signatures](signatures.md)

---

##### Stream.scanMerge

Takes an array of pairs of streams and scan functions and merges all those streams using the given functions into a single stream.

`stream = Stream.scanMerge(pairs, accumulator)`

Argument      | Type                                             | Required | Description
------------- | ------------------------------------------------ | -------- | ---
`pairs`       | `Array<[Stream, (accumulator, value) -> value]>` | Yes      | An array of tuples of stream and scan functions
`accumulator` | `any`                                            | Yes      | The starting value for the accumulator
**returns**   | `Stream`                                         |          | Returns a new stream containing the result

[How to read signatures](signatures.md)

---

##### Stream.lift

Creates a computed stream that reactively updates if any of its upstreams are updated. See [combining streams](#combining-streams). Unlike `combine`, the input streams are a variable number of arguments (instead of an array) and the callback receives the stream values instead of streams. There is no `changed` parameter. This is generally a more user-friendly function for applications than `combine`.

`stream = Stream.lift(lifter, stream1, stream2, ...)`

Argument     | Type                        | Required | Description
------------ | --------------------------- | -------- | ---
`lifter`     | `(any...) -> any` | Yes     | See [lifter](#lifter) argument
`streams...` | list of `Streams`           | Yes      | Streams to be lifted
**returns**  | `Stream`                    |          | Returns a stream

[How to read signatures](signatures.md)

---

###### lifter

Specifies how the value of a computed stream is generated. See [combining streams](#combining-streams)

`any = lifter(streams...)`

Argument     | Type                 | Required | Description
------------ | -------------------- | -------- | ---
`streams...` | splat of `Streams`   | No       | Splat of zero or more streams that correspond to the streams passed to [`stream.lift`](#stream-lift)
**returns**  | `any`                |          | Returns a computed value

[How to read signatures](signatures.md)

---

##### Stream.SKIP

A special value that can be returned to stream callbacks to skip execution of downstreams

---

##### Stream["fantasy-land/of"]

This method is functionally identical to `stream`. It exists to conform to [Fantasy Land's Applicative specification](https://github.com/fantasyland/fantasy-land). For more information, see the [What is Fantasy Land](#what-is-fantasy-land) section.

`stream = Stream["fantasy-land/of"](value)`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
`value`     | `any`                | No       | If this argument is present, the value of the stream is set to it
**returns** | `Stream`             |          | Returns a stream

---

#### Instance members

##### stream.map

Creates a dependent stream whose value is set to the result of the callback function. This method is an alias of [stream["fantasy-land/map"]](#streamfantasy-landmap).

`dependentStream = stream().map(callback)`

Argument     | Type                 | Required | Description
------------ | -------------------- | -------- | ---
`callback`   | `any -> any`         | Yes      | A callback whose return value becomes the value of the stream
**returns**  | `Stream`             |          | Returns a stream

[How to read signatures](signatures.md)

---

##### stream.end

A co-dependent stream that unregisters dependent streams when set to true. See [ended state](#ended-state).

`endStream = stream().end`

---

##### stream["fantasy-land/of"]

This method is functionally identical to `stream`. It exists to conform to [Fantasy Land's Applicative specification](https://github.com/fantasyland/fantasy-land). For more information, see the [What is Fantasy Land](#what-is-fantasy-land) section.

`stream = stream()["fantasy-land/of"](value)`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
`value`     | `any`                | No       | If this argument is present, the value of the stream is set to it
**returns** | `Stream`             |          | Returns a stream

---

##### stream["fantasy-land/map"]

Creates a dependent stream whose value is set to the result of the callback function. See [chaining streams](#chaining-streams)

This method exists to conform to [Fantasy Land's Applicative specification](https://github.com/fantasyland/fantasy-land). For more information, see the [What is Fantasy Land](#what-is-fantasy-land) section.

`dependentStream = stream()["fantasy-land/map"](callback)`

Argument     | Type                 | Required | Description
------------ | -------------------- | -------- | ---
`callback`   | `any -> any`         | Yes      | A callback whose return value becomes the value of the stream
**returns**  | `Stream`             |          | Returns a stream

[How to read signatures](signatures.md)

---

##### stream["fantasy-land/ap"]

The name of this method stands for `apply`. If a stream `a` has a function as its value, another stream `b` can use it as the argument to `b.ap(a)`. Calling `ap` will call the function with the value of stream `b` as its argument, and it will return another stream whose value is the result of the function call. This method exists to conform to [Fantasy Land's Applicative specification](https://github.com/fantasyland/fantasy-land). For more information, see the [What is Fantasy Land](#what-is-fantasy-land) section.

`stream = stream()["fantasy-land/ap"](apply)`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
`apply`     | `Stream`             | Yes      | A stream whose value is a function
**returns** | `Stream`             |          | Returns a stream

---

### Basic usage

Streams are not part of the core Mithril distribution. To include them in a project, require its module:

```javascript
var stream = require("mithril/stream")
```


#### Streams as variables

`stream()` returns a stream. At its most basic level, a stream works similar to a variable or a getter-setter property: it can hold state, which can be modified.

```javascript
var username = stream("John")
console.log(username()) // logs "John"

username("John Doe")
console.log(username()) // logs "John Doe"
```

The main difference is that a stream is a function, and therefore can be composed into higher order functions.

```javascript
var users = stream()

// request users from a server using the fetch API
fetch("/api/users")
	.then(function(response) {return response.json()})
	.then(users)
```

In the example above, the `users` stream is populated with the response data when the request resolves.

#### Bidirectional bindings

Streams can also be populated from event callbacks and similar.

```javascript
// a stream
var user = stream("")

// a bi-directional binding to the stream
m("input", {
	oninput: function (e) { user(e.target.value) },
	value: user()
})
```

In the example above, when the user types in the input, the `user` stream is updated to the value of the input field.

#### Computed properties

Streams are useful for implementing computed properties:

```javascript
var title = stream("")
var slug = title.map(function(value) {
	return value.toLowerCase().replace(/\W/g, "-")
})

title("Hello world")
console.log(slug()) // logs "hello-world"
```

In the example above, the value of `slug` is computed when `title` is updated, not when `slug` is read.

It's of course also possible to compute properties based on multiple streams:

```javascript
var firstName = stream("John")
var lastName = stream("Doe")
var fullName = stream.merge([firstName, lastName]).map(function(values) {
	return values.join(" ")
})

console.log(fullName()) // logs "John Doe"

firstName("Mary")

console.log(fullName()) // logs "Mary Doe"
```

Computed properties in Mithril are updated atomically: streams that depend on multiple streams will never be called more than once per value update, no matter how complex the computed property's dependency graph is.

---

### Chaining streams

Streams can be chained using the `map` method. A chained stream is also known as a *dependent stream*.

```javascript
// parent stream
var value = stream(1)

// dependent stream
var doubled = value.map(function(value) {
	return value * 2
})

console.log(doubled()) // logs 2
```

Dependent streams are *reactive*: their values are updated any time the value of their parent stream is updated. This happens regardless of whether the dependent stream was created before or after the value of the parent stream was set.

You can prevent dependent streams from being updated by returning the special value `stream.SKIP`

```javascript
var skipped = stream(1).map(function(value) {
	return stream.SKIP
})

skipped.map(function() {
	// never runs
})
```

---

### Combining streams

Streams can depend on more than one parent stream. These kinds of streams can be created via `stream.merge()`

```javascript
var a = stream("hello")
var b = stream("world")

var greeting = stream.merge([a, b]).map(function(values) {
	return values.join(" ")
})

console.log(greeting()) // logs "hello world"
```

Or you can use the helper function `stream.lift()`

```javascript
var a = stream("hello")
var b = stream("world")

var greeting = stream.lift(function(_a, _b) {
	return _a + " " + _b
}, a, b)

console.log(greeting()) // logs "hello world"
```

There's also a lower level method called `stream.combine()` that exposes the stream themselves in the reactive computations for more advanced use cases

```javascript
var a = stream(5)
var b = stream(7)

var added = stream.combine(function(a, b) {
	return a() + b()
}, [a, b])

console.log(added()) // logs 12
```

A stream can depend on any number of streams and it's guaranteed to update atomically. For example, if a stream A has two dependent streams B and C, and a fourth stream D is dependent on both B and C, the stream D will only update once if the value of A changes. This guarantees that the callback for stream D is never called with unstable values such as when B has a new value but C has the old value. Atomicity also brings the performance benefits of not recomputing downstreams unnecessarily.

You can prevent dependent streams from being updated by returning the special value `stream.SKIP`

```javascript
var skipped = stream.combine(function(stream) {
	return stream.SKIP
}, [stream(1)])

skipped.map(function() {
	// never runs
})
```

---

### Stream states

At any given time, a stream can be in one of three states: *pending*, *active*, and *ended*.

#### Pending state

Pending streams can be created by calling `stream()` with no parameters.

```javascript
var pending = stream()
```

If a stream is dependent on more than one stream, any of its parent streams is in a pending state, the dependent streams is also in a pending state, and does not update its value.

```javascript
var a = stream(5)
var b = stream() // pending stream

var added = stream.combine(function(a, b) {
	return a() + b()
}, [a, b])

console.log(added()) // logs undefined
```

In the example above, `added` is a pending stream, because its parent `b` is also pending.

This also applies to dependent streams created via `stream.map`:

```javascript
var value = stream()
var doubled = value.map(function(value) {return value * 2})

console.log(doubled()) // logs undefined because `doubled` is pending
```

#### Active state

When a stream receives a value, it becomes active (unless the stream is ended).

```javascript
var stream1 = stream("hello") // stream1 is active

var stream2 = stream() // stream2 starts off pending
stream2("world") // then becomes active
```

A dependent stream with multiple parents becomes active if all of its parents are active.

```javascript
var a = stream("hello")
var b = stream()

var greeting = stream.merge([a, b]).map(function(values) {
	return values.join(" ")
})
```

In the example above, the `a` stream is active, but `b` is pending. setting `b("world")` would cause `b` to become active, and therefore `greeting` would also become active, and be updated to have the value `"hello world"`

#### Ended state

A stream can stop affecting its dependent streams by calling `stream.end(true)`. This effectively removes the connection between a stream and its dependent streams.

```javascript
var value = stream()
var doubled = value.map(function(value) {return value * 2})

value.end(true) // set to ended state

value(5)

console.log(doubled())
// logs undefined because `doubled` no longer depends on `value`
```

Ended streams still have state container semantics, i.e. you can still use them as getter-setters, even after they are ended.

```javascript
var value = stream(1)
value.end(true) // set to ended state

console.log(value(1)) // logs 1

value(2)
console.log(value()) // logs 2
```

Ending a stream can be useful in cases where a stream has a limited lifetime (for example, reacting to `mousemove` events only while a DOM element is being dragged, but not after it's been dropped).

---

### Serializing streams

Streams implement a `.toJSON()` method. When a stream is passed as the argument to `JSON.stringify()`, the value of the stream is serialized.

```javascript
var value = stream(123)
var serialized = JSON.stringify(value)
console.log(serialized) // logs 123
```

---

### Streams do not trigger rendering

Unlike libraries like Knockout, Mithril streams do not trigger re-rendering of templates. Redrawing happens in response to event handlers defined in Mithril component views, route changes, or after [`m.request`](request.md) calls resolve.

If redrawing is desired in response to other asynchronous events (e.g. `setTimeout`/`setInterval`, websocket subscription, 3rd party library event handler, etc), you should manually call [`m.redraw()`](redraw.md)

---

### What is Fantasy Land

[Fantasy Land](https://github.com/fantasyland/fantasy-land) specifies interoperability of common algebraic structures. In plain english, that means that libraries that conform to Fantasy Land specs can be used to write generic functional style code that works regardless of how these libraries implement the constructs.

For example, say we want to create a generic function called `plusOne`. The naive implementation would look like this:

```javascript
function plusOne(a) {
	return a + 1
}
```

The problem with this implementation is that it can only be used with a number. However it's possible that whatever logic produces a value for `a` could also produce an error state (wrapped in a Maybe or an Either from a library like [Sanctuary](https://github.com/sanctuary-js/sanctuary) or [Ramda-Fantasy](https://github.com/ramda/ramda-fantasy)), or it could be a Mithril stream, or a [flyd](https://github.com/paldepind/flyd) stream, etc. Ideally, we wouldn't want to write a similar version of the same function for every possible type that `a` could have and we wouldn't want to be writing wrapping/unwrapping/error handling code repeatedly.

This is where Fantasy Land can help. Let's rewrite that function in terms of a Fantasy Land algebra:

```javascript
var fl = require("fantasy-land")

function plusOne(a) {
	return a[fl.map](function(value) {return value + 1})
}
```

Now this method works with any Fantasy Land compliant [Functor](https://github.com/fantasyland/fantasy-land#functor), such as [`R.Maybe`](https://github.com/ramda/ramda-fantasy/blob/master/docs/Maybe.md), [`S.Either`](https://github.com/sanctuary-js/sanctuary#either-type), `stream`, etc.

This example may seem convoluted, but it's a trade-off in complexity: the naive `plusOne` implementation makes sense if you have a simple system and only ever increment numbers, but the Fantasy Land implementation becomes more powerful if you have a large system with many wrapper abstractions and reused algorithms.

When deciding whether you should adopt Fantasy Land, you should consider your team's familiarity with functional programming, and be realistic regarding the level of discipline that your team can commit to maintaining code quality (vs the pressure of writing new features and meeting deadlines). Functional style programming heavily depends on compiling, curating and mastering a large set of small, precisely defined functions, and therefore it's not suitable for teams who do not have solid documentation practices, and/or lack experience in functional oriented languages.
