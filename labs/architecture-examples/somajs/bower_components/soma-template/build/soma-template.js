;(function (soma, undefined) {

	'use strict';

soma.template = soma.template || {};
soma.template.version = "0.1.8";

var errors = soma.template.errors = {
	TEMPLATE_STRING_NO_ELEMENT: "Error in soma.template, a string template requirement a second parameter: an element target - soma.template.create('string', element)",
	TEMPLATE_NO_PARAM: "Error in soma.template, a template requires at least 1 parameter - soma.template.create(element)"
};

var tokenStart = '{{';
var tokenEnd = '}}';
var helpersObject = {};
var helpersScopeObject = {};

var settings = soma.template.settings = soma.template.settings || {};

settings.autocreate = true;

var tokens = settings.tokens = {
	start: function(value) {
		if (isDefined(value) && value !== '') {
			tokenStart = escapeRegExp(value);
			setRegEX(value, true);
		}
		return tokenStart;
	},
	end: function(value) {
		if (isDefined(value) && value !== '') {
			tokenEnd = escapeRegExp(value);
			setRegEX(value, false);
		}
		return tokenEnd;
	}
};

var attributes = settings.attributes = {
	skip: "data-skip",
	repeat: "data-repeat",
	src: "data-src",
	href: "data-href",
	show: "data-show",
	hide: "data-hide",
	cloak: "data-cloak",
	checked: "data-checked",
	disabled: "data-disabled",
	multiple: "data-multiple",
	readonly: "data-readonly",
	selected: "data-selected",
	template: "data-template",
	html: "data-html"
};

var vars = settings.vars = {
	index: "$index",
	key: "$key"
};

var events = settings.events = {};
settings.eventsPrefix = 'data-';
var eventsString = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup focus blur change select selectstart scroll copy cut paste mousewheel keypress error contextmenu input textinput drag dragenter dragleave dragover dragend dragstart dragover drop load submit reset search resize beforepaste beforecut beforecopy';
eventsString += ' touchstart touchend touchmove touchenter touchleave touchcancel gesturestart gesturechange gestureend';
var eventsArray = eventsString.split(' ');
var i = -1, l = eventsArray.length;
while(++i < l) {
	events[settings.eventsPrefix + eventsArray[i]] = eventsArray[i];
}

var regex = {
	sequence: null,
	token: null,
	expression: null,
	escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
	trim: /^[\s+]+|[\s+]+$/g,
	repeat: /(.*)\s+in\s+(.*)/,
	func: /(.*)\((.*)\)/,
	params: /,\s+|,|\s+,\s+/,
	quote: /\"|\'/g,
	content: /[^.|^\s]/gm,
	depth: /..\//g,
	string: /^(\"|\')(.*)(\"|\')$/
};

var ie = (function(){
	if (typeof document !== 'object') return undefined;
	var undef,
		v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');
	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]
		);
	return v > 4 ? v : undef;
}());
function isArray(value) {
	return Object.prototype.toString.apply(value) === '[object Array]';
};
function isObject(value) {
	return typeof value === 'object';
}
function isString(value) {
	return typeof value === 'string';
}
function isElement(value) {
	return value ? value.nodeType > 0 : false;
};
function isTextNode(el) {
	return el && el.nodeType && el.nodeType === 3;
}
function isFunction(value) {
	return value && typeof value === 'function';
}
function isDefined(value) {
	return value !== null && value !== undefined;
}
function isAttributeDefined(value) {
	return (value === "" || value === true || value === "true" || !isDefined(value));
}
function isExpression(value) {
	return value && isFunction(value.toString) && value.toString() === '[object Expression]';
}
function isNode(value) {
	return value && isFunction(value.toString) && value.toString() === '[object Node]';
}
function isExpFunction(value) {
	if (!isString(value)) return false;
	return !!value.match(regex.func);
}
function childNodeIsTemplate(node) {
	return node && node.parent && templates.get(node.element);
}
function escapeRegExp(str) {
	return str.replace(regex.escape, "\\$&");
}
function setRegEX(nonEscapedValue, isStartToken) {
	// sequence: \{\{.+?\}\}|[^{]+|\{(?!\{)[^{]*
	var unescapedCurrentStartToken = tokens.start().replace(/\\/g, '');
	var endSequence = "";
	var ts = isStartToken ? nonEscapedValue : unescapedCurrentStartToken;
	if (ts.length > 1) {
		endSequence = "|\\" + ts.substr(0, 1) + "(?!\\" + ts.substr(1, 1) + ")[^" + ts.substr(0, 1) + "]*";
	}
	regex.sequence = new RegExp(tokens.start() + ".+?" + tokens.end() + "|[^" + tokens.start() + "]+" + endSequence, "g");
	regex.token = new RegExp(tokens.start() + ".*?" + tokens.end(), "g");
	regex.expression = new RegExp(tokens.start() + "|" + tokens.end(), "gm");
}
function trim(value) {
	return value.replace(regex.trim, '');
}
function trimQuotes(value) {
	if (regex.string.test(value)) {
		return value.substr(1, value.length-2);
	}
	return value;
}
function trimArray(value) {
	if (value[0] === "") value.shift();
	if (value[value.length-1] === "") value.pop();
	return value;
}
function trimTokens(value) {
	return value.replace(regex.expression, '');
}
function trimScopeDepth(value) {
	return value.replace(regex.depth, '');
}
function insertBefore(referenceNode, newNode) {
	if (!referenceNode.parentNode) return;
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}
function insertAfter(referenceNode, newNode) {
	if (!referenceNode.parentNode) return;
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function removeClass(elm, className) {
	if (document.documentElement.classList) {
		removeClass = function (elm, className) {
			elm.classList.remove(className);
		}
	} else {
		removeClass = function (elm, className) {
			if (!elm || !elm.className) {
				return false;
			}
			var reg = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
			elm.className = elm.className.replace(reg, "$2");
		}
	}
	removeClass(elm, className);
}
// jquery contains
var contains = typeof document !== 'object' ? function(){} : document.documentElement.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	document.documentElement.compareDocumentPosition ?
		function( a, b ) {
			return b && !!( a.compareDocumentPosition( b ) & 16 );
		} :
		function( a, b ) {
			while ( (b = b.parentNode) ) {
				if ( b === a ) {
					return true;
				}
			}
			return false;
		};


function HashMap() {
	var items = {};
	var id = 1;
	//var uuid = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b;}
	function uuid() { return ++id; };
	function getKey(target) {
		if (!target) return;
		if (typeof target !== 'object') return target;
		var result;
		try {
			// IE 7-8 needs a try catch, seems like I can't add a property on text nodes
			result = target.hashkey ? target.hashkey : target.hashkey = uuid();
		} catch(err){};
		return result;
	}
	this.remove = function(key) {
		delete items[getKey(key)];
	}
	this.get = function(key) {
		return items[getKey(key)];
	}
	this.put = function(key, value) {
		items[getKey(key)] = value;
	}
	this.has = function(key) {
		return typeof items[getKey(key)] !== 'undefined';
	}
	this.getData = function() {
		return items;
	}
	this.dispose = function() {
		for (var key in items) {
			delete items[key];
		}
		this.length = 0;
	}
}

function getRepeaterData(repeaterValue, scope) {
	var parts = repeaterValue.match(regex.repeat);
	if (!parts) return;
	var source = parts[2];
	var exp = new Expression(source);
	return exp.getValue(scope);
}

function updateScopeWithRepeaterData(repeaterValue, scope, data) {
	var parts = repeaterValue.match(regex.repeat);
	if (!parts) return;
	var name = parts[1];
	scope[name] = data;
}
function getWatcherValue(exp, newValue) {
	var node = exp.node || exp.attribute.node;
	var watchers = node.template.watchers;
	var nodeTarget = node.element;
	if (!watchers) return newValue;
	var watcherNode = watchers.get(nodeTarget);
	if (!watcherNode && isTextNode(node.element) && node.parent) watcherNode = watchers.get(node.parent.element);
	var watcher = watcherNode ? watcherNode : watchers.get(exp.pattern);
	if (isFunction(watcher)) {
		var watcherValue = watcher(exp.value, newValue, exp.pattern, node.scope, node, exp.attribute);
		if (isDefined(watcherValue)) {
			return watcherValue;
		}
	}
	return newValue;
}

function getScopeFromPattern(scope, pattern) {
	var depth = getScopeDepth(pattern);
	var scopeTarget = scope;
	while (depth > 0) {
		scopeTarget = scopeTarget._parent ? scopeTarget._parent : scopeTarget;
		depth--;
	}
	return scopeTarget;
}

function getValueFromPattern(scope, pattern) {
	var exp = new Expression(pattern);
	return getValue(scope, exp.pattern, exp.path, exp.params);
}

function getValue(scope, pattern, pathString, params, getFunction, getParams, paramsFound) {
	// string
	if (regex.string.test(pattern)) {
		return trimQuotes(pattern);
	}
	// find params
	var paramsValues = [];
	if (!paramsFound && params) {
		for (var j = 0, jl = params.length; j < jl; j++) {
			paramsValues.push(getValueFromPattern(scope, params[j]));
		}
	}
	else paramsValues = paramsFound;
	if (getParams) return paramsValues;
	// find scope
	var scopeTarget = getScopeFromPattern(scope, pattern);
	// remove parent string
	pattern = pattern.replace(/..\//g, '');
	pathString = pathString.replace(/..\//g, '');
	if (!scopeTarget) return undefined;
	// search path
	var path = scopeTarget;
	var pathParts = pathString.split(/\.|\[|\]/g);
	if (pathParts.length > 0) {
		for (var i = 0, l = pathParts.length; i < l; i++) {
			if (pathParts[i] !== "") {
				path = path[pathParts[i]];
			}
			if (!isDefined(path)) {
				// no path, search in parent
				if (scopeTarget._parent) return getValue(scopeTarget._parent, pattern, pathString, params, getFunction, getParams, paramsValues);
				else return undefined;
			}
		}
	}
	// return value
	if (!isFunction(path)) {
		return path;
	}
	else {
		if (getFunction) return path;
		else return path.apply(null, paramsValues);
	}
	return undefined;
}

function getExpressionPath(value) {
	var val = value.split('(')[0];
	val = trimScopeDepth(val);
	return val;
}

function getParamsFromString(value) {
	return trimArray(value.split(regex.params));
}

function getScopeDepth(value) {
	var val = value.split('(')[0];
	var matches = val.match(regex.depth);
	return !matches ? 0 : matches.length;
}

function getNodeFromElement(element, scope, isRepeaterDescendant) {
	var node = new Node(element, scope);
	node.previousSibling = element.previousSibling;
	node.nextSibling = element.nextSibling;
	var attributes = [];
	var eventsArray = [];
	for (var attr, name, value, attrs = element.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
		attr = attrs[j];
		if (attr.specified) {
			name = attr.name;
			value = attr.value;
			if (name === settings.attributes.skip) {
				node.skip = (value === "" || value === "true");
			}
			if (name === settings.attributes.html) {
				node.html = (value === "" || value === "true");
			}
			if (name === settings.attributes.repeat && !isRepeaterDescendant) {
				node.repeater = value;
			}
			if (
				hasInterpolation(name + ':' + value) ||
					name === settings.attributes.repeat ||
					name === settings.attributes.skip ||
					name === settings.attributes.html ||
					name === settings.attributes.show ||
					name === settings.attributes.hide ||
					name === settings.attributes.href ||
					name === settings.attributes.checked ||
					name === settings.attributes.disabled ||
					name === settings.attributes.multiple ||
					name === settings.attributes.readonly ||
					name === settings.attributes.selected ||
					value.indexOf(settings.attributes.cloak) !== -1
				) {
				attributes.push(new Attribute(name, value, node));
			}
			if (events[name] && !isRepeaterDescendant) {
				eventsArray.push({name:events[name], value:value});
				attributes.push(new Attribute(name, value, node));
			}
		}
	}
	node.attributes = attributes;
	for (var i = 0, l = eventsArray.length; i < l; i++) {
		node.addEvent(eventsArray[i].name, eventsArray[i].value);
	}
	return node;
}

function hasInterpolation(value) {
	var matches = value.match(regex.token);
	return matches && matches.length > 0;
}

function hasContent(value) {
	return regex.content.test(value)
}

function isElementValid(element) {
	if (!element) return;
	var type = element.nodeType;
	if (!element || !type) return false;
	// comment
	if (type === 8) return false;
	// empty text node
	if (type === 3 && !hasContent(element.nodeValue) && !hasInterpolation(element.nodeValue)) return false;
	// result
	return true;
}

function compile(template, element, parent, nodeTarget) {
	if (!isElementValid(element)) return;
	// get node
	var node;
	if (!nodeTarget) {
		node = getNodeFromElement(element, parent ? parent.scope : new Scope(helpersScopeObject)._createChild(), parent && (parent.repeater || parent.isRepeaterDescendant) );
	}
	else {
		node = nodeTarget;
		node.parent = parent;
	}
	if (parent && (parent.repeater || parent.isRepeaterDescendant)) {
		node.isRepeaterDescendant = true;
	}
	node.template = template;
	// children
	if (node.skip) return;
	var child = element.firstChild;
	while (child) {
		var childNode = compile(template, child, node);
		if (childNode) {
			childNode.parent = node;
			node.children.push(childNode);
		}
		child = child.nextSibling;
	}
	return node;
}

function updateScopeWithData(scope, data) {
	clearScope(scope);
	for (var d in data) {
		scope[d] = data[d];
	}
}

function clearScope(scope) {
	for (var key in scope) {
		if (key.substr(0, 1) !== '_') {
			scope[key] = null;
			delete scope[key];
		}
	}
}

function updateNodeChildren(node) {
	if (node.repeater || !node.children || childNodeIsTemplate(node)) return;
	for (var i = 0, l = node.children.length; i < l; i++) {
		node.children[i].update();
	}
}

function renderNodeChildren(node) {
	if (!node.children || childNodeIsTemplate(node)) return;
	for (var i = 0, l = node.children.length; i < l; i++) {
		node.children[i].render();
	}
}

function renderNodeRepeater(node) {
	var data = getRepeaterData(node.repeater, node.scope);
	var previousElement;
	if (isArray(data)) {
		// process array
		for (var i = 0, l1 = data.length, l2 = node.childrenRepeater.length, l = l1 > l2 ? l1 : l2; i < l; i++) {
			if (i < l1) {
				previousElement = createRepeaterChild(node, i, data[i], vars.index, i, previousElement);
			}
			else {
				node.parent.element.removeChild(node.childrenRepeater[i].element);
				node.childrenRepeater[i].dispose();
			}
		}
		if (node.childrenRepeater.length > data.length) {
			node.childrenRepeater.length = data.length;
		}
	}
	else {
		// process object
		var count = -1;
		for (var o in data) {
			count++;
			previousElement = createRepeaterChild(node, count, data[o], vars.key, o, previousElement);
		}
		var size = count;
		while (count++ < node.childrenRepeater.length-1) {
			node.parent.element.removeChild(node.childrenRepeater[count].element);
			node.childrenRepeater[count].dispose();
		}
		node.childrenRepeater.length = size+1;
	}
	if (node.element.parentNode) {
		node.element.parentNode.removeChild(node.element);
	}
}

function cloneRepeaterNode(element, node) {
	var newNode = new Node(element, node.scope._createChild());
	if (node.attributes) {
		var attrs = [];
		for (var i = 0, l = node.attributes.length; i < l; i++) {
			newNode.renderAsHtml = node.renderAsHtml;
			if (node.attributes[i].name === settings.attributes.skip) {
				newNode.skip = (node.attributes[i].value === "" || node.attributes[i].value === "true");
			}
			if (node.attributes[i].name === settings.attributes.html) {
				newNode.html = (node.attributes[i].value === "" || node.attributes[i].value === "true");
			}
			if (node.attributes[i].name !== attributes.repeat) {
				var attribute = new Attribute(node.attributes[i].name, node.attributes[i].value, newNode);
				attrs.push(attribute);
			}
			if (events[node.attributes[i].name]) {
				newNode.addEvent(events[node.attributes[i].name], node.attributes[i].value);
			}
		}
		newNode.attributes = attrs;
	}
	return newNode;
}

function createRepeaterChild(node, count, data, indexVar, indexVarValue, previousElement) {
	var existingChild = node.childrenRepeater[count];
	if (!existingChild) {
		// no existing node
		var newElement = node.element.cloneNode(true);
		// can't recreate the node with a cloned element on IE7
		// be cause the attributes are not specified annymore (attribute.specified)
		//var newNode = getNodeFromElement(newElement, node.scope._createChild(), true);
		var newNode = cloneRepeaterNode(newElement, node);
		newNode.isRepeaterChild = true;
		newNode.parent = node.parent;
		newNode.template = node.template;
		node.childrenRepeater[count] = newNode;
		updateScopeWithRepeaterData(node.repeater, newNode.scope, data);
		newNode.scope[indexVar] = indexVarValue;
		compile(node.template, newElement, node.parent, newNode);
		newNode.update();
		newNode.render();
		if (!previousElement) {
			if (node.previousSibling) insertAfter(node.previousSibling, newElement);
			else if (node.nextSibling) insertBefore(node.nextSibling, newElement);
			else node.parent.element.appendChild(newElement);
		}
		else {
			insertAfter(previousElement, newElement);
		}
		return newElement;
	}
	else {
		// existing node
		updateScopeWithRepeaterData(node.repeater, existingChild.scope, data);
		existingChild.scope[indexVar] = indexVarValue;
		existingChild.update();
		existingChild.render();
		return existingChild.element;
	}
}

var Scope = function(data) {
	function createChild(data) {
		var obj = createObject(data);
		obj._parent = this;
		this._children.push(obj);
		return obj;
	}
	function createObject(data) {
		var obj = data || {};
		obj._parent = null;
		obj._children = [];
		obj._createChild = function(data) {
			return createChild.apply(obj, arguments);
		}
		return obj;
	}
	return createObject(data);
};

var Node = function(element, scope) {
	this.element = element;
	this.scope = scope;
	this.attributes = null;
	this.value = null;
	this.interpolation = null;
	this.invalidate = false;
	this.skip = false;
	this.repeater = null;
	this.isRepeaterDescendant = false;
	this.isRepeaterChild = false;
	this.parent = null;
	this.children = [];
	this.childrenRepeater = [];
	this.previousSibling = null;
	this.nextSibling = null;
	this.template = null;
	this.eventHandlers = {};
	this.html = false;

	if (isTextNode(this.element)) {
		this.value = this.element.nodeValue;
		this.interpolation = new Interpolation(this.value, this, undefined);
	}

};
Node.prototype = {
	toString: function() {
		return '[object Node]';
	},
	dispose: function() {
		this.clearEvents();
		var i, l;
		if (this.children) {
			for (i = 0, l = this.children.length; i < l; i++) {
				this.children[i].dispose();
			}
		}
		if (this.childrenRepeater) {
			for (i = 0, l = this.childrenRepeater.length; i < l; i++) {
				this.childrenRepeater[i].dispose();
			}
		}
		if (this.attributes) {
			for (i = 0, l = this.attributes.length; i < l; i++) {
				this.attributes[i].dispose();
			}
		}
		if (this.interpolation) {
			this.interpolation.dispose();
		}
		this.element = null;
		this.scope = null;
		this.attributes = null;
		this.attributesHashMap = null;
		this.value = null;
		this.interpolation = null;
		this.repeater = null;
		this.parent = null;
		this.children = null;
		this.childrenRepeater = null;
		this.previousSibling = null;
		this.nextSibling = null;
		this.template = null;
		this.eventHandlers = null;
	},
	getNode: function(element) {
		var node;
		if (element === this.element) return this;
		else if (this.childrenRepeater.length > 0) {
			for (var k = 0, kl = this.childrenRepeater.length; k < kl; k++) {
				node = this.childrenRepeater[k].getNode(element);
				if (node) return node;
			}
		}
		else {
			for (var i = 0, l = this.children.length; i < l; i++) {
				node = this.children[i].getNode(element);
				if (node) return node;
			}
		}
		return null;
	},
	getAttribute: function(name) {
		if (this.attributes) {
			for (var i = 0, l = this.attributes.length; i < l; i++) {
				var att = this.attributes[i];
				if (att.interpolationName && att.interpolationName.value === name) {
					return att;
				}
			}
		}
	},
	update: function() {
		if (childNodeIsTemplate(this)) return;
		if (isDefined(this.interpolation)) {
			this.interpolation.update();
		}
		if (isDefined(this.attributes)) {
			for (var i = 0, l = this.attributes.length; i < l; i++) {
				this.attributes[i].update();
			}
		}
		updateNodeChildren(this);
	},
	invalidateData: function() {
		if (childNodeIsTemplate(this)) return;
		this.invalidate = true;
		var i, l;
		if (this.attributes) {
			for (i = 0, l = this.attributes.length; i < l; i++) {
				this.attributes[i].invalidate = true;
			}
		}
		for (i = 0, l = this.childrenRepeater.length; i < l; i++) {
			this.childrenRepeater[i].invalidateData();
		}
		for (i = 0, l = this.children.length; i < l; i++) {
			this.children[i].invalidateData();
		}
	},
	addEvent: function(type, pattern) {
		if (this.repeater) return;
		if (this.eventHandlers[type]) {
			this.removeEvent(type);
		}
		var scope = this.scope;
		var handler = function(event) {
			var exp = new Expression(pattern, this.node);
			var func = exp.getValue(scope, true);
			var params = exp.getValue(scope, false, true);
			params.unshift(event);
			if (func) {
				func.apply(null, params);
			}
		};
		this.eventHandlers[type] = handler;
		addEvent(this.element, type, handler);
	},
	removeEvent: function(type) {
		removeEvent(this.element, type, this.eventHandlers[type]);
		this.eventHandlers[type] = null;
		delete this.eventHandlers[type];
	},
	clearEvents: function() {
		if (this.eventHandlers) {
			for (var key in this.eventHandlers) {
				this.removeEvent(key, this.eventHandlers[key]);
			}
		}
		if (this.children) {
			for (var k = 0, kl = this.children.length; k < kl; k++) {
				this.children[k].clearEvents();
			}
		}
		if (this.childrenRepeater) {
			for (var f = 0, fl = this.childrenRepeater.length; f < fl; f++) {
				this.childrenRepeater[f].clearEvents();
			}
		}
	},
	render: function() {
		if (childNodeIsTemplate(this)) return;
		if (this.invalidate) {
			this.invalidate = false;
			if (isTextNode(this.element)) {
				if (this.parent && this.parent.html) {
					this.value = this.parent.element.innerHTML = this.interpolation.render();
				}
				else {
					this.value = this.element.nodeValue = this.interpolation.render();
				}
			}
		}
		if (this.attributes) {
			for (var i = 0, l = this.attributes.length; i < l; i++) {
				this.attributes[i].render();
			}
		}
		if (this.repeater) {
			renderNodeRepeater(this);
		}
		else {
			renderNodeChildren(this);
		}
	}
};
var Attribute = function(name, value, node) {
	this.name = name;
	this.value = value;
	this.node = node;
	this.interpolationName = new Interpolation(this.name, null, this);
	this.interpolationValue = new Interpolation(this.value, null, this);
	this.invalidate = false;
};
Attribute.prototype = {
	toString: function() {
		return '[object Attribute]';
	},
	dispose: function() {
		if (this.interpolationName) this.interpolationName.dispose();
		if (this.interpolationValue) this.interpolationValue.dispose();
		this.interpolationName = null;
		this.interpolationValue = null;
		this.node = null;
		this.name = null;
		this.value = null;
		this.previousName = null;
	},
	update: function() {
		this.interpolationName.update();
		this.interpolationValue.update();
	},
	render: function() {
		if (this.node.repeater) return;
		var element = this.node.element;
		if (this.invalidate) {
			this.invalidate = false;
			this.previousName = this.name;
			this.name = isDefined(this.interpolationName.render()) ? this.interpolationName.render() : this.name;
			this.value = isDefined(this.interpolationValue.render()) ? this.interpolationValue.render() : this.value;


			if (this.name === attributes.src) {
				renderSrc(this.name, this.value);
			}
			else if (this.name === attributes.href) {
				renderHref(this.name, this.value);
			}
			else {
				if (this.node.isRepeaterChild && ie === 7) {
					// delete attributes on cloned elements crash IE7
				}
				else {
					this.node.element.removeAttribute(this.interpolationName.value);
				}
				if (this.previousName) {
					if (ie === 7 && this.previousName === 'class') {
						// iE
						this.node.element.className = "";
					}
					else {
						if (this.node.isRepeaterChild && ie === 7) {
							// delete attributes on cloned elements crash IE7
						}
						else {
							this.node.element.removeAttribute(this.previousName);
						}
					}
				}
				renderAttribute(this.name, this.value, this.previousName);
			}
		}
		// cloak
		if (this.name === 'class' && this.value.indexOf(settings.attributes.cloak) !== -1) {
			removeClass(this.node.element, settings.attributes.cloak);
		}
		// hide
		if (this.name === attributes.hide) {
			element.style.display = isAttributeDefined(this.value) ? "none" : "block";
		}
		// show
		if (this.name === attributes.show) {
			element.style.display = isAttributeDefined(this.value) ? "block" : "none";
		}
		// checked
		if (this.name === attributes.checked) {
			renderSpecialAttribute(this.name, this.value, 'checked');
			element.checked = isAttributeDefined(this.value) ? true : false;
		}
		// disabled
		if (this.name === attributes.disabled) {
			renderSpecialAttribute(this.name, this.value, 'disabled');
		}
		// multiple
		if (this.name === attributes.multiple) {
			renderSpecialAttribute(this.name, this.value, 'multiple');
		}
		// readonly
		if (this.name === attributes.readonly) {
			if (ie === 7) {
				element.readOnly = isAttributeDefined(this.value) ? true : false;
			}
			else {
				renderSpecialAttribute(this.name, this.value, 'readonly');
			}
		}
		// selected
		if (this.name === attributes.selected) {
			renderSpecialAttribute(this.name, this.value, 'selected');
		}
		// normal attribute
		function renderAttribute(name, value) {
			if (ie === 7 && name === "class") {
				element.className = value;
			}
			else {
				element.setAttribute(name, value);
			}
		}
		// special attribute
		function renderSpecialAttribute(name, value, attrName) {
			if (isAttributeDefined(value)) {
				element.setAttribute(attrName, attrName);
			}
			else {
				element.removeAttribute(attrName);
			}
		}
		// src attribute
		function renderSrc(name, value) {
			element.setAttribute('src', value);
		}
		// href attribute
		function renderHref(name, value) {
			element.setAttribute('href', value);
		}
	}
};

var Interpolation = function(value, node, attribute) {
	this.value = node && !isTextNode(node.element) ? trim(value) : value;
	this.node = node;
	this.attribute = attribute;
	this.sequence = [];
	this.expressions = [];
	var parts = this.value.match(regex.sequence);
	if (parts) {
		for (var i = 0, l = parts.length; i < l; i++) {
			if (parts[i].match(regex.token)) {
				var exp = new Expression(trimTokens(parts[i]), this.node, this.attribute);
				this.sequence.push(exp);
				this.expressions.push(exp);
			}
			else {
				this.sequence.push(parts[i]);
			}
		}
		trimArray(this.sequence);
	}
};
Interpolation.prototype = {
	toString: function() {
		return '[object Interpolation]';
	},
	dispose: function() {
		if (this.expressions) {
			for (var i = 0, l = this.expressions.length; i < l; i++) {
				this.expressions[i].dispose();
			}
		}
		this.value = null;
		this.node = null;
		this.attribute = null;
		this.sequence = null;
		this.expressions = null;
	},
	update: function() {
		var i = -1, l = this.expressions.length;
		while (++i < l) {
			this.expressions[i].update();
		}
	},
	render: function() {
		var rendered = "";
		if (this.sequence) {
			for (var i = 0, l = this.sequence.length; i < l; i++) {
				var val = "";
				if (isExpression(this.sequence[i])) val = this.sequence[i].value;
				else val = this.sequence[i];
				if (!isDefined(val)) val = "";
				rendered += val;
			}
		}
		return rendered;
	}
};

var Expression = function(pattern, node, attribute) {
	if (!isDefined(pattern)) return;
	this.pattern = pattern;
	this.isString = regex.string.test(pattern);
	this.node = node;
	this.attribute = attribute;
	this.value = this.isString ? this.pattern : undefined;
	if (this.isString) {
		this.isFunction = false;
		this.depth = null;
		this.path = null;
		this.params = null;
	}
	else {
		this.isFunction = isExpFunction(this.pattern);
		this.depth = getScopeDepth(this.pattern);
		this.path = getExpressionPath(this.pattern);
		this.params = !this.isFunction ? null : getParamsFromString(this.pattern.match(regex.func)[2]);
	}
};
Expression.prototype = {
	toString: function() {
		return '[object Expression]';
	},
	dispose: function() {
		this.pattern = null;
		this.node = null;
		this.attribute = null;
		this.path = null;
		this.params = null;
		this.value = null;
	},
	update: function() {
		var node = this.node;
		if (!node && this.attribute) node = this.attribute.node;
		if (!node && node.scope) return;
		var newValue = this.getValue(node.scope);
		newValue = getWatcherValue(this, newValue);
		if (this.value !== newValue) {
			this.value = newValue;
			(this.node || this.attribute).invalidate = true;
		}
	},
	getValue: function(scope, getFunction, getParams) {
		return getValue(scope, this.pattern, this.path, this.params, getFunction, getParams);
	}
};

var templates = new HashMap();

var Template = function(element) {
	this.watchers = new HashMap();
	this.node = null;
	this.scope = null;
	this.compile(element);
};
Template.prototype = {
	toString: function() {
		return '[object Template]';
	},
	compile: function(element) {
		if (element) this.element = element;
		if (this.node) this.node.dispose();
		this.node = compile(this, this.element);
		this.node.root = true;
		this.scope = this.node.scope;
	},
	update: function(data) {
		if (isDefined(data)) updateScopeWithData(this.node.scope, data);
		if (this.node) this.node.update();
	},
	render: function(data) {
		this.update(data);
		if (this.node) this.node.render();
	},
	invalidate: function() {
		if (this.node) this.node.invalidateData();
	},
	watch: function(target, watcher) {
		if ( (!isString(target) && !isElement(target)) || !isFunction(watcher)) return;
		this.watchers.put(target, watcher);
	},
	unwatch: function(target) {
		this.watchers.remove(target);
	},
	clearWatchers: function() {
		this.watchers.dispose();
	},
	clearEvents: function() {
		this.node.clearEvents();
	},
	getNode: function(element) {
		return this.node.getNode(element);
	},
	dispose: function() {
		templates.remove(this.element);
		if (this.watchers) {
			this.watchers.dispose();
		}
		if (this.node) {
			this.node.dispose();
		}
		this.element = null;
		this.watchers = null;
		this.node = null;
	}
};

// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini
// http://dean.edwards.name/weblog/2005/10/add-event/
function addEvent(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		// assign each event handler a unique ID
		if (!handler.$$guid) handler.$$guid = addEvent.guid++;
		// create a hash table of event types for the element
		if (!element.events) element.events = {};
		// create a hash table of event handlers for each element/event pair
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			// store the existing event handler (if there is one)
			if (element["on" + type]) {
				handlers[0] = element["on" + type];
			}
		}
		// store the event handler in the hash table
		handlers[handler.$$guid] = handler;
		// assign a global event handler to do all the work
		element["on" + type] = handleEvent;
	}
};
// a counter used to create unique IDs
addEvent.guid = 1;
function removeEvent(element, type, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(type, handler, false);
	} else {
		// delete the event handler from the hash table
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	}
};
function handleEvent(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
};
function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};

