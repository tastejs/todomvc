"use strict"

var o = require("../../ospec/ospec")
var m = require("../../render/hyperscript")

o.spec("hyperscript", function() {
	o.spec("selector", function() {
		o("throws on null selector", function(done) {
			try {m(null)} catch(e) {done()}
		})
		o("throws on non-string selector w/o a view property", function(done) {
			try {m({})} catch(e) {done()}
		})
		o("handles tag in selector", function() {
			var vnode = m("a")

			o(vnode.tag).equals("a")
		})
		o("class and className normalization", function(){
			o(m("a", {
				class: null
			}).attrs).deepEquals({
				class: null
			})
			o(m("a", {
				class: undefined
			}).attrs).deepEquals({
				class: null
			})
			o(m("a", {
				class: false
			}).attrs).deepEquals({
				class: null,
				className: false
			})
			o(m("a", {
				class: true
			}).attrs).deepEquals({
				class: null,
				className: true
			})
			o(m("a.x", {
				class: null
			}).attrs).deepEquals({
				class: null,
				className: "x"
			})
			o(m("a.x", {
				class: undefined
			}).attrs).deepEquals({
				class: null,
				className: "x"
			})
			o(m("a.x", {
				class: false
			}).attrs).deepEquals({
				class: null,
				className: "x false"
			})
			o(m("a.x", {
				class: true
			}).attrs).deepEquals({
				class: null,
				className: "x true"
			})
			o(m("a", {
				className: null
			}).attrs).deepEquals({
				className: null
			})
			o(m("a", {
				className: undefined
			}).attrs).deepEquals({
				className: undefined
			})
			o(m("a", {
				className: false
			}).attrs).deepEquals({
				className: false
			})
			o(m("a", {
				className: true
			}).attrs).deepEquals({
				className: true
			})
			o(m("a.x", {
				className: null
			}).attrs).deepEquals({
				className: "x"
			})
			o(m("a.x", {
				className: undefined
			}).attrs).deepEquals({
				className: "x"
			})
			o(m("a.x", {
				className: false
			}).attrs).deepEquals({
				className: "x false"
			})
			o(m("a.x", {
				className: true
			}).attrs).deepEquals({
				className: "x true"
			})
		})
		o("handles class in selector", function() {
			var vnode = m(".a")

			o(vnode.tag).equals("div")
			o(vnode.attrs.className).equals("a")
		})
		o("handles many classes in selector", function() {
			var vnode = m(".a.b.c")

			o(vnode.tag).equals("div")
			o(vnode.attrs.className).equals("a b c")
		})
		o("handles id in selector", function() {
			var vnode = m("#a")

			o(vnode.tag).equals("div")
			o(vnode.attrs.id).equals("a")
		})
		o("handles attr in selector", function() {
			var vnode = m("[a=b]")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
		})
		o("handles many attrs in selector", function() {
			var vnode = m("[a=b][c=d]")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
			o(vnode.attrs.c).equals("d")
		})
		o("handles attr w/ spaces in selector", function() {
			var vnode = m("[a = b]")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
		})
		o("handles attr w/ quotes in selector", function() {
			var vnode = m("[a='b']")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
		})
		o("handles attr w/ quoted square bracket", function() {
			var vnode = m("[x][a='[b]'].c")

			o(vnode.tag).equals("div")
			o(vnode.attrs.x).equals(true)
			o(vnode.attrs.a).equals("[b]")
			o(vnode.attrs.className).equals("c")
		})
		o("handles attr w/ unmatched square bracket", function() {
			var vnode = m("[a=']'].c")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("]")
			o(vnode.attrs.className).equals("c")
		})
		o("handles attr w/ quoted square bracket and quote", function() {
			var vnode = m("[a='[b\"\\']'].c") // `[a='[b"\']']`

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("[b\"']") // `[b"']`
			o(vnode.attrs.className).equals("c")
		})
		o("handles attr w/ quoted square containing escaped square bracket", function() {
			var vnode = m("[a='[\\]]'].c") // `[a='[\]]']`

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("[\\]]") // `[\]]`
			o(vnode.attrs.className).equals("c")
		})
		o("handles attr w/ backslashes", function() {
			var vnode = m("[a='\\\\'].c") // `[a='\\']`

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("\\")
			o(vnode.attrs.className).equals("c")
		})
		o("handles attr w/ quotes and spaces in selector", function() {
			var vnode = m("[a = 'b']")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
		})
		o("handles many attr w/ quotes and spaces in selector", function() {
			var vnode = m("[a = 'b'][c = 'd']")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
			o(vnode.attrs.c).equals("d")
		})
		o("handles tag, class, attrs in selector", function() {
			var vnode = m("a.b[c = 'd']")

			o(vnode.tag).equals("a")
			o(vnode.attrs.className).equals("b")
			o(vnode.attrs.c).equals("d")
		})
		o("handles tag, mixed classes, attrs in selector", function() {
			var vnode = m("a.b[c = 'd'].e[f = 'g']")

			o(vnode.tag).equals("a")
			o(vnode.attrs.className).equals("b e")
			o(vnode.attrs.c).equals("d")
			o(vnode.attrs.f).equals("g")
		})
		o("handles attr without value", function() {
			var vnode = m("[a]")

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals(true)
		})
		o("handles explicit empty string value for input", function() {
			var vnode = m('input[value=""]')

			o(vnode.tag).equals("input")
			o(vnode.attrs.value).equals("")
		})
		o("handles explicit empty string value for option", function() {
			var vnode = m('option[value=""]')

			o(vnode.tag).equals("option")
			o(vnode.attrs.value).equals("")
		})
	})
	o.spec("attrs", function() {
		o("handles string attr", function() {
			var vnode = m("div", {a: "b"})

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
		})
		o("handles falsy string attr", function() {
			var vnode = m("div", {a: ""})

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("")
		})
		o("handles number attr", function() {
			var vnode = m("div", {a: 1})

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals(1)
		})
		o("handles falsy number attr", function() {
			var vnode = m("div", {a: 0})

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals(0)
		})
		o("handles boolean attr", function() {
			var vnode = m("div", {a: true})

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals(true)
		})
		o("handles falsy boolean attr", function() {
			var vnode = m("div", {a: false})

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals(false)
		})
		o("handles only key in attrs", function() {
			var vnode = m("div", {key:"a"})

			o(vnode.tag).equals("div")
			o(vnode.attrs).equals(null)
			o(vnode.key).equals("a")
		})
		o("handles many attrs", function() {
			var vnode = m("div", {a: "b", c: "d"})

			o(vnode.tag).equals("div")
			o(vnode.attrs.a).equals("b")
			o(vnode.attrs.c).equals("d")
		})
		o("handles className attrs property", function() {
			var vnode = m("div", {className: "a"})

			o(vnode.attrs.className).equals("a")
		})
		o("handles 'class' as a verbose attribute declaration", function() {
			var vnode = m("[class=a]")

			o(vnode.attrs.className).equals("a")
		})
		o("handles merging classes w/ class property", function() {
			var vnode = m(".a", {class: "b"})

			o(vnode.attrs.className).equals("a b")
		})
		o("handles merging classes w/ className property", function() {
			var vnode = m(".a", {className: "b"})

			o(vnode.attrs.className).equals("a b")
		})
	})
	o.spec("custom element attrs", function() {
		o("handles string attr", function() {
			var vnode = m("custom-element", {a: "b"})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs.a).equals("b")
		})
		o("handles falsy string attr", function() {
			var vnode = m("custom-element", {a: ""})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs.a).equals("")
		})
		o("handles number attr", function() {
			var vnode = m("custom-element", {a: 1})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs.a).equals(1)
		})
		o("handles falsy number attr", function() {
			var vnode = m("custom-element", {a: 0})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs.a).equals(0)
		})
		o("handles boolean attr", function() {
			var vnode = m("custom-element", {a: true})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs.a).equals(true)
		})
		o("handles falsy boolean attr", function() {
			var vnode = m("custom-element", {a: false})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs.a).equals(false)
		})
		o("handles only key in attrs", function() {
			var vnode = m("custom-element", {key:"a"})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs).equals(null)
			o(vnode.key).equals("a")
		})
		o("handles many attrs", function() {
			var vnode = m("custom-element", {a: "b", c: "d"})

			o(vnode.tag).equals("custom-element")
			o(vnode.attrs.a).equals("b")
			o(vnode.attrs.c).equals("d")
		})
		o("handles className attrs property", function() {
			var vnode = m("custom-element", {className: "a"})

			o(vnode.attrs.className).equals("a")
		})
		o("casts className using toString like browsers", function() {
			const className = {
				valueOf: () => ".valueOf",
				toString: () => "toString"
			}
			var vnode = m("custom-element" + className, {className: className})

			o(vnode.attrs.className).equals("valueOf toString")
		})
	})
	o.spec("children", function() {
		o("handles string single child", function() {
			var vnode = m("div", {}, ["a"])

			o(vnode.text).equals("a")
		})
		o("handles falsy string single child", function() {
			var vnode = m("div", {}, [""])

			o(vnode.text).equals("")
		})
		o("handles number single child", function() {
			var vnode = m("div", {}, [1])

			o(vnode.text).equals("1")
		})
		o("handles falsy number single child", function() {
			var vnode = m("div", {}, [0])

			o(vnode.text).equals("0")
		})
		o("handles boolean single child", function() {
			var vnode = m("div", {}, [true])

			o(vnode.children).deepEquals([null])
		})
		o("handles falsy boolean single child", function() {
			var vnode = m("div", {}, [false])

			o(vnode.children).deepEquals([null])
		})
		o("handles null single child", function() {
			var vnode = m("div", {}, [null])

			o(vnode.children).deepEquals([null])
		})
		o("handles undefined single child", function() {
			var vnode = m("div", {}, [undefined])

			o(vnode.children).deepEquals([null])
		})
		o("handles multiple string children", function() {
			var vnode = m("div", {}, ["", "a"])

			o(vnode.children[0].tag).equals("#")
			o(vnode.children[0].children).equals("")
			o(vnode.children[1].tag).equals("#")
			o(vnode.children[1].children).equals("a")
		})
		o("handles multiple number children", function() {
			var vnode = m("div", {}, [0, 1])

			o(vnode.children[0].tag).equals("#")
			o(vnode.children[0].children).equals("0")
			o(vnode.children[1].tag).equals("#")
			o(vnode.children[1].children).equals("1")
		})
		o("handles multiple boolean children", function() {
			var vnode = m("div", {}, [false, true])

			o(vnode.children).deepEquals([null, null])
		})
		o("handles multiple null/undefined child", function() {
			var vnode = m("div", {}, [null, undefined])

			o(vnode.children).deepEquals([null, null])
		})
		o("handles falsy number single child without attrs", function() {
			var vnode = m("div", 0)

			o(vnode.text).equals("0")
		})
	})
	o.spec("permutations", function() {
		o("handles null attr and children", function() {
			var vnode = m("div", null, [m("a"), m("b")])

			o(vnode.children.length).equals(2)
			o(vnode.children[0].tag).equals("a")
			o(vnode.children[1].tag).equals("b")
		})
		o("handles null attr and child unwrapped", function() {
			var vnode = m("div", null, m("a"))

			o(vnode.children.length).equals(1)
			o(vnode.children[0].tag).equals("a")
		})
		o("handles null attr and children unwrapped", function() {
			var vnode = m("div", null, m("a"), m("b"))

			o(vnode.children.length).equals(2)
			o(vnode.children[0].tag).equals("a")
			o(vnode.children[1].tag).equals("b")
		})
		o("handles attr and children", function() {
			var vnode = m("div", {a: "b"}, [m("i"), m("s")])

			o(vnode.attrs.a).equals("b")
			o(vnode.children[0].tag).equals("i")
			o(vnode.children[1].tag).equals("s")
		})
		o("handles attr and child unwrapped", function() {
			var vnode = m("div", {a: "b"}, m("i"))

			o(vnode.attrs.a).equals("b")
			o(vnode.children[0].tag).equals("i")
		})
		o("handles attr and children unwrapped", function() {
			var vnode = m("div", {a: "b"}, m("i"), m("s"))

			o(vnode.attrs.a).equals("b")
			o(vnode.children[0].tag).equals("i")
			o(vnode.children[1].tag).equals("s")
		})
		o("handles attr and text children", function() {
			var vnode = m("div", {a: "b"}, ["c", "d"])

			o(vnode.attrs.a).equals("b")
			o(vnode.children[0].tag).equals("#")
			o(vnode.children[0].children).equals("c")
			o(vnode.children[1].tag).equals("#")
			o(vnode.children[1].children).equals("d")
		})
		o("handles attr and single string text child", function() {
			var vnode = m("div", {a: "b"}, ["c"])

			o(vnode.attrs.a).equals("b")
			o(vnode.text).equals("c")
		})
		o("handles attr and single falsy string text child", function() {
			var vnode = m("div", {a: "b"}, [""])

			o(vnode.attrs.a).equals("b")
			o(vnode.text).equals("")
		})
		o("handles attr and single number text child", function() {
			var vnode = m("div", {a: "b"}, [1])

			o(vnode.attrs.a).equals("b")
			o(vnode.text).equals("1")
		})
		o("handles attr and single falsy number text child", function() {
			var vnode = m("div", {a: "b"}, [0])

			o(vnode.attrs.a).equals("b")
			o(vnode.text).equals("0")
		})
		o("handles attr and single boolean text child", function() {
			var vnode = m("div", {a: "b"}, [true])

			o(vnode.attrs.a).equals("b")
			o(vnode.children).deepEquals([null])
		})
		o("handles attr and single falsy boolean text child", function() {
			var vnode = m("div", {a: "b"}, [0])

			o(vnode.attrs.a).equals("b")
			o(vnode.text).equals("0")
		})
		o("handles attr and single false boolean text child", function() {
			var vnode = m("div", {a: "b"}, [false])

			o(vnode.attrs.a).equals("b")
			o(vnode.children).deepEquals([null])
		})
		o("handles attr and single text child unwrapped", function() {
			var vnode = m("div", {a: "b"}, "c")

			o(vnode.attrs.a).equals("b")
			o(vnode.text).equals("c")
		})
		o("handles attr and text children unwrapped", function() {
			var vnode = m("div", {a: "b"}, "c", "d")

			o(vnode.attrs.a).equals("b")
			o(vnode.children[0].tag).equals("#")
			o(vnode.children[0].children).equals("c")
			o(vnode.children[1].tag).equals("#")
			o(vnode.children[1].children).equals("d")
		})
		o("handles children without attr", function() {
			var vnode = m("div", [m("i"), m("s")])

			o(vnode.attrs).equals(null)
			o(vnode.children[0].tag).equals("i")
			o(vnode.children[1].tag).equals("s")
		})
		o("handles child without attr unwrapped", function() {
			var vnode = m("div", m("i"))

			o(vnode.attrs).equals(null)
			o(vnode.children[0].tag).equals("i")
		})
		o("handles children without attr unwrapped", function() {
			var vnode = m("div", m("i"), m("s"))

			o(vnode.attrs).equals(null)
			o(vnode.children[0].tag).equals("i")
			o(vnode.children[1].tag).equals("s")
		})
		o("handles shared attrs", function() {
			var attrs = {a: "b"}

			var nodeA = m(".a", attrs)
			var nodeB = m(".b", attrs)

			o(nodeA.attrs.className).equals("a")
			o(nodeA.attrs.a).equals("b")

			o(nodeB.attrs.className).equals("b")
			o(nodeB.attrs.a).equals("b")
		})
		o("doesnt modify passed attributes object", function() {
			var attrs = {a: "b"}
			m(".a", attrs)
			o(attrs).deepEquals({a: "b"})
		})
		o("non-nullish attr takes precedence over selector", function() {
			o(m("[a=b]", {a: "c"}).attrs).deepEquals({a: "c"})
		})
		o("null attr takes precedence over selector", function() {
			o(m("[a=b]", {a: null}).attrs).deepEquals({a: null})
		})
		o("undefined attr takes precedence over selector", function() {
			o(m("[a=b]", {a: undefined}).attrs).deepEquals({a: undefined})
		})
		o("handles fragment children without attr unwrapped", function() {
			var vnode = m("div", [m("i")], [m("s")])

			o(vnode.children[0].tag).equals("[")
			o(vnode.children[0].children[0].tag).equals("i")
			o(vnode.children[1].tag).equals("[")
			o(vnode.children[1].children[0].tag).equals("s")
		})
		o("handles children with nested array", function() {
			var vnode = m("div", [[m("i"), m("s")]])

			o(vnode.children[0].tag).equals("[")
			o(vnode.children[0].children[0].tag).equals("i")
			o(vnode.children[0].children[1].tag).equals("s")
		})
		o("handles children with deeply nested array", function() {
			var vnode = m("div", [[[m("i"), m("s")]]])

			o(vnode.children[0].tag).equals("[")
			o(vnode.children[0].children[0].tag).equals("[")
			o(vnode.children[0].children[0].children[0].tag).equals("i")
			o(vnode.children[0].children[0].children[1].tag).equals("s")
		})
	})
	o.spec("components", function() {
		o("works with POJOs", function() {
			var component = {
				view: function() {}
			}
			var vnode = m(component, {id: "a"}, "b")

			o(vnode.tag).equals(component)
			o(vnode.attrs.id).equals("a")
			o(vnode.children.length).equals(1)
			o(vnode.children[0]).equals("b")
		})
		o("works with constructibles", function() {
			var component = o.spy()
			component.prototype.view = function() {}

			var vnode = m(component, {id: "a"}, "b")

			o(component.callCount).equals(0)

			o(vnode.tag).equals(component)
			o(vnode.attrs.id).equals("a")
			o(vnode.children.length).equals(1)
			o(vnode.children[0]).equals("b")
		})
		o("works with closures", function () {
			var component = o.spy()

			var vnode = m(component, {id: "a"}, "b")

			o(component.callCount).equals(0)

			o(vnode.tag).equals(component)
			o(vnode.attrs.id).equals("a")
			o(vnode.children.length).equals(1)
			o(vnode.children[0]).equals("b")
		})
	})
})
