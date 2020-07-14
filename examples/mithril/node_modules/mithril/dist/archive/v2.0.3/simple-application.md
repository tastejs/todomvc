# Simple application

Let's develop a simple application that shows off how to do most of the major things you would need to deal with while using Mithril.

*An interactive example of the end result can be seen [here](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcIB0sxhAGhADMBLGXVAbVADsBDAWwjRAFVIAnAWQHsloMAVrgKxu1ROOYA3WuwAEbCPIC8c4AB1qc7XKjEw8VHIoBdPJp27utJABl9huYQCu1BMTEAKAJRqLlnXYIeGd2LXoMIIBHZwgDTw0tAOTGeAALXiN1EABxAFEAFWzzJOTLUKgskDT4eAAHMFQAeiag+gBaIIN22jriDDSlbgBrZ166rG56Jt7iJucOMGL-Mp0Ad2J0gGEgvnFiWihGuXh2WJLVgF9vFYCMdIhqTxc3eA8nrucoeF9E1ctFOwMHoDHJVJ9vhgkLR4LRbpZrrdLiVbrBQkFxEZgMjblBrEgjC93F5iEhfvDAsFQuFIhAYnF4AkKSlghkCXJsvkivhmQEKlUavVGi02p0GT0+gMhqNxpNprN5osmtk5ABqOSki7-bQbba7R5vQ7HU7nXmI0p3B5PIlvLwQn5+C2rQFYdEGsFye1mm4WnHUW5gWhSCCE1zEp7kp2UkJhOQRaKxeJ-bVx1mZDkgAAKLG5Wu1-IzgoazVaEA6XXgEv6g3YIzGdQmonlfUVSjAypAaoUHFd7Ax8Awmt5lmhsKMLrRfYNef+urSO2QBoORyMJogM4RPoRmkuIGRNAYTHQgPsBkEwhAonEBuksm7SlP8A9ye0YmI1E2457eJsj5nUmICA1lDV53h8R1ViCGNwk8bIMAWJR2hBeBinvIFkIwehemeMNbSeBD2EjFNPSpWN6FgkBaHgjgkIcdpNjLVDgDSIJCCqJpkE2DsuwIwckDwOQxFgIIYRDONIm4ZxEGBd9hmROReJIdgDAAOUPLsVRVdVeKgWhVMPLcymuQztEuHc9zwA9GGYQEADFuHYCIhHwS8xAkeBb3kOyHPoZ9bjfD9HBtMCpGoXgIF+F0fyQTxQvCjAYVOMA+O8P1LAAoCQPDcCXwCKDqTjCjCB8pjhzKMQwGcAAjehPycXCwIiiDiLKCAMDqIJg3EAARCBCFoL5GRMlqAR7QNgx8MrkjMqNpoEigpsK7JdKq-gVugVDsls4hlKfOhGGybwNzKcjsnfOopMHagLvgCh4AATzqCBlEQAAPeATAoOpdNgCAMigPh2GUbbdrkfaIBMUrZv+AKbqMCI5wAQVqdgKJkKBYlQ4KvHR2JIp7Sd+wwJT9MYD1cYga5ju1CmvyUXsiZJ+A1IO6HN2pgJTpAdaoGBWhVqgTaQFsPS9sPQ6OcsLnzsumXbu+2hfv+wHlBF0Fwch-BmpG2GpPhjAkZRtHDkxrXsaeCn8fpwmDT50mIHJk3KaOxb0qdumgRt8Q7eZ8W2Z0KnFq5qqpPgMQMBD2oxDux7nsqmrNk1gTsgAZSDCAJd5Exhpm3d9xAcHmBF+7JIHZyRDcm90BkeRi9LvyLQy4D6tAnGwr4IiynysiKKw98+ZLqTUIW-3tC5ugpEwx5nGH12dC5uEtdykaWL6owAHImmQ9fJZhtwRMQfXayktq9GoYY59M5PWEWQ7Fuz3ex4oyBw1QuK+CwNJSCQDFhssbOkTmXzoXdAspy6uWvJIdA8ZS5tQ6n1Ygr1PDrwAMTrx9DAk+ngkDcDRIwb2VVeD3WvlvBwUNLDZFIQYbIWJeQYkBllPCOVFrdxgnXKSAlyIngcN4P+AckQzkoZxeATRUCkhodrPKjwGEt2yu-Jqy8u6kTYbQQe8BOGeG8o5AS8iEoozALws0AidzeAslZI8mBsAXivO5ZghCkDELkFdG6AkI6hzEM1YqmIwY+UOHIAAjAANjqK9OQAA1JQ0I6AAG5-BYXYAAc3fEYAATAABhCbE6gM1NAD3rsmeJSTqBGH8Rk0JA0w5ZLHrQV67QNhIHSCUtJzTMk7k0Lk-BzhmqFOSXINJfS5AAGYylZJydQaiiFkLNWQu0Aw90YBGDCtQCAVS4yyCKUYfp-TSmtKSHUGwSB3wJM2aM9p4yCK0W6AxXyyYqqK2GAk4+1B2QoP6m82gqzCHsBkf4kJcgwDcD0EgOQKCkBgtWaIPE7AjAoMGXC1ZhywAK3ukYKqeJYDDFWT04pAztm7O0PssFRyjAAA4-n+IAKz4pOBAd67Q+CiHYDCd4iyxArLaf6c5NEZnXNQBkYM8hkxvUrAyhyzKxBGFcIDM+7LslnL5gLZqiLkWovRZiuJ6zelbLkFS16pzOXOKks1L5Py-kAqBSCsFSBPkOUBp0GwxAFhGEGdSwhtSwDEAAF7ErkCaxCbqEX6BVb6tVWLNU4u1TsvV-hCWHOoMcgJZSAm6tWfUxpia0kAFJ9W5MjmHLQtz7mPMks8mFEBy02u+UoEpZrAWkkteC-wfr2D2sOU6oZ1LIUORhXCwZgakW6RRRqagMr2hotweqpI2LNkDKjas2NPqo3JupcK+lcAxV4VZcsnN4y80Sv5UoY1RankvIgCSs9Z7RkuUgDAcM5AQCBJSagfxe4zDc1kuQKgBdDzMFqukdgpAXIVGYEWYU8xroPLlE0P9LFSAAAF-EYEQ4E6DmxYO83AQ9J6zAwDCWIHUDylwTCXCAA)*