var maxDepth;
var eventStore = [];

function parseEvents(element, object, depth) {
	maxDepth = depth === undefined ? Number.MAX_VALUE : depth;
	parseNode(element, object, 0, true);
}

function parseNode(element, object, depth, isRoot) {
	if (!isElement(element)) throw new Error('Error in soma.template.parseEvents, only a DOM Element can be parsed.');
	if (isRoot) parseAttributes(element, object);
	if (maxDepth === 0) return;
	var child = element.firstChild;
	while (child) {
		if (child.nodeType === 1) {
			if (depth < maxDepth) {
				parseNode(child, object, ++depth);
				parseAttributes(child, object);
			}
		}
		child = child.nextSibling;
	}
}

function parseAttributes(element, object) {
	var attributes = [];
	for (var attr, name, value, attrs = element.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
		attr = attrs[j];
		if (attr.specified) {
			name = attr.name;
			value = attr.value;
			if (events[name]) {
				var handler = getHandlerFromPattern(object, value, element);
				if (handler && isFunction(handler)) {
					addEvent(element, events[name], handler);
					eventStore.push({element:element, type:events[name], handler:handler});
				}
			}
		}
	}
}

function getHandlerFromPattern(object, pattern, child) {
	var parts = pattern.match(regex.func);
	if (parts) {
		var func = parts[1];
		if (isFunction(object[func])) {
			return object[func];
		}
	}
}

