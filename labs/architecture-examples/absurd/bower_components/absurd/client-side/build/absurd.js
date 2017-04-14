/* version: 0.3.145, born: 10-2-2014 16:20 */
var Absurd = (function(w) {
var lib = { 
    api: {},
    helpers: {},
    plugins: {},
    processors: { 
        css: { plugins: {}},
        html: { 
            plugins: {},
            helpers: {}
        },
        component: { plugins: {}}
    }
};
var require = function(v) {
    // css preprocessor
    if(v.indexOf('css/CSS.js') > 0 || v == '/../CSS.js') {
        return lib.processors.css.CSS;
    } else if(v.indexOf('html/HTML.js') > 0) {
        return lib.processors.html.HTML;
    } else if(v.indexOf('component/Component.js') > 0) {
        return lib.processors.component.Component;
    } else if(v == 'js-beautify') {
        return { 
            html: function(html) {
                return html;
            }
        }
    } else if(v == './helpers/PropAnalyzer') {
        return lib.processors.html.helpers.PropAnalyzer;
    } else if(v == '../../helpers/TransformUppercase') {
        return lib.helpers.TransformUppercase;
    } else if(v == './helpers/TemplateEngine') {
        return lib.processors.html.helpers.TemplateEngine;
    } else if(v == '../helpers/Extend') {
        return lib.helpers.Extend;
    } else if(v == '../helpers/Clone') {
        return lib.helpers.Clone;
    } else if(v == '../helpers/Prefixes' || v == '/../../../helpers/Prefixes') {
        return lib.helpers.Prefixes;
    } else if(v == __dirname + '/../../../../') {
        return Absurd;
    } else {
        return function() {}
    }
};
var __dirname = "";
var queue  = function(funcs, scope) {
	(function next() {
		if(funcs.length > 0) {
			funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
		}
	})();
}
var str2DOMElement = function(html) {
   var wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        body: [0, "", ""],
        _default: [ 1, "<div>", "</div>"  ]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var match = /<\s*\w.*?>/g.exec(html);
    var element = document.createElement('div');
    if(match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
        if(tag.toLowerCase() === 'body') {
            var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            var body = document.createElement("body");
            // keeping the attributes
            element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
            var attrs = element.firstChild.attributes;
            body.innerHTML = html;
            for(var i=0; i<attrs.length; i++) {
                body.setAttribute(attrs[i].name, attrs[i].value);
            }
            return body;
        } else {
            var map = wrapMap[tag] || wrapMap._default, element;
            html = map[1] + html + map[2];
            element.innerHTML = html;
            // Descend through wrappers to the right content
            var j = map[0]+1;
            while(j--) {
                element = element.lastChild;
            }
        }
    } else {
        element.innerHTML = html;
        element = element.lastChild;
    }
    return element;
}
var addEventListener = function(obj, evt, fnc) {
    if (obj.addEventListener) { // W3C model
        obj.addEventListener(evt, fnc, false);
        return true;
    } else if (obj.attachEvent) { // Microsoft model
        return obj.attachEvent('on' + evt, fnc);
    }
}
var removeEmptyTextNodes = function(elem) {
    var children = elem.childNodes;
    var child;
    var len = children.length;
    var i = 0;
    var whitespace = /^\s*$/;
    for(; i < len; i++){
        child = children[i];
        if(child.nodeType == 3){
            if(whitespace.test(child.nodeValue)){
                elem.removeChild(child);
                i--;
                len--;
            }
        }
    }
    return elem;
}
var createNode = function(type, attrs, content) {
	var node = document.createElement(type);
	for(var i=0; i<attrs.length, a=attrs[i]; i++) {
		node.setAttribute(a.name, a.value);
	}
	node.innerHTML = content;
	return node;
}
var qs = function(selector, parent) {
    if(parent === false) { parent = document; }
    else { parent = parent || this.el || document; }
    return parent.querySelector(selector);
};
var qsa = function(selector, parent) {
    if(parent === false) { parent = document; }
    else { parent = parent || this.el || document; }
    return parent.querySelectorAll(selector);
};
var getStyle = function(styleProp, el) {
    el = el || this.el;
    if(el && el.currentStyle) {
        return el.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
        return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    }
    return null;
};
var addClass = function(className, el) {
    el = el || this.el;
    if(el.classList) {
        el.classList.add(className);
    } else {
        var current = el.className;
        if(current.indexOf(className) < 0) {
            if(current == '') el.className = className;
            else el.className += ' ' + className;
        }
    }
    return this;
};
var removeClass = function(className, el) {
    el = el || this.el;
    if (el.classList) {
        el.classList.remove(className);
    } else {
        var current = el.className.split(' ');
        var newClasses = [];
        for(var i=0; i<current.length; i++) {
            if(current[i] != className) newClasses.push(current[i]);
        }
        el.className = newClasses.join(' ');
    }
    return this;
}
var replaceClass = function(classNameA, classNameB, el) {
    el = el || this.el;
    var current = el.className.split(' '), found = false;
    for(var i=0; i<current.length; i++) {
        if(current[i] == classNameA) {
            found = true;
            current[i] = classNameB;
        }
    }
    if(!found) {
        return addClass(classNameB, el);
    }
    el.className = current.join(' ');
    return this;
}
var toggleClass = function(className, el) {
    el = el || this.el;
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = -1;
        for (var i = classes.length; i--;) {
            if (classes[i] === className)
                existingIndex = i;
        }
        
        if(existingIndex >= 0)
            classes.splice(existingIndex, 1);
        else
            classes.push(className);

        el.className = classes.join(' ');
    }
    return this;
}
var bind = function(func, scope, args) {
    if(scope instanceof Array) { args = scope; scope = this; }
    if(!scope) scope = this;
    return function() {
        func.apply(scope, (args || []).concat(Array.prototype.slice.call(arguments, 0)));
    }
}
var Component = function(componentName, absurd, eventBus, cls) {
	var api = lib.helpers.Extend({
		__name: componentName
	}, cls);
	var extend = lib.helpers.Extend;
var l = [];
api.listeners = l;
api.on = function(eventName, callback, scope) {
	if(!l[eventName]) {
		l[eventName] = [];
	}
	l[eventName].push({callback: callback, scope: scope});
	return this;
};
api.off = function(eventName, handler) {
	if(!l[eventName]) return this;
	if(!handler) l[eventName] = []; return this;
	var newArr = [];
	for(var i=0; i<l[eventName].length; i++) {
		if(l[eventName][i].callback !== handler) {
			newArr.push(l[eventName][i]);
		}
	}
	l[eventName] = newArr;
	return this;
};
api.dispatch = function(eventName, data, scope) {
	if(data && typeof data === 'object' && !(data instanceof Array)) {
		data.target = this;
	}
	if(l[eventName]) {
		for(var i=0; i<l[eventName].length; i++) {
			var callback = l[eventName][i].callback;
			callback.apply(scope || l[eventName][i].scope || {}, [data]);
		}
	}
	if(this[eventName] && typeof this[eventName] === 'function') {
		this[eventName](data);
	}
	if(eventBus) eventBus.dispatch(eventName, data);
	return this;
};
var storage = {};
api.set = function(key, value) {
	storage[key] = value;
	return this;
};
api.get = function(key) {
	return storage[key];
};
var CSS = false;
api.__handleCSS = function(next) {
	if(this.css) {
		absurd.flush().add(this.css).compile(function(err, css) {
			if(!CSS) {
				var style = createNode(
					'style', [
						{ name: "id", value: componentName + '-css' },
						{ name: "type", value: "text/css"}
					],
					 css
				);
				(qs("head") || qs("body")).appendChild(style);
				CSS = { raw: css, element: style };
			} else if(CSS.raw !== css) {
				CSS.raw = css;
				CSS.element.innerHTML = css;
			}
			next();
		});
	} else {
		next();
	}
	return this;
};
api.applyCSS = function(data, preventComposition, skipAutoPopulation) {
	if(this.html && typeof this.html === 'string' && !preventComposition) {
		var res = {};
		res[this.html] = data;
		data = res;
	}
	this.css = data;
	if(!skipAutoPopulation) {
		this.populate();
	}
	return this;
};
var HTMLSource = false;

api.__mergeDOMElements = function(e1, e2) {	
	removeEmptyTextNodes(e1);
	removeEmptyTextNodes(e2);
	if(typeof e1 === 'undefined' || typeof e2 === 'undefined' || e1.isEqualNode(e2)) return;
	// replace the whole node
	if(e1.nodeName !== e2.nodeName) {
		if(e1.parentNode) {
			e1.parentNode.replaceChild(e2, e1);
		}
		return;
	}
	// nodeValue
	if(e1.nodeValue !== e2.nodeValue) {
		e1.nodeValue = e2.nodeValue;
	}
	// attributes
	if(e1.attributes) {
		var attr1 = e1.attributes, attr2 = e2.attributes, a1, a2, found = {};
		for(var i=0; i<attr1.length, a1=attr1[i]; i++) {
			for(var j=0; j<attr2.length, a2=attr2[j]; j++) {
				if(a1.name === a2.name) {
					e1.setAttribute(a1.name, a2.value);
					found[a1.name] = true;
				}
			}
			if(!found[a1.name]) {
				e1.removeAttribute(a1.name);
			}
		}
		for(var i=0; i<attr2.length, a2=attr2[i]; i++) {
			if(!found[a2.name]) {
				e1.setAttribute(a2.name, a2.value);
			}
		}
	}
	// childs
	var newNodesToMerge = [];
	if(e1.childNodes.length >= e2.childNodes.length) {
		for(var i=0; i<e1.childNodes.length; i++) {
			if(!e2.childNodes[i]) { e2.appendChild(document.createTextNode("")); }
			newNodesToMerge.push([e1.childNodes[i], e2.childNodes[i]]);
		}
	} else {
		for(var i=0; i<e2.childNodes.length; i++) {
			e1.appendChild(document.createTextNode(""));						
			newNodesToMerge.push([e1.childNodes[i], e2.childNodes[i]]);
		}
	}
	for(var i=0; i<newNodesToMerge.length; i++) {
		api.__mergeDOMElements(newNodesToMerge[i][0], newNodesToMerge[i][1]);
	}
};
api.__handleHTML = function(next) {
	var self = this;
	var compile = function() {
		absurd.flush().morph("html").add(HTMLSource).compile(function(err, html) {
			if(!self.el) {
				self.el = str2DOMElement(html);
			} else {
				api.__mergeDOMElements(self.el, str2DOMElement(html));
			}
			next();
		}, self);
	}
	if(this.html) {
		if(typeof this.html === 'string') {
			if(!this.el) {
				var element = qs(this.html);
				if(element) {
					this.el = element;
					HTMLSource = {'': this.el.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>') };
				}
			}
			compile();
		} else if(typeof this.html === 'object') {
			HTMLSource = extend({}, this.html);
			compile();		
		} else {
			next();
		}
	} else {
		next();
	}
	return this;
};
api.applyHTML = function(data, skipAutoPopulation) {
	this.html = data;
	if(!skipAutoPopulation) {
		this.populate();
	}
	return this;
};
var	appended = false
api.__append = function(next) {
	if(!appended && this.el && this.get("parent")) {
		appended = true;
		this.get("parent").appendChild(this.el);
	}
	next();
	return this;
}
var cache = { events: {} };
api.__handleEvents = function(next) {		
	if(this.el) {
		var self = this;
		var registerEvent = function(el) {
			var attrValue = el.getAttribute('data-absurd-event');
			var processAttributes = function(attrValue) {
				attrValue = attrValue.split(":");
				if(attrValue.length >= 2) {
					var eventType = attrValue[0];
					var methodName = attrValue[1];
					attrValue.splice(0, 2);
					var args = attrValue;
					if(!cache.events[eventType] || cache.events[eventType].indexOf(el) < 0) {
						if(!cache.events[eventType]) cache.events[eventType] = [];
						cache.events[eventType].push(el);
						addEventListener(el, eventType, function(e) {
							if(typeof self[methodName] === 'function') {
								var f = self[methodName];
								f.apply(self, [e].concat(args));
							}
						});
					}
				}
			}
			attrValue = attrValue.split(/, ?/g);
			for(var i=0; i<attrValue.length; i++) processAttributes(attrValue[i]);
		}
		if(this.el.hasAttribute && this.el.hasAttribute('data-absurd-event')) {
			registerEvent(this.el);
		}
		var els = this.el.querySelectorAll ? this.el.querySelectorAll('[data-absurd-event]') : [];
		for(var i=0; i<els.length; i++) {
			registerEvent(els[i]);
		}
	}
	next();
	return this;
}
api.__getAnimAndTransEndEventName = function(el) {
	if(!el) return;
    var a;
    var animations = {
      'animation': ['animationend', 'transitionend'],
      'OAnimation': ['oAnimationEnd', 'oTransitionEnd'],
      'MozAnimation': ['animationend', 'transitionend'],
      'WebkitAnimation': ['webkitAnimationEnd', 'webkitTransitionEnd']
    }
    for(a in animations){
        if( el.style[a] !== undefined ){
            return animations[a];
        }
    }
}
api.onAnimationEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[0], function(e) {
		func.apply(self, [e]);
	});
}
api.onTransitionEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[1], function(e) {
		func.apply(self, [e]);
	});
}
var	async = { funcs: {}, index: 0 };
api.__handleAsyncFunctions = function(next) {
	if(this.el) {
		var funcs = [];
		if(this.el.hasAttribute && this.el.hasAttribute("data-absurd-async")) {
			funcs.push(this.el);
		} else {
			var els = this.el.querySelectorAll ? this.el.querySelectorAll('[data-absurd-async]') : [];
			for(var i=0; i<els.length; i++) {
				funcs.push(els[i]);
			}
		}		
		if(funcs.length === 0) {
			next();
		} else {
			var self = this;
			(function callFuncs() {
				if(funcs.length === 0) {						
					next();
				} else {
					var el = funcs.shift(),
						value = el.getAttribute("data-absurd-async"),
						replaceNodes = function(childElement) {
							if(typeof childElement === 'string') {
								el.parentNode.replaceChild(str2DOMElement(childElement), el);
							} else {
								el.parentNode.replaceChild(childElement, el);
							}
							callFuncs();
						};
					if(typeof self[async.funcs[value].name] === 'function') {
						self[async.funcs[value].name].apply(self, [replaceNodes].concat(async.funcs[value].args));
					} else if(typeof async.funcs[value].func === 'function') {
						async.funcs[value].func.apply(self, [replaceNodes].concat(async.funcs[value].args));
					}
				}
			})();
		}			
	} else {
		next();
	}	
	return this;	
}
api.async = function() {
	var args = Array.prototype.slice.call(arguments, 0),
		func = args.shift(),
		index = '_' + (async.index++);
	async.funcs[index] = {args: args, name: func};
	return '<script data-absurd-async="' + index + '"></script>';
};
api.child = function() {
	var args = Array.prototype.slice.call(arguments, 0),
		children = this.get("children"),
		component = children && children[args.shift()],
		index = '_' + (async.index++);
	async.funcs[index] = {args: args, func: function(callback) {
		component.populate({callback: function(data) {
			callback(data.html.element);
		}});
	}};
	return '<script data-absurd-async="' + index + '"></script>';
};
api.wire = function(event) {
	absurd.components.events.on(event, this[event] || function() {}, this);
	return this;
};
var isPopulateInProgress = false;
api.populate = function(options) {
	if(isPopulateInProgress) return;
	isPopulateInProgress = true;
	queue([
		api.__handleCSS,
		api.__handleHTML,
		api.__append, 
		api.__handleEvents,
		api.__handleAsyncFunctions,
		function() {
			isPopulateInProgress = false;
			async = { funcs: {}, index: 0 }
			var data = {
				css: CSS, 
				html: { 
					element: this.el 
				}
			};
			this.dispatch("populated", data);
			if(options && typeof options.callback === 'function') { options.callback(data); }
		}
	], this);
	return this;
};
api.str2DOMElement = str2DOMElement;
api.addEventListener = addEventListener;
api.queue = queue;
api.qs = qs;
api.qsa = qsa;
api.getStyle = getStyle;
api.addClass = addClass;
api.removeClass = removeClass;
api.replaceClass = replaceClass;
api.bind = bind;
api.toggleClass = toggleClass;
api.compileHTML = function(HTML, callback, data) {
	absurd.flush().morph("html").add(HTML).compile(callback, data);
};
api.compileCSS = function(CSS, callback, options) {
	absurd.flush().add(CSS).compile(callback, options);
};
api.delay = function(time, fn, args) {
	var self = this;
	setTimeout(function() {
		fn.apply(self, args);
	}, time);
}
	return api;
};
var injecting = function(absurd) {
absurd.di.register('is', {
	appended: function(selector) {
		if(typeof selector == 'undefined') selector = this.host.html;
		return qs(selector) ? true : false;
	},
	hidden: function(el) {
		el = el || this.host.el;
		return el.offsetParent === null;
	}
});
absurd.di.register('router', {
	routes: [],
	mode: null,
	root: '/',
	getFragment: function() {
		var fragment = '';
		if(this.mode === 'history') {
			if(!location) return '';
			fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
			fragment = fragment.replace(/\?(.*)$/, '');
			fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
		} else {
			if(!window) return '';
			var match = window.location.href.match(/#(.*)$/);
			fragment = match ? match[1] : '';
		}
		return this.clearSlashes(fragment);
	},
    clearSlashes: function(path) {
    	return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
	add: function(re, handler) {
		if(typeof re == 'function') {
			handler = re;
			re = '';
		}
		this.routes.push({ re: re, handler: handler});
		return this;
	},
	remove: function(param) {
		for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
			if(r.handler === param || r.re === param) {
				this.routes.splice(i, 1); 
				return this;
			}
		}
		return this;
	},
	flush: function() {
		this.routes = [];
		this.mode = null;
		this.root = '/';
		return this;
	},
	config: function(options) {
		this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
		this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
		return this;
	},
	listen: function(loopInterval) {
		var self = this;
		var current = self.getFragment();
		var fn = function() {
			if(current !== self.getFragment()) {
				current = self.getFragment();
				self.check(current);
			}
		}
		clearInterval(this.interval);
		this.interval = setInterval(fn, loopInterval || 50);
		return this;
	},
	check: function(f) {
		var fragment = f || this.getFragment();
		for(var i=0; i<this.routes.length; i++) {
			var match = fragment.match(this.routes[i].re);
			if(match) {
				match.shift();
				this.routes[i].handler.apply(this.host || {}, match);
				return this;
			}			
		}
		return this;
	},
	navigate: function(path) {
		path = path ? path : '';
		if(this.mode === 'history') {
			history.pushState(null, null, this.root + this.clearSlashes(path));
		} else {
			window.location.href.match(/#(.*)$/);
			window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
		}
		return this;
	}
});
absurd.di.register('ajax', {
	request: function(ops) {

		if(typeof ops == 'string') ops = { url: ops };
		ops.url = ops.url || '';
		ops.method = ops.method || 'get'
		ops.data = ops.data || {};

		var getParams = function(data, url) {
			var arr = [], str;
			for(var name in data) {
				arr.push(name + '=' + encodeURIComponent(data[name]));
			}
			str = arr.join('&');
			if(str != '') {
				return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
			}
			return '';
		}

		var api = {
			host: this.host || {},
			process: function(ops) {
				var self = this;
				this.xhr = null;
				if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
				else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
				if(this.xhr) {
					this.xhr.onreadystatechange = function() {
						if(self.xhr.readyState == 4 && self.xhr.status == 200) {
							var result = self.xhr.responseText;
							if(ops.json === true && typeof JSON != 'undefined') {
								result = JSON.parse(result);
							}
							self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
						} else if(self.xhr.readyState == 4) {
							self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
						}
						self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
					}
					
					if(ops.method == 'get') {
						this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
					} else {
						this.xhr.open(ops.method, ops.url, true);
						this.setHeaders({
							'X-Requested-With': 'XMLHttpRequest',
							'Content-type': 'application/x-www-form-urlencoded'
						});
					}
					if(ops.headers && typeof ops.headers == 'object') {
						this.setHeaders(ops.headers);
					}		
					setTimeout(function() { 
						ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data)); 
					}, 20);	
				}
				return this;
			},
			done: function(callback) {
				this.doneCallback = callback;
				return this;
			},
			fail: function(callback) {
				this.failCallback = callback;
				return this;
			},
			always: function(callback) {
				this.alwaysCallback = callback;
				return this;
			},
			setHeaders: function(headers) {
				for(var name in headers) {
					this.xhr && this.xhr.setRequestHeader(name, headers[name]);
				}
			}
		}

		return api.process(ops);

	}
});
var dom = function(el, parent) {
	var host = dom.prototype.host;
	var api = { el: null };
	// defining the scope
	switch(typeof el) {
		case 'undefined':
			api.el = host.el;
		break;
		case 'string':
			parent = parent && typeof parent === 'string' ? qs.apply(host, [parent]) : parent;
			api.el = qs(el, parent || host.el || document);
		break;
		case 'object': 
			if(typeof el.nodeName != 'undefined') {
	            api.el = el;
	        } else {
	        	var loop = function(value, obj) {
            		obj = obj || this;
            		for(var prop in obj) {
        				if(typeof obj[prop].el != 'undefined') {
        					obj[prop] = obj[prop].val(value);
        				} else if(typeof obj[prop] == 'object') {
        					obj[prop] = loop(value, obj[prop]);
        				}
            		}
            		delete obj.val;
            		return obj;
	        	}
	            var res = { val: loop };
	            for(var key in el) {
	                res[key] = dom.apply(this, [el[key]]);
	            }
	            return res;
	        }
		break;
	}
	// getting or setting a value
	api.val = function(value) {
		if(!this.el) return null;
		var set = !!value;
		var useValueProperty = function(value) {
			if(set) { this.el.value = value; return api; }
			else { return this.el.value; }
		}
        switch(this.el.nodeName.toLowerCase()) {
        	case 'input':
        		var type = this.el.getAttribute('type');
        		if(type == 'radio' || type == 'checkbox') {
	                var els = qsa('[name="' + this.el.getAttribute('name') + '"]', parent);
	                var values = [];
	                for(var i=0; i<els.length; i++) {
	                    if(set && els[i].checked && els[i].value !== value) {
	                        els[i].removeAttribute('checked');
	                    } else if(set && els[i].value === value) {
	                    	els[i].setAttribute('checked', 'checked');
	                    	els[i].checked = 'checked';
	                    } else if(els[i].checked) {
	                    	values.push(els[i].value);
	                    }
	                }
	                if(!set) { return type == 'radio' ? values[0] : values; }
	            } else {
	            	return useValueProperty.apply(this, [value]);
	            }
        	break;
        	case 'textarea': return useValueProperty.apply(this, [value]); break;
        	case 'select':
        		if(set) {
            		var options = qsa('option', this.el);
            		for(var i=0; i<options.length; i++) {
            			if(options[i].getAttribute('value') === value) {
            				this.el.selectedIndex = i;
            			} else {
            				options[i].removeAttribute('selected');
            			}
            		}
            	} else {
                	return this.el.value;
            	}
        	break;
        	default: 
        		if(set) {
        			this.el.innerHTML = value;
        		} else {
	        		if(typeof this.el.textContent != 'undefined') {
		                return this.el.textContent;
		            } else if(typeof this.el.innerText != 'undefined') {
		                return typeof this.el.innerText;
		            } else {
		                return this.el.innerHTML;
		            }
	        	}
        	break;
        }
        return set ? api : null;
	}
	// chaining dom module
	api.dom = function(el, parent) {
		return dom(el, parent || api.el);
	}
	return api;
}
absurd.di.register('dom', dom);
var mq = function(query, callback, usePolyfill) {
	var host = mq.prototype.host;
	var isMatchMediaSupported = !!(window && window.matchMedia) && !usePolyfill;
	if(isMatchMediaSupported) {
		var res = window.matchMedia(query);
		callback.apply(host, [res.matches, res.media]);
		res.addListener(function(changed) {
			callback.apply(host, [changed.matches, changed.media]);
		});
	} else {
		var id = ".match-media-" + absurd.components.numOfComponents;
		var css = {}, html = {};
		css[id] = { display: 'block' };
		css[id]['@media ' + query] = { display: 'none' };
		html['span' + id] = '';
		absurd.component(id + '-component', {
			css: css,
			html: html,
			intervaliTime: 30,
			status: '',
			loop: function(dom) {
				var self = this;
				if(this.el) {
					var d = this.getStyle('display');
					if(this.status != d) {
						this.status = d;
						callback.apply(host, [d === 'none'])
					}
				}
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			},
			constructor: ['dom', function(dom) {
				var self = this;
				this.set('parent', dom('body').el).populate();
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			}]
		})();
	}
};
absurd.di.register('mq', mq);
}
var client = function() {
	return function(arg) {

		/******************************************* Copied directly from /lib/API.js */

		var extend = function(destination, source) {
			for (var key in source) {
				if (hasOwnProperty.call(source, key)) {
					destination[key] = source[key];
				}
			}
			return destination;
		};

		var _api = { 
				defaultProcessor: lib.processors.css.CSS() 
			},
			_rules = {},
			_storage = {},
			_plugins = {},
			_hooks = {};

		_api.getRules = function(stylesheet) {
			if(typeof stylesheet === 'undefined') {
				return _rules;
			} else {
				if(typeof _rules[stylesheet] === 'undefined') {
					_rules[stylesheet] = [];
				}
				return _rules[stylesheet];
			}
		}
		_api.getPlugins = function() {
			return _plugins;		
		}
		_api.getStorage = function() {
			return _storage;
		}
		_api.flush = function() {
			_rules = {};
			_storage = [];
			_hooks = {};
			_api.defaultProcessor = lib.processors.css.CSS();
			return _api;
		}
		_api.import = function() { 
			if(_api.callHooks("import", arguments)) return _api;
			return _api; 
		}

		// hooks
		_api.addHook = function(method, callback) {
			if(!_hooks[method]) _hooks[method] = [];
			var isAlreadyAdded = false;
			for(var i=0; c=_hooks[method][i]; i++) {
				if(c === callback) {
					isAlreadyAdded = true;
				}
			}
			isAlreadyAdded === false ? _hooks[method].push(callback) : null;
		}
		_api.callHooks = function(method, args) {
			if(_hooks[method]) {
				for(var i=0; c=_hooks[method][i]; i++) {
					if(c.apply(_api, args) === true) return true;
				}
			}
			return false;
		}

		// internal variables
		_api.numOfAddedRules = 0;

		// absurd.components API
		_api.components = (function(api) {
			var extend = lib.helpers.Extend,
				clone = lib.helpers.Clone,
				comps = {}, 
				instances = [],
				events = extend({}, Component()),
				exports = {};

			(function(fn) {
				if(!window) return;
				if (window.addEventListener) {
					window.addEventListener('load', fn);
				} else if(window.attachEvent) {
					window.attachEvent('onload', fn);
				}
			})(function() {
				exports.broadcast("ready");
			})

			return exports = {
				numOfComponents: 0,
				events: events,
				register: function(name, cls) {
					this.numOfComponents += 1;
					return comps[name] = function() {
						var c = extend({}, Component(name, api, events, clone(cls)));
						api.di.resolveObject(c);
						instances.push(c);
						if(typeof c.constructor === 'function') {
							c.constructor.apply(c, Array.prototype.slice.call(arguments, 0));
						}
						return c;
					};
				},
				get: function(name) {
					if(comps[name]) { return comps[name]; }
					else { throw new Error("There is no component with name '" + name + "'."); }
				},
				remove: function(name) {
					if(comps[name]) { delete comps[name]; return true; }
					return false;
				},
				list: function() {
					var l = [];
					for(var name in comps) l.push(name);
					return l;
				},
				flush: function() {
					comps = {};
					instances = [];
					return this;
				},
				broadcast: function(event, data) {
					for(var i=0; i<instances.length, instance=instances[i]; i++) {
						if(typeof instance[event] === 'function') {
							instance[event](data);
						}
					}
					return this;
				}
			}
		})(_api);

		// absurd.component shortcut
		_api.component = (function(api) {
			return function(name, cls) {
				if(typeof cls == 'undefined') {
					return api.components.get(name);
				} else {
					return api.components.register(name, cls);
				}
			}
		})(_api);

		// dependency injector
		_api.di = lib.DI(_api);
		injecting(_api);

		/******************************************* Copied directly from /lib/API.js */

		// client side specific methods 
		_api.compile = function(callback, options) {
			if(_api.callHooks("compile", arguments)) return _api;
			var defaultOptions = {
				combineSelectors: true,
				minify: false,
				processor: _api.defaultProcessor,
				keepCamelCase: false,
				api: _api
			};
			options = extend(defaultOptions, options || {});
			options.processor(
				_api.getRules(),
				callback || function() {},
				options
			);
			_api.flush();
		}

		// registering api methods
		for(var method in lib.api) {
			if(method !== "compile") {
				_api[method] = lib.api[method](_api);
				_api[method] = (function(method) {
					return function() {
						var f = lib.api[method](_api);
						if(_api.callHooks(method, arguments)) return _api;
						return f.apply(_api, arguments);
					}
				})(method);		
			}
		}

		// registering plugins
		for(var pluginName in lib.processors.css.plugins) {
			_api.plugin(pluginName, lib.processors.css.plugins[pluginName]());
		}

		// accept function
		if(typeof arg === "function") {
			arg(_api);
		}

		// check for Organic
		if(typeof Organic != 'undefined') {
			Organic.init(_api);
		}

		// attaching utils functions
		_api.utils = {
			str2DOMElement: str2DOMElement
		}

		return _api;

	}
};lib.DI = function(api) {
	var injector = {
	    dependencies: {},
	    register: function(key, value) {
	        this.dependencies[key] = value;
	        return this;
	    },
	    resolve: function() {
	        var func, deps, scope, self = this, isForResolving = false;
	        if(typeof arguments[0] === 'string') {
	            func = arguments[1];
	            deps = arguments[0].replace(/ /g, '').split(',');
	            scope = arguments[2] || {};
	        } else {
	            func = arguments[0];
	            deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
	            scope = arguments[1] || {};
	        }
	        for(var i=0; i<deps.length; i++) {
	        	if(typeof this.dependencies[deps[i]] != 'undefined') isForResolving = true;
	        }
	        if(isForResolving) {
		        return function() {
		        	var args = [];
		            var a = Array.prototype.slice.call(arguments, 0);
		            for(var i=0; i<deps.length; i++) {
		                var d = deps[i];
		                if(typeof self.dependencies[d] != 'undefined') {
		                	var diModule = self.dependencies[d];
		                	if(typeof diModule == 'function') {
		                		diModule.prototype.host = scope;
		                	} else if(typeof diModule == 'object') {
		                		diModule.host = scope;
		                	}
							args.push(diModule);
		                } else {
		                	args.push(a.shift())
		                }
		            }
		            return func.apply(scope, args);
		        }
	    	}
	    	return func;
	    },
	    resolveObject: function(o) {
	    	if(typeof o == 'object') {
	    		for(var key in o) {
	    			if(typeof o[key] == 'function') {
	    				o[key] = this.resolve(o[key], o);
	    			} else if(o[key] instanceof Array && o[key].length == 2 && typeof o[key][0] == 'string' && typeof o[key][1] == 'function') {	    				
	    				o[key] = this.resolve(o[key][0], o[key][1], o);
	    			}
	    		}
	    	}
	    	return this;
	    },
	    flush: function() {
	    	this.dependencies = {};
	    	return this;
	    }
	}
	return injector;
};
lib.api.add = function(API) {
	var extend = require("../helpers/Extend"),
		prefixes = require("../helpers/Prefixes"),
		toRegister = [],
		options = {
			combineSelectors: true,
			preventCombining: ['@font-face']
		};

	var checkAndExecutePlugin = function(selector, prop, value, stylesheet, parentSelector) {
		var prefix = prefixes.nonPrefixProp(prop);
		var plugin = API.getPlugins()[prefix.prop];
		// console.log("\nChecking for plugin: " + prefix.prop + " (" + prop + ")");
		if(typeof plugin !== 'undefined') {
			var pluginResponse = plugin(API, value, prefix.prefix);
			if(pluginResponse) {
				addRule(selector, pluginResponse, stylesheet, parentSelector);
			}
			return true;
		} else {
			return false;
		}
	}
	var addRule = function(selector, props, stylesheet, parentSelector) {
		// console.log("\n---------- addRule ---------", parentSelector + ' >>> ' + selector, "\n", props);

		stylesheet = stylesheet || "mainstream";

		// catching null values
		if(props === null || typeof props === 'undefined' || props === false) return;
		if(!parentSelector && !selector) selector = '';

		// multiple selectors
		if(/, ?/g.test(selector) && options.combineSelectors) {
			var parts = selector.replace(/, /g, ',').split(',');
			for(var i=0; i<parts.length, p=parts[i]; i++) {
				addRule(p, props, stylesheet, parentSelector);	
			}
			return;
		}

		// check for plugin
		if(checkAndExecutePlugin(null, selector, props, stylesheet, parentSelector)) {
			return;	
		}

		// if array is passed
		if(typeof props.length !== 'undefined' && typeof props === "object") {
			for(var i=0; i<props.length, prop=props[i]; i++) {
				addRule(selector, prop, stylesheet, parentSelector);
			}
			return;
		}

		var _props = {}, 
			_selector = selector,
			_objects = {}, 
			_functions = {};

		// processing props
		for(var prop in props) {
			// classify
			if(props[prop] && typeof props[prop].classify != 'undefined' && props[prop].classify === true) {
				props[prop] = typeof props[prop].toJSON != 'undefined' ? props[prop].toJSON() : props[prop].toString();
			}
			var type = typeof props[prop];
			if(type !== 'object' && type !== 'function' && props[prop] !== false && props[prop] !== true) {
				if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					// moving the selector to the top of the chain
					if(_selector.indexOf("^") === 0) {
						_selector = _selector.substr(1, _selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '');
					} else {
						_selector = typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector;
					}
					_props[prop] = props[prop];
					prefixes.addPrefixes(prop, _props);
				}
			} else if(type === 'object') {
				_objects[prop] = props[prop];
			} else if(type === 'function') {
				_functions[prop] = props[prop];
			}
		}

		toRegister.push({
			selector: _selector,
			props: _props,
			stylesheet: stylesheet
		});

		for(var prop in _objects) {
			// check for pseudo classes			
			if(prop.charAt(0) === ":") {
				addRule(selector + prop, _objects[prop], stylesheet, parentSelector);
		    // check for ampersand operator
			} else if(/&/g.test(prop)) {
				if(/, ?/g.test(prop) && options.combineSelectors) {
					var parts = prop.replace(/, /g, ',').split(',');
					for(var i=0; i<parts.length, p=parts[i]; i++) {
						if(p.indexOf('&') >= 0) {
							addRule(p.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
						} else {
							addRule(p, _objects[prop], stylesheet, typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector);
						}
					}
				} else {
					addRule(prop.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
				}
			// check for media query
			} else if(prop.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(selector, _objects[prop], prop, parentSelector);
			// check for media query
			} else if(selector.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(prop, _objects[prop], selector, parentSelector);
			// moving the selector to the top of the chain
			} else if(selector.indexOf("^") === 0) {
				// selector, props, stylesheet, parentSelector
				addRule(
					selector.substr(1, selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '') + " " + prop,
					_objects[prop], 
					stylesheet
				);
			// check for plugins
			} else if(checkAndExecutePlugin(selector, prop, _objects[prop], stylesheet, parentSelector) === false) {
				addRule(prop, _objects[prop], stylesheet, (parentSelector ? parentSelector + " " : "") + selector);
			}
		}

		for(var prop in _functions) {
			var o = {};
			o[prop] = _functions[prop]();
			addRule(selector, o, stylesheet, parentSelector);
		}
		
	}

	var add = function(rules, stylesheet, opts) {

		try {

			toRegister = [];
			API.numOfAddedRules += 1;

			if(typeof stylesheet === 'object' && typeof opts === 'undefined') {
				options = {
					combineSelectors: typeof stylesheet.combineSelectors != 'undefined' ? stylesheet.combineSelectors : options.combineSelectors,
					preventCombining: options.preventCombining.concat(stylesheet.preventCombining || [])
				};
				stylesheet = null;
			}
			if(typeof opts != 'undefined') {
				options = {
					combineSelectors: opts.combineSelectors || options.combineSelectors,
					preventCombining: options.preventCombining.concat(opts.preventCombining || [])
				};
			}

			var typeOfPreprocessor = API.defaultProcessor.type, uid;

			for(var selector in rules) {
				addRule(selector, rules[selector], stylesheet || "mainstream");
			}

			// looping through the rules for registering
			for(var i=0; i<toRegister.length; i++) {
				var stylesheet = toRegister[i].stylesheet,
					selector = toRegister[i].selector,
					props = toRegister[i].props,
					allRules = API.getRules(stylesheet);
				var pc = options && options.preventCombining ? '|' + options.preventCombining.join('|') : '';
				var uid = pc.indexOf('|' + selector) >= 0 ? '~~' + API.numOfAddedRules + '~~' : '';
				// overwrite already added value
				var current = allRules[uid + selector] || {};
				for(var propNew in props) {
					var value = props[propNew];
					propNew = uid + propNew;
					if(typeof value != 'object') {
						if(typeOfPreprocessor == "css") {
							// appending values
							if(value.toString().charAt(0) === "+") {
								if(current && current[propNew]) {
									current[propNew] = current[propNew] + ", " + value.substr(1, value.length-1);	
								} else {
									current[propNew] = value.substr(1, value.length-1);	
								}
							} else if(value.toString().charAt(0) === ">") {
								if(current && current[propNew]) {
									current[propNew] = current[propNew] + " " + value.substr(1, value.length-1);	
								} else {
									current[propNew] = value.substr(1, value.length-1);	
								}
							} else {
								current[propNew] = value;
							}
						} else {
							current[propNew] = value;
						}
						
					}
				}
				allRules[uid + selector] = current;
			}

		return API;

		} catch(err) {
			throw new Error("Error adding: " + JSON.stringify({rules: rules, error: err.toString()}));
		}
	}
	return add;
}
var extend = require("../helpers/Extend");

lib.api.compile = function(api) {
	return function() {
		var path = null, callback = null, options = null;
		for(var i=0; i<arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "function": callback = arguments[i]; break;
				case "string": path = arguments[i]; break;
				case "object": options = arguments[i]; break;
			}
		}

		var _defaultOptions = {
			combineSelectors: true,
			minify: false,
			keepCamelCase: false,
			processor: api.defaultProcessor,
			api: api
		};
		options = extend(_defaultOptions, options || {});

		options.processor(
			api.getRules(),
			function(err, result) {
				if(path != null) {
					try {
						fs.writeFile(path, result, function (err) {
							callback(err, result);
						});
					} catch(err) {
						callback.apply({}, arguments);
					}
				} else {
					callback.apply({}, arguments);
				}
				api.flush();
			},
			options
		);
		
	}
}
lib.api.compileFile = function(api) {
	return api.compile;
}
var ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
};
lib.api.darken = function(api) {
	return function(color, percents) {
		return ColorLuminance(color, -(percents/100));
	}
}
lib.api.define = function(api) {
	return function(prop, value) {
		if(!api.getStorage().__defined) api.getStorage().__defined = {};
		api.getStorage().__defined[prop] = value;
		return api;
	}
}
lib.api.hook = function(api) {
	return function(method, callback) {
		api.addHook(method, callback);
		return api;
	}
}
var ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
};
lib.api.lighten = function(api) {
	return function(color, percents) {
		return ColorLuminance(color, percents/100);
	}
}
var metamorphosis = {
	html: function(api) {
		api.defaultProcessor = require(__dirname + "/../processors/html/HTML.js")();
		api.hook("add", function(tags, template) {
			api.getRules(template || "mainstream").push(tags);
			return true;
		});
	},
	component: function(api) {
		api.defaultProcessor = require(__dirname + "/../processors/component/Component.js")();
		api.hook("add", function(component) {
			if(!(component instanceof Array)) component = [component];
			for(var i=0; i<component.length, c = component[i]; i++) {
				api.getRules("mainstream").push(c);
			}
			return true;
		});	
	}
}
lib.api.morph = function(api) {
	return function(type) {
		if(metamorphosis[type]) {
			api.flush();
			metamorphosis[type](api);
		}
		return api;
	}
}
lib.api.plugin = function(api) {
	var plugin = function(name, func) {
		api.getPlugins()[name] = func;
		return api;
	}
	return plugin;	
}
lib.api.raw = function(api) {
	return function(raw) {
		var o = {}, v = {};
		var id = "____raw_" + api.numOfAddedRules;
		v[id] = raw;
		o[id] = v;
		api.add(o);
		return api;
	}
}
var fs = require("fs"),
	path = require("path");

