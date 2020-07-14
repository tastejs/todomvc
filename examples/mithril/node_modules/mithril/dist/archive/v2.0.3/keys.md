# Keys

- [What are keys](#what-are-keys)
- [How to use](#how-to-use)
	- [Single-child keyed fragments](#single-child-keyed-fragments)
- [Debugging key related issues](#debugging-key-related-issues)

---

### What are keys

Keys are a mechanism that allows re-ordering DOM elements within a NodeList, and mapping specific data items in a list to the respective DOM elements that are derived from them, as the data items move within the list.

In other words, a `key` is a way of saying "this DOM element is for the data object with this id".

Typically, a `key` property should be the unique identifier field of the objects in the data array.

```javascript
var users = [
	{id: 1, name: "John"},
	{id: 2, name: "Mary"},
]

function userInputs(users) {
	return users.map(function(u) {
		return m("input", {key: u.id}, u.name)
	})
}

m.render(document.body, userInputs(users))
```

Having a key means that if the `users` array is shuffled and the view is re-rendered, the inputs will be shuffled in the exact same order, so as to maintain correct focus and DOM state.

---

### How to use

A common pattern is to have data comprised of an array of objects and to generate a list of vnodes that map to each object in the array. For example, consider the following code:

```javascript
var people = [
	{id: 1, name: "John"},
	{id: 2, name: "Mary"},
]

function userList(users) {
	return users.map(function(u) {
		return m("button", u.name) // <button>John</button>
		                           // <button>Mary</button>
	})
}

m.render(document.body, userList(people))
```

Let's suppose the `people` variable was changed to this:

```javascript
people = [{id: 2, name: "Mary"}]
```

The problem is that from the point of view of the `userList` function, there's no way to tell if it was the first object that was removed, or if it was the second object that was removed *in addition to the first object's properties being modified*. If the first button was focused and the rendering engine removes it, then focus goes back to `<body>` as expected, but if the rendering engine removes the second button and modifies the text content of the first, then the focus will be on the wrong button after the update.

Worse still, if there were stateful jQuery plugins attached to these buttons, they could potentially have incorrect internal state after the update.

Even though in this particular example, we humans intuitively guess that the first item in the list was the one being removed, it's actually impossible for a computer to automatically solve this problem for all possible inputs.

Therefore, in the cases when a list of vnodes is derived from a dynamic array of data, you should add a `key` property to each virtual node that maps to a uniquely identifiable field in the source data. This will allow Mithril to intelligently re-order the DOM to maintain each DOM element correctly mapped to its respective item in the data source.

```javascript
function correctUserList(users) {
	return users.map(function(u) {
		return m("button", {key: u.id}, u.name)
	})
}
```

#### Single-child keyed fragments

Sometimes, you might want to reinitialize a component on command. You can use the common pattern of a single-child keyed fragment where you change the key to destroy and reinitialize the element.

```javascript
function ResettableToggle() {
	var toggleKey = false

	function reset() {
		toggleKey = !toggleKey
	}

	return {
		view: function() {
			return [
				m("button", {onclick: reset}, "Reset toggle"),
				[m(Toggle, {key: toggleKey})]
			]
		}
	}
}
```

You can also bind it to a known identity, for things like item views where you need to fetch a remote resource based on an ID. It's usually simpler than implementing all the logic to diff the ID and re-fetch a resource if it changes.

```javascript
function Page() {
	return {
		view: function() {
			return m(Layout, [
				[m(ItemView, {key: m.route.param("id")})],
			])
		}
	}
}
```

---

### Debugging key related issues

Keys can cause confusing issues if they are misunderstood. A typical symptom of key related issues is that application state appears to become corrupted after a few user interactions (usually involving a deletion).

#### Avoid wrapper elements around keyed elements

Keys must be placed on the virtual node that is an immediate child of the array. This means that if you wrap the `button` in an `div` in the example above, the key must be moved to the `div`.

```javascript
// AVOID
users.map(function(u) {
	return m("div", [ // key should be in `div`
		m("button", {key: u.id}, u.name)
	])
})
```

#### Avoid hiding keys in component root elements

If you refactor the code and make a user component, the key must be moved out of the component and put on the component itself, since it is now the immediate child of the array.

```javascript
// AVOID - doesn't work
var User = {
	view: function(vnode) {
		return m("div", { key: vnode.attrs.user.id }, [
			m(Button, vnode.attrs.user.name)
		])
	}
}

// PREFER
users.map(function(u) {
	return m(User, { key: u.id, user: u }) // key should be here, not in component
})
```

#### Avoid wrapping keyed elements in arrays

Arrays are [vnodes](vnodes.md), and therefore keyable. You should not wrap arrays around keyed elements outside [single-child keyed fragments](#single-child-keyed-fragments).

```javascript
// AVOID
users.map(function(u) {
	return [ // fragment is a vnode, and therefore keyable
		m("button", {key: u.id}, u.name)
	]
})

// PREFER
users.map(function(u) {
	return m("button", {key: u.id}, u.name)
})

// PREFER
users.map(function(u) {
	return m.fragment({key: u.id}, m("button", u.name))
})
```

#### Avoid variable types

Keys must be strings if present or they will be cast to strings if they are not. Therefore, `"1"` (string) and `1` (number) are considered the same key.

You should use either strings or numbers as keys in one array, but not mix both.

```javascript
// AVOID
var things = [
	{id: "1", name: "Book"},
	{id: 1, name: "Cup"},
]
```

#### Avoid mixing keyed and non-keyed vnodes in the same array

An array of vnodes must have only keyed vnodes or non-keyed vnodes, but not both. In fact, this will cause an error to be thrown to remind you to not do it. So don't do it!

```javascript
// AVOID
m("div", [
	m("div", "a"),
	m("div", {key: 1}, "b"),
])
```
If using keys, use a unique key for every element.

```javascript
// PREFER
m("div", [
	m("div", {key: 0}, "a"),
	m("div", {key: 1}, "b"),
])
```

If you need to mix them, create a nested array.

```javascript
// PREFER
m("div", [
	m("div", "a"),
	[
		m("div", {key: 1}, "b"),
	]
])
```

Note that `null`s, `undefined`s and booleans are considered unkeyed nodes. If you want the keyed equivalent, use `m.fragment({key: ...}, [])` which is a keyed empty fragment.

```javascript
// AVOID
m("div", [
	a ? m("div", {key: 1}, "a") : null,
	m("div", {key: 2}, "b"),
])

// PREFER
m("div", [
	a ? m("div", {key: 1}, "a") : m.fragment({key: 1}, []),
	m("div", {key: 2}, "b"),
])
```

#### Avoid passing model data directly to components if the model uses `key` as a data property

The `key` property may appear in your data model in a way that conflicts with Mithril's key logic. For example, a component may represent an entity whose `key` property is expected to change over time. This can lead to components receiving the wrong data, re-initialize, or change positions unexpectedly. If your data model uses the `key` property, make sure to wrap the data such that Mithril doesn't misinterpret it as a rendering instruction:

```javascript
// Data model
var users = [
	{id: 1, name: "John", key: 'a'},
	{id: 2, name: "Mary", key: 'b'},
]

// Later on...
users[0].key = 'c'

// AVOID
users.map(function(user){
	// The component for John will be destroyed and recreated
	return m(UserComponent, user)
})

// PREFER
users.map(function(user){
	// Key is specifically extracted: data model is given its own property
	return m(UserComponent, {key: user.id, model: user})
})
```
