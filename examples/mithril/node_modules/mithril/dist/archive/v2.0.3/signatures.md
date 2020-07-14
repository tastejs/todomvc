# How to read signatures

Signature sections typically look like this:

`vnode = m(selector, attributes, children)`

Argument     | Type                                 | Required | Description
------------ | ------------------------------------ | -------- | ---
`selector`   | `String|Object`                      | Yes      | A CSS selector or a component
`attributes` | `Object`                             | No       | HTML attributes or element properties
`children`   | `Array<Vnode>|String|Number|Boolean` | No       | Child [vnodes](vnodes.md). Can be written as [splat arguments](signatures.md#splats)
**returns**  | `Vnode`                              |          | A [vnode](vnodes.md)

The signature line above the table indicates the general syntax of the method, showing the name of the method, the order of its arguments and a suggested variable name for its return value.

The **Argument** column in the table indicates which part of the signature is explained by the respective table row. The `returns` row displays information about the return value of the method.

The **Type** column indicates the expected type for the argument.

A pipe (`|`) indicates that an argument is valid if it has any of the listed types. For example, `String|Object` indicates that `selector` can be a string OR an object.

Angled brackets (`< >`) after an `Array` indicate the expected type for array items. For exampe, `Array<String>` indicates that the argument must be an array and that all items in that array must be strings. Angled brackets after an `Object` indicate a map. For example, `Object<String,Component>` indicates that the argument must be an object, whose keys are strings and values are [components](components.md)

Sometimes non-native types may appear to indicate that a specific object signature is required. For example, `Vnode` is an object that has a [virtual DOM node](vnodes.md) structure.

The **Required** column indicates whether an argument is required or optional. If an argument is optional, you may set it to `null` or `undefined`, or omit it altogether, such that the next argument appears in its place.

---

### Optional arguments

Function arguments surrounded by square brackets `[ ]` are optional. In the example below, `url` is an optional argument:

`m.request([url,] options)`

---

### Splats

A splat argument means that if the argument is an array, you can omit the square brackets and have a variable number of arguments in the method instead.

In the example at the top, this means that `m("div", {id: "foo"}, ["a", "b", "c"])` can also be written as `m("div", {id: "foo"}, "a", "b", "c")`.

Splats are useful in some compile-to-js languages such as Coffeescript, and also allow helpful shorthands for some common use cases.

---

### Function signatures

Functions are denoted with an arrow (`->`). The left side of the arrow indicates the types of the input arguments and the right side indicates the type for the return value.

For example, `parseFloat` has the signature `String -> Number`, i.e. it takes a string as input and returns a number as output.

Functions with multiple arguments are denoted with parenthesis: `(String, Array) -> Number`

---

### Component signatures

Components are denoted via calls to `m`, but with the initial selector argument set to a constant named in the relevant prose:

`vnode = m(m.route.Link, attributes, children)`

Argument              | Type                                 | Required | Description
--------------------- | ------------------------------------ | -------- | ---
`attributes.href`     | `Object`                             | Yes      | The target route to navigate to.
`attributes.selector` | `String|Object|Function`             | No      | This sets the tag name to use. Must be a valid selector for [`m`](hyperscript.md) if given, defaults to `"a"`.
`attributes.options`  | `Object`                             | No      | This sets the options passed to [`m.route.set`](#mrouteset).
`attributes`          | `Object`                             | No       | Other attributes to apply to the returned vnode may be passed.
`children`            | `Array<Vnode>|String|Number|Boolean` | No       | Child [vnodes](vnodes.md) for this link.
**returns**           | `Vnode`                              |          | A [vnode](vnodes.md).

Children here, if specified, are assumed to be able to be written as [splat arguments](#splats), unless otherwise specified in prose.

An element with no sensible children and/or attributes may choose to elide the relevant parameter entirely:

`vnode = m(Component, attributes)`

Argument          | Type     | Required | Description
----------------- | -------- | -------- | ---
`attributes.href` | `Object` | Yes      | The
`attributes`      | `Object` | No       | Other attributes to apply to the returned vnode
**returns**       | `Vnode`  |          | A [vnode](vnodes.md)
