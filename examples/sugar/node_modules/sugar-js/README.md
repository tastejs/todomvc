## sugar

[![Travis CI Status](https://travis-ci.org/tangbc/sugar.svg?branch=master)](https://travis-ci.org/tangbc/sugar)
[![codecov](https://codecov.io/gh/tangbc/sugar/branch/master/graph/badge.svg)](https://codecov.io/gh/tangbc/sugar)


A lightweight and powerfull MVVM library for building web UI component. Simple API and without any dependence.
Consists of two independent parts: **`sugar`** ( *support component system* ) and **`mvvm`** ( *support data binding & view refresh* )


## Diagram

<img src="http://7xodrz.com1.z0.glb.clouddn.com/sugar-constructor-en" width="600">


## Directory

* `test/` Unit test files and API test demos.

* `build/` Development and production config files.

* `demos/` Several complete demos developed by sugar.js.

* `dist/` Bundle files of sugar.js and mvvm.js, and their compressed files.

* `src/` Source code files:

	* `src/main/` Component system modules, all the module files in this directory are serving for component.js.
	Components can be included each other, nested and have message communication.
	[API & Doc](https://github.com/tangbc/sugar/wiki/API)

	* **`src/mvvm/`** A simple MVVM library, directive support bind text, two-way data binding,
	bind attribute, bind event, repeat list and more. **mvvm doesn't rely on sugar, it can be used independently**.
	[API & Doc](https://github.com/tangbc/sugar/wiki/MVVM)


## HelloWorld
```javascript
// define HelloWorld component:
var HelloWorld = sugar.Component.extend({
	init: function (config) {
		config = this.cover(config, {
			'class': 'demo',
			'view': '<h1>{{ title }}</h1>',
			'model': {
				'title': 'Hello world!'
			}
		});
		this.Super('init', arguments);
	}
});

// create to body:
sugar.core.create('hello-world', HelloWord, {
	'target': document.body
});
```
And then the HTML structure will be:
```html
...
<body>
	<div class="demo">
		<h1>Hello world!</h1>
	</div>
</body>
...
```


## Document

[Get start and check document on Wiki.](https://github.com/tangbc/sugar/wiki)


## Demos

There are several demos in **`demos/`** directory, check it out and preview them in the following links:

* [StarRating](http://tangbc.github.io/sugar/demos/starRating)
* [DatePicker](http://tangbc.github.io/sugar/demos/datePicker)
* [TodoMVC](http://tangbc.github.io/sugar/demos/todoMVC)

You can experience or preview `sugar.js` by a *RadioComponent* in [jsfiddle](https://jsfiddle.net/tangbc/may7jzb4/7/).


## Usage

* Both `sugar.js` and `mvvm.js` can be used by `CMD`, `AMD` and `<script></script>`.
	* `mvvm (about 25 kb)` http://tangbc.github.io/sugar/dist/mvvm.min.js
	* `sugar (about 31 kb)` http://tangbc.github.io/sugar/dist/sugar.min.js

* Browser support: does not support IE8 and below, used `Object.defineProperty`, `Object.create` ...


## ChangeLog

* [See releases](https://github.com/tangbc/sugar/releases)


## Contribution

1. Fork or clone repository

2. Install nodejs package devtools: **`npm install`**

3. Develop and debug: **`npm run dev`** *(generate sourcemap files in `bundle/`)*

4. Add and write test spec, *(in `test/units/specs/`)* then run uint test：**`npm run test`**

5. Generate the test coverage report, jshint check-up and compress source code: **`npm run build`**


## License

[MIT License](https://github.com/tangbc/sugar/blob/master/LICENSE)