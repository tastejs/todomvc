"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")

o.spec("domMock", function() {
	var $document, $window
	o.beforeEach(function() {
		$window = domMock()
		$document = $window.document
	})

	o.spec("createElement", function() {
		o("works", function() {
			var node = $document.createElement("div")

			o(node.nodeType).equals(1)
			o(node.nodeName).equals("DIV")
			o(node.namespaceURI).equals("http://www.w3.org/1999/xhtml")
			o(node.parentNode).equals(null)
			o(node.childNodes.length).equals(0)
			o(node.firstChild).equals(null)
			o(node.nextSibling).equals(null)
		})
	})

	o.spec("createElementNS", function() {
		o("works", function() {
			var node = $document.createElementNS("http://www.w3.org/2000/svg", "svg")

			o(node.nodeType).equals(1)
			o(node.nodeName).equals("svg")
			o(node.namespaceURI).equals("http://www.w3.org/2000/svg")
			o(node.parentNode).equals(null)
			o(node.childNodes.length).equals(0)
			o(node.firstChild).equals(null)
			o(node.nextSibling).equals(null)
		})
	})

	o.spec("createTextNode", function() {
		o("works", function() {
			var node = $document.createTextNode("abc")

			o(node.nodeType).equals(3)
			o(node.nodeName).equals("#text")
			o(node.parentNode).equals(null)
			o(node.nodeValue).equals("abc")
		})
		o("works w/ number", function() {
			var node = $document.createTextNode(123)

			o(node.nodeValue).equals("123")
		})
		o("works w/ null", function() {
			var node = $document.createTextNode(null)

			o(node.nodeValue).equals("null")
		})
		o("works w/ undefined", function() {
			var node = $document.createTextNode(undefined)

			o(node.nodeValue).equals("undefined")
		})
		o("works w/ object", function() {
			var node = $document.createTextNode({})

			o(node.nodeValue).equals("[object Object]")
		})
		o("does not unescape HTML", function() {
			var node = $document.createTextNode("<a>&amp;</a>")

			o(node.nodeValue).equals("<a>&amp;</a>")
		})
		o("nodeValue casts to string", function() {
			var node = $document.createTextNode("a")
			node.nodeValue = true

			o(node.nodeValue).equals("true")
		})
		if (typeof Symbol === "function") {
			o("doesn't work with symbols", function(){
				var threw = false
				try {
					$document.createTextNode(Symbol("nono"))
				} catch(e) {
					threw = true
				}
				o(threw).equals(true)
			})
			o("symbols can't be used as nodeValue", function(){
				var threw = false
				try {
					var node = $document.createTextNode("a")
					node.nodeValue = Symbol("nono")
				} catch(e) {
					threw = true
				}
				o(threw).equals(true)
			})
		}
	})

	o.spec("createDocumentFragment", function() {
		o("works", function() {
			var node = $document.createDocumentFragment()

			o(node.nodeType).equals(11)
			o(node.nodeName).equals("#document-fragment")
			o(node.parentNode).equals(null)
			o(node.childNodes.length).equals(0)
			o(node.firstChild).equals(null)
		})
	})

	o.spec("appendChild", function() {
		o("works", function() {
			var parent = $document.createElement("div")
			var child = $document.createElement("a")
			parent.appendChild(child)

			o(parent.childNodes.length).equals(1)
			o(parent.childNodes[0]).equals(child)
			o(parent.firstChild).equals(child)
			o(child.parentNode).equals(parent)
		})
		o("moves existing", function() {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			parent.appendChild(a)
			parent.appendChild(b)
			parent.appendChild(a)

			o(parent.childNodes.length).equals(2)
			o(parent.childNodes[0]).equals(b)
			o(parent.childNodes[1]).equals(a)
			o(parent.firstChild).equals(b)
			o(parent.firstChild.nextSibling).equals(a)
			o(a.parentNode).equals(parent)
			o(b.parentNode).equals(parent)
		})
		o("removes from old parent", function() {
			var parent = $document.createElement("div")
			var source = $document.createElement("span")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			parent.appendChild(a)
			source.appendChild(b)
			parent.appendChild(b)

			o(source.childNodes.length).equals(0)
		})
		o("transfers from fragment", function() {
			var parent = $document.createElement("div")
			var a = $document.createDocumentFragment("a")
			var b = $document.createElement("b")
			var c = $document.createElement("c")
			a.appendChild(b)
			a.appendChild(c)
			parent.appendChild(a)

			o(parent.childNodes.length).equals(2)
			o(parent.childNodes[0]).equals(b)
			o(parent.childNodes[1]).equals(c)
			o(parent.firstChild).equals(b)
			o(parent.firstChild.nextSibling).equals(c)
			o(a.childNodes.length).equals(0)
			o(a.firstChild).equals(null)
			o(a.parentNode).equals(null)
			o(b.parentNode).equals(parent)
			o(c.parentNode).equals(parent)
		})
		o("throws if appended to self", function(done) {
			var div = $document.createElement("div")
			try {div.appendChild(div)}
			catch (e) {done()}
		})
		o("throws if appended to child", function(done) {
			var parent = $document.createElement("div")
			var child = $document.createElement("a")
			parent.appendChild(child)
			try {child.appendChild(parent)}
			catch (e) {done()}
		})
		o("throws if child is not element", function(done) {
			var parent = $document.createElement("div")
			var child = 1
			try {parent.appendChild(child)}
			catch (e) {done()}
		})
	})

	o.spec("removeChild", function() {
		o("works", function() {
			var parent = $document.createElement("div")
			var child = $document.createElement("a")
			parent.appendChild(child)
			parent.removeChild(child)

			o(parent.childNodes.length).equals(0)
			o(parent.firstChild).equals(null)
			o(child.parentNode).equals(null)
		})
		o("throws if not a child", function(done) {
			var parent = $document.createElement("div")
			var child = $document.createElement("a")
			try {parent.removeChild(child)}
			catch (e) {done()}
		})
	})

	o.spec("insertBefore", function() {
		o("works", function() {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			parent.appendChild(a)
			parent.insertBefore(b, a)

			o(parent.childNodes.length).equals(2)
			o(parent.childNodes[0]).equals(b)
			o(parent.childNodes[1]).equals(a)
			o(parent.firstChild).equals(b)
			o(parent.firstChild.nextSibling).equals(a)
			o(a.parentNode).equals(parent)
			o(b.parentNode).equals(parent)
		})
		o("moves existing", function() {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			parent.appendChild(a)
			parent.appendChild(b)
			parent.insertBefore(b, a)

			o(parent.childNodes.length).equals(2)
			o(parent.childNodes[0]).equals(b)
			o(parent.childNodes[1]).equals(a)
			o(parent.firstChild).equals(b)
			o(parent.firstChild.nextSibling).equals(a)
			o(a.parentNode).equals(parent)
			o(b.parentNode).equals(parent)
		})
		o("moves existing node forward but not at the end", function() {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			var c = $document.createElement("c")
			parent.appendChild(a)
			parent.appendChild(b)
			parent.appendChild(c)
			parent.insertBefore(a, c)

			o(parent.childNodes.length).equals(3)
			o(parent.childNodes[0]).equals(b)
			o(parent.childNodes[1]).equals(a)
			o(parent.childNodes[2]).equals(c)
			o(parent.firstChild).equals(b)
			o(parent.firstChild.nextSibling).equals(a)
			o(parent.firstChild.nextSibling.nextSibling).equals(c)
			o(a.parentNode).equals(parent)
			o(b.parentNode).equals(parent)
			o(c.parentNode).equals(parent)

		})
		o("removes from old parent", function() {
			var parent = $document.createElement("div")
			var source = $document.createElement("span")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			parent.appendChild(a)
			source.appendChild(b)
			parent.insertBefore(b, a)

			o(source.childNodes.length).equals(0)
		})
		o("transfers from fragment", function() {
			var parent = $document.createElement("div")
			var ref = $document.createElement("span")
			var a = $document.createDocumentFragment("a")
			var b = $document.createElement("b")
			var c = $document.createElement("c")
			parent.appendChild(ref)
			a.appendChild(b)
			a.appendChild(c)
			parent.insertBefore(a, ref)

			o(parent.childNodes.length).equals(3)
			o(parent.childNodes[0]).equals(b)
			o(parent.childNodes[1]).equals(c)
			o(parent.childNodes[2]).equals(ref)
			o(parent.firstChild).equals(b)
			o(parent.firstChild.nextSibling).equals(c)
			o(parent.firstChild.nextSibling.nextSibling).equals(ref)
			o(a.childNodes.length).equals(0)
			o(a.firstChild).equals(null)
			o(a.parentNode).equals(null)
			o(b.parentNode).equals(parent)
			o(c.parentNode).equals(parent)
		})
		o("appends if second arg is null", function() {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			parent.appendChild(a)
			parent.insertBefore(b, null)

			o(parent.childNodes.length).equals(2)
			o(parent.childNodes[0]).equals(a)
			o(parent.childNodes[1]).equals(b)
			o(parent.firstChild).equals(a)
			o(parent.firstChild.nextSibling).equals(b)
			o(a.parentNode).equals(parent)
		})
		o("throws if appended to self", function(done) {
			var div = $document.createElement("div")
			var a = $document.createElement("a")
			div.appendChild(a)
			try {div.isnertBefore(div, a)}
			catch (e) {done()}
		})
		o("throws if appended to child", function(done) {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			parent.appendChild(a)
			a.appendChild(b)
			try {a.insertBefore(parent, b)}
			catch (e) {done()}
		})
		o("throws if child is not element", function(done) {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			parent.appendChild(a)
			try {parent.insertBefore(1, a)}
			catch (e) {done()}
		})
		o("throws if inserted before itself", function(done) {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			try {parent.insertBefore(a, a)}
			catch (e) {done()}
		})
		o("throws if second arg is undefined", function(done) {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			try {parent.insertBefore(a)}
			catch (e) {done()}
		})
		o("throws if reference is not child", function(done) {
			var parent = $document.createElement("div")
			var a = $document.createElement("a")
			var b = $document.createElement("b")
			try {parent.insertBefore(a, b)}
			catch (e) {done()}
		})
	})

	o.spec("getAttribute", function() {
		o("works", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", "aaa")

			o(div.getAttribute("id")).equals("aaa")
		})
		o("works for attributes with a namespace", function() {
			var div = $document.createElement("div")
			div.setAttributeNS("http://www.w3.org/1999/xlink", "href", "aaa")

			o(div.getAttribute("href")).equals("aaa")
		})
	})

	o.spec("setAttribute", function() {
		o("works", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", "aaa")

			o(div.attributes["id"].value).equals("aaa")
			o(div.attributes["id"].nodeValue).equals("aaa")
			o(div.attributes["id"].namespaceURI).equals(null)
		})
		o("works w/ number", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", 123)

			o(div.attributes["id"].value).equals("123")
		})
		o("works w/ null", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", null)

			o(div.attributes["id"].value).equals("null")
		})
		o("works w/ undefined", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", undefined)

			o(div.attributes["id"].value).equals("undefined")
		})
		o("works w/ object", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", {})

			o(div.attributes["id"].value).equals("[object Object]")
		})
		o("setting via attributes map stringifies", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", "a")
			div.attributes["id"].value = 123

			o(div.attributes["id"].value).equals("123")

			div.attributes["id"].nodeValue = 456

			o(div.attributes["id"].value).equals("456")
		})
	})
	o.spec("hasAttribute", function() {
		o("works", function() {
			var div = $document.createElement("div")

			o(div.hasAttribute("id")).equals(false)

			div.setAttribute("id", "aaa")

			o(div.hasAttribute("id")).equals(true)

			div.removeAttribute("id")

			o(div.hasAttribute("id")).equals(false)
		})
	})

	o.spec("setAttributeNS", function() {
		o("works", function() {
			var a = $document.createElementNS("http://www.w3.org/2000/svg", "a")
			a.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/aaa")

			o(a.href).deepEquals({baseVal: "/aaa", animVal: "/aaa"})
			o(a.attributes["href"].value).equals("/aaa")
			o(a.attributes["href"].namespaceURI).equals("http://www.w3.org/1999/xlink")
		})
		o("works w/ number", function() {
			var a = $document.createElementNS("http://www.w3.org/2000/svg", "a")
			a.setAttributeNS("http://www.w3.org/1999/xlink", "href", 123)

			o(a.href).deepEquals({baseVal: "123", animVal: "123"})
			o(a.attributes["href"].value).equals("123")
			o(a.attributes["href"].namespaceURI).equals("http://www.w3.org/1999/xlink")
		})
		o("attributes with a namespace can be querried, updated and removed with non-NS functions", function() {
			var a = $document.createElementNS("http://www.w3.org/2000/svg", "a")
			a.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/aaa")

			o(a.hasAttribute("href")).equals(true)
			o(a.getAttribute("href")).equals("/aaa")

			a.setAttribute("href", "/bbb")

			o(a.href).deepEquals({baseVal: "/bbb", animVal: "/bbb"})
			o(a.getAttribute("href")).equals("/bbb")
			o(a.attributes["href"].value).equals("/bbb")
			o(a.attributes["href"].namespaceURI).equals("http://www.w3.org/1999/xlink")

			a.removeAttribute("href")

			o(a.hasAttribute("href")).equals(false)
			o(a.getAttribute("href")).equals(null)
			o("href" in a.attributes).equals(false)
		})
	})

	o.spec("removeAttribute", function() {
		o("works", function() {
			var div = $document.createElement("div")
			div.setAttribute("id", "aaa")
			div.removeAttribute("id")

			o("id" in div.attributes).equals(false)
		})
	})

	o.spec("textContent", function() {
		o("works", function() {
			var div = $document.createElement("div")
			div.textContent = "aaa"

			o(div.childNodes.length).equals(1)
			o(div.firstChild.nodeType).equals(3)
			o(div.firstChild.nodeValue).equals("aaa")
		})
		o("works with empty string", function() {
			var div = $document.createElement("div")
			div.textContent = ""

			o(div.childNodes.length).equals(0)
		})
	})

	o.spec("innerHTML", function() {
		o("works", function() {
			var div = $document.createElement("div")
			div.innerHTML = "<br /><a class='aaa' id='xyz'>123<b class=\"bbb\"></b>234<br class=ccc>345</a>"
			o(div.childNodes.length).equals(2)
			o(div.childNodes[0].nodeType).equals(1)
			o(div.childNodes[0].nodeName).equals("BR")
			o(div.childNodes[1].nodeType).equals(1)
			o(div.childNodes[1].nodeName).equals("A")
			o(div.childNodes[1].attributes["class"].value).equals("aaa")
			o(div.childNodes[1].attributes["id"].value).equals("xyz")
			o(div.childNodes[1].childNodes[0].nodeType).equals(3)
			o(div.childNodes[1].childNodes[0].nodeValue).equals("123")
			o(div.childNodes[1].childNodes[1].nodeType).equals(1)
			o(div.childNodes[1].childNodes[1].nodeName).equals("B")
			o(div.childNodes[1].childNodes[1].attributes["class"].value).equals("bbb")
			o(div.childNodes[1].childNodes[2].nodeType).equals(3)
			o(div.childNodes[1].childNodes[2].nodeValue).equals("234")
			o(div.childNodes[1].childNodes[3].nodeType).equals(1)
			o(div.childNodes[1].childNodes[3].nodeName).equals("BR")
			o(div.childNodes[1].childNodes[3].attributes["class"].value).equals("ccc")
			o(div.childNodes[1].childNodes[4].nodeType).equals(3)
			o(div.childNodes[1].childNodes[4].nodeValue).equals("345")
		})
		o("headers work", function() {
			var div = $document.createElement("div")
			div.innerHTML = "<h1></h1><h2></h2><h3></h3><h4></h4><h5></h5><h6></h6>"
			o(div.childNodes.length).equals(6)
			o(div.childNodes[0].nodeType).equals(1)
			o(div.childNodes[0].nodeName).equals("H1")
			o(div.childNodes[1].nodeType).equals(1)
			o(div.childNodes[1].nodeName).equals("H2")
			o(div.childNodes[2].nodeType).equals(1)
			o(div.childNodes[2].nodeName).equals("H3")
			o(div.childNodes[3].nodeType).equals(1)
			o(div.childNodes[3].nodeName).equals("H4")
			o(div.childNodes[4].nodeType).equals(1)
			o(div.childNodes[4].nodeName).equals("H5")
			o(div.childNodes[5].nodeType).equals(1)
			o(div.childNodes[5].nodeName).equals("H6")
		})
		o("detaches old elements", function() {
			var div = $document.createElement("div")
			var a = $document.createElement("a")
			div.appendChild(a)
			div.innerHTML = "<b></b>"

			o(a.parentNode).equals(null)
		})
		o("empty SVG document", function() {
			var div = $document.createElement("div")
			div.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"

			o(typeof div.firstChild).notEquals(undefined)
			o(div.firstChild.nodeName).equals("svg")
			o(div.firstChild.namespaceURI).equals("http://www.w3.org/2000/svg")
			o(div.firstChild.childNodes.length).equals(0)
		})
		o("text elements", function() {
			var div = $document.createElement("div")
			div.innerHTML =
				"<svg xmlns=\"http://www.w3.org/2000/svg\">"
					+ "<text>hello</text>"
					+ "<text> </text>"
					+ "<text>world</text>"
				+ "</svg>"

			o(div.firstChild.nodeName).equals("svg")
			o(div.firstChild.namespaceURI).equals("http://www.w3.org/2000/svg")

			var nodes = div.firstChild.childNodes
			o(nodes.length).equals(3)
			o(nodes[0].nodeName).equals("text")
			o(nodes[0].namespaceURI).equals("http://www.w3.org/2000/svg")
			o(nodes[0].childNodes.length).equals(1)
			o(nodes[0].childNodes[0].nodeName).equals("#text")
			o(nodes[0].childNodes[0].nodeValue).equals("hello")
			o(nodes[1].nodeName).equals("text")
			o(nodes[1].namespaceURI).equals("http://www.w3.org/2000/svg")
			o(nodes[1].childNodes.length).equals(1)
			o(nodes[1].childNodes[0].nodeName).equals("#text")
			o(nodes[1].childNodes[0].nodeValue).equals(" ")
			o(nodes[2].nodeName).equals("text")
			o(nodes[2].namespaceURI).equals("http://www.w3.org/2000/svg")
			o(nodes[2].childNodes.length).equals(1)
			o(nodes[2].childNodes[0].nodeName).equals("#text")
			o(nodes[2].childNodes[0].nodeValue).equals("world")
		})
	})
	o.spec("focus", function() {
		o("body is active by default", function() {
			o($document.documentElement.nodeName).equals("HTML")
			o($document.body.nodeName).equals("BODY")
			o($document.documentElement.firstChild.nodeName).equals("HEAD")
			o($document.documentElement).equals($document.body.parentNode)
			o($document.activeElement).equals($document.body)
		})
		o("focus changes activeElement", function() {
			var input = $document.createElement("input")
			$document.body.appendChild(input)
			input.focus()

			o($document.activeElement).equals(input)

			$document.body.removeChild(input)
		})
	})
	o.spec("style", function() {
		o("has style property", function() {
			var div = $document.createElement("div")

			o(typeof div.style).equals("object")
		})
		o("setting style.cssText string works", function() {
			var div = $document.createElement("div")
			div.style.cssText = "background-color: red; border-bottom: 1px solid red;"

			o(div.style.backgroundColor).equals("red")
			o(div.style.borderBottom).equals("1px solid red")
			o(div.attributes.style.value).equals("background-color: red; border-bottom: 1px solid red;")
		})
		o("removing via setting style.cssText string works", function() {
			var div = $document.createElement("div")
			div.style.cssText = "background: red;"
			div.style.cssText = ""

			o(div.style.background).equals("")
			o(div.attributes.style.value).equals("")
		})
		o("the final semicolon is optional when setting style.cssText", function() {
			var div = $document.createElement("div")
			div.style.cssText = "background: red"

			o(div.style.background).equals("red")
			o(div.style.cssText).equals("background: red;")
			o(div.attributes.style.value).equals("background: red;")
		})
		o("'cssText' as a property name is ignored when setting style.cssText", function(){
			var div = $document.createElement("div")
			div.style.cssText = "cssText: red;"

			o(div.style.cssText).equals("")
		})
		o("setting style.cssText that has a semi-colon in a strings", function(){
			var div = $document.createElement("div")
			div.style.cssText = "background: url(';'); font-family: \";\""

			o(div.style.background).equals("url(';')")
			o(div.style.fontFamily).equals('";"')
			o(div.style.cssText).equals("background: url(';'); font-family: \";\";")
		})
		o("comments in style.cssText are stripped", function(){
			var div = $document.createElement("div")
			div.style.cssText = "/**/background/*:*/: /*>;)*/red/**/;/**/"

			o(div.style.background).equals("red")
			o(div.style.cssText).equals("background: red;")

		})
		o("comments in strings in style.cssText are preserved", function(){
			var div = $document.createElement("div")
			div.style.cssText = "background: url('/*foo*/')"

			o(div.style.background).equals("url('/*foo*/')")

		})
		o("setting style throws", function () {
			var div = $document.createElement("div")
			var err = false
			try {
				div.style = ""
			} catch (e) {
				err = e
			}

			o(err instanceof Error).equals(true)
		})
	})
	o.spec("events", function() {
		o.spec("click", function() {
			var spy, div, e
			o.beforeEach(function() {
				spy = o.spy()
				div = $document.createElement("div")
				e = $document.createEvent("MouseEvents")
				e.initEvent("click", true, true)

				$document.body.appendChild(div)
			})
			o.afterEach(function() {
				$document.body.removeChild(div)
			})

			o("has onclick", function() {
				o("onclick" in div).equals(true)
			})
			o("addEventListener works", function() {
				div.addEventListener("click", spy, false)
				div.dispatchEvent(e)

				o(spy.callCount).equals(1)
				o(spy.this).equals(div)
				o(spy.args[0].type).equals("click")
				o(spy.args[0].target).equals(div)
			})
			o("removeEventListener works (bubbling phase)", function() {
				div.addEventListener("click", spy, false)
				div.removeEventListener("click", spy, false)
				div.dispatchEvent(e)

				o(spy.callCount).equals(0)
			})
			o("removeEventListener works (capture phase)", function() {
				div.addEventListener("click", spy, true)
				div.removeEventListener("click", spy, true)
				div.dispatchEvent(e)

				o(spy.callCount).equals(0)
			})
			o("removeEventListener is selective (bubbling phase)", function() {
				var other = o.spy()
				div.addEventListener("click", spy, false)
				div.addEventListener("click", other, false)
				div.removeEventListener("click", spy, false)
				div.dispatchEvent(e)

				o(spy.callCount).equals(0)
				o(other.callCount).equals(1)
			})
			o("removeEventListener is selective (capture phase)", function() {
				var other = o.spy()
				div.addEventListener("click", spy, true)
				div.addEventListener("click", other, true)
				div.removeEventListener("click", spy, true)
				div.dispatchEvent(e)

				o(spy.callCount).equals(0)
				o(other.callCount).equals(1)
			})
			o("removeEventListener only removes the handler related to a given phase (1/2)", function() {
				spy = o.spy(function(e) {o(e.eventPhase).equals(3)})
				$document.body.addEventListener("click", spy, true)
				$document.body.addEventListener("click", spy, false)
				$document.body.removeEventListener("click", spy, true)
				div.dispatchEvent(e)

				o(spy.callCount).equals(1)
			})
			o("removeEventListener only removes the handler related to a given phase (2/2)", function() {
				spy = o.spy(function(e) {o(e.eventPhase).equals(1)})
				$document.body.addEventListener("click", spy, true)
				$document.body.addEventListener("click", spy, false)
				$document.body.removeEventListener("click", spy, false)
				div.dispatchEvent(e)

				o(spy.callCount).equals(1)
			})
			o("click fires onclick", function() {
				div.onclick = spy
				div.dispatchEvent(e)

				o(spy.callCount).equals(1)
				o(spy.this).equals(div)
				o(spy.args[0].type).equals("click")
				o(spy.args[0].target).equals(div)
			})
			o("click without onclick doesn't throw", function(done) {
				div.dispatchEvent(e)
				done()
			})
		})
		o.spec("transitionend", function() {
			var spy, div, e
			o.beforeEach(function() {
				spy = o.spy()
				div = $document.createElement("div")
				e = $document.createEvent("HTMLEvents")
				e.initEvent("transitionend", true, true)

				$document.body.appendChild(div)
			})
			o.afterEach(function() {
				$document.body.removeChild(div)
			})

			o("ontransitionend does not fire", function(done) {
				div.ontransitionend = spy
				div.dispatchEvent(e)

				o(spy.callCount).equals(0)
				done()
			})
		})
		o.spec("capture and bubbling phases", function() {
			var div, e
			o.beforeEach(function() {
				div = $document.createElement("div")
				e = $document.createEvent("MouseEvents")
				e.initEvent("click", true, true)

				$document.body.appendChild(div)
			})
			o.afterEach(function() {
				$document.body.removeChild(div)
			})
			o("capture and bubbling events both fire on the target in the order they were defined, regardless of the phase", function () {
				var sequence = []
				var capture = o.spy(function(ev){
					sequence.push("capture")

					o(ev).equals(e)
					o(ev.eventPhase).equals(2)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals(div)
				})
				var bubble = o.spy(function(ev){
					sequence.push("bubble")

					o(ev).equals(e)
					o(ev.eventPhase).equals(2)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals(div)
				})

				div.addEventListener("click", bubble, false)
				div.addEventListener("click", capture, true)
				div.dispatchEvent(e)

				o(capture.callCount).equals(1)
				o(bubble.callCount).equals(1)
				o(sequence).deepEquals(["bubble", "capture"])
			})
			o("capture and bubbling events both fire on the parent", function () {
				var sequence = []
				var capture = o.spy(function(ev){
					sequence.push("capture")

					o(ev).equals(e)
					o(ev.eventPhase).equals(1)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals($document.body)
				})
				var bubble = o.spy(function(ev){
					sequence.push("bubble")

					o(ev).equals(e)
					o(ev.eventPhase).equals(3)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals($document.body)
				})

				$document.body.addEventListener("click", bubble, false)
				$document.body.addEventListener("click", capture, true)
				div.dispatchEvent(e)

				o(capture.callCount).equals(1)
				o(bubble.callCount).equals(1)
				o(sequence).deepEquals(["capture", "bubble"])
			})
			o("useCapture defaults to false", function () {
				var sequence = []
				var parent = o.spy(function(ev){
					sequence.push("parent")

					o(ev).equals(e)
					o(ev.eventPhase).equals(3)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals($document.body)
				})
				var target = o.spy(function(ev){
					sequence.push("target")

					o(ev).equals(e)
					o(ev.eventPhase).equals(2)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals(div)
				})

				$document.body.addEventListener("click", parent)
				div.addEventListener("click", target)
				div.dispatchEvent(e)

				o(parent.callCount).equals(1)
				o(target.callCount).equals(1)
				o(sequence).deepEquals(["target", "parent"])
			})
			o("legacy handlers fire on the bubbling phase", function () {
				var sequence = []
				var parent = o.spy(function(ev){
					sequence.push("parent")

					o(ev).equals(e)
					o(ev.eventPhase).equals(3)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals($document.body)
				})
				var target = o.spy(function(ev){
					sequence.push("target")

					o(ev).equals(e)
					o(ev.eventPhase).equals(2)
					o(ev.target).equals(div)
					o(ev.currentTarget).equals(div)
				})

				$document.body.addEventListener("click", parent)
				$document.body.onclick = parent
				div.addEventListener("click", target)
				div.dispatchEvent(e)

				o(parent.callCount).equals(2)
				o(target.callCount).equals(1)
				o(sequence).deepEquals(["target", "parent", "parent"])
			})
			o("events do not propagate to child nodes", function() {
				var target = o.spy(function(ev){
					o(ev).equals(e)
					o(ev.eventPhase).equals(2)
					o(ev.target).equals($document.body)
					o(ev.currentTarget).equals($document.body)
				})
				var child = o.spy(function(){
				})

				$document.body.addEventListener("click", target)
				div.addEventListener("click", child)
				$document.body.dispatchEvent(e)

				o(target.callCount).equals(1)
				o(child.callCount).equals(0)
			})
			o("e.stopPropagation 1/6", function () {
				var capParent = o.spy(function(e){e.stopPropagation()})
				var capTarget = o.spy()
				var bubTarget = o.spy()
				var legacyTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(0)
				o(bubTarget.callCount).equals(0)
				o(legacyTarget.callCount).equals(0)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})
			o("e.stopPropagation 2/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy(function(e){e.stopPropagation()})
				var bubTarget = o.spy()
				var legacyTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})

			o("e.stopPropagation 3/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var bubTarget = o.spy(function(e){e.stopPropagation()})
				var legacyTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})
			o("e.stopPropagation 4/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var bubTarget = o.spy()
				var legacyTarget = o.spy(function(e){e.stopPropagation()})
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})
			o("e.stopPropagation 5/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var bubTarget = o.spy()
				var legacyTarget = o.spy()
				var bubParent = o.spy(function(e){e.stopPropagation()})
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(1)
				o(legacyParent.callCount).equals(1)
			})
			o("e.stopPropagation 6/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var legacyTarget = o.spy()
				var bubTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy(function(e){e.stopPropagation()})

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(1)
				o(legacyParent.callCount).equals(1)
			})
			o("e.stopImmediatePropagation 1/6", function () {
				var capParent = o.spy(function(e){e.stopImmediatePropagation()})
				var capTarget = o.spy()
				var bubTarget = o.spy()
				var legacyTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(0)
				o(bubTarget.callCount).equals(0)
				o(legacyTarget.callCount).equals(0)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})
			o("e.stopImmediatePropagation 2/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy(function(e){e.stopImmediatePropagation()})
				var bubTarget = o.spy()
				var legacyTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(0)
				o(legacyTarget.callCount).equals(0)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})

			o("e.stopImmediatePropagation 3/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var bubTarget = o.spy(function(e){e.stopImmediatePropagation()})
				var legacyTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(0)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})
			o("e.stopImmediatePropagation 4/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var bubTarget = o.spy()
				var legacyTarget = o.spy(function(e){e.stopImmediatePropagation()})
				var bubParent = o.spy()
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(0)
				o(legacyParent.callCount).equals(0)
			})
			o("e.stopImmediatePropagation 5/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var bubTarget = o.spy()
				var legacyTarget = o.spy()
				var bubParent = o.spy(function(e){e.stopImmediatePropagation()})
				var legacyParent = o.spy()

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(1)
				o(legacyParent.callCount).equals(0)
			})
			o("e.stopImmediatePropagation 6/6", function () {
				var capParent = o.spy()
				var capTarget = o.spy()
				var legacyTarget = o.spy()
				var bubTarget = o.spy()
				var bubParent = o.spy()
				var legacyParent = o.spy(function(e){e.stopImmediatePropagation()})

				$document.body.addEventListener("click", capParent, true)
				$document.body.addEventListener("click", bubParent, false)
				$document.body.onclick = legacyParent

				div.addEventListener("click", capTarget, true)
				div.addEventListener("click", bubTarget, false)
				div.onclick = legacyTarget

				div.dispatchEvent(e)

				o(capParent.callCount).equals(1)
				o(capTarget.callCount).equals(1)
				o(bubTarget.callCount).equals(1)
				o(legacyTarget.callCount).equals(1)
				o(bubParent.callCount).equals(1)
				o(legacyParent.callCount).equals(1)
			})
			o("errors thrown in handlers don't interrupt the chain", function(done) {
				var errMsg = "The presence of these six errors in the log is expected in non-Node.js environments"
				var handler = o.spy(function(){throw errMsg})

				$document.body.addEventListener("click", handler, true)
				$document.body.addEventListener("click", handler, false)
				$document.body.onclick = handler

				div.addEventListener("click", handler, true)
				div.addEventListener("click", handler, false)
				div.onclick = handler

				div.dispatchEvent(e)

				o(handler.callCount).equals(6)

				// Swallow the async errors in NodeJS
				if (typeof process !== "undefined" && typeof process.once === "function"){
					process.once("uncaughtException", function(e) {
						if (e !== errMsg) throw e
						process.once("uncaughtException", function(e) {
							if (e !== errMsg) throw e
							process.once("uncaughtException", function(e) {
								if (e !== errMsg) throw e
								process.once("uncaughtException", function(e) {
									if (e !== errMsg) throw e
									process.once("uncaughtException", function(e) {
										if (e !== errMsg) throw e
										process.once("uncaughtException", function(e) {
											if (e !== errMsg) throw e
											done()
										})
									})
								})
							})
						})
					})
				} else {
					done()
				}
			})
		})
	})
	o.spec("attributes", function() {
		o.spec("a[href]", function() {
			o("is empty string if no attribute", function() {
				var a = $document.createElement("a")

				o(a.href).equals("")
				o(a.attributes["href"]).equals(undefined)
			})
			o("is path if attribute is set", function() {
				var a = $document.createElement("a")
				a.setAttribute("href", "")

				o(a.href).notEquals("")
				o(a.attributes["href"].value).equals("")
			})
			o("is path if property is set", function() {
				var a = $document.createElement("a")
				a.href = ""

				o(a.href).notEquals("")
				o(a.attributes["href"].value).equals("")
			})
			o("property is read-only for SVG elements", function() {
				var a = $document.createElementNS("http://www.w3.org/2000/svg", "a")
				a.href = "/foo"

				o(a.href).deepEquals({baseVal: "", animVal: ""})
				o("href" in a.attributes).equals(false)
			})
		})
		o.spec("input[checked]", function() {
			o("only exists in input elements", function() {
				var input = $document.createElement("input")
				var a = $document.createElement("a")

				o("checked" in input).equals(true)
				o("checked" in a).equals(false)
			})
			o("tracks attribute value when unset", function() {
				var input = $document.createElement("input")
				input.setAttribute("type", "checkbox")

				o(input.checked).equals(false)
				o(input.attributes["checked"]).equals(undefined)

				input.setAttribute("checked", "")

				o(input.checked).equals(true)
				o(input.attributes["checked"].value).equals("")

				input.removeAttribute("checked")

				o(input.checked).equals(false)
				o(input.attributes["checked"]).equals(undefined)
			})
			o("does not track attribute value when set", function() {
				var input = $document.createElement("input")
				input.setAttribute("type", "checkbox")
				input.checked = true

				o(input.checked).equals(true)
				o(input.attributes["checked"]).equals(undefined)

				input.checked = false
				input.setAttribute("checked", "")

				input.checked = true
				input.removeAttribute("checked")

				o(input.checked).equals(true)
			})
			o("toggles on click", function() {
				var input = $document.createElement("input")
				input.setAttribute("type", "checkbox")
				input.checked = false

				var e = $document.createEvent("MouseEvents")
				e.initEvent("click", true, true)
				input.dispatchEvent(e)

				o(input.checked).equals(true)
			})
			o("doesn't toggle on click when preventDefault() is used", function() {
				var input = $document.createElement("input")
				input.setAttribute("type", "checkbox")
				input.checked = false
				input.onclick = function(e) {e.preventDefault()}

				var e = $document.createEvent("MouseEvents")
				e.initEvent("click", true, true)
				input.dispatchEvent(e)

				o(input.checked).equals(false)
			})
		})
		o.spec("input[value]", function() {
			o("only exists in input elements", function() {
				var input = $document.createElement("input")
				var a = $document.createElement("a")

				o("value" in input).equals(true)
				o("value" in a).equals(false)
			})
			o("converts null to ''", function() {
				var input = $document.createElement("input")
				input.value = "x"

				o(input.value).equals("x")

				input.value = null

				o(input.value).equals("")
			})
			o("converts values to strings", function() {
				var input = $document.createElement("input")
				input.value = 5

				o(input.value).equals("5")

				input.value = 0

				o(input.value).equals("0")

				input.value = undefined

				o(input.value).equals("undefined")
			})
			if (typeof Symbol === "function") o("throws when set to a symbol", function() {
				var threw = false
				var input = $document.createElement("input")
				try {
					input.value = Symbol("")
				} catch (e) {
					o(e instanceof TypeError).equals(true)
					threw = true
				}

				o(input.value).equals("")
				o(threw).equals(true)
			})
		})
		o.spec("input[type]", function(){
			o("only exists in input elements", function() {
				var input = $document.createElement("input")
				var a = $document.createElement("a")

				o("type" in input).equals(true)
				o("type" in a).equals(false)
			})
			o("is 'text' by default", function() {
				var input = $document.createElement("input")

				o(input.type).equals("text")
			})
			"radio|button|checkbox|color|date|datetime|datetime-local|email|file|hidden|month|number|password|range|research|search|submit|tel|text|url|week|image"
				.split("|").forEach(function(type) {
					o("can be set to " + type, function(){
						var input = $document.createElement("input")
						input.type = type

						o(input.getAttribute("type")).equals(type)
						o(input.type).equals(type)
					})
					o("bad values set the attribute, but the getter corrects to 'text', " + type, function(){
						var input = $document.createElement("input")
						input.type = "badbad" + type

						o(input.getAttribute("type")).equals("badbad" + type)
						o(input.type).equals("text")
					})
				})
		})
		o.spec("textarea[value]", function() {
			o("reads from child if no value was ever set", function() {
				var textarea = $document.createElement("textarea")
				textarea.appendChild($document.createTextNode("aaa"))

				o(textarea.value).equals("aaa")
			})
			o("ignores child if value set", function() {
				var textarea = $document.createElement("textarea")
				textarea.value = null
				textarea.appendChild($document.createTextNode("aaa"))

				o(textarea.value).equals("")
			})
			o("textarea[value] doesn't reflect `attributes.value`", function() {
				var textarea = $document.createElement("textarea")
				textarea.value = "aaa"
				textarea.setAttribute("value", "bbb")

				o(textarea.value).equals("aaa")
			})
		})
		o.spec("select[value] and select[selectedIndex]", function() {
			o("only exist in select elements", function() {
				var select = $document.createElement("select")
				var a = $document.createElement("a")

				o("value" in select).equals(true)
				o("value" in a).equals(false)

				o("selectedIndex" in select).equals(true)
				o("selectedIndex" in a).equals(false)
			})
			o("value defaults to value at first index", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")
				select.appendChild(option2)

				o(select.value).equals("a")
				o(select.selectedIndex).equals(0)
			})
			o("value falls back to child nodeValue if no attribute", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.appendChild($document.createTextNode("a"))
				var option2 = $document.createElement("option")
				option2.appendChild($document.createTextNode("b"))
				select.appendChild(option1)
				select.appendChild(option2)

				o(select.value).equals("a")
				o(select.selectedIndex).equals(0)
				o(select.childNodes[0].selected).equals(true)
				o(select.childNodes[0].value).equals("a")
				o(select.childNodes[1].value).equals("b")
			})
			o("value defaults to invalid if no options", function() {
				var select = $document.createElement("select")

				o(select.value).equals("")
				o(select.selectedIndex).equals(-1)
			})
			o("setting valid value works", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")
				select.appendChild(option2)

				var option3 = $document.createElement("option")
				option3.setAttribute("value", "")
				select.appendChild(option3)

				var option4 = $document.createElement("option")
				option4.setAttribute("value", "null")
				select.appendChild(option4)

				select.value = "b"

				o(select.value).equals("b")
				o(select.selectedIndex).equals(1)

				select.value = ""

				o(select.value).equals("")
				o(select.selectedIndex).equals(2)

				select.value = "null"

				o(select.value).equals("null")
				o(select.selectedIndex).equals(3)

				select.value = null

				o(select.value).equals("")
				o(select.selectedIndex).equals(-1)
			})
			o("setting valid value works with type conversion", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "0")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "undefined")
				select.appendChild(option2)

				var option3 = $document.createElement("option")
				option3.setAttribute("value", "")
				select.appendChild(option3)

				select.value = 0

				o(select.value).equals("0")
				o(select.selectedIndex).equals(0)

				select.value = undefined

				o(select.value).equals("undefined")
				o(select.selectedIndex).equals(1)

				if (typeof Symbol === "function") {
					var threw = false
					try {
						select.value = Symbol("x")
					} catch (e) {
						threw = true
					}
					o(threw).equals(true)
					o(select.value).equals("undefined")
					o(select.selectedIndex).equals(1)
				}
			})
			o("option.value = null is converted to 'null'", function() {
				var option = $document.createElement("option")
				option.value = null

				o(option.value).equals("null")
			})
			o("setting valid value works with optgroup", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")

				var option3 = $document.createElement("option")
				option3.setAttribute("value", "c")

				var optgroup = $document.createElement("optgroup")
				optgroup.appendChild(option1)
				optgroup.appendChild(option2)
				select.appendChild(optgroup)
				select.appendChild(option3)

				select.value = "b"

				o(select.value).equals("b")
				o(select.selectedIndex).equals(1)
			})
			o("setting valid selectedIndex works", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")
				select.appendChild(option2)

				select.selectedIndex = 1

				o(select.value).equals("b")
				o(select.selectedIndex).equals(1)
			})
			o("setting option[selected] works", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")
				select.appendChild(option2)

				select.childNodes[1].selected = true

				o(select.value).equals("b")
				o(select.selectedIndex).equals(1)
			})
			o("unsetting option[selected] works", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")
				select.appendChild(option2)

				select.childNodes[1].selected = true
				select.childNodes[1].selected = false

				o(select.value).equals("a")
				o(select.selectedIndex).equals(0)
			})
			o("setting invalid value yields a selectedIndex of -1 and value of empty string", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")
				select.appendChild(option2)

				select.value = "c"

				o(select.value).equals("")
				o(select.selectedIndex).equals(-1)
			})
			o("setting invalid selectedIndex yields a selectedIndex of -1 and value of empty string", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "b")
				select.appendChild(option2)

				select.selectedIndex = -2

				o(select.value).equals("")
				o(select.selectedIndex).equals(-1)
			})
			o("setting invalid value yields a selectedIndex of -1 and value of empty string even when there's an option whose value is empty string", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "")
				select.appendChild(option2)

				select.value = "c"

				o(select.value).equals("")
				o(select.selectedIndex).equals(-1)
			})
			o("setting invalid selectedIndex yields a selectedIndex of -1 and value of empty string even when there's an option whose value is empty string", function() {
				var select = $document.createElement("select")

				var option1 = $document.createElement("option")
				option1.setAttribute("value", "a")
				select.appendChild(option1)

				var option2 = $document.createElement("option")
				option2.setAttribute("value", "")
				select.appendChild(option2)

				select.selectedIndex = -2

				o(select.value).equals("")
				o(select.selectedIndex).equals(-1)
			})
		})
		o.spec("canvas width and height", function() {
			o("setting property works", function() {
				var canvas = $document.createElement("canvas")

				canvas.width = 100
				o(canvas.attributes["width"].value).equals("100")
				o(canvas.width).equals(100)

				canvas.height = 100
				o(canvas.attributes["height"].value).equals("100")
				o(canvas.height).equals(100)
			})
			o("setting string casts to number", function() {
				var canvas = $document.createElement("canvas")

				canvas.width = "100"
				o(canvas.attributes["width"].value).equals("100")
				o(canvas.width).equals(100)

				canvas.height = "100"
				o(canvas.attributes["height"].value).equals("100")
				o(canvas.height).equals(100)
			})
			o("setting float casts to int", function() {
				var canvas = $document.createElement("canvas")

				canvas.width = 1.2
				o(canvas.attributes["width"].value).equals("1")
				o(canvas.width).equals(1)

				canvas.height = 1.2
				o(canvas.attributes["height"].value).equals("1")
				o(canvas.height).equals(1)
			})
			o("setting percentage fails", function() {
				var canvas = $document.createElement("canvas")

				canvas.width = "100%"
				o(canvas.attributes["width"].value).equals("0")
				o(canvas.width).equals(0)

				canvas.height = "100%"
				o(canvas.attributes["height"].value).equals("0")
				o(canvas.height).equals(0)
			})
			o("setting attribute works", function() {
				var canvas = $document.createElement("canvas")

				canvas.setAttribute("width", "100%")
				o(canvas.attributes["width"].value).equals("100%")
				o(canvas.width).equals(100)

				canvas.setAttribute("height", "100%")
				o(canvas.attributes["height"].value).equals("100%")
				o(canvas.height).equals(100)
			})
		})
	})
	o.spec("className", function() {
		o("works", function() {
			var el = $document.createElement("div")
			el.className = "a"

			o(el.className).equals("a")
			o(el.attributes["class"].value).equals("a")
		})
		o("setter throws in svg", function(done) {
			var el = $document.createElementNS("http://www.w3.org/2000/svg", "svg")
			try {
				el.className = "a"
			}
			catch (e) {
				done()
			}
		})
	})
	o.spec("spies", function() {
		var $window
		o.beforeEach(function() {
			$window = domMock({spy: o.spy})
		})
		o("basics", function() {
			o(typeof $window.__getSpies).equals("function")
			o("__getSpies" in domMock()).equals(false)
		})
		o("input elements have spies on value and type setters", function() {
			var input = $window.document.createElement("input")

			var spies = $window.__getSpies(input)

			o(typeof spies).equals("object")
			o(spies).notEquals(null)
			o(typeof spies.valueSetter).equals("function")
			o(typeof spies.typeSetter).equals("function")
			o(spies.valueSetter.callCount).equals(0)
			o(spies.typeSetter.callCount).equals(0)

			input.value = "aaa"
			input.type = "radio"

			o(spies.valueSetter.callCount).equals(1)
			o(spies.valueSetter.this).equals(input)
			o(spies.valueSetter.args[0]).equals("aaa")

			o(spies.typeSetter.callCount).equals(1)
			o(spies.typeSetter.this).equals(input)
			o(spies.typeSetter.args[0]).equals("radio")
		})
		o("select elements have spies on value setters", function() {
			var select = $window.document.createElement("select")

			var spies = $window.__getSpies(select)

			o(typeof spies).equals("object")
			o(spies).notEquals(null)
			o(typeof spies.valueSetter).equals("function")
			o(spies.valueSetter.callCount).equals(0)

			select.value = "aaa"

			o(spies.valueSetter.callCount).equals(1)
			o(spies.valueSetter.this).equals(select)
			o(spies.valueSetter.args[0]).equals("aaa")
		})
		o("option elements have spies on value setters", function() {
			var option = $window.document.createElement("option")

			var spies = $window.__getSpies(option)

			o(typeof spies).equals("object")
			o(spies).notEquals(null)
			o(typeof spies.valueSetter).equals("function")
			o(spies.valueSetter.callCount).equals(0)

			option.value = "aaa"

			o(spies.valueSetter.callCount).equals(1)
			o(spies.valueSetter.this).equals(option)
			o(spies.valueSetter.args[0]).equals("aaa")
		})
		o("textarea elements have spies on value setters", function() {
			var textarea = $window.document.createElement("textarea")

			var spies = $window.__getSpies(textarea)

			o(typeof spies).equals("object")
			o(spies).notEquals(null)
			o(typeof spies.valueSetter).equals("function")
			o(spies.valueSetter.callCount).equals(0)

			textarea.value = "aaa"

			o(spies.valueSetter.callCount).equals(1)
			o(spies.valueSetter.this).equals(textarea)
			o(spies.valueSetter.args[0]).equals("aaa")
		})
	})
	o.spec("DOMParser for SVG", function(){
		var $DOMParser
		o.beforeEach(function() {
			$DOMParser = $window.DOMParser
		})
		o("basics", function(){
			o(typeof $DOMParser).equals("function")

			var parser = new $DOMParser()

			o(parser instanceof $DOMParser).equals(true)
			o(typeof parser.parseFromString).equals("function")
		})
		o("empty document", function() {
			var parser = new $DOMParser()
			var doc = parser.parseFromString(
				"<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>",
				"image/svg+xml"
			)

			o(typeof doc.documentElement).notEquals(undefined)
			o(doc.documentElement.nodeName).equals("svg")
			o(doc.documentElement.namespaceURI).equals("http://www.w3.org/2000/svg")
			o(doc.documentElement.childNodes.length).equals(0)
		})
		o("text elements", function() {
			var parser = new $DOMParser()
			var doc = parser.parseFromString(
				"<svg xmlns=\"http://www.w3.org/2000/svg\">"
					+ "<text>hello</text>"
					+ "<text> </text>"
					+ "<text>world</text>"
				+ "</svg>",
				"image/svg+xml"
			)

			o(doc.documentElement.nodeName).equals("svg")
			o(doc.documentElement.namespaceURI).equals("http://www.w3.org/2000/svg")

			var nodes = doc.documentElement.childNodes
			o(nodes.length).equals(3)
			o(nodes[0].nodeName).equals("text")
			o(nodes[0].namespaceURI).equals("http://www.w3.org/2000/svg")
			o(nodes[0].childNodes.length).equals(1)
			o(nodes[0].childNodes[0].nodeName).equals("#text")
			o(nodes[0].childNodes[0].nodeValue).equals("hello")
			o(nodes[1].nodeName).equals("text")
			o(nodes[1].namespaceURI).equals("http://www.w3.org/2000/svg")
			o(nodes[1].childNodes.length).equals(1)
			o(nodes[1].childNodes[0].nodeName).equals("#text")
			o(nodes[1].childNodes[0].nodeValue).equals(" ")
			o(nodes[2].nodeName).equals("text")
			o(nodes[2].namespaceURI).equals("http://www.w3.org/2000/svg")
			o(nodes[2].childNodes.length).equals(1)
			o(nodes[2].childNodes[0].nodeName).equals("#text")
			o(nodes[2].childNodes[0].nodeValue).equals("world")
		})
	})
})
