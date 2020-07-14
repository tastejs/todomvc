"use strict"

var o = require("../../ospec/ospec")
var components = require("../../test-utils/components")

o.spec("test-utils/components", function() {
	var test = o.spy(function(component) {
		return function() {
			o("works", function() {
				o(typeof component.kind).equals("string")

				var methods = {oninit: function(){}, view: function(){}}

				var cmp1, cmp2

				if (component.kind === "POJO") {
					cmp1 = component.create()
					cmp2 = component.create(methods)
				} else if (component.kind === "constructible") {
					cmp1 = new (component.create())
					cmp2 = new (component.create(methods))
				} else if (component.kind === "closure") {
					cmp1 = component.create()()
					cmp2 = component.create(methods)()
				} else {
					throw new Error("unexpected component kind")
				}

				o(cmp1 != null).equals(true)
				o(typeof cmp1.view).equals("function")

				var vnode = cmp1.view()

				o(vnode != null).equals(true)
				o(vnode).deepEquals({tag: "div"})

				if (component.kind !== "constructible") {
					o(cmp2).deepEquals(methods)
				} else {
					// deepEquals doesn't search the prototype, do it manually
					o(cmp2 != null).equals(true)
					o(cmp2.view).equals(methods.view)
					o(cmp2.oninit).equals(methods.oninit)
				}
			})
		}
	})
	o.after(function(){
		o(test.callCount).equals(3)
	})
	components.forEach(function(component) {
		o.spec(component.kind, test(component))
	})
})
