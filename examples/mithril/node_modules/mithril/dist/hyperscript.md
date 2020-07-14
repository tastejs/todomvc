# m(selector, attributes, children)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)
- [Flexibility](#flexibility)
- [CSS selectors](#css-selectors)
- [Attributes passed as the second argument](#attributes-passed-as-the-second-argument)
- [DOM attributes](#dom-attributes)
- [Style attribute](#style-attribute)
- [Events](#events)
- [Properties](#properties)
- [Components](#components)
- [Lifecycle methods](#lifecycle-methods)
- [Keys](#keys)
- [SVG and MathML](#svg-and-mathml)
- [Making templates dynamic](#making-templates-dynamic)
- [Converting HTML](#converting-html)
- [Avoid anti-patterns](#avoid-anti-patterns)

---

### Description

Represents an HTML element in a Mithril view

```javascript
m("div.foo", {style: {color: "red"}}, "hello")
// renders to this HTML:
// <div class="foo" style="color: red">hello</div>
```

You can also use an HTML-like syntax called [JSX](jsx.md), using Babel to convert it to equivalent hyperscript calls. This is equivalent to the above.

```jsx
<div class="foo" style="color: red">hello</div>
```

---

### Signature

`vnode = m(selector, attrs, children)`

Argument     | Type                                       | Required | Description
------------ | ------------------------------------------ | -------- | ---
`selector`   | `String|Object|Function`                   | Yes      | A CSS selector or a [component](components.md)
`attrs`      | `Object`                                   | No       | HTML attributes or element properties
`children`   | `Array<Vnode>|String|Number|Boolean`       | No       | Child [vnodes](vnodes.md#structure). Can be written as [splat arguments](signatures.md#splats)
**returns**  | `Vnode`                                    |          | A [vnode](vnodes.md#structure)

[How to read signatures](signatures.md)

---

### How it works

Mithril provides a hyperscript function `m()`, which allows expressing any HTML structure using JavaScript syntax. It accepts a `selector` string (required), an `attrs` object (optional) and a `children` array (optional).

```javascript
m("div", {id: "box"}, "hello")

// renders to this HTML:
// <div id="box">hello</div>
```

The `m()` function does not actually return a DOM element. Instead it returns a [virtual DOM node](vnodes.md), or *vnode*, which is a JavaScript object that represents the DOM element to be created.

```javascript
// a vnode
var vnode = {tag: "div", attrs: {id: "box"}, children: [ /*...*/ ]}
```

To transform a vnode into an actual DOM element, use the [`m.render()`](render.md) function:

```javascript
m.render(document.body, m("br")) // puts a <br> in <body>
```

Calling `m.render()` multiple times does **not** recreate the DOM tree from scratch each time. Instead, each call will only make a change to a DOM tree if it is absolutely necessary to reflect the virtual DOM tree passed into the call. This behavior is desirable because recreating the DOM from scratch is very expensive, and causes issues such as loss of input focus, among other things. By contrast, updating the DOM only where necessary is comparatively much faster and makes it easier to maintain complex UIs that handle multiple user stories.

---

### Flexibility

The `m()` function is both *polymorphic* and *variadic*. In other words, it's very flexible in what it expects as input parameters:

```javascript
// simple tag
m("div") // <div></div>

// attributes and children are optional
m("a", {id: "b"}) // <a id="b"></a>
m("span", "hello") // <span>hello</span>

// tag with child nodes
m("ul", [             // <ul>
	m("li", "hello"), //   <li>hello</li>
	m("li", "world"), //   <li>world</li>
])                    // </ul>

// array is optional
m("ul",               // <ul>
	m("li", "hello"), //   <li>hello</li>
	m("li", "world")  //   <li>world</li>
)                     // </ul>
```

---

### CSS selectors

The first argument of `m()` can be any CSS selector that can describe an HTML element. It accepts any valid CSS combinations of `#` (id), `.` (class) and `[]` (attribute) syntax.

```javascript
m("div#hello")
// <div id="hello"></div>

m("section.container")
// <section class="container"></section>

m("input[type=text][placeholder=Name]")
// <input type="text" placeholder="Name" />

m("a#exit.external[href='https://example.com']", "Leave")
// <a id="exit" class="external" href="https://example.com">Leave</a>
```

If you omit the tag name, Mithril assumes a `div` tag.

```javascript
m(".box.box-bordered") // <div class="box box-bordered"></div>
```

Typically, it's recommended that you use CSS selectors for static attributes (i.e. attributes whose value do not change), and pass an attributes object for dynamic attribute values.

```javascript
var currentURL = "/"

m("a.link[href=/]", {
	class: currentURL === "/" ? "selected" : ""
}, "Home")

// renders to this HTML:
// <a href="/" class="link selected">Home</a>
```

### Attributes passed as the second argument

You can pass attributes, properties, events and lifecycle hooks in the second, optional argument (see the next sections for details).

```JS
m("button", {
	class: "my-button",
	onclick: function() {/* ... */},
	oncreate: function() {/* ... */}
})
```

If the value of such an attribute is `null` or `undefined`, it is treated as if the attribute was absent.

If there are class names in both first and second arguments of `m()`, they are merged together as you would expect. If the value of the class in the second argument is `null` or `undefined`, it is ignored.

If another attribute is present in both the first and the second argument, the second one takes precedence even if it is  is `null` or `undefined`.

---

### DOM attributes

Mithril uses both the JavaScript API and the DOM API (`setAttribute`) to resolve attributes. This means you can use both syntaxes to refer to attributes.

For example, in the JavaScript API, the `readonly` attribute is called `element.readOnly` (notice the uppercase). In Mithril, all of the following are supported:

```javascript
m("input", {readonly: true}) // lowercase
m("input", {readOnly: true}) // uppercase
m("input[readonly]")
m("input[readOnly]")
```

This even includes custom elements. For example, you can use [A-Frame](https://aframe.io/docs/0.8.0/introduction/) within Mithril, no problem!

```javascript
m("a-scene", [
	m("a-box", {
		position: "-1 0.5 -3",
		rotation: "0 45 0",
		color: "#4CC3D9",
	}),

	m("a-sphere", {
		position: "0 1.25 -5",
		radius: "1.25",
		color: "#EF2D5E",
	}),

	m("a-cylinder", {
		position: "1 0.75 -3",
		radius: "0.5",
		height: "1.5",
		color: "#FFC65D",
	}),

	m("a-plane", {
		position: "0 0 -4",
		rotation: "-90 0 0",
		width: "4",
		height: "4",
		color: "#7BC8A4",
	}),

	m("a-sky", {
		color: "#ECECEC",
	}),
])
```

And yes, this translates to both attributes and properties, and it works just like they would in the DOM. Using [Brick's `brick-deck`](http://brick.mozilla.io/docs/brick-deck) as an example, they have a `selected-index` attribute with a corresponding `selectedIndex` getter/setter property.

```javascript
m("brick-deck[selected-index=0]", [/* ... */]) // lowercase
m("brick-deck[selectedIndex=0]", [/* ... */]) // uppercase
// I know these look odd, but `brick-deck`'s `selectedIndex` property is a
// string, not a number.
m("brick-deck", {"selected-index": "0"}, [/* ... */])
m("brick-deck", {"selectedIndex": "0"}, [/* ... */])
```

For custom elements, it doesn't auto-stringify properties, in case they are objects, numbers, or some other non-string value. So assuming you had some custom element `my-special-element` that has an `elem.whitelist` array getter/setter property, you could do this, and it'd work as you'd expect:

```javascript
m("my-special-element", {
	whitelist: [
		"https://example.com",
		"https://neverssl.com",
		"https://google.com",
	],
})
```

If you have classes or IDs for those elements, the shorthands still work as you would expect. To pull another A-Frame example:

```javascript
// These two are equivalent
m("a-entity#player")
m("a-entity", {id: "player"})
```

Do note that all the properties with magic semantics, like lifecycle attributes, `onevent` handlers, `key`s, `class`, and `style`, those are still treated the same way they are for normal HTML elements.

---

### Style attribute

Mithril supports both strings and objects as valid `style` values. In other words, all of the following are supported:

```javascript
m("div", {style: "background:red;"})
m("div", {style: {background: "red"}})
m("div[style=background:red]")
```

Using a string as a `style` would overwrite all inline styles in the element if it is redrawn, and not only CSS rules whose values have changed.

You can use both hyphenated CSS property names (like `background-color`) and camel cased DOM `style` property names (like `backgroundColor`). You can also define [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables), if your browser supports them.

Mithril does not attempt to add units to number values. It simply stringifies them.

---

### Events

Mithril supports event handler binding for all DOM events, including events whose specs do not define an `on${event}` property, such as `touchstart`

```javascript
function doSomething(e) {
	console.log(e)
}

m("div", {onclick: doSomething})
```

Mithril accepts functions and [EventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) objects. So this will also work:

```javascript
var clickListener = {
	handleEvent: function(e) {
		console.log(e)
	}
}

m("div", {onclick: clickListener})
```

By default, when an event attached with hyperscript fires, this will trigger Mithril's auto-redraw after your event callback returns (assuming you are using `m.mount` or `m.route` instead of `m.render` directly). You can disable auto-redraw specifically for a single event by setting `e.redraw = false` on it:

```javascript
m("div", {
	onclick: function(e) {
		// Prevent auto-redraw
		e.redraw = false
	}
})
```

---

### Properties

Mithril supports DOM functionality that is accessible via properties such as `<select>`'s `selectedIndex` and `value` properties.

```javascript
m("select", {selectedIndex: 0}, [
	m("option", "Option A"),
	m("option", "Option B"),
])
```

---

### Components

[Components](components.md) allow you to encapsulate logic into a unit and use it as if it was an element. They are the base for making large, scalable applications.

A component is any JavaScript object that contains a `view` method. To consume a component, pass the component as the first argument to `m()` instead of passing a CSS selector string. You can pass arguments to the component by defining attributes and children, as shown in the example below.

```javascript
// define a component
var Greeter = {
	view: function(vnode) {
		return m("div", vnode.attrs, ["Hello ", vnode.children])
	}
}

// consume it
m(Greeter, {style: "color:red;"}, "world")

// renders to this HTML:
// <div style="color:red;">Hello world</div>
```

To learn more about components, [see the components page](components.md).

---

### Lifecycle methods

Vnodes and components can have lifecycle methods (also known as *hooks*), which are called at various points during the lifetime of a DOM element. The lifecycle methods supported by Mithril are: `oninit`, `oncreate`, `onupdate`, `onbeforeremove`, `onremove`, and `onbeforeupdate`.

Lifecycle methods are defined in the same way as DOM event handlers, but receive the vnode as an argument, instead of an Event object:

```javascript
function initialize(vnode) {
	console.log(vnode)
}

m("div", {oninit: initialize})
```

Hook                          | Description
----------------------------- | ---
`oninit(vnode)`               | Runs before a vnode is rendered into a real DOM element
`oncreate(vnode)`             | Runs after a vnode is appended to the DOM
`onupdate(vnode)`             | Runs every time a redraw occurs while the DOM element is attached to the document
`onbeforeremove(vnode)`       | Runs before a DOM element is removed from the document. If a Promise is returned, Mithril only detaches the DOM element after the promise completes. This method is only triggered on the element that is detached from its parent DOM element, but not on its child elements.
`onremove(vnode)`             | Runs before a DOM element is removed from the document. If a `onbeforeremove` hook is defined, `onremove` is called after `done` is called. This method is triggered on the element that is detached from its parent element, and all of its children
`onbeforeupdate(vnode, old)`  | Runs before `onupdate` and if it returns `false`, it prevents a diff for the element and all of its children

To learn more about lifecycle methods, [see the lifecycle methods page](lifecycle-methods.md).

---

### Keys

Vnodes in a list can have a special attribute called `key`, which can be used to manage the identity of the DOM element as the model data that generates the vnode list changes.

Typically, `key` should be the unique identifier field of the objects in the data array.

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

To learn more about keys, [see the keys page](keys.md)

---

### SVG and MathML

Mithril fully supports SVG. Xlink is also supported, but unlike in pre-v1.0 versions of Mithril, must have the namespace explicitly defined:

```javascript
m("svg", [
	m("image[xlink:href='image.gif']")
])
```

MathML is also fully supported.

---

### Making templates dynamic

Since nested vnodes are just plain JavaScript expressions, you can simply use JavaScript facilities to manipulate them

#### Dynamic text

```javascript
var user = {name: "John"}

m(".name", user.name) // <div class="name">John</div>
```

#### Loops

Use `Array` methods such as [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to iterate over lists of data

```javascript
var users = [
	{name: "John"},
	{name: "Mary"},
]

m("ul", users.map(function(u) { // <ul>
	return m("li", u.name)      //   <li>John</li>
	                            //   <li>Mary</li>
}))                             // </ul>

// ES6+:
// m("ul", users.map(u =>
//   m("li", u.name)
// ))
```

#### Conditionals

Use the ternary operator to conditionally set content on a view

```javascript
var isError = false

m("div", isError ? "An error occurred" : "Saved") // <div>Saved</div>
```

You cannot use JavaScript statements such as `if` or `for` within JavaScript expressions. It's preferable to avoid using those statements altogether and instead, use the constructs above exclusively in order to keep the structure of the templates linear and declarative.

---

### Converting HTML

In Mithril, well-formed HTML is valid JSX. Little effort other than copy-pasting is required to integrate an independently produced HTML file into a project using JSX.

When using hyperscript, it's necessary to convert HTML to hyperscript syntax before the code can be run. To facilitate this, you can [use the HTML-to-Mithril-template converter](https://arthurclemens.github.io/mithril-template-converter/index.html).

---

### Avoid Anti-patterns

Although Mithril is flexible, some code patterns are discouraged:

#### Avoid dynamic selectors

Different DOM elements have different attributes, and often different behaviors. Making a selector configurable can leak the implementation details of a component out of its unit.

```javascript
// AVOID
var BadInput = {
	view: function(vnode) {
		return m("div", [
			m("label"),
			m(vnode.attrs.type || "input")
		])
	}
}
```

Instead of making selectors dynamic, you are encouraged to explicitly code each valid possibility, or refactor the variable portion of the code out.

```javascript
// PREFER explicit code
var BetterInput = {
	view: function(vnode) {
		return m("div", [
			m("label", vnode.attrs.title),
			m("input"),
		])
	}
}
var BetterSelect = {
	view: function(vnode) {
		return m("div", [
			m("label", vnode.attrs.title),
			m("select"),
		])
	}
}

// PREFER refactor variability out
var BetterLabeledComponent = {
	view: function(vnode) {
		return m("div", [
			m("label", vnode.attrs.title),
			vnode.children,
		])
	}
}
```

#### Avoid statements in view methods

JavaScript statements often require changing the naturally nested structure of an HTML tree, making the code more verbose and harder to understand. Constructing an virtual DOM tree procedurally can also potentially trigger expensive deoptimizations (such as an entire template being recreated from scratch)

```javascript
// AVOID
var BadListComponent = {
	view: function(vnode) {
		var list = []
		for (var i = 0; i < vnode.attrs.items.length; i++) {
			list.push(m("li", vnode.attrs.items[i]))
		}

		return m("ul", list)
	}
}
```

Instead, prefer using JavaScript expressions such as the ternary operator and Array methods.

```javascript
// PREFER
var BetterListComponent = {
	view: function(vnode) {
		return m("ul", vnode.attrs.items.map(function(item) {
			return m("li", item)
		}))
	}
}
```

#### Avoid creating vnodes outside views

When a redraw encounters a vnode which is strictly equal to the one in the previous render, it will be skipped and its contents will not be updated. While this may seem like an opportunity for performance optimisation, it should be avoided because it prevents dynamic changes in that node's tree - this leads to side-effects such as downstream lifecycle methods failing to trigger on redraw. In this sense, Mithril vnodes are immutable: new vnodes are compared to old ones; mutations to vnodes are not persisted.

The component documentation contains [more detail and an example of this anti-pattern](components.md#avoid-creating-component-instances-outside-views).
