# Code Style

We think it's best for the project if the code you write looks like the code the last developer wrote. Please read this document in its entirety, and be sure to refer back to it throughout the development of your contribution. We greatly appreciate your cooperation.


## General Rules

- Tab indentation
- Single-quotes
- Semicolon
- Strict mode
- No trailing whitespace
- Variable declaration at the top of the scope when used by both outer and inner scope
- Multiple variable statements
- Space after keywords and between arguments and operators
- Return early
- JSHint and JSCS valid
- Consistency

Example:

```js
'use strict';

function foo(bar, fum) {
	var ret;
	var hello = 'Hello';

	if (!bar) {
		return;
	}

	for (var i = 0; i < bar.length; i++) {
		if (bar[i] === hello) {
			ret += fum(bar[i]);
		}
	}

	return ret;
}
```

Read [idiomatic.js](https://github.com/rwldrn/idiomatic.js) for general JavaScript code style best practices.


## Anonymous Functions

When using anonymous functions, leave a space between the function name and the opening parenthesis.

Example:

```js
(function () {
	'use strict';

	var thanks = 'mate';
})();
```

## Strict mode

Strict mode should be used wherever possible, but must never be globally
applied. Instead, use it inside an IIFE as shown above.


## Comments

Inline comments are a great way of giving new users a better understanding of what you're doing and why.
Prefer stand-alone comments over inline comments. Inline comments should be separated by only one space
with the code and an additional single space after the `//`.

It's also helpful to let your functions breathe, by leaving additional lines between statements.

Example:

```js
// Ok.
var removeTodo = function (todoItem) {
	var todoModel = todoItem.getModel(); // Grab the model from the todoItem.
	todoItem.find('.destroy').click(); // Trigger a click to remove the element from the <ul>.
	todoModel.remove(); // Removes the todo model from localStorage.
};

// Better.
var removeTodo = function (todoItem) {
	// Grab the model from the todoItem.
	var todoModel = todoItem.getModel();

	// Trigger a click to remove the element from the <ul>.
	todoItem.find('.destroy').click();

	// Removes the todo model from localStorage.
	todoModel.remove();
};
```

## RequireJS

When using RequireJS, please format your code to these specifications:

```js
define('Block', [
	'jQuery',
	'Handlebars'
], function ($, Handlebars) {
	'use strict';

	// Code here.
});
```

## JSHint

When you submit your pull request, one of the first things we will do is run JSHint against your code.

You can help speed up the process by running it yourself:

```
jshint path/to/your/app/js
```

Your JSHint code blocks must follow this style:

```js
/*global define, App */
/*jshint unused:false */
```
