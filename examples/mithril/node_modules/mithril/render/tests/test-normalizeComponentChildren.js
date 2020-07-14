"use strict"

var o = require("../../ospec/ospec")
var m = require("../../render/hyperscript")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("component children", function () {
	var $window = domMock()
	var root = $window.document.createElement("div")
	var render = vdom($window)

	o.spec("component children", function () {
		var component = {
			view: function (vnode) {
				return vnode.children
			}
		}

		var vnode = m(component, "a")

		render(root, vnode)

		o("are not normalized on ingestion", function () {
			o(vnode.children[0]).equals("a")
		})

		o("are normalized upon view interpolation", function () {
			o(vnode.instance.children.length).equals(1)
			o(vnode.instance.children[0].tag).equals("#")
			o(vnode.instance.children[0].children).equals("a")
		})
	})
})
