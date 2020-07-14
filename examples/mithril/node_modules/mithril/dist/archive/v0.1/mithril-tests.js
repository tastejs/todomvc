new function(window) {
	var selectorCache = {}
	var type = {}.toString
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.+?)\2)?\]/
	
	Mithril = m = function() {
		var args = arguments
		var hasAttrs = type.call(args[1]) == "[object Object]"
		var attrs = hasAttrs ? args[1] : {}
		var classAttrName = "class" in attrs ? "class" : "className"
		var cell = selectorCache[args[0]]
		if (cell === undefined) {
			selectorCache[args[0]] = cell = {tag: "div", attrs: {}}
			var match, classes = []
			while (match = parser.exec(args[0])) {
				if (match[1] == "") cell.tag = match[2]
				else if (match[1] == "#") cell.attrs.id = match[2]
				else if (match[1] == ".") classes.push(match[2])
				else if (match[3][0] == "[") {
					var pair = attrParser.exec(match[3])
					cell.attrs[pair[1]] = pair[3] || true
				}
			}
			if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ")
		}
		cell = clone(cell)
		cell.attrs = clone(cell.attrs)
		cell.children = hasAttrs ? args[2] : args[1]
		for (var attrName in attrs) {
			if (attrName == classAttrName) cell.attrs[attrName] = (cell.attrs[attrName] || "") + " " + attrs[attrName]
			else cell.attrs[attrName] = attrs[attrName]
		}
		return cell
	}
	function build(parent, data, cached) {
		if (data === null || data === undefined) return
		
		var cachedType = type.call(cached), dataType = type.call(data)
		if (cachedType != dataType) {
			if (cached !== null && cached !== undefined) clear(cached.nodes)
			cached = new data.constructor
			cached.nodes = []
		}
		
		if (dataType == "[object Array]") {
			var nodes = [], intact = cached.length === data.length
			for (var i = 0; i < data.length; i++) {
				var item = build(parent, data[i], cached[i])
				if (!item.nodes.intact) intact = false
				cached[i] = item
			}
			if (!intact) {
				for (var i = 0; i < data.length; i++) nodes = nodes.concat(cached[i].nodes)
				for (var i = nodes.length, node; node = cached.nodes[i]; i++) if (node.parentNode !== null) node.parentNode.removeChild(node)
				for (var i = cached.nodes.length, node; node = nodes[i]; i++) if (node.parentNode === null) parent.appendChild(node)
				cached.length = data.length
				cached.nodes = nodes
			}
		}
		else if (dataType == "[object Object]") {
			if (data.tag != cached.tag || Object.keys(data.attrs).join() != Object.keys(cached.attrs).join()) clear(cached.nodes)
			
			var node, isNew = cached.nodes.length === 0
			if (isNew) {
				node = window.document.createElement(data.tag)
				cached = {tag: data.tag, attrs: setAttributes(node, data.attrs, {}), children: build(node, data.children, cached.children), nodes: [node]}
				parent.appendChild(node)
			}
			else {
				node = cached.nodes[0]
				setAttributes(node, data.attrs, cached.attrs)
				cached.children = build(node, data.children, cached.children)
				cached.nodes.intact = true
			}
			if (type.call(data.attrs["config"]) == "[object Function]") data.attrs["config"](node, !isNew)
		}
		else {
			var node
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					var lastChild = parent.lastChild
					parent.insertAdjacentHTML("beforeend", data)
					node = lastChild ? lastChild.nextSibling : parent.firstChild
				}
				else {
					node = window.document.createTextNode(data)
					parent.appendChild(node)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data
				cached.nodes = [node]
			}
			else if (cached.valueOf() !== data.valueOf()) {
				if (data.$trusted) {
					var current = cached.nodes[0], nodes = [current]
					if (current) {
						while (current = current.nextSibling) nodes.push(current)
						clear(nodes)
						var lastChild = parent.lastChild
						parent.insertAdjacentHTML("beforeend", data)
						node = lastChild ? lastChild.nextSibling : parent.firstChild
					}
					else parent.innerHTML = data
				}
				else {
					node = cached.nodes[0]
					parent.appendChild(node)
					node.nodeValue = data
				}
				cached = new data.constructor(data)
				cached.nodes = [node]
			}
			else cached.nodes.intact = true
		}
		
		return cached
	}
	function setAttributes(node, dataAttrs, cachedAttrs) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName]
			if (!(attrName in cachedAttrs) || (cachedAttrs[attrName] !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr
				if (attrName == "config") continue
				if (attrName.indexOf("on") == 0 && typeof dataAttr == "function") dataAttr = autoredraw(dataAttr, node)
				if (attrName == "style") for (var rule in dataAttr) node.style[rule] = dataAttr[rule]
				else if (attrName in node) node[attrName] = dataAttr
				else node.setAttribute(attrName, dataAttr)
			}
		}
		return cachedAttrs
	}
	function clear(nodes) {
		for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i])
		nodes.length = 0
	}
	function clone(object) {
		var result = {}
		for (var prop in object) result[prop] = object[prop]
		return result
	}
	function autoredraw(callback, object) {
		return function() {
			m.startComputation()
			var output = callback.apply(object || window, arguments)
			m.endComputation()
			return output
		}
	}
	
	var html
	var documentNode = {
		insertAdjacentHTML: function(_, data) {
			window.document.write(data)
			window.document.close()
		},
		appendChild: function(node) {
			if (html === undefined) html = window.document.createElement("html")
			if (node.nodeName == "HTML") html = node
			else html.appendChild(node)
			if (window.document.documentElement !== html) {
				window.document.replaceChild(html, window.document.documentElement)
			}
		}
	}
	var nodeCache = [], cellCache = {}
	m.render = function(root, cell) {
		var index = nodeCache.indexOf(root)
		var id = index < 0 ? nodeCache.push(root) - 1 : index
		var node = root == window.document || root == window.document.documentElement ? documentNode : root
		cellCache[id] = build(node, cell, cellCache[id])
	}
	
	m.trust = function(value) {
		value = new String(value)
		value.$trusted = true
		return value
	}
	
	var currentRoot, currentModule = {view: function() {}}, currentController = {}, now = 0, lastRedraw = 0, lastRedrawId = 0
	m.module = function(root, module) {
		m.startComputation()
		currentRoot = root
		currentModule = module
		currentController = new module.controller
		m.endComputation()
	}
	m.redraw = function() {
		m.render(currentRoot || window.document, currentModule.view(currentController))
		lastRedraw = now
	}
	function redraw() {
		now = window.performance && window.performance.now ? window.performance.now() : new window.Date().getTime()
		if (now - lastRedraw > 16) m.redraw()
		else {
			var cancel = window.cancelAnimationFrame || window.clearTimeout
			var defer = window.requestAnimationFrame || window.setTimeout
			cancel(lastRedrawId)
			lastRedrawId = defer(m.redraw, 0)
		}
	}
	
	var pendingRequests = 0, computePostRedrawHook = null
	m.startComputation = function() {pendingRequests++}
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0)
		if (pendingRequests == 0) {
			redraw()
			if (computePostRedrawHook) {
				computePostRedrawHook()
				computePostRedrawHook = null
			}
		}
	}
	
	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {withAttrCallback(prop in e.currentTarget ? e.currentTarget[prop] : e.currentTarget.getAttribute(prop))}
	}
	
	//routing
	var modes = {pathname: "", hash: "#", search: "?"}
	var redirect = function() {}, routeParams = {}
	m.route = function() {
		if (arguments.length == 3) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2]
			redirect = function(source) {
				var path = source.slice(modes[m.route.mode].length)
				if (!routeByValue(root, router, path)) {
					m.route(defaultRoute, true)
				}
			}
			var listener = m.route.mode == "hash" ? "onhashchange" : "onpopstate"
			window[listener] = function() {
				redirect(window.location[m.route.mode])
			}
			computePostRedrawHook = scrollToHash
			window[listener]()
		}
		else if (arguments[0].addEventListener) {
			var element = arguments[0]
			var isInitialized = arguments[1]
			if (!isInitialized) {
				element.removeEventListener("click", routeUnobtrusive)
				element.addEventListener("click", routeUnobtrusive)
			}
		}
		else if (typeof arguments[0] == "string") {
			var route = arguments[0]
			var shouldReplaceHistoryEntry = arguments[1] === true
			if (window.history.pushState) {
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, window.document.title, modes[m.route.mode] + route)
					scrollToHash()
				}
				redirect(modes[m.route.mode] + route)
			}
			else window.location[m.route.mode] = route
		}
	}
	m.route.param = function(key) {return routeParams[key]}
	m.route.mode = "search"
	function routeByValue(root, router, path) {
		for (var route in router) {
			if (route == path) return !void m.module(root, router[route])
			
			var matcher = new RegExp("^" + route.replace(/:[^\/]+/g, "([^\\/]+)") + "$")
			if (matcher.test(path)) {
				return !void path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g)
					var values = [].slice.call(arguments, 1, -2)
					routeParams = {}
					for (var i = 0; i < keys.length; i++) routeParams[keys[i].slice(1)] = values[i]
					m.module(root, router[route])
				})
			}
		}
	}
	function routeUnobtrusive(e) {
		e.preventDefault()
		m.route(e.currentTarget.getAttribute("href"))
	}
	function scrollToHash() {
		if (m.route.mode != "hash" && window.location.hash) window.location.hash = window.location.hash
	}
	
	//model
	m.prop = function(store) {
		return function() {
			if (arguments.length) store = arguments[0]
			return store
		}
	}

	m.deferred = function() {
		var resolvers = [], rejecters = []
		var object = {
			resolve: function(value) {
				for (var i = 0; i < resolvers.length; i++) resolvers[i](value)
			},
			reject: function(value) {
				for (var i = 0; i < rejecters.length; i++) rejecters[i](value)
			},
			promise: m.prop()
		}
		object.promise.resolvers = resolvers
		object.promise.then = function(success, error) {
			var next = m.deferred()
			if (!success) success = identity
			if (!error) error = identity
			resolvers.push(function(value) {
				var result = success(value)
				next.resolve(result !== undefined ? result : value)
			})
			rejecters.push(function(value) {
				var result = error(value)
				next.reject(result !== undefined ? result : value)
			})
			return next.promise
		}
		return object
	}
	m.sync = function(args) {
		var method = "resolve"
		function synchronizer(resolved) {
			return function(value) {
				results.push(value)
				if (!resolved) method = "reject"
				if (results.length == args.length) {
					deferred.promise(results)
					deferred[method](results)
				}
				return value
			}
		}
		
		var deferred = m.deferred()
		var results = []
		for (var i = 0; i < args.length; i++) {
			args[i].then(synchronizer(true), synchronizer(false))
		}
		return deferred.promise
	}
	function identity(value) {return value}

	function ajax(options) {
		var xhr = window.XDomainRequest ? new window.XDomainRequest : new window.XMLHttpRequest
		xhr.open(options.method, options.url, true, options.user, options.password)
		xhr.onload = typeof options.onload == "function" ? options.onload : function() {}
		xhr.onerror = typeof options.onerror == "function" ? options.onerror : function() {}
		xhr.withCredentials = true
		if (typeof options.config == "function") options.config(xhr, options)
		xhr.send(options.data)
		return xhr
	}
	function querystring(object, prefix) {
		var str = []
		for(var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop, value = object[prop]
			str.push(typeof value == "object" ? querystring(value, key) : encodeURIComponent(key) + "=" + encodeURIComponent(value))
		}
		return str.join("&")
	}
	function bindData(xhrOptions, data, serialize) {
		if (data && Object.keys(data).length > 0) {
			if (xhrOptions.method == "GET") {
				xhrOptions.url = xhrOptions.url + (xhrOptions.url.indexOf("?") < 0 ? "?" : "&") + querystring(data)
			}
			else xhrOptions.data = serialize(data)
		}
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:\w+/g)
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1)
				url = url.replace(tokens[i], data[key])
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		m.startComputation()
		var deferred = m.deferred()
		var serialize = xhrOptions.serialize || JSON.stringify
		var deserialize = xhrOptions.deserialize || JSON.parse
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data)
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize)
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			var unwrap = (e.type == "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity
			var response = unwrap(deserialize(e.target.responseText))
			if (response instanceof Array && xhrOptions.type) {
				for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
			}
			else if (xhrOptions.type) response = new xhrOptions.type(response)
			deferred.promise(response)
			deferred[e.type == "load" ? "resolve" : "reject"](response)
			m.endComputation()
		}
		ajax(xhrOptions)
		deferred.promise.then = propBinder(deferred.promise)
		return deferred.promise
	}
	function propBinder(promise) {
		var bind = promise.then
		return function(success, error) {
			var next = bind(function(value) {return next(success(value))}, function(value) {return next(error(value))})
			next.then = propBinder(next)
			return next
		}
	}
	
	//testing API
	m.deps = function(mock) {return window = mock}
}(this)
function test(condition) {
	try {if (!condition()) throw new Error}
	catch (e) {console.error(e);test.failures.push(condition)}
	test.total++
}
test.total = 0
test.failures = []
test.print = function(print) {
	for (var i = 0; i < test.failures.length; i++) {
		print(test.failures[i].toString())
	}
	print("tests: " + test.total + "\nfailures: " + test.failures.length)
}
var mock = {}
mock.window = new function() {
	var window = {}
	window.document = {}
	window.document.childNodes = []
	window.document.createElement = function(tag) {
		return {
			childNodes: [],
			nodeName: tag.toUpperCase(),
			appendChild: window.document.appendChild,
			removeChild: window.document.removeChild,
			replaceChild: window.document.replaceChild,
			setAttribute: function(name, value) {
				this[name] = value.toString()
			},
			getAttribute: function(name, value) {
				return this[name]
			},
		}
	}
	window.document.createTextNode = function(text) {
		return {nodeValue: text.toString()}
	}
	window.document.documentElement = null
	window.document.replaceChild = function(newChild, oldChild) {
		var index = this.childNodes.indexOf(oldChild)
		if (index > -1) this.childNodes.splice(index, 1, newChild)
		else this.childNodes.push(newChild)
		newChild.parentNode = this
		oldChild.parentNode = null
	}
	window.document.appendChild = function(child) {
		this.childNodes.push(child)
		child.parentNode = this
	}
	window.document.removeChild = function(child) {
		var index = this.childNodes.indexOf(child)
		this.childNodes.splice(index, 1)
		child.parentNode = null
	}
	window.performance = new function () {
		var timestamp = 50
		this.$elapse = function(amount) {timestamp += amount}
		this.now = function() {return timestamp}
	}
	window.cancelAnimationFrame = function() {}
	window.requestAnimationFrame = function(callback) {window.requestAnimationFrame.$callback = callback}
	window.requestAnimationFrame.$resolve = function() {
		if (window.requestAnimationFrame.$callback) window.requestAnimationFrame.$callback()
		window.requestAnimationFrame.$callback = null
		window.performance.$elapse(20)
	}
	window.XMLHttpRequest = new function() {
		var request = function() {
			this.open = function(method, url) {
				this.method = method
				this.url = url
			}
			this.send = function() {
				this.responseText = JSON.stringify(this)
				request.$events.push({type: "load", target: this})
			}
		}
		request.$events = []
		return request
	}
	window.location = {search: "", pathname: "", hash: ""},
	window.history = {}
	window.history.pushState = function(data, title, url) {
		window.location.pathname = window.location.search = window.location.hash = url
	},
	window.history.replaceState = function(data, title, url) {
		window.location.pathname = window.location.search = window.location.hash = url
	}
	return window
}
function testMithril(mock) {
	m.deps(mock)
	
	//m
	test(function() {return m("div").tag === "div"})
	test(function() {return m(".foo").tag === "div"})
	test(function() {return m(".foo").attrs.className === "foo"})
	test(function() {return m("[title=bar]").tag === "div"})
	test(function() {return m("[title=bar]").attrs.title === "bar"})
	test(function() {return m("[title=\'bar\']").attrs.title === "bar"})
	test(function() {return m("[title=\"bar\"]").attrs.title === "bar"})
	test(function() {return m("div", "test").children === "test"})
	test(function() {return m("div", ["test"]).children[0] === "test"})
	test(function() {return m("div", {title: "bar"}, "test").attrs.title === "bar"})
	test(function() {return m("div", {title: "bar"}, "test").children === "test"})
	test(function() {return m("div", {title: "bar"}, ["test"]).children[0] === "test"})
	test(function() {return m("div", {title: "bar"}, m("div")).children.tag === "div"})
	test(function() {return m("div", {title: "bar"}, [m("div")]).children[0].tag === "div"})
	test(function() {return m("div", ["a", "b"]).children.length === 2})
	test(function() {return m("div", [m("div")]).children[0].tag === "div"})
	test(function() {return m("div", m("div")).attrs.tag === "div"}) //yes, this is expected behavior: see method signature

	//m.module
	test(function() {
		mock.performance.$elapse(50)
		
		var root1 = mock.document.createElement("div")
		m.module(root1, {
			controller: function() {this.value = "test1"},
			view: function(ctrl) {return ctrl.value}
		})
		
		var root2 = mock.document.createElement("div")
		m.module(root2, {
			controller: function() {this.value = "test2"},
			view: function(ctrl) {return ctrl.value}
		})
		
		mock.requestAnimationFrame.$resolve()
		
		return root1.childNodes[0].nodeValue === "test1" && root2.childNodes[0].nodeValue === "test2"
	})

	//m.withAttr
	test(function() {
		var value
		var handler = m.withAttr("test", function(data) {value = data})
		handler({currentTarget: {test: "foo"}})
		return value === "foo"
	})

	//m.trust
	test(function() {return m.trust("test").valueOf() === "test"})

	//m.render
	test(function() {
		var root = mock.document.createElement("div")
		m.render(root, "test")
		return root.childNodes[0].nodeValue === "test"
	})
	test(function() {
		var root = mock.document.createElement("div")
		m.render(root, m("div", {id: "a"}))
		var elementBefore = root.childNodes[0]
		m.render(root, m("div", {id: "b"}))
		var elementAfter = root.childNodes[0]
		return elementBefore === elementAfter
	})
	test(function() {
		var root = mock.document.createElement("div")
		m.render(root, m("#a"))
		var elementBefore = root.childNodes[0]
		m.render(root, m("#b"))
		var elementAfter = root.childNodes[0]
		return elementBefore === elementAfter
	})
	test(function() {
		var root = mock.document.createElement("div")
		m.render(root, m("div", {id: "a"}))
		var elementBefore = root.childNodes[0]
		m.render(root, m("div", {title: "b"}))
		var elementAfter = root.childNodes[0]
		return elementBefore !== elementAfter
	})
	test(function() {
		var root = mock.document.createElement("div")
		m.render(root, m("#a"))
		var elementBefore = root.childNodes[0]
		m.render(root, m("[title=b]"))
		var elementAfter = root.childNodes[0]
		return elementBefore !== elementAfter
	})
	test(function() {
		var root = mock.document.createElement("div")
		m.render(root, m("#a"))
		var elementBefore = root.childNodes[0]
		m.render(root, "test")
		var elementAfter = root.childNodes[0]
		return elementBefore !== elementAfter
	})

	//m.redraw
	test(function() {
		var controller
		var root = mock.document.createElement("div")
		m.module(root, {
			controller: function() {controller = this},
			view: function(ctrl) {return ctrl.value}
		})
		controller.value = "foo"
		m.redraw()
		return root.childNodes[0].nodeValue === "foo"
	})

	//m.route
	test(function() {
		mock.performance.$elapse(50)
		
		var root = mock.document.createElement("div")
		m.route.mode = "search"
		m.route(root, "/test1", {
			"/test1": {controller: function() {}, view: function() {return "foo"}}
		})
		return mock.location.search == "?/test1" && root.childNodes[0].nodeValue === "foo"
	})
	test(function() {
		mock.performance.$elapse(50)
		
		var root = mock.document.createElement("div")
		m.route.mode = "pathname"
		m.route(root, "/test2", {
			"/test2": {controller: function() {}, view: function() {return "foo"}}
		})
		return mock.location.pathname == "/test2" && root.childNodes[0].nodeValue === "foo"
	})
	test(function() {
		mock.performance.$elapse(50)
		
		var root = mock.document.createElement("div")
		m.route.mode = "hash"
		m.route(root, "/test3", {
			"/test3": {controller: function() {}, view: function() {return "foo"}}
		})
		return mock.location.hash == "#/test3" && root.childNodes[0].nodeValue === "foo"
	})
	test(function() {
		mock.performance.$elapse(50)
		
		var root = mock.document.createElement("div")
		m.route.mode = "search"
		m.route(root, "/test4/foo", {
			"/test4/:test": {controller: function() {}, view: function() {return m.route.param("test")}}
		})
		return mock.location.search == "?/test4/foo" && root.childNodes[0].nodeValue === "foo"
	})

	//m.prop
	test(function() {
		var prop = m.prop("test")
		return prop() === "test"
	})
	test(function() {
		var prop = m.prop("test")
		prop("foo")
		return prop() == "foo"
	})

	//m.request
	test(function() {
		var prop = m.request({method: "GET", url: "test"})
		var e = mock.XMLHttpRequest.$events.pop()
		e.target.onload(e)
		return prop().method === "GET" && prop().url === "test"
	})
	test(function() {
		var prop = m.request({method: "GET", url: "test"}).then(function(value) {return "foo"})
		var e = mock.XMLHttpRequest.$events.pop()
		e.target.onload(e)
		return prop() === "foo"
	})

	//m.deferred
	test(function() {
		var value
		var deferred = m.deferred()
		deferred.promise.then(function(data) {value = data})
		deferred.resolve("test")
		return value === "test"
	})
	test(function() {
		var value
		var deferred = m.deferred()
		deferred.promise.then(function(value) {return "foo"}).then(function(data) {value = data})
		deferred.resolve("test")
		return value === "foo"
	})
	test(function() {
		var value
		var deferred = m.deferred()
		deferred.promise.then(null, function(data) {value = data})
		deferred.reject("test")
		return value === "test"
	})
	test(function() {
		var value
		var deferred = m.deferred()
		deferred.promise.then(null, function(value) {return "foo"}).then(null, function(data) {value = data})
		deferred.reject("test")
		return value === "foo"
	})

	//m.sync
	test(function() {
		var value
		var deferred1 = m.deferred()
		var deferred2 = m.deferred()
		m.sync([deferred1.promise, deferred2.promise]).then(function(data) {value = data})
		deferred1.resolve("test")
		deferred2.resolve("foo")
		return value[0] === "test" && value[1] === "foo"
	})

	//m.startComputation/m.endComputation
	test(function() {
		mock.performance.$elapse(50)
		
		var controller
		var root = mock.document.createElement("div")
		m.module(root, {
			controller: function() {controller = this},
			view: function(ctrl) {return ctrl.value}
		})
		
		mock.performance.$elapse(50)
		
		m.startComputation()
		controller.value = "foo"
		m.endComputation()
		return root.childNodes[0].nodeValue === "foo"
	})
}

//mocks
testMithril(mock.window)

test.print(console.log)