/* global Benchmark */
"use strict"

/* Based off of preact's perf tests, so including their MIT license */
/*
The MIT License (MIT)

Copyright (c) 2017 Jason Miller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var browserMock = require("../test-utils/browserMock")

// Do this silly dance so browser testing works
var B = typeof Benchmark === "undefined" ? require("benchmark") : Benchmark

var scratch;

// set up browser env on before running tests
var doc = typeof document !== "undefined" ? document : null

if(!doc) {
	var mock = browserMock()
	if (typeof global !== "undefined") { global.window = mock }

	doc = mock.document
}

var m = require("../render/hyperscript")
m.render = require("../render/render")(window)


function resetScratch() {
	doc.documentElement.innerHTML = "<div></div>"
	scratch = doc.documentElement.firstChild
}

resetScratch()

// Initialize benchmark suite
var suite = new B.Suite("mithril perf")
var xuite = {add: function(options) {console.log("skipping " + options.name)}} // eslint-disable-line no-unused-vars

suite.on("start", function() {
	this.start = Date.now();
})

suite.on("cycle", function(e) {
	console.log(e.target.toString())

	resetScratch()
})

suite.on("complete", function() {
	console.log("Completed perf tests in " + (Date.now() - this.start) + "ms")
})

suite.on("error", console.error.bind(console))

suite.add({
	name : "rerender identical vnode",
	onStart : function() {
		this.vdom = m("div", {class: "foo bar", "data-foo": "bar", p: 2},
			m("header",
				m("h1", {class: "asdf"}, "a ", "b", " c ", 0, " d"),
				m("nav",
					m("a", {href: "/foo"}, "Foo"),
					m("a", {href: "/bar"}, "Bar")
				)
			),
			m("main",
				m("form", {onSubmit: function onSubmit() {}},
					m("input", {type: "checkbox", checked: true}),
					m("input", {type: "checkbox", checked: false}),
					m("fieldset",
						m("label",
							m("input", {type: "radio", checked: true})
						),
						m("label",
							m("input", {type: "radio"})
						)
					),
					m("button-bar",
						m("button",
							{style: "width:10px; height:10px; border:1px solid #FFF;"},
							"Normal CSS"
						),
						m("button",
							{style: "top:0 ; right: 20"},
							"Poor CSS"
						),
						m("button",
							{style: "invalid-prop:1;padding:1px;font:12px/1.1 arial,sans-serif;", icon: true},
							"Poorer CSS"
						),
						m("button",
							{style: {margin: 0, padding: "10px", overflow: "visible"}},
							"Object CSS"
						)
					)
				)
			)
		)
	},
	fn : function() {
		m.render(scratch, this.vdom)
	}
})

suite.add({
	name : "rerender same tree",
	fn : function() {
		m.render(scratch, m("div", {class: "foo bar", "data-foo": "bar", p: 2},
			m("header",
				m("h1", {class: "asdf"}, "a ", "b", " c ", 0, " d"),
				m("nav",
					m("a", {href: "/foo"}, "Foo"),
					m("a", {href: "/bar"}, "Bar")
				)
			),
			m("main",
				m("form", {onSubmit: function onSubmit() {}},
					m("input", {type: "checkbox", checked: true}),
					m("input", {type: "checkbox", checked: false}),
					m("fieldset",
						m("label",
							m("input", {type: "radio", checked: true})
						),
						m("label",
							m("input", {type: "radio"})
						)
					),
					m("button-bar",
						m("button",
							{style: "width:10px; height:10px; border:1px solid #FFF;"},
							"Normal CSS"
						),
						m("button",
							{style: "top:0 ; right: 20"},
							"Poor CSS"
						),
						m("button",
							{style: "invalid-prop:1;padding:1px;font:12px/1.1 arial,sans-serif;", icon: true},
							"Poorer CSS"
						),
						m("button",
							{style: {margin: 0, padding: "10px", overflow: "visible"}},
							"Object CSS"
						)
					)
				)
			)
		))
	}
})

suite.add({
	name : "construct large VDOM tree",

	onStart : function() {
		var fields = []

		for(var i=100; i--;) {
			fields.push((i * 999).toString(36))
		}

		this.fields = fields;
	},

	fn : function () {
		m("div", {class: "foo bar", "data-foo": "bar", p: 2},
			m("header",
				m("h1", {class: "asdf"}, "a ", "b", " c ", 0, " d"),
				m("nav",
					m("a", {href: "/foo"}, "Foo"),
					m("a", {href: "/bar"}, "Bar")
				)
			),
			m("main",
				m("form",
					{onSubmit: function onSubmit() {}},
					m("input", {type: "checkbox", checked: true}),
					m("input", {type: "checkbox"}),
					m("fieldset",
						this.fields.map(function (field) {
							return m("label",
								field,
								":",
								m("input", {placeholder: field})
							)
						})
					),
					m("button-bar",
						m("button",
							{style: "width:10px; height:10px; border:1px solid #FFF;"},
							"Normal CSS"
						),
						m("button",
							{style: "top:0 ; right: 20"},
							"Poor CSS"
						),
						m("button",
							{style: "invalid-prop:1;padding:1px;font:12px/1.1 arial,sans-serif;", icon: true},
							"Poorer CSS"
						),
						m("button",
							{style: {margin: 0, padding: "10px", overflow: "visible"}},
							"Object CSS"
						)
					)
				)
			)
		)
	}
})

suite.add({
	name : "mutate styles/properties",
	// minSamples: 100,
	onStart : function () {
		var counter = 0
		var keyLooper = function (n) { return function (c) { return c % n ? (c + "px") : c } }
		var get = function (obj, i) { return obj[i%obj.length] }
		var classes = ["foo", "foo bar", "", "baz-bat", null, "fooga", null, null, undefined]
		var styles = []
		var multivalue = ["0 1px", "0 0 1px 0", "0", "1px", "20px 10px", "7em 5px", "1px 0 5em 2px"]
		var stylekeys = [
			["left", keyLooper(3)],
			["top", keyLooper(2)],
			["margin", function (c) { return get(multivalue, c).replace("1px", c+"px") }],
			["padding", function (c) { return get(multivalue, c) }],
			["position", function (c) { return c%5 ? c%2 ? "absolute" : "relative" : null }],
			["display", function (c) { return c%10 ? c%2 ? "block" : "inline" : "none" }],
			["color", function (c) { return ("rgba(" + (c%255) + ", " + (255 - c%255) + ", " + (50+c%150) + ", " + (c%50/50) + ")") }],
			["border", function (c) { return c%5 ? ((c%10) + "px " + (c%2?"solid":"dotted") + " " + (stylekeys[6][1](c))) : "" }]
		]
		var i, j, style, conf

		for (i=0; i<1000; i++) {
			style = {}
			for (j=0; j<i%10; j++) {
				conf = get(stylekeys, ++counter)
				style[conf[0]] = conf[1](counter)
			}
			styles[i] = style
		}

		this.count = 0
		this.app = function (index) {
			var last = index + 300
			var vnodes = []
			for (; index < last; index++) vnodes.push(
				m("div.booga",
					{
						class: get(classes, index),
						"data-index": index,
						title: index.toString(36)
					},
					m("input.dooga", {type: "checkbox", checked: index % 3 == 0}),
					m("input", {value: "test " + (Math.floor(index / 4)), disabled: index % 10 ? null : true}),
					m("div", {class: get(classes, index * 11)},
						m("p", {style: get(styles, index)}, "p1"),
						m("p", {style: get(styles, index + 1)}, "p2"),
						m("p", {style: get(styles, index * 2)}, "p3"),
						m("p.zooga", {style: get(styles, index * 3 + 1), className: get(classes, index * 7)}, "p4")
					)
				)
			)
			return vnodes
		}
	},

	fn : function () {
		m.render(scratch, this.app(++this.count))
	}
})

// Shared components for node recyling benchmarks
var Header = {
	view : function () {
		return m("header",
			m("h1", {class: "asdf"}, "a ", "b", " c ", 0, " d"),
			m("nav",
				m("a", {href: "/foo"}, "Foo"),
				m("a", {href: "/bar"}, "Bar")
			)
		)
	}
}

var Form = {
	view : function () {
		return m("form", {onSubmit: function onSubmit() {}},
			m("input", {type: "checkbox", checked: true}),
			m("input", {type: "checkbox", checked: false}),
			m("fieldset",
				m("label",
					m("input", {type: "radio", checked: true})
				),
				m("label",
					m("input", {type: "radio"})
				)
			),
			m(ButtonBar, null)
		)
	}
}

var ButtonBar = {
	view : function () {
		return m("button-bar",
			m(Button,
				{style: "width:10px; height:10px; border:1px solid #FFF;"},
				"Normal CSS"
			),
			m(Button,
				{style: "top:0 ; right: 20"},
				"Poor CSS"
			),
			m(Button,
				{style: "invalid-prop:1;padding:1px;font:12px/1.1 arial,sans-serif;", icon: true},
				"Poorer CSS"
			),
			m(Button,
				{style: {margin: 0, padding: "10px", overflow: "visible"}},
				"Object CSS"
			)
		)
	}
}

var Button = {
	view : function (vnode) {
		return m("button", vnode.attrs, vnode.children)
	}
}

var Main = {
	view : function () {
		return m(Form)
	}
}

var Root = {
	view : function () {
		return m("div",
			{class: "foo bar", "data-foo": "bar", p: 2},
			m(Header, null),
			m(Main, null)
		)
	}
}


suite.add({
	name : "repeated trees",
	fn : function () {
		m.render(scratch, [m(Root)])
		m.render(scratch, [])

		// Second empty render is to clear out the pool of nodes
		// so that there's nothing that can be recycled
		m.render(scratch, [])
	}
})

suite.run({
	async : true
})