First let's create an entry point for the application. Create a file `index.html`:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>My Application</title>
	</head>
	<body>
		<script src="bin/app.js"></script>
	</body>
</html>
```

The `<!doctype html>` line indicates this is an HTML 5 document. The first `charset` meta tag indicates the encoding of the document and the `viewport` meta tag dictates how mobile browsers should scale the page. The `title` tag contains the text to be displayed on the browser tab for this application, and the `script` tag indicates what is the path to the JavaScript file that controls the application.

We could create the entire application in a single JavaScript file, but doing so would make it difficult to navigate the codebase later on. Instead, let's split the code into *modules*, and assemble these modules into a *bundle* `bin/app.js`.

There are many ways to setup a bundler tool, but most are distributed via npm. In fact, most modern JavaScript libraries and tools are distributed that way, including Mithril. To download npm, [install Node.js](https://nodejs.org/en/); npm is installed automatically with it. Once you have Node.js and npm installed, open the command line and run this command:

```bash
npm init -y
```

If npm is installed correctly, a file `package.json` will be created. This file will contain a skeleton project meta-description file. Feel free to edit the project and author information in this file.

---

To install Mithril, follow the instructions in the [installation](installation.md) page. Once you have a project skeleton with Mithril installed, we are ready to create the application.

Let's start by creating a module to store our state. Let's create a file called `src/models/User.js`

```javascript
// src/models/User.js
var User = {
	list: []
}

