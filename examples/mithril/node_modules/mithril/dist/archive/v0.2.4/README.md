[![JS.ORG](https://img.shields.io/badge/js.org-mithril-ffb400.svg?style=flat-square)](http://js.org)
[![Join the chat at https://gitter.im/lhorie/mithril.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lhorie/mithril.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/lhorie/mithril.js.svg?branch=master)](https://travis-ci.org/lhorie/mithril.js)

# Mithril

A Javascript Framework for Building Brilliant Applications

See the [website](http://mithril.js.org) for documentation

There's also a [blog](http://lhorie.github.io/mithril-blog) and a [mailing list](https://groups.google.com/forum/#!forum/mithriljs)

---

## What is Mithril?

Mithril is a client-side MVC framework - a tool to organize code in a way that is easy to think about and to maintain.

### Light-weight

- Only 7.8 kB gzipped, no dependencies
- Small API, small learning curve

### Robust

- Safe-by-default templates
- Hierarchical MVC via components

### Fast

- Virtual DOM diffing and compilable templates
- Intelligent auto-redrawing system

---

## Sample code

```javascript
//namespace
var app = {};

//model
app.PageList = function() {
	return m.request({method: "GET", url: "pages.json"});
};

//controller
app.controller = function() {
	var pages = app.PageList();
	return {
		pages: pages,
		rotate: function() {
			pages().push(pages().shift());
		}
	}
};

//view
app.view = function(ctrl) {
	return [
		ctrl.pages().map(function(page) {
			return m("a", {href: page.url}, page.title);
		}),
		m("button", {onclick: ctrl.rotate}, "Rotate links")
	];
};


//initialize
m.mount(document.getElementById("example"), app);
```

---

### Learn more

- [Installation](http://mithril.js.org/installation.html)
- [Tutorial](http://mithril.js.org/getting-started.html)
- [Differences from Other Frameworks](http://mithril.js.org/comparison.html)
- [Benchmarks](http://mithril.js.org/benchmarks.html)