function clearEvents(element) {
	var i = eventStore.length, l = 0;
	while (--i >= l) {
		var item = eventStore[i];
		if (element === item.element || contains(element, item.element)) {
			removeEvent(item.element, item.type, item.handler);
			eventStore.splice(i, 1);
		}
	}
}


if (settings.autocreate && typeof document === 'object') {
	// https://github.com/ded/domready
	var ready=function(){function l(b){for(k=1;b=a.shift();)b()}var b,a=[],c=!1,d=document,e=d.documentElement,f=e.doScroll,g="DOMContentLoaded",h="addEventListener",i="onreadystatechange",j="readyState",k=/^loade|c/.test(d[j]);return d[h]&&d[h](g,b=function(){d.removeEventListener(g,b,c),l()},c),f&&d.attachEvent(i,b=function(){/^c/.test(d[j])&&(d.detachEvent(i,b),l())}),f?function(b){self!=top?k?b():a.push(b):function(){try{e.doScroll("left")}catch(a){return setTimeout(function(){ready(b)},50)}b()}()}:function(b){k?b():a.push(b)}}();
	var parse = function(element) {
		var child = !element ? document.body : element.firstChild;
		while (child) {
			if (child.nodeType === 1) {
				parse(child);
				var attrValue = child.getAttribute(attributes.template);
				if (attrValue) {
					var getFunction = new Function('return ' + attrValue + ';');
					try {
						var f = getFunction();
						if (isFunction(f)) {
							soma.template.bootstrap(attrValue, child, f);
						}
					} catch(err){};
				}
			}
			child = child.nextSibling;
		}
	};
	ready(parse);
}
function bootstrapTemplate(attrValue, element, func) {
	var tpl = createTemplate(element);
	func(tpl, tpl.scope, tpl.element, tpl.node);
}
function createTemplate(source, target) {
	var element;
	if (isString(source)) {
		// string template
		if (!isElement(target)) {
			throw new Error(soma.template.errors.TEMPLATE_STRING_NO_ELEMENT);
		}
		target.innerHTML = source;
		element = target;
	}
	else if (isElement(source)) {
		if (isElement(target)) {
			// element template with target
			target.innerHTML = source.innerHTML;
			element = target;
		}
		else {
			// element template
			element = source;
		}
	}
	else {
		throw new Error(soma.template.errors.TEMPLATE_NO_PARAM);
	}
	// existing template
	if (getTemplate(element)) {
		getTemplate(element).dispose();
		templates.remove(element);
	}
	// create template
	var template = new Template(element);
	templates.put(element, template);
	return template;
}

