# Code Style

We think it's best for the project if the code you write looks like the code the last developer wrote. Please read this document in its entirety, and be sure to refer back to it throughout the development of your contribution. We greatly appreciate your cooperation.


## General Rules

- Tab indentation
- Single-quotes
- Semicolon
- Strict mode
- No trailing whitespace
- Variables at the top of the scope
- Multiple variable statements
- Space after keywords and between arguments and operators
- Return early
- JSHint valid
- Consistency

Example:

```js
'use strict';

function foo(bar, fum) {
	var i, l, ret;
	var hello = 'Hello';

	if (!bar) {
		return;
	}

	for (i = 0, l = bar.length; i < l; i++) {
		if (bar[i] === hello) {
			ret += fum(bar[i]);
		}
	}

	return ret;
}
```

Read [idiomatic.js](https://github.com/rwldrn/idiomatic.js) for general JavaScript code style best practices.


## Anonymous Functions

When using anonymous functions, leave a space between the function name and opening parenthesis.

Example:

```js
(function () {
	'use strict';

	var thanks = 'mate';
})
```


## Comments

Inline comments are a great way of giving new users a better understanding of what you're doing and why.

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

You can help speed the process by running it yourself:

```
jshint path/to/your/app/js
```

Your JSHint code blocks must follow this style:

```js
/*global define, App */
/*jshint unused:false */
```