lib.api.rawImport = function(API) {
	
	var importFile = function(path) {
		var fileContent = fs.readFileSync(path, {encoding: "utf8"});
		API.raw(fileContent);
	}
	
	return function(path) {
		var p, _i, _len;
		if (typeof path === 'string') {
			importFile(path);
		} else {
			for (_i = 0, _len = path.length; _i < _len; _i++) {
				p = path[_i];
				importFile(p);
			}
		}
		return API;
    };
}

lib.api.register = function(api) {
	return function(method, func) {
		api[method] = func;
		return api;
	}
}
lib.api.storage = function(API) {
	var _s = API.getStorage();
	var storage = function(name, value) {
		if(typeof value !== "undefined") {
			_s[name] = value;
		} else if(typeof name === "object") {
			for(var _name in name) {
				if(Object.prototype.hasOwnProperty.call(name, _name)) {
					storage(_name, name[_name]);
				}
			}
    } else {
			if(_s[name]) {
				return _s[name];
			} else {
				throw new Error("There is no data in the storage associated with '" + name + "'");
			}
		}
		return API;
	}
	return storage;
}
lib.helpers.Clone = function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ], 
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) { 
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );    
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}
// credits: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
lib.helpers.ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
lib.helpers.Extend = function() {
	var process = function(destination, source) {	
	    for (var key in source) {
			if (hasOwnProperty.call(source, key)) {
			    destination[key] = source[key];
			}
	    }
	    return destination;
	};
	var result = arguments[0];
	for(var i=1; i<arguments.length; i++) {
		result = process(result, arguments[i]);
	}
	return result;
}
// http://docs.emmet.io/css-abbreviations/vendor-prefixes/ (w: webkit, m: moz, s: ms, o: o)
var prefixExtract = function(prop) {
	var result, match;
	if(match = prop.match(/^\-(w|m|s|o)+\-/) || prop.charAt(0) === '-') {
		if(match !== null && match[0]) {
			result = { prefix: match[0].replace(/-/g, '') }
			result.prop = prop.replace(match[0], '');
		} else {
			result = { prefix: '' }
			result.prop = prop.substr(1, prop.length);
		}
	} else {
		result = {
			prefix: false,
			prop: prop
		}
	}
	return result;
}
lib.helpers.Prefixes = {
	addPrefixes: function(prop, obj) {
		var originalProp = prop, p = prefixExtract(prop), value = obj[prop];
		if(p.prefix !== false) {
			delete obj[originalProp];
			obj[p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('w') >= 0)
				obj['-webkit-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('m') >= 0)
				obj['-moz-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('s') >= 0)
				obj['-ms-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('o') >= 0)
				obj['-o-' + p.prop] = value;
		}
	},
	nonPrefixProp: function(prop) {
		var p = prefixExtract(prop);
		if(p.prefix !== false) {
			if(p.prefix == '') { 
				p.prefix = '-';
			} else {
				p.prefix = '-' + p.prefix + '-'; 
			}
		}
		return p;
	}
}
lib.helpers.RequireUncached = function(module) {
	delete require.cache[require.resolve(module)]
    return require(module);
}
lib.helpers.TransformUppercase = function(prop, options) {
	var transformed = "";
	for(var i=0; c=prop.charAt(i); i++) {
		if(c === c.toUpperCase() && c.toLowerCase() !== c.toUpperCase()) {
			transformed += "-" + c.toLowerCase();
		} else {
			transformed += c;
		}
	}
	return transformed;
}
var compileComponent = function(input, callback, options) {

	var css = "", 
		html = "", 
		all = [],
		api = options.api;
		cssPreprocessor = require(__dirname + "/../css/CSS.js")(),
		htmlPreprocessor = require(__dirname + "/../html/HTML.js")();

	var processCSS = function(clb) {
		for(var i=0; i<all.length, component=all[i]; i++) {
			if(typeof component === "function") { component = component(); }
			api.add(component.css ? component.css : {});
		}
		cssPreprocessor(api.getRules(), function(err, result) {
			css += result;
			clb(err);
		}, options);
	}
	var processHTML = function(clb) {
		var index = 0;
		var error = null;
		var processComponent = function() {
			if(index > input.length-1) {
				clb(error);
				return;
			}
			var c = input[index];
			if(typeof c === "function") { c = c(); }
			api.morph("html").add(c.html ? c.html : {});
			htmlPreprocessor(api.getRules(), function(err, result) {
				html += result;
				index += 1;
				error = err;
				processComponent();
			}, options);
		}
		processComponent();
	}
	var checkForNesting = function(o) {
		for(var key in o) {
			if(key === "_include") {
				if(o[key] instanceof Array) {
					for(var i=0; i<o[key].length, c=o[key][i]; i++) {
						if(typeof c === "function") { c = c(); }
						all.push(c);
						checkForNesting(c);
					}
				} else {
					if(typeof o[key] === "function") { o[key] = o[key](); }
					all.push(o[key]);
					checkForNesting(o[key]);
				}
			} else if(typeof o[key] === "object") {
				checkForNesting(o[key]);
			}
		}
	}

	// Checking for nesting. I.e. collecting the css and html.
	for(var i=0; i<input.length, c=input[i]; i++) {
		if(typeof c === "function") { c = c(); }
		all.push(c);
		checkForNesting(c);
	}

	api.flush();
	processCSS(function(errCSS) {
		api.morph("html");
		processHTML(function(errHTML) {
			callback(
				errCSS || errHTML ? {error: {css: errCSS, html: errHTML }} : null,
				css,
				html
			)
		});
	});
	
}
lib.processors.component.Component = function() {
	var processor = function(rules, callback, options) {
		compileComponent(rules.mainstream, callback, options);
	}
	processor.type = "component";
	return processor;
}
var newline = '\n',
	defaultOptions = {
		combineSelectors: true,
		minify: false,
		keepCamelCase: false
	},
	transformUppercase = require("../../helpers/TransformUppercase");

var toCSS = function(rules, options, indent) {
	var css = '';
	indent = indent || ['', '  '];
	for(var selector in rules) {
		// handling raw content
		if(selector.indexOf("____raw") === 0) {
			css += rules[selector][selector] + newline;
		// handling normal styles
		} else {
			var entityStyle = indent[0] + selector.replace(/~~(.+)~~/, '') + ' {' + newline;
			var entity = '';
			for(var prop in rules[selector]) {
				var value = rules[selector][prop];
				if(value === "") {
					value = '""';
				}
				prop = prop.replace(/^%(.*)+?%/, '').replace(/~~(.+)~~/, '');
				if(options && options.keepCamelCase === true) {
					entity += indent[1] + prop + ': ' + value + ';' + newline;
				} else {
					entity += indent[1] + transformUppercase(prop) + ': ' + value + ';' + newline;
				}
			}
			if(entity != '') {
				entityStyle += entity;
				entityStyle += indent[0] + '}' + newline;
				css += entityStyle;
			}
		}
	}
	return css;
}

// combining selectors
var combineSelectors = function(rules, preventCombining) {

	var map = [], arr = {};
	var preventCombining = [].concat(preventCombining || []);
	preventCombining.splice(0, 0, '');
	preventCombining = preventCombining.join('|');

	// extracting every property
	for(var selector in rules) {
		var props = rules[selector];
		for(var prop in props) {
			map.push({
				selector: selector, 
				prop: prop, 
				value: props[prop], 
				combine: preventCombining.indexOf('|' + prop) < 0
			});
		}
	}

	// combining
	for(var i=0; i<map.length; i++) {
		if(map[i].combine === true && map[i].selector !== false) {
			for(var j=i+1;j<map.length; j++) {
				if(map[i].prop === map[j].prop && map[i].value === map[j].value) {
					map[i].selector += ', ' + map[j].selector;
					map[j].selector = false; // marking for removal
				}
			}
		}
	}

	// preparing the result
	for(var i=0; i<map.length; i++) {
		if(map[i].selector !== false) {
			if(!arr[map[i].selector]) arr[map[i].selector] = {}
			arr[map[i].selector][map[i].prop] = map[i].value;
		}
	}

	// // creating the map
	// for(var selector in rules) {
	// 	var props = rules[selector];
	// 	for(var prop in props) {
	// 		if(preventCombining.indexOf(prop) < 0) {
	// 			var value = props[prop];
	// 			if(!map[prop]) map[prop] = {};
	// 			if(!map[prop][value]) map[prop][value] = [];
	// 			map[prop][value].push(selector);
	// 		}
	// 	}
	// }
	// // converting the map to usual rules object
	// for(var prop in map) {
	// 	var values = map[prop];
	// 	for(var value in values) {
	// 		var selectors = values[value];
	// 		if(!arr[selectors.join(", ")]) arr[selectors.join(", ")] = {}
	// 		var selector = arr[selectors.join(", ")];
	// 		selector[prop] = value;	
	// 	}		
	// }
	
	return arr;
}

var minimize = function(content) {
    content = content.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );
    // now all comments, newlines and tabs have been removed
    content = content.replace( / {2,}/g, ' ' );
    // now there are no more than single adjacent spaces left
    // now unnecessary: content = content.replace( /(\s)+\./g, ' .' );
    content = content.replace( / ([{:}]) /g, '$1' );
    content = content.replace( /([;,]) /g, '$1' );
    content = content.replace( / !/g, '!' );
    return content;
}

var replaceDefined = function(css, options) {
	if(options && options.api && options.api.getStorage().__defined) {
		var storage = options.api.getStorage().__defined;
		for(var prop in storage) {
			var re = new RegExp('<%( )?' + prop + '( )?%>', 'g');
			if(typeof storage[prop] != 'function') {
				css = css.replace(re, storage[prop]);
			} else {
				css = css.replace(re, storage[prop]());
			}
		}
	}
	return css;
}

lib.processors.css.CSS = function() {
	var processor = function(rules, callback, options) {
		options = options || defaultOptions;
		var css = '';
		for(var stylesheet in rules) {
			var r = rules[stylesheet];
			r = options.combineSelectors ? combineSelectors(r, options.preventCombining) : r;
			if(stylesheet === "mainstream") {
				css += toCSS(r, options);
			} else {
				css += stylesheet + " {" + newline + toCSS(r, options, ['  ', '    ']) + "}" + newline;
			}		
		}
		css = replaceDefined(css, options);
		// Minification
		if(options.minify) {
			css = minimize(css);
			if(callback) callback(null, css);
		} else {
			if(callback) callback(null, css);
		}
		return css;
	}
	processor.type = "css";
	return processor;
}
lib.processors.css.plugins.charset = function() {	
	return function(api, charsetValue) {
		if(typeof charsetValue === "string") {
			api.raw("@charset: \"" + charsetValue + "\";");
		} else if(typeof charsetValue === "object") {
			charsetValue = charsetValue.charset.replace(/:/g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '');
			api.raw("@charset: \"" + charsetValue + "\";");
		}
	}
}
lib.processors.css.plugins.document = function() {	
	return function(api, value) {
		if(typeof value === "object") {
			var stylesheet = '';
			stylesheet += '@' + value.vendor + 'document';
			stylesheet += ' ' + value.document;
			if(value.rules && value.rules.length) {
				for(var i=0; rule=value.rules[i]; i++) {
					api.handlecssrule(rule, stylesheet);
				}
			} else if(typeof value.styles != "undefined") {
				api.add(value.styles, stylesheet);
			}
		}
	}
}
lib.processors.css.plugins.keyframes = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		var prefixes = require(__dirname + "/../../../helpers/Prefixes");
		if(typeof value === "object") {
			// js or json
			var frames;
			if(typeof value.frames != "undefined") {
				frames = value.frames;
			// css
			} else if(typeof value.keyframes != "undefined") {
				frames = {};
				for(var i=0; rule=value.keyframes[i]; i++) {
					if(rule.type === "keyframe") {
						var f = frames[rule.values] = {};
						for(var j=0; declaration=rule.declarations[j]; j++) {
							if(declaration.type === "declaration") {
								f[declaration.property] = declaration.value;
							}
						}
					}
				}
			}
			var absurd = require(__dirname + '/../../../../')();
			absurd.add(frames).compile(function(err, css) {
				var content = '@keyframes ' + value.name + " {\n";
				content += css;
				content += "}";
				content = content + "\n" + content.replace("@keyframes", "@-webkit-keyframes");
				api.raw(content);
			}, {combineSelectors: false});
		}
	}
}
lib.processors.css.plugins.media = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		if(typeof value === "object") {
			var content = '@media ' + value.media + " {\n";
			var rules = {};
			for(var i=0; rule=value.rules[i]; i++) {				
				var r = rules[rule.selectors.toString()] = {};
				if(rule.type === "rule") {
					for(var j=0; declaration=rule.declarations[j]; j++) {
						if(declaration.type === "declaration") {
							r[declaration.property] = declaration.value;
						}
					}
				}
			}
			content += processor({mainstream: rules});
			content += "}";
			api.raw(content);
		}
	}
}
lib.processors.css.plugins.namespace = function() {	
	return function(api, value) {
		if(typeof value === "string") {
			api.raw("@namespace: \"" + value + "\";");
		} else if(typeof value === "object") {
			value = value.namespace.replace(/: /g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '').replace(/:h/g, 'h');
			api.raw("@namespace: \"" + value + "\";");
		}
	}
}
lib.processors.css.plugins.page = function() {	
	return function(api, value) {
		if(typeof value === "object") {
			var content = ""; 
			if(value.selectors.length > 0) {
				content += "@page " + value.selectors.join(", ") + " {\n";
			} else {
				content += "@page {\n";
			}
			for(var i=0; declaration=value.declarations[i]; i++) {
				if(declaration.type == "declaration") {
					content += "  " + declaration.property + ": " + declaration.value + ";\n";
				}
			}
			content += "}";
			api.raw(content);
		}
	}
}
lib.processors.css.plugins.supports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		if(typeof value === "object") {
			var content = '@supports ' + value.supports + " {\n";
			var rules = {};
			for(var i=0; rule=value.rules[i]; i++) {				
				var r = rules[rule.selectors.toString()] = {};
				if(rule.type === "rule") {
					for(var j=0; declaration=rule.declarations[j]; j++) {
						if(declaration.type === "declaration") {
							r[declaration.property] = declaration.value;
						}
					}
				}
			}
			content += processor({mainstream: rules});
			content += "}";
			api.raw(content);
		}
	}
}
var data = null,
	newline = '\n',
	defaultOptions = {},
	tags = [],
	beautifyHTML = require('js-beautify').html,
	tu = require("../../helpers/TransformUppercase"),
	passedOptions = {};

