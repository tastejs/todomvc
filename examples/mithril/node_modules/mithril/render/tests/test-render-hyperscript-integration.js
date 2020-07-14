"use strict"

var o = require("../../ospec/ospec")
var m = require("../../render/hyperscript")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("render/hyperscript integration", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})
	o.spec("setting class", function() {
		o("selector only", function() {
			render(root, m(".foo"))

			o(root.firstChild.className).equals("foo")
		})
		o("class only", function() {
			render(root, m("div", {class: "foo"}))

			o(root.firstChild.className).equals("foo")
		})
		o("className only", function() {
			render(root, m("div", {className: "foo"}))

			o(root.firstChild.className).equals("foo")
		})
		o("selector and class", function() {
			render(root, m(".bar", {class: "foo"}))

			o(root.firstChild.className.split(" ").sort()).deepEquals(["bar", "foo"])
		})
		o("selector and className", function() {
			render(root, m(".bar", {className: "foo"}))

			o(root.firstChild.className.split(" ").sort()).deepEquals(["bar", "foo"])
		})
		o("selector and a null class", function() {
			render(root, m(".foo", {class: null}))

			o(root.firstChild.className).equals("foo")
		})
		o("selector and a null className", function() {
			render(root, m(".foo", {className: null}))

			o(root.firstChild.className).equals("foo")
		})
		o("selector and an undefined class", function() {
			render(root, m(".foo", {class: undefined}))

			o(root.firstChild.className).equals("foo")
		})
		o("selector and an undefined className", function() {
			render(root, m(".foo", {className: undefined}))

			o(root.firstChild.className).equals("foo")
		})
	})
	o.spec("updating class", function() {
		o.spec("from selector only", function() {
			o("to selector only", function() {
				render(root, m(".foo1"))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m(".foo1"))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m(".foo1"))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".foo1"))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".foo1"))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".foo1"))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".foo1"))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".foo1"))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".foo1"))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from class only", function() {
			o("to selector only", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m("div", {class: "foo2"}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from ", function() {
			o("to selector only", function() {
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from className only", function() {
			o("to selector only", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m("div", {className: "foo1"}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from selector and class", function() {
			o("to selector only", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".bar1", {class: "foo1"}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from selector and className", function() {
			o("to selector only", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".bar1", {className: "foo1"}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from  and a null class", function() {
			o("to selector only", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".foo1", {class: null}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from selector and a null className", function() {
			o("to selector only", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".foo1", {className: null}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from selector and an undefined class", function() {
			o("to selector only", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".foo1", {class: undefined}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
		o.spec("from selector and an undefined className", function() {
			o("to selector only", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m(".foo2"))

				o(root.firstChild.className).equals("foo2")
			})
			o("to class only", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m("div", {class: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to className only", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m("div", {className: "foo2"}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and class", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m(".bar2", {class: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and className", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m(".bar2", {className: "foo2"}))

				o(root.firstChild.className.split(" ").sort()).deepEquals(["bar2", "foo2"])
			})
			o("to selector and a null class", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m(".foo2", {class: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and a null className", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m(".foo2", {className: null}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined class", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m(".foo2", {class: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
			o("to selector and an undefined className", function() {
				render(root, m(".foo1", {className: undefined}))
				render(root, m(".foo2", {className: undefined}))

				o(root.firstChild.className).equals("foo2")
			})
		})
	})
})
