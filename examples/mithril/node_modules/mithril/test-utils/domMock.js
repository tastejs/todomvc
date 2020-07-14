"use strict"

/*
Known limitations:
- the innerHTML setter and the DOMParser only support a small subset of the true HTML/XML syntax.
- `option.selected` can't be set/read when the option doesn't have a `select` parent
- `element.attributes` is just a map of attribute names => Attr objects stubs
- ...

*/

/*
options:
- spy:(f: Function) => Function
*/

module.exports = function(options) {
	options = options || {}
	var spy = options.spy || function(f){return f}
	var spymap = []

	// This way I'm not also implementing a partial `URL` polyfill. Based on the
	// regexp at https://urlregex.com/, but adapted to allow relative URLs and
	// care only about HTTP(S) URLs.
	var urlHash = "#[?!/+=&;%@.\\w_-]*"
	var urlQuery = "\\?[!/+=&;%@.\\w_-]*"
	var urlPath = "/[+~%/.\\w_-]*"
	var urlRelative = urlPath + "(?:" + urlQuery + ")?(?:" + urlHash + ")?"
	var urlDomain = "https?://[A-Za-z0-9][A-Za-z0-9.-]+[A-Za-z0-9]"
	var validURLRegex = new RegExp(
		"^" + urlDomain + "(" + urlRelative + ")?$|" +
		"^" + urlRelative + "$|" +
		"^" + urlQuery + "(?:" + urlHash + ")?$|" +
		"^" + urlHash + "$"
	)

	var hasOwn = ({}.hasOwnProperty)

	function registerSpies(element, spies) {
		if(options.spy) {
			var i = spymap.indexOf(element)
			if (i === -1) {
				spymap.push(element, spies)
			} else {
				var existing = spymap[i + 1]
				for (var k in spies) existing[k] = spies[k]
			}
		}
	}
	function getSpies(element) {
		if (element == null || typeof element !== "object") throw new Error("Element expected")
		if(options.spy) return spymap[spymap.indexOf(element) + 1]
	}

	function isModernEvent(type) {
		return type === "transitionstart" || type === "transitionend" || type === "animationstart" || type === "animationend"
	}
	function dispatchEvent(e) {
		var stopped = false
		e.stopImmediatePropagation = function() {
			e.stopPropagation()
			stopped = true
		}
		e.currentTarget = this
		if (this._events[e.type] != null) {
			for (var i = 0; i < this._events[e.type].handlers.length; i++) {
				var useCapture = this._events[e.type].options[i].capture
				if (useCapture && e.eventPhase < 3 || !useCapture && e.eventPhase > 1) {
					var handler = this._events[e.type].handlers[i]
					if (typeof handler === "function") try {handler.call(this, e)} catch(e) {setTimeout(function(){throw e})}
					else try {handler.handleEvent(e)} catch(e) {setTimeout(function(){throw e})}
					if (stopped) return
				}
			}
		}
		// this is inaccurate. Normally the event fires in definition order, including legacy events
		// this would require getters/setters for each of them though and we haven't gotten around to
		// adding them since it would be at a high perf cost or would entail some heavy refactoring of
		// the mocks (prototypes instead of closures).
		if (e.eventPhase > 1 && typeof this["on" + e.type] === "function" && !isModernEvent(e.type)) try {this["on" + e.type](e)} catch(e) {setTimeout(function(){throw e})}
	}
	function appendChild(child) {
		var ancestor = this
		while (ancestor !== child && ancestor !== null) ancestor = ancestor.parentNode
		if (ancestor === child) throw new Error("Node cannot be inserted at the specified point in the hierarchy")

		if (child.nodeType == null) throw new Error("Argument is not a DOM element")

		var index = this.childNodes.indexOf(child)
		if (index > -1) this.childNodes.splice(index, 1)
		if (child.nodeType === 11) {
			while (child.firstChild != null) appendChild.call(this, child.firstChild)
			child.childNodes = []
		}
		else {
			this.childNodes.push(child)
			if (child.parentNode != null && child.parentNode !== this) removeChild.call(child.parentNode, child)
			child.parentNode = this
		}
	}
	function removeChild(child) {
		var index = this.childNodes.indexOf(child)
		if (index > -1) {
			this.childNodes.splice(index, 1)
			child.parentNode = null
		}
		else throw new TypeError("Failed to execute 'removeChild'")
	}
	function insertBefore(child, reference) {
		var ancestor = this
		while (ancestor !== child && ancestor !== null) ancestor = ancestor.parentNode
		if (ancestor === child) throw new Error("Node cannot be inserted at the specified point in the hierarchy")

		if (child.nodeType == null) throw new Error("Argument is not a DOM element")

		var refIndex = this.childNodes.indexOf(reference)
		var index = this.childNodes.indexOf(child)
		if (reference !== null && refIndex < 0) throw new TypeError("Invalid argument")
		if (index > -1) this.childNodes.splice(index, 1)
		if (reference === null) appendChild.call(this, child)
		else {
			if (index !== -1 && refIndex > index) refIndex--
			if (child.nodeType === 11) {
				this.childNodes.splice.apply(this.childNodes, [refIndex, 0].concat(child.childNodes))
				while (child.firstChild) {
					var subchild = child.firstChild
					removeChild.call(child, subchild)
					subchild.parentNode = this
				}
				child.childNodes = []
			}
			else {
				this.childNodes.splice(refIndex, 0, child)
				if (child.parentNode != null && child.parentNode !== this) removeChild.call(child.parentNode, child)
				child.parentNode = this
			}
		}
	}
	function getAttribute(name) {
		if (this.attributes[name] == null) return null
		return this.attributes[name].value
	}
	function setAttribute(name, value) {
		/*eslint-disable no-implicit-coercion*/
		// this is the correct kind of conversion, passing a Symbol throws in browsers too.
		var nodeValue = "" + value
		/*eslint-enable no-implicit-coercion*/
		this.attributes[name] = {
			namespaceURI: hasOwn.call(this.attributes, name) ? this.attributes[name].namespaceURI : null,
			get value() {return nodeValue},
			set value(value) {
				/*eslint-disable no-implicit-coercion*/
				nodeValue = "" + value
				/*eslint-enable no-implicit-coercion*/
			},
			get nodeValue() {return nodeValue},
			set nodeValue(value) {
				this.value = value
			}
		}
	}
	function setAttributeNS(ns, name, value) {
		this.setAttribute(name, value)
		this.attributes[name].namespaceURI = ns
	}
	function removeAttribute(name) {
		delete this.attributes[name]
	}
	function hasAttribute(name) {
		return name in this.attributes
	}
	var declListTokenizer = /;|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'/g
	/**
	 * This will split a semicolon-separated CSS declaration list into an array of
	 * individual declarations, ignoring semicolons in strings.
	 *
	 * Comments are also stripped.
	 *
	 * @param {string} declList
	 * @return {string[]}
	 */
	function splitDeclList(declList) {
		var indices = [], res = [], match

		// remove comments, preserving comments in strings.
		declList = declList.replace(
			/("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*')|\/\*[\s\S]*?\*\//g,
			function(m, str){
				return str || ""
			}
		)
		/*eslint-disable no-cond-assign*/
		while (match = declListTokenizer.exec(declList)) {
			if (match[0] === ";") indices.push(match.index)
		}
		/*eslint-enable no-cond-assign*/
		for (var i = indices.length; i--;){
			res.unshift(declList.slice(indices[i] + 1))
			declList = declList.slice(0, indices[i])
		}
		res.unshift(declList)
		return res
	}
	function parseMarkup(value, root, voidElements, xmlns) {
		var depth = 0, stack = [root]
		value.replace(/<([a-z0-9\-]+?)((?:\s+?[^=]+?=(?:"[^"]*?"|'[^']*?'|[^\s>]*))*?)(\s*\/)?>|<\/([a-z0-9\-]+?)>|([^<]+)/g, function(match, startTag, attrs, selfClosed, endTag, text) {
			if (startTag) {
				var element = xmlns == null ? $window.document.createElement(startTag) : $window.document.createElementNS(xmlns, startTag)
				attrs.replace(/\s+?([^=]+?)=(?:"([^"]*?)"|'([^']*?)'|([^\s>]*))/g, function(match, key, doubleQuoted, singleQuoted, unquoted) {
					var keyParts = key.split(":")
					var name = keyParts.pop()
					var ns = keyParts[0]
					var value = doubleQuoted || singleQuoted || unquoted || ""
					if (ns != null) element.setAttributeNS(ns, name, value)
					else element.setAttribute(name, value)
				})
				appendChild.call(stack[depth], element)
				if (!selfClosed && voidElements.indexOf(startTag.toLowerCase()) < 0) stack[++depth] = element
			}
			else if (endTag) {
				depth--
			}
			else if (text) {
				appendChild.call(stack[depth], $window.document.createTextNode(text)) // FIXME handle html entities
			}
		})
	}
	function DOMParser() {}
	DOMParser.prototype.parseFromString = function(src, mime) {
		if (mime !== "image/svg+xml") throw new Error("The DOMParser mock only supports the \"image/svg+xml\" MIME type")
		var match = src.match(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg">(.*)<\/svg>$/)
		if (!match) throw new Error("Please provide a bare SVG tag with the xmlns as only attribute")
		var value = match[1]
		var root = $window.document.createElementNS("http://www.w3.org/2000/svg", "svg")
		parseMarkup(value, root, [], "http://www.w3.org/2000/svg")
		return {documentElement: root}
	}
	function camelCase(string) {
		return string.replace(/-\D/g, function(match) {return match[1].toUpperCase()})
	}
	var activeElement
	var delay = 16, last = 0
	var $window = {
		DOMParser: DOMParser,
		requestAnimationFrame: function(callback) {
			var elapsed = Date.now() - last
			return setTimeout(function() {
				callback()
				last = Date.now()
			}, delay - elapsed)
		},
		document: {
			createElement: function(tag) {
				var cssText = ""
				var style = {}
				Object.defineProperties(style, {
					cssText: {
						get: function() {return cssText},
						set: function (value) {
							var buf = []
							if (typeof value === "string") {
								for (var key in style) style[key] = ""
								var rules = splitDeclList(value)
								for (var i = 0; i < rules.length; i++) {
									var rule = rules[i]
									var colonIndex = rule.indexOf(":")
									if (colonIndex > -1) {
										var rawKey = rule.slice(0, colonIndex).trim()
										var key = camelCase(rawKey)
										var value = rule.slice(colonIndex + 1).trim()
										if (key !== "cssText") {
											style[key] = style[rawKey] = value
											buf.push(rawKey + ": " + value + ";")
										}
									}
								}
								element.setAttribute("style", cssText = buf.join(" "))
							}
						}
					},
					getPropertyValue: {value: function(key){
						return style[key]
					}},
					removeProperty: {value: function(key){
						style[key] = style[camelCase(key)] = ""
					}},
					setProperty: {value: function(key, value){
						style[key] = style[camelCase(key)] = value
					}}
				})
				var events = {}
				var element = {
					nodeType: 1,
					nodeName: tag.toUpperCase(),
					namespaceURI: "http://www.w3.org/1999/xhtml",
					appendChild: appendChild,
					removeChild: removeChild,
					insertBefore: insertBefore,
					hasAttribute: hasAttribute,
					getAttribute: getAttribute,
					setAttribute: setAttribute,
					setAttributeNS: setAttributeNS,
					removeAttribute: removeAttribute,
					parentNode: null,
					childNodes: [],
					attributes: {},
					get firstChild() {
						return this.childNodes[0] || null
					},
					get nextSibling() {
						if (this.parentNode == null) return null
						var index = this.parentNode.childNodes.indexOf(this)
						if (index < 0) throw new TypeError("Parent's childNodes is out of sync")
						return this.parentNode.childNodes[index + 1] || null
					},
					set textContent(value) {
						this.childNodes = []
						if (value !== "") appendChild.call(this, $window.document.createTextNode(value))
					},
					set innerHTML(value) {
						var voidElements = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]
						while (this.firstChild) removeChild.call(this, this.firstChild)
						var match = value.match(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg">(.*)<\/svg>$/), root, ns
						if (match) {
							var value = match[1]
							root = $window.document.createElementNS("http://www.w3.org/2000/svg", "svg")
							ns = "http://www.w3.org/2000/svg"
							appendChild.call(this, root)
						} else {
							root = this
						}
						parseMarkup(value, root, voidElements, ns)
					},
					get style() {
						return style
					},
					set style(_){
						// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style#Setting_style
						throw new Error("setting element.style is not portable")
					},
					get className() {
						return this.attributes["class"] ? this.attributes["class"].value : ""
					},
					set className(value) {
						if (this.namespaceURI === "http://www.w3.org/2000/svg") throw new Error("Cannot set property className of SVGElement")
						else this.setAttribute("class", value)
					},
					focus: function() {activeElement = this},
					addEventListener: function(type, handler, options) {
						if (arguments.length > 2) {
							if (typeof options === "object" && options != null) throw new TypeError("NYI: addEventListener options")
							else if (typeof options !== "boolean") throw new TypeError("boolean expected for useCapture")
							else options = {capture: options}
						} else {
							options = {capture: false}
						}
						if (events[type] == null) events[type] = {handlers: [handler], options: [options]}
						else {
							var found = false
							for (var i = 0; i < events[type].handlers.length; i++) {
								if (events[type].handlers[i] === handler && events[type].options[i].capture === options.capture) {
									found = true
									break
								}
							}
							if (!found) {
								events[type].handlers.push(handler)
								events[type].options.push(options)
							}
						}
					},
					removeEventListener: function(type, handler, options) {
						if (arguments.length > 2) {
							if (typeof options === "object" && options != null) throw new TypeError("NYI: addEventListener options")
							else if (typeof options !== "boolean") throw new TypeError("boolean expected for useCapture")
							else options = {capture: options}
						} else {
							options = {capture: false}
						}
						if (events[type] != null) {
							for (var i = 0; i < events[type].handlers.length; i++) {
								if (events[type].handlers[i] === handler && events[type].options[i].capture === options.capture) {
									events[type].handlers.splice(i, 1)
									events[type].options.splice(i, 1)
									break;
								}
							}
						}
					},
					dispatchEvent: function(e) {
						var parents = []
						if (this.parentNode != null) {
							var parent = this.parentNode
							do {
								parents.push(parent)
								parent = parent.parentNode
							} while (parent != null)
						}
						e.target = this
						var prevented = false
						e.preventDefault = function() {
							prevented = true
						}
						Object.defineProperty(e, "defaultPrevented", {
							configurable: true,
							get: function () { return prevented }
						})
						var stopped = false
						e.stopPropagation = function() {
							stopped = true
						}
						e.eventPhase = 1
						try {
							for (var i = parents.length - 1; 0 <= i; i--) {
								dispatchEvent.call(parents[i], e)
								if (stopped) {
									return
								}
							}
							e.eventPhase = 2
							dispatchEvent.call(this, e)
							if (stopped) {
								return
							}
							e.eventPhase = 3
							for (var i = 0; i < parents.length; i++) {
								dispatchEvent.call(parents[i], e)
								if (stopped) {
									return
								}
							}
						} catch(e) {
							throw e
						} finally {
							e.eventPhase = 0
							if (!prevented) {
								if (this.nodeName === "INPUT" && this.attributes["type"] != null && this.attributes["type"].value === "checkbox" && e.type === "click") {
									this.checked = !this.checked
								}
							}
						}

					},
					onclick: null,
					_events: events
				}

				if (element.nodeName === "A") {
					Object.defineProperty(element, "href", {
						get: function() {
							if (this.namespaceURI === "http://www.w3.org/2000/svg") {
								var val = this.hasAttribute("href") ? this.attributes.href.value : ""
								return {baseVal: val, animVal: val}
							} else if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
								if (!this.hasAttribute("href")) return ""
								// HACK: if it's valid already, there's nothing to implement.
								var value = this.attributes.href.value
								if (validURLRegex.test(value)) return value
							}
							return "[FIXME implement]"
						},
						set: function(value) {
							// This is a readonly attribute for SVG, todo investigate MathML which may have yet another IDL
							if (this.namespaceURI !== "http://www.w3.org/2000/svg") this.setAttribute("href", value)
						},
						enumerable: true,
					})
				}

				if (element.nodeName === "INPUT") {
					var checked
					Object.defineProperty(element, "checked", {
						get: function() {return checked === undefined ? this.attributes["checked"] !== undefined : checked},
						set: function(value) {checked = Boolean(value)},
						enumerable: true,
					})

					var value = ""
					var valueSetter = spy(function(v) {
						/*eslint-disable no-implicit-coercion*/
						value = v === null ? "" : "" + v
						/*eslint-enable no-implicit-coercion*/
					})
					Object.defineProperty(element, "value", {
						get: function() {
							return value
						},
						set: valueSetter,
						enumerable: true,
					})

					// we currently emulate the non-ie behavior, but emulating ie may be more useful (throw when an invalid type is set)
					var typeSetter = spy(function(v) {
						this.setAttribute("type", v)
					})
					Object.defineProperty(element, "type", {
						get: function() {
							if (!this.hasAttribute("type")) return "text"
							var type = this.getAttribute("type")
							return (/^(?:radio|button|checkbox|color|date|datetime|datetime-local|email|file|hidden|month|number|password|range|research|search|submit|tel|text|url|week|image)$/)
								.test(type)
								? type
								: "text"
						},
						set: typeSetter,
						enumerable: true,
					})
					registerSpies(element, {
						valueSetter: valueSetter,
						typeSetter: typeSetter
					})
				}


				if (element.nodeName === "TEXTAREA") {
					var wasNeverSet = true
					var value = ""
					var valueSetter = spy(function(v) {
						wasNeverSet = false
						/*eslint-disable no-implicit-coercion*/
						value = v === null ? "" : "" + v
						/*eslint-enable no-implicit-coercion*/
					})
					Object.defineProperty(element, "value", {
						get: function() {
							return wasNeverSet && this.firstChild ? this.firstChild.nodeValue : value
						},
						set: valueSetter,
						enumerable: true,
					})
					registerSpies(element, {
						valueSetter: valueSetter
					})
				}

				/* eslint-disable radix */

				if (element.nodeName === "CANVAS") {
					Object.defineProperty(element, "width", {
						get: function() {return this.attributes["width"] ? Math.floor(parseInt(this.attributes["width"].value) || 0) : 300},
						set: function(value) {this.setAttribute("width", Math.floor(Number(value) || 0).toString())},
					})
					Object.defineProperty(element, "height", {
						get: function() {return this.attributes["height"] ? Math.floor(parseInt(this.attributes["height"].value) || 0) : 300},
						set: function(value) {this.setAttribute("height", Math.floor(Number(value) || 0).toString())},
					})
				}

				/* eslint-enable radix */

				function getOptions(element) {
					var options = []
					for (var i = 0; i < element.childNodes.length; i++) {
						if (element.childNodes[i].nodeName === "OPTION") options.push(element.childNodes[i])
						else if (element.childNodes[i].nodeName === "OPTGROUP") options = options.concat(getOptions(element.childNodes[i]))
					}
					return options
				}
				function getOptionValue(element) {
					return element.attributes["value"] != null ?
						element.attributes["value"].value :
						element.firstChild != null ? element.firstChild.nodeValue : ""
				}
				if (element.nodeName === "SELECT") {
					// var selectedValue
					var selectedIndex = 0
					Object.defineProperty(element, "selectedIndex", {
						get: function() {return getOptions(this).length > 0 ? selectedIndex : -1},
						set: function(value) {
							var options = getOptions(this)
							if (value >= 0 && value < options.length) {
								// selectedValue = getOptionValue(options[selectedIndex])
								selectedIndex = value
							}
							else {
								// selectedValue = ""
								selectedIndex = -1
							}
						},
						enumerable: true,
					})
					var valueSetter = spy(function(value) {
						if (value === null) {
							selectedIndex = -1
						} else {
							var options = getOptions(this)
							/*eslint-disable no-implicit-coercion*/
							var stringValue = "" + value
							/*eslint-enable no-implicit-coercion*/
							for (var i = 0; i < options.length; i++) {
								if (getOptionValue(options[i]) === stringValue) {
									// selectedValue = stringValue
									selectedIndex = i
									return
								}
							}
							// selectedValue = stringValue
							selectedIndex = -1
						}
					})
					Object.defineProperty(element, "value", {
						get: function() {
							if (this.selectedIndex > -1) return getOptionValue(getOptions(this)[this.selectedIndex])
							return ""
						},
						set: valueSetter,
						enumerable: true,
					})
					registerSpies(element, {
						valueSetter: valueSetter
					})
				}
				if (element.nodeName === "OPTION") {
					var valueSetter = spy(function(value) {
						/*eslint-disable no-implicit-coercion*/
						this.setAttribute("value", "" + value)
						/*eslint-enable no-implicit-coercion*/
					})
					Object.defineProperty(element, "value", {
						get: function() {return getOptionValue(this)},
						set: valueSetter,
						enumerable: true,
					})
					registerSpies(element, {
						valueSetter: valueSetter
					})

					Object.defineProperty(element, "selected", {
						// TODO? handle `selected` without a parent (works in browsers)
						get: function() {
							var options = getOptions(this.parentNode)
							var index = options.indexOf(this)
							return index === this.parentNode.selectedIndex
						},
						set: function(value) {
							if (value) {
								var options = getOptions(this.parentNode)
								var index = options.indexOf(this)
								if (index > -1) this.parentNode.selectedIndex = index
							}
							else this.parentNode.selectedIndex = 0
						},
						enumerable: true,
					})
				}
				return element
			},
			createElementNS: function(ns, tag, is) {
				var element = this.createElement(tag, is)
				element.nodeName = tag
				element.namespaceURI = ns
				return element
			},
			createTextNode: function(text) {
				/*eslint-disable no-implicit-coercion*/
				var nodeValue = "" + text
				/*eslint-enable no-implicit-coercion*/
				return {
					nodeType: 3,
					nodeName: "#text",
					parentNode: null,
					get childNodes() { return [] },
					get firstChild() { return null },
					get nodeValue() {return nodeValue},
					set nodeValue(value) {
						/*eslint-disable no-implicit-coercion*/
						nodeValue = "" + value
						/*eslint-enable no-implicit-coercion*/
					},
					get nextSibling() {
						if (this.parentNode == null) return null
						var index = this.parentNode.childNodes.indexOf(this)
						if (index < 0) throw new TypeError("Parent's childNodes is out of sync")
						return this.parentNode.childNodes[index + 1] || null
					},
				}
			},
			createDocumentFragment: function() {
				return {
					nodeType: 11,
					nodeName: "#document-fragment",
					appendChild: appendChild,
					insertBefore: insertBefore,
					removeChild: removeChild,
					parentNode: null,
					childNodes: [],
					get firstChild() {
						return this.childNodes[0] || null
					},
				}
			},
			createEvent: function() {
				return {
					eventPhase: 0,
					initEvent: function(type) {this.type = type}
				}
			},
			get activeElement() {return activeElement},
		},
	}
	$window.document.documentElement = $window.document.createElement("html")
	appendChild.call($window.document.documentElement, $window.document.createElement("head"))
	$window.document.body = $window.document.createElement("body")
	appendChild.call($window.document.documentElement, $window.document.body)
	activeElement = $window.document.body

	if (options.spy) $window.__getSpies = getSpies

	return $window
}