var processTemplate = function(templateName) {
	var html = '';
	for(var template in data) {
		if(template == templateName) {
			var numOfRules = data[template].length;
			for(var i=0; i<numOfRules; i++) {
				html += process('', data[template][i]);
			}
		}
	}
	return html;
}
var prepareProperty = function(prop, options) {
	if(options && options.keepCamelCase === true) {
		return prop;
	} else {
		return tu(prop, options);
	}
}
var process = function(tagName, obj) {
	// console.log("------------------------\n", tagName, ">", obj);

	var html = '', attrs = '', childs = '';

	var tagAnalized = require("./helpers/PropAnalyzer")(tagName);
	tagName = tagAnalized.tag;
	if(tagAnalized.attrs != "") {
		attrs += " " + tagAnalized.attrs;
	}

	if(typeof obj === "string") {
		return packTag(tagName, attrs, obj);
	}

	var addToChilds = function(value) {
		if(childs != '') { childs += newline; }
		childs += value;
	}

	// process directives
	for(var directiveName in obj) {
		var value = obj[directiveName];
		switch(directiveName) {
			case "_attrs":
				for(var attrName in value) {
					if(typeof value[attrName] === "function") {
						attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName]() + "\"";
					} else {
						attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName] + "\"";
					}
				}
			break;
			case "_":
				addToChilds(value);
			break;
			case "_tpl": 
				if(typeof value == "string") {
					addToChilds(processTemplate(value));
				} else if(value instanceof Array) {
					var tmp = '';
					for(var i=0; tpl=value[i]; i++) {
						tmp += processTemplate(tpl)
						if(i < value.length-1) tmp += newline;
					}
					addToChilds(tmp);
				}
			break;
			case "_include":
				var tmp = '';
				var add = function(o) {
					if(typeof o === "function") { o = o(); }
					if(o.css && o.html) { o = o.html; } // catching a component
					tmp += process('', o);
				}
				if(value instanceof Array) {
					for(var i=0; i<value.length, o=value[i]; i++) {
						add(o);
					}
				} else if(typeof value === "object"){
					add(value);
				}
				addToChilds(tmp);
			break;
			default:
				switch(typeof value) {
					case "string": addToChilds(process(directiveName, value)); break;
					case "object": 
						if(value && value.length && value.length > 0) {
							var tmp = '';
							for(var i=0; v=value[i]; i++) {
								tmp += process('', typeof v == "function" ? v() : v);
								if(i < value.length-1) tmp += newline;
							}
							addToChilds(process(directiveName, tmp));
						} else {
							addToChilds(process(directiveName, value));
						}
					break;
					case "function": addToChilds(process(directiveName, value())); break;
				}
			break;
		}
	}

	if(tagName != '') {
		html += packTag(tagName, attrs, childs);
	} else {
		html += childs;
	}

	return html;
}
var packTag = function(tagName, attrs, childs) {
	var html = '';
	if(tagName == '' && attrs == '' && childs != '') {
		return childs;
	}
	tagName = tagName == '' ? 'div' : tagName;
	if(childs !== '') {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '>' + newline + childs + newline + '</' + prepareProperty(tagName, passedOptions) + '>';
	} else {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '/>';
	}
	return html;
}
var prepareHTML = function(html) {
	html = require("./helpers/TemplateEngine")(html.replace(/[\r\t\n]/g, ''), passedOptions);
	if(passedOptions.minify) {
		return html;
	} else {
		return beautifyHTML(html, {indent_size: passedOptions.indentSize || 4});
	}
}
lib.processors.html.HTML = function() {
	var processor = function(rules, callback, options) {
		data = rules;
		callback = callback || function() {};
		options = passedOptions = options || defaultOptions;
		var html = prepareHTML(processTemplate("mainstream"));
		callback(null, html);
		return html;
	}
	processor.type = "html";
	return processor;
}
lib.processors.html.helpers.PropAnalyzer = function(prop) {
	var res = { 
			tag: '',
			attrs: ''
		},
		numOfChars = prop.length,
		tagName = "",
		className = "", readingClass = false, classes = [],
		idName = "", readingId = false, ids = [],
		attributes = "", readingAttributes = false;

	if(/(#|\.|\[|\])/gi.test(prop) === false) {
		return {
			tag: prop,
			attrs: ''
		};
	}

	for(var i=0; i<prop.length, c=prop[i]; i++) {
		if(c === "[" && !readingAttributes) {
			readingAttributes = true;
		} else if(readingAttributes) {
			if(c != "]") {
				attributes += c;
			} else {
				readingAttributes = false;
				i -= 1;
			}
		} else if(c === "." && !readingClass) {
			readingClass = true;
		} else if(readingClass) {
			if(c != "." && c != "#" && c != "[" && c != "]") {
				className += c;
			} else {
				classes.push(className);
				readingClass = false;
				className = "";
				i -= 1;
			}
		} else if(c === "#" && !readingId) {
			readingId = true;
		} else if(readingId) {
			if(c != "." && c != "#" && c != "[" && c != "]") {
				idName += c;
			} else {
				readingId = false;
				i -= 1;
			}
		} else if(c != "." && c != "#" && c != "[" && c != "]") {
			res.tag += c;
		}
	}

	// if ends with a class
	if(className != "") classes.push(className);

	// collecting classes
	var clsStr = '';
	for(var i=0; cls=classes[i]; i++) {
		clsStr += clsStr === "" ? cls : " " + cls;
	}
	res.attrs += clsStr != "" ? 'class="' + clsStr + '"' : '';

	// if ends on id
	if(idName != "") {
		res.attrs += (res.attrs != "" ? " " : "") + 'id="' + idName + '"';
	}

	// if div tag name is skipped
	if(res.tag === "" && res.attrs != "") res.tag = "div";

	// collecting attributes
	if(attributes != "") {
		res.attrs += (res.attrs != "" ? " " : "") + attributes;
	}

	return res;
}
lib.processors.html.helpers.TemplateEngine = function(html, options) {
	var re = /<%(.+?)%>/g, reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, code = 'var r=[];\n', cursor = 0, result;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join("");').replace(/[\r\t\n]/g, '');
	try { result = new Function(code).apply(options); }
	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
};
return client();
})(window);