module.exports = User
```

Now let's add code to load some data from a server. To communicate with a server, we can use Mithril's XHR utility, `m.request`. First, we include Mithril in the module:

```javascript
// src/models/User.js
var m = require("mithril")

var User = {
	list: []
}

module.exports = User
```

Next we create a function that will trigger an XHR call. Let's call it `loadList`

```javascript
// src/models/User.js
var m = require("mithril")

var User = {
	list: [],
	loadList: function() {
		// TODO: make XHR call
	}
}

module.exports = User
```

Then we can add an `m.request` call to make an XHR request. For this tutorial, we'll make XHR calls to the [REM](https://rem-rest-api.herokuapp.com/) API, a mock REST API designed for rapid prototyping. This API returns a list of users from the `GET https://rem-rest-api.herokuapp.com/api/users` endpoint. Let's use `m.request` to make an XHR request and populate our data with the response of that endpoint.

*Note: third-party cookies may have to be enabled for the REM endpoint to work.*

```javascript
// src/models/User.js
var m = require("mithril")

var User = {
	list: [],
	loadList: function() {
		return m.request({
			method: "GET",
			url: "https://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
		})
	},
}

module.exports = User
```

The `method` option is an [HTTP method](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). To retrieve data from the server without causing side-effects on the server, we need to use the `GET` method. The `url` is the address for the API endpoint. The `withCredentials: true` line indicates that we're using cookies (which is a requirement for the REM API).

The `m.request` call returns a Promise that resolves to the data from the endpoint. By default, Mithril assumes a HTTP response body are in JSON format and automatically parses it into a JavaScript object or array. The `.then` callback runs when the XHR request completes. In this case, the callback assigns the `result.data` array to `User.list`.

Notice we also have a `return` statement in `loadList`. This is a general good practice when working with Promises, which allows us to register more callbacks to run after the completion of the XHR request.

This simple model exposes two members: `User.list` (an array of user objects), and `User.loadList` (a method that populates `User.list` with server data).

---

Now, let's create a view module so that we can display data from our User model module.

Create a file called `src/views/UserList.js`. First, let's include Mithril and our model, since we'll need to use both:

```javascript
// src/views/UserList.js
var m = require("mithril")
var User = require("../models/User")
```

Next, let's create a Mithril component. A component is simply an object that has a `view` method:

```javascript
// src/views/UserList.js
var m = require("mithril")
var User = require("../models/User")

module.exports = {
	view: function() {
		// TODO add code here
	}
}
```

By default, Mithril views are described using [hyperscript](hyperscript.md). Hyperscript offers a terse syntax that can be indented more naturally than HTML for complex tags, and since its syntax is just JavaScript, it's possible to leverage a lot of JavaScript tooling ecosystem. For example:

