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
	function build(parent, data, cached, shouldReattach, index, namespace) {
		if (data === null || data === undefined) {
			if (cached) clear(cached.nodes)
			return 
		}
		if (data.subtree === "retain") return
		
		var cachedType = type.call(cached), dataType = type.call(data)
		if (cachedType != dataType) {
			if (cached !== null && cached !== undefined) clear(cached.nodes)
			cached = new data.constructor
			cached.nodes = []
		}
		
		if (dataType == "[object Array]") {
			var nodes = [], intact = cached.length === data.length
			for (var i = 0; i < data.length; i++) {
				var item = build(parent, data[i], cached[i], shouldReattach, index + i || i, namespace)
				if (item === undefined) continue
				if (!item.nodes.intact) intact = false
				cached[i] = item
			}
			if (!intact) {
				for (var i = 0; i < data.length; i++) if (cached[i] !== undefined) nodes = nodes.concat(cached[i].nodes)
				for (var i = nodes.length, node; node = cached.nodes[i]; i++) if (node.parentNode !== null) node.parentNode.removeChild(node)
				for (var i = cached.nodes.length, node; node = nodes[i]; i++) if (node.parentNode === null) parent.appendChild(node)
				cached.length = data.length
				cached.nodes = nodes
			}
		}
		else if (dataType == "[object Object]") {
			if (data.tag != cached.tag || Object.keys(data.attrs).join() != Object.keys(cached.attrs).join()) clear(cached.nodes)
			if (typeof data.tag != "string") return
			
			var node, isNew = cached.nodes.length === 0
			if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg"
			if (isNew) {
				node = namespace === undefined ? window.document.createElement(data.tag) : window.document.createElementNS(namespace, data.tag)
				cached = {
					tag: data.tag,
					attrs: setAttributes(node, data.attrs, {}, namespace),
					children: build(node, data.children, cached.children, true, index, namespace),
					nodes: [node]
				}
				parent.insertBefore(node, index !== undefined ? parent.childNodes[index] : null)
			}
			else {
				node = cached.nodes[0]
				setAttributes(node, data.attrs, cached.attrs, namespace)
				cached.children = build(node, data.children, cached.children, false, index, namespace)
				cached.nodes.intact = true
				if (shouldReattach === true) parent.insertBefore(node, index !== undefined ? parent.childNodes[index] : null)
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
					parent.insertBefore(node, index !== undefined ? parent.childNodes[index] : null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data
				cached.nodes = [node]
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
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
					parent.insertBefore(node, index !== undefined ? parent.childNodes[index] : null)
					node.nodeValue = data
				}
				cached = new data.constructor(data)
				cached.nodes = [node]
			}
			else cached.nodes.intact = true
		}
		
		return cached
	}
	function setAttributes(node, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName]
			var cachedAttr = cachedAttrs[attrName]
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr) || node === window.document.activeElement) {
				cachedAttrs[attrName] = dataAttr
				if (attrName === "config") continue
				else if (typeof dataAttr == "function" && attrName.indexOf("on") == 0) {
					node[attrName] = autoredraw(dataAttr, node)
				}
				else if (attrName === "style") {
					for (var rule in dataAttr) {
						if (cachedAttr === undefined || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
					}
				}
				else if (namespace !== undefined) {
					if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr)
					else if (attrName === "className") node.setAttribute("class", dataAttr)
					else node.setAttribute(attrName, dataAttr)
				}
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
		return function(e) {
			m.startComputation()
			var output = callback.call(object, e)
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
		},
		insertBefore: function(node, reference) {
			this.appendChild(node)
		}
	}
	var nodeCache = [], cellCache = {}
	m.render = function(root, cell) {
		var index = nodeCache.indexOf(root)
		var id = index < 0 ? nodeCache.push(root) - 1 : index
		var node = root == window.document || root == window.document.documentElement ? documentNode : root
		cellCache[id] = build(node, cell, cellCache[id], false)
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
		m.render(currentRoot, currentModule.view(currentController))
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
		routeParams = {}
		for (var route in router) {
			if (route == path) return !void m.module(root, router[route])
			
			var matcher = new RegExp("^" + route.replace(/:[^\/]+/g, "([^\\/]+)") + "$")
			if (matcher.test(path)) {
				return !void path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g)
					var values = [].slice.call(arguments, 1, -2)
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
			function push(list, method, callback) {
				list.push(function(value) {
					try {
						var result = callback(value)
						if (result && typeof result.then == "function") result.then(next[method], error)
						else next[method](result !== undefined ? result : value)
					}
					catch (e) {
						if (e instanceof Error && e.constructor !== Error) throw e
						else next.reject(e)
					}
				})
			}
			push(resolvers, "resolve", success)
			push(rejecters, "reject", error)
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
		var tokens = url.match(/:[a-z]\w+/gi)
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
	
	if (typeof module != "undefined" && module !== null) module.exports = m
	if (typeof define == "function" && define.amd) define(function() {return m})
	
	//testing API
	m.deps = function(mock) {return window = mock}
}(this)