"use strict"

var o = require("../../ospec/ospec")
var fragment = require("../../render/fragment")
var m = require("../../render/hyperscript")

function fragmentStr() {
	var args = [].slice.call(arguments);
	args.unshift("[");
	return m.apply(null, args)
}

function runTest(name, fragment) {
	o.spec(name, function() {
		o("works", function() {
			var attrs = {foo: 5}
			var child = {tag: "p"}
			var frag = fragment(attrs, [child])

			o(frag.tag).equals("[")

			o(Array.isArray(frag.children)).equals(true)
			o(frag.children.length).equals(1)
			o(frag.children[0]).equals(child)

			o(frag.attrs).equals(attrs)

			o(frag.key).equals(undefined)
		})
		o("supports keys", function() {
			var attrs = {key: 7}
			var frag = fragment(attrs, [])
			o(frag.tag).equals("[")

			o(Array.isArray(frag.children)).equals(true)
			o(frag.children.length).equals(0)

			o(frag.attrs).equals(attrs)
			o(frag.attrs.key).equals(7)

			o(frag.key).equals(7)
		})
		o.spec("children with no attrs", function() {
			o("handles string single child", function() {
				var vnode = fragment(["a"])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("a")
			})
			o("handles falsy string single child", function() {
				var vnode = fragment([""])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("")
			})
			o("handles number single child", function() {
				var vnode = fragment([1])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("1")
			})
			o("handles falsy number single child", function() {
				var vnode = fragment([0])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("0")
			})
			o("handles boolean single child", function() {
				var vnode = fragment([true])

				o(vnode.children).deepEquals([null])
			})
			o("handles falsy boolean single child", function() {
				var vnode = fragment([false])

				o(vnode.children).deepEquals([null])
			})
			o("handles null single child", function() {
				var vnode = fragment([null])

				o(vnode.children[0]).equals(null)
			})
			o("handles undefined single child", function() {
				var vnode = fragment([undefined])

				o(vnode.children).deepEquals([null])
			})
			o("handles multiple string children", function() {
				var vnode = fragment(["", "a"])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("")
				o(vnode.children[1].tag).equals("#")
				o(vnode.children[1].children).equals("a")
			})
			o("handles multiple number children", function() {
				var vnode = fragment([0, 1])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("0")
				o(vnode.children[1].tag).equals("#")
				o(vnode.children[1].children).equals("1")
			})
			o("handles multiple boolean children", function() {
				var vnode = fragment([false, true])

				o(vnode.children).deepEquals([null, null])
			})
			o("handles multiple null/undefined child", function() {
				var vnode = fragment([null, undefined])

				o(vnode.children).deepEquals([null, null])
			})
			o("handles falsy number single child without attrs", function() {
				var vnode = fragment(0)

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("0")
			})
		})
		o.spec("children with attrs", function() {
			o("handles string single child", function() {
				var vnode = fragment({}, ["a"])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("a")
			})
			o("handles falsy string single child", function() {
				var vnode = fragment({}, [""])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("")
			})
			o("handles number single child", function() {
				var vnode = fragment({}, [1])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("1")
			})
			o("handles falsy number single child", function() {
				var vnode = fragment({}, [0])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("0")
			})
			o("handles boolean single child", function() {
				var vnode = fragment({}, [true])

				o(vnode.children).deepEquals([null])
			})
			o("handles falsy boolean single child", function() {
				var vnode = fragment({}, [false])

				o(vnode.children).deepEquals([null])
			})
			o("handles null single child", function() {
				var vnode = fragment({}, [null])

				o(vnode.children).deepEquals([null])
			})
			o("handles undefined single child", function() {
				var vnode = fragment({}, [undefined])

				o(vnode.children).deepEquals([null])
			})
			o("handles multiple string children", function() {
				var vnode = fragment({}, ["", "a"])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("")
				o(vnode.children[1].tag).equals("#")
				o(vnode.children[1].children).equals("a")
			})
			o("handles multiple number children", function() {
				var vnode = fragment({}, [0, 1])

				o(vnode.children[0].tag).equals("#")
				o(vnode.children[0].children).equals("0")
				o(vnode.children[1].tag).equals("#")
				o(vnode.children[1].children).equals("1")
			})
			o("handles multiple boolean children", function() {
				var vnode = fragment({}, [false, true])

				o(vnode.children).deepEquals([null, null])
			})
			o("handles multiple null/undefined child", function() {
				var vnode = fragment({}, [null, undefined])

				o(vnode.children).deepEquals([null, null])
			})
		})
	})
}

runTest("fragment", fragment);
runTest("fragment-string-selector", fragmentStr);