- You can use [Babel](es6.md) to transpile ES6+ to ES5 for IE and to transpile [JSX](jsx.md) (an inline HTML-like syntax extension) to appropriate hyperscript calls.
- You can use [ESLint](https://eslint.org/) for easy linting with no special plugins.
- You can use [Terser](https://github.com/terser-js/terser) or [UglifyJS](https://github.com/mishoo/UglifyJS2) (ES5 only) to minify your code easily.
- You can use [Istanbul](https://github.com/istanbuljs/nyc) for code coverage.
- You can use [TypeScript](https://www.typescriptlang.org/) for easy code analysis. (There are [community-supported type definitions available](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mithril), so you don't need to roll your own.)

Let's start off with hyperscript and create a list of items. Hyperscript is the idiomatic way to use Mithril, but [JSX](jsx.md) works pretty similarly.

```javascript
// src/views/UserList.js
var m = require("mithril")
var User = require("../models/User")

module.exports = {
	view: function() {
		return m(".user-list")
	}
}
```

The `".user-list"` string is a CSS selector, and as you would expect, `.user-list` represents a class. When a tag is not specified, `div` is the default. So this view is equivalent to `<div class="user-list"></div>`.

Now, let's reference the list of users from the model we created earlier (`User.list`) to dynamically loop through data:

```javascript
// src/views/UserList.js
var m = require("mithril")
var User = require("../models/User")

module.exports = {
	view: function() {
		return m(".user-list", User.list.map(function(user) {
			return m(".user-list-item", user.firstName + " " + user.lastName)
		}))
	}
}
```

Since `User.list` is a JavaScript array, and since hyperscript views are just JavaScript, we can loop through the array using the `.map` method. This creates an array of vnodes that represents a list of `div`s, each containing the name of a user.

The problem, of course, is that we never called the `User.loadList` function. Therefore, `User.list` is still an empty array, and thus this view would render a blank page. Since we want `User.loadList` to be called when we render this component, we can take advantage of component [lifecycle methods](lifecycle-methods.md):

```javascript
// src/views/UserList.js
var m = require("mithril")
var User = require("../models/User")

module.exports = {
	oninit: User.loadList,
	view: function() {
		return m(".user-list", User.list.map(function(user) {
			return m(".user-list-item", user.firstName + " " + user.lastName)
		}))
	}
}
```

Notice that we added an `oninit` method to the component, which references `User.loadList`. This means that when the component initializes, User.loadList will be called, triggering an XHR request. When the server returns a response, `User.list` gets populated.

Also notice we **didn't** do `oninit: User.loadList()` (with parentheses at the end). The difference is that `oninit: User.loadList()` calls the function once and immediately, but `oninit: User.loadList` only calls that function when the component renders. This is an important difference and a common pitfall for developers new to JavaScript: calling the function immediately means that the XHR request will fire as soon as the source code is evaluated, even if the component never renders. Also, if the component is ever recreated (through navigating back and forth through the application), the function won't be called again as expected.

---

Let's render the view from the entry point file `src/index.js` we created earlier:

```javascript
// src/index.js
var m = require("mithril")

var UserList = require("./views/UserList")

m.mount(document.body, UserList)
```

The `m.mount` call renders the specified component (`UserList`) into a DOM element (`document.body`), erasing any DOM that was there previously. Opening the HTML file in a browser should now display a list of person names.

---

Right now, the list looks rather plain because we have not defined any styles. So let's add a few of them. Let's first create a file called `styles.css` and include it in the `index.html` file:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>My Application</title>
		<link href="styles.css" rel="stylesheet" />
	</head>
	<body>
		<script src="bin/app.js"></script>
	</body>
</html>
```

Now we can style the `UserList` component:

```css
.user-list {
	list-style: none;
	margin: 0 0 10px;
	padding: 0;
}

.user-list-item {
	background: #fafafa;
	border: 1px solid #ddd;
	color: #333;
	display: block;
	margin: 0 0 1px;
	padding: 8px 15px;
	text-decoration: none;
}

.user-list-item:hover {
	text-decoration: underline;
}
```

Reloading the browser window now should display some styled elements.

---

Let's add routing to our application.

Routing means binding a screen to a unique URL, to create the ability to go from one "page" to another. Mithril is designed for Single Page Applications, so these "pages" aren't necessarily different HTML files in the traditional sense of the word. Instead, routing in Single Page Applications retains the same HTML file throughout its lifetime, but changes the state of the application via JavaScript. Client side routing has the benefit of avoiding flashes of blank screen between page transitions, and can reduce the amount of data being sent down from the server when used in conjunction with an web service oriented architecture (i.e. an application that downloads data as JSON instead of downloading pre-rendered chunks of verbose HTML).

We can add routing by changing the `m.mount` call to a `m.route` call:

```javascript
// src/index.js
var m = require("mithril")

var UserList = require("./views/UserList")

m.route(document.body, "/list", {
	"/list": UserList
})
```

The `m.route` call specifies that the application will be rendered into `document.body`. The `"/list"` argument is the default route. That means the user will be redirected to that route if they land in a route that does not exist. The `{"/list": UserList}` object declares a map of existing routes, and what components each route resolves to.

Refreshing the page in the browser should now append `#!/list` to the URL to indicate that routing is working. Since that route render UserList, we should still see the list of people on screen as before.

The `#!` snippet is known as a hashbang, and it's a commonly used string for implementing client-side routing. It's possible to configure this string it via [`m.route.prefix`](route.md#mrouteprefix). Some configurations require supporting server-side changes, so we'll just continue using the hashbang for the rest of this tutorial.

---

Let's add another route to our application for editing users. First let's create a module called `views/UserForm.js`

```javascript
// src/views/UserForm.js

module.exports = {
	view: function() {
		// TODO implement view
	}
}
```

Then we can `require` this new module from `src/index.js`

```javascript
// src/index.js
var m = require("mithril")

var UserList = require("./views/UserList")
var UserForm = require("./views/UserForm")

m.route(document.body, "/list", {
	"/list": UserList
})
```

And finally, we can create a route that references it:

```javascript
// src/index.js
var m = require("mithril")

var UserList = require("./views/UserList")
var UserForm = require("./views/UserForm")

m.route(document.body, "/list", {
	"/list": UserList,
	"/edit/:id": UserForm,
})
```

Notice that the new route has a `:id` in it. This is a route parameter; you can think of it as a wild card; the route `/edit/1` would resolve to `UserForm` with an `id` of `"1"`. `/edit/2` would also resolve to `UserForm`, but with an `id` of `"2"`. And so on.

Let's implement the `UserForm` component so that it can respond to those route parameters:

```javascript
// src/views/UserForm.js
var m = require("mithril")

module.exports = {
	view: function() {
		return m("form", [
			m("label.label", "First name"),
			m("input.input[type=text][placeholder=First name]"),
			m("label.label", "Last name"),
			m("input.input[placeholder=Last name]"),
			m("button.button[type=button]", "Save"),
		])
	}
}
```

And let's add some more styles to `styles.css`:

```css
/* styles.css */
body, .input, .button {
	font: normal 16px Verdana;
	margin: 0;
}

.user-list {
	list-style: none;
	margin: 0 0 10px;
	padding: 0;
}

.user-list-item {
	background: #fafafa;
	border: 1px solid #ddd;
	color: #333;
	display: block;
	margin: 0 0 1px;
	padding: 8px 15px;
	text-decoration: none;
}

.user-list-item:hover {
	text-decoration: underline;
}

.label {
	display: block;
	margin: 0 0 5px;
}

.input {
	border: 1px solid #ddd;
	border-radius: 3px;
	box-sizing: border-box;
	display: block;
	margin: 0 0 10px;
	padding: 10px 15px;
	width: 100%;
}

.button {
	background: #eee;
	border: 1px solid #ddd;
	border-radius: 3px;
	color: #333;
	display: inline-block;
	margin: 0 0 10px;
	padding: 10px 15px;
	text-decoration: none;
}

.button:hover {
	background: #e8e8e8;
}
```

Right now, this component does nothing to respond to user events. Let's add some code to our `User` model in `src/models/User.js`. This is how the code is right now:

```javascript
// src/models/User.js
var m = require("mithril")

var User = {
	list: [],
	loadList: function() {
		return m.request({
			method: "GET",
			url: "https://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
		})
	},
}

module.exports = User
```

Let's add code to allow us to load a single user

```javascript
// src/models/User.js
var m = require("mithril")

var User = {
	list: [],
	loadList: function() {
		return m.request({
			method: "GET",
			url: "https://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
		})
	},

	current: {},
	load: function(id) {
		return m.request({
			method: "GET",
			url: "https://rem-rest-api.herokuapp.com/api/users/" + id,
			withCredentials: true,
		})
		.then(function(result) {
			User.current = result
		})
	}
}

module.exports = User
```

Notice we added a `User.current` property, and a `User.load(id)` method which populates that property. We can now populate the `UserForm` view using this new method:

```javascript
// src/views/UserForm.js
var m = require("mithril")
var User = require("../models/User")

module.exports = {
	oninit: function(vnode) {User.load(vnode.attrs.id)},
	view: function() {
		return m("form", [
			m("label.label", "First name"),
			m("input.input[type=text][placeholder=First name]", {value: User.current.firstName}),
			m("label.label", "Last name"),
			m("input.input[placeholder=Last name]", {value: User.current.lastName}),
			m("button.button[type=button]", "Save"),
		])
	}
}
```

Similar to the `UserList` component, `oninit` calls `User.load()`. Remember we had a route parameter called `:id` on the `"/edit/:id": UserForm` route? The route parameter becomes an attribute of the `UserForm` component's vnode, so routing to `/edit/1` would make `vnode.attrs.id` have a value of `"1"`.

Now, let's modify the `UserList` view so that we can navigate from there to a `UserForm`:

```javascript
// src/views/UserList.js
var m = require("mithril")
var User = require("../models/User")

module.exports = {
	oninit: User.loadList,
	view: function() {
		return m(".user-list", User.list.map(function(user) {
			return m(m.route.Link, {
				class: "user-list-item",
				href: "/edit/" + user.id,
			}, user.firstName + " " + user.lastName)
		}))
	}
}
```

Here we swapped out the `.user-list-item` vnode with an `m.route.Link` with that class and the same children. We added an `href` that references the route we want. What this means is that clicking the link would change the part of URL that comes after the hashbang `#!` (thus changing the route without unloading the current HTML page). Behind the scenes, it uses an `<a>` to implement the link, and it all just works.

If you refresh the page in the browser, you should now be able to click on a person and be taken to a form. You should also be able to press the back button in the browser to go back from the form to the list of people.

---

The form itself still doesn't save when you press "Save". Let's make this form work:

```javascript
// src/views/UserForm.js
var m = require("mithril")
var User = require("../models/User")

module.exports = {
	oninit: function(vnode) {User.load(vnode.attrs.id)},
	view: function() {
		return m("form", {
				onsubmit: function(e) {
					e.preventDefault()
					User.save()
				}
			}, [
			m("label.label", "First name"),
			m("input.input[type=text][placeholder=First name]", {
				oninput: function (e) {User.current.firstName = e.target.value},
				value: User.current.firstName
			}),
			m("label.label", "Last name"),
			m("input.input[placeholder=Last name]", {
				oninput: function (e) {User.current.lastName = e.target.value},
				value: User.current.lastName
			}),
			m("button.button[type=submit]", "Save"),
		])
	}
}
```

We added `oninput` events to both inputs, that set the `User.current.firstName` and `User.current.lastName` properties when a user types.

In addition, we declared that a `User.save` method should be called when the "Save" button is pressed. Let's implement that method:

```javascript
// src/models/User.js
var m = require("mithril")

var User = {
	list: [],
	loadList: function() {
		return m.request({
			method: "GET",
			url: "https://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
		})
	},

	current: {},
	load: function(id) {
		return m.request({
			method: "GET",
			url: "https://rem-rest-api.herokuapp.com/api/users/" + id,
			withCredentials: true,
		})
		.then(function(result) {
			User.current = result
		})
	},

	save: function() {
		return m.request({
			method: "PUT",
			url: "https://rem-rest-api.herokuapp.com/api/users/" + User.current.id,
			body: User.current,
			withCredentials: true,
		})
	}
}

module.exports = User
```

In the `save` method at the bottom, we used the `PUT` HTTP method to indicate that we are upserting data to the server.

Now try editing the name of a user in the application. Once you save a change, you should be able to see the change reflected in the list of users.

---

Currently, we're only able to navigate back to the user list via the browser back button. Ideally, we would like to have a menu - or more generically, a layout where we can put global UI elements

Let's create a file `src/views/Layout.js`:

```javascript
// src/views/Layout.js
var m = require("mithril")

module.exports = {
	view: function(vnode) {
		return m("main.layout", [
			m("nav.menu", [
				m(m.route.Link, {href: "/list"}, "Users")
			]),
			m("section", vnode.children)
		])
	}
}
```

This component is fairly straightforward, it has a `<nav>` with a link to the list of users. Similar to what we did to the `/edit` links, this link uses `m.route.Link` to create a routable link.

Notice there's also a `<section>` element with `vnode.children` as children. `vnode` is a reference to the vnode that represents an instance of the Layout component (i.e. the vnode returned by a `m(Layout)` call). Therefore, `vnode.children` refer to any children of that vnode.

And let's update the styles once more:

```css
/* styles.css */
body, .input, .button {
	font: normal 16px Verdana;
	margin: 0;
}

.layout {
	margin: 10px auto;
	max-width: 1000px;
}

.menu {
	margin: 0 0 30px;
}

.user-list {
	list-style: none;
	margin: 0 0 10px;
	padding: 0;
}

.user-list-item {
	background: #fafafa;
	border: 1px solid #ddd;
	color: #333;
	display: block;
	margin: 0 0 1px;
	padding: 8px 15px;
	text-decoration: none;
}

.user-list-item:hover {
	text-decoration: underline;
}

.label {
	display: block;
	margin: 0 0 5px;
}

.input {
	border: 1px solid #ddd;
	border-radius: 3px;
	box-sizing: border-box;
	display: block;
	margin: 0 0 10px;
	padding: 10px 15px;
	width: 100%;
}

.button {
	background: #eee;
	border: 1px solid #ddd;
	border-radius: 3px;
	color: #333;
	display: inline-block;
	margin: 0 0 10px;
	padding: 10px 15px;
	text-decoration: none;
}

.button:hover {
	background: #e8e8e8;
}
```

Let's change the router in `src/index.js` to add our layout into the mix:

```javascript
// src/index.js
var m = require("mithril")

var UserList = require("./views/UserList")
var UserForm = require("./views/UserForm")
var Layout = require("./views/Layout")

m.route(document.body, "/list", {
	"/list": {
		render: function() {
			return m(Layout, m(UserList))
		}
	},
	"/edit/:id": {
		render: function(vnode) {
			return m(Layout, m(UserForm, vnode.attrs))
		}
	},
})
```

We replaced each component with a [RouteResolver](route.md#routeresolver) (basically, an object with a `render` method). The `render` methods can be written in the same way as regular component views would be, by nesting `m()` calls.

The interesting thing to pay attention to is how components can be used instead of a selector string in a `m()` call. Here, in the `/list` route, we have `m(Layout, m(UserList))`. This means there's a root vnode that represents an instance of `Layout`, which has a `UserList` vnode as its only child.

In the `/edit/:id` route, there's also a `vnode` argument that carries the route parameters into the `UserForm` component. So if the URL is `/edit/1`, then `vnode.attrs` in this case is `{id: 1}`, and this `m(UserForm, vnode.attrs)` is equivalent to `m(UserForm, {id: 1})`. The equivalent JSX code would be `<UserForm id={vnode.attrs.id} />`.

Refresh the page in the browser and now you'll see the global navigation on every page in the app.

---

This concludes the tutorial.

In this tutorial, we went through the process of creating a very simple application where we can list users from a server and edit them individually. As an extra exercise, try to implement user creation and deletion on your own.

If you want to see more examples of Mithril code, check the [examples](examples.md) page. If you have questions, feel free to drop by the [Mithril chat room](https://gitter.im/MithrilJS/mithril.js).
