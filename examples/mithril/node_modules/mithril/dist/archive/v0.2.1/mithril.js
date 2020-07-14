;(function (global, factory) { // eslint-disable-line
	"use strict"
	/* eslint-disable no-undef */
	var m = factory(typeof window !== "undefined" ? window : {})
	if (typeof module === "object" && module != null && module.exports) {
		module.exports = m
	} else if (typeof define === "function" && define.amd) {
		define(function () { return m })
	} else {
		global.m = m
	}
	/* eslint-enable no-undef */
})(this, function (window, undefined) { // eslint-disable-line
	"use strict"

	m.version = function () {
		return "v0.2.1"
	}

	// Save these two.
	var type = {}.toString
	var hasOwn = {}.hasOwnProperty

	function isFunction(object) {
		return typeof object === "function"
	}

	function isObject(object) {
		return type.call(object) === "[object Object]"
	}

	function isString(object) {
		return type.call(object) === "[object String]"
	}

	var isArray = Array.isArray || function (object) {
		return type.call(object) === "[object Array]"
	}

	function noop() {}

	function forEach(list, f) {
		for (var i = 0; i < list.length; i++) {
			f(list[i], i)
		}
	}

	function forOwn(obj, f) {
		for (var prop in obj) {
			if (hasOwn.call(obj, prop)) {
				f(obj[prop], prop)
			}
		}
	}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame

	// self invoking function needed because of the way mocks work
	function initialize(window) {
		$document = window.document
		$location = window.location
		$cancelAnimationFrame = window.cancelAnimationFrame ||
			window.clearTimeout
		$requestAnimationFrame = window.requestAnimationFrame ||
			window.setTimeout
	}

	initialize(window)

	// testing API
	m.deps = function (mock) {
		initialize(window = mock || window)
		return window
	}

	function gettersetter(store) {
		function prop() {
			if (arguments.length) store = arguments[0]
			return store
		}

		prop.toJSON = function () {
			return store
		}

		return prop
	}

	function isPromise(object) {
		return object != null && (isObject(object) || isFunction(object)) &&
				isFunction(object.then)
	}

	function simpleResolve(p, callback) {
		if (p.then) {
			return p.then(callback)
		} else {
			return callback()
		}
	}

	function propify(promise) {
		var prop = m.prop()
		promise.then(prop)

		prop.then = function (resolve, reject) {
			return promise.then(function () {
				return resolve(prop())
			}, reject)
		}

		prop.catch = function (reject) {
			return promise.then(function () {
				return prop()
			}, reject)
		}

		prop.finally = function (callback) {
			return promise.then(function (value) {
				return simpleResolve(callback(), function () {
					return value
				})
			}, function (reason) {
				return simpleResolve(callback(), function () {
					throw reason
				})
			})
		}

		return prop
	}

	m.prop = function (store) {
		if (isPromise(store)) {
			return propify(store)
		} else {
			return gettersetter(store)
		}
	}

	/**
	* @typedef {String} Tag
	* A string that looks like -> div.classname#id[param=one][param2=two]
	* Which describes a DOM node
	*/

	function checkForAttrs(pairs) {
		return pairs != null && isObject(pairs) &&
			!("tag" in pairs || "view" in pairs || "subtree" in pairs)
	}

	function parseSelector(tag, cell) {
		var classes = []
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g
		var match
		while ((match = parser.exec(tag)) != null) {
			if (match[1] === "" && match[2] != null) {
				cell.tag = match[2]
			} else if (match[1] === "#") {
				cell.attrs.id = match[2]
			} else if (match[1] === ".") {
				classes.push(match[2])
			} else if (match[3][0] === "[") {
				var pair = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/.exec(match[3])
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" : true)
			}
		}

		return classes
	}

	function assignAttrs(target, attrs, classAttr, classes) {
		var hasClass = false
		if (hasOwn.call(attrs, classAttr)) {
			var value = attrs[classAttr]
			if (value != null && value !== "") {
				hasClass = true
				classes.push(value)
			}
		}

		forOwn(attrs, function (value, attr) {
			target[attr] = attr === classAttr && hasClass ? "" : value
		})

		if (classes.length) {
			target[classAttr] = classes.join(" ")
		}
	}

	function parameterize(component) {
		var args = []
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i])
		}

		var originalCtrl = component.controller || noop

		function Ctrl() {
			return originalCtrl.apply(this, args) || this
		}

		if (originalCtrl !== noop) {
			Ctrl.prototype = originalCtrl.prototype
		}

		var originalView = component.view || noop

		function view(ctrl) {
			var rest = [ctrl].concat(args)
			for (var i = 1; i < arguments.length; i++) {
				rest.push(arguments[i])
			}

			return originalView.apply(component, rest)
		}

		view.$original = originalView
		var output = {controller: Ctrl, view: view}

		if (args[0] && args[0].key != null) {
			output.attrs = {key: args[0].key}
		}

		return output
	}

	m.component = parameterize

	/**
	* @param {Tag} The DOM node tag
	* @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	* @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array,
	*                      or splat (optional)
	*/
	function m(tag, pairs) {
		// The arguments are passed directly like this to delay array
		// allocation.
		if (isObject(tag)) return parameterize.apply(null, arguments)

		if (!isString(tag)) {
			throw new TypeError("selector in m(selector, attrs, children) " +
				"should be a string")
		}

		// Degenerate case frequently trips people up. Check for it here so that
		// people know it doesn't work.
		if (!tag) {
			throw new TypeError("selector cannot be an empty string")
		}

		var hasAttrs = checkForAttrs(pairs)

		var args = []
		for (var i = hasAttrs ? 2 : 1; i < arguments.length; i++) {
			args.push(arguments[i])
		}

		var children

		if (args.length === 1 && isArray(args[0])) {
			children = args[0]
		} else {
			children = args
		}

		var cell = {
			tag: "div",
			attrs: {},
			children: children
		}

		assignAttrs(
			cell.attrs,
			hasAttrs ? pairs : {},
			hasAttrs && "class" in pairs ? "class" : "className",
			parseSelector(tag, cell)
		)

		return cell
	}

	function forKeys(list, f) {
		for (var i = 0; i < list.length; i++) {
			var attrs = list[i]
			attrs = attrs && attrs.attrs
			if (attrs && attrs.key != null && f(attrs, i)) {
				break
			}
		}
	}

	// This function was causing deopts in Chrome.
	function dataToString(data) {
		// data.toString() might throw or return null if data is the return
		// value of Console.log in some versions of Firefox
		try {
			if (data != null && data.toString() != null) {
				return data
			}
		} catch (e) {
			// Swallow all errors here.
		}

		return ""
	}

	function flatten(list) {
		// recursively flatten array
		for (var i = 0; i < list.length; i++) {
			if (isArray(list[i])) {
				list = list.concat.apply([], list)
				// check current index again while there is an array at this
				// index.
				i--
			}
		}

		return list
	}

	function insertNode(parent, node, index) {
		parent.insertBefore(node, parent.childNodes[index] || null)
	}

	// the below recursively manages creation/diffing/removal of DOM elements
	// based on comparison between `data` and `cached`
	//
	// the diff algorithm can be summarized as this:
	// 1) compare `data` and `cached`
	// 2) if they are different, copy `data` to `cached` and update the DOM
	//    based on what the difference is
	// 3) recursively apply this algorithm for every array and for the
	//    children of every virtual element
	//
	// the `cached` data structure is essentially the same as the previous
	// redraw's `data` data structure, with a few additions:
	// - `cached` always has a property called `nodes`, which is a list of
	//    DOM elements that correspond to the data represented by the
	//    respective virtual element
	// - in order to support attaching `nodes` as a property of `cached`,
	//    `cached` is *always* a non-primitive object, i.e. if the data was
	//    a string, then cached is a String instance. If data was `null` or
	//    `undefined`, cached is `new String("")`
	// - `cached also has a `cfgCtx` property, which is the state
	//    storage object exposed by config(element, isInitialized, context)
	// - when `cached` is an Object, it represents a virtual element; when
	//    it's an Array, it represents a list of elements; when it's a
	//    String, Number or Boolean, it represents a text node
	//
	// `parent` is a DOM element used for W3C DOM API calls
	// `pTag` is only used for handling a corner case for textarea values
	// `pCache` is used to remove nodes in some multi-node cases
	// `pIndex` and `index` are used to figure out the offset of nodes.
	// They're artifacts from before arrays started being flattened and are
	// likely refactorable
	// `data` and `cached` are, respectively, the new and old nodes being
	// diffed
	// `reattach` is a flag indicating whether a parent node was recreated (if
	// so, and if this node is reused, then this node must reattach itself to
	// the new parent)
	// `editable` is a flag that indicates whether an ancestor is
	// contenteditable
	// `ns` indicates the closest HTML namespace as it cascades down from an
	// ancestor
	// `cfgs` is a list of config functions to run after the topmost build call
	// finishes running
	//
	// there's logic that relies on the assumption that null and undefined
	// data are equivalent to empty strings
	// - this prevents lifecycle surprises from procedural helpers that mix
	//   implicit and explicit return statements (e.g.
	//   function foo() {if (cond) return m("div")}
	// - it simplifies diffing code

	function buildContext(
		parentElement,
		parentTag,
		parentCache,
		parentIndex,
		data,
		cached,
		shouldReattach,
		index,
		editable,
		namespace,
		configs
	) {
		return {
			parent: parentElement,
			pTag: parentTag,
			pCache: parentCache,
			pIndex: parentIndex,
			data: data,
			cached: cached,
			reattach: shouldReattach,
			index: index,
			editable: editable,
			ns: namespace,
			cfgs: configs
		}
	}

	function builderBuild(inst) {
		inst.data = dataToString(inst.data)
		if (inst.data.subtree === "retain") return inst.cached
		builderMakeCache(inst)

		if (isArray(inst.data)) {
			return builderBuildArray(inst)
		} else if (inst.data != null && isObject(inst.data)) {
			return builderBuildObject(inst)
		} else if (isFunction(inst.data)) {
			return inst.cached
		} else {
			return builderHandleTextNode(inst)
		}
	}

	function builderMakeCache(inst) {
		if (inst.cached != null) {
			if (type.call(inst.cached) === type.call(inst.data)) {
				return
			}

			if (inst.pCache && inst.pCache.nodes) {
				var offset = inst.index - inst.pIndex
				var end = offset +
					(isArray(inst.data) ? inst.data : inst.cached.nodes).length

				clear(
					inst.pCache.nodes.slice(offset, end),
					inst.pCache.slice(offset, end))
			} else if (inst.cached.nodes) {
				clear(inst.cached.nodes, inst.cached)
			}
		}

		inst.cached = new inst.data.constructor()
		// if constructor creates a virtual dom element, use a blank object as
		// the base cached node instead of copying the virtual el (#277)
		if (inst.cached.tag) inst.cached = {}
		inst.cached.nodes = []
	}

	var DELETION = 1
	var INSERTION = 2
	var MOVE = 3

	function buildArrayKeys(data) {
		var guid = 0
		forKeys(data, function () {
			forEach(data, function (attrs) {
				attrs = attrs && attrs.attrs
				if (attrs && attrs.key == null) {
					attrs.key = "__mithril__" + guid++
				}
			})
			return true
		})
	}

	function builderBuildArrayChild(inst, child, cached, count) {
		return builderBuild(buildContext(
			inst.parent,
			inst.pTag,
			inst.cached,
			inst.index,
			child,
			cached,
			inst.reattach,
			inst.index + count || count,
			inst.editable,
			inst.ns,
			inst.cfgs
		))
	}

	// This is by far the most performance-sensitive method here. If you make
	// any changes, be careful to avoid performance regressions. Note that
	// variable caching doesn't help, even in the loop.
	function builderBuildArray(inst) { // eslint-disable-line max-statements
		inst.data = flatten(inst.data)
		var nodes = []
		var intact = inst.cached.length === inst.data.length
		var subArrayCount = 0

		// keys algorithm:
		// sort elements without recreating them if keys are present
		//
		// 1) create a map of all existing keys, and mark all for deletion
		// 2) add new keys to map and mark them for addition
		// 3) if key exists in new list, change action from deletion to a move
		// 4) for each key, handle its corresponding action as marked in
		//    previous steps
		var existing = {}
		var shouldMaintainIdentities = false
		forKeys(inst.cached, function (attrs, i) {
			shouldMaintainIdentities = true
			existing[attrs.key] = {
				action: DELETION,
				index: i
			}
		})

		buildArrayKeys(inst.data)
		if (shouldMaintainIdentities) {
			builderDiffKeys(inst, existing)
		}
		// end key algorithm

		// don't change: faster than forEach
		var cacheCount = 0
		for (var i = 0, len = inst.data.length; i < len; i++) {
			// diff each item in the array
			var item = builderBuildArrayChild(
				inst,
				inst.data[i],
				inst.cached[cacheCount],
				subArrayCount
			)

			if (item !== undefined) {
				intact = intact && item.nodes.intact
				subArrayCount += getSubArrayCount(item)
				inst.cached[cacheCount++] = item
			}
		}

		if (!intact) builderDiffArray(inst, nodes)

		return inst.cached
	}

	function builderDiffKeys(inst, existing) {
		var keysDiffer = inst.data.length !== inst.cached.length

		if (!keysDiffer) {
			forKeys(inst.data, function (attrs, i) {
				var cachedCell = inst.cached[i]
				return keysDiffer =
					cachedCell &&
					cachedCell.attrs &&
					cachedCell.attrs.key !== attrs.key
			})
		}

		if (keysDiffer) {
			builderHandleKeysDiffer(inst, existing)
		}
	}

	function builderHandleKeysDiffer(inst, existing) {
		var cached = inst.cached.nodes
		forKeys(inst.data, function (key, i) {
			key = key.key
			if (existing[key]) {
				existing[key] = {
					action: MOVE,
					index: i,
					from: existing[key].index,
					element: cached[existing[key].index] ||
						$document.createElement("div")
				}
			} else {
				existing[key] = {
					action: INSERTION,
					index: i
				}
			}
		})

		var actions = []
		forOwn(existing, function (value) {
			actions.push(value)
		})

		var changes = actions.sort(sortChanges)
		var newCached = new Array(inst.cached.length)
		newCached.nodes = inst.cached.nodes.slice()

		forEach(changes, function (change) {
			var index = change.index

			switch (change.action) {
			case DELETION:
				clear(inst.cached[index].nodes, inst.cached[index])
				newCached.splice(index, 1)
				break

			case INSERTION:
				var dummy = $document.createElement("div")
				dummy.key = inst.data[index].attrs.key
				insertNode(inst.parent, dummy, index)
				newCached.splice(index, 0, {
					attrs: {key: inst.data[index].attrs.key},
					nodes: [dummy]
				})
				newCached.nodes[index] = dummy
				break

			case MOVE:
				var changeElement = change.element
				// changeElement is never null
				if (inst.parent.childNodes[index] !== changeElement) {
					inst.parent.insertBefore(
						changeElement,
						inst.parent.childNodes[index] || null
					)
				}
				newCached[index] = inst.cached[change.from]
				newCached.nodes[index] = changeElement
			}
		})

		inst.cached = newCached
	}

	// diffs the array itself
	function builderDiffArray(inst, nodes) {
		// update the list of DOM nodes by collecting the nodes from each item
		for (var i = 0, len = inst.data.length; i < len; i++) {
			var item = inst.cached[i]
			if (item != null) {
				nodes.push.apply(nodes, item.nodes)
			}
		}

		// remove items from the end of the array if the new array is shorter
		// than the old one. if errors ever happen here, the issue is most
		// likely a bug in the construction of the `cached` data structure
		// somewhere earlier in the program
		forEach(inst.cached.nodes, function (node, i) {
			if (node.parentNode != null && nodes.indexOf(node) < 0) {
				clear([node], [inst.cached[i]])
			}
		})

		if (inst.data.length < inst.cached.length) {
			inst.cached.length = inst.data.length
		}

		inst.cached.nodes = nodes
	}

	function builderInitAttrs(inst) {
		var dataAttrs = inst.data.attrs = inst.data.attrs || {}
		inst.cached.attrs = inst.cached.attrs || {}

		var dataAttrKeys = Object.keys(inst.data.attrs)
		builderMaybeRecreateObject(inst, dataAttrKeys)

		return dataAttrKeys.length > +("key" in dataAttrs)
	}

	function builderGetObjectNamespace(inst) {
		var data = inst.data

		return data.attrs.xmlns ? data.attrs.xmlns :
			data.tag === "svg" ? "http://www.w3.org/2000/svg" :
			data.tag === "math" ? "http://www.w3.org/1998/Math/MathML" :
			inst.ns
	}

	function builderBuildObject(inst) {
		var views = []
		var controllers = []

		builderMarkViews(inst, views, controllers)

		if (!inst.data.tag && controllers.length) {
			throw new Error("Component template must return a virtual " +
				"element, not an array, string, etc.")
		}

		var hasKeys = builderInitAttrs(inst)

		if (isString(inst.data.tag)) {
			return objectBuild({
				builder: inst,
				hasKeys: hasKeys,
				views: views,
				controllers: controllers,
				ns: builderGetObjectNamespace(inst)
			})
		}
	}

	function builderMarkViews(inst, views, controllers) {
		var cached = inst.cached && inst.cached.controllers
		while (inst.data.view != null) {
			builderCheckView(inst, cached, controllers, views)
		}
	}

	var forcing = false
	var pendingRequests = 0

	function builderCheckView(inst, cached, controllers, views) {
		var view = inst.data.view.$original || inst.data.view
		var controller = getController(
			inst.cached.views,
			view,
			cached,
			inst.data.controller
		)

		// Faster to coerce to number and check for NaN
		var key = +(inst.data && inst.data.attrs && inst.data.attrs.key)

		if (pendingRequests === 0 || forcing ||
				cached && cached.indexOf(controller) > -1) {
			inst.data = inst.data.view(controller)
		} else {
			inst.data = {tag: "placeholder"}
		}

		if (inst.data.subtree === "retain") return inst.cached
		if (key === key) { // eslint-disable-line no-self-compare
			(inst.data.attrs = inst.data.attrs || {}).key = key
		}
		updateLists(views, controllers, view, controller)
	}

	var unloaders = []

	function unloaderHandler(inst, ev) {
		inst.ctrls.splice(inst.ctrls.indexOf(inst.ctrl), 1)
		inst.views.splice(inst.views.indexOf(inst.view), 1)
		if (inst.ctrl && isFunction(inst.ctrl.onunload)) {
			inst.ctrl.onunload(ev)
		}
	}

	function updateLists(views, controllers, view, controller) {
		views.push(view)
		unloaders[controllers.push(controller) - 1] = {
			views: views,
			view: view,
			ctrl: controller,
			ctrls: controllers
		}
	}

	var redrawing = false

	m.redraw = function (force) {
		if (redrawing) return
		redrawing = true
		if (force) forcing = true
		try {
			attemptRedraw(force)
		} finally {
			redrawing = forcing = false
		}
	}

	var redrawStrategy = m.redraw.strategy = m.prop()

	function getController(views, view, cached, controller) {
		var index = redrawStrategy() === "diff" && views ?
			views.indexOf(view) :
			-1

		if (index > -1) {
			return cached[index]
		} else if (isFunction(controller)) {
			return new controller()
		} else {
			return {}
		}
	}

	function builderMaybeRecreateObject(inst, dataAttrKeys) {
		// if an element is different enough from the one in cache, recreate it
		if (builderElemIsDifferentEnough(inst, dataAttrKeys)) {
			if (inst.cached.nodes.length) clear(inst.cached.nodes)
			if (inst.cached.cfgCtx &&
					isFunction(inst.cached.cfgCtx.onunload)) {
				inst.cached.cfgCtx.onunload()
			}

			if (inst.cached.controllers) {
				forEach(inst.cached.controllers, function (controller) {
					if (controller.unload) {
						controller.onunload({preventDefault: noop})
					}
				})
			}
		}
	}

	// shallow array compare, assumes strings
	function arraySortCompare(a, b) {
		var len = a.length
		if (len !== b.length) return false

		// A string-integer map is used to simplify the algorithm from
		// two `O(n * log(n))` loops + an `O(n)` loop to just two O(n) loops
		// with constant-time (or a super cheap `log(n)`) string key lookup.
		var i = 0
		var cache = Object.create(null)
		while (i < len) cache[b[i]] = i++
		while (i !== 0) {
			if (cache[a[--i]] === undefined) return false
		}
		return true
	}

	function builderElemIsDifferentEnough(inst, dataAttrKeys) {
		var data = inst.data
		var cached = inst.cached
		if (data.tag !== cached.tag) return true
		if (!arraySortCompare(dataAttrKeys, Object.keys(cached.attrs))) {
			return true
		}

		if (data.attrs.id !== cached.attrs.id) return true
		if (data.attrs.key !== cached.attrs.key) return true

		if (redrawStrategy() === "all") {
			return !cached.cfgCtx || cached.cfgCtx.retain !== true
		} else if (redrawStrategy() === "diff") {
			return cached.cfgCtx && cached.cfgCtx.retain === false
		} else {
			return false
		}
	}

	function objectBuildNewNode(inst) {
		var node = objectCreateNode(inst)
		inst.builder.cached = objectReconstruct(
			inst,
			node,
			objectCreateAttrs(inst, node),
			objectBuildChildren(inst, node)
		)
		return node
	}

	function objectBuild(inst) {
		var builder = inst.builder
		var isNew = builder.cached.nodes.length === 0

		var node = isNew ?
			objectBuildNewNode(inst) :
			objectBuildUpdatedNode(inst)

		if (isNew || builder.reattach && node != null) {
			insertNode(builder.parent, node, builder.index)
		}

		builderScheduleConfigs(builder, node, isNew)
		return builder.cached
	}

	function objectCreateNode(inst) {
		var data = inst.builder.data
		if (inst.ns === undefined) {
			if (data.attrs.is) {
				return $document.createElement(data.tag, data.attrs.is)
			} else {
				return $document.createElement(data.tag)
			}
		} else if (data.attrs.is) {
			return $document.createElementNS(inst.ns, data.tag, data.attrs.is)
		} else {
			return $document.createElementNS(inst.ns, data.tag)
		}
	}

	function objectCreateAttrs(inst, node) {
		var data = inst.builder.data
		if (inst.hasKeys) {
			return setAttributes(node, data.tag, data.attrs, {}, inst.ns)
		} else {
			return data.attrs
		}
	}

	function objectMakeChild(inst, node, shouldReattach) {
		var builder = inst.builder
		return builderBuild(buildContext(
			node,
			builder.data.tag,
			undefined,
			undefined,
			builder.data.children,
			builder.cached.children,
			shouldReattach,
			0,
			builder.data.attrs.contenteditable ? node : builder.editable,
			inst.ns,
			builder.cfgs
		))
	}

	function objectBuildChildren(inst, node) {
		var children = inst.builder.data.children
		if (children != null && children.length) {
			return objectMakeChild(inst, node, true)
		} else {
			return children
		}
	}

	function objectReconstruct(inst, node, attrs, children) {
		var data = inst.builder.data
		var cached = {
			tag: data.tag,
			attrs: attrs,
			children: children,
			nodes: [node]
		}

		objectUnloadCachedControllers(inst, cached)

		if (cached.children && !cached.children.nodes) {
			cached.children.nodes = []
		}

		// edge case: setting value on <select> doesn't work before children
		// exist, so set it again after children have been created
		if (data.tag === "select" && "value" in data.attrs) {
			setAttributes(node, data.tag, {value: data.attrs.value}, {},
				inst.ns)
		}
		return cached
	}

	function unloadSingleCachedController(controller) {
		if (controller.onunload && controller.onunload.$old) {
			controller.onunload = controller.onunload.$old
		}

		if (pendingRequests && controller.onunload) {
			var onunload = controller.onunload
			controller.onunload = noop
			controller.onunload.$old = onunload
		}
	}

	function objectUnloadCachedControllers(inst, cached) {
		if (inst.controllers.length) {
			cached.views = inst.views
			cached.controllers = inst.controllers
			forEach(inst.controllers, unloadSingleCachedController)
		}
	}

	function objectBuildUpdatedNode(inst) {
		var cached = inst.builder.cached
		var node = cached.nodes[0]
		if (inst.hasKeys) {
			setAttributes(
				node,
				inst.builder.data.tag,
				inst.builder.data.attrs,
				cached.attrs,
				inst.ns
			)
		}

		cached.children = objectMakeChild(inst, node, false)
		cached.nodes.intact = true

		if (inst.controllers.length) {
			cached.views = inst.views
			cached.controllers = inst.controllers
		}

		return node
	}

	function builderScheduleConfigs(inst, node, isNew) {
		var data = inst.data
		var cached = inst.cached
		// They are called after the tree is fully built
		var config = data.attrs.config
		if (isFunction(config)) {
			var context = cached.cfgCtx = cached.cfgCtx || {}

			inst.cfgs.push(function () {
				return config.call(data, node, !isNew, context, cached)
			})
		}
	}

	function builderHandleTextNode(inst) {
		if (inst.cached.nodes.length === 0) {
			return builderHandleNonexistentNodes(inst)
		} else if (inst.cached.valueOf() !== inst.data.valueOf() ||
				inst.reattach) {
			return builderReattachNodes(inst)
		} else {
			inst.cached.nodes.intact = true
			return inst.cached
		}
	}

	function nodeHasBody(node) {
		return !/^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/ // eslint-disable-line max-len
			.test(node)
	}

	function builderHandleNonexistentNodes(inst) {
		var nodes
		if (inst.data.$trusted) {
			nodes = injectHTML(inst.parent, inst.index, inst.data)
		} else {
			nodes = [$document.createTextNode(inst.data)]
			if (nodeHasBody(inst.parent.nodeName)) {
				insertNode(inst.parent, nodes[0], inst.index)
			}
		}

		var cached

		if (typeof inst.data === "string" ||
				typeof inst.data === "number" ||
				typeof inst.data === "boolean") {
			cached = new inst.data.constructor(inst.data)
		} else {
			cached = inst.data
		}

		cached.nodes = nodes

		return cached
	}

	function builderReattachNodes(inst) {
		var nodes = inst.cached.nodes
		if (!inst.editable || inst.editable !== $document.activeElement) {
			if (inst.data.$trusted) {
				clear(nodes, inst.cached)
				nodes = injectHTML(inst.parent, inst.index, inst.data)
			} else if (inst.pTag === "textarea") {
				// <textarea> uses `value` instead of `nodeValue`.
				inst.parent.value = inst.data
			} else if (inst.editable) {
				// contenteditable nodes use `innerHTML` instead of `nodeValue`.
				inst.editable.innerHTML = inst.data
			} else {
				// was a trusted string
				if (nodes[0].nodeType === 1 ||
					nodes.length > 1 ||
					(nodes[0].nodeValue.trim && !nodes[0].nodeValue.trim())
				) {
					clear(inst.cached.nodes, inst.cached)
					nodes = [$document.createTextNode(inst.data)]
				}

				builderInjectTextNode(inst, nodes[0])
			}
		}

		inst.cached = new inst.data.constructor(inst.data)
		inst.cached.nodes = nodes
		return inst.cached
	}

	// This function was causing deopts in Chrome.
	function builderInjectTextNode(inst, first) {
		try {
			insertNode(inst.parent, first, inst.index)
			first.nodeValue = inst.data
		} catch (e) {
			// IE erroneously throws error when appending an empty text node
			// after a null
		}
	}

	m.startComputation = startComputation
	function startComputation() { pendingRequests++ }
	m.endComputation = endComputation
	function endComputation() {
		if (pendingRequests > 1) {
			pendingRequests--
		} else {
			pendingRequests = 0
			m.redraw()
		}
	}

	function getSubArrayCount(item) {
		if (item.$trusted) {
			// fix offset of next element if item was a trusted string w/ more
			// than one HTML element. the first clause in the regexp matches
			// elements the second clause (after the pipe) matches text nodes
			var match = item.match(/<[^\/]|\>\s*[^<]/g)
			if (match != null) return match.length
		} else if (isArray(item)) {
			return item.length
		} else {
			return 1
		}
	}

	function sortChanges(a, b) {
		return a.action - b.action || a.index - b.index
	}

	function shouldSetAttrDirectly(attr) {
		return !/^(list|style|form|type|width|height)$/.test(attr)
	}

	function trySetAttribute(attr, dataAttr, cachedAttr, node, namespace, tag) {
		if (attr === "config" || attr === "key") {
			// `config` and `key` aren't real attributes
			return
		} else if (isFunction(dataAttr) && attr.slice(0, 2) === "on") {
			// hook event handlers to the auto-redrawing system
			node[attr] = autoredraw(dataAttr, node)
		} else if (attr === "style" && dataAttr != null && isObject(dataAttr)) {
			// handle `style: {...}`
			forOwn(dataAttr, function (value, rule) {
				if (cachedAttr == null || cachedAttr[rule] !== value) {
					node.style[rule] = value
				}
			})

			for (var rule in cachedAttr) {
				if (hasOwn.call(cachedAttr, rule)) {
					if (!hasOwn.call(dataAttr, rule)) node.style[rule] = ""
				}
			}
		} else if (namespace != null) {
			// handle SVG
			if (attr === "href") {
				node.setAttributeNS("http://www.w3.org/1999/xlink", "href",
					dataAttr)
			} else {
				node.setAttribute(attr === "className" ? "class" : attr,
					dataAttr)
			}
		} else if (attr in node && shouldSetAttrDirectly(attr)) {
			// handle cases that are properties (but ignore cases where we
			// should use setAttribute instead):
			//
			// - list and form are typically used as strings, but are DOM
			//   element references in js
			// - when using CSS selectors (e.g. `m("[style='']")`), style is
			//   used as a string, but it's an object in js
			//
			// #348
			// don't set the value if not needed, otherwise cursor placement
			// breaks in Chrome
			if (tag !== "input" || node[attr] !== dataAttr) {
				node[attr] = dataAttr
			}
		} else {
			node.setAttribute(attr, dataAttr)
		}
	}

	function trySetSingle(attr, data, cached, node, namespace, tag) {
		try {
			trySetAttribute(attr, data, cached, node, namespace, tag)
		} catch (e) {
			// swallow IE's invalid argument errors to mimic HTML's
			// fallback-to-doing-nothing-on-invalid-attributes behavior
			if (/\bInvalid argument\b/.test(e.message)) throw e
		}
	}

	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		forOwn(dataAttrs, function (dataAttr, attr) {
			var cachedAttr = cachedAttrs[attr]
			if (!(attr in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attr] = dataAttr
				trySetSingle(attr, dataAttr, cachedAttr, node, namespace, tag)
			} else if (attr === "value" && tag === "input" &&
					// #348: dataAttr may not be a string, so use loose
					// comparison (i.e. identity not required).
					node.value != dataAttr) { // eslint-disable-line eqeqeq
				node.value = dataAttr
			}
		})

		return cachedAttrs
	}

	function clearSingle(node) {
		try {
			node.parentNode.removeChild(node)
		} catch (e) {
			/* eslint-disable max-len */
			// ignore if this fails due to order of events (see
			// http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
			/* eslint-enable max-len */
		}
	}

	function clear(nodes, cached) {
		// If it's empty, there's nothing to clear
		if (!nodes.length) return
		cached = [].concat(cached)
		for (var i = nodes.length - 1; i >= 0; i--) {
			var node = nodes[i]
			if (node != null && node.parentNode) {
				clearSingle(node)
				if (cached[i]) unload(cached[i])
			}
		}

		// release memory if nodes is an array. This check should fail if nodes
		// is a NodeList (see loop above)
		if (nodes.length) nodes.length = 0
	}

	function unload(cached) {
		if (cached.cfgCtx && isFunction(cached.cfgCtx.onunload)) {
			cached.cfgCtx.onunload()
			cached.cfgCtx.onunload = null
		}
		if (cached.controllers) {
			forEach(cached.controllers, function (controller) {
				if (isFunction(controller.onunload)) {
					controller.onunload({preventDefault: noop})
				}
			})
		}
		if (cached.children) {
			if (isArray(cached.children)) {
				forEach(cached.children, unload)
			} else if (cached.children.tag) {
				unload(cached.children)
			}
		}
	}

	var insertAdjacentBeforeEnd = (function () {
		try {
			$document.createRange().createContextualFragment("x")
			return function (parent, data) {
				parent.appendChild(
					$document.createRange().createContextualFragment(data))
			}
		} catch (e) {
			return function (parent, data) {
				parent.insertAdjacentHTML("beforeend", data)
			}
		}
	})()

	function injectHTML(parent, index, data) {
		var nextSibling = parent.childNodes[index]

		if (nextSibling) {
			if (nextSibling.nodeType !== 1) {
				var placeholder = $document.createElement("span")
				parent.insertBefore(placeholder, nextSibling || null)
				placeholder.insertAdjacentHTML("beforebegin", data)
				parent.removeChild(placeholder)
			} else {
				nextSibling.insertAdjacentHTML("beforebegin", data)
			}
		} else {
			insertAdjacentBeforeEnd(parent, data)
		}

		var nodes = []
		while (parent.childNodes[index] !== nextSibling) {
			nodes.push(parent.childNodes[index++])
		}

		return nodes
	}
	function autoredraw(callback, object) {
		return function (e) {
			redrawStrategy("diff")
			startComputation()
			try {
				return callback.call(object, e || event)
			} finally {
				endFirstComputation()
			}
		}
	}

	var documentNode = {
		appendChild: function (node) {
			if ($document.documentElement &&
					$document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			} else {
				$document.appendChild(node)
			}

			this.childNodes = $document.childNodes
		},

		insertBefore: function (node) {
			this.appendChild(node)
		},

		childNodes: []
	}

	var nodeCache = []
	var cellCache = {}

	m.render = function (root, cell, forceRecreation) {
		if (!root) {
			throw new Error("Ensure the DOM element being passed to " +
				"m.route/m.mount/m.render exists.")
		}

		var configs = []
		var id = getCellCacheKey(root)
		var isDocumentRoot = root === $document
		var node

		if (isDocumentRoot || root === $document.documentElement) {
			node = documentNode
		} else {
			node = root
		}

		if (isDocumentRoot && cell.tag !== "html") {
			cell = {tag: "html", attrs: {}, children: cell}
		}

		if (cellCache[id] === undefined) clear(node.childNodes)
		if (forceRecreation === true) reset(root)

		cellCache[id] = builderBuild(buildContext(
			node,
			null,
			undefined,
			undefined,
			cell,
			cellCache[id],
			false,
			0,
			null,
			undefined,
			configs
		))

		forEach(configs, function (config) {
			config()
		})
	}

	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element)
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function (value) {
		value = new String(value) // eslint-disable-line no-new-wrappers
		value.$trusted = true
		return value
	}

	var roots = []
	var components = []
	var controllers = []
	var computePreRedrawHook = null
	var computePostRedrawHook = null
	var FRAME_BUDGET = 16 // 60 frames per second = 1 call per 16 ms
	var topComponent

	function initComponent(component, root, index, isPrevented) {
		var isNullComponent = component === null

		if (!isPrevented) {
			redrawStrategy("all")
			startComputation()
			roots[index] = root
			component = topComponent = component || {controller: noop}
			// controllers may call m.mount recursively (via m.route redirects,
			// for example). This conditional ensures only the last recursive
			// m.mount call is applied. Please don't change the order of this.
			var controller = new (component.controller || noop)()
			if (component === topComponent) {
				controllers[index] = controller
				components[index] = component
			}

			endFirstComputation()

			if (isNullComponent) {
				removeRootElement(root, index)
			}

			return controllers[index]
		}

		if (isNullComponent) {
			removeRootElement(root, index)
		}
	}

	m.mount = m.module = mmount
	function mmount(root, component) {
		if (!root) {
			throw new Error("Please ensure the DOM element exists before " +
				"rendering a template into it.")
		}

		var index = roots.indexOf(root)
		if (index < 0) index = roots.length

		var isPrevented = false

		var ev = {
			preventDefault: function () {
				isPrevented = true
				computePreRedrawHook = computePostRedrawHook = null
			}
		}

		forEach(unloaders, function (unloader) {
			if (unloader.ctrl != null) {
				unloaderHandler(unloader, ev)
				unloader.ctrl.onunload = null
			}
		})

		if (isPrevented) {
			forEach(unloaders, function (unloader) {
				unloader.ctrl.onunload = function (ev) {
					unloaderHandler(unloader, ev)
				}
			})
		} else {
			unloaders = []
		}

		if (controllers[index] && isFunction(controllers[index].onunload)) {
			controllers[index].onunload(ev)
		}

		return initComponent(component, root, index, isPrevented)
	}

	function removeRootElement(root, index) {
		roots.splice(index, 1)
		controllers.splice(index, 1)
		components.splice(index, 1)
		reset(root)
		nodeCache.splice(getCellCacheKey(root), 1)
	}

	// lastRedrawId is a positive number if a second redraw is requested before
	// the next animation frame, or 0 if it's the first redraw and not an event
	// handler
	var lastRedrawId = 0
	var lastRedrawCallTime = 0

	function actuallyPerformRedraw() {
		if (lastRedrawId !== 0) $cancelAnimationFrame(lastRedrawId)
		lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
	}

	// when setTimeout:
	// only reschedule redraw if time between now and previous redraw is bigger
	// than a frame, otherwise keep currently scheduled timeout
	//
	// when rAF:
	// always reschedule redraw
	var performRedraw = $requestAnimationFrame ===
			window.requestAnimationFrame ?
		actuallyPerformRedraw :
		function () {
			if (+new Date() - lastRedrawCallTime > FRAME_BUDGET) {
				actuallyPerformRedraw()
			}
		}

	function resetLastRedrawId() {
		lastRedrawId = 0
	}

	function attemptRedraw(force) {
		if (lastRedrawId && !force) {
			performRedraw()
		} else {
			redraw()
			lastRedrawId = $requestAnimationFrame(resetLastRedrawId,
				FRAME_BUDGET)
		}
	}

	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}

		for (var i = 0; i < roots.length; i++) {
			var root = roots[i]
			var component = components[i]
			var controller = controllers[i]
			if (controller != null) {
				m.render(
					root,
					component.view ?
						component.view(controller, [controller]) :
						""
				)
			}
		}

		// after rendering within a routed context, we need to scroll back to
		// the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook()
			computePostRedrawHook = null
		}

		lastRedrawId = null
		lastRedrawCallTime = new Date()
		redrawStrategy("diff")
	}

	function endFirstComputation() {
		if (redrawStrategy() === "none") {
			pendingRequests--
			redrawStrategy("diff")
		} else {
			endComputation()
		}
	}

	m.withAttr = function (prop, withAttrCallback, callbackThis) {
		return function (e) {
			/* eslint-disable no-invalid-this */
			e = e || event
			var currentTarget = e.currentTarget || this
			var targetProp

			if (prop in currentTarget) {
				targetProp = currentTarget[prop]
			} else {
				targetProp = currentTarget.getAttribute(prop)
			}

			withAttrCallback.call(callbackThis || this, targetProp)
			/* eslint-enable no-invalid-this */
		}
	}

	// routing
	var modes = {
		pathname: "",
		hash: "#",
		search: "?"
	}

	var redirect = noop
	var isDefaultRoute = false
	var routeParams, currentRoute

	function historyListener() {
		var path = $location[mroute.mode]
		if (mroute.mode === "pathname") path += $location.search
		if (currentRoute !== normalizeRoute(path)) redirect(path)
	}

	function runHistoryListener(listener) {
		window[listener] = historyListener
		computePreRedrawHook = setScroll
		window[listener]()
	}

	function getRouteBase() {
		return (mroute.mode === "pathname" ? "" : $location.pathname) +
			modes[mroute.mode]
	}

	function windowPushState() {
		window.history.pushState(null,
			$document.title,
			modes[mroute.mode] + currentRoute)
	}

	function windowReplaceState() {
		window.history.replaceState(null,
			$document.title,
			modes[mroute.mode] + currentRoute)
	}

	function computeAndLaunchRedirect(replaceHistory) {
		if (window.history.pushState) {
			computePreRedrawHook = setScroll
			computePostRedrawHook = replaceHistory ?
				windowReplaceState :
				windowPushState
			redirect(modes[mroute.mode] + currentRoute)
		} else {
			$location[mroute.mode] = currentRoute
			redirect(modes[mroute.mode] + currentRoute)
		}
	}

	function routeTo(route, params, replaceHistory) {
		if (arguments.length < 3 && typeof params !== "object") {
			replaceHistory = params
			params = null
		}

		var oldRoute = currentRoute

		currentRoute = route
		var args = params || {}
		var queryIndex = currentRoute.indexOf("?")
		var queryString, currentPath

		if (queryIndex >= 0) {
			var paramsObj = parseQueryString(currentRoute.slice(queryIndex + 1))
			forOwn(args, function (value, key) {
				paramsObj[key] = args[key]
			})
			queryString = buildQueryString(paramsObj)
			currentPath = currentRoute.slice(0, queryIndex)
		} else {
			queryString = buildQueryString(params)
			currentPath = currentRoute
		}

		if (queryString) {
			var delimiter = currentPath.indexOf("?") === -1 ? "?" : "&"
			currentRoute = currentPath + delimiter + queryString
		}

		return computeAndLaunchRedirect(replaceHistory || oldRoute === route)
	}

	m.route = mroute
	function mroute(root, arg1, arg2, vdom) {
		if (arguments.length === 0) {
			// m.route()
			return currentRoute
		} else if (arguments.length === 3 && isString(arg1)) {
			// m.route(el, defaultRoute, routes)
			redirect = function (source) {
				var path = currentRoute = normalizeRoute(source)
				if (!routeByValue(root, arg2, path)) {
					if (isDefaultRoute) {
						throw new Error("Ensure the default route matches " +
							"one of the routes defined in m.route")
					}

					isDefaultRoute = true
					mroute(arg1, true)
					isDefaultRoute = false
				}
			}

			runHistoryListener(
				mroute.mode === "hash" ? "onhashchange" : "onpopstate")
		} else if (root.addEventListener || root.attachEvent) {
			// config: m.route
			root.href = getRouteBase() + vdom.attrs.href
			if (root.addEventListener) {
				root.removeEventListener("click", routeUnobtrusive)
				root.addEventListener("click", routeUnobtrusive)
			} else {
				root.detachEvent("onclick", routeUnobtrusive)
				root.attachEvent("onclick", routeUnobtrusive)
			}
		} else if (isString(root)) {
			// m.route(route, params, shouldReplaceHistoryEntry)
			return routeTo.apply(null, arguments)
		}
	}

	mroute.param = function (key) {
		if (!routeParams) {
			throw new Error("You must call m.route(element, defaultRoute, " +
				"routes) before calling mroute.param()")
		}

		if (key) {
			return routeParams[key]
		} else {
			return routeParams
		}
	}

	mroute.mode = "search"

	function normalizeRoute(route) {
		return route.slice(modes[mroute.mode].length)
	}

	function routeByValue(root, router, path) {
		var queryStart = path.indexOf("?")

		if (queryStart >= 0) {
			routeParams = parseQueryString(
				path.substr(queryStart + 1, path.length))
			path = path.substr(0, queryStart)
		} else {
			routeParams = {}
		}

		// Get all routes and check if there's an exact match for the current
		// path
		var keys = Object.keys(router)
		var index = keys.indexOf(path)

		if (index >= 0) {
			mmount(root, router[keys[index]])
			return true
		}

		for (var route in router) {
			if (hasOwn.call(router, route)) {
				if (route === path) {
					mmount(root, router[route])
					return true
				}

				var matcher = new RegExp("^" +
					route.replace(/:[^\/]+?\.{3}/g, "(.*?)")
						.replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")

				if (matcher.test(path)) {
					/* eslint-disable no-loop-func */
					path.replace(matcher, function () {
						var values = []
						for (var i = 1, end = arguments.length - 2; i < end;) {
							values.push(arguments[i++])
						}

						var keys = route.match(/:[^\/]+/g) || []
						forEach(keys, function (key, i) {
							key = key.replace(/:|\./g, "")
							routeParams[key] = decodeURIComponent(values[i])
						})
					})
					/* eslint-enable no-loop-func */
					mmount(root, router[route])
					return true
				}
			}
		}
	}

	function routeUnobtrusive(e) {
		e = e || event

		if (e.ctrlKey || e.metaKey || e.which === 2) return

		if (e.preventDefault) {
			e.preventDefault()
		} else {
			e.returnValue = false
		}

		var currentTarget = e.currentTarget || e.srcElement

		var args

		if (mroute.mode === "pathname" && currentTarget.search) {
			args = parseQueryString(currentTarget.search.slice(1))
		} else {
			args = {}
		}

		while (currentTarget && currentTarget.nodeName.toUpperCase() !== "A") {
			currentTarget = currentTarget.parentNode
		}

		// clear pendingRequests because we want an immediate route change
		pendingRequests = 0

		mroute(currentTarget[mroute.mode].slice(modes[mroute.mode].length),
			args)
	}

	function setScroll() {
		if (mroute.mode !== "hash" && $location.hash) {
			$location.hash = $location.hash
		} else {
			window.scrollTo(0, 0)
		}
	}

	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []
		forOwn(object, function (value, prop) {
			var key = prefix ? prefix + "[" + prop + "]" : prop

			if (value === null) {
				str.push(encodeURIComponent(key))
			} else if (isObject(value)) {
				str.push(buildQueryString(value, key))
			} else if (isArray(value)) {
				var keys = []
				duplicates[key] = duplicates[key] || {}
				/* eslint-disable-line no-loop-func  */
				forEach(value, function (item) {
					if (!duplicates[key][item]) {
						duplicates[key][item] = true
						keys.push(encodeURIComponent(key) + "=" +
							encodeURIComponent(item))
					}
				})
				/* eslint-enable-line no-loop-func  */
				str.push(keys.join("&"))
			} else if (value !== undefined) {
				str.push(encodeURIComponent(key) + "=" +
					encodeURIComponent(value))
			}
		})
		return str.join("&")
	}

	function parseQueryString(str) {
		if (!str) return {}
		if (str[0] === "?") str = str.slice(1)

		var pairs = str.split("&")
		var params = {}
		forEach(pairs, function (string) {
			var pair = string.split("=")
			var key = decodeURIComponent(pair[0])
			var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (!isArray(params[key])) params[key] = [params[key]]
				params[key].push(value)
			} else {
				params[key] = value
			}
		})

		return params
	}

	mroute.buildQueryString = buildQueryString
	mroute.parseQueryString = parseQueryString

	function reset(root) {
		var cacheKey = getCellCacheKey(root)
		clear(root.childNodes, cellCache[cacheKey])
		cellCache[cacheKey] = undefined
	}

	// Promiz.mithril.js | Zolmeister | MIT
	// a modified version of Promiz.js, which does not conform to Promises/A+
	// for two reasons:
	//
	// 1) `then` callbacks are called synchronously (because setTimeout is too
	// 	  slow, and the setImmediate polyfill is too big
	// 2) throwing subclasses of Error cause the error to be bubbled up instead
	//    of triggering rejection (because the spec does not account for the
	//    important use case of default browser error handling, i.e. message w/
	//    line number)
	var RESOLVING = 1
	var REJECTING = 2
	var RESOLVED = 3
	var REJECTED = 4

	function coerce(value, next, error) {
		if (isPromise(value)) {
			return value.then(function (value) {
				coerce(value, next, error)
			}, function (e) {
				coerce(e, error, error)
			})
		} else {
			return next(value)
		}
	}

	function Deferred(onSuccess, onFailure) { // eslint-disable-line max-statements, max-len
		var self = this
		var promiseValue
		var next = []
		var func = push

		function set(value) {
			promiseValue = value
		}

		function resolve(deferred) {
			deferred.resolve(promiseValue)
		}

		function reject(deferred) {
			deferred.reject(promiseValue)
		}

		function init(promise) {
			if (func !== reject) promise(promiseValue)
			return promise
		}

		function push(value) {
			next.push(value)
		}

		self.resolve = function (value) {
			if (func === push) {
				fire(RESOLVING, value, self)
			}
			return self
		}

		self.reject = function (value) {
			if (func === push) {
				fire(REJECTING, value, self)
			}
			return self
		}

		self.promise = function (value) {
			if (arguments.length) coerce(value, set, set)
			return func !== reject ? promiseValue : undefined
		}

		self.promise.then = function (onSuccess, onFailure) {
			var deferred = new Deferred(onSuccess, onFailure)
			func(deferred)
			return init(deferred.promise)
		}

		self.promise.catch = function (callback) {
			return self.promise.then(null, callback)
		}

		function wrapper(callback, func) {
			var p = mdeferred().resolve(callback()).promise
			if (func !== reject) p(promiseValue)
			return p.then(func)
		}

		self.promise.finally = function (callback) {
			return self.promise.then(function () {
				return wrapper(callback, function () {
					return promiseValue
				})
			}, function () {
				return wrapper(callback, function () {
					throw promiseValue
				})
			})
		}

		function run(callback) {
			func = callback
			forEach(next, callback)
			// Clear these (which hold all the extra references)
			finish = fire = null // eslint-disable-line no-func-assign
		}

		function finish(value, state) {
			coerce(value, function (value) {
				promiseValue = value
				run(state === RESOLVED ? resolve : reject)
			}, function (value) {
				promiseValue = value
				run(reject)
			})
		}

		function doThen(value, deferred) {
			// count protects against abuse calls from spec checker
			var count = 0

			try {
				return value.then(function (value) {
					if (count++) return
					fire(RESOLVING, value, deferred)
				}, function (value) {
					if (count++) return
					fire(REJECTING, value, deferred)
				})
			} catch (e) {
				mdeferred.onerror(e)
				return fire(REJECTING, e, deferred)
			}
		}

		function notThenable(value, state, deferred) {
			try {
				if (state === RESOLVING && isFunction(onSuccess)) {
					value = onSuccess(value)
				} else if (state === REJECTING && isFunction(onFailure)) {
					value = onFailure(value)
					state = RESOLVING
				}
			} catch (e) {
				mdeferred.onerror(e)
				return finish(e, REJECTED)
			}

			if (value === deferred) {
				return finish(TypeError(), REJECTED)
			} else {
				return finish(value, state === RESOLVING ? RESOLVED : REJECTED)
			}
		}

		function fire(state, value, deferred) {
			// check if it's a thenable
			var thenable
			try {
				thenable = isPromise(value)
			} catch (e) {
				mdeferred.onerror(e)
				return fire(REJECTING, e, deferred)
			}

			if (state === REJECTING) {
				mdeferred.onerror(value)
			}

			if (thenable) {
				return doThen(value, deferred)
			} else {
				return notThenable(value, state, deferred)
			}
		}
	}

	m.deferred = mdeferred
	function mdeferred() {
		return new Deferred()
	}

	mdeferred.prototype = Deferred.prototype
	mdeferred.prototype.constructor = mdeferred

	function isNativeError(e) {
		return e instanceof EvalError ||
			e instanceof RangeError ||
			e instanceof ReferenceError ||
			e instanceof SyntaxError ||
			e instanceof TypeError ||
			e instanceof URIError
	}

	mdeferred.onerror = function (e) {
		if (isNativeError(e)) {
			pendingRequests = 0
			throw e
		}
	}

	m.sync = function (args) {
		var deferred = new Deferred()
		var outstanding = args.length
		var results = new Array(outstanding)
		var method = "resolve"

		function synchronizer(i, value) {
			results[i] = value
			if (--outstanding === 0) {
				deferred.promise(results)
				deferred[method](results)
			}
			return value
		}

		if (args.length > 0) {
			forEach(args, function (arg, i) {
				arg.then(function (value) {
					return synchronizer(i, value)
				}, function (value) {
					method = "reject"
					return synchronizer(i, value)
				})
			})
		} else {
			deferred.resolve([])
		}

		return deferred.promise
	}

	function generateCallbackKey() {
		return "mithril_callback_" + new Date().getTime() + "_" +
			(Math.round(Math.random() * 1e16)).toString(36)
	}

	function getJsonp(options) {
		var callbackKey = generateCallbackKey()
		var script = $document.createElement("script")

		window[callbackKey] = function (resp) {
			script.parentNode.removeChild(script)

			options.onload({
				success: true,
				target: {
					responseText: resp
				}
			})

			window[callbackKey] = undefined
		}

		script.onerror = function () {
			script.parentNode.removeChild(script)

			options.onerror({
				success: false,
				target: {
					status: 500,
					responseText: '{"error": "Error making jsonp request"}'
				}
			})

			window[callbackKey] = undefined

			return false
		}

		script.onload = function () {
			return false
		}

		script.src = options.url +
			(options.url.indexOf("?") > 0 ? "&" : "?") +
			(options.callbackKey || "callback") +
			"=" + callbackKey +
			"&" + buildQueryString(options.data || {})

		$document.body.appendChild(script)
	}

	function runXhr(options) {
		var xhr = new window.XMLHttpRequest()

		xhr.open(options.method, options.url, true, options.user,
			options.password)

		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 300) {
					options.onload({success: true, target: this})
				} else {
					options.onerror({success: false, target: this})
				}
			}
		}

		if (options.serialize === JSON.stringify &&
				options.data &&
				options.method !== "GET") {
			xhr.setRequestHeader("Content-Type",
				"application/json; charset=utf-8")
		}

		if (options.deserialize === JSON.parse) {
			xhr.setRequestHeader("Accept", "application/json, text/*")
		}

		if (isFunction(options.config)) {
			var maybeXhr = options.config(xhr, options)
			if (maybeXhr != null) xhr = maybeXhr
		}

		var data

		if (options.method === "GET" || !options.data) {
			data = ""
		} else {
			data = options.data
		}

		if (data && !isString(data) && !(data instanceof window.FormData)) {
			throw new Error("Request data should be either be a string or " +
				"FormData. Check the `serialize` option in `m.request`")
		}

		xhr.send(data)
		return xhr
	}

	function ajax(options) {
		if (options.dataType && options.dataType.toUpperCase() === "JSONP") {
			return getJsonp(options)
		} else {
			return runXhr(options)
		}
	}

	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType !== "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&"
			var querystring = buildQueryString(data)
			xhrOptions.url += querystring ? prefix + querystring : ""
		} else {
			xhrOptions.data = serialize(data)
		}
		return xhrOptions
	}

	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi)
		if (tokens && data) {
			forEach(tokens, function (token) {
				var key = token.slice(1)
				url = url.replace(token, data[key])
				delete data[key]
			})
		}
		return url
	}

	m.request = function (options) {
		if (options.background !== true) startComputation()
		var deferred = mdeferred()

		var serialize = function (value) { // eslint-disable-line func-style
			return value
		}
		var deserialize = serialize
		var extract = function (jsonp) { // eslint-disable-line func-style
			return jsonp.responseText
		}

		if (!options.dataType || options.dataType.toUpperCase() !== "JSONP") {
			serialize = options.serialize || JSON.stringify
			deserialize = options.deserialize || JSON.parse
			extract = options.extract || function (xhr) {
				if (xhr.responseText.length || deserialize !== JSON.parse) {
					return xhr.responseText
				} else {
					return null
				}
			}
		}

		options.serialize = serialize
		options.deserialize = deserialize

		options.method = (options.method || "GET").toUpperCase()
		options.url = parameterizeUrl(options.url, options.data)
		options = bindData(options, options.data, serialize)
		options.onload = options.onerror = function (ev) {
			ev = ev || event
			var doSuccess = ev.success
			var unwrap

			if (doSuccess) {
				unwrap = options.unwrapSuccess
			} else {
				unwrap = options.unwrapError
			}

			try {
				var response = deserialize(extract(ev.target, options))
				if (unwrap) response = unwrap(response, ev.target)
				if (doSuccess) {
					if (isArray(response) && options.type) {
						forEach(response, function (res, i) {
							response[i] = new options.type(res)
						})
					} else if (options.type) {
						response = new options.type(response)
					}
					deferred.resolve(response)
				} else {
					deferred.reject(response)
				}
			} catch (e) {
				deferred.reject(e)
			} finally {
				if (options.background !== true) endComputation()
			}
		}

		ajax(options)
		deferred.promise(options.initialValue)
		return deferred.promise
	}

	return m
})
