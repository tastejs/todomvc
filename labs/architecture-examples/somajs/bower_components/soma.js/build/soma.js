/*
Copyright (c) | 2012 | infuse.js | Romuald Quantin | www.soundstep.com | romu@soundstep.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function(infuse, undefined) {
    "use strict";

	infuse.version = "0.6.3";

	// regex from angular JS (https://github.com/angular/angular.js)
	var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
	var FN_ARG_SPLIT = /,/;
	var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	if(!Array.prototype.contains) {
	    Array.prototype.contains = function(value) {
	        var i = this.length;
	        while (i--) {
	            if (this[i] === value) return true;
	        }
	        return false;
	    };
	}

	infuse.InjectorError = {
		MAPPING_BAD_PROP: "[Error infuse.Injector.mapClass/mapValue] the first parameter is invalid, a string is expected",
		MAPPING_BAD_VALUE: "[Error infuse.Injector.mapClass/mapValue] the second parameter is invalid, it can't null or undefined, with property: ",
		MAPPING_BAD_CLASS: "[Error infuse.Injector.mapClass/mapValue] the second parameter is invalid, a function is expected, with property: ",
		MAPPING_BAD_SINGLETON: "[Error infuse.Injector.mapClass] the third parameter is invalid, a boolean is expected, with property: ",
		MAPPING_ALREADY_EXISTS: "[Error infuse.Injector.mapClass/mapValue] this mapping already exists, with property: ",
		CREATE_INSTANCE_INVALID_PARAM: "[Error infuse.Injector.createInstance] invalid parameter, a function is expected",
		NO_MAPPING_FOUND: "[Error infuse.Injector.getInstance] no mapping found",
		INJECT_INSTANCE_IN_ITSELF_PROPERTY: "[Error infuse.Injector.getInjectedValue] A matching property has been found in the target, you can't inject an instance in itself",
		INJECT_INSTANCE_IN_ITSELF_CONSTRUCTOR: "[Error infuse.Injector.getInjectedValue] A matching constructor parameter has been found in the target, you can't inject an instance in itself"
	};

	var MappingVO = function(prop, value, cl, singleton) {
		this.prop = prop;
		this.value = value;
		this.cl = cl;
		this.singleton = singleton || false;
	};

	var validateProp = function(prop) {
		if (typeof prop !== "string") {
			throw new Error(infuse.InjectorError.MAPPING_BAD_PROP);
		}
	};

	var validateValue = function(prop, val) {
		if (val === undefined || val === null) {
			throw new Error(infuse.InjectorError.MAPPING_BAD_VALUE + prop);
		}
	};

	var validateClass = function(prop, val) {
		if (typeof val !== "function") {
			throw new Error(infuse.InjectorError.MAPPING_BAD_CLASS + prop);
		}
	};

	var validateBooleanSingleton = function(prop, singleton) {
		if (typeof singleton !== "boolean") {
			throw new Error(infuse.InjectorError.MAPPING_BAD_SINGLETON + prop);
		}
	};

	var validateConstructorInjectionLoop = function(name, cl) {
		var params = infuse.getConstructorParams(cl);
		if (params.contains(name)) {
			throw new Error(infuse.InjectorError.INJECT_INSTANCE_IN_ITSELF_CONSTRUCTOR);
		}
	};

	var validatePropertyInjectionLoop = function(name, target) {
		if (target.hasOwnProperty(name)) {
			throw new Error(infuse.InjectorError.INJECT_INSTANCE_IN_ITSELF_PROPERTY);
		}
	};

	var instantiateIgnoringConstructor = function() {
		if (typeof arguments[0] !== "function") {
			throw new Error(infuse.InjectorError.CREATE_INSTANCE_INVALID_PARAM);
		}
		var TargetClass = arguments[0];
		var args = [null];
		for (var i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		return new (Function.prototype.bind.apply(TargetClass, args));
	};

	infuse.Injector = function() {
		this.mappings = {};
		this.parent = null;
	};

	infuse.getConstructorParams = function(cl) {
		var args = [];
		var clStr = cl.toString().replace(STRIP_COMMENTS, '');
		var argsFlat = clStr.match(FN_ARGS);
		var spl = argsFlat[1].split(FN_ARG_SPLIT);
		for (var i=0; i<spl.length; i++) {
			var arg = spl[i];
			arg.replace(FN_ARG, function(all, underscore, name){
				args.push(name);
			});
		}
		return args;
	};

	infuse.Injector.prototype = {

		createChild: function() {
			var injector = new infuse.Injector();
			injector.parent = this;
			return injector;
		},

		getMappingVo: function(prop) {
			if (!this.mappings) return null;
			if (this.mappings[prop]) return this.mappings[prop];
			if (this.parent) return this.parent.getMappingVo(prop);
			return null;
		},

		mapValue: function(prop, val) {
			if (this.mappings[prop]) {
				throw new Error(infuse.InjectorError.MAPPING_ALREADY_EXISTS + prop);
			}
			validateProp(prop);
			validateValue(prop, val);
			this.mappings[prop] = new MappingVO(prop, val);
			return this;
		},

		mapClass: function(prop, cl, singleton) {
			if (this.mappings[prop]) {
				throw new Error(infuse.InjectorError.MAPPING_ALREADY_EXISTS + prop);
			}
			validateProp(prop);
			validateClass(prop, cl);
			if (singleton) validateBooleanSingleton(prop, singleton);
			this.mappings[prop] = new MappingVO(prop, null, cl, singleton);
			return this;
		},

		removeMapping: function(prop) {
			this.mappings[prop] = null;
			delete this.mappings[prop];
			return this;
		},

		hasMapping: function(prop) {
			return !!this.mappings[prop];
		},

		hasInheritedMapping: function(prop) {
			return !!this.getMappingVo(prop);
		},

		getMapping: function(value) {
			for (var name in this.mappings) {
				var vo = this.mappings[name];
				if (vo.value === value || vo.cl === value) {
					return vo.prop;
				}
			}
		},

		getValue: function(prop) {
			var vo = this.mappings[prop];
			if (!vo) {
				if (this.parent) return this.parent.getValue.apply(this.parent, arguments);
				else throw new Error(infuse.InjectorError.NO_MAPPING_FOUND);
			}
			if (vo.cl) {
				arguments[0] = vo.cl;
				return this.getValueFromClass.apply(this, arguments);
			}
			return vo.value;
		},

		getClass: function(prop) {
			var vo = this.mappings[prop];
			if (!vo) {
				if (this.parent) return this.parent.getClass(prop);
				else return undefined;
			}
			if (vo.cl) return vo.cl;
			return undefined;
		},

		instantiate: function(TargetClass) {
			if (typeof TargetClass !== "function") {
				throw new Error(infuse.InjectorError.CREATE_INSTANCE_INVALID_PARAM);
			}
			var TargetClass = arguments[0];
			var args = [null];
			var params = infuse.getConstructorParams(TargetClass, this.mappings);
			for (var i=0; i<params.length; i++) {
				if (arguments[i+1] !== undefined && arguments[i+1] !== null) {
					// argument found
					args.push(arguments[i+1]);
				}
				else {
					var name = params[i];
					// no argument found
					var vo = this.getMappingVo(name);
					if (!!vo) {
						// found mapping
						var val = this.getInjectedValue(vo, name);
						args.push(val);
					}
					else {
						// no mapping found
						args.push(undefined);
					}
				}
			}
			return new (Function.prototype.bind.apply(TargetClass, args));
		},

		inject: function (target, isParent) {
			if (this.parent) {
				this.parent.inject(target, true);
			}
			for (var name in this.mappings) {
				var vo = this.getMappingVo(name);
				if (target.hasOwnProperty(vo.prop)) {
					var val = this.getInjectedValue(vo, name);
					target[name] = val;
				}
			}
			if (typeof target.postConstruct === 'function' && !isParent) {
				target.postConstruct();
			}
			return this;
		},

		getInjectedValue: function(vo, name) {
			var val = vo.value;
			var injectee;
			if (vo.cl) {
				var params = infuse.getConstructorParams(vo.cl);
				if (vo.singleton) {
					if (!vo.value) {
						validateConstructorInjectionLoop(name, vo.cl);
						vo.value = this.instantiate(vo.cl);
						injectee = vo.value;
					}
					val = vo.value;
				}
				else {
					validateConstructorInjectionLoop(name, vo.cl);
					val = this.instantiate(vo.cl);
					injectee = val;
				}
			}
			if (injectee) {
				validatePropertyInjectionLoop(name, injectee);
				this.inject(injectee);
			}
			return val;
		},

		createInstance: function() {
			var instance = this.instantiate.apply(this, arguments);
			this.inject(instance);
			return instance;
		},

		getValueFromClass: function(cl) {
			for (var name in this.mappings) {
				var vo = this.mappings[name];
				if (vo.cl == cl) {
					if (vo.singleton) {
						if (!vo.value) vo.value = this.createInstance.apply(this, arguments);
						return vo.value;
					}
					else {
						return this.createInstance.apply(this, arguments);
					}
				}
			}
			if (this.parent) {
				return this.parent.getValueFromClass.apply(this.parent, arguments);
			} else {
				throw new Error(infuse.InjectorError.NO_MAPPING_FOUND);
			}
		},

		dispose: function() {
			this.mappings = {};
		}

	};

	if (!Function.prototype.bind) {
		Function.prototype.bind = function bind(that) {
			var target = this;
			if (typeof target != "function") {
				throw new Error("Error, you must bind a function.");
			}
			var args = Array.prototype.slice.call(arguments, 1); // for normal call
			var bound = function () {
				if (this instanceof bound) {
					var F = function(){};
					F.prototype = target.prototype;
					var self = new F;
					var result = target.apply(
						self,
						args.concat(Array.prototype.slice.call(arguments))
					);
					if (Object(result) === result) {
						return result;
					}
					return self;
				} else {
					return target.apply(
						that,
						args.concat(Array.prototype.slice.call(arguments))
					);
				}
			};
			return bound;
		};
	}

	// register for AMD module
	if (typeof define === 'function' && define.amd) {
	    define("infuse", infuse);
	}
	
	// export for node.js
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = infuse;
		}
		exports = infuse;
	}

})(this['infuse'] = this['infuse'] || {});


/*
 Copyright (c) | 2012 | soma-events | Romuald Quantin | www.soundstep.com

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
 modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function (soma, undefined) {
	"use strict";

	soma.events = {};
	soma.events.version = "0.5.2";

	if (!Function.prototype.bind) {
		Function.prototype.bind = function bind(that) {
			var target = this;
			if (typeof target != "function") {
				throw new Error("Error, you must bind a function.");
			}
			var args = Array.prototype.slice.call(arguments, 1); // for normal call
			var bound = function () {
				if (this instanceof bound) {
					var F = function(){};
					F.prototype = target.prototype;
					var self = new F;
					var result = target.apply(
						self,
						args.concat(Array.prototype.slice.call(arguments))
					);
					if (Object(result) === result) {
						return result;
					}
					return self;
				} else {
					return target.apply(
						that,
						args.concat(Array.prototype.slice.call(arguments))
					);
				}
			};
			return bound;
		};
	};

	soma.Event = function (type, params, bubbles, cancelable) {
		var e = soma.Event.createGenericEvent(type, bubbles, cancelable);
		if (params !== null && params !== undefined) {
			e.params = params;
		}
		e.isCloned = false;
		e.clone = this.clone.bind(e);
		e.isIE9 = this.isIE9;
		e.isDefaultPrevented = this.isDefaultPrevented;
		if (this.isIE9() || !e.preventDefault || (e.getDefaultPrevented === undefined && e.defaultPrevented === undefined )) {
			e.preventDefault = this.preventDefault.bind(e);
		}
		if (this.isIE9()) e.IE9PreventDefault = false;
		return e;
	};

	soma.Event.prototype.clone = function () {
		var e = soma.Event.createGenericEvent(this.type, this.bubbles, this.cancelable);
		e.params = this.params;
		e.isCloned = true;
		e.clone = this.clone;
		e.isDefaultPrevented = this.isDefaultPrevented;
		e.isIE9 = this.isIE9;
		if (this.isIE9()) e.IE9PreventDefault = this.IE9PreventDefault;
		return e;
	};

	soma.Event.prototype.preventDefault = function () {
		if (!this.cancelable) return false;
		this.defaultPrevented = true;
		if (this.isIE9()) this.IE9PreventDefault = true;
		return this;
	};

	soma.Event.prototype.isDefaultPrevented = function () {
		if (!this.cancelable) return false;
		if (this.isIE9()) {
			return this.IE9PreventDefault;
		}
		if (this.defaultPrevented !== undefined) {
			return this.defaultPrevented;
		} else if (this.getDefaultPrevented !== undefined) {
			return this.getDefaultPrevented();
		}
		return false;
	};

	soma.Event.createGenericEvent = function (type, bubbles, cancelable) {
		var event;
		bubbles = bubbles !== undefined ? bubbles : true;
		if (typeof document === "object" && document.createEvent) {
			event = document.createEvent("Event");
			event.initEvent(type, !!bubbles, !!cancelable);
		} else if (typeof document === "object" && document.createEventObject) {
			event = document.createEventObject();
			event.type = type;
			event.bubbles = !!bubbles;
			event.cancelable = !!cancelable;
		} else {
			event = new EventObject(type, !!bubbles, !!cancelable);
		}
		return event;
	};

	soma.Event.prototype.isIE9 = function() {
		if (typeof document !== "object") return false;
		return document.body.style.scrollbar3dLightColor !== undefined && document.body.style.opacity !== undefined;
	};

	soma.Event.prototype.toString = function() {
		return "[soma.Event]";
	};

	var EventObject = function(type, bubbles, cancelable) {
		this.type = type;
		this.bubbles = !!bubbles;
		this.cancelable = !!cancelable;
		this.defaultPrevented = false;
		this.currentTarget = null;
		this.target = null;
	};

	soma.EventDispatcher = function () {
		this.listeners = [];
	};

	soma.EventDispatcher.prototype.addEventListener = function(type, listener, priority) {
		if (!this.listeners || !type || !listener) return;
		if (isNaN(priority)) priority = 0;
		for (var i=0; i<this.listeners.length; i++) {
			var eventObj = this.listeners[i];
			if (eventObj.type === type && eventObj.listener === listener) {
				return;
			}
		}
		this.listeners.push({type: type, listener: listener, priority: priority, scope:this});
	};

	soma.EventDispatcher.prototype.removeEventListener = function(type, listener) {
		if (!this.listeners || !type || !listener) return;
		var i = this.listeners.length;
		while(i-- > 0) {
			var eventObj = this.listeners[i];
			if (eventObj.type === type && eventObj.listener === listener) {
				this.listeners.splice(i, 1);
			}
		}
	};

	soma.EventDispatcher.prototype.hasEventListener = function(type) {
		if (!this.listeners || !type) return false;
		var i = 0;
		var l = this.listeners.length;
		for (; i < l; ++i) {
			var eventObj = this.listeners[i];
			if (eventObj.type === type) {
				return true;
			}
		}
		return false;
	};

	soma.EventDispatcher.prototype.dispatchEvent = function(event) {
		if (!this.listeners || !event) throw new Error("Error in EventDispatcher (dispatchEvent), one of the parameters is null or undefined.");
		var events = [];
		var i;
		for (i = 0; i < this.listeners.length; i++) {
			var eventObj = this.listeners[i];
			if (eventObj.type === event.type) {
				events.push(eventObj);
			}
		}
		events.sort(function(a, b) {
			return b.priority - a.priority;
		});
		for (i = 0; i < events.length; i++) {
			events[i].listener.apply((event.srcElement) ? event.srcElement : event.currentTarget, [event]);
		}
		return !event.isDefaultPrevented();
	};

	soma.EventDispatcher.prototype.dispatch = function(type, params, bubbles, cancelable) {
		if (!this.listeners || !type || type === "") throw new Error("Error in EventDispatcher (dispatch), one of the parameters is null or undefined.");
		var event = new soma.Event(type, params, bubbles, cancelable);
		this.dispatchEvent(event);
		return event;
	};

	soma.EventDispatcher.prototype.dispose = function() {
		this.listeners = null;
	};

	soma.EventDispatcher.prototype.toString = function() {
		return "[soma.EventDispatcher]";
	};

	// register for AMD module
	if (typeof define === 'function' && define.amd) {
		define("soma-events", soma);
	};

	// export for node.js
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = soma;
		}
		exports = soma;
	};

})(this['soma'] = this['soma'] || {});


;(function (soma, infuse, undefined) {

	'use strict';

	soma.version = "2.0.0";

	soma.applyProperties = function(target, extension, bindToExtension, list) {
		if (Object.prototype.toString.apply(list) === '[object Array]') {
			for (var i = 0, l = list.length; i < l; i++) {
				if (target[list[i]] === undefined || target[list[i]] === null) {
					if (bindToExtension && typeof extension[list[i]] === 'function') {
						target[list[i]] = extension[list[i]].bind(extension);
					}
					else {
						target[list[i]] = extension[list[i]];
					}
				}
			}
		}
		else {
			for (var prop in extension) {
				if (bindToExtension && typeof extension[prop] === 'function') {
					target[prop] = extension[prop].bind(extension);
				}
				else {
					target[prop] = extension[prop];
				}
			}
		}
	};

	soma.augment = function (target, extension, list) {
		if (!extension.prototype || !target.prototype) {
			return;
		}
		if (Object.prototype.toString.apply(list) === '[object Array]') {
			for (var i = 0, l = list.length; i < l; i++) {
				if (!target.prototype[list[i]]) {
					target.prototype[list[i]] = extension.prototype[list[i]];
				}
			}
		}
		else {
			for (var prop in extension.prototype) {
				if (!target.prototype[prop]) {
					target.prototype[prop] = extension.prototype[prop];
				}
			}
		}
	};

	soma.inherit = function (parent, obj) {
		var Subclass;
		if (obj && obj.hasOwnProperty('constructor')) {
			// use constructor if defined
			Subclass = obj.constructor;
		} else {
			// call the super constructor
			Subclass = function () {
				return parent.apply(this, arguments);
			};
		}
		// set the prototype chain to inherit from the parent without calling parent's constructor
		var Chain = function(){};
		Chain.prototype = parent.prototype;
		Subclass.prototype = new Chain();
		// add obj properties
		if (obj) soma.applyProperties(Subclass.prototype, obj);
		// point constructor to the Subclass
		Subclass.prototype.constructor = Subclass;
		// set super class reference
		Subclass.parent = parent.prototype;
		// add extend shortcut
		Subclass.extend = function (obj) {
			return soma.inherit(Subclass, obj);
		};
		return Subclass;
	};

	soma.extend = function (obj) {
		return soma.inherit(function () {
		}, obj);
	};
	// plugins

	var plugins = [];
	soma.plugins = soma.plugins || {};
	soma.plugins.add = function(plugin) {
		plugins.push(plugin);
	};
	soma.plugins.remove = function(plugin) {
		for (var i = plugins.length-1, l = 0; i >= l; i--) {
			if (plugin === plugins[i]) {
				plugins.splice(i, 1);
			}
		}
	};

	// framework
	soma.Application = soma.extend({
		constructor: function() {
			setup.bind(this)();
			this.init();
			this.start();

			function setup() {
				// injector
				this.injector = new infuse.Injector(this.dispatcher);
				// dispatcher
				this.dispatcher = new soma.EventDispatcher();
				// mapping
				this.injector.mapValue('injector', this.injector);
				this.injector.mapValue('instance', this);
				this.injector.mapValue('dispatcher', this.dispatcher);
				// mediator
				this.injector.mapClass('mediators', Mediators, true);
				this.mediators = this.injector.getValue('mediators');
				// commands
				this.injector.mapClass('commands', Commands, true);
				this.commands = this.injector.getValue('commands');
				// plugins
				for (var i = 0, l = plugins.length; i < l; i++) {
					this.createPlugin(plugins[i]);
				}
			}

		},
		createPlugin: function() {
			if (arguments.length == 0 || !arguments[0]) {
				throw new Error("Error creating a plugin, plugin class is missing.");
			}
			var params = infuse.getConstructorParams(arguments[0]);
			var args = [arguments[0]];
			for (var i=0; i<params.length; i++) {
				if (this.injector.hasMapping(params[i]) || this.injector.hasInheritedMapping(params[i])) {
					args.push(this.injector.getValue(params[i]));
				}
			}
			for (var j=1; j<arguments.length; j++) {
				args.push(arguments[j]);
			}
			return this.injector.createInstance.apply(this.injector, args);
		},
		init: function() {

		},
		start: function() {

		},
		dispose: function() {
			// mapping
			if (this.injector) {
				this.injector.removeMapping('injector');
				this.injector.removeMapping('dispatcher');
				this.injector.removeMapping('mediators');
				this.injector.removeMapping('commands');
				this.injector.removeMapping('instance');
			}
			// variables
			if (this.injector) {
				this.injector.dispose();
			}
			if (this.dispatcher) {
				this.dispatcher.dispose();
			}
			if (this.mediators) {
				this.mediators.dispose();
			}
			if (this.commands) {
				this.commands.dispose();
			}
			this.injector = undefined;
			this.dispatcher = undefined;
			this.mediators = undefined;
			this.commands = undefined;
			this.instance = undefined;
		}
	});

	var Mediators = soma.extend({
		constructor: function() {
			this.injector = null;
			this.dispatcher = null;
		},
		create: function(cl, target) {
			if (!cl || typeof cl !== "function") {
				throw new Error("Error creating a mediator, the first parameter must be a function.");
			}
			if (target === undefined || target === null) {
				throw new Error("Error creating a mediator, the second parameter cannot be undefined or null.");
			}
			var targets = [];
			var meds = [];
			if (target.length > 0) {
				targets = target;
			}
			else {
				targets.push(target);
			}
			for (var i= 0, l=targets.length; i<l; i++) {
				var injector = this.injector.createChild();
				injector.mapValue("target", targets[i]);
				//var mediator = injector.createInstance.apply(this.injector, params);
				var mediator = injector.createInstance(cl);
	//			soma.applyProperties(mediator, this.dispatcher, true, ['dispatch', 'dispatchEvent', 'addEventListener', 'removeEventListener', 'hasEventListener']);
				if (targets.length === 1) return mediator;
				meds.push(mediator);
			}
			return meds;
		},
		dispose: function() {
			this.injector = undefined;
			this.dispatcher = undefined;
		}
	});

	var Commands = soma.extend({
		constructor: function() {
			this.boundHandler = this.handler.bind(this);
			this.dispatcher = null;
			this.injector = null;
			this.list = {};
		},
		has: function(commandName) {
			return this.list[commandName] !== null && this.list[commandName] !== undefined;
		},
		get: function(commandName) {
			if (this.has(commandName)) {
				return this.list[commandName];
			}
			return undefined;
		},
		getAll: function() {
			var copy = {};
			for (var cmd in this.list) {
				copy[cmd] = this.list[cmd];
			}
			return copy;
		},
		add: function(commandName, command) {
			if (typeof commandName !== 'string') {
				throw new Error("Error adding a command, the first parameter must be a string.");
			}
			if (typeof command !== 'function') {
				throw new Error("Error adding a command with the name \"" + command + "\", the second parameter must be a function, and must contain an \"execute\" public method.");
			}
			if (this.has(commandName)) {
				throw new Error("Error adding a command with the name: \"" + commandName + "\", already registered.");
			}
			this.list[ commandName ] = command;
			this.addInterceptor(commandName);
		},
		remove: function(commandName) {
			if (!this.has(commandName)) {
				return;
			}
			this.list[commandName] = undefined;
			delete this.list[commandName];
			this.removeInterceptor(commandName);
		},
		addInterceptor: function(commandName) {
			this.dispatcher.addEventListener(commandName, this.boundHandler, -Number.MAX_VALUE);
		},
		removeInterceptor: function(commandName) {
			this.dispatcher.removeEventListener(commandName, this.boundHandler);
		},
		handler: function(event) {
			if (event.isDefaultPrevented && !event.isDefaultPrevented()) {
				this.executeCommand(event);
			}
		},
		executeCommand: function(event) {
			var commandName = event.type;
			if (this.has(commandName)) {
				var command = this.injector.createInstance(this.list[commandName]);
				if (!command.hasOwnProperty('execute') && command['execute'] === 'function') {
					throw new Error("Error in " + this + " Command \"" + command + "\" must contain an execute public method.");
				}
	//			soma.applyProperties(command, this.dispatcher, true, ['dispatch', 'dispatchEvent', 'addEventListener', 'removeEventListener', 'hasEventListener']);
				command.execute(event);
			}
		},
		dispose: function() {
			for (var cmd in this.list) {
				this.remove(cmd);
			}
			this.boundHandler = undefined;
			this.dispatcher = undefined;
			this.injector = undefined;
			this.list = undefined;
		}
	});

	// event extend utils

	soma.EventDispatcher.extend = function (obj) {
		return soma.inherit(soma.EventDispatcher, obj);
	};

	soma.Event.extend = function (obj) {
		return soma.inherit(soma.Event, obj);
	};

	infuse.Injector.extend = function(obj) {
		return soma.inherit(infuse.Injector, obj);
	};


	// register for AMD module
	if (typeof define === 'function' && define.amd) {
		define("soma", soma);
	}

	// export for node.js
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = soma;
		}
		exports = soma;
	}

})(this['soma'] = this['soma'] || {}, this['infuse']);