function getTemplate(element) {
	return templates.get(element);
}

function renderAllTemplates() {
	for (var key in templates.getData()) {
		templates.get(key).render();
	}
}

function appendHelpers(obj) {
	if (obj === null) {
		helpersObject = {};
		helpersScopeObject = {};
	}
	if (isDefined(obj) && isObject(obj)) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				helpersObject[key] = helpersScopeObject[key] = obj[key];
			}
		}
	}
	return helpersObject;
}

// set regex
tokens.start(tokenStart);
tokens.end(tokenEnd);

// plugins

soma.plugins = soma.plugins || {};

var TemplatePlugin = function(instance, injector) {
	instance.constructor.prototype.createTemplate = function(cl, domElement) {
		if (!cl || typeof cl !== "function") {
			throw new Error("Error creating a template, the first parameter must be a function.");
		}
		if (domElement && isElement(domElement)) {
			var template = soma.template.create(domElement);
			for (var key in template) {
				if (typeof template[key] === 'function') {
					cl.prototype[key] = template[key].bind(template);
				}
			}
			cl.prototype.render = template.render.bind(template);
			var childInjector = injector.createChild();
			childInjector.mapValue("template", template);
			childInjector.mapValue("scope", template.scope);
			childInjector.mapValue("element", template.element);
			return childInjector.createInstance(cl);
		}
		return null;
	}
	soma.template.bootstrap = function(attrValue, element, func) {
		instance.createTemplate(func, element);
	}
}
if (soma.plugins && soma.plugins.add) {
	soma.plugins.add(TemplatePlugin);
}

soma.template.Plugin = TemplatePlugin;

// exports
soma.template.create = createTemplate;
soma.template.get = getTemplate;
soma.template.renderAll = renderAllTemplates;
soma.template.helpers = appendHelpers;
soma.template.bootstrap = bootstrapTemplate;
soma.template.addEvent = addEvent;
soma.template.removeEvent = removeEvent;
soma.template.parseEvents = parseEvents;
soma.template.clearEvents = clearEvents;
soma.template.ready = ready;

// register for AMD module
if (typeof define === 'function' && define.amd) {
	define("soma-template", soma.template);
}

// export for node.js
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = soma.template;
	}
	exports = soma.template;
}

})(this['soma'] = this['soma'] || {});