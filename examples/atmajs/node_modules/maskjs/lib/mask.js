


// source umd-head
/*!
 * MaskJS v0.51.37
 * Part of the Atma.js Project
 * http://atmajs.com/
 *
 * MIT license
 * http://opensource.org/licenses/MIT
 *
 * (c) 2012, 2015 Atma.js and other contributors
 */
(function (root, factory) {
    'use strict';
    
	var _env = (typeof window === 'undefined' || window.navigator == null)
		? 'node'
		: 'dom';
	var _global = (_env === 'dom')
		? window
		: global;
	var _isCommonJs = typeof exports !== 'undefined'
		&& (root == null || root === exports || root === _global);
	if (_isCommonJs) {
        root = exports;
    }
	var _exports = root || _global;
	var _document = _global.document;
    
    function construct(){
        var mask = factory(_global, _exports, _document);
		if (_isCommonJs) {
			module.exports = mask;
		}
		return mask;
    }

    if (typeof define === 'function' && define.amd) {
        return define(construct);
    }
    
	// Browser OR Node
    return construct();

}(this, function (global, exports, document) {
    'use strict';

// end:source umd-head

	// source /ref-utils/lib/utils.embed.js
	// source /src/refs.js
	var _Array_slice = Array.prototype.slice,
		_Array_splice = Array.prototype.splice,
		_Array_indexOf = Array.prototype.indexOf,
	
		_Object_create = null, // in obj.js
		_Object_hasOwnProp = Object.hasOwnProperty,
		_Object_getOwnProp = Object.getOwnPropertyDescriptor,
		_Object_defineProperty = Object.defineProperty;
	
	// end:source /src/refs.js
	
	// source /src/coll.js
	var coll_each,
		coll_remove,
		coll_map,
		coll_indexOf,
		coll_find;
	(function(){
		coll_each = function(coll, fn, ctx){
			if (ctx == null)
				ctx = coll;
			if (coll == null)
				return coll;
	
			var imax = coll.length,
				i = 0;
			for(; i< imax; i++){
				fn.call(ctx, coll[i], i);
			}
			return ctx;
		};
		coll_indexOf = function(coll, x){
			if (coll == null)
				return -1;
			var imax = coll.length,
				i = 0;
			for(; i < imax; i++){
				if (coll[i] === x)
					return i;
			}
			return -1;
		};
		coll_remove = function(coll, x){
			var i = coll_indexOf(coll, x);
			if (i === -1)
				return false;
			coll.splice(i, 1);
			return true;
		};
		coll_map = function(coll, fn, ctx){
			var arr = new Array(coll.length);
			coll_each(coll, function(x, i){
				arr[i] = fn.call(this, x, i);
			}, ctx);
			return arr;
		};
		coll_find = function(coll, fn, ctx){
			var imax = coll.length,
				i = 0;
			for(; i < imax; i++){
				if (fn.call(ctx || coll, coll[i], i))
					return true;
			}
			return false;
		};
	}());
	
	// end:source /src/coll.js
	
	// source /src/polyfill/arr.js
	if (Array.prototype.forEach === void 0) {
		Array.prototype.forEach = function(fn, ctx){
			coll_each(this, fn, ctx);
		};
	}
	if (Array.prototype.indexOf === void 0) {
		Array.prototype.indexOf = function(x){
			return coll_indexOf(this, x);
		};
	}
	
	// end:source /src/polyfill/arr.js
	// source /src/polyfill/str.js
	if (String.prototype.trim == null){
		String.prototype.trim = function(){
			var start = -1,
				end = this.length,
				code;
			if (end === 0)
				return this;
			while(++start < end){
				code = this.charCodeAt(start);
				if (code > 32)
					break;
			}
			while(--end !== 0){
				code = this.charCodeAt(end);
				if (code > 32)
					break;
			}
			return start !== 0 && end !== length - 1
				? this.substring(start, end + 1)
				: this;
		};
	}
	
	// end:source /src/polyfill/str.js
	// source /src/polyfill/fn.js
	
	if (Function.prototype.bind == null) {
		var _Array_slice;
		Function.prototype.bind = function(){
			if (arguments.length < 2 && typeof arguments[0] === "undefined")
				return this;
			var fn = this,
				args = _Array_slice.call(arguments),
				ctx = args.shift();
			return function() {
				return fn.apply(ctx, args.concat(_Array_slice.call(arguments)));
			};
		};
	}
	
	// end:source /src/polyfill/fn.js
	
	// source /src/is.js
	var is_Function,
		is_Array,
		is_ArrayLike,
		is_String,
		is_Object,
		is_notEmptyString,
		is_rawObject,
		is_Date,
		is_NODE,
		is_DOM;
	
	(function() {
		is_Function = function(x) {
			return typeof x === 'function';
		};
		is_Object = function(x) {
			return x != null && typeof x === 'object';
		};
		is_Array = is_ArrayLike = function(arr) {
			return arr != null
				&& typeof arr === 'object'
				&& typeof arr.length === 'number'
				&& typeof arr.slice === 'function'
				;
		};
		is_String = function(x) {
			return typeof x === 'string';
		};
		is_notEmptyString = function(x) {
			return typeof x === 'string' && x !== '';
		};
		is_rawObject = function(obj) {
			if (obj == null || typeof obj !== 'object')
				return false;
	
			return obj.constructor === Object;
		};
		is_Date = function(x) {
			if (x == null || typeof x !== 'object') {
				return false;
			}
			if (x.getFullYear != null && isNaN(x) === false) {
				return true;
			}
			return false;
		};
		is_DOM = typeof window !== 'undefined' && window.navigator != null;
		is_NODE = !is_DOM;
	
	}());
	
	// end:source /src/is.js
	// source /src/obj.js
	var obj_getProperty,
		obj_setProperty,
		obj_hasProperty,
		obj_extend,
		obj_extendDefaults,
		obj_extendMany,
		obj_extendProperties,
		obj_extendPropertiesDefaults,
		obj_create,
		obj_toFastProps,
		obj_defineProperty;
	(function(){
		obj_getProperty = function(obj_, path){
			if ('.' === path) // obsolete
				return obj_;
	
			var obj = obj_,
				chain = path.split('.'),
				imax = chain.length,
				i = -1;
			while ( obj != null && ++i < imax ) {
				obj = obj[chain[i]];
			}
			return obj;
		};
		obj_setProperty = function(obj_, path, val) {
			var obj = obj_,
				chain = path.split('.'),
				imax = chain.length - 1,
				i = -1,
				key;
			while ( ++i < imax ) {
				key = chain[i];
				if (obj[key] == null)
					obj[key] = {};
	
				obj = obj[key];
			}
			obj[chain[i]] = val;
		};
		obj_hasProperty = function(obj, path) {
			var x = obj_getProperty(obj, path);
			return x !== void 0;
		};
		obj_defineProperty = function(obj, path, dscr) {
			var x = obj,
				chain = path.split('.'),
				imax = chain.length - 1,
				i = -1, key;
			while (++i < imax) {
				key = chain[i];
				if (x[key] == null)
					x[key] = {};
				x = x[key];
			}
			key = chain[imax];
			if (_Object_defineProperty) {
				if (dscr.writable	 === void 0) dscr.writable	 = true;
				if (dscr.configurable === void 0) dscr.configurable = true;
				if (dscr.enumerable   === void 0) dscr.enumerable   = true;
				_Object_defineProperty(x, key, dscr);
				return;
			}
			x[key] = dscr.value === void 0
				? dscr.value
				: (dscr.get && dscr.get());
		};
		obj_extend = function(a, b){
			if (b == null)
				return a || {};
	
			if (a == null)
				return obj_create(b);
	
			for(var key in b){
				a[key] = b[key];
			}
			return a;
		};
		obj_extendDefaults = function(a, b){
			if (b == null)
				return a || {};
			if (a == null)
				return obj_create(b);
	
			for(var key in b) {
				if (a[key] == null)
					a[key] = b[key];
			}
			return a;
		}
		var extendPropertiesFactory = function(overwriteProps){
			if (_Object_getOwnProp == null)
				return overwriteProps ? obj_extend : obj_extendDefaults;
	
			return function(a, b){
				if (b == null)
					return a || {};
	
				if (a == null)
					return obj_create(b);
	
				var key, descr, ownDescr;
				for(key in b){
					descr = _Object_getOwnProp(b, key);
					if (descr == null)
						continue;
					if (overwriteProps !== true) {
						ownDescr = _Object_getOwnProp(a, key);
						if (ownDescr != null) {
							continue;
						}
					}
					if (descr.hasOwnProperty('value')) {
						a[key] = descr.value;
						continue;
					}
					_Object_defineProperty(a, key, descr);
				}
				return a;
			};
		};
	
		obj_extendProperties		 = extendPropertiesFactory(true);
		obj_extendPropertiesDefaults = extendPropertiesFactory(false );
	
		obj_extendMany = function(a){
			var imax = arguments.length,
				i = 1;
			for(; i<imax; i++) {
				a = obj_extend(a, arguments[i]);
			}
			return a;
		};
		obj_toFastProps = function(obj){
			/*jshint -W027*/
			function F() {}
			F.prototype = obj;
			new F();
			return;
			eval(obj);
		};
		_Object_create = obj_create = Object.create || function(x) {
			var Ctor = function(){};
			Ctor.prototype = x;
			return new Ctor;
		};
	}());
	
	// end:source /src/obj.js
	// source /src/arr.js
	var arr_remove,
		arr_each,
		arr_indexOf,
		arr_contains,
		arr_pushMany;
	(function(){
		arr_remove = function(array, x){
			var i = array.indexOf(x);
			if (i === -1)
				return false;
			array.splice(i, 1);
			return true;
		};
		arr_each = function(arr, fn, ctx){
			arr.forEach(fn, ctx);
		};
		arr_indexOf = function(arr, x){
			return arr.indexOf(x);
		};
		arr_contains = function(arr, x){
			return arr.indexOf(x) !== -1;
		};
		arr_pushMany = function(arr, arrSource){
			if (arrSource == null || arr == null || arr === arrSource)
				return;
	
			var il = arr.length,
				jl = arrSource.length,
				j = -1
				;
			while( ++j < jl ){
				arr[il + j] = arrSource[j];
			}
		};
	}());
	
	// end:source /src/arr.js
	// source /src/fn.js
	var fn_proxy,
		fn_apply,
		fn_doNothing,
		fn_createByPattern;
	(function(){
		fn_proxy = function(fn, ctx) {
			return function(){
				return fn_apply(fn, ctx, arguments);
			};
		};
	
		fn_apply = function(fn, ctx, args){
			var l = args.length;
			if (0 === l)
				return fn.call(ctx);
			if (1 === l)
				return fn.call(ctx, args[0]);
			if (2 === l)
				return fn.call(ctx, args[0], args[1]);
			if (3 === l)
				return fn.call(ctx, args[0], args[1], args[2]);
			if (4 === l)
				return fn.call(ctx, args[0], args[1], args[2], args[3]);
	
			return fn.apply(ctx, args);
		};
	
		fn_doNothing = function(){
			return false;
		};
	
		fn_createByPattern = function(definitions, ctx){
			var imax = definitions.length;
			return function(){
				var l = arguments.length,
					i = -1,
					def;
	
				outer: while(++i < imax){
					def = definitions[i];
					if (def.pattern.length !== l) {
						continue;
					}
					var j = -1;
					while(++j < l){
						var fn  = def.pattern[j];
						var val = arguments[j];
						if (fn(val) === false) {
							continue outer;
						}
					}
					return def.handler.apply(ctx, arguments);
				}
	
				console.error('InvalidArgumentException for a function', definitions, arguments);
				return null;
			};
		};
	
	}());
	
	// end:source /src/fn.js
	// source /src/str.js
	var str_format;
	(function(){
		str_format = function(str_){
			var str = str_,
				imax = arguments.length,
				i = 0, x;
			while ( ++i < imax ){
				x = arguments[i];
				if (is_Object(x) && x.toJSON) {
					x = x.toJSON();
				}
				str_ = str_.replace(rgxNum(i - 1), String(x));
			}
	
			return str_;
		};
	
		var rgxNum;
		(function(){
			rgxNum = function(num){
				return cache_[num] || (cache_[num] = new RegExp('\\{' + num + '\\}', 'g'));
			};
			var cache_ = {};
		}());
	}());
	
	// end:source /src/str.js
	// source /src/class.js
	/**
	 * create([...Base], Proto)
	 * Base: Function | Object
	 * Proto: Object {
	 *    constructor: ?Function
	 *    ...
	 */
	var class_create,
	
		// with property accessor functions support
		class_createEx;
	(function(){
	
		class_create   = createClassFactory(obj_extendDefaults);
		class_createEx = createClassFactory(obj_extendPropertiesDefaults);
	
		function createClassFactory(extendDefaultsFn) {
			return function(){
				var args = _Array_slice.call(arguments),
					Proto = args.pop();
				if (Proto == null)
					Proto = {};
	
				var Ctor = Proto.hasOwnProperty('constructor')
					? Proto.constructor
					: function ClassCtor () {};
	
				var i = args.length,
					BaseCtor, x;
				while ( --i > -1 ) {
					x = args[i];
					if (typeof x === 'function') {
						BaseCtor = wrapFn(x, BaseCtor);
						x = x.prototype;
					}
					extendDefaultsFn(Proto, x);
				}
				return createClass(wrapFn(BaseCtor, Ctor), Proto);
			};
		}
	
		function createClass(Ctor, Proto) {
			Proto.constructor = Ctor;
			Ctor.prototype = Proto;
			return Ctor;
		}
		function wrapFn(fnA, fnB) {
			if (fnA == null) {
				return fnB;
			}
			if (fnB == null) {
				return fnA;
			}
			return function(){
				var args = _Array_slice.call(arguments);
				var x = fnA.apply(this, args);
				if (x !== void 0)
					return x;
	
				return fnB.apply(this, args);
			};
		}
	}());
	
	// end:source /src/class.js
	// source /src/error.js
	var error_createClass,
		error_formatSource,
		error_formatCursor,
		error_cursor;
	
	(function(){
		error_createClass = function(name, Proto, stackSliceFrom){
			var Ctor = _createCtor(Proto, stackSliceFrom);
			Ctor.prototype = new Error;
	
			Proto.constructor = Error;
			Proto.name = name;
			obj_extend(Ctor.prototype, Proto);
			return Ctor;
		};
	
		error_formatSource = function(source, index, filename) {
			var cursor  = error_cursor(source, index),
				lines   = cursor[0],
				lineNum = cursor[1],
				rowNum  = cursor[2],
				str = '';
			if (filename != null) {
				str += str_format(' at {0}({1}:{2})\n', filename, lineNum, rowNum);
			}
			return str + error_formatCursor(lines, lineNum, rowNum);
		};
	
		/**
		 * @returns [ lines, lineNum, rowNum ]
		 */
		error_cursor = function(str, index){
			var lines = str.substring(0, index).split('\n'),
				line = lines.length,
				row = index + 1 - lines.slice(0, line - 1).join('\n').length;
			if (line > 1) {
				// remote trailing newline
				row -= 1;
			}
			return [str.split('\n'), line, row];
		};
	
		(function(){
			error_formatCursor = function(lines, lineNum, rowNum) {
	
				var BEFORE = 3,
					AFTER  = 2,
					i = lineNum - BEFORE,
					imax   = i + BEFORE + AFTER,
					str  = '';
	
				if (i < 0) i = 0;
				if (imax > lines.length) imax = lines.length;
	
				var lineNumberLength = String(imax).length,
					lineNumber;
	
				for(; i < imax; i++) {
					if (str)  str += '\n';
	
					lineNumber = ensureLength(i + 1, lineNumberLength);
					str += lineNumber + '|' + lines[i];
	
					if (i + 1 === lineNum) {
						str += '\n' + repeat(' ', lineNumberLength + 1);
						str += lines[i].substring(0, rowNum - 1).replace(/[^\s]/g, ' ');
						str += '^';
					}
				}
				return str;
			};
	
			function ensureLength(num, count) {
				var str = String(num);
				while(str.length < count) {
					str += ' ';
				}
				return str;
			}
			function repeat(char_, count) {
				var str = '';
				while(--count > -1) {
					str += char_;
				}
				return str;
			}
		}());
	
		function _createCtor(Proto, stackFrom){
			var Ctor = Proto.hasOwnProperty('constructor')
				? Proto.constructor
				: null;
	
			return function(){
				obj_defineProperty(this, 'stack', {
					value: _prepairStack(stackFrom || 3)
				});
				obj_defineProperty(this, 'message', {
					value: str_format.apply(this, arguments)
				});
				if (Ctor != null) {
					Ctor.apply(this, arguments);
				}
			};
		}
	
		function _prepairStack(sliceFrom) {
			var stack = new Error().stack;
			return stack == null ? null : stack
				.split('\n')
				.slice(sliceFrom)
				.join('\n');
		}
	
	}());
	
	// end:source /src/error.js
	
	// source /src/class/Dfr.js
	var class_Dfr;
	(function(){
		class_Dfr = function(){};
		class_Dfr.prototype = {
			_isAsync: true,
			_done: null,
			_fail: null,
			_always: null,
			_resolved: null,
			_rejected: null,
	
			defer: function(){
				this._rejected = null;
				this._resolved = null;
				return this;
			},
			isResolved: function(){
				return this._resolved != null;
			},
			isRejected: function(){
				return this._rejected != null;
			},
			isBusy: function(){
				return this._resolved == null && this._rejected == null;
			},
			resolve: function() {
				var done = this._done,
					always = this._always
					;
	
				this._resolved = arguments;
	
				dfr_clearListeners(this);
				arr_callOnce(done, this, arguments);
				arr_callOnce(always, this, [ this ]);
	
				return this;
			},
			reject: function() {
				var fail = this._fail,
					always = this._always
					;
	
				this._rejected = arguments;
	
				dfr_clearListeners(this);
				arr_callOnce(fail, this, arguments);
				arr_callOnce(always, this, [ this ]);
				return this;
			},
			then: function(filterSuccess, filterError){
				return this.pipe(filterSuccess, filterError);
			},
			done: function(callback) {
				if (this._rejected != null)
					return this;
				return dfr_bind(
					this,
					this._resolved,
					this._done || (this._done = []),
					callback
				);
			},
			fail: function(callback) {
				if (this._resolved != null)
					return this;
				return dfr_bind(
					this,
					this._rejected,
					this._fail || (this._fail = []),
					callback
				);
			},
			always: function(callback) {
				return dfr_bind(
					this,
					this._rejected || this._resolved,
					this._always || (this._always = []),
					callback
				);
			},
			pipe: function(mix /* ..methods */){
				var dfr;
				if (typeof mix === 'function') {
					dfr = new class_Dfr;
					var done_ = mix,
						fail_ = arguments.length > 1
							? arguments[1]
							: null;
	
					this
						.done(delegate(dfr, 'resolve', done_))
						.fail(delegate(dfr, 'reject',  fail_))
						;
					return dfr;
				}
	
				dfr = mix;
				var imax = arguments.length,
					done = imax === 1,
					fail = imax === 1,
					i = 0, x;
				while( ++i < imax ){
					x = arguments[i];
					switch(x){
						case 'done':
							done = true;
							break;
						case 'fail':
							fail = true;
							break;
						default:
							console.error('Unsupported pipe channel', arguments[i])
							break;
					}
				}
				done && this.done(delegate(dfr, 'resolve'));
				fail && this.fail(delegate(dfr, 'reject' ));
	
				function pipe(dfr, method) {
					return function(){
						dfr[method].apply(dfr, arguments);
					};
				}
				function delegate(dfr, name, fn) {
					return function(){
						if (fn != null) {
							var override = fn.apply(this, arguments);
							if (override != null) {
								if (isDeferred(override) === true) {
									override.pipe(dfr);
									return;
								}
	
								dfr[name](override)
								return;
							}
						}
						dfr[name].apply(dfr, arguments);
					};
				}
	
				return this;
			},
			pipeCallback: function(){
				var self = this;
				return function(error){
					if (error != null) {
						self.reject(error);
						return;
					}
					var args = _Array_slice.call(arguments, 1);
					fn_apply(self.resolve, self, args);
				};
			},
			resolveDelegate: function(){
				return fn_proxy(this.resolve, this);
			},
			
			rejectDelegate: function(){
				return fn_proxy(this.reject, this);
			},
			
		};
	
		class_Dfr.run = function(fn, ctx){
			var dfr = new class_Dfr();
			if (ctx == null)
				ctx = dfr;
	
			fn.call(
				ctx
				, fn_proxy(dfr.resolve, ctx)
				, fn_proxy(dfr.reject, dfr)
				, dfr
			);
			return dfr;
		};
	
		// PRIVATE
	
		function dfr_bind(dfr, arguments_, listeners, callback){
			if (callback == null)
				return dfr;
	
			if ( arguments_ != null)
				fn_apply(callback, dfr, arguments_);
			else
				listeners.push(callback);
	
			return dfr;
		}
	
		function dfr_clearListeners(dfr) {
			dfr._done = null;
			dfr._fail = null;
			dfr._always = null;
		}
	
		function arr_callOnce(arr, ctx, args) {
			if (arr == null)
				return;
	
			var imax = arr.length,
				i = -1,
				fn;
			while ( ++i < imax ) {
				fn = arr[i];
	
				if (fn)
					fn_apply(fn, ctx, args);
			}
			arr.length = 0;
		}
		function isDeferred(x){
			if (x == null || typeof x !== 'object')
				return false;
	
			if (x instanceof class_Dfr)
				return true;
	
			return typeof x.done === 'function'
				&& typeof x.fail === 'function'
				;
		}
	}());
	
	// end:source /src/class/Dfr.js
	// source /src/class/EventEmitter.js
	var class_EventEmitter;
	(function(){
	
		class_EventEmitter = function() {
			this._listeners = {};
		};
		class_EventEmitter.prototype = {
			on: function(event, fn) {
				if (fn != null){
					(this._listeners[event] || (this._listeners[event] = [])).push(fn);
				}
				return this;
			},
			once: function(event, fn){
				if (fn != null) {
					fn._once = true;
					(this._listeners[event] || (this._listeners[event] = [])).push(fn);
				}
				return this;
			},
	
			pipe: function(event){
				var that = this,
					args;
				return function(){
					args = _Array_slice.call(arguments);
					args.unshift(event);
					fn_apply(that.trigger, that, args);
				};
			},
	
			emit: event_trigger,
			trigger: event_trigger,
	
			off: function(event, fn) {
				var listeners = this._listeners[event];
				if (listeners == null)
					return this;
	
				if (arguments.length === 1) {
					listeners.length = 0;
					return this;
				}
	
				var imax = listeners.length,
					i = -1;
				while (++i < imax) {
	
					if (listeners[i] === fn) {
						listeners.splice(i, 1);
						i--;
						imax--;
					}
	
				}
				return this;
			}
		};
	
		function event_trigger() {
			var args = _Array_slice.call(arguments),
				event = args.shift(),
				fns = this._listeners[event],
				fn, imax, i = 0;
	
			if (fns == null)
				return this;
	
			for (imax = fns.length; i < imax; i++) {
				fn = fns[i];
				fn_apply(fn, this, args);
	
				if (fn._once === true){
					fns.splice(i, 1);
					i--;
					imax--;
				}
			}
			return this;
		}
	}());
	
	// end:source /src/class/EventEmitter.js
	// source /src/class/Uri.es6
	"use strict";

var class_Uri;
(function () {

	class_Uri = class_create({
		protocol: null,
		value: null,
		path: null,
		file: null,
		extension: null,

		constructor: function constructor(uri) {
			if (uri == null) {
				return this;
			}if (util_isUri(uri)) {
				return uri.combine("");
			}uri = normalize_uri(uri);

			this.value = uri;

			parse_protocol(this);
			parse_host(this);

			parse_search(this);
			parse_file(this);

			// normilize path - "/some/path"
			this.path = normalize_pathsSlashes(this.value);

			if (/^[\w]+:\//.test(this.path)) {
				this.path = "/" + this.path;
			}
			return this;
		},
		cdUp: function cdUp() {
			var path = this.path;
			if (path == null || path === "" || path === "/") {
				return this;
			}

			// win32 - is base drive
			if (/^\/?[a-zA-Z]+:\/?$/.test(path)) {
				return this;
			}

			this.path = path.replace(/\/?[^\/]+\/?$/i, "");
			return this;
		},
		/**
	   * '/path' - relative to host
	   * '../path', 'path','./path' - relative to current path
	   */
		combine: function combine(path) {

			if (util_isUri(path)) {
				path = path.toString();
			}

			if (!path) {
				return util_clone(this);
			}

			if (rgx_win32Drive.test(path)) {
				return new class_Uri(path);
			}

			var uri = util_clone(this);

			uri.value = path;

			parse_search(uri);
			parse_file(uri);

			if (!uri.value) {
				return uri;
			}

			path = uri.value.replace(/^\.\//i, "");

			if (path[0] === "/") {
				uri.path = path;
				return uri;
			}

			while (/^(\.\.\/?)/ig.test(path)) {
				uri.cdUp();
				path = path.substring(3);
			}

			uri.path = normalize_pathsSlashes(util_combinePathes(uri.path, path));

			return uri;
		},
		toString: function toString() {
			var protocol = this.protocol ? this.protocol + "://" : "";
			var path = util_combinePathes(this.host, this.path, this.file) + (this.search || "");
			var str = protocol + path;

			if (!(this.file || this.search)) {
				str += "/";
			}
			return str;
		},
		toPathAndQuery: function toPathAndQuery() {
			return util_combinePathes(this.path, this.file) + (this.search || "");
		},
		/**
	   * @return Current Uri Path{String} that is relative to @arg1 Uri
	   */
		toRelativeString: function toRelativeString(uri) {
			if (typeof uri === "string") uri = new class_Uri(uri);

			if (this.path.indexOf(uri.path) === 0) {
				// host folder
				var p = this.path ? this.path.replace(uri.path, "") : "";
				if (p[0] === "/") p = p.substring(1);

				return util_combinePathes(p, this.file) + (this.search || "");
			}

			// sub folder
			var current = this.path.split("/"),
			    relative = uri.path.split("/"),
			    commonpath = "",
			    i = 0,
			    length = Math.min(current.length, relative.length);

			for (; i < length; i++) {
				if (current[i] === relative[i]) continue;

				break;
			}

			if (i > 0) commonpath = current.splice(0, i).join("/");

			if (commonpath) {
				var sub = "",
				    path = uri.path,
				    forward;
				while (path) {
					if (this.path.indexOf(path) === 0) {
						forward = this.path.replace(path, "");
						break;
					}
					path = path.replace(/\/?[^\/]+\/?$/i, "");
					sub += "../";
				}
				return util_combinePathes(sub, forward, this.file);
			}

			return this.toString();
		},

		toLocalFile: function toLocalFile() {
			var path = util_combinePathes(this.host, this.path, this.file);

			return util_win32Path(path);
		},
		toLocalDir: function toLocalDir() {
			var path = util_combinePathes(this.host, this.path, "/");

			return util_win32Path(path);
		},
		toDir: function toDir() {
			var str = this.protocol ? this.protocol + "://" : "";

			return str + util_combinePathes(this.host, this.path, "/");
		},
		isRelative: function isRelative() {
			return !(this.protocol || this.host);
		},
		getName: function getName() {
			return this.file.replace("." + this.extension, "");
		}
	});

	var rgx_protocol = /^([a-zA-Z]+):\/\//,
	    rgx_extension = /\.([\w\d]+)$/i,
	    rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/,
	    rgx_fileWithExt = /([^\/]+(\.[\w\d]+)?)$/i;

	function util_isUri(object) {
		return object && typeof object === "object" && typeof object.combine === "function";
	}

	function util_combinePathes() {
		var args = arguments,
		    str = "";
		for (var i = 0, x, imax = arguments.length; i < imax; i++) {
			x = arguments[i];
			if (!x) continue;

			if (!str) {
				str = x;
				continue;
			}

			if (str[str.length - 1] !== "/") str += "/";

			str += x[0] === "/" ? x.substring(1) : x;
		}
		return str;
	}

	function normalize_pathsSlashes(str) {

		if (str[str.length - 1] === "/") {
			return str.substring(0, str.length - 1);
		}
		return str;
	}

	function util_clone(source) {
		var uri = new class_Uri(),
		    key;
		for (key in source) {
			if (typeof source[key] === "string") {
				uri[key] = source[key];
			}
		}
		return uri;
	}

	function normalize_uri(str) {
		return str.replace(/\\/g, "/").replace(/^\.\//, "")

		// win32 drive path
		.replace(/^(\w+):\/([^\/])/, "/$1:/$2");
	}

	function util_win32Path(path) {
		if (rgx_win32Drive.test(path) && path[0] === "/") {
			return path.substring(1);
		}
		return path;
	}

	function parse_protocol(obj) {
		var match = rgx_protocol.exec(obj.value);

		if (match == null && obj.value[0] === "/") {
			obj.protocol = "file";
		}

		if (match == null) {
			return;
		}obj.protocol = match[1];
		obj.value = obj.value.substring(match[0].length);
	}

	function parse_host(obj) {
		if (obj.protocol == null) {
			return;
		}if (obj.protocol === "file") {
			var match = rgx_win32Drive.exec(obj.value);
			if (match) {
				obj.host = match[1];
				obj.value = obj.value.substring(obj.host.length);
			}
			return;
		}

		var pathStart = obj.value.indexOf("/", 2);

		obj.host = ~pathStart ? obj.value.substring(0, pathStart) : obj.value;

		obj.value = obj.value.replace(obj.host, "");
	}

	function parse_search(obj) {
		var question = obj.value.indexOf("?");
		if (question === -1) {
			return;
		}obj.search = obj.value.substring(question);
		obj.value = obj.value.substring(0, question);
	}

	function parse_file(obj) {
		var match = rgx_fileWithExt.exec(obj.value),
		    file = match == null ? null : match[1];

		if (file == null) {
			return;
		}
		obj.file = file;
		obj.value = obj.value.substring(0, obj.value.length - file.length);
		obj.value = normalize_pathsSlashes(obj.value);

		match = rgx_extension.exec(file);
		obj.extension = match == null ? null : match[1];
	}

	class_Uri.combinePathes = util_combinePathes;
	class_Uri.combine = util_combinePathes;
})();
/*args*/
//# sourceMappingURL=Uri.es6.map
	// end:source /src/class/Uri.es6
	// end:source /ref-utils/lib/utils.embed.js

	// source scope-vars
	var __rgxEscapedChar = {
	    "'": /\\'/g,
	    '"': /\\"/g,
	    '{': /\\\{/g,
	    '>': /\\>/g,
	    ';': /\\>/g
	};
	
	/**
	 * Configuration Options
	 * @type {object}
	 * @typedef Configuration
	 */
	var __cfg = {
	    /**
	     * Relevant for NodeJS only. Disable/Enable compo caching.
	     * @default true
	     */
	    allowCache: true,
	    /**
	     * Style and Script preprocessors
	     * @type {object}
	     * @memberOf Configuration
	     */
	    preprocessor: {
	        /**
	         * Transform style before using in `style` tag
	         * @type {function}
	         * @param {string} style
	         * @returns {string}
	         * @memberOf Configuration
	         */
	        style : null,
	        /**
	         * Transform script before using in `function,script,event,slot` tags
	         * @type {function}
	         * @param {string} source
	         * @returns {string}
	         * @memberOf Configuration
	         */
	        script: null
	    },
	    /**
	     * Base path for modules
	     * @default null
	     * @memberOf Configuration
	     */
	    base: null,    
	    modules: 'default',    
	    /**
	     * Define custom function for getting files content by path
	     * @param {string} path
	     * @returns {Promise}
	     * @memberOf Configuration
	     */
	    getFile: null,
	    /**
	     * Define custom function for getting script
	     * @param {string} path
	     * @returns {Promise} Fulfill with exports
	     * @memberOf Configuration
	     */
	    getScript: null,
	    /**
	     * Define custom function to build/combine styles
	     * @param {string} path
	     * @param {object} options
	     * @returns {Promise} Fulfill with {string} content
	     * @memberOf Configuration
	     */    
	    buildStyle: null,
	    /**
	     * Define custom function to build/combine scripts
	     * @param {string} path
	     * @param {object} options
	     * @returns {Promise} Fulfill with {string} content
	     * @memberOf Configuration
	     */
	    buildScript: null,
	};
	// end:source scope-vars
	
    // source util/
    // source ./util.js
    
    
    // end:source ./util.js
    // source ./attr.js
    var attr_extend,
    	attr_first;
    
    (function(){
    	attr_extend = function (a, b) {
    		if (a == null) {
    			return b == null
    				? {}
    				: obj_create(b);
    		}
    		
    		if (b == null) 
    			return a;
    		
    		var key;
    		for(key in b) {
    			if ('class' === key && typeof a[key] === 'string') {
    				a[key] += ' ' + b[key];
    				continue;
    			}
    			a[key] = b[key];
    		}
    		return a;
    	};
    	attr_first = function(attr){
    		for (var key in attr) return key;
    		return null;
    	};
    }());
    
    // end:source ./attr.js
    // source ./array.js
    var arr_pushMany;
    
    (function(){
    	arr_pushMany = function(arr, arrSource){
    		if (arrSource == null || arr == null) 
    			return;
    		
    		var il = arr.length,
    			jl = arrSource.length,
    			j = -1
    			;
    		while( ++j < jl ){
    			arr[il + j] = arrSource[j];
    		}
    	};
    }());
    // end:source ./array.js
    // source ./object.js
    var obj_getPropertyEx,
        obj_toDictionary;
    (function(){
        obj_getPropertyEx = function(path, model, ctx, ctr){
            if (path === '.') 
                return model;
        
            var props = path.split('.'),
                imax = props.length,
                key = props[0]
                ;
            
            if ('$c' === key) {
                reporter_deprecated('accessor.compo', 'Use `$` instead of `$c`');
                key = '$';
            }
            if ('$u' === key) {
                reporter_deprecated('accessor.util', 'Use `_` instead of `$u`');
                key = '_';
            }
            if ('$' === key) {
                return getProperty_(ctr, props, 1, imax);
            }
            if ('$a' === key) {
                return getProperty_(ctr && ctr.attr, props, 1, imax);
            }
            if ('_' === key) {
                return getProperty_(customUtil_$utils, props, 1, imax);
            }
            if ('$ctx' === key) {
                return getProperty_(ctx, props, 1, imax);
            }
            if ('$scope' === key) {
                return getFromScope_(ctr, props, 1, imax);
            }
            
            var x = getProperty_(model, props, 0, imax);
            if (x != null) {
                return x;
            }
            
            return getFromScope_(ctr, props, 0, imax);
        };
        
        obj_toDictionary = function(obj){
            var array = [],
                i = 0,
                key
                ;
            for(key in obj){
                array[i++] = {
                    key: key,
                    value: obj[key]
                };
            }
            return array;
        };
        
        // = private
        
        function getProperty_(obj, props, startIndex, imax) {
            var i = startIndex,
                val = obj;
            while(i < imax && val != null){
                val = val[props[i]];
                i++;
            }
            return val;
        }
        
        function getFromScope_(ctr, props, startIndex, imax) {
            while (ctr != null){
                var scope = ctr.scope;
                if (scope != null) {
                    var x = getProperty_(scope, props, startIndex, imax);
                    if (x != null) 
                        return x;
                }
                ctr = ctr.parent;
            }
            return null;
        }
    }());
    
    // end:source ./object.js
    // source ./listeners.js
    var listeners_on,
    	listeners_off,
    	listeners_emit;
    (function(){
    	/**
    	 * Bind listeners to some system events:
    	 * - `error` Any parser or render error
    	 * - `compoCreated` Each time new component is created
    	 * - `config` Each time configuration is changed via `config` fn
    	 * @param {string} eveny
    	 * @param {function} cb
    	 * @memberOf mask
    	 * @method on
    	 */
    	listeners_on = function(event, fn) {
    		(bin[event] || (bin[event] = [])).push(fn);
    	};
    	/**
    	 * Unbind listener
    	 * - `error` Any parser or render error
    	 * - `compoCreated` Each time new component is created
    	 * @param {string} eveny
    	 * @param {function} [cb]
    	 * @memberOf mask
    	 * @method on
    	 */
    	listeners_off = function(event, fn){
    		if (fn == null) {
    			bin[event] = [];
    			return;
    		}
    		arr_remove(bin[event], fn);
    	};
    	listeners_emit = function(event){
    		var fns = bin[event];
    		if (fns == null) {
    			return false;
    		}
    		var imax = fns.length,
    			i = -1,
    			args = _Array_slice.call(arguments, 1)
    			;
    		if (imax === 0) {
    			return false;
    		}
    		while ( ++i < imax) {
    			fns[i].apply(null, args);
    		}
    		return true;
    	};
    	
    	// === private
    	
    	var bin = {
    		compoCreated: null,
    		error: null
    	};
    }());
    // end:source ./listeners.js
    // source ./reporters.js
    var throw_,
    	parser_error,
    	parser_warn,
    	error_,
    	error_withSource,
    	error_withNode,
    	warn_,
    	warn_withSource,
    	warn_withNode,
    	
    	log,
    	log_warn,
    	log_error,
    	reporter_createErrorNode,
    	reporter_deprecated;
    	
    (function(){
    	(function () {
    		
    		if (typeof console === 'undefined') {
    			log = log_warn = log_error = function(){};
    			return;
    		}		
    		var bind  = Function.prototype.bind;
    		log       = bind.call(console.warn , console);		
    		log_warn  = bind.call(console.warn , console, 'MaskJS [Warn] :');
    		log_error = bind.call(console.error, console, 'MaskJS [Error] :');
    	}());
    	
    	var STACK_SLICE = 4;
    	var MaskError = error_createClass('MaskError', {}, STACK_SLICE);
    	var MaskWarn  = error_createClass('MaskWarn',  {}, STACK_SLICE);
    	
    		
    	throw_ = function(error){
    		log_error(error);
    		listeners_emit('error', error);
    	};
    	
    	error_withSource = delegate_withSource(MaskError, 'error');
    	error_withNode   = delegate_withNode  (MaskError, 'error');
    	
    	warn_withSource = delegate_withSource(MaskWarn, 'warn');
    	warn_withNode   = delegate_withNode  (MaskWarn, 'warn');
    	
    	parser_error = delegate_parserReporter(MaskError, 'error');
    	parser_warn = delegate_parserReporter(MaskWarn, 'warn');
    	
    	reporter_createErrorNode = function(message){
    		return parser_parse(
    			'div style="background:red;color:white;">tt>"""' + message + '"""'
    		);
    	};
    	
    	(function(){
    		reporter_deprecated = function(id, message){
    			if (_notified[id] !== void 0) {
    				return;
    			}
    			_notified[id] = 1;
    			log_warn('[deprecated]', message);
    		};
    		var _notified = {};
    	}());
    	
    	function delegate_parserReporter(Ctor, type) {
    		return function(str, source, index, token, state, file) {
    			var error = new Ctor(str);
    			var tokenMsg = formatToken(token);
    			if (tokenMsg) {
    				error.message += tokenMsg;
    			}
    			var stateMsg = formatState(state);
    			if (stateMsg) {
    				error.message += stateMsg;
    			}
    			var cursorMsg = error_formatSource(source, index, file);
    			if (cursorMsg) {
    				error.message += '\n' + cursorMsg;
    			}
    			report(error, 'error');
    		};
    	}
    	function delegate_withSource(Ctor, type){
    		return function(str, source, index, file){
    			var error = new Ctor(str);
    			error.message = '\n' + error_formatSource(source, index, file);
    			report(error, type);
    		};
    	}
    	function delegate_withNode(Ctor, type){
    		return function(str, node){
    			var error = new Ctor(str);
    			error.message = error.message
    				+ '\n'
    				+ _getNodeStack(node);
    			
    			report(error, type);
    		};
    	}
    	
    	function _getNodeStack(node){
    		var stack = [ node ];
    		
    		var parent = node.parent;
    		while (parent != null) {
    			stack.unshift(parent);
    			parent = parent.parent;
    		}
    		var str = '';
    		var root = stack[0];
    		if (root !== node && is_String(root.source) && node.sourceIndex > -1) {
    			str += error_formatSource(root.source, node.sourceIndex, root.filename) + '\n';
    		}
    		
    		str += '  at ' + stack
    			.map(function(x){
    				return x.tagName;
    			})
    			.join(' > ');
    			
    		return str;
    	}
    	
    	function report(error, type) {
    		if (listeners_emit(type, error)) {
    			return;
    		}
    		var fn = type === 'error' ? log_error : log_warn;
    		fn(error.message);
    		fn('\n' + error.stack);
    	}
    	
    	function formatToken(token){
    		if (token == null) 
    			return '';
    		
    		if (typeof token === 'number') 
    			token = String.fromCharCode(token);
    			
    		return ' Invalid token: `'+ token + '`';
    	}
    	
    	function formatState(state){
    		var states = {
    			'2': 'tag',
    			'3': 'tag',
    			'5': 'attribute key',
    			'6': 'attribute value',
    			'8': 'literal',
    			'var': 'VarStatement',
    			'expr': 'Expression'
    		};
    		if (state == null || states[state] == null) 
    			return '';
    		
    		return ' in `' + states[state] + '`';
    	}
    	
    }());
    // end:source ./reporters.js
    // source ./path.js
    var path_getDir,
    	path_getFile,
    	path_getExtension,
    	path_resolveCurrent,
    	path_normalize,
    	path_resolveUrl,
    	path_combine,
    	path_isRelative,
    	path_toRelative,
    	path_appendQuery,
    	path_toLocalFile
    	;
    (function(){
    	var isWeb = true;
    	
    	path_getDir = function(path) {
    		return path.substring(0, path.lastIndexOf('/') + 1);
    	};
    	path_getFile = function(path) {
    		path = path
    			.replace('file://', '')
    			.replace(/\\/g, '/')
    			.replace(/\?[^\n]+$/, '');
    		
    		if (/^\/\w+:\/[^\/]/i.test(path)){
    			// win32 drive
    			return path.substring(1);
    		}
    		return path;
    	};
    	path_getExtension = function(path) {
    		var query = path.indexOf('?');
    		if (query !== -1) {
    			path = path.substring(0, query);
    		}
    		var match = rgx_EXT.exec(path);
    		return match == null ? '' : match[1];
    	};
    	
    	path_appendQuery = function(path, key, val){
    		var conjunctor = path.indexOf('?') === -1 ? '?' : '&';
    		return path + conjunctor + key + '=' + val;
    	};
    	
    	(function(){
    		var current_;
    		
    		// if (BROWSER)
    		path_resolveCurrent = function(){
    			if (current_ != null) return current_;
    			
    			var fn = 'baseURI' in global.document
    					? fromBase
    					: fromLocation;
    			return (current_ = path_sliceFilename(fn()));
    		};
    		function fromBase() {
    			var base = global.document.baseURI;
    			if (base.substring(0, 5) === 'file:') {
    				return base;
    			}
    			return base.replace(global.location.origin, '');
    		}
    		function fromLocation() {
    			return global.location.pathname;
    		}
    		// endif
    		
    
    	}());
    	
    	
    	path_normalize = function(path) {
    		var path_ = path
    			.replace(/\\/g, '/')
    			// remove double slashes, but not near protocol
    			.replace(/([^:\/])\/{2,}/g, '$1/')
    			// './xx' to relative string
    			.replace(/^\.\//, '')
    			// join 'xx/./xx'
    			.replace(/\/\.\//g, '/')
    			;
    		return path_collapse(path_);
    	};
    	path_resolveUrl = function(path, base) {
    		var url = path_normalize(path);
    		if (path_isRelative(url)) {
    			return path_normalize(path_combine(base || path_resolveCurrent(), url));
    		}
    		if (rgx_PROTOCOL.test(url)) 
    			return url;
    		
    		if (url.charCodeAt(0) === 47 /*/*/) {
    			if (__cfg.base) {
    				return path_combine(__cfg.base, url);
    			}
    		}
    		return url;
    	};
    	path_isRelative = function(path) {
    		var c = path.charCodeAt(0);
    		switch (c) {
    			case 47:
    				// /
    				return false;
    			case 102:
    			case 104:
    				// f || h
    				return rgx_PROTOCOL.test(path) === false;
    		}
    		return true;
    	};
    	path_toRelative = function(path, anchor, base){
    		var path_     = path_resolveUrl(path_normalize(path), base),
    			absolute_ = path_resolveUrl(path_normalize(anchor), base);
    		
    		if (path_getExtension(absolute_) !== '') {
    			absolute_ = path_getDir(absolute_);
    		}
    		absolute_ = path_combine(absolute_, '/');
    		if (path_.toUpperCase().indexOf(absolute_.toUpperCase()) === 0) {
    			return path_.substring(absolute_.length);
    		}
    		return path;
    	};
    	
    	path_combine = function() {
    		var out = '',
    			imax = arguments.length,
    			i = -1, x;
    		while ( ++i < imax ){
    			x = arguments[i];
    			if (!x)  continue;
    			
    			x = path_normalize(x);
    			if (out === '') {
    				out = x;
    				continue;
    			}
    			if (out[out.length - 1] !== '/') {
    				out += '/'
    			}
    			if (x[0] === '/') {
    				x = x.substring(1);
    			}
    			out += x;
    		}
    		return path_collapse(out);
    	};
    
    
    	
    	var rgx_PROTOCOL = /^(file|https?):/i,
    		rgx_SUB_DIR  = /[^\/\.]+\/\.\.\//,
    		rgx_FILENAME = /\/[^\/]+\.\w+(\?.*)?(#.*)?$/,
    		rgx_EXT      = /\.(\w+)$/,
    		rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/
    		;
    
    	function path_win32Normalize (path){
    		path = path_normalize(path);
    		if (path.substring(0, 5) === 'file:')
    			return path;
    		
    		return 'file:///' + path;
    	}
    	
    	function path_collapse(url_) {
    		var url = url_;
    		while (rgx_SUB_DIR.test(url)) {
    			url = url.replace(rgx_SUB_DIR, '');
    		}
    		return url;
    	}
    	function path_ensureTrailingSlash(path) {
    		if (path.charCodeAt(path.length - 1) === 47 /* / */)
    			return path;
    		
    		return path + '/';
    	}
    	function path_sliceFilename(path) {
    		return path_ensureTrailingSlash(path.replace(rgx_FILENAME, ''));
    	}
    	
    }());
    	
    
    // end:source ./path.js
    // source ./resource/file.js
    var file_get,
    	file_getScript,
    	file_getStyle,
    	file_getJson;
    	
    (function(){
    	file_get = function(path, ctr){
    		return get(xhr_get, path, ctr);
    	};
    	file_getScript = function(path, ctr){
    		return get(script_get, path, ctr);
    	};
    	file_getStyle = function(path, ctr){
    		return get(style_get, path, ctr);
    	};
    	file_getJson = function(path, ctr){
    		return get(json_get, path, ctr);
    	};
    	
    	function get(fn, path, ctr) {
    		path = path_resolveUrl(path, ctr);
    
    		var dfr = Cache[path];
    		if (dfr !== void 0) {
    			return dfr;
    		}
    		dfr = new class_Dfr;
    		fn(path, dfr.pipeCallback());
    		return dfr;
    	}
    	
    	var Cache = {};
    	
    	
    	// source transports/json
    	var json_get;
    	(function(){
    		json_get = function(path, cb){
    			xhr_get(path, function(error, str){
    				if (error) {
    					cb(error);
    					return;
    				}
    				var json;
    				try {
    					json = JSON.parse(str);
    				} catch (error) {
    					cb('JSON error: ' + String(error));
    					return;
    				}
    				cb(null, json);
    			})
    		};
    	}());
    	// end:source transports/json
    
    	// if BROWSER
    	// source transports/script
    	var script_get;
    	(function(){
    		script_get = function(path, cb){
    			var res = new Resource(path)
    				.done(function(exports){
    					cb(null, exports);
    				})
    				.fail(function(err){
    					cb(err);
    				});
    				
    			ScriptStack.load(res);
    		};
    		
    		var Resource = class_create(class_Dfr, {
    			exports: null,
    			url: null,
    			state: 0,
    			constructor: function(url){
    				this.url = url;
    			},
    			load: function(){
    				if (this.state !== 0) {
    					return this;
    				}
    				this.state = 1;
    				global.module = {};
    				
    				var self = this;
    				embedScript(this.url, function(event){
    					self.state = 4;
    					if (event && event.type === 'error') {
    						self.reject(event);
    						return;
    					}
    					self.resolve(self.exports = global.module.exports);
    				});
    				return this;
    			}
    		});
    		var ScriptStack;
    		(function() {
    			ScriptStack = {
    				load: function(resource) {
    					_stack.push(resource);
    					process();
    				}
    			};
    			
    			var _stack = [];
    			
    			function process() {
    				if (_stack.length === 0) 
    					return;
    				
    				var res = _stack[0];
    				if (res.state !== 0) 
    					return;
    				
    				res.load().always(function(){
    					_stack.shift();
    					process();
    				});
    			}
    		})();
    		
    		var embedScript;
    		(function(){
    			embedScript = function (url, callback) {
    				var tag = document.createElement('script');
    				tag.type = 'text/javascript';
    				tag.src = url;
    				if ('onreadystatechange' in tag) {
    					tag.onreadystatechange = function() {
    						(this.readyState === 'complete' || this.readyState === 'loaded') && callback();
    					};
    				} else {
    					tag.onload = tag.onerror = callback;
    				}
    				if (_head === void 0) {
    					_head = document.getElementsByTagName('head')[0];
    				}
    				_head.appendChild(tag);
    			};
    			var _head;
    		}());
    		
    		
    	}());
    	// end:source transports/script
    	// source transports/style
    	var style_get;
    	(function(){
    		style_get = function(path, cb){
    			embedStyle(path);
    			// do not wait for the load event
    			cb();
    		};
    		
    		var embedStyle;
    		(function(){
    			embedStyle = function (url, callback) {
    				var tag = document.createElement('link');
    				tag.rel = 'stylesheet';
    				tag.href = url;
    				if ('onreadystatechange' in tag) {
    					tag.onreadystatechange = function() {
    						(this.readyState === 'complete' || this.readyState === 'loaded') && callback();
    					};
    				} else {
    					tag.onload = tag.onerror = callback;
    				}
    				if (_head === void 0) {
    					_head = document.getElementsByTagName('head')[0];
    				}
    				_head.appendChild(tag);
    			};
    			var _head;
    		}());
    		
    		
    	}());
    	// end:source transports/style
    	// source transports/xhr
    	var xhr_get;
    	(function(){
    		xhr_get = function(path, cb){
    			var xhr = new XMLHttpRequest();
    			xhr.onreadystatechange = function() {
    				if (xhr.readyState !== 4)
    					return;
    				
    				var res = xhr.responseText,
    					status = xhr.status,
    					err, errMsg;
    				if (status !== 0 && status !== 200) {
    					errMsg = res || xhr.statusText;
    				}
    				if (status === 0 && res === '') {
    					errMsg = res || xhr.statusText || 'File is not accessable';
    				}
    				if (errMsg != null) {
    					err = {
    						status: status,
    						content: errMsg
    					};
    					log_warn('File error', path, status);
    				}
    				cb(err, res);
    			};
    			xhr.open('GET', path, true);
    			xhr.send();
    		};
    	}());
    	// end:source transports/xhr
    	// endif
    
    
    
    }());
    // end:source ./resource/file.js
    
    // end:source util/
	// source api/
	//source config
	/**
	 * Get or Set configuration settings
	 * - 1 `(name)`
	 * - 2 `(name, value)`
	 * - 3 `(object)`
	 * @see @{link MaskOptions} for all options
	 * @memberOf mask
	 * @method config
	 */
	function mask_config () {
		var args = arguments,
			length = args.length
		if (length === 0) {
			return __cfg;
		}
		if (length === 1) {
			var x = args[0]
			if (is_Object(x)) {
				obj_extend(__cfg, x);
				listeners_emit('config', x);
				return;
			}
			if (is_String(x)) {
				return obj_getProperty(__cfg, x);
			}
		}
		if (length === 2) {
			var prop = args[0];
			if (obj_hasProperty(__cfg, prop) === false) {
				log_warn('Unknown configuration property', prop);
			}
			var x = {};
			obj_setProperty(x    , prop, args[1]);
			obj_setProperty(__cfg, prop, args[1]);
			listeners_emit('config', x);
			return;
		}
	}
	//end:source config
	// end:source api/
	// source custom/
	var custom_Utils,
		custom_Statements,
		custom_Attributes,
		custom_Tags,
		custom_Tags_global,
		custom_Tags_defs,
		
		custom_Parsers,
		custom_Parsers_Transform,
		custom_Optimizers,
		
		customUtil_get,
		customUtil_$utils,
		customUtil_register,
		
		customTag_get,
		customTag_getAll,	
		customTag_register,
		customTag_registerScoped,
		customTag_registerFromTemplate,
		customTag_registerResolver,
		customTag_Resolver,
		customTag_Compo_getHandler,	
		customTag_define,	
		customTag_Base,
		
		custom_optimize,
		
		customStatement_register,
		customStatement_get,
		
		customAttr_register,
		customAttr_get
		;
		
	(function(){
		
		// source ./repositories.js
		(function(){
			var _HtmlTags = {
				/*
				 * Most common html tags
				 * http://jsperf.com/not-in-vs-null/3
				 */
				a: null,
				abbr: null,
				article: null,
				aside: null,
				audio: null,
				b: null,
				big: null,
				blockquote: null,
				br: null,
				button: null,
				canvas: null,
				datalist: null,
				details: null,
				div: null,
				em: null,
				fieldset: null,
				footer: null,
				form: null,
				h1: null,
				h2: null,
				h3: null,
				h4: null,
				h5: null,
				h6: null,
				header: null,
				i: null,
				img: null,
				input: null,
				label: null,
				legend: null,
				li: null,
				menu: null,
				nav: null,
				ol: null,
				option: null,
				p: null,
				pre: null,
				section: null,
				select: null,
				small: null,
				span: null,
				strong: null,
				svg: null,
				table: null,
				tbody: null,
				td: null,
				textarea: null,
				tfoot: null,
				th: null,
				thead: null,
				tr: null,
				tt: null,
				ul: null,
				video: null,
			};
			var _HtmlAttr = {
				'class'	: null,
				'id'	: null,
				'style'	: null,
				'name'	: null,
				'type'	: null,
				'value' : null,
				'required': null,
				'disabled': null,
			};
			
			custom_Utils = {
				expression: function(value, model, ctx, element, ctr){
					return expression_eval(value, model, ctx, ctr);
				},
			};
			custom_Optimizers   = {};
			custom_Statements 	= {};
			custom_Attributes 	= obj_extend({}, _HtmlAttr);
			custom_Tags 		= obj_extend({}, _HtmlTags);
			custom_Tags_global 	= obj_extend({}, _HtmlTags);
			custom_Parsers 		= obj_extend({}, _HtmlTags);
			custom_Parsers_Transform = obj_extend({}, _HtmlTags);
			
			// use on server to define reserved tags and its meta info
			custom_Tags_defs = {};
		}());
		// end:source ./repositories.js
		// source ./tag.js
		(function(){	
			/**
			 * Get Components constructor from the global repository or the scope
			 * @param {string} name
			 * @param {object} [component] - pass a component to look in its scope
			 * @returns {IComponent}
			 * @memberOf mask
			 * @method getHandler
			 */
			customTag_get = function(name, ctr) {
				if (arguments.length === 0) {
					reporter_deprecated('getHandler.all', 'Use `mask.getHandlers` to get all components (also scoped)');
					return customTag_getAll();
				}
				var Ctor = custom_Tags[name];
				if (Ctor == null) {
					return null;
				}
				if (Ctor !== Resolver) {
					return Ctor;
				}
				
				var ctr_ = is_Function(ctr) ? ctr.prototype : ctr;
				while(ctr_ != null) {
					if (is_Function(ctr_.getHandler)) {
						Ctor = ctr_.getHandler(name);
						if (Ctor != null) {
							return Ctor;
						}
					}
					ctr_ = ctr_.parent;
				}
				return custom_Tags_global[name];
			};	
			/**
			 * Get all components constructors from the global repository and/or the scope
			 * @param {object} [component] - pass a component to look also in its scope
			 * @returns {object} All components in an object `{name: Ctor}`
			 * @memberOf mask
			 * @method getHandlers
			 */
			customTag_getAll = function(ctr) {
				if (ctr == null) {
					return custom_Tags;
				}
				
				var obj = {},
					ctr_ = ctr, x;
				while (ctr_ != null) {
					x = null;
					if (is_Function(ctr_.getHandlers)) {
						x = ctr_.getHandlers();
					} else {
						x = ctr_.__handlers__;
					}
					if (x != null) {
						obj = obj_extendDefaults(obj, x);
					}
					ctr_ = ctr_.parent;
				}
				for (var key in custom_Tags) {
					x = custom_Tags[key];
					if (x == null || x === Resolver) {
						continue;
					}
					if (obj[key] == null) {
						obj[key] = x;
					}
				}
				return obj;
			};
			/**
			 * Register a component
			 * @param {string} name
			 * @param {object|IComponent} component
			 * @param {object} component - Component static definition
			 * @param {IComponent} component - Components constructor
			 * @returns {void}
			 * @memberOf mask
			 * @method registerHandler
			 */
			customTag_register = function(mix, Handler){
				if (typeof mix !== 'string' && arguments.length === 3) {
					customTag_registerScoped.apply(this, arguments);
					return;
				}
				var Current = custom_Tags[mix],
					Ctor = compo_ensureCtor(Handler),
					Repo = custom_Tags[mix] === Resolver
						? custom_Tags_global
						: custom_Tags
						;
				Repo[mix] = Ctor;	
				
				//> make fast properties
				obj_toFastProps(custom_Tags);
			};
			/**
			 * Register components from a template
			 * @param {string} template - Mask template
			 * @param {object|IComponent} [component] - Register in the components scope
			 * @param {string} [path] - Optionally define the path for the template
			 * @returns {Promise} - Fullfills when all submodules are resolved and components are registerd
			 * @memberOf mask
			 * @method registerFromTemplate
			 */
			customTag_registerFromTemplate = function(mix, Ctr, path){
				var dfr = new class_Dfr;
				new Module
					.ModuleMask(path || '')
					.preprocess_(mix, function(error, exports){
						if (error) {
							return dfr.reject(error);
						}
						var store = exports.__handlers__;
						for (var key in store) {
							if (exports[key] != null) {
								// is global
								customTag_register(key, store[key]);
								continue;
							}
							customTag_registerScoped(Ctr, key, store[key]);
						}
						dfr.resolve(exports.__handlers__);
					});
				
				return dfr;
			};
			/**
			 * Register a component
			 * @param {object|IComponent} scopedComponent - Use components scope
			 * @param {string} name - Name of the component
			 * @param {object|IComponent} component - Components definition
			 * @returns {void}
			 * @memberOf mask
			 * @method registerScoped
			 */
			customTag_registerScoped = function(Ctx, name, Handler) {
				if (Ctx == null) {
					// Use global
					customTag_register(name, Handler);
					return;
				}
				customTag_registerResolver(name);
				var obj = is_Function(Ctx) ? Ctx.prototype : Ctx;
				var map = obj.__handlers__;
				if (map == null) {
					map = obj.__handlers__ = {};
				}
				map[name] = compo_ensureCtor(Handler);
				
				if (obj.getHandler == null) {
					obj.getHandler = customTag_Compo_getHandler;
				}
			};
			
			/** Variations:
			 * - 1. (template)
			 * - 2. (scopedCompoName, template)
			 * - 3. (scopedCtr, template)
			 * - 4. (name, Ctor)
			 * - 5. (scopedCtr, name, Ctor)
			 * - 6. (scopedCompoName, name, Ctor)
			 */
			
			function is_Compo(val) {
				return is_Object(val) || is_Function(val);
			}
			
			/**
			 * Universal component definition, which covers all the cases: simple, scoped, template
			 * - 1. (template)
			 * - 2. (scopedCompoName, template)
			 * - 3. (scopedCtr, template)
			 * - 4. (name, Ctor)
			 * - 5. (scopedCtr, name, Ctor)
			 * - 6. (scopedCompoName, name, Ctor)
			 * @returns {void|Promise}
			 * @memberOf mask
			 * @method define
			 */
			customTag_define = fn_createByPattern([{
					pattern: [is_String],
					handler: function(template) {
						return customTag_registerFromTemplate(template);
					}
				}, {
					pattern: [is_String, is_String],
					handler: function(name, template) {
						var Scope = customTag_get(name);
						return customTag_registerFromTemplate(template, Scope);
					}
				}, {
					pattern: [is_Compo, is_String],
					handler: function(Scope, template) {
						return customTag_registerFromTemplate(template, Scope);
					}
				}, {
					pattern: [is_String, is_Compo],
					handler: function(name, Ctor) {
						return customTag_register(name, Ctor);
					}
				}, {
					pattern: [is_Compo, is_String, is_Compo],
					handler: function(Scope, name, Ctor) {
						customTag_registerScoped(Scope, name, Ctor);
					}
				}, {
					pattern: [is_String, is_String, is_Compo],
					handler: function(scopeName, name, Ctor) {
						var Scope = customTag_get(scopeName);
						return customTag_registerScoped(Scope, name, Ctor);
					}
				}
			]);
			
			
			customTag_registerResolver = function(name){
				var Ctor = custom_Tags[name];
				if (Ctor === Resolver) 
					return;
				
				if (Ctor != null) 
					custom_Tags_global[name] = Ctor;
				
				custom_Tags[name] = Resolver;
				
				//> make fast properties
				obj_toFastProps(custom_Tags);
			};
			
			customTag_Compo_getHandler = function (name) {
				var map = this.__handlers__;
				return map == null ? null : map[name];
			};
			
			customTag_Base = {
				async: false,
				attr: null,
				await: null,
				compoName: null,
				components: null,
				expression: null,
				ID: null,
				meta: null,
				model: null,
				nodes: null,
				parent: null,
				render: null,
				renderEnd: null,
				renderStart: null,
				tagName: null,
				type: null,
			};
			
			var Resolver;
			(function(){
				customTag_Resolver = Resolver = function (node, model, ctx, container, ctr) {
					var Mix = customTag_get(node.tagName, ctr);
					if (Mix != null) {
						if (is_Function(Mix) === false)	{
							return obj_create(Mix);
						}
						return new Mix(node, model, ctx, container, ctr);
					}
					error_withNode('Component not found: ' + node.tagName, node);
					return null;
				};
			}());
			
			function wrapStatic(proto) {
				function Ctor(node, parent) {
					this.ID = null;
					this.tagName = node.tagName;
					this.attr = obj_create(node.attr);
					this.expression = node.expression;
					this.nodes = node.nodes;
					this.nextSibling = node.nextSibling;
					this.parent = parent;
					this.components = null;
				}
				Ctor.prototype = proto;
				return Ctor;
			}
			
			
			
			function compo_ensureCtor(Handler) {
				if (is_Object(Handler)) {
					//> static
					Handler.__Ctor = wrapStatic(Handler);
				}
				return Handler;
			}
			
		}());
		// end:source ./tag.js
		// source ./attribute.js
		/**
		 * Register an attribute handler. Any changes can be made to:
		 * - maskNode's template
		 * - current element value
		 * - controller
		 * - model
		 * Note: Attribute wont be set to an element.
		 * @param {string} name - Attribute name to handle
		 * @param {string} [mode] - Render mode `client|server|both`
		 * @param {AttributeHandler} handler 
		 * @returns {void}
		 * @memberOf mask
		 * @method registerAttrHandler
		 */
		customAttr_register = function(attrName, mix, Handler){
			if (is_Function(mix)) {
				Handler = mix;
			}	
			custom_Attributes[attrName] = Handler;
		};
		/**
		 * Get attribute  handler
		 * @param {string} name
		 * @returns {AttributeHandler}
		 * @memberOf mask
		 * @method getAttrHandler
		 */
		customAttr_get = function(attrName){
			return attrName != null
				? custom_Attributes[attrName]
				: custom_Attributes;
		};
		/**
		 * Is called when the builder matches the node by attribute name
		 * @callback AttributeHandler
		 * @param {MaskNode} node
		 * @param {string} attrValue
		 * @param {object} model
		 * @param {object} ctx
		 * @param {DomNode} element
		 * @param {object} parentComponent
		 */
		// end:source ./attribute.js
		// source ./util.js
		(function() {
			/**
			 * Utils Repository
			 * @param {string} name
			 * @param {(IUtilHandler|UtilHandler)} handler
			 * @memberOf mask
			 * @name _
			 * @category Mask Util
			 */
			customUtil_$utils = {};	
			/**
			 * Register Util Handler. Template Example: `'~[myUtil: value]'`
			 * @param {string} name
			 * @param {(mask._.IUtilHandler|mask._.FUtilHandler)} handler
			 * @memberOf mask
			 * @method getUtil
			 * @category Mask Util
			 */
			customUtil_register = function(name, mix) {
				if (is_Function(mix)) {
					custom_Utils[name] = mix;
					return;
				}
				custom_Utils[name] = createUtil(mix);
				if (mix['arguments'] === 'parsed')
					customUtil_$utils[name] = mix.process;
			};	
			/**
			 * Get the Util Handler
			 * @param {string} name
			 * @memberOf mask
			 * @method registerUtil
			 * @category Mask Util
			 */
			customUtil_get = function(name) {
				return name != null ? custom_Utils[name] : custom_Utils;
			};
			
			function createUtil(obj) {
				if (obj['arguments'] === 'parsed') {
					return processParsedDelegate(obj.process);
				}
				var fn = fn_proxy(obj.process || processRawFn, obj);
				// <static> save reference to the initial util object.
				// Mask.Bootstrap needs the original util
				// @workaround
				fn.util = obj;
				return fn;
			}
			function processRawFn(expr, model, ctx, el, ctr, attrName, type) {
				if ('node' === type) {
					this.nodeRenderStart(expr, model, ctx, el, ctr);
					return this.node(expr, model, ctx, el, ctr);
				}
				// asume 'attr'
				this.attrRenderStart(expr, model, ctx, el, ctr, attrName);
				return this.attr(expr, model, ctx, el, ctr, attrName);
			}
			function processParsedDelegate(fn) {
				return function(expr, model, ctx, el, ctr) {
					var args = expression_evalStatements(
						expr, model, ctx, ctr
					);
					return fn.apply(null, args);
				};
			}	
			/**
			 * Is called when the builder matches the interpolation.
			 * Define `process` function OR group of `node*`,`attr*` functions.
			 * The seperation `*RenderStart/*` is needed for Nodejs rendering - the first part is called on nodejs side,
			 * the other one is called on the client.
			 * @typedef IUtilHandler
			 * @type {object}
			 * @property {bool} [arguments=false] - should parse interpolation string to arguments, otherwise raw string is passed
			 * @property {UtilHandler} [process]
			 * @property {function} [nodeRenderStart] - `expr, model, ctx, element, controller, attrName`
			 * @property {function} [node] - `expr, model, ctx, element, controller`
			 * @property {function} [attr] - `expr, model, ctx, element, controller, attrName`
			 * @property {function} [attrRenderStart] - `expr, model, ctx, element, controller, attrName`
			 * @abstract
			 * @category Mask Util
			 */	 
			 var IUtilHandler = {
				'arguments': null,
				'process': null,
				'nodeRenderStart': null,
				'node': null,
				'attrRenderStart': null,
				'attr': null,
			 };
			/**
			 * Is called when the builder matches the interpolation
			 * @param {string} value - string after the utility name
			 * @param {object} model
			 * @param {("attr"|"node")} type - Current location: text node or attribute
			 * @param {HTMLNode} element
			 * @param {string} name - If the interpolation is in attribute, then this will contain attributes name
			 * @typedef UtilHandler
			 * @type {function}
			 * @abstract
			 * @category Mask Util
			 */
			function UtilHandler() {}
		}());
		// end:source ./util.js
		// source ./statement.js
		/**
		 * Register a statement handler
		 * @param {string} name - Tag name to handle
		 * @param StatementHandler} handler
		 * @memberOf mask
		 * @method registerStatement
		 */
		customStatement_register = function(name, handler){
			//@TODO should it be not allowed to override system statements, if, switch?	
			custom_Statements[name] = is_Function(handler)
				? { render: handler }
				: handler
				;
		};
		/**
		 * Get statement handler
		 * @param {string} name
		 * @returns {StatementHandler}
		 * @memberOf mask
		 * @method getStatement
		 */
		customStatement_get = function(name){
			return name != null
				? custom_Statements[name]
				: custom_Statements
				;
		};
		/**
		 * Is called when the builder matches the node by tagName
		 * @callback StatementHandler
		 * @param {MaskNode} node
		 * @param {object} model
		 * @param {object} ctx
		 * @param {DomNode} container
		 * @param {object} parentComponent
		 * @param {Array} children - `out` Fill the array with rendered elements
		 */
		// end:source ./statement.js
		// source ./optimize.js
		(function(){
			custom_optimize = function(){
				var i = _arr.length;
				while (--i > -1) {
					readProps(_arr[i]);
				}
				i = _arr.length;
				while(--i > -1) {
					defineProps(_arr[i]);
					obj_toFastProps(_arr[i]);
				}
				obj_toFastProps(custom_Attributes);
			};
			var _arr = [
				custom_Statements,
				custom_Tags,
				custom_Parsers,
				custom_Parsers_Transform
			];
			var _props = {};
			function readProps(obj) {
				for (var key in obj) {
					_props[key] = null;
				}
			}
			function defineProps(obj) {
				for (var key in _props) {
					if (obj[key] === void 0) {
						obj[key] = null;
					}
				}
			}
		}());
		// end:source ./optimize.js
		
	}());
	
	// end:source custom/
	// source expression/
	/**
	 * ExpressionUtil
	 *
	 * Helper to work with expressions
	 **/
	var expression_eval,
		expression_evalStatements,
		ExpressionUtil;
	
	(function(){
	
		// source 1.scope-vars.js
		
		var index = 0,
			length = 0,
			cache = {},
			template, ast;
		
		var op_Minus = '-', //1,
			op_Plus = '+', //2,
			op_Divide = '/', //3,
			op_Multip = '*', //4,
			op_Modulo = '%', //5,
			
			op_LogicalOr = '||', //6,
			op_LogicalAnd = '&&', //7,
			op_LogicalNot = '!', //8,
			op_LogicalEqual = '==', //9,
			op_LogicalEqual_Strict = '===', // 111
			op_LogicalNotEqual = '!=', //11,
			op_LogicalNotEqual_Strict = '!==', // 112
			op_LogicalGreater = '>', //12,
			op_LogicalGreaterEqual = '>=', //13,
			op_LogicalLess = '<', //14,
			op_LogicalLessEqual = '<=', //15,
			op_Member = '.', // 16
		
			punc_ParantheseOpen 	= 20,
			punc_ParantheseClose 	= 21,
			punc_BracketOpen 		= 22,
			punc_BracketClose 		= 23,
			punc_BraceOpen 			= 24,
			punc_BraceClose 		= 25,
			punc_Comma 				= 26,
			punc_Dot 				= 27,
			punc_Question 			= 28,
			punc_Colon 				= 29,
			punc_Semicolon 			= 30,
		
			go_ref = 31,
			go_acs = 32,
			go_string = 33,
			go_number = 34,
			go_objectKey = 35;
		
		var type_Body = 1,
			type_Statement = 2,
			type_SymbolRef = 3,
			type_FunctionRef = 4,
			type_Accessor = 5,
			type_AccessorExpr = 6,
			type_Value = 7,
		
		
			type_Number = 8,
			type_String = 9,
			type_Object = 10,
			type_Array = 11,
			type_UnaryPrefix = 12,
			type_Ternary = 13;
		
		var state_body = 1,
			state_arguments = 2;
		
		
		var precedence = {};
		
		precedence[op_Member] = 1;
		
		precedence[op_Divide] = 2;
		precedence[op_Multip] = 2;
		
		precedence[op_Minus] = 3;
		precedence[op_Plus] = 3;
		
		precedence[op_LogicalGreater] = 4;
		precedence[op_LogicalGreaterEqual] = 4;
		precedence[op_LogicalLess] = 4;
		precedence[op_LogicalLessEqual] = 4;
		
		precedence[op_LogicalEqual] = 5;
		precedence[op_LogicalEqual_Strict] = 5;
		precedence[op_LogicalNotEqual] = 5;
		precedence[op_LogicalNotEqual_Strict] = 5;
		
		
		precedence[op_LogicalAnd] = 6;
		precedence[op_LogicalOr] = 6;
		
		// end:source 1.scope-vars.js
		// source 2.ast.js
		var Ast_Body,
			Ast_Statement,
			Ast_Value,
			Ast_Array,
			Ast_Object,
			Ast_FunctionRef,
			Ast_SymbolRef,
			Ast_Accessor,
			Ast_AccessorExpr,
			Ast_UnaryPrefix,
			Ast_TernaryStatement
			;
			
		
		(function(){
			
			Ast_Body = function(parent) {
				this.parent = parent;
				this.type = type_Body;
				this.body = [];
				this.join = null;
			};
			
			Ast_Statement = function(parent) {
				this.parent = parent;
			};
			
			Ast_Statement.prototype = {
				constructor: Ast_Statement,
				type: type_Statement,
				join: null,
				body: null
			};
			
			Ast_Value = function(value) {
				this.type = type_Value;
				this.body = value;
				this.join = null;
			};
			
			Ast_Array = function(parent){
				this.type = type_Array;
				this.parent = parent;
				this.body = new Ast_Body(this);
			};
			
			Ast_Object = function(parent){
				this.type = type_Object;
				this.parent = parent;
				this.props = {};
			}
			Ast_Object.prototype = {
				nextProp: function(prop){
					var body = new Ast_Statement(this);
					this.props[prop] = body;
					return body;
				},
			};
			
			Ast_FunctionRef = function(parent, ref) {
				this.parent = parent;
				this.type = type_FunctionRef;
				this.body = ref;
				this.arguments = [];
				this.next = null;
			}
			Ast_FunctionRef.prototype = {
				constructor: Ast_FunctionRef,
				newArgument: function() {
					var body = new Ast_Body(this);
					this.arguments.push(body);
			
					return body;
				}
			};
			
			Ast_SymbolRef = function(parent, ref) {
				this.type = type_SymbolRef;
				this.parent = parent;
				this.body = ref;
				this.next = null;
			};
			Ast_Accessor = function(parent, ref) {
				this.type = type_Accessor;
				this.parent = parent;
				this.body = ref;
				this.next = null;
			};
			Ast_AccessorExpr = function(parent){
				this.parent = parent;
				this.body = new Ast_Statement(this);
				this.body.body = new Ast_Body(this.body);
				this.next = null;
			};
			Ast_AccessorExpr.prototype  = {
				type: type_AccessorExpr,
				getBody: function(){
					return this.body.body;
				}
			};
			
			
			Ast_UnaryPrefix = function(parent, prefix) {
				this.parent = parent;
				this.prefix = prefix;
			};
			Ast_UnaryPrefix.prototype = {
				constructor: Ast_UnaryPrefix,
				type: type_UnaryPrefix,
				body: null
			};
			
			
			Ast_TernaryStatement = function(assertions){
				this.body = assertions;
				this.case1 = new Ast_Body(this);
				this.case2 = new Ast_Body(this);
			};
			Ast_TernaryStatement.prototype = {
				constructor: Ast_TernaryStatement,
				type: type_Ternary,
				case1: null,
				case2: null
			};
		
		}());
		// end:source 2.ast.js
		// source 2.ast.utils.js
		var ast_handlePrecedence,
			ast_append;
			
		(function(){
			
				
			ast_append = function(current, next) {
				switch(current.type) {
					case type_Body:
						current.body.push(next);
						return next;
					
					case type_Statement:
						if (next.type === type_Accessor || next.type === type_AccessorExpr) {
							return (current.next = next)
						}
						/* fall through */
					case type_UnaryPrefix:
						return (current.body = next);
					
					case type_SymbolRef:
					case type_FunctionRef:
					case type_Accessor:
					case type_AccessorExpr:
						return (current.next = next);
				}
				
				return util_throw('Invalid expression');
			};
			
			
			ast_handlePrecedence = function(ast) {
				if (ast.type !== type_Body){
					
					if (ast.body != null && typeof ast.body === 'object')
						ast_handlePrecedence(ast.body);
					
					return;
				}
			
				var body = ast.body,
					i = 0,
					length = body.length,
					x, prev, array;
			
				for(; i < length; i++){
					ast_handlePrecedence(body[i]);
				}
			
			
				for(i = 1; i < length; i++){
					x = body[i];
					prev = body[i-1];
			
					if (precedence[prev.join] > precedence[x.join])
						break;
					
				}
			
				if (i === length)
					return;
				
			
				array = [body[0]];
				for(i = 1; i < length; i++){
					x = body[i];
					prev = body[i-1];
					
					var prec_Prev = precedence[prev.join];
					if (prec_Prev > precedence[x.join] && i < length - 1){
						
						var start = i,
							nextJoin,
							arr;
						
						// collect all with join smaller or equal to previous
						// 5 == 3 * 2 + 1 -> 5 == (3 * 2 + 1);
						while (++i < length){
							nextJoin = body[i].join;
							if (nextJoin == null) 
								break;
							
							if (prec_Prev <= precedence[nextJoin])
								break;
						}
						
						arr = body.slice(start, i + 1);
						x = ast_join(arr);
						ast_handlePrecedence(x);
					}
			
					array.push(x);
				}
			
				ast.body = array;
			
			};
		
			// = private
			
			function ast_join(bodyArr){
				if (bodyArr.length === 0)
					return null;
				
				var body = new Ast_Body(bodyArr[0].parent);
			
				body.join = bodyArr[bodyArr.length - 1].join;
				body.body = bodyArr;
			
				return body;
			}
		
			
		}());
		// end:source 2.ast.utils.js
		// source 3.util.js
		var util_resolveRef,
			util_throw;
		
		(function(){
			
			util_throw = function(msg, token){
				return parser_error(msg
					, template
					, index
					, token
					, 'expr'
				);
			};
			
			util_resolveRef = function(astRef, model, ctx, ctr) {
				var controller = ctr,
					current = astRef,
					key = astRef.body,
					object,
					value,
					args,
					i,
					imax
					;
				
				if ('$c' === key) {
					reporter_deprecated(
						'accessor.compo', "Use `$` instead of `$c`."
					);
					key = '$';
				}
				if ('$u' === key) {
					reporter_deprecated(
						'accessor.util', "Use `_` instead of `$u`"
					);
					key = '_';
				}
				if ('$a' === key) {
					reporter_deprecated(
						'accessor.attr', "Use `$.attr` instead of `$a`"
					);
				}
				
				if ('$' === key) {
					value = controller;
					
					var next = current.next,
						nextBody = next != null && next.body;
					if (nextBody != null && value[nextBody] == null){
							
						if (next.type === type_FunctionRef && is_Function(Compo.prototype[nextBody])) {
							// use fn from prototype if possible, like `closest`
							object = controller;
							value = Compo.prototype[nextBody];
							current = next;
						} else {
							// find the closest controller, which has the property
							while (true) {
								value = value.parent;
								if (value == null) 
									break;
								
								if (value[nextBody] == null) 
									continue;
								
								object = value;
								value = value[nextBody];
								current = next;
								break;
							}
						}
						
						if (value == null) {
							// prepair for warn message
							key = '$.' + nextBody;
							current = next;
						}
					}
					
				}
				
				else if ('$a' === key) {
					value = controller && controller.attr;
				}
				
				else if ('_' === key) {
					value = customUtil_$utils;
				}
				
				
				else if ('$ctx' === key) {
					value = ctx;
				}
				
				else if ('$scope' === key) {
					var next = current.next,
						nextBody = next != null && next.body;
					
					if (nextBody != null) {
						while (controller != null) {
							object = controller.scope;				
							if (object != null) {
								value = object[nextBody];
							}
							if (value != null) {
								break;
							}
							controller = controller.parent;
						}
						current = next;
					}
				}
				
				else {
					// scope resolver
					
					if (model != null) {
						object = model;
						value = model[key];
					}
					
					if (value == null) {
						
						while (controller != null) {
							object = controller.scope;
							
							if (object != null) 
								value = object[key];
							
							if (value != null) 
								break;
							
							controller = controller.parent;
						} 
					}
				}
				
				if (value == null) {
					if (current == null || current.next != null){
						// notify that value is not in model, ctx, controller;
						log_warn('<mask:expression> Accessor error:', key);
					}
					return null;
				}
				
				do {
					if (current.type === type_FunctionRef) {
						
						args = [];
						i = -1;
						imax = current.arguments.length;
						
						while( ++i < imax ) {
							args[i] = expression_evaluate(
								current.arguments[i]
								, model
								, ctx
								, controller
							);
						}
						
						value = value.apply(object, args);
					}
		
					if (value == null || current.next == null) {
						break;
					}
					
					current = current.next;
					key = current.type === type_AccessorExpr
						? expression_evaluate(current.body, model, ctx, controller)
						: current.body
						;
					
					object = value;
					value = value[key];
					
					if (value == null) 
						break;
		
				} while (true);
				
				return value;
			};
			
			
		}());
		
		
		// end:source 3.util.js
		// source 4.parser.helper.js
		var parser_skipWhitespace,
			parser_getString,
			parser_getNumber,
			parser_getArray,
			parser_getObject,
			parser_getRef,
			parser_getDirective
			;
			
		(function(){
			parser_skipWhitespace = function() {
				var c;
				while (index < length) {
					c = template.charCodeAt(index);
					if (c > 32) 
						return c;
					index++;
				}
				return null;
			};
			parser_getString = function(c) {
				var isEscaped = false,
					_char = c === 39 ? "'" : '"',
					start = index,
					nindex, string;
			
				while ((nindex = template.indexOf(_char, index)) > -1) {
					index = nindex;
					if (template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
						break;
					}
					isEscaped = true;
					index++;
				}
			
				string = template.substring(start, index);
				if (isEscaped === true) {
					string = string.replace(__rgxEscapedChar[_char], _char);
				}
				return string;
			};
			
			parser_getNumber = function() {
				var start = index,
					code, isDouble;
				while (true) {
			
					code = template.charCodeAt(index);
					if (code === 46) {
						// .
						if (isDouble === true) {
							util_throw('Invalid number', code);
							return null;
						}
						isDouble = true;
					}
					if ((code >= 48 && code <= 57 || code === 46) && index < length) {
						index++;
						continue;
					}
					break;
				}
				return +template.substring(start, index);
			};
			
			
			parser_getRef = function() {
				var start = index,
					c = template.charCodeAt(index),
					ref;
			
				if (c === 34 || c === 39) {
					// ' | "
					index++;
					ref = parser_getString(c);
					index++;
					return ref;
				}
			
				while (true) {
					
					if (index === length) 
						break;
					
					c = template.charCodeAt(index);
					
					if (c === 36 || c === 95) {
						// $ _
						index++;
						continue;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						index++;
						continue;
					}
					// - [removed] (exit on not allowed chars) 5ba755ca
					break;
				}
				return template.substring(start, index);
			};
			
			parser_getDirective = function(code) {
				if (code == null && index === length) 
					return null;
				
				switch (code) {
					case 40:
						// (
						return punc_ParantheseOpen;
					case 41:
						// )
						return punc_ParantheseClose;
					case 123:
						// {
						return punc_BraceOpen;
					case 125:
						// }
						return punc_BraceClose;
					case 91:
						// [
						return punc_BracketOpen;
					case 93:
						// ]
						return punc_BracketClose;
					case 44:
						// ,
						return punc_Comma;
					case 46:
						// .
						return punc_Dot;
					case 59:
						// ;
						return punc_Semicolon;
					case 43:
						// +
						return op_Plus;
					case 45:
						// -
						return op_Minus;
					case 42:
						// *
						return op_Multip;
					case 47:
						// /
						return op_Divide;
					case 37:
						// %
						return op_Modulo;
			
					case 61:
						// =
						if (template.charCodeAt(++index) !== code) {
							util_throw(
								'Assignment violation: View can only access model/controllers', '='
							);
							return null;
						}
						if (template.charCodeAt(index + 1) === code) {
							index++;
							return op_LogicalEqual_Strict;
						}
						return op_LogicalEqual;
					case 33:
						// !
						if (template.charCodeAt(index + 1) === 61) {
							// =
							index++;
							
							if (template.charCodeAt(index + 1) === 61) {
								// =
								index++;
								return op_LogicalNotEqual_Strict;
							}
							
							return op_LogicalNotEqual;
						}
						return op_LogicalNot;
					case 62:
						// >
						if (template.charCodeAt(index + 1) === 61) {
							index++;
							return op_LogicalGreaterEqual;
						}
						return op_LogicalGreater;
					case 60:
						// <
						if (template.charCodeAt(index + 1) === 61) {
							index++;
							return op_LogicalLessEqual;
						}
						return op_LogicalLess;
					case 38:
						// &
						if (template.charCodeAt(++index) !== code) {
							util_throw(
								'Not supported: Bitwise AND', code
							);
							return null;
						}
						return op_LogicalAnd;
					case 124:
						// |
						if (template.charCodeAt(++index) !== code) {
							util_throw(
								'Not supported: Bitwise OR', code
							);
							return null;
						}
						return op_LogicalOr;
					case 63:
						// ?
						return punc_Question;
					case 58:
						// :
						return punc_Colon;
				}
			
				if ((code >= 65 && code <= 90) ||
					(code >= 97 && code <= 122) ||
					(code === 95) ||
					(code === 36)) {
					// A-Z a-z _ $
					return go_ref;
				}
			
				if (code >= 48 && code <= 57) {
					// 0-9 .
					return go_number;
				}
			
				if (code === 34 || code === 39) {
					// " '
					return go_string;
				}
			
				util_throw(
					'Unexpected or unsupported directive', code
				);
				return null;
			};
		}());
		// end:source 4.parser.helper.js
		// source 5.parser.js
		/*
		 * earlyExit - only first statement/expression is consumed
		 */
		function expression_parse(expr, earlyExit) {
			if (earlyExit == null) 
				earlyExit = false;
			
			template = expr;
			index = 0;
			length = expr.length;
		
			ast = new Ast_Body();
		
			var current = ast,
				state = state_body,
				c, next, directive;
		
			outer: while (true) {
		
				if (index < length && (c = template.charCodeAt(index)) < 33) {
					index++;
					continue;
				}
		
				if (index >= length) 
					break;
				
				directive = parser_getDirective(c);
		
				if (directive == null && index < length) {
					break;
				}
				if (directive === punc_Semicolon) {
					if (earlyExit === true) 
						return [ast, index];
					
					break;
				}
				
				if (earlyExit === true) {
					var p = current.parent;
					if (p != null && p.type === type_Body && p.parent == null) {
						// is in root body
						if (directive === go_ref) 
							return [ast, index];
					}
				}
				
				if (directive === punc_Semicolon) {
					break;
				}
				
				switch (directive) {
					case punc_ParantheseOpen:
						current = ast_append(current, new Ast_Statement(current));
						current = ast_append(current, new Ast_Body(current));
		
						index++;
						continue;
					case punc_ParantheseClose:
						var closest = type_Body;
						if (state === state_arguments) {
							state = state_body;
							closest = type_FunctionRef;
						}
		
						do {
							current = current.parent;
						} while (current != null && current.type !== closest);
		
						if (closest === type_Body) {
							current = current.parent;
						}
		
						if (current == null) {
							util_throw('OutOfAst Exception', c);
							break outer;
						}
						index++;
						continue;
					
					case punc_BraceOpen:
						current = ast_append(current, new Ast_Object(current));
						directive = go_objectKey;
						index++;
						break;
					case punc_BraceClose:
						while (current != null && current.type !== type_Object){
							current = current.parent;
						}
						index++;
						continue;
					case punc_Comma:
						if (state !== state_arguments) {
							
							state = state_body;
							do {
								current = current.parent;
							} while (current != null &&
								current.type !== type_Body &&
								current.type !== type_Object
							);
							index++;
							if (current == null) {
								util_throw('Unexpected comma', c);
								break outer;	
							}
							
							if (current.type === type_Object) {
								directive = go_objectKey;
								break;
							}
							
							continue;
						}
						do {
							current = current.parent;
						} while (current != null && current.type !== type_FunctionRef);
		
						if (current == null) {
							util_throw('OutOfAst Exception', c);
							break outer;
						}
		
						current = current.newArgument();
		
						index++;
						continue;
		
					case punc_Question:
						ast = new Ast_TernaryStatement(ast);
						current = ast.case1;
						index++;
						continue;
					
					case punc_Colon:
						current = ast.case2;
						index++;
						continue;
		
		
					case punc_Dot:
						c = template.charCodeAt(index + 1);
						if (c >= 48 && c <= 57) {
							directive = go_number;
						} else {
							directive = current.type === type_Body
								? go_ref
								: go_acs
								;
							index++;
						}
						break;
					case punc_BracketOpen:
						if (current.type === type_SymbolRef ||
							current.type === type_AccessorExpr ||
							current.type === type_Accessor
							) {
							current = ast_append(current, new Ast_AccessorExpr(current))
							current = current.getBody();
							index++;
							continue;
						}
						current = ast_append(current, new Ast_Array(current));
						current = current.body;
						index++;
						continue;
					case punc_BracketClose:
						do {
							current = current.parent;
						} while (current != null &&
							current.type !== type_AccessorExpr &&
							current.type !== type_Array
						);
						index++;
						continue;
				}
		
		
				if (current.type === type_Body) {
					current = ast_append(current, new Ast_Statement(current));
				}
		
				if ((op_Minus === directive || op_LogicalNot === directive) && current.body == null) {
					current = ast_append(current, new Ast_UnaryPrefix(current, directive));
					index++;
					continue;
				}
		
				switch (directive) {
		
					case op_Minus:
					case op_Plus:
					case op_Multip:
					case op_Divide:
					case op_Modulo:
		
					case op_LogicalAnd:
					case op_LogicalOr:
					case op_LogicalEqual:
					case op_LogicalEqual_Strict:
					case op_LogicalNotEqual:
					case op_LogicalNotEqual_Strict:
		
					case op_LogicalGreater:
					case op_LogicalGreaterEqual:
					case op_LogicalLess:
					case op_LogicalLessEqual:
		
						while (current && current.type !== type_Statement) {
							current = current.parent;
						}
		
						if (current.body == null) {
							return util_throw(
								'Unexpected operator', c
							);
						}
		
						current.join = directive;
		
						do {
							current = current.parent;
						} while (current != null && current.type !== type_Body);
		
						if (current == null) {
							return util_throw(
								'Unexpected operator' , c
							);
						}
		
		
						index++;
						continue;
					case go_string:
					case go_number:
						if (current.body != null && current.join == null) {
							return util_throw(
								'Directive expected', c 
							);
						}
						if (go_string === directive) {
							index++;
							ast_append(current, new Ast_Value(parser_getString(c)));
							index++;
		
						}
		
						if (go_number === directive) {
							ast_append(current, new Ast_Value(parser_getNumber(c)));
						}
		
						continue;
		
					case go_ref:
					case go_acs:
						var ref = parser_getRef();
						
						if (directive === go_ref) {
								
							if (ref === 'null') 
								ref = null;
							
							if (ref === 'false') 
								ref = false;
							
							if (ref === 'true') 
								ref = true;
								
							if (typeof ref !== 'string') {
								ast_append(current, new Ast_Value(ref));
								continue;
							}
						}
						while (index < length) {
							c = template.charCodeAt(index);
							if (c < 33) {
								index++;
								continue;
							}
							break;
						}
		
						if (c === 40) {
		
							// (
							// function ref
							state = state_arguments;
							index++;
		
							var fn = ast_append(current, new Ast_FunctionRef(current, ref));
		
							current = fn.newArgument();
							continue;
						}
						
						var Ctor = directive === go_ref
							? Ast_SymbolRef
							: Ast_Accessor
						current = ast_append(current, new Ctor(current, ref));
						break;
					case go_objectKey:
						if (parser_skipWhitespace() === 125)
							continue;
						
						
						var key = parser_getRef();
						
						if (parser_skipWhitespace() !== 58) {
							//:
							return util_throw(
								'Object parser. Semicolon expeted', c
							); 
						}
						index++;
						current = current.nextProp(key);
						directive = go_ref;
						continue;
				}
			}
		
			if (current.body == null &&
				current.type === type_Statement) {
				
				return util_throw(
					'Unexpected end of expression', c
				); 
			}
		
			ast_handlePrecedence(ast);
		
			return ast;
		}
		// end:source 5.parser.js
		// source 6.eval.js
		function expression_evaluate(mix, model, ctx, controller) {
		
			var result, ast;
		
			if (null == mix)
				return null;
			
			if ('.' === mix) 
				return model;
			
			if (typeof mix === 'string'){
				ast = cache.hasOwnProperty(mix) === true
					? (cache[mix])
					: (cache[mix] = expression_parse(mix))
					;
			}else{
				ast = mix;
			}
			if (ast == null) 
				return null;
			
			var type = ast.type,
				i, x, length;
			
			if (type_Body === type) {
				var value, prev;
		
				outer: for (i = 0, length = ast.body.length; i < length; i++) {
					x = ast.body[i];
		
					value = expression_evaluate(x, model, ctx, controller);
		
					if (prev == null || prev.join == null) {
						prev = x;
						result = value;
						continue;
					}
					
					if (prev.join === op_LogicalAnd) {
						if (!result) {
							for (; i < length; i++) {
								if (ast.body[i].join === op_LogicalOr) {
									break;
								}
							}
						}else{
							result = value;
						}
					}
		
					if (prev.join === op_LogicalOr) {
						if (result){
							break outer;
						}
						if (value) {
							result = value;
							break outer;
						}
					}
		
					switch (prev.join) {
					case op_Minus:
						result -= value;
						break;
					case op_Plus:
						result += value;
						break;
					case op_Divide:
						result /= value;
						break;
					case op_Multip:
						result *= value;
						break;
					case op_Modulo:
						result %= value;
						break;
					case op_LogicalNotEqual:
						/* jshint eqeqeq: false */
						result = result != value;
						/* jshint eqeqeq: true */
						break;
					case op_LogicalNotEqual_Strict:
						result = result !== value;
						break;
					case op_LogicalEqual:
						/* jshint eqeqeq: false */
						result = result == value;
						/* jshint eqeqeq: true */
						break;
					case op_LogicalEqual_Strict:
						result = result === value;
						break;
					case op_LogicalGreater:
						result = result > value;
						break;
					case op_LogicalGreaterEqual:
						result = result >= value;
						break;
					case op_LogicalLess:
						result = result < value;
						break;
					case op_LogicalLessEqual:
						result = result <= value;
						break;
					}
		
					prev = x;
				}
			}
		
			if (type_Statement === type) {
				result = expression_evaluate(ast.body, model, ctx, controller);
				if (ast.next == null) 
					return result;
				
				return util_resolveRef(ast.next, result);
			}
		
			if (type_Value === type) {
				return ast.body;
			}
			if (type_Array === type) {
				var body = ast.body.body,
					imax = body.length,
					i = -1;
				
				result = new Array(imax);
				while( ++i < imax ){
					result[i] = expression_evaluate(body[i], model, ctx, controller);
				}
				return result;
			}
			if (type_Object === type) {
				result = {};
				var props = ast.props;
				for(var key in props){
					result[key] = expression_evaluate(props[key], model, ctx, controller);
				}
				return result;
			}
		
			if (type_SymbolRef 		=== type ||
				type_FunctionRef 	=== type ||
				type_AccessorExpr 	=== type ||
				type_Accessor 		=== type) {
				return util_resolveRef(ast, model, ctx, controller);
			}
			
			if (type_UnaryPrefix === type) {
				result = expression_evaluate(ast.body, model, ctx, controller);
				switch (ast.prefix) {
				case op_Minus:
					result = -result;
					break;
				case op_LogicalNot:
					result = !result;
					break;
				}
			}
		
			if (type_Ternary === type){
				result = expression_evaluate(ast.body, model, ctx, controller);
				result = expression_evaluate(result ? ast.case1 : ast.case2, model, ctx, controller);
		
			}
		
			return result;
		}
		
		// end:source 6.eval.js
		// source 7.eval_statements.js
		function expression_evaluateStatements(expr, model, ctx, ctr){
					
			var body = expression_parse(expr).body,
				args = [],
				imax = body.length,
				i = -1
				;
			var group = new Ast_Body;
			while( ++i < imax ){
				group.body.push(body[i]);
				if (body[i].join != null) 
					continue;
				
				args.push(expression_evaluate(group, model, ctx, ctr));
				group.body.length = 0;
			}
			return args;
		}
		// end:source 7.eval_statements.js
		// source 8.vars.helper.js
		var  refs_extractVars;
		(function() {
		
			/**
			 * extract symbol references
			 * ~[:user.name + 'px'] -> 'user.name'
			 * ~[:someFn(varName) + user.name] -> ['varName', 'user.name']
			 *
			 * ~[:someFn().user.name] -> {accessor: (Accessor AST function call) , ref: 'user.name'}
			 */
		
		
			refs_extractVars = function(expr, model, ctx, ctr){
				if (typeof expr === 'string') 
					expr = expression_parse(expr);
				
				return _extractVars(expr, model, ctx, ctr);
			};
			
			
			
			function _extractVars(expr, model, ctx, ctr) {
		
				if (expr == null) 
					return null;
				
				var exprType = expr.type,
					refs, x;
				if (type_Body === exprType) {
					
					var body = expr.body,
						imax = body.length,
						i = -1;
					while ( ++i < imax ){
						x = _extractVars(body[i], model, ctx, ctr);
						refs = _append(refs, x);
					}
				}
		
				if (type_SymbolRef === exprType ||
					type_Accessor === exprType ||
					type_AccessorExpr === exprType) {
					
					var path = expr.body,
						next = expr.next,
						nextType;
		
					while (next != null) {
						nextType = next.type;
						if (type_FunctionRef === nextType) {
							return _extractVars(next, model, ctx, ctr);
						}
						if ((type_SymbolRef !== nextType) &&
							(type_Accessor !== nextType) &&
							(type_AccessorExpr !== nextType)) {
							
							log_error('Ast Exception: next should be a symbol/function ref');
							return null;
						}
		
						var prop = nextType === type_AccessorExpr
							? expression_evaluate(next.body, model, ctx, ctr)
							: next.body
							;
						if (typeof prop !== 'string') {
							log_warn('Can`t extract accessor name', path);
							return null;
						}
						path += '.' + prop;
						next = next.next;
					}
		
					return path;
				}
		
		
				switch (exprType) {
					case type_Statement:
					case type_UnaryPrefix:
					case type_Ternary:
						x = _extractVars(expr.body, model, ctx, ctr);
						refs = _append(refs, x);
						break;
				}
				
				// get also from case1 and case2
				if (type_Ternary === exprType) {
					x = _extractVars(ast.case1, model, ctx, ctr);
					refs = _append(refs, x);
		
					x = _extractVars(ast.case2, model, ctx, ctr);
					refs = _append(refs, x);
				}
		
		
				if (type_FunctionRef === exprType) {
					var args = expr.arguments,
						imax = args.length,
						i = -1;
					while ( ++i < imax ){
						x = _extractVars(args[i], model, ctx, ctr);
						refs = _append(refs, x);
					}
					
					x = null;
					var parent = expr;
					outer: while ((parent = parent.parent)) {
						switch (parent.type) {
							case type_SymbolRef:
							case type_Accessor:
							case type_AccessorExpr:
								x = parent.body + (x == null ? '' : '.' + x);
								break;
							case type_Body:
							case type_Statement:
								break outer;
							default:
								x = null;
								break outer;
						}
					}
					
					if (x != null) {
						refs = _append(refs, x);
					}
					
					if (expr.next) {
						x = _extractVars(expr.next, model, ctx, ctr);
						refs = _append(refs, {accessor: _getAccessor(expr), ref: x});
					}
				}
		
				return refs;
			}
			
			function _append(current, x) {
				if (current == null) {
					return x;
				}
		
				if (x == null) {
					return current;
				}
		
				if (!(typeof current === 'object' && current.length != null)) {
					current = [current];
				}
		
				if (!(typeof x === 'object' && x.length != null)) {
					
					if (current.indexOf(x) === -1) {
						current.push(x);
					}
					
					return current;
				}
				
				for (var i = 0, imax = x.length; i < imax; i++) {
					if (current.indexOf(x[i]) === -1) {
						current.push(x[i]);
					}
				}
				
				return current;
		
			}
			
			function _getAccessor(current) {
				
				var parent = current;
				
				outer: while (parent.parent) {
					switch (parent.parent.type) {
						case type_Body:
						case type_Statement:
							break outer;
					}
					parent = parent.parent;
				}
				
				return _copy(parent, current.next);
			}
			
			function _copy(ast, stop) {
				
				if (ast === stop || ast == null) {
					return null;
				}
				
				if (typeof ast !== 'object') {
					return ast;
				}
				
				if (ast.length != null && typeof ast.splice === 'function') {
					
					var arr = [];
					
					for (var i = 0, imax = ast.length; i < imax; i++){
						arr[i] = _copy(ast[i], stop);
					}
					
					return arr;
				}
				
				
				var clone = {};
				for (var key in ast) {
					if (ast[key] == null || key === 'parent') {
						continue;
					}
					clone[key] = _copy(ast[key], stop);
				}
				
				return clone;
			}
		
		}());
		
		// end:source 8.vars.helper.js
	
		expression_eval           = expression_evaluate;
		expression_evalStatements = expression_evaluateStatements;
		ExpressionUtil = {
			'parse': expression_parse,
			
			/**
			 * Expression.eval(expression [, model, cntx, controller]) -> result
			 * - expression (String): Expression, only accessors are supoorted
			 *
			 * All symbol and function references will be looked for in 
			 *
			 * 1. model, or via special accessors:
			 * 		- `$c` controller
			 * 		- `$ctx`
			 * 		- `$a' controllers attributes
			 * 2. scope:
			 * 		controller.scope
			 * 		controller.parent.scope
			 * 		...
			 *
			 * Sample:
			 * '(user.age + 20) / 2'
			 * 'fn(user.age + "!") + x'
			 **/
			'eval': expression_evaluate,
			'varRefs': refs_extractVars,
			
			// Return all values of a comma delimiter expressions
			// like argumets: ' foo, bar, "4,50" ' => [ %fooValue, %barValue, "4,50" ]
			'evalStatements': expression_evaluateStatements
		};
	
	}());
	
	// end:source expression/
	// source dom/
	var Dom;
	
	(function(){
		
		var dom_NODE = 1,
			dom_TEXTNODE = 2,
			dom_FRAGMENT = 3,
			dom_COMPONENT = 4,
			dom_CONTROLLER = 9,
			dom_SET = 10,
			dom_STATEMENT = 15
			;
		
		// source 1.utils.js
		function _appendChild(el){
			var nodes = this.nodes;
			if (nodes == null) {
				this.nodes = [el];
				return;
			}
			
			var length = nodes.length;
			if (length !== 0) {
				var prev = nodes[length - 1];
				if (prev != null) {
					prev.nextSibling = el;
				}
			}
			
			nodes.push(el);
		}
		// end:source 1.utils.js
		// source 2.Node.js
		/**
		 * @name MaskNode
		 * @type {class}
		 * @property {type} [type=1]
		 * @property {object} attr
		 * @property {string} tagName
		 * @property {Array.<IMaskNode>} nodes
		 * @property {IMaskNode} parent
		 * @property {string} expression
		 * @property {function} appendChild
		 * @memberOf mask.Dom
		 */
		var Node = class_create({
			constructor:  function Node(tagName, parent) {
				this.type = Dom.NODE;
				this.tagName = tagName;
				this.parent = parent;
				this.attr = {};	
			},
			__single: null,
			appendChild: _appendChild,
			attr: null,
			expression: null,
			nodes: null,
			parent: null,
			sourceIndex: -1,
			stringify: null,
			tagName: null,
			type: dom_NODE,
		});
		
		// end:source 2.Node.js
		// source 3.TextNode.js
		/**
		 * @name TextNode
		 * @type {class}
		 * @property {type} [type=2]
		 * @property {(string|function)} content
		 * @property {IMaskNode} parent
		 * @memberOf mask.Dom
		 */
		var TextNode = class_create({
			constructor: function(text, parent) {
				this.content = text;
				this.parent = parent;
			},
			type: dom_TEXTNODE,
			content: null,
			parent: null
		});
		
		// end:source 3.TextNode.js
		// source 4.Component.js
		function Component(compoName, parent, controller){
			this.tagName = compoName;
			this.parent = parent;
			this.controller = controller;
			this.attr = {};
		}
		Component.prototype = {
			constructor: Component,
			type: dom_COMPONENT,
			parent: null,
			attr: null,
			controller: null,
			nodes: null,
			components: null,
			model: null,
			modelRef: null
		};
		
		// end:source 4.Component.js
		// source 5.Fragment.js
		var Fragment = class_create({
			type: dom_FRAGMENT,
			nodes: null,
			appendChild: _appendChild,
			source: ''
		});
		// end:source 5.Fragment.js
		
		/**
		 * Dom
		 * @type {object}
		 * @memberOf mask
		 */
		Dom = {
			NODE: dom_NODE,
			TEXTNODE: dom_TEXTNODE,
			FRAGMENT: dom_FRAGMENT,
			COMPONENT: dom_COMPONENT,
			CONTROLLER: dom_CONTROLLER,
			SET: dom_SET,
			STATEMENT: dom_STATEMENT,
		
			Node: Node,
			TextNode: TextNode,
			Fragment: Fragment,
			Component: Component
		};
		/**
		 * @interface
		 * @typedef IMaskNode
		 * @type {class}
		 * @property {number} type
		 */
	}());
	
	// end:source dom/
	// source statements/
	// source ./01.if.js
	(function(){
		
		function getNodes(node, model, ctx, ctr){
			function evaluate(expr){
				return expression_eval(expr, model, ctx, ctr);
			}
			
			if (evaluate(node.expression)) 
				return node.nodes;
			
			while (true) {
				node = node.nextSibling;
				
				if (node == null || node.tagName !== 'else') 
					break;
				
				var expr = node.expression;
				if (expr == null || expr === '' || evaluate(expr)) 
					return node.nodes;
			}
			
			return null;
		}
		
		custom_Statements['if'] = {
			getNodes: getNodes,
			render: function(node, model, ctx, container, ctr, childs){
				
				var nodes = getNodes(node, model, ctx, ctr);
				if (nodes == null) 
					return;
				
				builder_build(nodes, model, ctx, container, ctr, childs);
			}
		};
		
	}());
	
	// end:source ./01.if.js
	// source ./02.for.js
	
	(function(){
		var FOR_OF_ITEM = 'for..of::item',
			FOR_IN_ITEM = 'for..in::item';
			
		custom_Statements['for'] = {
			
			render: function(node, model, ctx, container, ctr, children){
				
				parse_For(node.expression);
				
				var value = expression_eval(__ForDirective[3], model, ctx, ctr);
				if (value == null) 
					return;
				
				build(
					value,
					__ForDirective,
					node.nodes,
					model,
					ctx,
					container,
					ctr,
					children
				);
			},
			
			build: build,
			parseFor: parse_For,
			createForNode: createForItemNode,
			getNodes: getNodes,
			
			getHandler: function(compoName, model){
				return createForItemHandler(compoName, model);
			}
		};
		
		(function(){
			custom_Tags[FOR_OF_ITEM] = createBootstrapCompo(FOR_OF_ITEM);
			custom_Tags[FOR_IN_ITEM] = createBootstrapCompo(FOR_IN_ITEM);
			
			function createBootstrapCompo(name) {
				function For_Item(){}
				For_Item.prototype = {
					meta: {
						serializeScope: true
					},
					serializeScope: for_proto_serializeScope,
					type: Dom.COMPONENT,
					compoName: name,
					renderEnd: handler_proto_renderEnd,
					dispose: handler_proto_dispose
				};
				return For_Item;
			}
		}());
		
		
		function build(value, For, nodes, model, ctx, container, ctr, childs) {
			
			builder_build(
				getNodes(nodes, value, For[0], For[1], For[2], For[3]),
				model,
				ctx,
				container,
				ctr,
				childs
			);
		}
		
		function getNodes(nodes, value, prop1, prop2, type, expr) {
				
			if ('of' === type) {
				if (is_Array(value) === false) {
					log_error('<ForStatement> Value is not enumerable', value);
					return null;
				}
				return loop_Array(nodes, value, prop1, prop2, expr);
			}
			
			if ('in' === type) {
				if (typeof value !== 'object') {
					log_warn('<ForStatement> Value is not an object', value);
					return null;
				}
				if (is_Array(value)) 
					log_warn('<ForStatement> Consider to use `for..of` for Arrays');
				
				return loop_Object(nodes, value, prop1, prop2, expr);
			}
		}
		
		function loop_Array(template, arr, prop1, prop2, expr){
			
			var i = -1,
				imax = arr.length,
				nodes = new Array(imax),
				scope;
			
			while ( ++i < imax ) {
				scope = {};
				scope[prop1] = arr[i];
				
				if (prop2) 
					scope[prop2] = i;
				
				nodes[i] = createForItemNode(
					FOR_OF_ITEM
					, template
					, scope
					, i
					, prop1
					, expr
				);
			}
			
			return nodes;
		}
		
		function loop_Object(template, obj, prop1, prop2, expr){
			var nodes = [],
				i = 0,
				scope, key, value;
			
			for (key in obj) {
				value = obj[key];
				scope = {};
				scope[prop1] = key;
				
				if (prop2) 
					scope[prop2] = value;
				
				nodes[i++] = createForItemNode(
					FOR_IN_ITEM
					, template
					, scope
					, key
					, prop2
					, expr
				);
			}
			return nodes;
		}
		
		function createForItemNode(name, nodes, scope, key, propVal, expr) {
			return {
				type: Dom.COMPONENT,
				tagName: name,
				nodes: nodes,
				controller: createForItemHandler(name, scope, key, propVal, expr)
			};
		}
		function createForItemHandler(name, scope, key, propVal, expr) {
			return {
				meta: {
					serializeScope: true,
				},
				compoName: name,
				scope: scope,
				elements: null,
				
				propVal: propVal,
				key: key,
				expression: expr,
				
				renderEnd: handler_proto_renderEnd,
				dispose: handler_proto_dispose,
				serializeScope: for_proto_serializeScope
			};
		}
		
		function handler_proto_renderEnd(elements) {
			this.elements = elements;
		}
		function handler_proto_dispose() {
			if (this.elements) 
				this.elements.length = 0;
		}
		function for_proto_serializeScope(scope, model) {
			var ctr = this,
				expr = ctr.expression,
				key = ctr.key,
				propVal = ctr.propVal;
			
		
			var val = scope[propVal];
			if (val != null && typeof val === 'object') 
				scope[propVal] = '$ref:(' + expr + ')."' + key + '"';
			
			return scope;
		}
	
		
		var __ForDirective = [ 'prop1', 'prop2', 'in|of', 'expression' ],
			i_PROP_1 = 0,
			i_PROP_2 = 1,
			i_TYPE = 2,
			i_EXPR = 3,
			
			state_prop = 1,
			state_multiprop = 2,
			state_loopType = 3
			;
			
		var template,
			index,
			length
			;
		
		function parse_For(expr) {
			// /([\w_$]+)((\s*,\s*([\w_$]+)\s*\))|(\s*\))|(\s+))(of|in)\s+([\w_$\.]+)/
			
			template = expr;
			length = expr.length;
			index = 0;
		
			var prop1,
				prop2,
				loopType,
				hasBrackets,
				c
				;
				
			c = parser_skipWhitespace();
			if (c === 40) {
				// (
				hasBrackets = true;
				index++;
				parser_skipWhitespace();
			}
			
			prop1 = parser_getVarDeclaration();
			
			c = parser_skipWhitespace();
			if (c === 44) {
				//,
				
				if (hasBrackets !== true) {
					return throw_('Parenthese must be used in multiple var declarion');
				}
				
				index++;
				parser_skipWhitespace();
				prop2 = parser_getVarDeclaration();
			}
			
			if (hasBrackets) {
				c = parser_skipWhitespace();
				
				if (c !== 41) 
					return throw_('Closing parenthese expected');
				
				index++;
			}
			
			c = parser_skipWhitespace();
				
			var loopType;
			
			if (c === 105 && template.charCodeAt(++index) === 110) {
				// i n
				loopType = 'in';
			}
	
			if (c === 111 && template.charCodeAt(++index) === 102) {
				// o f
				loopType = 'of';
			}
			
			if (loopType == null) {
				return throw_('Invalid FOR statement. (in|of) expected');
			}
			
			__ForDirective[0] = prop1;
			__ForDirective[1] = prop2;
			__ForDirective[2] = loopType;
			__ForDirective[3] = template.substring(++index);
			
			
			return __ForDirective;
		}
		
		function parser_skipWhitespace(){
			var c;
			for(; index < length; index++ ){
				c = template.charCodeAt(index);
				if (c < 33) 
					continue;
				
				return c;
			}
			
			return -1;
		}
		
		function parser_getVarDeclaration(){
			var start = index,
				var_, c;
				
			for (; index < length; index++) {
					
				c = template.charCodeAt(index);
				
				if (c > 48 && c < 57) {
					// 0-9
					if (start === index)
						return throw_('Variable name begins with a digit');
					
					continue;
				}
				
				if (
					(c === 36) || // $
					(c === 95) || // _ 
					(c >= 97 && c <= 122) || // a-z
					(c >= 65 && c <= 90)  // A-Z
					) {
					
					continue;
				}
				
				break;
			}
			
			if (start === index) 
				return throw_('Variable declaration expected');
			
			return template.substring(start, index);
		}
		
		function throw_(message) {
			throw new Error( '<ForStatement parser> '
				+ message
				+ ' `'
				+ template.substring(index, 20)
				+ '`'
			);
		}
		
	}());
	
	
	// end:source ./02.for.js
	// source ./03.each.js
	(function(){
	
		custom_Statements['each'] = {		
			render: function(node, model, ctx, container, ctr, children){
				
				var array = expression_eval(node.expression, model, ctx, ctr);
				if (array == null) 
					return;
				
				builder_build(
					getNodes(node, array)
					, array
					, ctx
					, container
					, ctr
					, children
				);
			}
		};
		
		function getNodes(node, array){
			var imax = array.length,
				nodes = new Array(imax),
				template = node.nodes,
				expression = node.expression,
				exprPrefix = expression === '.'
					? '."'
					: '(' + node.expression + ')."',
				i = 0;
			for(; i < imax; i++){
				nodes[i] = createEachNode(template, array[i], exprPrefix, i);
			}
			return nodes;
		}
		function createEachNode(nodes, model, exprPrefix, i){
			return {
				type: Dom.COMPONENT,
				tagName: 'each::item',
				nodes: nodes,
				controller: createEachItemHandler(model, i, exprPrefix)
			};
		}
		function createEachItemHandler(model, i, exprPrefix) {
			return {
				compoName: 'each::item',
				model: model,
				scope: {
					index: i
				},
				modelRef: exprPrefix + i + '"',
				attr: null,
				meta: null
			};
		}
	}());
	// end:source ./03.each.js
	// source ./04.with.js
	custom_Statements['with'] = {
		render: function(node, model, ctx, el, ctr, elements){
			var obj = expression_eval(
				node.expression
				, model
				, ctx
				, ctr
			);
			builder_build(
				node.nodes
				, obj
				, ctx
				, el
				, ctr
				, elements
			);
		}
	};
	// end:source ./04.with.js
	// source ./05.switch.js
	(function(){
		custom_Statements['switch'] = {
			render: function(node, model, ctx, el, ctr, elements){
				
				var value = expression_eval(node.expression, model, ctx, ctr),
					nodes = getNodes(value, node.nodes, model, ctx, ctr);
				if (nodes == null) 
					return;
							
				builder_build(nodes, model, ctx, el, ctr, elements);
			},
			
			getNodes: getNodes
		};	
		
		
		function getNodes(value, nodes, model, ctx, ctr) {
			if (nodes == null) 
				return null;
			
			var imax = nodes.length,
				i = -1,
				
				child, expr,
				case_, default_;
				
			while ( ++i < imax ){
				child = nodes[i];
				
				if (child.tagName === 'default') {
					default_ = child;
					continue;
				}
				
				if (child.tagName !== 'case') {
					log_warn('<mask:switch> Case expected', child.tagName);
					continue;
				}
				expr = child.expression;
				if (!expr) {
					log_warn('<mask:switch:case> Expression expected');
					continue;
				}
				
				/* jshint eqeqeq: false */
				if (expression_eval(expr, model, ctx, ctr) == value) {
					/* jshint eqeqeq: true */
					case_ = child;
					break;
				}
			}
			
			if (case_ == null) 
				case_ = default_;
			
			return case_ != null
				? case_.nodes
				: null
				;
		}
		
	}());
		
	
	// end:source ./05.switch.js
	// source ./09.visible.js
	(function(){
		custom_Statements['visible'] = {
			toggle: toggle,
			render: function(node, model, ctx, container, ctr, children){
				var els = [];
				builder_build(node.nodes, model, ctx, container, ctr, els);
				arr_pushMany(children, els)
				
				var visible = expression_eval(node.expression, model, ctx, ctr);
				toggle(els, visible);
			}
		};
		function toggle(els, visible){
			for(var i = 0; i < els.length; i++){
				els[i].style.display = visible ? '' : 'none';
			}
		}
	}());
	
	// end:source ./09.visible.js
	// source ./10.repeat.js
	(function(){
		custom_Statements['repeat'] = {
			render: function(node, model, ctx, container, ctr, children){
				var run = expression_eval,
					str = node.expression,
					repeat = str.split('..'),
					index = + run(repeat[0] || '', model, ctx, ctr),
					length = + run(repeat[1] || '', model, ctx, ctr);
	
				if (index !== index || length !== length) {
					log_error('Repeat attribute(from..to) invalid', str);
					return;
				}
	
				var nodes = node.nodes;
				var arr = [];
				var i = -1;
				while (++i < length) {
					arr[i] = compo_init(
						'repeat::item',
						nodes,
						model,
						i,
						container,
						ctr
					);
				}
	
				var els = [];
				builder_build(arr, model, ctx, container, ctr, els);
				arr_pushMany(children, els);
			}
		};
	
		function compo_init(name, nodes, model, index, container, parent) {		
			return {
				type: Dom.COMPONENT,
				compoName: name,
				attr: {},
				nodes: nodes,
				model: model,
				container: container,
				parent: parent,
				index: index,
				scope: {
					index: index
				}
			};
		}
	}());
	
	// end:source ./10.repeat.js
	// end:source statements/
	// source formatter/stringify_stream
	var mask_stringify,
		mask_stringifyAttr;
	(function () {
		
		var defaultOptions = {
			minify: true,
			indent: 4,
			indentChar: ' '
		};
		
		/**
		 * Serialize Mask AST to the Mask string (@analog to `JSON.stringify`)
		 * @param {MaskNode} node - MaskNode
		 * @param {(object|number)} [opts] - Indent count option or an object with options
		 * @param {number} [opts.indent=0] - Indent count, `0` for minimization
		 * @param {bool} [opts.minify=true] 
		 * @param {bool} [opts.minimizeAttributes=true] - Remove quotes when possible
		 * @returns {string}
		 * @memberOf mask
		 * @method stringify
		 */
		mask_stringify = function(input, opts) {
			if (input == null) 
				return '';
			
			if (typeof input === 'string') 
				input = parser_parse(input);
			
			if (opts == null) {
				opts = obj_create(defaultOptions);
			} else  if (typeof opts === 'number'){
				var indent = opts;
				opts = obj_create(defaultOptions);
				opts.indent = indent;
				opts.minify = indent === 0;
			} else{
				opts = obj_extendDefaults(opts, defaultOptions);
				if (opts.indent > 0) {
					opts.minify = false;
				}
				if (opts.minify === true) {
					opts.indent = 0;
				}
			}
			
			return new Stream(input, opts).toString();
		};
		
		mask_stringifyAttr = function(attr){
			var str = '',
				key, x, part;
			for (key in attr) {
				x = getString(attr[key]);
				
				if (str.length !== 0) {
					str += ' ';
				}
				str += key;
				
				if (x !== key) {
					str += "=" + wrapString(x);
				} 
			}
			return str;
		};
		
		var Stream = class_create({
			string: '',
			indent: 0,
			indentStr: '',
			minify: false,
			opts: null,
			ast : null,
			constructor: function(ast, opts) {
				this.opts = opts;
				this.ast  = ast;
				this.minify = opts.minify;
				this.indentStr = doindent(opts.indent, opts.indentChar);
			},
			toString: function(){
				this.process(this.ast, this);
				return this.string;
			},
			process: function(mix){
				if (mix.type === Dom.FRAGMENT) {
					mix = mix.nodes;
				}
				if (is_ArrayLike(mix)) {
					var imax = mix.length,
						i = -1;
					while ( ++i < imax ){
						if (i !== 0) {
							this.newline();
						}
						this.processNode(mix[i]);
					}
					return;
				}
				this.processNode(mix);
			},
			processNode: function(node) {
				var stream = this;
				if (is_Function(node.stringify)) {
					var str = node.stringify(stream);
					if (str != null) {
						stream.write(str);
					}
					return;
				}
				if (is_String(node.content)) {
					stream.write(wrapString(node.content));
					return;
				}
				if (is_Function(node.content)){
					stream.write(wrapString(node.content()));
					return;
				}
				
				this.processHead(node);
				
				if (isEmpty(node)) {
					stream.print(';');
					return;
				}
				if (isSingle(node)) {
					stream.openBlock('>');
					stream.processNode(getSingle(node));
					stream.closeBlock(null);
					return;
				}
				
				stream.openBlock('{');
				stream.process(node.nodes);
				stream.closeBlock('}');
			},
			processHead: function(node) {
				var stream = this,
					str = '',
					id, cls, expr
					;
				
				var attr = node.attr;
				if (attr != null) {
					id  = attr.id;
					cls = attr['class'];
					if (typeof id === 'function') {
						id = id();
					}
					if (id != null && id.indexOf(' ') !== -1) {
						id = null;
					}
					if (id != null) {
						str += '#' + id;
					}
					if (typeof cls === 'function') {
						cls = cls();
					}
					if (cls != null) {
						str += '.' + cls.trim().replace(/\s+/g, '.');
					}
					
					for(var key in attr) {
						if (key === 'id' && id != null) {
							continue;
						}
						if (key === 'class' && cls != null) {
							continue;
						}
						var val = attr[key];
						if (val == null) {
							continue;
						}
						
						str += ' ' + key;
						if (val === key) {
							continue;
						}
						
						if (is_Function(val)) {
							val = val();
						}
						if (is_String(val)) {
							if (stream.minify === false || /[^\w_$\-\.]/.test(val)){
								val = wrapString(val);
							}
						}
						
						str += '=' + val;
					}
				}
				
				if (isTagNameOptional(node, id, cls) === false) {
					str = node.tagName + str;
				}
				
				var expr = node.expression;
				if (expr != null) {
					if (typeof expr === 'function') {
						expr = expr();
					}
					if (stream.minify === false) {
						str += ' ';
					}
					str += '(' + expr + ')';
				}
				
				if (this.minify === false) {
					str = doindent(this.indent, this.indentStr) + str;
				}
				stream.print(str);
			},
			
			newline: function(){
				if (this.minify === false) {
					this.string += '\n';
				}
			},
			openBlock: function(c){
				this.indent++;
				if (this.minify === false) {
					this.string += ' ' + c + '\n';
					return;
				}
				this.string += c;
			},
			closeBlock: function(c){
				this.indent--;
				if (c != null) {
					this.newline();
					this.write(c);
				}
			},
			write: function(str){
				if (this.minify === true) {
					this.string += str;
					return;
				}
				var prfx = doindent(this.indent, this.indentStr);
				this.string += str.replace(/^/gm, prfx);
			},
			print: function(str){
				this.string += str;
			}
		});
		
		function doindent(count, c) {
			var output = '';
			while (count--) {
				output += c;
			}
			return output;
		}
	
		function isEmpty(node) {
			return node.nodes == null || (is_ArrayLike(node.nodes) && node.nodes.length === 0);
		}
	
		function isSingle(node) {
			var arr = node.nodes;
			if (arr == null) {
				return true;
			}
			var isArray = typeof arr.length === 'number';
			if (isArray && arr.length > 1) {
				return false;
			}
			var x = isArray ? arr[0] : arr;
			return x.stringify == null;
		}
		function isTagNameOptional(node, id, cls) {
			if (id == null && cls == null) {
				return false;
			}
			var tagName = node.tagName;
			if (tagName === 'div') {
				return true;
			}
			return false;
		}
		function getSingle(node) {
			if (is_ArrayLike(node.nodes)) 
				return node.nodes[0];
			
			return node.nodes;
		}
	
		function wrapString(str) {
			if (str.indexOf("'") === -1) 
				return "'" + str + "'";
			
			if (str.indexOf('"') === -1) 
				return '"' + str + '"';
			
			return '"' + str.replace(/"/g, '\\"') + '"';
		}
	
		function getString(mix) {
			return is_Function(mix) ? mix() : mix;
		}
		
	}());
	
	// end:source formatter/stringify_stream
	// source feature/	
	// source run
	var mask_run;
	(function(){
		/**
		 * Find all `<script type="text/mask" data-run='true'>` blocks in the page
		 * and render each block into the parents container.
		 *
		 * The function is automatically renders the blocks
		 * `<script type="text/mask" data-run='auto'>` on `DOMContentLoaded` event
		 * @returns {object} Root component
		 * @memberOf mask
		 * @method run
		*/
		mask_run = function(){
			if (_state === 0) {
				_state = _state_All
			}
			var args = _Array_slice.call(arguments),
				model, ctx, el, Ctor;
			
			var imax = args.length,
				i = -1,
				mix;
			while ( ++i < imax ) {
				mix = args[i];
				if (mix instanceof Node) {
					el = mix;
					continue;
				}
				if (is_Function(mix)) {
					Ctor = mix;
					continue;
				}
				if (is_Object(mix)) {
					if (model == null) {
						model = mix;
						continue;
					}
					ctx = mix;
				}
			}
			
			if (el == null) 
				el = document.body;		
			if (Ctor == null)
				Ctor = Compo;
			if (model == null) {
				model = {};
			}
			
			var ctr = new Ctor(null, model, ctx, el);
			return _run(model, ctx, el, ctr);
		};
		
		function _run (model, ctx, container, ctr) {
			ctr.ID = ++builder_componentID;
			
			var scripts = _Array_slice.call(document.getElementsByTagName('script')),
				script = null,
				found = false,
				ready = false,
				await = 0,
				imax = scripts.length,
				i = -1;
			while( ++i < imax ){
				script = scripts[i];
				
				var scriptType = script.getAttribute('type');
				if (scriptType !== 'text/mask' && scriptType !== 'text/x-mask') 
					continue;
				
				var dataRun = script.getAttribute('data-run');
				if (dataRun == null) {
					continue;
				}
				if (dataRun === 'auto') {
					if (isCurrent(_state_Auto) === false) {
						continue;
					}
				}
				if (dataRun === 'true') { 
					if (isCurrent(_state_Manual) === false) {
						continue;
					}
				}
				
				found = true;
				var ctx_ = new builder_Ctx(ctx);
				var fragment = builder_build(
					parser_parse(script.textContent), model, ctx_, null, ctr
				);
				if (ctx_.async === true) {
					await++;
					ctx_.done(_insertDelegate(fragment, script, resumer));
					continue;
				}
				script.parentNode.insertBefore(fragment, script);
			}
			
			if (found === false) {
				if (_state === _state_Auto) {
					return null;
				}
				log_warn("No blocks found: <script type='text/mask' data-run='true'>...</script>");
			}
			
			ready = true;		
			if (await === 0) {
				flush();
			}
			function resumer(){
				if (--await === 0 && ready)
					flush();
			}
			function flush() {
				if (is_Function(ctr.renderEnd)) {
					ctr.renderEnd(container, model);
				}
				Compo.signal.emitIn(ctr, 'domInsert');
			}
			
			return ctr;
		}
		
		function _insertDelegate(fragment, script, done) {
			return function(){
				script.parentNode.insertBefore(fragment, script);
				done();
			};
		}
		
		if (document != null && document.addEventListener) {
			document.addEventListener("DOMContentLoaded", function(event) {
				if (_state !== 0)  return;
				var _app;
				_state = _state_Auto;			
				_app = mask_run();
				_state = _state_Manual;
				
				if (_app == null) return;
				if (global.app == null) {
					global.app = _app;
					return;
				}
				var source = _app.components
				if (source == null || source.length === 0) {
					return;
				}
				var target = global.app.components
				if (target == null || target.length === 0) {
					global.app.components = source;
					return;
				}
				target.push.apply(target, source);
			});
		}
		
		var _state_Auto = 2,
			_state_Manual = 4,
			_state_All = _state_Auto | _state_Manual,
			_state = 0;
		
		function isCurrent(state) {
			return (_state & state) === state;
		}
	}());
	// end:source run
	// source merge
	var mask_merge;
	(function(){
		/**
		 * Join two Mask templates or DOM trees
		 * @param {(string|MaskNode)} a - first template
		 * @param {(string|MaskNode)} b - second template
		 * @param {(MaskNode|Component)} [owner]
		 * @param {object} [opts]
		 * @param {bool} [opts.extending=false] - Clean the merged tree from all unused placeholders
		 * @returns {MaskNode} New joined Mask DOM tree
		 * @memberOf mask
		 * @method merge
		 */
		mask_merge = function(a, b, owner, opts){
			if (typeof a === 'string') {
				a = parser_parse(a);
			}
			if (typeof b === 'string') {
				b = parser_parse(b);
			}
			if (a == null || (is_ArrayLike(a) && a.length === 0)) {
				return b;
			}
			
			var placeholders = _resolvePlaceholders(b, b, new Placeholders(null, b, opts));
			var out = _merge(a, placeholders, owner);
			var extra = placeholders.$extra;
			if (extra != null && extra.length !== 0) {
				if (is_Array(out)) {
					return out.concat(extra);
				}
				return [ out ].concat(extra);
			}
			return out;
		};
		
		var tag_ELSE = '@else',
			tag_IF   = '@if',
			tag_EACH = '@each',
			tag_PLACEHOLDER = '@placeholder',
			
			dom_NODE      = Dom.NODE,
			dom_TEXTNODE  = Dom.TEXTNODE,
			dom_FRAGMENT  = Dom.FRAGMENT,
			dom_STATEMENT = Dom.STATEMENT,
			dom_COMPONENT = Dom.COMPONENT
			;
		
		function _merge(node, placeholders, tmplNode, clonedParent){
			if (node == null) 
				return null;
			
			var fn;
			if (is_Array(node)) {
				fn = _mergeArray;
			} else {
				switch(node.type){
					case dom_TEXTNODE:
						fn = _cloneTextNode;
						break;
					case dom_NODE:
					case dom_STATEMENT:
						fn = _mergeNode;
						break;
					case dom_FRAGMENT:
						fn = _mergeFragment;
						break;
					case dom_COMPONENT:
						fn = _mergeComponent;
						break;
				}
			}
			if (fn !== void 0) {
				return fn(node, placeholders, tmplNode, clonedParent);
			}
			log_warn('Uknown type', node.type);
			return null;
		}
		function _mergeArray(nodes, placeholders, tmplNode, clonedParent){
			if (nodes == null) {
				return null;
			}
			var fragment = [],
				imax = nodes.length,
				i = -1,
				x, node;
			while( ++i < imax ) {
				node = nodes[i];
				
				if (node.tagName === tag_ELSE) {
					// check previous 
					if (x != null)
						continue;
					
					if (node.expression && !eval_(node.expression, placeholders, tmplNode)) 
						continue;
					
					x = _merge(nodes[i].nodes, placeholders, tmplNode, clonedParent)
				}
				else {
					x = _merge(node, placeholders, tmplNode, clonedParent);
				}
				
				appendAny(fragment, x);
			}
			return fragment;
		}
		function _mergeFragment(frag, placeholders, tmplNode, clonedParent) {
			var fragment = new Dom.Fragment;
			fragment.parent = clonedParent;
			fragment.nodes = _mergeArray(frag.nodes, placeholders, tmplNode, fragment);
			return fragment;
		}
		function _mergeComponent(node, placeholders, tmplNode, clonedParent) {
			if (node.nodes == null) 
				return node;
			
			var cloned = new Dom.Component;
			obj_extend(cloned, node);
			cloned.nodes = _merge(cloned.nodes, placeholders, tmplNode, clonedParent);
			return cloned;
		}
		function _mergeNode(node, placeholders, tmplNode, clonedParent){
			var tagName = node.tagName;
			if (tagName.charCodeAt(0) !== 64) {
				// @
				return _cloneNode(node, placeholders, tmplNode, clonedParent);
			}
			
			var id = node.attr.id;
			if (tagName === tag_PLACEHOLDER && id == null) {
				if (tmplNode != null) {
					var tagName_ = tmplNode.tagName;
					if (tagName_ != null && tmplNode.tagName.charCodeAt(0) === 64 /*@*/) {
						return tmplNode.nodes
					}
				}
				id = '$root';
				placeholders.$extra = null;
			}
			
			if (tag_EACH === tagName) {
				var arr = placeholders.$getNode(node.expression),
					x;
				if (arr == null) {
					if (node.attr.optional == null) {
						error_withNode('No template node: @' + node.expression, node);
					}
					return null;
				}
				if (is_Array(arr) === false) {
					x = arr;
					return _merge(
						node.nodes
						, _resolvePlaceholders(x.nodes, x.nodes, new Placeholders(placeholders))
						, x
						, clonedParent
					);
				}
				var fragment = new Dom.Fragment,
					imax = arr.length,
					i = -1;
				while ( ++i < imax ){
					x = arr[i];
					appendAny(fragment, _merge(
						node.nodes
						, _resolvePlaceholders(x.nodes, x.nodes, new Placeholders(placeholders))
						, x
						, clonedParent
					));
				}
				return fragment;
			}
			if (tag_IF === tagName) {
				var val = eval_(node.expression, placeholders, tmplNode);
				return val
					? _merge(node.nodes, placeholders, tmplNode, clonedParent)
					: null
					;
			}
			
			if (id == null) 
				id = tagName.substring(1);
			
			var content = placeholders.$getNode(id, node.expression);
			if (content == null) {
				if (placeholders.opts.extending === true) {
					return node;
				}
				return null;
			}
			
			if (content.parent) 
				_modifyParents(clonedParent, content.parent);
			
			
			var contentNodes = content.nodes,
				wrapperNode;
			if (node.attr.as !== void 0) {
				var tagName_ = node.attr.as;
				wrapperNode = {
					type: dom_NODE,
					tagName: tagName_,
					attr: _mergeAttr(node.attr, content.attr, placeholders, tmplNode),
					parent: clonedParent,
					nodes: contentNodes
				};
				wrapperNode.attr.as = null;
			}
			
			if (node.nodes == null) {
				return _merge((wrapperNode || contentNodes), placeholders, tmplNode, clonedParent);
			}
			
			var nodes =  _merge(
				node.nodes
				, _resolvePlaceholders(contentNodes, contentNodes, new Placeholders(placeholders))
				, content
				, wrapperNode || clonedParent
			);
			if (wrapperNode != null) {
				wrapperNode.nodes = nodes;
				return wrapperNode;
			}
			return nodes;
		}
		function _mergeAttr(a, b, placeholders, tmplNode){
			if (a == null || b == null) 
				return a || b;
			
			var out = interpolate_obj_(a, placeholders, tmplNode);
			for (var key in b){
				out[key] = interpolate_str_(b[key], placeholders, tmplNode);
			}
			return out;
		}
		
		function _cloneNode(node, placeholders, tmplNode, clonedParent){
			var tagName = node.tagName || node.compoName;
			switch (tagName) {
				case ':template':
					var id = interpolate_str_(node.attr.id, placeholders, tmplNode);
					Mask.templates.register(id, node.nodes);
					return null;
				case ':import':
					var id = interpolate_str_(node.attr.id, placeholders, tmplNode),
						nodes = Mask.templates.resolve(node, id);
					return _merge(nodes, placeholders, tmplNode, clonedParent);
				case 'define':
				case 'function':
				case 'var':
				case 'import':
				case 'script':
				case 'style':
				case 'slot':
				case 'event':
					return node;
				case 'include':
					var tagName = node.attr.id;
					if (tagName == null) {
						tagName = attr_first(node.attr);
					}
					tagName = interpolate_str_(tagName, placeholders, tmplNode);
					
					var handler = customTag_get(tagName, tmplNode);
					if (handler != null) {
						var proto = handler.prototype;
						var tmpl  = proto.template || proto.nodes;
						
						placeholders = _resolvePlaceholders(
							node.nodes,
							node.nodes,
							new Placeholders(placeholders, node.nodes)
						);
						return _merge(tmpl, placeholders, tmplNode, clonedParent);
					}
					break;
				default:
					var handler = customTag_get(tagName, tmplNode);
					if (handler != null) {
						var proto = handler.prototype;
						if (proto && proto.meta != null && proto.meta.template === 'merge') {
							return node;
						}
					}
					break;
			}
			
			var outnode = {
				type: node.type,
				tagName: tagName,
				attr: interpolate_obj_(node.attr, placeholders, tmplNode),
				expression: interpolate_str_(node.expression, placeholders, tmplNode),
				controller: node.controller,
				parent: clonedParent,
				nodes: null
			};
			if (node.nodes) 
				outnode.nodes = _merge(node.nodes, placeholders, tmplNode, outnode);
			
			return outnode;
		}
		function _cloneTextNode(node, placeholders, tmplNode, clonedParent){
			return {
				type: node.type,
				content: interpolate_str_(node.content, placeholders, tmplNode),
				parent: clonedParent
			};
		}
		function interpolate_obj_(obj, placeholders, node){
			var clone = _Object_create(obj),
				x;
			for(var key in clone){
				x = clone[key];
				if (x == null) 
					continue;
				
				clone[key] = interpolate_str_(x, placeholders, node);
			}
			return clone;
		}
		function interpolate_str_(mix, placeholders, node){
			var index = -1,
				isFn = false,
				str = mix;
				
			if (typeof mix === 'function') {
				isFn = true;
				str = mix();
			}
			if (typeof str !== 'string' || (index = str.indexOf('@')) === -1) 
				return mix;
			
			var result = str.substring(0, index),
				length = str.length,
				isBlockEntry = str.charCodeAt(index + 1) === 91, // [ 
				last = -1,
				c;
			
			while (index < length) {
				// interpolation
				last = index;
				if (isBlockEntry === true) {
					index = str.indexOf(']', last);
					if (index === -1) 
						index = length;
					last += 2;
				}
				else {
					while (index < length) {
						c = str.charCodeAt(++index);
						if (c === 36 || c === 95 || c === 46) {
							// $ _ .
							continue;
						}
						if ((48 <= c && c <= 57) ||		// 0-9
							(65 <= c && c <= 90) ||		// A-Z
							(97 <= c && c <= 122)) {	// a-z
							continue;
						}
						break;
					}
				}
				
				var expr = str.substring(last, index),
					fn = isBlockEntry ? eval_ : interpolate_,
					x = fn(expr, placeholders, node);
						
				if (x != null) {
					result += x;
				}
				else if (placeholders.opts.extending === true) {
					result += isBlockEntry ? ('@[' + expr + ']') : expr
				}
				
				// tail
				last = isBlockEntry ? (index + 1) : index;
				index = str.indexOf('@', index);
				if (index === -1) 
					index = length;
				
				result += str.substring(last, index);
			}
			
			return isFn
				? parser_ensureTemplateFunction(result)
				: result
				;
		}
		function interpolate_(path, placeholders, node) {
			var index = path.indexOf('.');
			if (index === -1) {
				log_warn('Merge templates. Accessing node', path);
				return null;
			}
			var tagName = path.substring(0, index),
				id = tagName.substring(1),
				property = path.substring(index + 1),
				obj = null;
			
			if (node != null) {
				if (tagName === '@attr') {
					return interpolate_getAttr_(node, placeholders, property);
				}
				else if (tagName === '@counter') {
					return interpolate_getCounter_(property);
				}
				else if (tagName === node.tagName) 
					obj = node;
			}
			
			if (obj == null) 
				obj = placeholders.$getNode(id);
			
			if (obj == null) {
				//- log_error('Merge templates. Node not found', tagName);
				return null;
			}
			return obj_getProperty(obj, property);
		}
		
		function interpolate_getAttr_(node, placeholders, prop) {
			var x = node.attr && node.attr[prop];
			var el = placeholders;
			while (x == null && el != null) {
				x = el.attr && el.attr[prop];
				el = el.parent;
			}
			return x;
		}
		
		var interpolate_getCounter_;
		(function(){
			var _counters = {};
			interpolate_getCounter_ = function(prop) {
				var i = _counters[prop] || 0;
				return (_counters[prop] = ++i);
			};
		}());
		
		function appendAny(node, mix){
			if (mix == null) 
				return;
			if (typeof mix.concat === 'function') {
				var imax = mix.length;
				for (var i = 0; i < imax; i++) {
					appendAny(node, mix[i]);
				}
				return;
			}
			if (mix.type === dom_FRAGMENT) {
				appendAny(node, mix.nodes);
				return;
			}
			
			if (typeof node.appendChild === 'function') {
				node.appendChild(mix);
				return;
			}
			
			var l = node.length;
			if (l > 0) {
				var prev = node[l - 1];
				prev.nextSibling = mix;
			}
			node.push(mix);
		}
		
		var RESERVED = ' else placeholder each attr if parent scope'
		function _resolvePlaceholders(root, node, placeholders) {
			if (node == null) 
				return placeholders;
			
			if (is_Array(node)) {
				var imax = node.length,
					i = -1;
				while( ++i < imax ){
					_resolvePlaceholders(node === root ? node[i] : root, node[i], placeholders);
				}
				return placeholders;
			}
			
			var type = node.type;
			if (type === dom_TEXTNODE) 
				return placeholders;
			
			if (type === dom_NODE) {
				var tagName = node.tagName;
				if (tagName != null && tagName.charCodeAt(0) === 64) {
					// @
					placeholders.$count++;
					var id = tagName.substring(1);
					// if DEBUG
					if (RESERVED.indexOf(' ' + id + ' ') !== -1) 
						log_error('MaskMerge. Reserved Name', id);
					// endif
					var x = {
						tagName: node.tagName,
						parent: _getParentModifiers(root, node),
						nodes: node.nodes,
						attr: node.attr,
						expression: node.expression
					};
					if (placeholders[id] == null) {
						placeholders[id] = x;
					} else {
						var current = placeholders[id];
						if (is_Array(current)) {
							current.push(x);
						}
						else {
							placeholders[id] = [current, x];
						}
					}
					return placeholders;
				}
			}
			
			var count = placeholders.$count;
			var out = _resolvePlaceholders(root, node.nodes, placeholders);
			if (root === node && count === placeholders.$count) {
				placeholders.$extra.push(root);
			}
			return out;
		}
		function _getParentModifiers(root, node) {
			if (node === root) 
				return null;
			
			var current, parents, parent = node.parent;
			while (true) {
				if (parent == null) 
					break;
				if (parent === root && root.type !== dom_NODE)
					break;
				
				var p = {
						type: parent.type,
						tagName: parent.tagName,
						attr: parent.attr,
						controller: parent.controller,
						expression: parent.expression,
						nodes: null,
						parent: null
					};
	
				if (parents == null) {
					current = parents = p;
				} else {
					current.parent = p;
					current = p;
				}
				parent = parent.parent;
			}
			return parents;
		}
		function _modifyParents(clonedParent, parents){
			var nodeParent = clonedParent, modParent = parents;
			while(nodeParent != null && modParent != null){
				
				if (modParent.tagName) 
					nodeParent.tagName = modParent.tagName;
				
				if (modParent.expression) 
					nodeParent.expression = modParent.expression;
				
				for(var key in modParent.attr){
					nodeParent.attr[key] = modParent.attr[key];
				}
				
				nodeParent = nodeParent.parent;
				modParent = modParent.parent;
			}
		}
		
		function eval_(expr, placeholders, tmplNode) {
			if (tmplNode != null) {
				placeholders.attr = tmplNode.attr;
			}
			return expression_eval(expr, placeholders, null, placeholders);
		}
		function Placeholders(parent, nodes, opts){
			var $root = null;
			if (nodes != null) {
				$root = new Dom.Node(tag_PLACEHOLDER);
				$root.nodes = nodes;
			}
			this.scope = this;
			this.parent = parent;
			this.$root = $root || (parent && parent.$root);
			this.$extra = [];
			
			if (opts != null) {
				this.opts = opts;
			}
			else if (parent != null) {
				this.opts = parent.opts;
			}
		}
		Placeholders.prototype = {
			opts: {
				extending: false
			},
			parent: null,
			attr: null,
			scope: null,
			$root: null,
			$extra: null,
			$count: 0,
			$getNode: function(id, filter){
				var ctx = this, node;
				while(ctx != null){
					node = ctx[id];
					if (node != null) 
						break;
					ctx = ctx.parent;
				}
				if (filter != null && node != null) {
					node = {
						nodes: jmask(node.nodes).filter(filter)
					};
				}
				return node;
			}
		};
		
	}());
	// end:source merge
	// source optimize
	var mask_optimize,
		mask_registerOptimizer;
	(function(){	
		/**
		 * Run all registerd optimizers recursively on the nodes
		 * @param {MaskNode} node
		 * @param {function} onComplete
		 * @param {mask.optimize~onComplete} done
		 */
		mask_optimize = function (dom, done) {
			mask_TreeWalker.walkAsync(
				dom
				, function (node, next) {
					var fn = getOptimizer(node);
					if (fn != null) {
						fn(node, next);
						return;
					}
					next();
				}
				, done
			);
		};
		
		/**
		 * Register custom optimizer for a node name
		 * @param {string} tagName - Node name
		 * @param {function} visitor - Used for @see {@link mask.TreeWalker.walkSync}
		 */
		mask_registerOptimizer = function(tagName, fn){
			custom_Optimizers[tagName] = fn;
		};
		
		function getOptimizer(node) {
			if (node.type !== Dom.NODE) 
				return null;
			
			return custom_Optimizers[node.tagName];
		}
		
		
		/**
		 * Returns optimized mask tree
		 * @callback mask.optimize~onComplete
		 * @param {MaskNode} node
		 */
	}());
	// end:source optimize
	// source modules/
	var Module;
	(function(){
		Module = {};
		var _cache = {},
			_extensions_script = ' js es6 test coffee ',
			_extensions_style  = ' css sass scss less ',
			_extensions_data   = ' json ',
			_opts = {
				base: null,
				version: null
			};
		
		// source utils
		var u_resolveLocation,
			u_resolvePath,
			u_resolvePathFromImport,
			u_handler_getDelegate;
			
		(function(){
		
			u_resolveLocation = function(ctx, ctr, module) {
				if (module != null) {
					return module.location;
				}	
				while(ctr != null) {
					if (ctr.location != null) {
						return ctr.location;
					}
					if (ctr.resource != null && ctr.resource.location) {
						return ctr.resource.location;
					}
					ctr = ctr.parent;
				}
				var path = null;
				if (ctx != null) {
					if (ctx.filename != null) {
						path = path_getDir(path_normalize(ctx.filename));
					}
					if (ctx.dirname != null) {
						path = path_normalize(ctx.dirname + '/');
					}
				}
				
				if (_opts.base == null) {
					_opts.base = path_resolveCurrent();
				}
				
				if (path != null) {
					if (path_isRelative(path) === false) {
						return path;
					}
					return path_combine(_opts.base, path);
				}
				return _opts.base;
			};
			
			u_resolvePath = function(path, ctx, ctr, module){
				if ('' === path_getExtension(path)) {
					path += '.mask';
				}
				if (path_isRelative(path) === false) {
					return path;
				}
				return path_normalize(path_combine(
					u_resolveLocation(ctx, ctr, module), path
				));
			};
			
			u_resolvePathFromImport = function(node, ctx, ctr, module){
				var path = node.path;
				if ('' === path_getExtension(path)) {
					var type = node.contentType;
					if (type == null || type === 'mask' ) {
						path += '.mask';
					}
				}
				if (path_isRelative(path) === false) {
					return path;
				}
				return path_normalize(path_combine(
					u_resolveLocation(ctx, ctr, module), path
				));
			};
			
			
			u_handler_getDelegate = function(compoName, compo, next) {
				return function(name) {
					if (name === compoName) 
						return compo;
					if (next != null) 
						return next(name);
					
					return null;
				};
			};
			
			
		}());
		
		// end:source utils
		// source loaders
		var _file_get,
			_file_getScript,
			_file_getStyle,
			_file_getJson;
			
		(function(){
			
			_file_get = createTransport(function(){
				return __cfg.getFile || file_get;
			});
			_file_getScript = createTransport(function(){
				return __cfg.getScript || file_getScript;
			});
			_file_getStyle = createTransport(function(){
				return __cfg.getStyle || file_getStyle;
			});
			_file_getJson = createTransport(function(){
				return __cfg.getData || file_getJson;
			});
			
			
			listeners_on('config', function (config) {
				var modules = config.modules;
				if (modules == null) {
					return;
				}
				var fn = Loaders[modules];
				if (is_Function(fn) === false) {
					log_warn('Module system is not supported: ' + modules);
					return;
				}
				fn();
			});
			
			function createTransport(loaderFactoryFn) {
				return function(path_){
					var fn = loaderFactoryFn(),
						path = path_,
						v = _opts.version;
					if (v != null) {
						path = path_appendQuery(path, 'v', v);
					}
					return fn(path);
				};
			}
			
			var Loaders = {
				'default': function () {
					__cfg.getScript = __cfg.getFile = null;
				},
				'include': function () {
					__cfg.getScript = getter('js');
					__cfg.getFile   = getter('load');
					
					var lib = include;
					function getter(name) {
						return function(path){
							return class_Dfr.run(function(resolve, reject){
								lib.instance('/')[name](path + '::Module').done(function(resp){
									var exports = name === 'js'
										? resp.Module
										: resp[name].Module;
									
									resolve(exports);
								});
							});
						}
					}
				}
			};
			
			if (typeof include !== 'undefined' && is_Function(include && include.js)) {
				mask_config('modules', 'include');
			}
		}());
		// end:source loaders
		
		// source class/Endpoint
		function Endpoint (path, contentType) {
			this.path = path;
			this.contentType = contentType;
		}
		// end:source class/Endpoint
		// source Import/Import
		var IImport = class_create({
			type: null,
			contentType: null,
			constructor: function(path, alias, exports, module){
				this.path = path;
				this.alias = alias;
				this.exports = exports;
				
				var endpoint = new Endpoint(path, this.contentType);
				this.module = Module.createModule(endpoint, module);
				this.parent = module;
			},
			eachExport: function(fn){
				var alias = this.alias;
				if (alias != null) {
					fn.call(this, alias, '*', alias);
					return;
				}
				var exports = this.exports
				if (exports != null) {
					var imax = exports.length,
						i = -1;
					while(++i < imax) {
						var x = exports[i];
						fn.call(
							this
							, x.alias == null ? x.name : x.alias
							, x.name
							, x.alias
						);
					}
				}
			},
			
			hasExport: function(name) {
				if (this.alias === name) {
					return true;
				}
				var exports = this.exports
				if (exports != null) {
					var imax = exports.length,
						i = -1;
					while(++i < imax) {
						var x = exports[i];
						var expName = x.alias == null ? x.name : x.alias;
						if (expName === name) {
							return true;
						}
					}
				}
				return false;
			},
			
			getOriginal: function(alias){
				if (this.alias === alias) {
					return '*';
				}
				var exports = this.exports;
				if (exports != null) {
					var imax = exports.length,
						i = -1, x;
					while(++i < imax) {
						x = exports[i];
						if ((x.alias || x.name) === alias) {
							return x.name;
						}
					}
				}
				return null;
			},
			
			loadImport: function(cb){
				var self = this;
				this
					.module
					.loadModule()
					.fail(cb)
					.done(function(module){
						cb(null, self);
					});
			},
			
			registerScope: null,
			
			logError_: function(msg){
				var str = '\n(Module) ' + (this.parent || {path: 'root'}).path
				str += '\n  (Import) ' + this.path
				str += '\n    ' + msg;
				log_error(str);
			}
		});
		
		
		(function(){
			IImport.create = function(endpoint, alias, exports, parent){
				return new (Factory(endpoint))(endpoint.path, alias, exports, parent);
			};
			function Factory(endpoint) {
				var type = endpoint.contentType;
				var ext = type || path_getExtension(endpoint.path);
				if (ext === 'mask') {
					return ImportMask;
				}
				if (ext === 'html') {
					return ImportHtml;
				}
				var search = ' ' + ext + ' ';
				if (_extensions_style.indexOf(search) !== -1) {
					return ImportStyle;
				}
				if (_extensions_data.indexOf(search)  !== -1) {
					return ImportData;
				}
				// assume script, as anything else is not supported yet
				return ImportScript;
			}
		}());
		// end:source Import/Import
		// source Import/ImportMask
		var ImportMask = class_create(IImport, {
			type: 'mask',
			contentType: 'mask',
			constructor: function(){
				this.eachExport(function(compoName){
					if (compoName !== '*') 
						customTag_registerResolver(compoName);
				});
			},
			getHandler: function(name){
				var module = this.module;
				if (module == null) {
					return;
				}
				if (module.error != null) {
					if (this.hasExport(name)) {
						this.logError_('Resource for the import `' + name + '` not loaded');
						return this.empty;
					}
					return null
				}
				var orig = this.getOriginal(name);
				if (orig == null) {
					return null;
				}
				return module.exports[orig] || module.queryHandler(orig);
			},
			empty: function EmptyCompo () {}
		});
		// end:source Import/ImportMask
		// source Import/ImportScript
		var ImportScript = class_create(IImport, {
			type: 'script',
			contentType: 'script',
			registerScope: function(owner){
				this.eachExport(function(exportName, name, alias){
					var obj = this.module.register(owner, name, alias);
					if (obj == null) {
						this.logError_('Exported property is undefined: ' + name);
					}
				});
			}
		});
		// end:source Import/ImportScript
		// source Import/ImportStyle
		var ImportStyle = class_create(IImport, {
			type: 'style',
			contentType: 'css'
		});
		// end:source Import/ImportStyle
		// source Import/ImportData
		var ImportData = class_create(ImportScript, {
			type: 'data',
			contentType: 'json'
		});
		// end:source Import/ImportData
		// source Import/ImportHtml
		var ImportHtml = class_create(ImportMask, {
			type: 'mask',
			contentType: 'html'
		});
		// end:source Import/ImportHtml
		
		// source Module/Module
		var IModule = class_create(class_Dfr, {
			type: null,
			path: null,
			location: null,
			exports: null,
			state: 0,
			constructor: function(path, parent) {		
				this.path = path;
				this.parent = parent;
				this.exports = {};
				this.location = path_getDir(path);
				this.complete_ = this.complete_.bind(this);
			},
			loadModule: function(){
				if (this.state !== 0) 
					return this;
		
				this.state = 1;
				var self = this;
				this
					.load_(this.path)
					.fail(function(err){
						self.onLoadError_(err);
					})
					.done(function(mix){
						self.onLoadSuccess_(mix);
					});
				return this;
			},
			complete_: function(error, exports){
				this.exports = exports;
				this.error = error;
				this.state = 4;
				if (error) {
					this.reject(error);
					return;
				}
				this.resolve(this);
			},
			onLoadSuccess_: function(mix){
				if (this.preprocess_ == null) {
					this.complete_(null, mix);
					return;
				}
				this.preprocess_(mix, this.complete_);
			},
			onLoadError_: function(error){
				if (this.preprocessError_ == null) {
					this.complete_(error);
					return;
				}
				this.preprocessError_(error, this.complete_);
			},
			load_: null,
			preprocess_: null,
			preprocessError_: null,
			register: fn_doNothing,
		});
		
		(function(){
			IModule.create = function(endpoint, parent, contentType){
				return new (Factory(endpoint))(endpoint.path, parent);
			};
			function Factory(endpoint) {
				var type = endpoint.contentType;
				var ext = type || path_getExtension(endpoint.path);
				if (ext === 'mask') {
					return ModuleMask;
				}
				var search = ' ' + ext + ' ';
				if (_extensions_style.indexOf(search) !== -1) {
					return ModuleStyle;
				}
				if (_extensions_data.indexOf(search)  !== -1) {
					return ModuleData;
				}
				if (ext === 'html') {
					return ModuleHtml;
				}
				// assume script, as anything else is not supported yet
				return ModuleScript;
			}
		}());
		
		// end:source Module/Module
		// source Module/ModuleMask
		var ModuleMask;
		(function(){
			ModuleMask = class_create(IModule, {
				type: 'mask',
				scope: null,
				source: null,
				modules: null,
				exports: null,
				imports: null,
				
				load_: _file_get,
				preprocessError_: function(error, next) {
					var msg = 'Load error: ' + this.path;
					if (error && error.status) {
						msg += '; Status: ' + error.status;
					}
		
					this.source = reporter_createErrorNode(msg);
					next.call(this, error);
				},
				preprocess_: function(mix, next) {
					var ast = typeof mix === 'string'
						? parser_parse(mix)
						: mix
						;
					
					this.scope = {};
					this.source = ast;
					this.imports = [];
					this.exports = {
						'__nodes__': [],
						'__handlers__': {}
					};
					
					var arr  = _nodesToArray(ast),
						imax = arr.length,
						i = -1,
						x;
					while( ++i < imax ){
						x = arr[i];
						switch (x.tagName) {
							case 'import':
								this.imports.push(Module.createImport(
									x, null, null, this
								));
								break;
							case 'module':
								var path = u_resolvePath(x.attr.path, null, null, this),
									type = x.attr.contentType,
									endpoint = new Module.Endpoint(path, type)
									;
								Module.registerModule(x.nodes, endpoint);
								break;
							case 'define':
							case 'let':
								continue;
							default:
								this.exports.__nodes__.push(x);
								break;
						}
					}
					
					_loadImports(this.imports, function(){
						next.call(this, null, _createExports(arr, null, this));
					}, this);
				},
				
				getHandler: function(name){
					return _module_getHandler.call(this, this, name);
				},
				queryHandler: function(selector) {
					if (this.error) {
						return _createHandlerForNodes(this.source, this);
					}
					
					var nodes = this.exports.__nodes__;
					if (selector !== '*') {
						nodes = _nodesFilter(nodes, selector);
					}
					return nodes != null && nodes.length !== 0
						? _createHandlerForNodes(nodes, this)
						: null
						;
				},
			});
			
			// Also flattern all `imports` tags
			function _nodesToArray (mix) {
				var type = mix.type;
				if (type === Dom.NODE && mix.tagName === 'imports') {
					return mix.nodes;
				}
				if (type !== Dom.FRAGMENT && type != null) {
					return [ mix ];
				}
				var arr = mix;
				if (type === Dom.FRAGMENT) {
					arr = mix.nodes;
				}
				var imax = arr.length,
					i = -1, x;
				while ( ++i < imax ){
					x = arr[i];
					if (x.tagName === 'imports') {
						arr.splice.apply(arr, [i, 1].concat(x.nodes));
						i--;
					}
				}
				
				return arr;
			}
			function _nodesFilter(nodes, tagName) {
				var arr = [],
					imax = nodes.length,
					i = -1, x;
				while ( ++i < imax ) {
					x = nodes[i];
					if (x.tagName === tagName) {
						arr.push(x);
					}
				}
				return arr;
			}
			function _createExports(nodes, model, module) {
				var exports = module.exports,
					imports = module.imports,
					scope   = module.scope,
					getHandler = _module_getHandlerDelegate(module);
				
				var i = -1,
					imax = imports.length;
				while ( ++i < imax ) {
					var x = imports[i];
					if (x.registerScope) {
						x.registerScope(module);
					}
				}
				
				var i = -1,
					imax = nodes.length;
				while ( ++i < imax ) {
					var node = nodes[i];
					var name = node.tagName;
					if (name === 'define' || name === 'let') {
						var Base = {
							getHandler: _fn_wrap(customTag_Compo_getHandler, getHandler),
							location: module.location
						};
						var Ctor = Define.create(node, model, module, Base);
						var Proto = Ctor.prototype;
						Proto.scope  = obj_extend(Proto.scope, scope);
						
						
						var compoName = node.name;
						if (name === 'define') {
							exports[compoName] = Ctor;
							customTag_register(compoName, Ctor);
						}
						if (name === 'let') {
							customTag_registerResolver(compoName)
						}
						exports.__handlers__[compoName] = Ctor;
					}
				}
				exports['*'] = class_create(customTag_Base, {
					getHandler: getHandler,
					location: module.location,
					nodes: exports.__nodes__,
					scope: scope
				});
				
				return exports;
			}
			function _createHandlerForNodes(nodes, module) {
				return class_create({
					scope: module.scope,
					location: module.location,
					nodes: nodes,
					getHandler: _module_getHandlerDelegate(module)
				});
			}
			
			function _loadImports(imports, done, module) {
				var count = imports.length;
				if (count === 0) {
					return done.call(module);
				}	
				var imax = count,
					i = -1;
				while( ++i < imax ) {
					imports[i].loadImport(await);
				}
				
				function await(){
					if (--count > 0) 
						return;
					done.call(module);
				}
			}
			function _module_getHandlerDelegate(module) {
				return function(name) {
					return _module_getHandler.call(this, module, name);
				};
			}
			function _module_getHandler(module, name) {
				var Ctor;
				
				// check public exports
				var exports = module.exports;
				if (exports != null && (Ctor = exports[name]) != null) {
					return Ctor;
				}
				
				// check private components store
				var handlers = exports.__handlers__;
				if (handlers != null && (Ctor = handlers[name]) != null) {
					return Ctor;
				}
				
				var arr = module.imports,
					i = arr.length,
					x, type;
				while( --i > -1) {
					x = arr[i];
					type = x.type;
					if (type === 'mask' && (Ctor = x.getHandler(name)) != null) {
						return Ctor;
					}
				}
				return null;
			}
			
			function _fn_wrap(baseFn, fn) {
				if (baseFn == null) {
					return fn;
				}
				return function(){
					var x = baseFn.apply(this, arguments);
					if (x != null) {
						return x;
					}
					return fn.apply(this, arguments);
				}
			}
		}());
		
		// end:source Module/ModuleMask
		// source Module/ModuleScript
		var ModuleScript = class_create(IModule, {
			type: 'script',
			
			load_: _file_getScript,
			getExport_: function(property) {
				var obj = this.exports;
				return property !== '*'
					? obj_getProperty(obj, property)
					: obj
					;
			},
			
			register: function(ctr, name, alias) {
				var prop = alias || name;
				var obj = this.getExport_(name);
				if (obj == null) {
					return null;
				}
				if (ctr.scope == null) {
					ctr.scope = {};
				}
				obj_setProperty(ctr.scope, prop, obj);
				return obj;
			},
			preprocessError_: function(error, next) {
				log_error('Resource ' + this.path + ' thrown an Exception: ' + error);
				next(error);
			}
		});
		// end:source Module/ModuleScript
		// source Module/ModuleStyle
		var ModuleStyle = class_create(IModule, {
			type: 'style',
			
			load_: _file_getStyle
		});
		// end:source Module/ModuleStyle
		// source Module/ModuleData
		var ModuleData = class_create(ModuleScript, {
			type: 'data',
			
			load_: _file_getJson
		});
		// end:source Module/ModuleData
		// source Module/ModuleHtml
		var ModuleHtml;
		(function(){
			ModuleHtml = class_create(ModuleMask, {
				type: 'mask',
				preprocess_: function(mix, next) {
					var ast = typeof mix === 'string'
						? parser_parseHtml(mix)
						: mix
						;
					return ModuleMask
						.prototype
						.preprocess_
						.call(this, ast, next);
				}
			});
		}());
		// end:source Module/ModuleHtml
		
		// source components
		(function() {
			var IMPORT  = 'import',
				IMPORTS = 'imports';
				
			custom_Tags['module'] = class_create({
				constructor: function(node, model, ctx, container, ctr) {
					var path = path_resolveUrl(node.attr.path, u_resolveLocation(ctx, ctr)),
						type = node.attr.type,
						endpoint = new Module.Endpoint(path, type);
					Module.registerModule(node.nodes, endpoint, ctx, ctr);
				},
				render: fn_doNothing
			});
			custom_Tags['import:base'] = function(node, model, ctx, el, ctr){
				var base = path_normalize(expression_eval(node.expression, model, ctx, ctr));
				if (base != null && base[base.length - 1] !== '/') {
					base += '/';
				}
				Module.cfg('base', base);
			};
			custom_Tags[IMPORT] = class_create({
				meta: {
					serializeNodes: true
				},
				constructor: function(node, model, ctx, el, ctr) {
					if (node.alias == null && node.exports == null && Module.isMask(node)) {
						// embedding
						this.module = Module.createModule(node, ctx, ctr);
					}
				},
				renderStart: function(model, ctx){
					if (this.module == null) {
						return;
					}
					var resume = Compo.pause(this, ctx);
					var self   = this;
					this
						.module
						.loadModule()
						.always(function(){
							self.scope = self.module.scope;
							self.nodes = self.module.source;
							self.getHandler = self.module.getHandler.bind(self.module);
							resume();
						});
				}
			});
			
			custom_Tags[IMPORTS] = class_create({
				imports_: null,
				load_: function(ctx, cb){
					var arr = this.imports_,
						self = this,
						imax = arr.length,
						await = imax,
						i = -1, x;
					
					function done(error, import_) {
						if (error == null) {
							if (import_.registerScope) {
								import_.registerScope(self);
							}
							if (ctx._modules != null) {
								ctx._modules.add(import_.module);
							}
						}
						if (--await === 0) {
							cb();
						}
					}
					while( ++i < imax ){
						x = arr[i];
						x.loadImport(done);
					}
				},
				start_: function(model, ctx){
					var resume = Compo.pause(this, ctx),
						nodes = this.nodes,
						imax = nodes.length,
						i = -1, x
						;
					var arr = this.imports_ = [];
					while( ++i < imax ){
						x = nodes[i];
						if (x.tagName === IMPORT) {
							if (x.path.indexOf('~') !== -1) {
								var fn = parser_ensureTemplateFunction(x.path);
								if (is_Function(fn)) {
									x.path = fn('attr', model, ctx, null, this);
								}
							}
							arr.push(Module.createImport(x, ctx, this));
						}
					}
					this.load_(ctx, resume);
				},
				meta: {
					serializeNodes: true
				},
				renderStart: function(model, ctx){
					this.start_(model, ctx);
				},
				renderStartClient: function(model, ctx){
					this.start_(model, ctx);
				},
				serializeNodes: function(){
					// NodeJS
					var arr = [],
						i = this.nodes.length, x;
					while( --i > -1 ){
						x = this.nodes[i];
						if (x.tagName === IMPORT) {
							arr.push(x);
						}
					}
					return mask_stringify(arr);
				},
				
				getHandler: function(name){
					var arr = this.imports_,
						imax = arr.length,
						i = -1, import_, x;
					while ( ++i < imax ){
						import_ = arr[i];
						if (import_.type !== 'mask') {
							continue;
						}
						x = import_.getHandler(name);
						if (x != null) {
							return x;
						}
					}
					return null;
				},
				getHandlers: function(){
					var handlers = {};
					var arr = this.imports_,
						imax = arr.length,
						i = -1, import_, x;
					while ( ++i < imax ){
						import_ = arr[i];
						if (import_ !== 'mask') {
							continue;
						}
						x = import_.getHandlers();
						obj_extend(handlers, x);
					}
					return handlers;
				},
			});
		
			
		}());
		
		// end:source components
		// source tools/dependencies
		var tools_getDependencies;
		(function() {
				
			tools_getDependencies = function(template, path, opts_){
				
				var opts = obj_extendDefaults(opts_, defaultOptions);
				var dfr = new class_Dfr;
				var ast = typeof template === 'string'
					? parser_parse(template)
					: template
					;
				
				return get(ast, path, opts, dfr);
			};
			
			
			var defaultOptions = {
				deep: true,
				flattern: false
			};
			
			function get(ast, path, opts, dfr) {
				walk(ast, path, opts, function(error, dep){
					if (error) return dfr.reject(error);
					if (opts.flattern === true && opts.deep === true) {
						dep = flattern(dep);
					}
					dfr.resolve(dep);
				});
				return dfr;
			}
			
			function walk(ast, path, opts, done) {
				var location = path_getDir(path);
				var dependency = {
					mask: [],
					data: [],
					style: [],
					script: [],
				};
				
				mask_TreeWalker.walkAsync(ast, visit, complete);
				
				function visit (node, next){
					if (node.tagName !== 'import') {
						return next();
					}
					var path = resolvePath(node, location);
					var type = Module.getType(node);
					if (opts.deep === false) {
						dependency[type].push(path);
						return next();
					}
					if ('mask' === type) {
						getMask(path, opts, function(error, dep){
							if (error) {
								return done(error);
							}
							dependency.mask.push(dep);
							next();
						});
						return;
					}
					
					dependency[type].push(path);
					next();
				}
				function complete() {
					done(null, dependency);
				}
			}
			
			function getMask(path, opts, done){
				var dep = {
					path: path,
					dependencies: null
				};
				
				_file_get(path)
					.done(function(template){
						walk(parser_parse(template), path, opts, function(error, deps){
							if (error) {
								done(error);
								return;
							}
							dep.dependencies = deps;
							done(null, dep);
						});
					})
					.fail(done);
			}		
			function resolvePath(node, location) {
				var path = node.path,
					type = node.contentType;
				if ((type == null || type === 'mask') && path_getExtension(path) === '') {
					path += '.mask';
				}
				if (path_isRelative(path)) {
					path = path_combine(location, path);
				}
				return path_normalize(path);
			}
			
			var flattern;
			(function () {
				flattern = function (deps) {
					return {
						mask: resolve(deps, 'mask'),
						data: resolve(deps, 'data'),
						style: resolve(deps, 'style'),
						script: resolve(deps, 'script'),
					};
				};
				
				function resolve(deps, type) {
					return distinct(get(deps, type, []));
				}
				function get (deps, type, stack) {
					if (deps == null) {
						return stack;
					}
					var arr = deps[type],
						imax = arr.length,
						i = -1, x;
					while ( ++i < imax ) {
						x = arr[i];
						if (typeof x === 'string') {
							stack.unshift(x);
							continue;
						}
						// assume is an object { path, dependencies[] }
						stack.unshift(x.path);
						get(x.dependencies, type, stack);
					}
					if ('mask' !== type) {
						deps.mask.forEach(function(x){
							get(x.dependencies, type, stack);
						});
					}
					return stack;
				}
				function distinct (stack) {
					for (var i = 0; i < stack.length; i++) {
						for (var j = i + 1; j < stack.length; j++) {
							if (stack[i] === stack[j]) {
								stack.splice(j, 1);
								j--;
							}
						}
					}
					return stack;
				}
			}());
			
		}());
		// end:source tools/dependencies
		// source tools/build
		var tools_build;
		(function(){
			
			tools_build = function(template, path, opts_){
				var opts = obj_extendDefaults(opts_, optionsDefault);
				return class_Dfr.run(function(resolve, reject){
					tools_getDependencies(template, path, { flattern: true })
						.fail(reject)
						.done(function(deps){
							build(deps, opts, complete, reject);
						});
					function complete (out) {
						out.mask += '\n' + template;
						resolve(out);
					}
				});
			};
			
			var optionsDefault = {
				minify: false
			};
			
			function build(deps, opts, resolve, reject) {
				var types = ['mask', 'script', 'style', 'data'];
				var out = {
					mask: '',
					data: '',
					style: '',
					script: '',
				};
				function next(){
					if (types.length === 0) {
						if (out.data) {
							out.script = out.data + '\n' + out.script;
						}
						return resolve(out);
					}
					var type = types.shift();
					build_type(deps, type, opts, function(error, str){
						if (error) return reject(error);
						out[type] = str;
						next();
					});
				}
				next();
			}
			
			function build_type (deps, type, opts, done) {
				var arr = deps[type],
					imax = arr.length,
					i = -1,
					stack = [];
					
				function next() {
					if (++i === imax) {
						done(null, stack.join('\n'));
						return;
					}
					Single[type](arr[i], opts)
						.fail(done)
						.done(function(str){
							stack.push('/* source ' + arr[i] + ' */');
							stack.push(str);
							next();
						});
				}
				next();
			}
			
			var Single = {
				mask: function(path, opts, done){
					return class_Dfr.run(function(resolve, reject) {
						_file_get(path)
							.fail(reject)
							.done(function(str) {
								// remove all remote styles
								var ast = mask_TreeWalker.walk(str, function(node){
									if (node.tagName === 'link' && node.attr.href) {
										return { remove: true };
									}
								});
								ast = jmask('module')
									.attr('path', path)
									.append(ast);
								
								var str = mask_stringify(ast[0], {
									indent: opts.minify ? 0 : 4
								});
								resolve(str);
							});
					});
				},
				script: function(path, opts){
					return (__cfg.buildScript || build_script)(path, opts);
				},
				style: function(path, opts) {
					return (__cfg.buildStyle || build_style)(path, opts);
				},
				data: function(path, opts) {
					return (__cfg.buildData || build_data)(path, opts);
				}
			}
			
			function build_script(path, opts, done) {
				return class_Dfr.run(function(resolve, reject){
					_file_get(path)
						.fail(reject)
						.done(function(str){
							var script = 'module = { exports: null }\n';
							script += str + ';\n';
							script += 'mask.Module.registerModule(module.exports, new mask.Module.Endpoint("' + path + '", "script"))';
							resolve(script);
						});	
				});
			}
			function build_style(path, opts, done) {
				return _file_get(path, done);
			}
			function build_data(path, opts, done) {
				return class_Dfr.run(function(resolve, reject){
					_file_get(path)
						.fail(reject)
						.done(function(mix){
							var json;
							try {
								json = typeof mix === 'string'
									? JSON.parse(mix)
									: mix;
							} catch (error) {
								reject(error);
								return;
							}
							var str = JSON.stringify(json, null, opts.minify ? 4 : void 0);
							var script = 'module = { exports: ' + str + ' }\n'
								+ 'mask.Module.registerModule(module.exports, new mask.Module.Endpoint("' + path + '", "json"))';
								
							resolve(script);
						});	
				});
			}
		}());
		// end:source tools/build
		
		obj_extend(Module, {
			ModuleMask: ModuleMask,
			Endpoint: Endpoint,		
			createModule: function(node, ctx, ctr, parent) {			
				var path   = u_resolvePathFromImport(node, ctx, ctr, parent),
					module = _cache[path];
				if (module == null) {
					var endpoint = new Endpoint(path, node.contentType);
					module = _cache[path] = IModule.create(endpoint, parent);
				}
				return module;
			},
			registerModule: function(mix, endpoint, ctx, ctr, parent) {
				endpoint.path = u_resolvePath(endpoint.path, ctx, ctr, parent);
				
				var module = Module.createModule(endpoint, ctx, ctr, parent);
				module.state = 1;
				if (Module.isMask(endpoint)) {
					module.preprocess_(mix, function(){
						module.state = 4;
						module.resolve(module);
					});
					return module;
				}
				// assume others and is loaded
				module.state   = 4;
				module.exports = mix;
				module.resolve(module);
				return module;
			},
			
			createImport: function(node, ctx, ctr, module){
				var path    = u_resolvePathFromImport(node, ctx, ctr, module),
					alias   = node.alias,
					exports = node.exports,
					endpoint = new Endpoint(path, node.contentType);
				return IImport.create(endpoint, alias, exports, module);
			},
			isMask: function(endpoint){
				var type = endpoint.contentType,
					ext = type || path_getExtension(endpoint.path);
				return ext === '' || ext === 'mask' || ext === 'html';
			},
			getType: function(endpoint) {
				var type = endpoint.contentType,
					path = endpoint.path;
				if (type != null) {
					return type;
				}
				var ext = path_getExtension(path);			
				if (ext === '' || ext === 'mask'){
					return 'mask';
				}
				var search = ' ' + ext + ' ';
				if (_extensions_style.indexOf(search) !== -1){
					return 'style';
				}
				if (_extensions_data.indexOf(search) !== -1){
					return 'data';
				}
				// assume is javascript
				return 'script';
			},
			cfg: function(name, val){
				if (name in _opts === false) {
					log_error('Invalid module option: ', name);
					return;
				}
				_opts[name] = val;
			},
			resolveLocation: u_resolveLocation,
			getDependencies: tools_getDependencies,
			build: tools_build,
		});
	}());
	// end:source modules/
	// source Define
	var Define;
	(function(){
		Define = {
			create: function(node, model, ctr, Base){
				return compo_fromNode(node, model, ctr, Base);
			},
			registerGlobal: function(node, model, ctr, Base) {
				var Ctor = Define.create(node, model, ctr, Base);
				customTag_register(
					node.name, Ctor
				);
			},
			registerScoped: function(node, model, ctr, Base) {
				var Ctor = Define.create(node, model, ctr, Base);
				customTag_registerScoped(
					ctr, node.name, Ctor
				);
			}
		};
		
		function compo_prototype(compoName, tagName, attr, nodes, owner, model, Base) {
			var arr = [];
			var Proto = obj_extend({
				tagName: tagName,
				compoName: compoName,
				template: arr,
				attr: attr,
				location: trav_location(owner),
				meta: {
					template: 'merge'
				},
				renderStart: function(){
					Compo.prototype.renderStart.apply(this, arguments);
					if (this.nodes === this.template) {
						this.nodes = mask_merge(this.nodes, [], this);
					}
				},
				getHandler: null
			}, Base);
			
			var imax = nodes == null ? 0 : nodes.length,
				i = 0, x, name;
			for(; i < imax; i++) {
				x = nodes[i];
				if (x == null) 
					continue;
				name = x.tagName;
				if ('function' === name) {
					Proto[x.name] = x.fn;
					continue;
				}
				if ('slot' === name || 'event' === name) {
					if ('event' === name && Proto.tagName != null) {
						// bind the event later via the component
						arr.push(x);
						continue;
					}
					var type = name + 's';
					var fns = Proto[type];
					if (fns == null) {
						fns = Proto[type] = {};
					}
					fns[x.name] = x.fn;
					continue;
				}
				if ('define' === name || 'let' === name) {
					var fn = name === 'define'
						? Define.registerGlobal
						: Define.registerScoped;
					fn(x, model, Proto);
					continue;
				}
				if ('var' === name) {
					var obj = x.getObject(model, null, owner),
						key, val;
					for(key in obj) {
						val = obj[key];
						if (key === 'meta' || key === 'model' || key === 'attr') {
							Proto[key] = obj_extend(Proto[key], val);
							continue;
						}
						if (key === 'scope') {
							if (is_Object(val)) {
								Proto.scope = obj_extend(Proto.scope, val);
								continue;
							}
						}
						var scope = Proto.scope;
						if (scope == null) {
							Proto.scope = scope = {};
						}
						scope[key] = val;
					}
					continue;
				}
				arr.push(x);
			}
			return Proto;
		}
		function compo_extends(extends_, model, ctr) {
			var args = [];
			if (extends_ == null) 
				return args;
			
			var imax = extends_.length,
				i = -1,
				await = 0, x;
			while( ++i < imax ){
				x = extends_[i];
				if (x.compo) {
					var compo = customTag_get(x.compo, ctr);
					if (compo != null) {
						args.unshift(compo);
						continue;
					}
					
					var obj = expression_eval(x.compo, model, null, ctr);
					if (obj != null) {
						args.unshift(obj);
						continue;
					}
					log_error('Nor component, nor scoped data is resolved:', x.compo);
					continue;
				}
			}
			return args;
		}
		
		function compo_fromNode(node, model, ctr, Base) {
			var extends_ = node['extends'],
				as_ = node['as'],
				tagName,
				attr;
			if (as_ != null) {
				var x = parser_parse(as_);
				tagName = x.tagName;
				attr = obj_extend(node.attr, x.attr);
			}
			
			var name = node.name,
				Proto = compo_prototype(name, tagName, attr, node.nodes, ctr, model, Base),
				args = compo_extends(extends_, model, ctr)
				;
			
			args.push(Proto);
			return Compo.apply(null, args);
		}
		
		function trav_location(ctr) {
			while(ctr != null) {
				if (ctr.location) {
					return ctr.location;
				}
				if (ctr.resource && ctr.resource.location) {
					return ctr.resource.location;
				}
				ctr = ctr.parent;
			}
			return null;
		}
	}());
	// end:source Define
	// source TreeWalker
	var mask_TreeWalker;
	(function(){
		/**
		 * TreeWalker
		 * @memberOf mask
		 * @name TreeWalker
		 */
		mask_TreeWalker = {
			/**
			 * Visit each mask node
			 * @param {MaskNode} root
			 * @param {TreeWalker~SyncVisitior} visitor
			 * @memberOf mask.TreeWalker
			 */
			walk: function(root, fn) {
				if (typeof root === 'object' && root.type === Dom.CONTROLLER) {
					new SyncWalkerCompos(root, fn);
					return root;
				}
				root = prepairRoot(root);
				new SyncWalker(root, fn);
				return root;
			},
			/**
			 * Asynchronous visit each mask node
			 * @param {MaskNode} root
			 * @param {TreeWalker~AsyncVisitior} visitor
			 * @param {function} done
			 * @memberOf mask.TreeWalker
			 */
			walkAsync: function(root, fn, done){
				root = prepairRoot(root);
				new AsyncWalker(root, fn, done);
			}
		};
		
		var SyncWalker,
			SyncWalkerCompos;
		(function(){
			SyncWalker = function(root, fn){
				walk(root, fn);
			};
			SyncWalkerCompos = function(root, fn){
				walkCompos(root, fn, root);
			};
			function walk(node, fn, parent, index) {
				if (node == null) 
					return null;
				
				var deep = true, break_ = false, mod;
				if (isFragment(node) !== true) {
					mod = fn(node);
				}
				if (mod !== void 0) {
					mod = new Modifier(mod);
					mod.process(new Step(node, parent, index));
					deep   = mod.deep;
					break_ = mod['break'];
				}			
				var nodes = safe_getNodes(node);
				if (nodes == null || deep === false || break_ === true) {
					return mod;
				}
				var imax = nodes.length,
					i = 0, x;
				for(; i < imax; i++) {
					x = nodes[i];
					mod = walk(x, fn, node, i);
					if (mod != null && mod['break'] === true) {
						return mod;
					}
				}
			}
			function walkCompos(compo, fn, parent, index) {
				if (compo == null) 
					return;
				
				var mod = fn(compo, index);
				if (mod !== void 0) {
					if (mod.deep === false || mod['break'] === true) {
						return mod;
					}
				}
				var compos = compo.components;
				if (compos == null) {
					return null;
				}
				var imax = compos.length,
					i = 0, x;
				for(; i < imax; i++) {
					x = compos[i];
					mod = walkCompos(x, fn, compo, i);
					if (mod != null && mod['break'] === true) {
						return mod;
					}
				}
			}
		}());
		var AsyncWalker;
		(function(){
			AsyncWalker = function(root, fn, done){
				this.stack = [];
				this.done = done;
				this.root = root;
				this.fn = fn;
				
				this.process = this.process.bind(this);
				this.visit(this.push(root));
			};
			AsyncWalker.prototype = {
				current: function(){
					return this.stack[this.stack.length - 1];
				},
				push: function(node, parent, index){
					var step = new Step(node, parent, index);
					this.stack.push(step);
					return step;
				},
				pop: function(){
					return this.stack.pop();
				},
				getNext: function(goDeep){
					var current  = this.current(),
						node = current.node,
						nodes = safe_getNodes(node);
					if (node == null) {
						throw Error('Node is null');
					}
					if (nodes != null && goDeep !== false && nodes.length !== 0) {
						if (nodes[0] == null) {
							throw Error('Node is null');
						}
						return this.push(
							nodes[0],
							node,
							0
						);
					}
					var parent, index;
					while (this.stack.length !== 0) {
						current = this.pop();
						parent = current.parent;
						index  = current.index;
						if (parent == null) {
							this.pop();
							continue;
						}
						if (++index < parent.nodes.length) {
							return this.push(
								parent.nodes[index],
								parent,
								index
							);
						}
					}
					return null;
				},
				process: function(mod){
					var deep = true, break_ = false;
					
					if (mod !== void 0) {
						mod = new Modifier(mod);
						mod.process(this.current());
						deep   = mod.deep;
						break_ = mod['break'];
					}
					
					var next = break_ === true ? null : this.getNext(deep);
					if (next == null) {
						this.done(this.root);
						return;
					}
					this.visit(next);
				},
				
				visit: function(step){
					var node = step.node;
					if (isFragment(node) === false) {
						this.fn(node, this.process);
						return;
					}
					this.process();
				},
				
				fn: null,
				done: null,
				stack: null
			};
		}());
		
		var Modifier;
		(function(){
			/**
			 * @name IModifier
			 * @memberOf TreeWalker
			 */
			Modifier = function (mod, step) {
				for (var key in mod) {
					this[key] = mod[key];
				}
			};
			Modifier.prototype = {
				/**
				 * On `true` stops the walker			 
				 */
				'break': false,
				/**
				 * On `false` doesn't visit the subnodes
				 */
				deep: true,
				/**
				 * On `true` removes current node
				 */
				remove: false,
				/**
				 * On not `null`, replaces the current node with value
				 */
				replace: null,
				process: function(step){
					if (this.replace != null) {
						this.deep = false;
						step.parent.nodes[step.index] = this.replace;
						return;
					}
					if (this.remove === true) {
						this.deep = false;
						var arr = step.parent.nodes,
							i = step.index;
						_Array_splice.call(arr, i, 1);
						return;
					}
				}
			};	
		}());
		
		var Step = function (node, parent, index) {
			this.node = node;
			this.index = index;
			this.parent = parent;
		};
		
		/* UTILS */
		
		function isFragment(node) {
			return Dom.FRAGMENT === safe_getType(node);
		}
		function safe_getNodes(node) {
			var nodes = node.nodes;
			if (nodes == null) 
				return null;
			
			return is_Array(nodes)
				? (nodes)
				: (node.nodes = [ nodes ]);
		}
		function safe_getType(node) {
			var type = node.type;
			if (type != null)
				return type;
		
			if (is_Array(node)) return Dom.FRAGMENT;
			if (node.tagName != null) return Dom.NODE;
			if (node.content != null) return Dom.TEXTNODE;
		
			return Dom.NODE;
		}
		function prepairRoot(root){
			if (typeof root === 'string') {
				root = parser_parse(root);
			}
			if (isFragment(root) === false) {
				var fragment = new Dom.Fragment;
				fragment.appendChild(root);
				
				root = fragment;
			}
			return root;
		}
		
		/**
		 * Is called on each node
		 * @callback TreeWalker~SyncVisitor
		 * @param {MaskNode} node 
		 * @returns {Modifier|void}
		 */
		/**
		 * Is called on each node
		 * @callback TreeWalker~AsyncVisitor
		 * @param {MaskNode} node 
		 * @param {function} done - Optional pass @see{@link TreeWalker.IModifier} to the callback
		 * @returns {void}
		 */
	}());
	// end:source TreeWalker
	// end:source feature/	
	// source parser/
	var parser_parse,
		parser_parseHtml,
		parser_parseAttr,
		parser_parseAttrObject,
		parser_parseLiteral,
		parser_ensureTemplateFunction,
		parser_setInterpolationQuotes,
		parser_cleanObject,
		parser_ObjectLexer
		;
	
	(function(Node, TextNode, Fragment, Component) {
	
		// source ./const
		var interp_START = '~',
			interp_OPEN = '[',
			interp_CLOSE = ']',
		
			// ~
			interp_code_START = 126,
			// [
			interp_code_OPEN = 91,
			// ]
			interp_code_CLOSE = 93,
			
			
			go_tag = 2,
			go_up = 9,
			go_attrVal = 6,
			go_attrHeadVal = 7,
			
			state_tag = 3,
			state_attr = 5,
			state_literal = 8
			;
		// end:source ./const
		// source ./utils
		parser_cleanObject = function(mix) {
			if (is_Array(mix)) {
				for (var i = 0; i < mix.length; i++) {
					parser_cleanObject(mix[i]);
				}
				return mix;
			}
			delete mix.parent;
			delete mix.__single;
			if (mix.nodes != null) {
				parser_cleanObject(mix.nodes);
			}
			return mix;
		};
		// end:source ./utils
		// source ./cursor
		var cursor_groupEnd,
			cursor_quoteEnd,
			cursor_refEnd,
			cursor_tokenEnd,
			cursor_skipWhitespace,
			cursor_skipWhitespaceBack,
			cursor_goToWhitespace
			;
		(function(){
			
			cursor_groupEnd = function(str, i, imax, startCode, endCode){		
				var count = 0,
					start = i,
					c;
				for( ; i < imax; i++){
					c = str.charCodeAt(i);
					if (c === 34 || c === 39) {
						// "|'
						i = cursor_quoteEnd(
							str
							, i + 1
							, imax
							, c === 34 ? '"' : "'"
						);
						continue;
					}
					if (c === startCode) {
						count++;
						continue;
					}
					if (c === endCode) {
						if (--count === -1) 
							return i;
					}
				}
				parser_warn('Group was not closed', str, start);
				return imax;
			};
			
			cursor_refEnd = function(str, i, imax){
				var c;
				while (i < imax){
					c = str.charCodeAt(i);			
					if (c === 36 || c === 95) {
						// $ _
						i++;
						continue;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						i++;
						continue;
					}
					break;
				}
				return i;
			};
			
			cursor_tokenEnd = function(str, i, imax){
				var c;
				while (i < imax){
					c = str.charCodeAt(i);
					if (c === 36 || c === 95 || c === 58) {
						// $ _ :
						i++;
						continue;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						i++;
						continue;
					}
					break;
				}
				return i;
			};
			
			cursor_quoteEnd = function(str, i, imax, char_){
				var start = i;
				while ((i = str.indexOf(char_, i)) !== -1) {
					if (str.charCodeAt(i - 1) !== 92)
						// \ 
						return i;
					i++;
				}
				parser_warn('Quote was not closed', str, start - 1);
				return imax;
			};
			
			cursor_skipWhitespace = function(str, i, imax) {
				for(; i < imax; i++) {
					if (str.charCodeAt(i) > 32) 
						return i;
				}
				return i;
			};
			cursor_skipWhitespaceBack = function(str, i) {
				for(; i > 0; i--) {
					if (str.charCodeAt(i) > 32) 
						return i;
				}
				return i;
			};
			
			cursor_goToWhitespace = function(str, i, imax) {
				for(; i < imax; i++) {
					if (str.charCodeAt(i) < 33) 
						return i;
				}
				return i;
			};
		}());
		// end:source ./cursor
		// source ./interpolation
		(function(){
		
			parser_ensureTemplateFunction = function (template) {
				var mix = _split(template);
				if (mix == null) {
					return template;
				}
				if (typeof mix === 'string') {
					return mix;
				}
				var array = mix;
				return function(type, model, ctx, element, ctr, name) {
					if (type === void 0) {
						return template;
					}
					return _interpolate(
						array
						, type
						, model
						, ctx
						, element
						, ctr
						, name
					);
				};
			};
			
			
			parser_setInterpolationQuotes = function(start, end) {
				if (!start || start.length !== 2) {
					log_error('Interpolation Start must contain 2 Characters');
					return;
				}
				if (!end || end.length !== 1) {
					log_error('Interpolation End must be of 1 Character');
					return;
				}
		
				interp_code_START = start.charCodeAt(0);
				interp_code_OPEN = start.charCodeAt(1);
				interp_code_CLOSE = end.charCodeAt(0);
				
				interp_START = start[0];
				interp_OPEN = start[1];
				interp_CLOSE = end;
			};
			
			
			function _split (template) {
				var index = -1,
					wasEscaped = false,
					nextC, nextI;
				/*
				 * - single char indexOf is much faster then '~[' search
				 * - function is divided in 2 parts: interpolation start lookup + interpolation parse
				 * for better performance
				 */
				while ((index = template.indexOf(interp_START, index)) !== -1) {
					nextC = template.charCodeAt(index + 1);
					var escaped = _char_isEscaped(template, index);
					if (escaped === true) {
						wasEscaped = true;
					}
					if (escaped === false)  {
						if (nextC === interp_code_OPEN) 
							break;
						if (_char_isSimpleInterp(nextC)) {
							break;
						}
					}
					index++;
				}
			
				if (index === -1) {
					if (wasEscaped === true) {
						return _escape(template);
					}
					return null;
				}
				
				var length = template.length,
					array = [],
					lastIndex = 0,
					i = 0,
					end;
			
				var propAccessor = false;
				while (true) {
					
					array[i++] = lastIndex === index
						? ''
						: _slice(template, lastIndex, index);
					
					
					nextI = index + 1;
					nextC = template.charCodeAt(nextI);
					if (nextC === interp_code_OPEN) {
						propAccessor = false;
						end = cursor_groupEnd(
							template
							, nextI + 1
							, length
							, interp_code_OPEN
							, interp_code_CLOSE
						);
						var str = template.substring(index + 2, end);
						array[i++] = new InterpolationModel(null, str);
						lastIndex = index = end + 1;
					}
					
					else if (_char_isSimpleInterp(nextC)) {
						propAccessor = true;
						end = _cursor_propertyAccessorEnd(template, nextI, length);
						
						var str = template.substring(index + 1, end);
						array[i++] = new InterpolationModel(str, null);
						lastIndex = index = end;		
					}
					else {
						array[i] += template[nextI];
						lastIndex = nextI;
					}
					
					while ((index = template.indexOf(interp_START, index)) !== -1) {
						nextC = template.charCodeAt(index + 1);
						var escaped = _char_isEscaped(template, index);
						if (escaped === true) {
							wasEscaped = true;
						}
						if (escaped === false)  {
							if (nextC === interp_code_OPEN) 
								break;
							if (_char_isSimpleInterp(nextC)) {
								break;
							}
						}
						index++;
					}
					if (index === -1) {
						break;
					}
				}	
				if (lastIndex < length) {
					array[i] = wasEscaped === true
						? _slice(template, lastIndex, length)
						: template.substring(lastIndex)
						;
				}
				return array;
			}
			
			function _char_isSimpleInterp (c) {
				//A-z$_
				return (c >= 65 && c <= 122) || c === 36 || c === 95;
			}
			function _char_isEscaped (str, i) {
				if (i === 0) {
					return false;
				}		
				var c = str.charCodeAt(--i);
				if (c === 92) {
					if (_char_isEscaped(str, c))
						return false;			
					return true;
				}
				return false;
			}
			
			function _slice(string, start, end) {
				var str = string.substring(start, end);
				var i = str.indexOf(interp_START)
				if (i === -1) {
					return str;
				}
				return _escape(str);
			}
			
			function _escape(str) {
				return str.replace(/\\~/g, '~');
			}
			
			function InterpolationModel(prop, expr){
				this.prop = prop;
				this.expr = expr;
			}
			InterpolationModel.prototype.process = function(model, ctx, el, ctr, name, type){
				if (this.prop != null) {
					return obj_getPropertyEx(this.prop, model, ctx, ctr);
				}
				var expr = this.expr,
					index = expr.indexOf(':'),
					util;
				if (index !== -1) {
					if (index === 0) {
						expr = expr.substring(index + 1);
					}
					else {
						var match = rgx_UTIL.exec(expr);
						if (match != null) {
							util = match[1];
							expr = expr.substring(index + 1);
						}
					}
				}
				if (util == null || util === '') {
					util = 'expression';
				}
				
				var fn = custom_Utils[util];
				if (fn == null) {
					log_error('Undefined custom util:', util);
					return null;
				}
				return fn(expr, model, ctx, el, ctr, name, type);
			};
			
			/**
			 * If we rendere interpolation in a TextNode, then custom util can return not only string values,
			 * but also any HTMLElement, then TextNode will be splitted and HTMLElements will be inserted within.
			 * So in that case we return array where we hold strings and that HTMLElements.
			 *
			 * If custom utils returns only strings, then String will be returned by this function
			 * @returns {(array|string)}
			 */
			function _interpolate(arr, type, model, ctx, el, ctr, name) {
				var imax = arr.length,
					i = -1,
					array = null,
					string = '',
					even = true;
				while ( ++i < imax ) {
					if (even === true) {
						if (array == null){
							string += arr[i];
						} else{
							array.push(arr[i]);
						}
					} else {
						var interp = arr[i],
							mix = interp.process(model, ctx, el, ctr, name, type);
						if (mix != null) {					
							if (typeof mix === 'object' && array == null){
								array = [ string ];
							}
							if (array == null){
								string += mix;
							} else {
								array.push(mix);
							}
						}
					}
					even = !even;
				}
			
				return array == null
					? string
					: array
					;
			}
			
			function _cursor_propertyAccessorEnd(str, i, imax) {
				var c;
				while (i < imax){
					c = str.charCodeAt(i);
					if (c === 36 || c === 95 || c === 46) {
						// $ _ .
						i++;
						continue;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						i++;
						continue;
					}
					break;
				}
				return i;
			}
			
			var rgx_UTIL = /\s*(\w+):/;
		}());
		
		// end:source ./interpolation
		// source ./object/ObjectLexer
		var ObjectLexer;
		(function(){
			
			// source ./compile.js
			var _compile;
			(function(){
				_compile = function(str, i, imax){
					if (i === void 0) {
						i = 0;
						imax = str.length;
					}
					
					var tokens = [],
						c, optional, ref, start;
					outer: for(; i < imax; i++) {
						start = i;
						c = str.charCodeAt(i);
						optional = false;
						if (63 === c /* ? */) {
							optional = true;
							start = ++i;
							c = str.charCodeAt(i);
						}
						switch(c) {
							case 32 /* */:
								tokens.push(new token_Whitespace(optional, i));
								continue;
							case 34:
							case 39 /*'"*/:
								i = cursor_quoteEnd(str, i + 1, imax, c === 34 ? '"' : "'");
								tokens.push(
									new token_String(
										_compile(str, start + 1, i)
									)
								);
								continue;
							case 36 /*$*/:
								start = ++i;
								var isExtended = false;
								if (c === str.charCodeAt(i)) {
									isExtended = true;
									start = ++i;
								}
								i = cursor_tokenEnd(str, i, imax);
								
								var name = str.substring(start, i);
								if (optional === false && isExtended === false) {
									tokens.push(new token_Var(name));
									i--;
									continue;
								}
								
								c = str.charCodeAt(i);
								if (c === 91 /*[*/) {
									i = compileArray(name, tokens, str, i, imax, optional);
									continue;
								}
								if (c === 40 /*(*/) {
									i = compileExtendedVar(name, tokens, str, i, imax);
									continue;
								}
								if (c === 60 /*<*/ ) {
									i = compileCustomVar(name, tokens, str, i, imax);
									continue;
								}
								throw_('Unexpected extended type');
								continue;
							
							case 40 /*(*/:
								if (optional === true) {
									i = compileGroup(optional, tokens, str, i, imax);
									continue;
								}
								/* fall through */
							case 44 /*,*/:
							case 41 /*)*/:
							case 91 /*[*/:
							case 93 /*]*/:
							case 123 /*{*/:
							case 125 /*}*/:
								tokens.push(new token_Punctuation(String.fromCharCode(c)));
								continue;
						}
						
						while(i < imax) {
							c = str.charCodeAt(++i);
							if (c > 32 && c !== 34 && c !== 39 && c !== 36 && c !== 44) {
								continue;
							}
							tokens.push(new token_Const(str.substring(start, i)));
							--i;
							continue outer;
						}
					}
					
					var jmax = tokens.length,
						j = -1,
						orGroup = jmax > 1,
						x;
					while(orGroup === true && ++j < jmax) {
						x = tokens[j];
						if (x instanceof token_Group === false || x.optional !== true) {
							orGroup = false;
						}
					}
					if (0 && orGroup === true) {
						tokens = [ new token_OrGroup(tokens) ];
					}
					
					return tokens;
				};
				
				function compileArray(name, tokens, str, i, imax, optional){
					var start = ++i;
					i = cursor_groupEnd(str, i, imax, 91, 93);
					var innerTokens = _compile(str, start, i);
					
					i++;
					if (str.charCodeAt(i) !== 40 /*(*/) 
						throw_('Punctuation group expected');
					
					start = ++i;
					i = cursor_groupEnd(str, i, imax, 40, 41)
					var delimiter = str.substring(start, i);
					tokens.push(
						new token_Array(
							name
							, innerTokens
							, new token_Punctuation(delimiter)
							, optional
						)
					);
					return i;
				}
				function compileExtendedVar(name, tokens, str, i, imax){
					var start = ++i;
					i = cursor_groupEnd(str, i, imax, 40, 41);
					tokens.push(
						new token_ExtendedVar(name, str.substring(start, i))
					);
					return i;
				}
				function compileCustomVar(name, tokens, str, i, imax) {
					var start = ++i;
					i = cursor_tokenEnd(str, i, imax);
					tokens.push(
						new token_CustomVar(name, str.substring(start, i))
					);
					return i;
				}
				function compileGroup(optional, tokens, str, i, imax) {
					var start = ++i;
					i = cursor_groupEnd(str, start, imax, 40, 41);
					tokens.push(
						new token_Group(_compile(str, start, i), optional)
					);
					return i;
				}
				
				function throw_(msg) {
					throw Error('Lexer pattern: ' + msg);
				}
			}());
			// end:source ./compile.js
			// source ./consume.js
			var _consume;
			(function() {
				_consume = function(tokens, str, index, length, out, isOptional){
					var index_ = index;
					var imax = tokens.length,
						i = 0, token, start;
					for(; i < imax; i++) {
						token = tokens[i];
						start = index;
						index = token.consume(str, index, length, out);
						if (index === start) {
							if (token.optional === true) {
								continue;
							}
							if (isOptional === true) {
								return index_;
							}
							// global require is also not optional: throw error
							var msg = 'Token of type `' + token.name + '`';
							if (token.token) {
								msg += ' Did you mean: `' + token.token + '`?';
							}
							parser_error(msg, str, index);
							return index_;
						}
					}
					return index;
				};
			}());
			// end:source ./consume.js
			// source ./tokens.js
			var token_Const,
				token_Var,
				token_String,
				token_Whitespace,
				token_Array,
				token_Punctuation,
				token_ExtendedVar,
				token_CustomVar,
				token_Group,
				token_OrGroup;
			(function(){
				
				token_Whitespace = create('Whitespace', {
					constructor: function(optional){
						this.optional = optional;
					},
					consume: cursor_skipWhitespace
				});
				
				// To match the string and continue, otherwise stops current consumer
				// foo
				token_Const = create('Const', {
					constructor: function(str) {
						this.token = str;
					},
					consume: function(str, i, imax){
						var end = i + this.token.length;
						str = str.substring(i, end);
						return  str === this.token ? end : i;
					}
				});
				// consume string (JS syntax) to the variable
				// $foo
				token_Var = create('Var', {
					constructor: function(name){
						this.token = name;
						this.setter = generateSetter(name);
					},
					consume: function(str, i, imax, out) {
						var end = cursor_tokenEnd(str, i, imax);
						if (end === i) 
							return i;
						
						this.setter(out, str.substring(i, end));
						return end;
					}
				});
				/* consume string to the variable
				 * - by Regexp
				 *     $$foo(\w+)
				 * - rest of the string
				 *     $$foo(*)
				 * - inside a group of chars `()` `[]` `""` `''`, etc
				 *     $$foo(*())
				 */
				token_ExtendedVar = create('ExtendedVar', {
					constructor: function(name, rgx){
						this.token = rgx;
						this.setter = generateSetter(name);
						if (rgx.charCodeAt(0) === 42) {
							// *
							if (rgx === '*') {
								this.consume = this.consumeAll;
								return;
							}
							if (rgx.length === 3) {
								this.consume = this.consumeGroup;
								return;
							}
							throw Error('`*` consumer expected group chars to parse');
						}
						this.rgx = new RegExp(rgx, 'g');
					},
					consumeAll: function(str, i, imax, out){
						this.setter(out, str.substring(i));
						return imax;
					},
					consumeGroup: function(str, i, imax, out){
						var start = this.token.charCodeAt(1),
							end   = this.token.charCodeAt(2);
						if (str.charCodeAt(i) !== start) {
							return token_Var
								.prototype
								.consume
								.call(this, str, i, imax, out);
						}
						
						var end = cursor_groupEnd(str, ++i, imax, start, end);
						if (end === i) 
							return i;
						
						this.setter(out, str.substring(i, end));
						return end + 1;
					},
					consume: function(str, i, imax, out) {
						this.rgx.lastIndex = i;
						var match = this.rgx.exec(str);
						if (match == null) 
							return i;
						
						var x = match[0];
						this.setter(out, x);
						return i + x.length;
					}
				});
				(function(){
					// Consume string with custom Stop/Continue Function to the variable
					token_CustomVar = create('CustomVar', {
						constructor: function(name, consumer) {
							this.fn = Consumers[consumer];
							this.token = name;
							this.setter = generateSetter(name);
						},
						consume: function(str, i, imax, out) {
							var start = i;
							
							var c;
							for (; i < imax; i++){
								c = str.charCodeAt(i);
								if (c === 36 || c === 95 || c === 58) {
									// $ _ :
									continue;
								}
								if ((48 <= c && c <= 57) ||		// 0-9
									(65 <= c && c <= 90) ||		// A-Z
									(97 <= c && c <= 122)) {	// a-z
									continue;
								}
								if (this.fn(c) === true) {
									continue;
								}
								break;
							}
							if (i === start) 
								return i;
							
							this.setter(out, str.substring(start, i));
							return i;
						}
					});
					
					var Consumers = {
						accessor: function(c){
							if (c === 46 /*.*/) {
								return true;
							}
							return false;
						}
					};
				}());
				
				token_String = create('String', {
					constructor: function(tokens){
						this.tokens = tokens;
					},
					consume: function(str, i, imax, out) {
						var c = str.charCodeAt(i);
						if (c !== 34 && c !== 39) 
							return i;
						
						var end = cursor_quoteEnd(str, i + 1, imax, c === 34 ? '"' : "'");
						if (this.tokens.length === 1) {
							var $var = this.tokens[0];
							out[$var.token] = str.substring(i + 1, end);
						} else {
							throw Error('Not implemented');
						}
						return ++end;
					}
				});
				token_Array = create('Array', {
					constructor: function(name, tokens, delim, optional) {
						this.token = name;
						this.delim = delim;
						this.tokens = tokens;
						this.optional = optional;
					},
					consume: function(str, i, imax, out){
						var obj, end, arr;
						while(true) {
							obj = {};
							end = _consume(this.tokens, str, i, imax, obj, this.optional);
							
							if (i === end) {
								if (arr == null) 
									return i;
								throw Error('Next item expected');
							}
							if (arr == null) 
								arr = [];
							arr.push(obj);
							i = end;
							
							end = this.delim.consume(str, i, imax);
							if (i === end) 
								break;
							i = end;
						}
						out[this.token] = arr;
						return i;
					}
				});
				token_Punctuation = create('Punc', {
					constructor: function(str){
						this.before = new token_Whitespace(true);
						this.delim = new token_Const(str);
						this.after = new token_Whitespace(true);
						this.token = str;
					},
					consume: function(str, i, imax){
						var start = this.before.consume(str, i, imax);
						var end = this.delim.consume(str, start, imax);
						if (start === end) {
							return i;
						}
						return this.after.consume(str, end, imax);
					}
				});
				token_Group = create('Group', {
					constructor: function(tokens, optional) {
						this.optional = optional;
						this.tokens = tokens;
					},
					consume: function(str, i, imax, out){
						return _consume(this.tokens, str, i, imax, out, this.optional);
					}
				});
				token_OrGroup = create('OrGroup', {
					constructor: function(groups) {
						this.groups = groups,
						this.length = groups.length;
					},
					consume: function(str, i, imax, out) {
						var start = i,
							j = 0;
						for(; j < this.length; j++) {
							i = this.groups[j].consume(str, i, imax, out);
							if (i !== start) 
								return i;
						}
						return i;
					}
				});
				
				function generateSetter(name) {
					return new Function('obj', 'val', 'obj.' + name + '= val;');
				}
				function create(name, Proto) {
					var Ctor = Proto.constructor;
					Proto.name = name;
					Proto.optional = false;
					Proto.token = null;
					Ctor.prototype = Proto;
					return Ctor;
				}
			}());
			// end:source ./tokens.js
			
			parser_ObjectLexer = ObjectLexer = function(pattern){
				if (arguments.length === 1 && typeof pattern === 'string') {
					return ObjectLexer_single(pattern);
				}
				return ObjectLexer_sequance(Array.prototype.slice.call(arguments));
			};
			
			function ObjectLexer_single (pattern){
				var tokens = _compile(pattern);
				return function(str, i, imax, out, optional){
					return _consume(tokens, str, i, imax, out, optional);
				};	
			}
		
			var ObjectLexer_sequance;
			(function(){
				ObjectLexer_sequance = function(args) {
					var jmax = args.length,
						j = -1;
					while( ++j < jmax ) {
						args[j] = __createConsumer(args[j]);
					}
					return function(str, i, imax, out, optional){
						var start;
						j = -1;
						while( ++j < jmax ) {
							start = i;
							i = __consume(args[j], str, i, imax, out, optional);
							if (i === start) 
								return start;
						}
						return i;
					}
				};
				function __consume(x, str, i, imax, out, optional) {
					if (typeof x === 'function') {
						return x(str, i, imax, out, optional);
					}
					return __consumeOptionals(x, str, i, imax, out, optional);
				}
				function __consumeOptionals(arr, str, i, imax, out, optional) {
					var start = i,
						jmax = arr.length,
						j = -1;
					while( ++j < jmax ){
						i = arr[j](str, i, imax, out, true);
						if (start !== i) 
							return i;
					}
					if (optional !== true) {
						// notify
						arr[0](str, start, imax, out, optional);
					}
					return start;
				}
				function __createConsumer(mix) {
					if (typeof mix === 'string') {
						return ObjectLexer_single(mix);
					}
					// else Array<string>
					var i = mix.length;
					while(--i > -1) mix[i] = ObjectLexer_single(mix[i]);
					return mix;
				}
			}());
			
		}());
		// end:source ./object/ObjectLexer
		// source ./parsers/var
		(function(){
			custom_Parsers['var'] = function(str, index, length, parent){
				var node = new VarNode('var', parent),
					start,
					c;
				
				var go_varName = 1,
					go_assign = 2,
					go_value = 3,
					go_next = 4,
					state = go_varName,
					token,
					key;
				while(true) {
					if (index < length && (c = str.charCodeAt(index)) < 33) {
						index++;
						continue;
					}
					
					if (state === go_varName) {
						start = index;
						index = cursor_refEnd(str, index, length);
						key = str.substring(start, index);
						state = go_assign;
						continue;
					}
					
					if (state === go_assign) {
						if (c !== 61 ) {
							// =
							parser_error(
								'Assignment expected'
								, str
								, index
								, c
								, 'var'
							);
							return [node, index];
						}
						state = go_value;
						index++;
						continue;
					}
					
					if (state === go_value) {
						start = index;
						index++;
						switch(c){
							case 123:
							case 91:
								// { [
								index = cursor_groupEnd(str, index, length, c, c + 2);
								break;
							case 39:
							case 34:
								// ' "
								index = cursor_quoteEnd(str, index, length, c === 39 ? "'" : '"')
								break;
							default:
								while (index < length) {
									c = str.charCodeAt(index);
									if (c === 44 || c === 59) {
										//, ;
										break;
									}
									index++;
								}
								index--;
								break;
						}
						index++;
						node.attr[key] = str.substring(start, index);
						state = go_next;
						continue;
					}
					if (state === go_next) {
						if (c === 44) {
							// ,
							state = go_varName;
							index++;
							continue;
						}
						break;
					}
				}
				return [node, index, 0];
			};
			
			var VarNode = class_create(Dom.Node, {
				stringify: function() {
					var attr = this.attr;
					var str = 'var ';
					for(var key in attr){
						if (str !== 'var ') 
							str += ',';
						
						str += key + '=' + attr[key];
					}
					return str + ';';
				},
				getObject: function(model, ctx, ctr){
					var obj = {},
						attr = this.attr,
						key;
					for(key in attr) {
						obj[key] = expression_eval(attr[key], model, ctx, ctr);
					}
					return obj;
				}
			});
		}());
		// end:source ./parsers/var
		// source ./parsers/content
		(function(){
			
			// source content/style
			var Style;
			(function () {
				Style = {
					transform: function(body, attr, parent) {
						if (attr.self != null) {
							var style = parent.attr.style;
							parent.attr.style = parser_ensureTemplateFunction((style || '') + body);
							return null;
						}
						
						var str = body;
						if (attr.scoped) {
							attr.scoped = null;
							str = style_scope(str, parent);
						}
						
						str = style_transformHost(str, parent);
						return str;
					}
				}
				
				var style_scope,
					style_transformHost;
				(function(){
					var counter = 0;
					var rgx_selector = /^([\s]*)([^\{\}]+)\{/gm;
					var rgx_host = /^([\s]*):host\s*(\(([^)]+)\))?\s*\{/gm;
					
					style_scope = function(css, parent){
						var id;
						return css.replace(rgx_selector, function(full, pref, selector){
							if (selector.indexOf(':host') !== -1) 
								return full;
							
							if (id == null) 
								id = getId(parent);
							
							var arr = selector.split(','),
								imax = arr.length,
								i = 0;
							for(; i < imax; i++) {
								arr[i] = id + ' ' + arr[i];
							}
							selector = arr.join(',');
							return pref + selector + '{';
						});
					};
					
					style_transformHost = function(css, parent) {
						var id;
						return css.replace(rgx_host, function(full, pref, ext, expr){
							
							return pref
								+ (id || (id = getId(parent)))
								+ (expr || '')
								+ '{';
						});
					};
					
					function getId(parent) {
						if (parent == null) {
							log_warn('"style" should be inside elements node');
							return '';
						}
						var id = parent.attr.id;
						if (id == null) {
							id = parent.attr.id = 'scoped__css__' + (++counter);
						}
						return '#' + id;
					}
				}());
			}());
			// end:source content/style
			
			custom_Parsers['style' ] = createParser('style', Style.transform);
			custom_Parsers['script'] = createParser('script');
			
			custom_Tags['style' ] = createHandler('style');
			custom_Tags['script'] = createHandler('script');
			
			var ContentNode = class_create(Dom.Node, {
				content: null,
				
				stringify: function (stream) {
					stream.processHead(this);
					
					var body = this.content;
					if (body == null) {
						stream.print(';');
						return;
					}
					if (is_Function(body)) {
						body = body();
					}
					
					stream.openBlock('{');
					stream.print(body);
					stream.closeBlock('}');
					return;
				}
			});
			
			function createParser(name, transform) {
				return function (str, i, imax, parent) {
					var start = i,
						end,
						attr,
						hasBody,
						body,
						c;
						
					while(i < imax) {
						c = str.charCodeAt(i);
						if (c === 123 || c === 59 || c === 62) {
							//{;>
							break;
						}
						i++;
					}
					
					attr = parser_parseAttr(str, start, i);
					for (var key in attr) {
						attr[key] = parser_ensureTemplateFunction(attr[key]);
					}
					
					if (c === 62) {
						var nextI = cursor_skipWhitespace(str, i + 1, imax);
						var nextC = str.charCodeAt(nextI);
						if (nextC !== 34 && nextC !== 39){
							// "'
							var node = new Dom.Node(name, parent);
							node.attr = attr;
							// `>` handle single without literal as generic mask node
							return [ node, i, go_tag ];
						}
					}
					
					end = i;
					hasBody = c === 123 || c === 62;
					
					if (hasBody) {
						i++;
						if (c === 123) {
							end = cursor_groupEnd(str, i, imax, 123, 125); //{}
							body = str.substring(i, end);
						}
						if (c === 62) {
							var tuple = parser_parseLiteral(str, i, imax);
							if (tuple == null) {
								return null;
							}
							end = tuple[1];
							body = tuple[0];
							// move cursor one back to be consistance with the group
							end -= 1;
						}
						
						if (transform != null) {
							body = transform(body, attr, parent);
							if (body == null) {
								return [ null, end + 1 ];
							}
						}
						
						body = preprocess(name, body);
						if (name !== 'script') {
							body = parser_ensureTemplateFunction(body);
						}
					}
					
					var node = new ContentNode(name, parent);
					node.content = body;
					node.attr = attr;
					return [ node, end + 1, 0 ];
				};
			}
			
			function createHandler(name) {
				return class_create(customTag_Base, {
					meta: {
						mode: 'server'
					},
					body : null,
					
					constructor: function(node, model, ctx, el, ctr){
						var content = node.content;
						if (content == null && node.nodes) {
							var x = node.nodes[0];
							if (x.type === Dom.TEXTNODE) {
								content = x.content;
							} else {
								content = jmask(x.nodes).text(model, ctr);
							}
						}
						
						this.body = is_Function(content)
							? content('node', model, ctx, el, ctr)
							: content
							;
					},		
					render: function(model, ctx, container) {
						var el = document.createElement(name),
							body = this.body,
							attr = this.attr;
						el.textContent = body; 
						for(var key in attr) {
							var val =  attr[key];
							if (val != null) {
								el.setAttribute(key, val);
							}
						}
						container.appendChild(el);
					}
				});
			}
			
			function preprocess(name, body) {
				var fn = __cfg.preprocessor[name];
				if (fn == null) {
					return body;
				}
				var result = fn(body);
				if (result == null) {
					log_error('Preprocessor must return a string');
					return body;
				}
				return result;
			}
		}());
		// end:source ./parsers/content
		// source ./parsers/import
		(function(){
			var IMPORT  = 'import',
				IMPORTS = 'imports';
			
			custom_Parsers[IMPORT] = function(str, i, imax, parent){
				var obj = {
					exports: null,
					alias: null,
					path: null
				};
				var end = lex_(str, i, imax, obj);
				return [ new ImportNode(parent, obj),  end, 0 ];
			};
			custom_Parsers_Transform[IMPORT] = function(current) {
				if (current.tagName === IMPORTS) {
					return null;
				}
				var imports = new ImportsNode('imports', current);
				current.appendChild(imports);
				return imports;
			};
			
			var lex_ = ObjectLexer(
				[ 'from "$path"?( is $contentType)'
				, '* as $alias from "$path"?( is $contentType)'
				, '$$exports[$name?( as $alias)](,) from "$path"?( is $contentType)'
				]
			);
			
			var ImportsNode = class_create(Dom.Node, {
				stringify: function (stream) {
					stream.process(this.nodes);
				}
			});
			
			var ImportNode = class_create({
				type: Dom.COMPONENT,
				tagName: IMPORT,
				
				path: null,
				exports: null,
				alias: null,
				
				constructor: function(parent, data){
					this.path = data.path;
					this.alias = data.alias;
					this.exports = data.exports;
					this.contentType = data.contentType;
					this.parent = parent;
				},
				stringify: function(){
					var from = " from '" + this.path + "'";
					
					var type = this.contentType;
					if (type != null) {
						from += ' is ' + type;
					}
					from += ';';
					
					if (this.alias != null) {
						return IMPORT + " * as " + this.alias + from;
					}
					if (this.exports != null) {
						var arr = this.exports,
							str = '',
							imax = arr.length,
							i = -1, x; 
						while( ++i < imax ){
							x = arr[i];
							str += x.name;
							if (x.alias) {
								str += ' as ' + x.alias;
							}
							if (i !== imax - 1) {
								str +=', ';
							}
						}
						return IMPORT + ' ' + str + from;
					}
					return IMPORT + from;
				}
			});
			
		}());
		// end:source ./parsers/import
		// source ./parsers/define
		(function(){
			createParser('define');
			createParser('let');
			
			function createParser (tagName) {
				custom_Parsers[tagName] = function(str, i, imax, parent){
					var node = new DefineNode(tagName, parent);
					var end = lex_(str, i, imax, node);
					return [ node,  end, go_tag ];
				};
			}
			var lex_ = ObjectLexer(
				'$name'
				, '?( as $$as(*()))?( extends $$extends[$$compo<accessor>](,))'
				, '{'
			);
			var DefineNode = class_create(Dom.Node, {
				'name': null,
				'extends': null,
				'as': null,
				
				stringify: function(stream){
					var extends_ = this['extends'],
						as_ = this['as'],
						str = '';
					if (as_ != null && as_.length !== 0) {
						str += ' as (' + as_ + ')';
					}
					if (extends_ != null && extends_.length !== 0) {
						str += ' extends ';
						var imax = extends_.length,
							i = -1, x;
						while( ++i < imax ){
							str += extends_[i].compo;
							if (i < imax - 1) 
								str += ', ';
						}
					}
					
					var head = this.tagName + ' ' + this.name + str;
					stream.write(head)
					stream.openBlock('{');
					stream.process(this.nodes);
					stream.closeBlock('}');
				},
			});
			
		}());
		// end:source ./parsers/define
		// source ./parsers/methods
		(function(){	
			function create(tagName){
				return function(str, i, imax, parent) {
					var start = str.indexOf('{', i) + 1,
						head = parseHead(
							tagName, str.substring(i, start - 1)
						);
					if (head == null) {
						parser_error('Method head syntax error', str, i);
					}
					var end = cursor_groupEnd(str, start, imax, 123, 125),
						body = str.substring(start, end),
						node = head == null
							? null
							: new MethodNode(tagName, head.name, head.args, body, parent)
						;
					return [ node, end + 1, 0 ];
				};
			}
			
			function parseHead(name, str) {
				var parts = /([^\(\)\n]+)\s*(\(([^\)]*)\))?/.exec(str);
				if (parts == null) {
					return null;
				}
				var methodName = parts[1].trim();		
				var str = parts[3],
					methodArgs = str == null ? [] : str.replace(/\s/g, '').split(',');
				return new MethodHead(methodName, methodArgs);
			}
			function MethodHead(name, args) {
				this.name = name;
				this.args = args;
			}
			function compileFn(args, body, sourceUrl) {
				var arr = _Array_slice.call(args);
				var compile = __cfg.preprocessor.script;
				if (compile != null) {
					body = compile(body);
				}
				if (sourceUrl != null) {
					body += '\n//# sourceURL=' + sourceUrl
				}
				arr.push(body);			
				return new (Function.bind.apply(Function, [null].concat(arr)));
			}
			
			var MethodNode = class_create(Dom.Component.prototype, {
				'name': null,
				'body': null,
				'args': null,
				
				'fn': null,
				
				constructor: function(tagName, name, args, body, parent){
					this.tagName = tagName;
					this.name = name;
					this.args = args;
					this.body = body;
					this.parent = parent;
					
					var sourceUrl = null;
					//if DEBUG
					var ownerName = parent.tagName;
					if (ownerName === 'let' || ownerName === 'define') {
						ownerName += '_' + parent.name;
					}
					sourceUrl = constructSourceUrl(tagName, name, parent);
					//endif
					this.fn = compileFn(args, body, sourceUrl);
				},
				stringify: function(stream){
					var head = this.tagName
						+ ' '
						+ this.name
						+ '('
						+ this.args.join(',')
						+ ')';
					stream.write(head);
					stream.openBlock('{');
					stream.print(this.body);
					stream.closeBlock('}');
				}
			});
			
			var constructSourceUrl;
			(function(){
				constructSourceUrl = function (methodType, methodName, owner) {
					var ownerName = owner.tagName,
						parent = owner,
						stack = '',
						tag;
					while(parent != null) {
						tag = parent.tagName;
						if ('let' === tag || 'define' === tag) {
							if (stack !== '') {
								stack = '.' + stack;
							}
							stack = parent.name + stack;
						}
						parent = parent.parent;
					}
					if ('let' !== ownerName && 'define' !== ownerName) {
						if (stack !== '') {
							stack += '_';
						}
						stack += ownerName
					}
					var url = stack + '_' + methodType + '_' + methodName;
					var index = null
					if (_sourceUrls[url] !== void 0) {
						index = ++_sourceUrls[url];
					}
					if (index != null) {
						url += '_' + index;
					}
					_sourceUrls[url] = 1;
					return 'dynamic://MaskJS/' + url;
				};
				var _sourceUrls = {};
			}());
			
			custom_Parsers['slot' ]    = create('slot');
			custom_Parsers['event']    = create('event');
			custom_Parsers['function'] = create('function');
		}());
		
		// end:source ./parsers/methods
		// source ./html/parser
		(function () {
			var state_closeTag = 21;
			
			/**
			 * Parse **Html** template to the AST tree
			 * @param {string} template - Html Template
			 * @returns {MaskNode}
			 * @memberOf mask
			 * @method parseHtml
			 */	
			parser_parseHtml = function(str) {
				var current = new Fragment(),
					fragment = current,
					state = go_tag,
					i = 0,
					imax = str.length,
					token,
					c, // charCode
					start;
			
				outer: while (i <= imax) {
					i = cursor_skipWhitespace(str, i, imax);
					
					if (state === state_attr) {
						i = parser_parseAttrObject(str, i, imax, current.attr);
						if (i === imax) {
							break;
						}
						handleNodeAttributes(current);
						
						switch (char_(str, i)) {
							case 47:  // /
								current = current.parent;
								i = until_(str, i, imax, 62);
								i++;
								break;
							case 62: // >
								if (SINGLE_TAGS[current.tagName.toLowerCase()] === 1) {
									current = current.parent;
								}
								break;
						}
						i++;
						if (current.tagName === 'mask') {
							start = i;
							i = str.indexOf('</mask>', start);
							var mix = parser_parse(str.substring(start, i));
							var nodes = current.parent.nodes;
							nodes.splice(nodes.length - 1, 1);
							current = current.parent;
							if (mix.type === Dom.FRAGMENT) {
								_appendMany(current, mix.nodes);
							} else {
								current.appendChild(mix);
							}
							i += 7; //</mask> @TODO proper </mask> search
						}
						
						state = state_literal;
						continue outer;
					}
					c = char_(str, i);
					if (c === 60) {
						//<
						c = char_(str, ++i)
						if (c === 33 &&
							char_(str, i + 1) === 45 &&
							char_(str, i + 2) === 45) {
							//!--
							// COMMENT
							i = str.indexOf('-->', i + 3) + 3;
							if (i === 2) {
								// if DEBUG
								parser_warn('Comment has no ending', str, i);
								// endif
								i = imax;
							}
							continue;
						}
						if (c < 33) {
							i = cursor_skipWhitespace(str, i, imax);
						}
						c = char_(str, i, imax);
						if (c === 47 /*/*/) {
							state = state_closeTag;
							i++;
							i = cursor_skipWhitespace(str, i, imax);
						}
						
						start = i;
						i = cursor_tokenEnd(str, i + 1, imax);
						token = str.substring(start, i);
						
						if (state === state_closeTag) {
							current = tag_Close(current, token.toLowerCase());
							state   = state_literal;
							i   = until_(str, i, imax, 62 /*>*/);
							i   ++;
							continue;
						}
						// open tag
						current = tag_Open(token, current);
						state = state_attr;
						continue;
					}
					
					// LITERAL
					start = i;
					token = '';
					while(i <= imax) {
						c = char_(str, ++i);
						if (c === 60 /*<*/) {
							// MAYBE NODE
							c = char_(str, i + 1);
							if (c === 36 || c === 95 || c === 58 || 43) {
								// $ _ : +
								break;
							}
							if ((65 <= c && c <= 90) ||		// A-Z
								(97 <= c && c <= 122)) {	// a-z
								break;
							}
						}
						if (c === 38 /*&*/) {
							// ENTITY
							var Char = null;
							var ent  = null;
							ent = unicode_(str, i + 1);
							if (ent != null) {
								Char = unicode_toChar(ent);
							} else {
								ent = entity_(str, i + 1);
								if (ent != null) {
									Char = entity_toChar(ent);
								}
							}
							if (Char != null) {
								token += str.substring(start, i) + Char;
								start = i + ent.length + 1 /*;*/;
							}
						}
					}
					token += str.substring(start, i);
					if (token !== '') {
						token = parser_ensureTemplateFunction(token);
						current.appendChild(new TextNode(token, current));
					}
				}
				
					
				
				var nodes = fragment.nodes;
				return nodes != null && nodes.length === 1
					? nodes[0]
					: fragment
					;
			};
			
			
			function char_(str, i) {
				return str.charCodeAt(i);
			}
			function until_(str, i, imax, c) {
				for(; i < imax; i++) {
					if (c === char_(str, i)) {
						return i;
					}
				}
				return i;
			}
			function unicode_(str, i, imax) {
				var lim = 7,
					c = char_(str, i);
				if (c !== 35 /*#*/) {
					return null;
				}
				var start = i + 1;
				while (++i < imax) {
					if (--lim === 0) {
						return null;
					}
					c = char_(str, i);
					if (48 <= c && c <= 57 /*0-9*/) {
						continue;
					}
					if (65 <= c && c <= 70 /*A-F*/) {
						continue;
					}
					if (c === 120 /*x*/) {
						continue;
					}
					if (c === 59 /*;*/) {
						return str.substring(start, i);
					}
					break;
				}
				return null;
			}
			function unicode_toChar(unicode) {
				var num = Number('0' + unicode);
				if (num !== num) {
					parser_warn('Invalid Unicode Char', unicode);
					return '';
				}
				return String.fromCharCode(num);
			}
			function entity_(str, i, imax) {
				var lim = 10,
					start = i;
				for(; i < imax; i++, lim--) {
					if (lim === 0) {
						return null;
					}
					var c = char_(str, i);
					if (c === 59 /*;*/) {
						break;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						i++;
						continue;
					}
					return null;
				}
				return str.substring(start, i);
			}
			
			var entity_toChar;
			(function (d) {
				
				//if BROWSER
				if (d == null) {
					return;
				}
				var i = d.createElement('i');
				entity_toChar = function(ent){
					i.innerHTML = '&' + ent + ';';
					return i.textContent;
				};
				//endif
				
		
			}(document));
			
			var SINGLE_TAGS = {
				area  : 1,
				base  : 1,
				br    : 1,
				col   : 1,
				embed : 1,
				hr    : 1,
				img   : 1,
				input : 1,
				keygen: 1,
				link  : 1,
				menuitem: 1,
				meta  : 1,
				param : 1,
				source: 1,
				track : 1,
				wbr   : 1
			};
			var IMPLIES_CLOSE;
			(function(){
				var formTags = {
					input: 1,
					option: 1,
					optgroup: 1,
					select: 1,
					button: 1,
					datalist: 1,
					textarea: 1
				};
				IMPLIES_CLOSE = {
					tr      : { tr:1, th:1, td:1 },
					th      : { th:1 },
					td      : { thead:1, td:1 },
					body    : { head:1, link:1, script:1 },
					li      : { li:1 },
					p       : { p:1 },
					h1      : { p:1 },
					h2      : { p:1 },
					h3      : { p:1 },
					h4      : { p:1 },
					h5      : { p:1 },
					h6      : { p:1 },
					select  : formTags,
					input   : formTags,
					output  : formTags,
					button  : formTags,
					datalist: formTags,
					textarea: formTags,
					option  : { option:1 },
					optgroup: { optgroup:1 }
				};
			}());
			
			function tag_Close(current, name) {
				if (SINGLE_TAGS[name] === 1) {
					// donothing
					return current;
				}
				
				var x = current;
				while(x != null) {
					if (x.tagName != null && x.tagName.toLowerCase() === name) {
						break;
					}
					x = x.parent;
				}
				if (x == null) {
					parser_warn('Unmatched closing tag', name);
					return current;
				}
				return x.parent || x;
			}
			function tag_Open(name, current) {
				var node = current;
				var TAGS = IMPLIES_CLOSE[name];
				if (TAGS != null) {
					while (node.parent != null && node.parent.tagName && TAGS[node.parent.tagName.toLowerCase()] === 1) {
						node = node.parent;
					}
				}
				
				var next = new Node(name, node);
				node.appendChild(next);
				return next;
			}
			
			function handleNodeAttributes(node) {
				var obj = node.attr,
					key, val;
				for(key in obj) {
					val = obj[key];
					if (val != null && val !== key) {
						obj[key] = parser_ensureTemplateFunction(val);
					}
				}
				if (obj.expression != null) {
					node.expression = obj.expression;
					node.type = Dom.STATEMENT;
				}
			}
			
			function _appendMany(node, nodes) {
				arr_each(nodes, function(x){
					node.appendChild(x)
				});
			}
		}());
		// end:source ./html/parser
		// source ./mask/parser
		(function(){
			
			/**
			 * Parse **Mask** template to the AST tree
			 * @param {string} template - Mask Template
			 * @returns {MaskNode}
			 * @memberOf mask
			 * @method parse
			 */
			parser_parse = function(template) {
				var current = new Fragment(),
					fragment = current,
					state = go_tag,
					last = state_tag,
					index = 0,
					length = template.length,
					classNames,
					token,
					tokenIndex,
					key,
					value,
					next,
					c, // charCode
					start,
					nextC;
				
				fragment.source = template;
				outer: while (true) {
					
					while (index < length && (c = template.charCodeAt(index)) < 33) {
						index++;
					}
			
					// COMMENTS
					if (c === 47) {
						// /
						nextC = template.charCodeAt(index + 1);
						if (nextC === 47){
							// inline (/)
							index++;
							while (c !== 10 && c !== 13 && index < length) {
								// goto newline
								c = template.charCodeAt(++index);
							}
							continue;
						}
						if (nextC === 42) {
							// block (*)
							index = template.indexOf('*/', index + 2) + 2;
							if (index === 1) {
								// if DEBUG
								parser_warn('Block comment has no ending', template, index);
								// endif
								index = length;
							}
							continue;
						}
					}
			
					if (last === state_attr) {
						if (classNames != null) {
							current.attr['class'] = parser_ensureTemplateFunction(classNames);
							classNames = null;
						}
						if (key != null) {
							current.attr[key] = key;
							key = null;
							token = null;
						}
					}
			
					if (token != null) {
			
						if (state === state_attr) {
			
							if (key == null) {
								key = token;
							} else {
								value = token;
							}
			
							if (key != null && value != null) {
								if (key !== 'class') {
									current.attr[key] = value;
								} else {
									classNames = classNames == null ? value : classNames + ' ' + value;
								}
			
								key = null;
								value = null;
							}
			
						} else if (last === state_tag) {
			
							//next = custom_Tags[token] != null
							//	? new Component(token, current, custom_Tags[token])
							//	: new Node(token, current);
							var parser = custom_Parsers[token];
							if (parser != null) {
								// Parser should return: [ parsedNode, nextIndex, nextState ]
								var tuple = parser(
									template
									, index
									, length
									, current
								);
								var node = tuple[0],
									nextState = tuple[2];
									
								index = tuple[1];
								state = nextState === 0
									? go_tag
									: nextState;
								if (node != null) {
									node.sourceIndex = tokenIndex;
									
									var transform = custom_Parsers_Transform[token];
									if (transform != null) {
										var x = transform(current, node);
										if (x != null) {
											// make the current node single, to exit this and the transformed node on close
											current.__single = true;
											current = x;
										}
									}
									
									current.appendChild(node);
									if (nextState !== 0) {
										current = node;
									} else {
										if (current.__single === true) {
											do {
												current = current.parent;
											} while (current != null && current.__single != null);
										}
									}
								}
								token = null;
								continue;
							}
							
							
							next = new Node(token, current);
							next.sourceIndex = tokenIndex;
							
							current.appendChild(next);
							current = next;
							state = state_attr;
			
						} else if (last === state_literal) {
			
							next = new TextNode(token, current);
							current.appendChild(next);
							
							if (current.__single === true) {
								do {
									current = current.parent;
								} while (current != null && current.__single != null);
							}
							state = go_tag;
			
						}
			
						token = null;
					}
			
					if (index >= length) {
						if (state === state_attr) {
							if (classNames != null) {
								current.attr['class'] = parser_ensureTemplateFunction(classNames);
							}
							if (key != null) {
								current.attr[key] = key;
							}
						}
						c = null;
						break;
					}
			
					if (state === go_up) {
						current = current.parent;
						while (current != null && current.__single != null) {
							current = current.parent;
						}
						if (current == null) {
							current = fragment;
							parser_warn(
								'Unexpected tag closing'
								, template
								, cursor_skipWhitespaceBack(template, index - 1)
							);
						}
						state = go_tag;
					}
			
					switch (c) {
					case 123:
						// {
						last = state;
						state = go_tag;
						index++;
						continue;
					case 62:
						// >
						last = state;
						state = go_tag;
						index++;
						current.__single = true;
						continue;
					case 59:
						// ;
						if (current.nodes != null) {
							// skip ; , when node is not a single tag (else goto 125)
							index++;
							continue;
						}
						/* falls through */
					case 125:
						// ;}
						if (c === 125 && (state === state_tag || state === state_attr)) {
							// single tag was not closed with `;` but closing parent
							index--;
						}
						index++;
						last = state;
						state = go_up;
						continue;
					case 39:
					case 34:
						// '"
						// Literal - could be as textnode or attribute value
						if (state === go_attrVal) {
							state = state_attr;
						} else {
							last = state = state_literal;
						}
						index++;
			
						var isEscaped = false,
							isUnescapedBlock = false,
							_char = c === 39 ? "'" : '"';
			
						start = index;
			
						while ((index = template.indexOf(_char, index)) > -1) {
							if (template.charCodeAt(index - 1) !== 92 /*'\\'*/ ) {
								break;
							}
							isEscaped = true;
							index++;
						}
						if (index === -1) {
							parser_warn('Literal has no ending', template, start - 1);
							index = length;
						}
						
						if (index === start) {
							nextC = template.charCodeAt(index + 1);
							if (nextC === 124 || nextC === c) {
								// | (obsolete) or triple quote
								isUnescapedBlock = true;
								start = index + 2;
								index = template.indexOf((nextC === 124 ? '|' : _char) + _char + _char, start);
			
								if (index === -1) 
									index = length;
							}
						}
			
						tokenIndex = start;
						token = template.substring(start, index);
						
						if (isEscaped === true) {
							token = token.replace(__rgxEscapedChar[_char], _char);
						}
						
						if (state !== state_attr || key !== 'class') {
							token = parser_ensureTemplateFunction(token);
						}
						index += isUnescapedBlock ? 3 : 1;
						continue;
					}
			
					if (state === go_tag) {
						last = state_tag;
						state = state_tag;
						//next_Type = Dom.NODE;
						
						if (c === 46 /* . */ || c === 35 /* # */ ) {
							tokenIndex = index;
							token = 'div';
							continue;
						}
						
						//-if (c === 58 || c === 36 || c === 64 || c === 37) {
						//	// : /*$ @ %*/
						//	next_Type = Dom.COMPONENT;
						//}
						
					}
			
					else if (state === state_attr) {
						if (c === 46) {
							// .
							index++;
							key = 'class';
							state = go_attrHeadVal;
						}
						
						else if (c === 35) {
							// #
							index++;
							key = 'id';
							state = go_attrHeadVal;
						}
						
						else if (c === 61) {
							// =;
							index++;
							state = go_attrVal;
							
							if (last === state_tag && key == null) {
								parser_warn('Unexpected tag assignment', template, index, c, state);
							}
							continue;
						}
						
						else if (c === 40) {
							// (
							start = 1 + index;
							index = 1 + cursor_groupEnd(template, start, length, c, 41 /* ) */);
							current.expression = template.substring(start, index - 1);
							current.type = Dom.STATEMENT;
							continue;
						}
						
						else {
			
							if (key != null) {
								tokenIndex = index;
								token = key;
								continue;
							}
						}
					}
			
					if (state === go_attrVal || state === go_attrHeadVal) {
						last = state;
						state = state_attr;
					}
			
			
			
					/* TOKEN */
			
					var isInterpolated = false;
			
					start = index;
					while (index < length) {
			
						c = template.charCodeAt(index);
			
						if (c === interp_code_START) {
							var nextC = template.charCodeAt(index + 1);
							if (nextC === interp_code_OPEN) {
								isInterpolated = true;
								index = 1 + cursor_groupEnd(
									template
									, index + 2
									, length
									, interp_code_START
									, interp_code_CLOSE
								);
								c = template.charCodeAt(index);
							}
							else if ((nextC >= 65 && nextC <= 122) || nextC === 36 || nextC === 95) {
								//A-z$_
								isInterpolated = true;
							}
						}
						if (c === 64 && template.charCodeAt(index + 1) === 91) {
							//@[
							index = cursor_groupEnd(template, index + 2, length, 91, 93) + 1;
							c = template.charCodeAt(index);
						}
			
						// if DEBUG
						if (c === 0x0027 || c === 0x0022 || c === 0x002F || c === 0x003C || c === 0x002C) {
							// '"/<,
							parser_error('Unexpected char', template, index, c, state);
							break outer;
						}
						// endif
			
			
						if (last !== go_attrVal && (c === 46 || c === 35)) {
							// .#
							// break on .# only if parsing attribute head values
							break;
						}
			
						if (c < 33 ||
							c === 61 ||
							c === 62 ||
							c === 59 ||
							c === 40 ||
							c === 123 ||
							c === 125) {
							// =>;({}
							break;
						}
						index++;
					}
			
					token = template.substring(start, index);
					tokenIndex = start;
					if (token === '') {
						parser_warn('String expected', template, index, c, state);
						break;
					}
					
					if (isInterpolated === true) {
						if (state === state_tag) {
							parser_warn('Invalid interpolation (in tag name)'
								, template
								, index
								, token
								, state);
							break;
						}
						if (state === state_attr) {
							if (key === 'id' || last === go_attrVal) {
								token = parser_ensureTemplateFunction(token);
							}
							else if (key !== 'class') {
								// interpolate class later
								parser_warn('Invalid interpolation (in attr name)'
									, template
									, index
									, token
									, state);
								break;
							}
						}
					}
				}
			
				if (c !== c) {
					parser_warn('IndexOverflow'
						, template
						, index
						, c
						, state
					);
				}
			
				// if DEBUG
				var parent = current.parent;
				if (parent != null &&
					parent !== fragment &&
					parent.__single !== true &&
					current.nodes != null &&
					parent.tagName !== 'imports') {
					parser_warn('Tag was not closed: ' + current.tagName, template)
				}
				// endif
			
				
				var nodes = fragment.nodes;
				return nodes != null && nodes.length === 1
					? nodes[0]
					: fragment
					;
			};
			
			
		}());
		
		// end:source ./mask/parser
		// source ./mask/partials/attributes
		(function(){
			
			parser_parseAttr = function(str, start, end){
				var attr = {},
					i = start,
					key, val, c;
				while(i < end) {
					i = cursor_skipWhitespace(str, i, end);
					if (i === end) 
						break;
					
					start = i;
					for(; i < end; i++){
						c = str.charCodeAt(i);
						if (c === 61 || c < 33) break;
					}
					
					key = str.substring(start, i);
					
					i = cursor_skipWhitespace(str, i, end);
					if (i === end) {
						attr[key] = key;
						break;
					}
					if (str.charCodeAt(i) !== 61 /*=*/) {
						attr[key] = key;
						continue;
					}
					
					i = start = cursor_skipWhitespace(str, i + 1, end);
					c = str.charCodeAt(i);
					if (c === 34 || c === 39) {
						// "|'
						i = cursor_quoteEnd(str, i + 1, end, c === 39 ? "'" : '"');
						
						attr[key] = str.substring(start + 1, i);
						i++;
						continue;
					}
					i = cursor_goToWhitespace(str, i, end);
					attr[key] = str.substring(start, i);
				}
				return attr;
			};
			
			parser_parseAttrObject = function(str, i, imax, attr){
				var state_KEY = 1,
					state_VAL = 2,
					state_END = 3,
					state = state_KEY,
					token, index, key, c;
					
				outer: while(i < imax) {
					i = cursor_skipWhitespace(str, i, imax);
					if (i === imax) 
						break;
					
					index = i;
					c = str.charCodeAt(i);
					switch (c) {
						case 61 /* = */:
							i++;
							state = state_VAL;
							continue outer;
						case 123:
						case 59:
						case 62:
						case 47:
							// {;>/
							state = state_END;
							break;
						case 40:
							//()
							i = cursor_groupEnd(str, ++index, imax, 40, 41);
							if (key != null) {
								attr[key] = key;
							}
							key = 'expression';
							token = str.substring(index, i);
							i++;
							state = state_VAL;
							break;
						case 39:
						case 34:
							//'"
							i = cursor_quoteEnd(str, ++index, imax, c === 39 ? "'" : '"');
							token = str.substring(index, i);
							i++;
							break;
						default:
							i++;
							for(; i < imax; i++){
								c = str.charCodeAt(i);
								if (c < 33 || c === 61 || c === 123 || c === 59 || c === 62 || c === 47) {
									// ={;>/
									break;
								}
							}
							token = str.substring(index, i);
							break;
					}
					
					if (token === '') {
						parser_warn('Token not readable', str, i);
						i++;
						continue;
					}
					
					if (state === state_VAL) {
						attr[key] = token;
						state = state_KEY;
						key = null;
						continue;
					}
					if (key != null) {
						attr[key] = key;
						key = null;
					}
					if (state === state_END) {
						break;
					}
					key = token;
				}
				return i;
			};
			
		}());
		// end:source ./mask/partials/attributes
		// source ./mask/partials/literal
		(function(){
			parser_parseLiteral = function(str, start, imax){
				var i = cursor_skipWhitespace(str, start, imax);
				
				var c = str.charCodeAt(i);
				if (c !== 34 && c !== 39) {
					// "'
					parser_error("A quote is expected", str, i);
					return null;
				}
				
				var isEscaped = false,
					isUnescapedBlock = false,
					_char = c === 39 ? "'" : '"';
		
				start = ++i;
		
				while ((i = str.indexOf(_char, i)) > -1) {
					if (str.charCodeAt(i - 1) !== 92 /*'\\'*/ ) {
						break;
					}
					isEscaped = true;
					i++;
				}
				
				if (i === -1) {
					parser_warn('Literal has no ending', str, start - 1);
					i = imax;
				}
				
				if (i === start) {
					var nextC = str.charCodeAt(i + 1);
					if (nextC === c) {
						isUnescapedBlock = true;
						start = i + 2;
						i = str.indexOf(_char + _char + _char, start);
						if (i === -1) 
							i = imax;
					}
				}
		
				var token = str.substring(start, i);
				if (isEscaped === true) {
					token = token.replace(__rgxEscapedChar[_char], _char);
				}
				i += isUnescapedBlock ? 3 : 1;
				return [ token, i ];
			};	
		}());
		// end:source ./mask/partials/literal
	
		
	}(Dom.Node, Dom.TextNode, Dom.Fragment, Dom.Component));
	
	// end:source parser/
	
	// source builder/
	var builder_componentID = 0,
		builder_build,
		builder_Ctx;
	
	(function(){
		
		// source ctx
		(function(){
			
			builder_Ctx = class_create(class_Dfr, {
				constructor: function(data){
					obj_extend(this, data);
				},
				// Is true, if some of the components in a ctx is async
				async: false,
				// List of busy components
				defers: null /*Array*/,
				
				// NodeJS
				// Track components ID
				_id: null,
				// ModelsBuilder for HTML serialization
				_models: null,
				
				// ModulesBuilder fot HTML serialization
				_modules: null,
				
				_redirect: null,
				_rewrite: null
			});
		}());
		// end:source ctx
		// source util
		var builder_resumeDelegate,
			builder_pushCompo;
			
		(function(){
		
			builder_resumeDelegate = function (ctr, model, ctx, container, children, finilizeFn){
				var anchor = document.createComment('');		
				container.appendChild(anchor);
				return function(){
					return _resume(ctr, model, ctx, anchor, children, finilizeFn);
				};
			};
			builder_pushCompo = function (ctr, compo) {
				var compos = ctr.components;
				if (compos == null) {
					ctr.components = [ compo ];
					return;
				}
				compos.push(compo);
			};
			
			// == private
			
			function _resume(ctr, model, ctx, anchorEl, children, finilize) {
				
				if (ctr.tagName != null && ctr.tagName !== ctr.compoName) {
					ctr.nodes = {
						tagName: ctr.tagName,
						attr: ctr.attr,
						nodes: ctr.nodes,
						type: 1
					};
				}
				if (ctr.model != null) {
					model = ctr.model;
				}
				
				var nodes = ctr.nodes,
					elements = [];
				if (nodes != null) {
			
					var isarray = nodes instanceof Array,
						length = isarray === true ? nodes.length : 1,
						i = 0,
						childNode = null,
						fragment = document.createDocumentFragment();
			
					for (; i < length; i++) {
						childNode = isarray === true ? nodes[i] : nodes;
						
						builder_build(childNode, model, ctx, fragment, ctr, elements);
					}
					
					anchorEl.parentNode.insertBefore(fragment, anchorEl);
				}
				
					
				// use or override custom attr handlers
				// in Compo.handlers.attr object
				// but only on a component, not a tag ctr
				if (ctr.tagName == null) {
					var attrHandlers = ctr.handlers && ctr.handlers.attr,
						attrFn,
						key;
					for (key in ctr.attr) {
						
						attrFn = null;
						
						if (attrHandlers && is_Function(attrHandlers[key])) {
							attrFn = attrHandlers[key];
						}
						
						if (attrFn == null && is_Function(custom_Attributes[key])) {
							attrFn = custom_Attributes[key];
						}
						
						if (attrFn != null) {
							attrFn(anchorEl, ctr.attr[key], model, ctx, elements[0], ctr);
						}
					}
				}
				
				if (is_Function(finilize)) {
					finilize.call(
						ctr
						, elements
						, model
						, ctx
						, anchorEl.parentNode
					);
				}
				
			
				if (children != null && children !== elements){
					var il = children.length,
						jl = elements.length,
						j  = -1;
						
					while(++j < jl){
						children[il + j] = elements[j];
					}
				}
			}
			
		}());
		// end:source util
		// source build_textNode
		var build_textNode;
		(function(){	
			build_textNode = function build_textNode(node, model, ctx, el, ctr) {
				
				var content = node.content;
				if (is_Function(content)) {		
					var result = content(
						'node', model, ctx, el, ctr
					);
					if (typeof result === 'string') {
						append_textNode(el, result);
						return;
					} 		
					// result is array with some htmlelements
					var text = '',
						jmax = result.length,
						j = 0,
						x;
						
					for (; j < jmax; j++) {
						x = result[j];
			
						if (typeof x === 'object') {
							// In this casee result[j] should be any HTMLElement
							if (text !== '') {
								append_textNode(el, text);
								text = '';
							}
							if (x.nodeType == null) {
								text += x.toString();
								continue;
							}
							el.appendChild(x);
							continue;
						}	
						text += x;
					}			
					if (text !== '') {
						append_textNode(el, text);
					}
					return;
				}
				append_textNode(el, content);
			};
			
			var append_textNode;
			(function(doc){
				append_textNode = function(el, text){
					el.appendChild(doc.createTextNode(text));
				};
			}(document));
		}());
		// end:source build_textNode
		// source build_node
		var build_node;
		(function(){
			build_node = function build_node(node, model, ctx, container, ctr, children){
				
				var tagName = node.tagName,
					attr = node.attr;
				
				var el = el_create(tagName);
				if (el == null) 
					return;
				
				if (children != null){
					children.push(el);
					attr['x-compo-id'] = ctr.ID;
				}
				
				// ++ insert el into container before setting attributes, so that in any
				// custom util parentNode is available. This is for mask.node important
				// http://jsperf.com/setattribute-before-after-dom-insertion/2
				if (container != null) {
					container.appendChild(el);
				}
				
				var key, mix, val, fn;
				for(key in attr) {
					mix = attr[key];
					if (is_Function(mix)) {
						var result = mix('attr', model, ctx, el, ctr, key);
						if (result == null) {
							continue;
						}
						if (typeof result === 'string') {
							val = result;
						} else if (is_ArrayLike(result)){
							if (result.length === 0) {
								continue;
							}
							val = result.join('');
						} else {
							val = result;
						}
					} else {
						val = mix;
					}
					
					if (val != null && val !== '') {
						fn = custom_Attributes[key];
						if (fn != null) {
							fn(node, val, model, ctx, el, ctr, container);
						} else {
							el.setAttribute(key, val);
						}
					}
				}
				return el;
			};
			
			var el_create;
			(function(doc){
				el_create = function(name){			
					// if DEBUG
					try {
					// endif
						return doc.createElement(name);
					// if DEBUG
					} catch(error) {
						log_error(name, 'element cannot be created. If this should be a custom handler tag, then controller is not defined');
						return null;
					}
					// endif
				};
			}(document));
		}());
		// end:source build_node
		// source build_component
		var build_compo;
		(function(){
			build_compo = function(node, model, ctx, container, ctr, children){
				
				var compoName = node.tagName,
					Handler;
				
				if (node.controller != null) 
					Handler = node.controller;
				
				if (Handler == null) 
					Handler = custom_Tags[compoName];
				
				if (Handler == null) 
					return build_NodeAsCompo(node, model, ctx, container, ctr, children);
				
				var isStatic = false,
					handler, attr, key;
				
				if (typeof Handler === 'function') {
					handler = new Handler(node, model, ctx, container, ctr);
				} else{
					handler = Handler;
					isStatic = true;
				}
				var fn = isStatic
					? build_Static
					: build_Component
					;
				return fn(handler, node, model, ctx, container, ctr, children);
			};
			
			// PRIVATE
			
			function build_Component(compo, node, model, ctx, container, ctr, children){
				var attr, key;
				
				compo.ID = ++builder_componentID;
				compo.attr = attr = attr_extend(compo.attr, node.attr);
				compo.parent = ctr;
				compo.expression = node.expression;
				
				if (compo.compoName == null) 
					compo.compoName = node.tagName;
				
				if (compo.model == null) 
					compo.model = model;
				
				if (compo.nodes == null) 
					compo.nodes = node.nodes;
				
				for (key in attr) {
					if (typeof attr[key] === 'function') 
						attr[key] = attr[key]('attr', model, ctx, container, ctr, key);
				}
			
				
				listeners_emit(
					'compoCreated'
					, compo
					, model
					, ctx
					, container
				);
			
				if (is_Function(compo.renderStart)) 
					compo.renderStart(model, ctx, container);
				
				
				builder_pushCompo(ctr, compo);
				
				if (compo.async === true) {
					var resume = builder_resumeDelegate(
						compo
						, model
						, ctx
						, container
						, children
						, compo.renderEnd
					); 
					compo.await(resume);
					return null;
				}
				
				if (compo.tagName != null) {
					compo.nodes = {
						tagName: compo.tagName,
						attr: compo.attr,
						nodes: compo.nodes,
						type: 1
					};
				}
				
				
				if (typeof compo.render === 'function') {
					compo.render(compo.model, ctx, container);
					// Overriden render behaviour - do not render subnodes
					return null;
				}	
				return compo;
			}
			
			
			function build_Static(static_, node, model, ctx, container, ctr, children) {
				var Ctor = static_.__Ctor,
					wasRendered = false,
					elements,
					compo,
					clone;
				
				if (Ctor != null) {
					clone = new Ctor(node, ctr);
				}
				else {
					clone = static_;
					
					for (var key in node) 
						clone[key] = node[key];
					
					clone.parent = ctr;
				}
				
				var attr = clone.attr;
				if (attr != null) {
					for (var key in attr) {
						if (typeof attr[key] === 'function') 
							attr[key] = attr[key]('attr', model, ctx, container, ctr, key);
					}
				}
				
				if (is_Function(clone.renderStart)) {
					clone.renderStart(model, ctx, container, ctr, children);
				}
				
				clone.ID = ++builder_componentID;
				builder_pushCompo(ctr, clone);
				
				var i = ctr.components.length - 1;
				if (is_Function(clone.render)){
					wasRendered = true;
					elements = clone.render(model, ctx, container, ctr, children);
					arr_pushMany(children, elements);
					
					if (is_Function(clone.renderEnd)) {
						compo = clone.renderEnd(elements, model, ctx, container, ctr);
						if (compo != null) {
							// overriden
							ctr.components[i] = compo;
							compo.components  = clone.components == null
								? ctr.components.splice(i + 1)
								: clone.components
								;
						}
					}
				}
				
				return wasRendered === true ? null : clone;
			}
			
			function build_NodeAsCompo(node, model, ctx, container, ctr, childs){
				node.ID = ++builder_componentID;
				
				builder_pushCompo(ctr, node);
				
				if (node.model == null) 
					node.model = model;
				
				var els = node.elements = [];
				if (node.render) {
					node.render(node.model, ctx, container, ctr, els);
				} else {
					builder_build(node.nodes, node.model, ctx, container, node, els);
				}
				
				if (childs != null && els.length !== 0) {
					arr_pushMany(childs, els);
				}
				return null;
			}
			
		}());
		
		// end:source build_component
		// source build
		/**
		 * @param {MaskNode} node
		 * @param {*} model
		 * @param {object} ctx
		 * @param {IAppendChild} container
		 * @param {object} controller
		 * @param {Array} children - @out
		 * @returns {IAppendChild} container
		 * @memberOf mask
		 * @method build
		 */
		builder_build = function(node, model, ctx, container, ctr, children) {
			
			if (node == null) 
				return container;
			
			var type = node.type,
				elements,
				key,
				value;
			
			if (ctr == null) 
				ctr = new Dom.Component();
				
			if (type == null){
				// in case if node was added manually, but type was not set			
				if (is_ArrayLike(node)) {
					// Dom.FRAGMENT
					type = 10;
				}
				else if (node.tagName != null){
					type = 1;
				}
				else if (node.content != null){
					type = 2;
				}
			}
			
			
			var tagName = node.tagName;
			if (tagName === 'else') 
				return container;
		
			if (type === 1 && custom_Tags[tagName] != null) {
				// check if custom ctr exists
				type = 4;
			}
			if (type === 1 && custom_Statements[tagName] != null) {
				// check if custom statement exists
				type = 15;
			}
			
			if (container == null && type !== 1) {
				container = document.createDocumentFragment();
			}
			
			// Dom.TEXTNODE
			if (type === 2) {			
				build_textNode(node, model, ctx, container, ctr);
				return container;
			}
			
			// Dom.SET
			if (type === 10) {
				var j = 0,
					jmax = node.length;
				for(; j < jmax; j++) {
					builder_build(node[j], model, ctx, container, ctr, children);
				}
				return container;
			}
		
			// Dom.STATEMENT
			if (type === 15) {
				var Handler = custom_Statements[tagName];
				if (Handler == null) {				
					if (custom_Tags[tagName] != null) {
						// Dom.COMPONENT
						type = 4;
					} else {
						log_error('<mask: statement is undefined>', tagName);
						return container;
					}
				}
				if (type === 15) {
					Handler.render(node, model, ctx, container, ctr, children);
					return container;
				}
			}
		
			// Dom.NODE
			if (type === 1) {
				container = build_node(node, model, ctx, container, ctr, children);
				children = null;
			}
		
			// Dom.COMPONENT
			if (type === 4) {
				ctr = build_compo(node, model, ctx, container, ctr, children);
				if (ctr == null) {
					return container;
				}
				elements = [];
				node = ctr;
				
				if (ctr.model !== model && ctr.model != null) {
					model = ctr.model;
				}
			}
		
			var nodes = node.nodes;
			if (nodes != null) {
				if (children != null && elements == null) {
					elements = children;
				}
				if (is_ArrayLike(nodes)) {
					var imax = nodes.length,
						i = 0;
					for(; i < imax; i++) {
						builder_build(nodes[i], model, ctx, container, ctr, elements);
					}
				} else {
					
					builder_build(nodes, model, ctx, container, ctr, elements);
				}
			}
		
			if (type === 4) {
				
				// use or override custom attr handlers
				// in Compo.handlers.attr object
				// but only on a component, not a tag ctr
				if (node.tagName == null) {
					var attrHandlers = node.handlers && node.handlers.attr,
						attrFn,
						val,
						key;
						
					for (key in node.attr) {
						
						val = node.attr[key];
						
						if (val == null) 
							continue;
						
						attrFn = null;
						
						if (attrHandlers != null && is_Function(attrHandlers[key])) 
							attrFn = attrHandlers[key];
						
						if (attrFn == null && custom_Attributes[key] != null) 
							attrFn = custom_Attributes[key];
						
						if (attrFn != null) 
							attrFn(node, val, model, ctx, elements[0], ctr);
					}
				}
				
				if (is_Function(node.renderEnd)) 
					node.renderEnd(elements, model, ctx, container);
			}
		
			if (children != null && elements != null && children !== elements)
				arr_pushMany(children, elements);
			
			return container;
		};
		// end:source build
		
	}());
	// end:source builder/
	
	// source mask
	/**
	 * @namespace mask
	 */
	var Mask;
	(function(){	
		Mask = {	
			/**
			 * Render the mask template to document fragment or single html node
			 * @param {(string|MaskDom)} template - Mask string template or Mask Ast to render from.
			 * @param {*} [model] - Model Object. 
			 * @param {Object} [ctx] - Context can store any additional information, that custom handler may need
			 * @param {IAppendChild} [container]  - Container Html Node where template is rendered into
			 * @param {Object} [controller] - Component that should own this template
			 * @returns {(IAppendChild|Node|DocumentFragment)} container
			 * @memberOf mask
			 */
			render: function (mix, model, ctx, container, controller) {
	
				// if DEBUG
				if (container != null && typeof container.appendChild !== 'function'){
					log_error('.render(template[, model, ctx, container, controller]', 'Container should implement .appendChild method');
				}
				// endif
				
				var template = mix;
				if (typeof mix === 'string') {
					if (_Object_hasOwnProp.call(__templates, mix)){
						/* if Object doesnt contains property that check is faster
						then "!=null" http://jsperf.com/not-in-vs-null/2 */
						template = __templates[mix];
					}else{
						template = __templates[mix] = parser_parse(mix);
					}
				}
				if (ctx == null || ctx.constructor !== builder_Ctx)
					ctx = new builder_Ctx(ctx);
					
				return builder_build(template, model, ctx, container, controller);
			},		
			/**
			 * Same to `mask.render` but returns the promise, which is resolved when all async components
			 * are resolved, or is in resolved state, when all components are synchronous.
			 * For the parameters doc @see {@link mask.render}
			 * @returns {Promise} Alwats fullfills with `IAppendChild|Node|DocumentFragment`
			 * @memberOf mask
			 */
			renderAsync: function(template, model, ctx, container, ctr) {
				if (ctx == null || ctx.constructor !== builder_Ctx)
					ctx = new builder_Ctx(ctx);
				
				var dom = this.render(template, model, ctx, container, ctr),
					dfr = new class_Dfr;
				
				if (ctx.async === true) {
					ctx.done(function(){
						dfr.resolve(dom);
					});
				} else {
					dfr.resolve(dom);
				}
				return dfr;
			},		
			// parser/mask/parse.js
			parse: parser_parse,
			// parser/html/parse.js
			parseHtml: parser_parseHtml,
			// formatter/stringify.js
			stringify: mask_stringify,
			// builder/build.js
			build: builder_build,
			// feature/run.js
			run: mask_run,
			// feature/merge.js
			merge: mask_merge,
			// feature/optimize.js
			optimize: mask_optimize,
			registerOptimizer: mask_registerOptimizer,
			// feature/TreeWalker.js
			TreeWalker: mask_TreeWalker,
			// feature/Module.j
			Module: Module,
			// custom/tag.js
			registerHandler: customTag_register,
			registerFromTemplate: customTag_registerFromTemplate,
			define: customTag_define,
			getHandler: customTag_get,
			getHandlers: customTag_getAll,
			// custom/statement.js
			registerStatement: customStatement_register,
			getStatement: customStatement_get,
			// custom/attribute.js
			registerAttrHandler: customAttr_register,
			getAttrHandler: customAttr_get,
			// custom/util.js
			registerUtil: customUtil_register,
			getUtil: customUtil_get,
			$utils: customUtil_$utils,
			_     : customUtil_$utils,
			// dom/exports.js
			Dom: Dom,
			/**
			 * Is present only in DEBUG (not minified) version
			 * Evaluates script in masks library scope
			 * @param {string} script
			 */
			plugin: function(source){
				//if DEBUG
				eval(source);
				//endif
			},
			clearCache: function(key){
				if (arguments.length === 0) {
					__templates = {};
					return;
				}
				delete __templates[key];
			},
			Utils: {
				Expression: ExpressionUtil,
				ensureTmplFn: parser_ensureTemplateFunction
			},
			obj: {
				get: obj_getProperty,
				set: obj_setProperty,
				extend: obj_extend,
			},
			is: {
				Function: is_Function,
				String: is_String,
				ArrayLike: is_ArrayLike,
				Array: is_ArrayLike,
				Object: is_Object,
				NODE: is_NODE,
				DOM: is_DOM
			},		
			'class': {
				create: class_create,
				createError: error_createClass,
				Deferred: class_Dfr,
				EventEmitter: class_EventEmitter,
			},		
			parser: {
				ObjectLexer: parser_ObjectLexer
			},
			// util/listeners.js
			on: listeners_on,
			off: listeners_off,
	
			
			// Stub for the reload.js, which will be used by includejs.autoreload
			delegateReload: function(){},
	
			/**
			 * Define interpolation quotes for the parser
			 * Starting from 0.6.9 mask uses ~[] for string interpolation.
			 * Old '#{}' was changed to '~[]', while template is already overloaded with #, { and } usage.
			 * @param {string} start - Must contain 2 Characters
			 * @param {string} end - Must contain 1 Character
			 **/
			setInterpolationQuotes: parser_setInterpolationQuotes,
			
			setCompoIndex: function(index){
				builder_componentID = index;
			},
			
			cfg: mask_config,
			config: mask_config,
			
			// For the consistence with the NodeJS
			toHtml: function(dom) {
				return $(dom).outerHtml();
			},
			
			factory: function(compoName){
				var params_ = _Array_slice.call(arguments, 1),
					factory = params_.pop(),
					mode = 'both';
				if (params_.length !== 0) {
					var x = params_[0];
					if (x === 'client' || x === 'server') {
						mode = x;
					}
				}
				if ((mode === 'client' && is_NODE) || (mode === 'server' && is_DOM) ) {
					customTag_register(compoName, {
						meta: { mode: mode }
					});
					return;
				}
				factory(global, Compo.config.getDOMLibrary(), function(compo){
					customTag_register(compoName, compo);
				});
			}
		};
		
		
		var __templates = {};
	}());
	
	// end:source mask
	
	/*** Libraries ***/
	// source /ref-mask-compo/lib/compo.embed.js
	
	var Compo = exports.Compo = Mask.Compo = (function(mask){
		// source /src/scope-vars.js
		var Dom = mask.Dom,
		
			_mask_ensureTmplFnOrig = mask.Utils.ensureTmplFn,
			_mask_ensureTmplFn,
			_resolve_External,
			domLib,
			Class	
			;
			
		(function(){
			_mask_ensureTmplFn = function(value) {
				return typeof value !== 'string'
					? value
					: _mask_ensureTmplFnOrig(value)
					;
			};
			_resolve_External = function(key){
				return _global[key] || _exports[key] || _atma[key]
			};
			
			var _global = global,
				_atma = global.atma || {},
				_exports = exports || {};
			
			function resolve() {
				var i = arguments.length, val;
				while( --i > -1 ) {
					val = _resolve_External(arguments[i]);
					if (val != null) 
						return val;
				}
				return null;
			}
			domLib = resolve('jQuery', 'Zepto', '$');
			Class = resolve('Class');
		}());
		
		
		// if DEBUG
		if (global.document != null && domLib == null) {
			
			log_warn('DomLite is used. You can set jQuery-Zepto-Kimbo via `Compo.config.setDOMLibrary($)`');
		}
		// endif
		// end:source /src/scope-vars.js
	
		// source /src/util/exports.js
		// source ./selector.js
		var selector_parse,
			selector_match
			;
		
		(function(){
			
			selector_parse = function(selector, type, direction) {
				if (selector == null)
					log_error('<compo>selector is undefined', type);
				
				if (typeof selector === 'object')
					return selector;
				
			
				var key, prop, nextKey;
			
				if (key == null) {
					switch (selector[0]) {
					case '#':
						key = 'id';
						selector = selector.substring(1);
						prop = 'attr';
						break;
					case '.':
						key = 'class';
						selector = sel_hasClassDelegate(selector.substring(1));
						prop = 'attr';
						break;
					default:
						key = type === Dom.SET ? 'tagName' : 'compoName';
						break;
					}
				}
			
				if (direction === 'up') {
					nextKey = 'parent';
				} else {
					nextKey = type === Dom.SET ? 'nodes' : 'components';
				}
			
				return {
					key: key,
					prop: prop,
					selector: selector,
					nextKey: nextKey
				};
			};
			
			selector_match = function(node, selector, type) {
				if (node == null) 
					return false;
				
				if (is_String(selector)) {
					if (type == null) 
						type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
					
					selector = selector_parse(selector, type);
				}
			
				var obj = selector.prop ? node[selector.prop] : node;
				if (obj == null) 
					return false;
				
				if (is_Function(selector.selector)) 
					return selector.selector(obj[selector.key]);
				
				// regexp
				if (selector.selector.test != null) 
					return selector.selector.test(obj[selector.key]);
				
				// string | int
				/* jshint eqeqeq: false */
				return obj[selector.key] == selector.selector;
				/* jshint eqeqeq: true */
			}
			
			// PRIVATE
			
			function sel_hasClassDelegate(matchClass) {
				return function(className){
					return sel_hasClass(className, matchClass);
				};
			}
			
			// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
			function sel_hasClass(className, matchClass, index) {
				if (typeof className !== 'string')
					return false;
				
				if (index == null) 
					index = 0;
					
				index = className.indexOf(matchClass, index);
			
				if (index === -1)
					return false;
			
				if (index > 0 && className.charCodeAt(index - 1) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				var class_Length = className.length,
					match_Length = matchClass.length;
					
				if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				return true;
			}
			
		}());
		
		// end:source ./selector.js
		// source ./traverse.js
		var find_findSingle,
			find_findAll;
		(function(){
			
			find_findSingle = function(node, matcher) {
				if (node == null) 
					return null;
				
				if (is_Array(node)) {
					var imax = node.length,
						i = 0, x;
					
					for(; i < imax; i++) {
						x = find_findSingle(node[i], matcher);
						if (x != null) 
							return x;
					}
					return null;
				}
			
				if (selector_match(node, matcher))
					return node;
				
				node = node[matcher.nextKey];
				return node == null
					? null
					: find_findSingle(node, matcher)
					;
			};
		
			find_findAll = function(node, matcher, out) {
				if (out == null) 
					out = [];
				
				if (is_Array(node)) {
					var imax = node.length,
						i = 0, x;
					
					for(; i < imax; i++) {
						find_findAll(node[i], matcher, out);
					}
					return out;
				}
				
				if (selector_match(node, matcher))
					out.push(node);
				
				node = node[matcher.nextKey];
				return node == null
					? out
					: find_findAll(node, matcher, out)
					;
			};
			
		}());
		
		// end:source ./traverse.js
		// source ./dom.js
		var dom_addEventListener,
			
			node_tryDispose,
			node_tryDisposeChildren
			;
			
		(function(){
		
			dom_addEventListener = function(el, event, fn, param, ctr) {
			
				if (TouchHandler.supports(event)) {
					TouchHandler.on(el, event, fn);
					return;
				}
				if (KeyboardHandler.supports(event, param)) {
					KeyboardHandler.attach(el, event, param, fn, ctr);
					return;
				}
				// allows custom events - in x-signal, for example
				if (domLib != null) 
					return domLib(el).on(event, fn);
				
				if (el.addEventListener != null) 
					return el.addEventListener(event, fn, false);
				
				if (el.attachEvent) 
					el.attachEvent('on' + event, fn);
			};
		
			node_tryDispose = function(node){
				if (node.hasAttribute('x-compo-id')) {
					
					var id = node.getAttribute('x-compo-id'),
						compo = Anchor.getByID(id)
						;
					
					if (compo != null) {
						if (compo.$ == null || compo.$.length === 1) {
							compo_dispose(compo);
							compo_detachChild(compo);
							return;
						}
						var i = _Array_indexOf.call(compo.$, node);
						if (i !== -1) 
							_Array_splice.call(compo.$, i, 1);
					}
				}
				node_tryDisposeChildren(node);
			};
			
			node_tryDisposeChildren = function(node){
				
				var child = node.firstChild;
				while(child != null) {
					
					if (child.nodeType === 1) 
						node_tryDispose(child);
					
					
					child = child.nextSibling;
				}
			};
			
		}());
		
		// end:source ./dom.js
		// source ./domLib.js
		/**
		 *	Combine .filter + .find
		 */
		
		var domLib_find,
			domLib_on
			;
		
		(function(){
				
			domLib_find = function($set, selector) {
				return $set.filter(selector).add($set.find(selector));
			};
			
			domLib_on = function($set, type, selector, fn) {
			
				if (selector == null) 
					return $set.on(type, fn);
				
				$set
					.on(type, selector, fn)
					.filter(selector)
					.on(type, fn);
					
				return $set;
			};
			
		}());
		
		
		// end:source ./domLib.js
		// source ./compo.js
		var compo_dispose,
			compo_detachChild,
			compo_ensureTemplate,
			compo_ensureAttributes,
			compo_attachDisposer,
			compo_removeElements,
			compo_prepairAsync,
			compo_errored,
			
			compo_meta_prepairAttributeHandler,
			compo_meta_executeAttributeHandler
			;
		
		(function(){
			
			compo_dispose = function(compo) {
				if (compo.dispose != null) 
					compo.dispose();
				
				Anchor.removeCompo(compo);
			
				var compos = compo.components;
				if (compos != null) {
					var i = compos.length;
					while ( --i > -1 ) {
						compo_dispose(compos[i]);
					}
				}	
			};
			
			compo_detachChild = function(childCompo){
				var parent = childCompo.parent;
				if (parent == null) 
					return;
				
				var arr = childCompo.$,
					elements = parent.$ || parent.elements,
					i;
					
				if (elements && arr) {
					var jmax = arr.length,
						el, j;
					
					i = elements.length;
					while( --i > -1){
						el = elements[i];
						j = jmax;
						
						while(--j > -1){
							if (el === arr[j]) {
								elements.splice(i, 1);
								break;
							}
						}
					}
				}
				
				var compos = parent.components;
				if (compos != null) {
					
					i = compos.length;
					while(--i > -1){
						if (compos[i] === childCompo) {
							compos.splice(i, 1);
							break;
						}
					}
			
					if (i === -1)
						log_warn('<compo:remove> - i`m not in parents collection', childCompo);
				}
			};
			compo_ensureTemplate = function(compo) {
				if (compo.nodes == null) {
					compo.nodes = getTemplateProp_(compo);
					return;
				}
				var behaviour = compo.meta.template;
				if (behaviour == null || behaviour === 'replace') {
					return;
				}
				var template = getTemplateProp_(compo);
				if (template == null) {
					return;
				}
				if (behaviour === 'merge') {
					compo.nodes = mask_merge(template, compo.nodes, compo);
					return;
				}
				if (behaviour === 'join') {
					compo.nodes = [template, compo.nodes];
					return;
				}
				log_error('Invalid meta.nodes behaviour', behaviour);
			};
			compo_attachDisposer = function(compo, disposer) {
			
				if (compo.dispose == null) {
					compo.dispose = disposer;
					return;
				}
				
				var prev = compo.dispose;
				compo.dispose = function(){
					disposer.call(this);
					prev.call(this);
				};
			};
			
			compo_removeElements = function(compo) {
				if (compo.$) {
					compo.$.remove();
					return;
				}
				
				var els = compo.elements;
				if (els) {
					var i = -1,
						imax = els.length;
					while ( ++i < imax ) {
						if (els[i].parentNode) 
							els[i].parentNode.removeChild(els[i]);
					}
					return;
				}
				
				var compos = compo.components;
				if (compos) {
					var i = -1,
						imax = compos.length;
					while ( ++i < imax ){
						compo_removeElements(compos[i]);
					}
				}
			};
		
			compo_prepairAsync = function(dfr, compo, ctx){
				var resume = Compo.pause(compo, ctx)
				dfr.then(resume, function(error){
					compo_errored(compo, error);
					resume();
				});
			};
			
			compo_errored = function(compo, error){
				var msg = '[%] Failed.'.replace('%', compo.compoName || compo.tagName);
				if (error) {
					var desc = error.message || error.statusText || String(error);
					if (desc) {
						msg += ' ' + desc;
					}
				}
				compo.nodes = reporter_createErrorNode(msg);
				compo.renderEnd = fn_doNothing;
			};
			
			// == Meta Attribute Handler
			(function(){
				
				compo_meta_prepairAttributeHandler = function(Proto){
					if (Proto.meta == null) {
						Proto.meta = {
							attributes: null,
							cache: null,
							mode: null
						};
					}
					
					var attr = Proto.meta.attributes,
						fn = null;
					if (attr) {
						var hash = {};
						for(var key in attr) {
							_handleProperty_Delegate(Proto, key, attr[key], hash);
						}
						fn = _handleAll_Delegate(hash);
					}
					Proto.meta.handleAttributes = fn;
				};
				compo_meta_executeAttributeHandler = function(compo, model){
					var fn = compo.meta && compo.meta.handleAttributes;
					return fn == null ? true : fn(compo, model);
				};
				
				function _handleAll_Delegate(hash){
					return function(compo, model){
						var attr = compo.attr,
							key, fn, val, error;
						for(key in hash){
							fn    = hash[key];
							val   = attr[key];
							error = fn(compo, val, model);
							
							if (error == null)
								continue;
							
							_errored(compo, error, key, val)
							return false;
						}
						return true;
					};
				}
				function _handleProperty_Delegate(Proto, metaKey, metaVal, hash) {
					var optional = metaKey.charCodeAt(0) === 63, // ?
						default_ = null,
						attrName = optional
							? metaKey.substring(1)
							: metaKey;
					
					var property = _getProperty(attrName),
						fn = null,
						type = typeof metaVal;
					if ('string' === type) {
						if (metaVal === 'string' || metaVal === 'number' || metaVal === 'boolean') {
							fn = _ensureFns[metaVal];
						} else {
							optional = true;
							default_ = metaVal;
							fn = _ensureFns_Delegate.any();
						}
					}
					else if ('boolean' === type || 'number' === type) {
						optional = true;
						fn = _ensureFns[type];
						default_ = metaVal;
					}
					else if ('function' === type) {
						fn = metaVal;
					}
					else if (metaVal == null) {
						fn = _ensureFns_Delegate.any();
					}
					else if (metaVal instanceof RegExp) {
						fn = _ensureFns_Delegate.regexp(metaVal);
					}
					else if (typeof metaVal === 'object') {
						fn = _ensureFns_Delegate.options(metaVal);
						default_ = metaVal['default'];
						if (default_ !== void 0) {
							optional = true;
						}
					}
					
					if (fn == null) {
						log_error('Function expected for the attr. handler', metaKey);
						return;
					}
					
					Proto[property] = null;
					Proto = null;
					hash [attrName] = function(compo, attrVal, model){
						if (attrVal == null) {
							if (optional === false) {
								return Error('Expected');
							}
							if (default_ != null) {
								compo[property] = default_;
							}
							return null;
						}
						
						var val = fn.call(compo, attrVal, compo, model, attrName);
						if (val instanceof Error) 
							return val;
						
						compo[property] = val;
						return null;
					};
				}
				
				function _toCamelCase_Replacer(full, char_){
					return char_.toUpperCase();
				}
				function _getProperty(attrName) {
					var prop = attrName;
					if (prop.charCodeAt(0) !== 120) {
						// x
						prop = 'x-' + prop;
					}
					return prop.replace(/-(\w)/g, _toCamelCase_Replacer)
				}
				function _errored(compo, error, key, val) {
					error.message = compo.compoName + ' - attribute `' + key + '`: ' + error.message;
					compo_errored(compo, error);
					log_error(error.message, '. Current: ', val);
				}
				var _ensureFns = {
					'string': function(x) {
						return typeof x === 'string' ? x : Error('String');
					},
					'number': function(x){
						var num = Number(x);
						return num === num ? num : Error('Number');
					},
					'boolean': function(x, compo, model, attrName){
						if (typeof x === 'boolean') 
							return x;
						if (x === attrName)  return true;
						if (x === 'true'  || x === '1') return true;
						if (x === 'false' || x === '0') return false;
						return Error('Boolean');
					}
				};
				var _ensureFns_Delegate = {
					regexp: function(rgx){
						return function(x){
							return rgx.test(x) ? x : Error('RegExp');
						};
					},
					any: function(){
						return function(x){ return x; };
					},
					options: function(opts){
						var type = opts.type,
							def = opts.default || _defaults[type],
							validate = opts.validate,
							transform = opts.transform;
						return function(x){
							if (!x) return def;
							
							if (type != null) {
								var fn = _ensureFns[type];
								if (fn != null) {
									x = fn.apply(this, arguments);
									if (x instanceof Error) {
										return x;
									}
								}
							}
							if (validate) {
								var error = validate.call(this, x);
								if (error) {
									return Error(error);
								}
							}
							if (transform) {
								x = transform.call(this, x);
							}
							return x;
						};
					}
				};
				var _defaults = {
					string: '',
					boolean: false,
					number: 0
				};
			}());
			function getTemplateProp_(compo){
				var template = compo.template;
				if (template == null) {
					template = compo.attr.template;
					if (template == null) 
						return null;
					
					delete compo.attr.template;
				}
				if (typeof template === 'object') 
					return template;
				
				if (is_String(template)) {
					if (template.charCodeAt(0) === 35 && /^#[\w\d_-]+$/.test(template)) {
						// #
						var node = document.getElementById(template.substring(1));
						if (node == null) {
							log_warn('Template not found by id:', template);
							return null;
						}
						template = node.innerHTML;
					}
					return mask.parse(template);
				}
				log_warn('Invalid template', typeof template);
				return null;
			}
		}());
		
		// end:source ./compo.js
		// source ./compo_create.js
		var compo_create,
			compo_createConstructor;
		(function(){
			compo_create = function(arguments_){
				
				var argLength = arguments_.length,
					Proto = arguments_[argLength - 1],
					Ctor,
					key;
				
				if (argLength > 1) 
					compo_inherit(Proto, _Array_slice.call(arguments_, 0, argLength - 1));
				
				if (Proto == null)
					Proto = {};
				
				var include = _resolve_External('include');
				if (include != null) 
					Proto.__resource = include.url;
				
				var attr = Proto.attr;
				for (key in Proto.attr) {
					Proto.attr[key] = _mask_ensureTmplFn(Proto.attr[key]);
				}
				
				var slots = Proto.slots;
				for (key in slots) {
					if (typeof slots[key] === 'string'){
						//if DEBUG
						if (is_Function(Proto[slots[key]]) === false)
							log_error('Not a Function @Slot.',slots[key]);
						// endif
						slots[key] = Proto[slots[key]];
					}
				}
				
				compo_meta_prepairAttributeHandler(Proto);
				
				Ctor = Proto.hasOwnProperty('constructor')
					? Proto.constructor
					: function CompoBase() {}
					;
				
				Ctor = compo_createConstructor(Ctor, Proto);
		
				for(key in CompoProto){
					if (Proto[key] == null)
						Proto[key] = CompoProto[key];
				}
		
				Ctor.prototype = Proto;
				Proto = null;
				return Ctor;
			};
			
			compo_createConstructor = function(Ctor, proto) {
				var compos = proto.compos,
					pipes = proto.pipes,
					scope = proto.scope,
					attr = proto.attr;
					
				if (compos   == null
					&& pipes == null
					&& attr  == null
					&& scope == null) {
					return Ctor;
				}
			
				/* extend compos / attr to keep
				 * original prototyped values untouched
				 */
				return function CompoBase(node, model, ctx, container, ctr){
					
					if (Ctor != null) {
						var overriden = Ctor.call(this, node, model, ctx, container, ctr);
						if (overriden != null) 
							return overriden;
					}
					
					if (compos != null) {
						// use this.compos instead of compos from upper scope
						// : in case compos they were extended after
						this.compos = obj_create(this.compos);
					}
					
					if (pipes != null) 
						Pipes.addController(this);
					
					if (attr != null) 
						this.attr = obj_create(this.attr);
					
					if (scope != null) 
						this.scope = obj_create(this.scope);
				};
			};
		}());
		// end:source ./compo_create.js
		// source ./compo_inherit.js
		var compo_inherit;
		(function(){
			
			compo_inherit = function(Proto, Extends){
				var imax = Extends.length,
					i = imax,
					ctors = [],
					x;
				while( --i > -1){
					x = Extends[i];
					if (typeof x === 'string') {
						x = mask.getHandler(x);
						if (x != null && x.name === 'Resolver') {
							log_error('Inheritance error: private component');
							x = null;
						}
					}
					if (x == null) {
						log_error('Base component not defined', Extends[i]);
						continue;
					}
					if (typeof x === 'function') {
						ctors.push(x);
						x = x.prototype;
					}
					inherit_(Proto, x, 'node');
				}
				
				i = -1;
				imax = ctors.length;
				if (imax > 0) {
					if (Proto.hasOwnProperty('constructor')) 
						ctors.unshift(Proto.constructor);
					
					Proto.constructor = joinFns_(ctors);
				}
				var meta = Proto.meta;
				if (meta == null) 
					meta = Proto.meta = {};
				
				if (meta.template == null) 
					meta.template = 'merge';
			};
			
			function inherit_(target, source, name){
				if (target == null || source == null) 
					return;
				
				if ('node' === name) {
					var targetNodes = target.template || target.nodes,
						sourceNodes = source.template || source.nodes;
					target.template = targetNodes == null || sourceNodes == null
						? (targetNodes || sourceNodes)
						: (mask_merge(sourceNodes, targetNodes, target, {extending: true }));
					
					if (target.nodes != null) {
						target.nodes = target.template;
					}
				}
				
				var mix, type, fnAutoCall, hasFnOverrides = false;
				for(var key in source){
					mix = source[key];
					if (mix == null || key === 'constructor')
						continue;
					
					if ('node' === name && (key === 'template' || key === 'nodes')) 
						continue;
					
					type = typeof mix;
					
					if (target[key] == null) {
						target[key] = mix;
						continue;
					}
					if ('node' === name) {
						// http://jsperf.com/indexof-vs-bunch-of-ifs
						var isSealed = key === 'renderStart'
								|| key === 'renderEnd'
								|| key === 'emitIn'
								|| key === 'emitOut'
								|| key === 'components'
								|| key === 'nodes'
								|| key === 'template'
								|| key === 'find'
								|| key === 'closest'
								|| key === 'on'
								|| key === 'remove'
								|| key === 'slotState'
								|| key === 'signalState'
								|| key === 'append'
								|| key === 'appendTo'
								;
						if (isSealed === true) 
							continue;
					}
					if ('pipes' === name) {
						inherit_(target[key], mix, 'pipe');
						continue;
					}
					if ('function' === type) {
						fnAutoCall = false;
						if ('slots' === name || 'events' === name || 'pipe' === name)
							fnAutoCall = true;
						else if ('node' === name && ('onRenderStart' === key || 'onRenderEnd' === key)) 
							fnAutoCall = true;
						
						target[key] = createWrapper_(target[key], mix, fnAutoCall);
						hasFnOverrides = true;
						continue;
					}
					if ('object' !== type) {
						continue;
					}
					
					switch(key){
						case 'slots':
						case 'pipes':
						case 'events':
						case 'attr':
							inherit_(target[key], mix, key);
							continue;
					}
					defaults_(target[key], mix);
				}
				
				if (hasFnOverrides === true) {
					if (target.super != null) 
						log_error('`super` property is reserved. Dismissed. Current prototype', target);
					target.super = null;
				}
			}
			
			/*! Circular references are not handled */
			function clone_(a) {
				if (a == null) 
					return null;
				
				if (typeof a !== 'object') 
					return a;
				
				if (is_Array(a)) {
					var imax = a.length,
						i = -1,
						arr = new Array(imax)
						;
					while( ++i < imax ){
						arr[i] = clone_(a[i]);
					}
					return arr;
				}
				
				var object = obj_create(a),
					key, val;
				for(key in object){
					val = object[key];
					if (val == null || typeof val !== 'object') 
						continue;
					object[key] = clone_(val);
				}
				return object;
			}
			function defaults_(target, source){
				var targetV, sourceV, key;
				for(var key in source){
					targetV = target[key];
					sourceV = source[key];
					if (targetV == null) {
						target[key] = sourceV;
						continue;
					}
					if (is_rawObject(targetV) && is_rawObject(sourceV)){
						defaults_(targetV, sourceV);
						continue;
					}
				}
			}
			function createWrapper_(selfFn, baseFn, autoCallFunctions){
				if (selfFn.name === 'compoInheritanceWrapper') {
					selfFn._fn_chain.push(baseFn);
					return selfFn;
				}
				
				var compileFns = autoCallFunctions === true
					? compileFns_autocall_
					: compileFns_
					;
				function compoInheritanceWrapper(){
					var fn = x._fn || (x._fn = compileFns(x._fn_chain));
					return fn.apply(this, arguments);
				}
				
				var x = compoInheritanceWrapper;
				x._fn_chain = [ selfFn, baseFn ];
				x._fn = null;
				
				return x;
			}
			function compileFns_(fns){
				var i = fns.length,
					fn = fns[ --i ];
				while( --i > -1){
					fn = inheritFn_(fns[i], fn);
				}
				return fn;
			}
			function compileFns_autocall_(fns) {
				var imax = fns.length;
				return function(){
					var result, fn, x,
						i = imax;
					while( --i > -1 ){
						fn = fns[i];
						if (fn == null) 
							continue;
						
						x = fn_apply(fn, this, arguments);
						if (x !== void 0) {
							result = x;
						}
					}
					return result;
				}
			}
			function inheritFn_(selfFn, baseFn){
				return function(){
					this.super = baseFn;
					var x = fn_apply(selfFn, this, arguments);
					
					this.super = null;
					return x;
				};
			}
			function joinFns_(fns) {
				var imax = fns.length;
				return function(){
					var i = imax, result;
					while( --i > -1 ){
						var x = fns[i].apply(this, arguments);
						if (x != null) {
							// use last return
							result = x;
						}
					}
					return result;
				};
			}
		}());
		// end:source ./compo_inherit.js
		// source ./dfr.js
		var dfr_isBusy;
		(function(){
			dfr_isBusy = function(dfr){
				if (dfr == null || typeof dfr.then !== 'function') 
					return false;
				
				// Class.Deferred
				if (is_Function(dfr.isBusy)) 
					return dfr.isBusy();
				
				// jQuery Deferred
				if (is_Function(dfr.state)) 
					return dfr.state() === 'pending';
				
				log_warn('Class or jQuery deferred interface expected');
				return false;
			};
		}());
		// end:source ./dfr.js
		
		// end:source /src/util/exports.js
	
		// source /src/compo/children.js
		var Children_ = {
		
			/**
			 *	Component children. Example:
			 *
			 *	Class({
			 *		Base: Compo,
			 *		Construct: function(){
			 *			this.compos = {
			 *				panel: '$: .container',  // querying with DOMLib
			 *				timePicker: 'compo: timePicker', // querying with Compo selector
			 *				button: '#button' // querying with querySelector***
			 *			}
			 *		}
			 *	});
			 *
			 */
			select: function(component, compos) {
				for (var name in compos) {
					var data = compos[name],
						events = null,
						selector = null;
		
					if (data instanceof Array) {
						selector = data[0];
						events = data.splice(1);
					}
					if (typeof data === 'string') {
						selector = data;
					}
					if (data == null || selector == null) {
						log_error('Unknown component child', name, compos[name]);
						log_warn('Is this object shared within multiple compo classes? Define it in constructor!');
						return;
					}
		
					var index = selector.indexOf(':'),
						engine = selector.substring(0, index);
		
					engine = Compo.config.selectors[engine];
		
					if (engine == null) {
						component.compos[name] = component.$[0].querySelector(selector);
					} else {
						selector = selector.substring(++index).trim();
						component.compos[name] = engine(component, selector);
					}
		
					var element = component.compos[name];
		
					if (events != null) {
						if (element.$ != null) {
							element = element.$;
						}
						
						Events_.on(component, events, element);
					}
				}
			}
		};
		
		// end:source /src/compo/children.js
		// source /src/compo/events.js
		var Events_ = {
			on: function(component, events, $element) {
				if ($element == null) {
					$element = component.$;
				}
		
				var isarray = events instanceof Array,
					length = isarray ? events.length : 1;
		
				for (var i = 0, x; isarray ? i < length : i < 1; i++) {
					x = isarray ? events[i] : events;
		
					if (x instanceof Array) {
						// generic jQuery .on Arguments
		
						if (EventDecorator != null) {
							x[0] = EventDecorator(x[0]);
						}
		
						$element.on.apply($element, x);
						continue;
					}
		
		
					for (var key in x) {
						var fn = typeof x[key] === 'string' ? component[x[key]] : x[key],
							semicolon = key.indexOf(':'),
							type,
							selector;
		
						if (semicolon !== -1) {
							type = key.substring(0, semicolon);
							selector = key.substring(semicolon + 1).trim();
						} else {
							type = key;
						}
		
						if (EventDecorator != null) {
							type = EventDecorator(type);
						}
		
						domLib_on($element, type, selector, fn_proxy(fn, component));
					}
				}
			}
		},
			EventDecorator = null;
		
		// end:source /src/compo/events.js
		// source /src/compo/events.deco.js
		var EventDecos = (function() {
		
			var hasTouch = (function() {
				if (document == null) {
					return false;
				}
				if ('createTouch' in document) {
					return true;
				}
				try {
					return !!document.createEvent('TouchEvent').initTouchEvent;
				} catch (error) {
					return false;
				}
			}());
		
			return {
		
				'touch': function(type) {
					if (hasTouch === false) {
						return type;
					}
		
					if ('click' === type) {
						return 'touchend';
					}
		
					if ('mousedown' === type) {
						return 'touchstart';
					}
		
					if ('mouseup' === type) {
						return 'touchend';
					}
		
					if ('mousemove' === type) {
						return 'touchmove';
					}
		
					return type;
				}
			};
		
		}());
		
		// end:source /src/compo/events.deco.js
		// source /src/compo/pipes.js
		var Pipes = (function() {
			
			var _collection = {};
		
			mask.registerAttrHandler('x-pipe-signal', 'client', function(node, attrValue, model, ctx, element, ctr) {
		
				var arr = attrValue.split(';'),
					imax = arr.length,
					i = -1,
					x;
				while ( ++i < imax ) {
					x = arr[i].trim();
					if (x === '') 
						continue;
					
					var i_colon = x.indexOf(':'),
						event = x.substring(0, i_colon),
						handler = x.substring(i_colon + 1).trim(),
						dot = handler.indexOf('.'),
						
						pipe, signal;
		
					if (dot === -1) {
						log_error('Pipe-slot is invalid: {0} Usage e.g. "click: pipeName.pipeSignal"', x);
						return;
					}
		
					pipe = handler.substring(0, dot);
					signal = handler.substring(++dot);
		
					// if DEBUG
					!event && log_error('Pipe-slot is invalid. Event type is not set', attrValue);
					// endif
		
					dom_addEventListener(
						element
						, event
						, _createListener(pipe, signal)
					);
				}
			});
		
			function _createListener(pipe, signal) {
				return function(event){
					new Pipe(pipe).emit(signal, event);
				};
			}
		
		
			function pipe_attach(pipeName, ctr) {
				if (ctr.pipes[pipeName] == null) {
					log_error('Controller has no pipes to be added to collection', pipeName, ctr);
					return;
				}
		
				if (_collection[pipeName] == null) {
					_collection[pipeName] = [];
				}
				_collection[pipeName].push(ctr);
			}
		
			function pipe_detach(pipeName, ctr) {
				var pipe = _collection[pipeName],
					i = pipe.length;
		
				while (--i > -1) {
					if (pipe[i] === ctr) 
						pipe.splice(i, 1);
				}
		
			}
		
			function _removeController(ctr) {
				var	pipes = ctr.pipes;
				for (var key in pipes) {
					pipe_detach(key, ctr);
				}
			}
			function _removeControllerDelegate(ctr) {
				return function(){
					_removeController(ctr);
					ctr = null;
				};
			}
		
			function _addController(ctr) {
				var pipes = ctr.pipes;
				
				// if DEBUG
				if (pipes == null) {
					log_error('Controller has no pipes', ctr);
					return;
				}
				// endif
				
				for (var key in pipes) {
					pipe_attach(key, ctr);
				}
				Compo.attachDisposer(ctr, _removeControllerDelegate(ctr));
			}
			
			var Pipe = class_create({
				name: null,
				constructor: function Pipe (name) {
					if (this instanceof Pipe === false) {
						return new Pipe(name);
					}
					this.name = name;
					return this;
				},
				emit: function(signal){
					var controllers = _collection[this.name],
						name = this.name,
						args = _Array_slice.call(arguments, 1);
					
					if (controllers == null) {
						//if DEBUG
						log_warn('Pipe.emit: No signals were bound to:', name);
						//endif
						return;
					}
					
					var i = controllers.length,
						called = false;
		
					while (--i !== -1) {
						var ctr = controllers[i];
						var slots = ctr.pipes[name];
		
						if (slots == null) 
							continue;
						
						var slot = slots[signal];
						if (slot != null) {
							slot.apply(ctr, args);
							called = true;
						}
					}
		
					// if DEBUG
					if (called === false)
						log_warn('Pipe `%s` has not slots for `%s`', name, signal);
					// endif
				}
			});
			Pipe.addController = _addController;
			Pipe.removeController = _removeController;
		
			return {
				addController: _addController,
				removeController: _removeController,
				pipe: Pipe
			};
		
		}());
		
		// end:source /src/compo/pipes.js
		
		// source /src/keyboard/Handler.js
		var KeyboardHandler;
		(function(){
			
			// source ./utils.js
			var event_bind,
				event_unbind,
				event_getCode;
			(function(){
				
				event_bind = function (el, type, mix){
					el.addEventListener(type, mix, false);
				};
				event_unbind = function (el, type, mix) {
					el.removeEventListener(type, mix, false);
				};	
				
				event_getCode = function(event){
					var code = event.keyCode || event.which;
					
					if (code >= 96 && code <= 105) {
						// numpad digits
						return code - 48;
					}
					
					return code;
				};
				
			}());
			
			// end:source ./utils.js
			// source ./const.js
			var CODES, SHIFT_NUMS, MODS;
			
			CODES = {
				"backspace": 8,
				"tab": 9,
				"return": 13,
				"enter": 13,
				"shift": 16,
				"ctrl": 17,
				"control": 17,
				"alt": 18,
				"option": 18,
				
				"fn": 255,
				
				"pause": 19,
				"capslock": 20,
				"esc": 27,
				"escape": 27,
				
				"space": 32,
				"pageup": 33,
				"pagedown": 34,
				"end": 35,
				"home": 36,
				"start": 36,
				
				"left": 37,
				"up": 38,
				"right": 39,
				"down": 40,
				
				"insert": 45,
				"ins": 45,
				"del": 46,
				"numlock": 144,
				"scroll": 145,
				
				"f1": 112,
				"f2": 113,
				"f3": 114,
				"f4": 115,
				"f5": 116,
				"f6": 117,
				"f7": 118,
				"f8": 119,
				"f9": 120,
				"f10": 121,
				"f11": 122,
				"f12": 123,
				
				";": 186,
				"=": 187,
				"*": 106,
				"+": 107,
				"-": 189,
				".": 190,
				"/": 191,
				
				",": 188,
				"`": 192,
				"[": 219,
				"\\": 220,
				"]": 221,
				"'": 222
			};
			
			SHIFT_NUMS = {
			  "`": "~",
			  "1": "!",
			  "2": "@",
			  "3": "#",
			  "4": "$",
			  "5": "%",
			  "6": "^",
			  "7": "&",
			  "8": "*",
			  "9": "(",
			  "0": ")",
			  "-": "_",
			  "=": "+",
			  ";": ": ",
			  "'": "\"",
			  ",": "<",
			  ".": ">",
			  "/": "?",
			  "\\": "|"
			};
			
			MODS = {
				'16': 'shiftKey',
				'17': 'ctrlKey',
				'18': 'altKey',
			};
			// end:source ./const.js
			// source ./filters.js
			var filter_isKeyboardInput,
				filter_skippedInput,
				filter_skippedComponent,
				filter_skippedElement;
			(function(){
				filter_skippedInput = function(event, code){
					if (event.ctrlKey || event.altKey) 
						return false;
					return filter_isKeyboardInput(event.target);
				};
				
				filter_skippedComponent = function(compo){
					if (compo.$ == null || compo.$.length === 0) {
						return false;
					}
					return filter_skippedElement(compo.$.get(0));
				};
				filter_skippedElement = function(el) {
					if (document.contains(el) === false) 
						return false;
					
					if (el.style.display === 'none')
						return false;
					
					var disabled = el.disabled;
					if (disabled === true) 
						return false;
					
					return true;
				};
				filter_isKeyboardInput = function (el) {
					var tag = el.tagName;
					if ('TEXTAREA' === tag) {
						return true;
					}
					if ('INPUT' !== tag) {
						return false;
					}
					return TYPELESS_INPUT.indexOf(' ' + el.type + ' ') === -1;
				};
				
				var TYPELESS_INPUT = ' button submit checkbox file hidden image radio range reset ';
			}());
			// end:source ./filters.js
			// source ./Hotkey.js
			var Hotkey;
			(function(){
				Hotkey = {
					on: function(combDef, fn, compo) {
						if (handler == null) init();
						
						var comb = IComb.create(
							combDef
							, 'keydown'
							, fn
							, compo
						);
						handler.attach(comb);
					},
					off: function(fn){
						handler.off(fn);
					},
					handleEvent: function(event){
						handler.handle(event.type, event_getCode(event), event);
					},
					reset: function(){
						handler.reset();
					}
				};
				var handler;
				function init() {
					handler = new CombHandler();
					event_bind(window, 'keydown', Hotkey);
					event_bind(window, 'keyup', Hotkey);
					event_bind(window, 'focus', Hotkey.reset);
				}
			}());
			// end:source ./Hotkey.js
			// source ./IComb.js
			var IComb;
			(function(){
				IComb = function(set){
					this.set = set;
				};
				IComb.parse = function (str) {
					var parts = str.split(','),
						combs = [],
						imax = parts.length,
						i = 0;
					for(; i < imax; i++){
						combs[i] = parseSingle(parts[i]);
					}
					return combs;
				};
				IComb.create = function (def, type, fn, ctx) {
					var codes = IComb.parse(def);
					var comb = Key.create(codes);
					if (comb == null) {
						comb = new KeySequance(codes)
					}
					comb.init(type, fn, ctx);
					return comb;
				};
				IComb.prototype = {
					type: null,
					ctx: null,
					set: null,
					fn: null,
					init: function(type, fn, ctx){
						this.type = type;
						this.ctx = ctx;
						this.fn = fn;
					},
					tryCall: null
				};
				
				function parseSingle(str) {
					var keys = str.split('+'),
						imax = keys.length,
						i = 0,
						out = [], x, code;
					for(; i < imax; i++){
						x = keys[i].trim();
						code = CODES[x];
						if (code === void 0) {
							if (x.length !== 1)  {
								throw Error('Unexpected sequence. Neither a predefined key, nor a char: ' + x);
							}
							code = x.toUpperCase().charCodeAt(0);
						}
						out[i] = code;
					}
					return {
						last: out[imax - 1],
						keys: out.sort()
					};
				}
			}());
			// end:source ./IComb.js
			// source ./Key.js
			var Key;
			(function(){
				Key = class_create(IComb, {
					constructor: function(set, key, mods){
						this.key = key;
						this.mods = mods;
					},
					tryCall: function(event, codes, lastCode){
						if (event.type !== this.type || lastCode !== this.key) {
							return Key_MATCH_FAIL;
						}
						
						for (var key in this.mods){
							if (event[key] !== this.mods[key]) 
								return Key_MATCH_FAIL;
						}
						
						this.fn.call(this.ctx, event);
						return Key_MATCH_OK;
					}
				});
				
				Key.create = function(set){
					if (set.length !== 1) 
						return null;
					var keys = set[0].keys,
						i = keys.length,
						mods = {
							shiftKey: false,
							ctrlKey: false,
							altKey: false
						};
					
					var key, mod, hasMod;
					while(--i > -1){
						if (MODS.hasOwnProperty(keys[i]) === false) {
							if (key != null) 
								return null;
							key = keys[i];
							continue;
						}
						mods[MODS[keys[i]]] = true;
						hasMod = true;
					}
					return new Key(set, key, mods);
				};
				
			}());
			// end:source ./Key.js
			// source ./KeySequance.js
			var KeySequance,
				Key_MATCH_OK = 1,
				Key_MATCH_FAIL = 2,
				Key_MATCH_WAIT = 3,
				Key_MATCH_NEXT = 4;
			
			(function(){
				KeySequance = class_create(IComb, {
					index: 0,
					tryCall: function(event, codes, lastCode){
						var matched = this.check_(codes, lastCode);
						if (matched === Key_MATCH_OK) {
							this.index = 0;
							this.fn.call(this.ctx, event);
						}
						return matched;
					},
					fail_: function(){
						this.index = 0;
						return Key_MATCH_FAIL;
					},
					check_: function(codes, lastCode){
						var current = this.set[this.index],
							keys = current.keys,
							last = current.last;
					
						var l = codes.length;
						if (l < keys.length) 
							return Key_MATCH_WAIT;
						if (l > keys.length) 
							return this.fail_();
						
						if (last !== lastCode) {
							return this.fail_();
						}
						while (--l > -1) {
							if (keys[l] !== codes[l]) 
								return this.fail_();
						}
						if (this.index < this.set.length - 1) {
							this.index++;
							return Key_MATCH_NEXT;
						}
						this.index = 0;
						return Key_MATCH_OK;
					}
				});
				
			}());
			
			
			// end:source ./KeySequance.js
			// source ./CombHandler.js
			var CombHandler;
			(function(){
				CombHandler = function(){
					this.keys = [];
					this.combs = [];
				};
				CombHandler.prototype = {
					keys: null,
					combs: null,
					attach: function(comb) {
						this.combs.push(comb);
					},
					off: function(fn){
						var imax = this.combs.length,
							i = 0;
						for(; i < imax; i++){
							if (this.combs[i].fn === fn) {
								this.combs.splice(i, 1);
								return true;
							}
						}
						return false;
					},
					handle: function(type, code, event){
						if (this.combs.length === 0) {
							return;
						}
						if (this.filter_(event, code)) {
							return;
						}
						if (type === 'keydown') {
							if (this.add_(code)) {
								this.emit_(type, event, code);
							}
							return;
						}
						if (type === 'keyup') {
							this.emit_(type, event, code);
							this.remove_(code);
						}
					},
					handleEvent: function(event){
						var code = event_getCode(event),
							type = event.type;
						this.handle(type, code, event);
					},
					reset: function(){
						this.keys.length = 0;
					},
					add_: function(code){
						var imax = this.keys.length,
							i = 0, x;
						for(; i < imax; i++){
							x = this.keys[i];
							if (x === code) 
								return false;
							
							if (x > code) {
								this.keys.splice(i, 0, code);
								return true;
							}
						}
						this.keys.push(code);
						return true;
					},
					remove_: function(code){
						var i = this.keys.length;
						while(--i > -1){
							if (this.keys[i] === code) {
								this.keys.splice(i, 1);
								return;
							}
						}
					},
					emit_: function(type, event, lastCode){
						var next = false,
							combs = this.combs,
							imax = combs.length,
							i = 0, x, stat;
						for(; i < imax; i++){
							x = combs[i];
							if (x.type !== type) 
								continue;
							
							stat = x.tryCall(event, this.keys, lastCode);
							if (Key_MATCH_OK === stat || stat === Key_MATCH_NEXT) {
								event.preventDefault();
							}
							if (stat === Key_MATCH_WAIT || stat === Key_MATCH_NEXT) {
								next = true;
							}
						}
					},
					filter_: function(event, code){
						return filter_skippedInput(event, code);
					}
				};
			}());
			// end:source ./CombHandler.js
			
			KeyboardHandler = {
				supports: function(event, param){
					if (param == null) 
						return false;
					switch(event){
						case 'press':
						case 'keypress':
						case 'keydown':
						case 'keyup':
						case 'hotkey':
						case 'shortcut':
							return true;
					}
					return false;
				},
				on: function(el, type, def, fn){
					if (type === 'keypress' || type === 'press') {
						type = 'keydown';
					}
					var comb = IComb.create(def, type, fn);
					if (comb instanceof Key) {
						event_bind(el, type, function (event) {
							var code = event_getCode(event);
							var r = comb.tryCall(event, null, code);
							if (r === Key_MATCH_OK) {
								event.preventDefault();
							}
						});
						return;
					}
					
					var handler = new CombHandler;
					event_bind(el, 'keydown', handler);
					event_bind(el, 'keyup', handler);
					handler.attach(comb);
				},
				hotkeys: function(compo, hotkeys){
					var fns = [], fn, comb;
					for(comb in hotkeys) {
						fn = hotkeys[comb];
						Hotkey.on(comb, fn, compo);
					}
					compo_attachDisposer(compo, function(){
						var comb, fn;
						for(comb in hotkeys) {
							Hotkey.off(hotkeys[comb]);
						}
					});
				},
				attach: function(el, type, comb, fn, ctr){
					if (filter_isKeyboardInput(el)) {
						this.on(el, type, comb, fn);
						return;
					}
					var x = ctr;
					while(x && x.slots == null) {
						x = x.parent;
					}
					if (x == null) {
						log_error('Slot-component not found:', comb);
						return;
					}
					var hotkeys = x.hotkeys;
					if (hotkeys == null) {
						hotkeys = x.hotkeys = {};
					}
					hotkeys[comb] = fn;
				}
			};
		}());
		// end:source /src/keyboard/Handler.js
		// source /src/touch/Handler.js
		var TouchHandler;
		(function(){
			
			// source ./utils.js
			var event_bind,
				event_unbind,
				event_trigger,
				isTouchable;
			
			(function(){
				isTouchable = 'ontouchstart' in global;
				
				event_bind = function(el, type, mix) {
					el.addEventListener(type, mix, false);
				};
				event_unbind = function (el, type, mix) {
					el.removeEventListener(type, mix, false);
				};
				event_trigger = function(el, type) {
					var event = new CustomEvent(type, {
						cancelable: true,
						bubbles: true
					});
					el.dispatchEvent(event);
				};
			}());
				
			// end:source ./utils.js
			// source ./Touch.js
			var Touch;
			(function(){
				Touch = function(el, type, fn) {
					this.el = el;
					this.fn = fn;
					this.dismiss = 0;
					event_bind(el, type, this);
					event_bind(el, MOUSE_MAP[type], this);
				};
				
				var MOUSE_MAP = {
					'mousemove': 'touchmove',
					'mousedown': 'touchstart',
					'mouseup': 'touchend'
				};
				var TOUCH_MAP = {
					'touchmove': 'mousemove',
					'touchstart': 'mousedown',
					'touchup': 'mouseup'
				};
				
				Touch.prototype = {
					handleEvent: function (event) {
						switch(event.type){
							case 'touchstart':
							case 'touchmove':
							case 'touchend':
								this.dismiss++;
								event = prepairTouchEvent(event);
								this.fn(event);
								break;
							case 'mousedown':
							case 'mousemove':
							case 'mouseup':
								if (--this.dismiss < 0) {
									this.dismiss = 0;
									this.fn(event);
								}
								break;
						}
					}
				};
				function prepairTouchEvent(event){
					var touch = null,
						touches = event.changedTouches;
					if (touches && touches.length) {
						touch = touches[0];
					}
					if (touch == null && event.touches) {
						touch = event.touches[0];
					}
					if (touch == null) {
						return event;
					}
					return createMouseEvent(event, touch);
				}
				function createMouseEvent (event, touch) {
					var obj = Object.create(MouseEvent.prototype);
					for (var key in event) {
						obj[key] = event[key];
					}
					for (var key in PROPS) {
						obj[key] = touch[key];
					}
					return new MouseEvent(TOUCH_MAP[event.type], obj);
				}
				var PROPS = {
					clientX: 1,
					clientY: 1,
					pageX: 1,
					pageY: 1,
					screenX: 1,
					screenY: 1
				};
			}());
			// end:source ./Touch.js
			// source ./FastClick.js
			var FastClick;
			(function(){
				FastClick = function (el, fn) {
					this.state = 0;
					this.el = el;
					this.fn = fn;
					this.startX = 0;
					this.startY = 0;
					this.tStart = 0;
					this.tEnd = 0;
					this.dismiss = 0;
					
					event_bind(el, 'touchstart', this);
					event_bind(el, 'touchend', this);
					event_bind(el, 'click', this);
				};
				
				var threshold_TIME = 300,
					threshold_DIST = 10,
					timestamp_LastTouch = null;
				
				FastClick.prototype = {
					handleEvent: function (event) {
						var type = event.type;
						switch (type) {
							case 'touchmove':
							case 'touchstart':
							case 'touchend':
								timestamp_LastTouch = event.timeStamp;
								this[type](event);
								break;
							case 'touchcancel':
								this.reset();
								break;
							case 'click':
								this.click(event);
								break;
						}
					},
					
					touchstart: function(event){
						event_bind(document.body, 'touchmove', this);
						
						var e = event.touches[0];
						
						this.state  = 1;
						this.tStart = event.timeStamp;
						this.startX = e.clientX;
						this.startY = e.clientY;
					},
					touchend: function (event) {
						this.tEnd = event.timeStamp;
						if (this.state === 1) {
							this.dismiss++;
							if (this.tEnd - this.tStart <= threshold_TIME) {
								this.call(event);
								return;
							}
							
							event_trigger(this.el, 'taphold');
							return;
						}
						this.reset();
					},
					click: function(event){
						if (timestamp_LastTouch != null) {
							var dt = timestamp_LastTouch - event.timeStamp;
							if (dt < 500) {
								return;
							}
						}
						if (--this.dismiss > -1) 
							return;
						
						var dt = event.timeStamp - this.tEnd;
						if (dt < 400) 
							return;
						
						this.dismiss = 0;
						this.call(event);
					},
					touchmove: function(event) {
						var e = event.touches[0];
						
						var dx = e.clientX - this.startX;
						if (dx < 0) dx *= -1;
						if (dx > threshold_DIST) {
							this.reset();
							return;
						}
						
						var dy = e.clientY - this.startY;
						if (dy < 0) dy *= -1;
						if (dy > threshold_DIST) {
							this.reset();
							return;
						}
					},
					
					reset: function(){
						this.state = 0;
						event_unbind(document.body, 'touchmove', this);
					},
					call: function(event){
						this.reset();
						this.fn(event);
					}
				};
				
			}());
			// end:source ./FastClick.js
			
			TouchHandler = {
				supports: function (type) {
					if (isTouchable === false) {
						return false;
					}
					switch(type){
						case 'click':
						case 'mousedown':
						case 'mouseup':
						case 'mousemove':
							return true;
					}
					return false;
				},
				on: function(el, type, fn){
					if ('click' === type) {
						return new FastClick(el, fn);
					}
					return new Touch(el, type, fn);
				}
			};
		}());
		// end:source /src/touch/Handler.js
	
		// source /src/compo/anchor.js
		/**
		 *	Get component that owns an element
		 **/
		var Anchor;
		(function(){
			Anchor =  {
				create: function(compo){
					var id = compo.ID;
					if (id == null){
						log_warn('Component should have an ID');
						return;
					}
					_cache[id] = compo;
				},
				resolveCompo: function(el, silent){
					if (el == null)
						return null;
					
					var ownerId, id, compo;
					do {
						id = el.getAttribute('x-compo-id');
						if (id != null) {
							if (ownerId == null) {
								ownerId = id;
							}
							compo = _cache[id];
							if (compo != null) {
								compo = Compo.find(compo, {
									key: 'ID',
									selector: ownerId,
									nextKey: 'components'
								});
								if (compo != null) 
									return compo;
							}
						}
						el = el.parentNode;
					}while(el != null && el.nodeType === 1);
		
					// if DEBUG
					ownerId && silent !== true && log_warn('No controller for ID', ownerId);
					// endif
					return null;
				},
				removeCompo: function(compo){
					var id = compo.ID;
					if (id != null) 
						_cache[id] = void 0;
				},
				getByID: function(id){
					return _cache[id];
				}
			};
		
			var _cache = {};
		}());
		
		// end:source /src/compo/anchor.js
		// source /src/compo/Compo.js
		var Compo, CompoProto;
		(function() {
		
			Compo = function () {
				if (this instanceof Compo){
					// used in Class({Base: Compo})
					return void 0;
				}
				
				return compo_create(arguments);
			};
		
			// source ./Compo.static.js
			obj_extend(Compo, {
				create: function(){
					return compo_create(arguments);
				},
				
				createClass: function(){
					
					var Ctor = compo_create(arguments),
						classProto = Ctor.prototype;
					classProto.Construct = Ctor;
					return Class(classProto);
				},
				
				initialize: function(mix, model, ctx, container, parent) {
					if (mix == null)
						throw Error('Undefined is not a component');
					
					if (container == null){
						if (ctx && ctx.nodeType != null){
							container = ctx;
							ctx = null;
						}else if (model && model.nodeType != null){
							container = model;
							model = null;
						}
					}
					var node;
					function createNode(compo) {
						node = {
							controller: compo,
							type: Dom.COMPONENT
						};
					}
					if (typeof mix === 'string'){
						if (/^[^\s]+$/.test(mix)) {
							var compo = mask.getHandler(mix);
							if (compo == null)
								throw Error('Component not found: ' + mix);
							
							createNode(compo);
						} else {
							createNode(Compo({
								template: mix
							}));
						}
					}
					else if (typeof mix === 'function') {
						createNode(mix);
					}
					
					if (parent == null && container != null) {
						parent = Anchor.resolveCompo(container);
					}
					if (parent == null){
						parent = new Compo();
					}
					
					var dom = mask.render(node, model, ctx, null, parent),
						instance = parent.components[parent.components.length - 1];
			
					if (container != null){
						container.appendChild(dom);
						Compo.signal.emitIn(instance, 'domInsert');
					}
					
					return instance;
				},
			
				
				find: function(compo, selector){
					return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
				},
				closest: function(compo, selector){
					return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
				},
			
				dispose: compo_dispose,
				
				ensureTemplate: compo_ensureTemplate,
				
				attachDisposer: compo_attachDisposer,
			
				config: {
					selectors: {
						'$': function(compo, selector) {
							var r = domLib_find(compo.$, selector)
							// if DEBUG
							if (r.length === 0) 
								log_warn('<compo-selector> - element not found -', selector, compo);
							// endif
							return r;
						},
						'compo': function(compo, selector) {
							var r = Compo.find(compo, selector);
							// if DEBUG
							if (r == null) 
								log_warn('<compo-selector> - component not found -', selector, compo);
							// endif
							return r;
						}
					},
					/**
					 *	@default, global $ is used
					 *	IDOMLibrary = {
					 *	{fn}(elements) - create dom-elements wrapper,
					 *	on(event, selector, fn) - @see jQuery 'on'
					 *	}
					 */
					setDOMLibrary: function(lib) {
						if (domLib === lib) 
							return;
						
						domLib = lib;
						domLib_initialize();
					},
			
					getDOMLibrary: function(){
						return domLib;
					},
					
					eventDecorator: function(mix){
						if (typeof mix === 'function') {
							EventDecorator = mix;
							return;
						}
						if (typeof mix === 'string') {
							console.error('EventDecorators are not used. Touch&Mouse support is already integrated');
							EventDecorator = EventDecos[mix];
							return;
						}
						if (typeof mix === 'boolean' && mix === false) {
							EventDecorator = null;
							return;
						}
					}
			
				},
			
				pipe: Pipes.pipe,
				
				resource: function(compo){
					var owner = compo;
					
					while (owner != null) {
						
						if (owner.resource) 
							return owner.resource;
						
						owner = owner.parent;
					}
					
					return include.instance();
				},
				
				plugin: function(source){
					// if DEBUG
					eval(source);
					// endif
				},
				
				Dom: {
					addEventListener: dom_addEventListener
				}
			});
			
			
			// end:source ./Compo.static.js
			// source ./async.js
			(function(){
				Compo.pause = function(compo, ctx){
					if (ctx != null) {
						if (ctx.defers == null) {
							// async components
							ctx.defers = [];
						}
						if (ctx.resolve == null) {
							obj_extend(ctx, class_Dfr.prototype);
						}
						ctx.async = true;
						ctx.defers.push(compo);
					}
					
					obj_extend(compo, CompoProto);
					return function(){
						Compo.resume(compo, ctx);
					};
				};
				Compo.resume = function(compo, ctx){
					compo.async = false;
			
					// fn can be null when calling resume synced after pause
					if (compo.resume) {
						compo.resume();
					}
					if (ctx == null) {
						return;
					}
					
					var busy = false,
						dfrs = ctx.defers,
						imax = dfrs.length,
						i = -1,
						x;
					while ( ++i < imax ){
						x = dfrs[i];
						
						if (x === compo) {
							dfrs[i] = null;
							continue;
						}
						busy = busy || x != null;
					}
					if (busy === false) 
						ctx.resolve();
				};
				
				var CompoProto = {
					async: true,
					await: function(resume){
						this.resume = resume;
					}
				};
			}());
			// end:source ./async.js
		
			CompoProto = {
				type: Dom.CONTROLLER,
				__resource: null,
				
				ID: null,
				
				tagName: null,
				compoName: null,
				nodes: null,
				components: null,
				expression: null,
				attr: null,
				model: null,
				scope: null,
				
				slots: null,
				pipes: null,
				
				compos: null,
				events: null,
				hotkeys: null,
				async: false,
				await: null,
				
				meta: {
					/* render modes, relevant for mask-node */
					mode: null,
					modelMode: null,
					attributes: null,
					serializeNodes: null,
					handleAttributes: null,
				},
				
				onRenderStart: null,
				onRenderEnd: null,
				render: null,
				renderStart: function(model, ctx, container){
						
					if (compo_meta_executeAttributeHandler(this, model) === false) {
						// errored
						return;
					}
					compo_ensureTemplate(this);
					
					if (is_Function(this.onRenderStart)){
						var x = this.onRenderStart(model, ctx, container);
						if (x !== void 0 && dfr_isBusy(x)) 
							compo_prepairAsync(x, this, ctx);
					}
				},
				renderEnd: function(elements, model, ctx, container){
					
					Anchor.create(this, elements);
		
					this.$ = domLib(elements);
		
					if (this.events != null) {
						Events_.on(this, this.events);
					}
					if (this.compos != null) {
						Children_.select(this, this.compos);
					}
					if (this.hotkeys != null) {
						KeyboardHandler.hotkeys(this, this.hotkeys);
					}
					if (is_Function(this.onRenderEnd)) {
						this.onRenderEnd(elements, model, ctx, container);
					}
				},
				appendTo: function(el) {
					this.$.appendTo(el);
					this.emitIn('domInsert');
					return this;
				},
				append: function(template, model, selector) {
					var parent;
		
					if (this.$ == null) {
						var ast = is_String(template) ? mask.parse(template) : template;
						var parent = this;				
						if (selector) {
							parent = find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'));
							if (parent == null) {
								log_error('Compo::append: Container not found');
								return this;
							}
						}
						parent.nodes = [parent.nodes, ast];
						return this;
					}
					
					var frag = mask.render(template, model, null, null, this);
					parent = selector
						? this.$.find(selector)
						: this.$;
					
					parent.append(frag);
					// @todo do not emit to created compos before
					this.emitIn('domInsert');
					return this;
				},
				find: function(selector){
					return find_findSingle(
						this, selector_parse(selector, Dom.CONTROLLER, 'down')
					);
				},
				findAll: function(selector){
					return find_findAll(
						this, selector_parse(selector, Dom.CONTROLLER, 'down')
					);
				},
				closest: function(selector){
					return find_findSingle(
						this, selector_parse(selector, Dom.CONTROLLER, 'up')
					);
				},
				on: function() {
					var x = _Array_slice.call(arguments);
					if (arguments.length < 3) {
						log_error('Invalid Arguments Exception @use .on(type,selector,fn)');
						return this;
					}
		
					if (this.$ != null) 
						Events_.on(this, [x]);
					
					if (this.events == null) {
						this.events = [x];
					} else if (is_Array(this.events)) {
						this.events.push(x);
					} else {
						this.events = [x, this.events];
					}
					return this;
				},
				remove: function() {
					compo_removeElements(this);
					compo_detachChild(this);
					compo_dispose(this);
		
					this.$ = null;
					return this;
				},
		
				slotState: function(slotName, isActive){
					Compo.slot.toggle(this, slotName, isActive);
					return this;
				},
		
				signalState: function(signalName, isActive){
					Compo.signal.toggle(this, signalName, isActive);
					return this;
				},
		
				emitOut: function(signalName /* args */){
					Compo.signal.emitOut(
						this,
						signalName,
						this,
						arguments.length > 1
							? _Array_slice.call(arguments, 1)
							: null
					);
					return this;
				},
		
				emitIn: function(signalName /* args */){
					Compo.signal.emitIn(
						this,
						signalName,
						this,
						arguments.length > 1
							? _Array_slice.call(arguments, 1)
							: null
					);
					return this;
				},
				
				$scope: function(path){
					var accessor = '$scope.' + path;
					return mask.Utils.Expression.eval(accessor, null, null, this);
				},
				$eval: function(expr, model_, ctx_){
					return mask.Utils.Expression.eval(expr, model_ || this.model, ctx_, this);
				},
			};
		
			Compo.prototype = CompoProto;
		}());
		
		// end:source /src/compo/Compo.js
		
		// source /src/signal/exports.js
		(function(){
			
			// source ./utils.js
			var _hasSlot,
				_fire;
				
			(function(){
				// @param sender - event if sent from DOM Event or CONTROLLER instance
				_fire = function (ctr, slot, sender, args_, direction) {
					if (ctr == null) {
						return false;
					}
					var found = false,
						args  = args_,
						fn = ctr.slots != null && ctr.slots[slot];
						
					if (typeof fn === 'string') {
						fn = ctr[fn];
					}
					if (typeof fn === 'function') {
						found = true;
						
						var isDisabled = ctr.slots.__disabled != null && ctr.slots.__disabled[slot];
						if (isDisabled !== true) {
			
							var result = args == null
								? fn.call(ctr, sender)
								: fn.apply(ctr, [ sender ].concat(args));
			
							if (result === false) {
								return true;
							}
							if (is_ArrayLike(result)) {
								args = result;
							}
						}
					}
			
					if (direction === -1 && ctr.parent != null) {
						return _fire(ctr.parent, slot, sender, args, direction) || found;
					}
			
					if (direction === 1 && ctr.components != null) {
						var compos = ctr.components,
							imax = compos.length,
							i = 0;
						for (; i < imax; i++) {
							found = _fire(compos[i], slot, sender, args, direction) || found;
						}
					}
					
					return found;
				} // _fire()
			
				_hasSlot = function (ctr, slot, direction, isActive) {
					if (ctr == null) {
						return false;
					}
					var slots = ctr.slots;
					if (slots != null && slots[slot] != null) {
						if (typeof slots[slot] === 'string') {
							slots[slot] = ctr[slots[slot]];
						}
						if (typeof slots[slot] === 'function') {
							if (isActive === true) {
								if (slots.__disabled == null || slots.__disabled[slot] !== true) {
									return true;
								}
							} else {
								return true;
							}
						}
					}
					if (direction === -1 && ctr.parent != null) {
						return _hasSlot(ctr.parent, slot, direction);
					}
					if (direction === 1 && ctr.components != null) {
						for (var i = 0, length = ctr.components.length; i < length; i++) {
							if (_hasSlot(ctr.components[i], slot, direction)) {
								return true;
							}
						}
					}
					return false;
				}; 
			}());
			
			// end:source ./utils.js
			// source ./toggle.js
			var _toggle_all,
				_toggle_single;
			(function(){
				_toggle_all = function (ctr, slot, isActive) {
			
					var parent = ctr,
						previous = ctr;
					while ((parent = parent.parent) != null) {
						__toggle_slotState(parent, slot, isActive);
			
						if (parent.$ == null || parent.$.length === 0) {
							// we track previous for changing elements :disable state
							continue;
						}
			
						previous = parent;
					}
			
					__toggle_slotStateWithChilds(ctr, slot, isActive);
					__toggle_elementsState(previous, slot, isActive);
				};
			
				_toggle_single = function(ctr, slot, isActive) {
					__toggle_slotState(ctr, slot, isActive);
			
					if (!isActive && (_hasSlot(ctr, slot, -1, true) || _hasSlot(ctr, slot, 1, true))) {
						// there are some active slots; do not disable elements;
						return;
					}
					__toggle_elementsState(ctr, slot, isActive);
				};
				
			
				function __toggle_slotState(ctr, slot, isActive) {
					var slots = ctr.slots;
					if (slots == null || slots.hasOwnProperty(slot) === false) {
						return;
					}
					var disabled = slots.__disabled;
					if (disabled == null) {
						disabled = slots.__disabled = {};
					}
					disabled[slot] = isActive === false;
				}
			
				function __toggle_slotStateWithChilds(ctr, slot, isActive) {
					__toggle_slotState(ctr, slot, isActive);
					
					var compos = ctr.components;
					if (compos != null) {
						var imax = compos.length,
							i = 0;
						for(; i < imax; i++) {
							__toggle_slotStateWithChilds(compos[i], slot, isActive);
						}
					}
				}
			
				function __toggle_elementsState(ctr, slot, isActive) {
					if (ctr.$ == null) {
						log_warn('Controller has no elements to toggle state');
						return;
					}
			
					domLib() 
						.add(ctr.$.filter('[data-signals]')) 
						.add(ctr.$.find('[data-signals]')) 
						.each(function(index, node) {
							var signals = node.getAttribute('data-signals');
				
							if (signals != null && signals.indexOf(slot) !== -1) {
								node[isActive === true ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled');
							}
						});
				}
			
				
			
			}());
			// end:source ./toggle.js
			// source ./attributes.js
			(function(){
				
				_create('signal');
				
				_createEvent('change');
				_createEvent('click');
				_createEvent('tap', 'click');
			
				_createEvent('keypress');
				_createEvent('keydown');
				_createEvent('keyup');
				_createEvent('mousedown');
				_createEvent('mouseup');
				
				_createEvent('press', 'keydown');
				_createEvent('shortcut', 'keydown');
				
				function _createEvent(name, type) {
					_create(name, type || name);
				}
				function _create(name, asEvent) {
					mask.registerAttrHandler('x-' + name, 'client', function(node, attrValue, model, ctx, el, ctr){
						_attachListener(el, ctr, attrValue, asEvent);
					});
				}
				
				function _attachListener(el, ctr, definition, asEvent) {
					var arr = definition.split(';'),
						signals = '',
						imax = arr.length,
						i = -1,
						x;
					
					var i_colon,
						i_param,
						event,
						mix,
						param,
						name,
						fn;
						
					while ( ++i < imax ) {
						x = arr[i].trim();
						if (x === '') 
							continue;
						
						mix = param = name = null;
						
						i_colon = x.indexOf(':');
						if (i_colon !== -1) {
							mix = x.substring(0, i_colon);
							i_param = mix.indexOf('(');
							if (i_param !== -1) {
								param = mix.substring(i_param + 1, mix.lastIndexOf(')'));
								mix = mix.substring(0, i_param);
								
								// if DEBUG
								param === '' && log_error('Not valid signal parameter');
								// endif
							}
							x = x.substring(i_colon + 1).trim();
						}
						
						name = x;
						fn = _createListener(ctr, name);
						
						if (asEvent == null) {
							event = mix;
						} else {
							event = asEvent;
							param = mix;
						}
						
						if (!event) {
							log_error('Signal: Eventname is not set', arr[i]);
						}
						if (!fn) {
							log_warn('Slot not found:', name);
							continue;
						}
						
						signals += ',' + name + ',';
						dom_addEventListener(el, event, fn, param, ctr);
					}
					
					if (signals !== '') {
						var attr = el.getAttribute('data-signals');
						if (attr != null) {
							signals = attr + signals;
						}
						el.setAttribute('data-signals', signals);
					}
				}
				
				function _createListener (ctr, slot) {
					if (_hasSlot(ctr, slot, -1) === false) {
						return null;
					}
					return function(event) {
						var args = arguments.length > 1
							? _Array_slice.call(arguments, 1)
							: null;
						_fire(ctr, slot, event, args, -1);
					};
				}
			}());
			// end:source ./attributes.js
			
			obj_extend(Compo, {
				signal: {
					toggle: _toggle_all,
		
					// to parent
					emitOut: function(controller, slot, sender, args) {
						var captured = _fire(controller, slot, sender, args, -1);
						
						// if DEBUG
						!captured && log_warn('Signal %c%s','font-weight:bold;', slot, 'was not captured');
						// endif
						
					},
					// to children
					emitIn: function(controller, slot, sender, args) {
						_fire(controller, slot, sender, args, 1);
					},
		
					enable: function(controller, slot) {
						_toggle_all(controller, slot, true);
					},
					
					disable: function(controller, slot) {
						_toggle_all(controller, slot, false);
					}
				},
				slot: {
					toggle: _toggle_single,
					enable: function(controller, slot) {
						_toggle_single(controller, slot, true);
					},
					disable: function(controller, slot) {
						_toggle_single(controller, slot, false);
					},
					invoke: function(controller, slot, event, args) {
						var slots = controller.slots;
						if (slots == null || typeof slots[slot] !== 'function') {
							log_error('Slot not found', slot, controller);
							return null;
						}
		
						if (args == null) {
							return slots[slot].call(controller, event);
						}
		
						return slots[slot].apply(controller, [event].concat(args));
					},
		
				}
		
			});
			
		}());
		// end:source /src/signal/exports.js
		
		// source /src/DomLite.js
		/*
		 * Extrem simple Dom Library. If (jQuery | Kimbo | Zepto) is not used.
		 * Only methods, required for the Compo library are implemented.
		 */
		var DomLite;
		(function(document){
			if (document == null) 
				return;
			
			Compo.DomLite = DomLite = function(els){
				if (this instanceof DomLite === false) 
					return new DomLite(els);
				
				return this.add(els)
			};
			
			if (domLib == null) 
				domLib = DomLite;
			
			var Proto = DomLite.fn = {
				constructor: DomLite,
				length: 0,
				add: function(mix){
					if (mix == null) 
						return this;
					if (is_Array(mix) === true) 
						return each(mix, this.add, this);
					
					var type = mix.nodeType;
					if (type === 11 /* Node.DOCUMENT_FRAGMENT_NODE */)
						return each(mix.childNodes, this.add, this);
						
					if (type == null) {
						if (typeof mix.length === 'number') 
							return each(mix, this.add, this);
						
						log_warn('Uknown domlite object');
						return this;
					}
					
					this[this.length++] = mix;
					return this;
				},
				on: function(){
					return binder.call(this, on, delegate, arguments);
				},
				off: function(){
					return binder.call(this, off, undelegate, arguments);
				},
				find: function(sel){
					return each(this, function(node){
						this.add(_$$.call(node, sel));
					}, new DomLite);
				},
				filter: function(sel){
					return each(this, function(node, index){
						_is(node, sel) === true && this.add(node);
					}, new DomLite);
				},
				parent: function(){
					var x = this[0];
					return new DomLite(x && x.parentNode);
				},
				children: function(sel){
					var set = each(this, function(node){
						this.add(node.childNodes);
					}, new DomLite);
					return sel == null ? set : set.filter(sel);
				},
				closest: function(selector){
					var x = this[0],
						dom = new DomLite;
					while( x != null && x.parentNode != null){
						x = x.parentNode;
						if (_is(x, selector)) 
							return dom.add(x);
					}
					return dom;
				},
				next: function(selector){
					var x = this[0],
						dom = new DomLite;
					while (x != null && x.nextElementSibling != null) {
						x = x.nextElementSibling;
						if (selector == null) {
							return dom.add(x);
						}
						if (_is(x, selector)) {
							return dom.add(x);
						}
					}
					return dom;
				},
				remove: function(){
					return each(this, function(x){
						x.parentNode.removeChild(x);
					});
				},
				text: function(mix){
					if (arguments.length === 0) {
						return aggr('', this, function(txt, x){
							return txt + x.textContent;
						});
					}
					return each(this, function(x){
						x.textContent = mix;
					});
				},
				html: function(mix){
					if (arguments.length === 0) {
						return aggr('', this, function(txt, x){
							return txt + x.innerHTML;
						});
					}
					return each(this, function(x){
						x.innerHTML = mix;
					});
				},
				val: function(mix){
					if (arguments.length === 0) {
						return this.length === 0 ? null : this[0].value;
					}
					if (this.length !== 0) {
						this[0].value = mix;
					}
					return this;
				},
				focus: function(){
					return each(this, function(x){
						x.focus && x.focus();
					});
				}
			};
			
			(function(){
				each(['show', 'hide'], function(method) {
					Proto[method] = function(){
						return each(this, function(x){
							x.style.display = method === 'hide' ? 'none' : '';
						});
					};
				});
			}());
			
			(function(){
				var Manip = {
					append: function(node, el){
						after_(node, node.lastChild, el);
					},
					prepend: function(node, el){
						before_(node, node.firstChild, el);
					},
					after: function(node, el){
						after_(node.parentNode, node, el);
					},
					before: function(node, el){
						before_(node.parentNode, node, el);
					}
				};
				each(['append', 'prepend', 'before', 'after'], function(method){
					var fn = Manip[method];
					Proto[method] = function(mix){
						var isArray = is_Array(mix);
						return each(this, function(node){
							if (isArray) {
								each(mix, function(el){
									fn(node, el);
								});
								return;
							}
							fn(node, mix);
						});
					};
				});
				function before_(parent, anchor, el){
					if (parent == null || el == null)
						return;
					parent.insertBefore(el, anchor);
				}
				function after_(parent, anchor, el) {
					var next = anchor != null ? anchor.nextSibling : null;
					before_(parent, next, el);
				}
			}());
			
			
			function each(arr, fn, ctx){
				if (arr == null) 
					return ctx || arr;
				var imax = arr.length,
					i = -1;
				while( ++i < imax ){
					fn.call(ctx || arr, arr[i], i);
				}
				return ctx || arr;
			}
			function aggr(seed, arr, fn, ctx) {
				each(arr, function(x, i){
					seed = fn.call(ctx || arr, seed, arr[i], i);
				});
				return seed;
			}
			function indexOf(arr, fn, ctx){
				if (arr == null) 
					return -1;
				var imax = arr.length,
					i = -1;
				while( ++i < imax ){
					if (fn.call(ctx || arr, arr[i], i) === true)
						return i;
				}
				return -1;
			}
			
			var docEl = document.documentElement;
			var _$$ = docEl.querySelectorAll;
			var _is = (function(){
				var matchesSelector =
					docEl.webkitMatchesSelector ||
					docEl.mozMatchesSelector ||
					docEl.msMatchesSelector ||
					docEl.oMatchesSelector ||
					docEl.matchesSelector
				;
				return function (el, selector) {
					return el == null || el.nodeType !== 1
						? false
						: matchesSelector.call(el, selector);
				};	
			}());
			
			/* Events */
			var binder, on, off, delegate, undelegate;
			(function(){
				binder = function(bind, bindSelector, args){
					var length = args.length,
						fn;
					if (2 === length) 
						fn = bind
					if (3 === length) 
						fn = bindSelector;
					
					if (fn != null) {
						return each(this, function(node){
							fn.apply(DomLite(node), args);
						});
					}
					log_error('`DomLite.on|off` - invalid arguments count');
					return this;
				};
				on = function(type, fn){
					return run(this, _addEvent, type, fn);
				};
				off = function(type, fn){
					return run(this, _remEvent, type, fn);
				};
				delegate = function(type, selector, fn){
					function guard(event){
						var el = event.target,
							current = event.currentTarget;
						if (current === el) 
							return;
						while(el != null && el !== current){
							if (_is(el, selector)) {
								fn(event);
								return;
							}
							el = el.parentNode;
						}
					}
					(fn._guards || (fn._guards = [])).push(guard);
					return on.call(this, type, guard);
				};
				undelegate = function(type, selector, fn){
					return each(fn._quards, function(guard){
						off.call(this, type, guard);
					}, this);
				};
				
				function run(set, handler, type, fn){
					return each(set, function(node){
						handler.call(node, type, fn, false);
					});
				}
				var _addEvent = docEl.addEventListener,
					_remEvent = docEl.removeEventListener;
			}());
			
			/* class handler */
			(function(){
				var isClassListSupported = docEl.classList != null;
				var hasClass = isClassListSupported === true
					? function (node, klass) {
						return node.classList.contains(klass);
					}
					: function(node, klass) {
						return -1 !== (' ' + node.className + ' ').indexOf(' ' + klass + ' ');
					};
				Proto.hasClass = function(klass){
					return -1 !== indexOf(this, function(node){
						return hasClass(node, klass)
					});
				};
				var Shim;
				(function(){
					Shim = {
						add: function(node, klass){
							if (hasClass(node, klass) === false) 
								add(node, klass);
						},
						remove: function(node, klass){
							if (hasClass(node, klass) === true) 
								remove(node, klass);
						},
						toggle: function(node, klass){
							var fn = hasClass(node, klass) === true
								? remove
								: add;
							fn(node, klass);
						}
					};
					function add(node, klass){
						node.className += ' ' + klass;
					}
					function remove(node, klass){
						node.className = (' ' + node.className + ' ').replace(' ' + klass + ' ', ' ');
					}
				}());
				
				each(['add', 'remove', 'toggle'], function(method){
					var mutatorFn = isClassListSupported === false
						? Shim[method]
						: function(node, klass){
							var classList = node.classList;
							classList[method].call(classList, klass);
						};
					Proto[method + 'Class'] = function(klass){
						return each(this, function(node){
							mutatorFn(node, klass);
						});
					};
				});
					
			}());
			
			
			// Events
			(function(){
				var createEvent = function(type){
					var event = document.createEvent('Event');
					event.initEvent(type, true, true);
					return event;
				};
				var create = function(type, data){
					if (data == null) 
						return createEvent(type);
					var event = document.createEvent('CustomEvent');
					event.initCustomEvent(type, true, true, data);
					return event;
				};
				var dispatch = function(node, event){
					node.dispatchEvent(event);
				};
				Proto['trigger'] = function(type, data){
					var event = create(type, data);
					return each(this, function(node){
						dispatch(node, event);
					});
				};
			}());
			
			// Attributes
			(function(){
				Proto['attr'] = function(name, val){
					if (val === void 0) 
						return this[0] && this[0].getAttribute(name);
					return each(this, function(node){
						node.setAttribute(name, val);
					});
				};
				Proto['removeAttr'] = function(name){
					return each(this, function(node){
						node.removeAttribute(name);
					});
				};
			}());
			
			if (Object.setPrototypeOf) 
				Object.setPrototypeOf(Proto, Array.prototype);
			else if (Proto.__proto__) 
				Proto.__proto__ = Array.prototype;
			
			DomLite.prototype = Proto;
			domLib_initialize();
			
		}(global.document));
		// end:source /src/DomLite.js
		// source /src/jcompo/jCompo.js
		// try to initialize the dom lib, or is then called from `setDOMLibrary`
		domLib_initialize();
		
		function domLib_initialize(){
			if (domLib == null || domLib.fn == null)
				return;
			
			domLib.fn.compo = function(selector){
				if (this.length === 0)
					return null;
				
				var compo = Anchor.resolveCompo(this[0], true);
		
				return selector == null
					? compo
					: find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
			};
		
			domLib.fn.model = function(selector){
				var compo = this.compo(selector);
				if (compo == null)
					return null;
				
				var model = compo.model;
				while(model == null && compo.parent){
					compo = compo.parent;
					model = compo.model;
				}
				return model;
			};
			
			// insert
			(function(){
				var jQ_Methods = [
					'append',
					'prepend',
					'before',
					'after'
				];
				
				[
					'appendMask',
					'prependMask',
					'beforeMask',
					'afterMask'
				].forEach(function(method, index){
					
					domLib.fn[method] = function(template, model, ctr, ctx){
						if (this.length === 0) {
							// if DEBUG
							log_warn('<jcompo> $.', method, '- no element was selected(found)');
							// endif
							return this;
						}
						if (this.length > 1) {
							// if DEBUG
							log_warn('<jcompo> $.', method, ' can insert only to one element. Fix is comming ...');
							// endif
						}
						if (ctr == null) {
							ctr = index < 2
								? this.compo()
								: this.parent().compo()
								;
						}
						
						var isUnsafe = false;
						if (ctr == null) {
							ctr = {};
							isUnsafe = true;
						}
						
						
						if (ctr.components == null) {
							ctr.components = [];
						}
						
						var compos = ctr.components,
							i = compos.length,
							fragment = mask.render(template, model, ctx, null, ctr);
						
						var self = this[jQ_Methods[index]](fragment),
							imax = compos.length;
						
						for (; i < imax; i++) {
							Compo.signal.emitIn(compos[i], 'domInsert');
						}
						
						if (isUnsafe && imax !== 0) {
							// if DEBUG
							log_warn(
								'$.'
								, method
								, '- parent controller was not found in Elements DOM.'
								, 'This can lead to memory leaks.'
							);
							log_warn(
								'Specify the controller directly, via $.'
								, method
								, '(template[, model, controller, ctx])'
							);
							// endif
						}
						
						return self;
					};
					
				});
			}());
			
			
			// remove
			(function(){
				var jq_remove = domLib.fn.remove,
					jq_empty = domLib.fn.empty
					;
				
				domLib.fn.removeAndDispose = function(){
					this.each(each_tryDispose);
					
					return jq_remove.call(this);
				};
				
				domLib.fn.emptyAndDispose = function(){
					this.each(each_tryDisposeChildren);
					
					return jq_empty.call(this);
				}
				
				
				function each_tryDispose(index, node){
					node_tryDispose(node);
				}
				
				function each_tryDisposeChildren(index, node){
					node_tryDisposeChildren(node);
				}
				
			}());
		}
		
		// end:source /src/jcompo/jCompo.js
		
	
		// source /src/handler/slot.js
		
		function SlotHandler() {}
		
		mask.registerHandler(':slot', SlotHandler);
		
		SlotHandler.prototype = {
			constructor: SlotHandler,
			renderEnd: function(element, model, cntx, container){
				this.slots = {};
		
				this.expression = this.attr.on;
		
				this.slots[this.attr.signal] = this.handle;
			},
			handle: function(){
				var expr = this.expression;
		
				mask.Utils.Expression.eval(expr, this.model, global, this);
			}
		};
		
		// end:source /src/handler/slot.js
	
	
		return Compo;
	
	}(Mask));
	
	// end:source /ref-mask-compo/lib/compo.embed.js
	// source /ref-mask-j/lib/jmask.embed.js
	
	var jmask = exports.jmask = Mask.jmask = (function(mask){
		
		// source ../src/scope-vars.js
		var Dom = mask.Dom,
			_mask_render = mask.render,
			_mask_parse = mask.parse,
			_mask_ensureTmplFnOrig = mask.Utils.ensureTmplFn,
			_signal_emitIn = (mask.Compo || Compo).signal.emitIn;
			
		
		function _mask_ensureTmplFn(value) {
			if (typeof value !== 'string') {
				return value;
			}
			return _mask_ensureTmplFnOrig(value);
		}
		
		
		// end:source ../src/scope-vars.js
	
		// source ../src/util/array.js
		var arr_eachAny,
			arr_unique;
		
		(function(){
		
			arr_eachAny = function(mix, fn) {
				if (is_ArrayLike(mix) === false) {
					fn(mix);
					return;
				}
				var imax = mix.length,
					i = -1;
				while ( ++i < imax ){
					fn(mix[i], i);
				}
			};
			
			(function() {
				arr_unique = function(array) {
					hasDuplicate_ = false;
					array.sort(sort);
					if (hasDuplicate_ === false) 
						return array;
					
					var duplicates = [],
						i = 0,
						j = 0,
						imax = array.length - 1;
			
					while (i < imax) {
						if (array[i++] === array[i]) {
							duplicates[j++] = i;
						}
					}
					while (j--) {
						array.splice(duplicates[j], 1);
					}
			
					return array;
				};
				
				var hasDuplicate_ = false;
				function sort(a, b) {
					if (a === b) {
						hasDuplicate_ = true;
						return 0;
					}
					return 1;
				}
			}());
			
		}());
		
		// end:source ../src/util/array.js
		// source ../src/util/selector.js
		var selector_parse,
			selector_match;
			
		(function(){
			
			selector_parse = function(selector, type, direction) {
				if (selector == null) 
					log_error('selector is null for the type', type);
				
				if (typeof selector === 'object') 
					return selector;
				
				var key,
					prop,
					nextKey,
					filters,
			
					_key,
					_prop,
					_selector;
			
				var index = 0,
					length = selector.length,
					c,
					end,
					matcher, root, current,
					eq,
					slicer;
			
				if (direction === 'up') {
					nextKey = sel_key_UP;
				} else {
					nextKey = type === Dom.SET
						? sel_key_MASK
						: sel_key_COMPOS;
				}
			
				while (index < length) {
			
					c = selector.charCodeAt(index);
			
					if (c < 33) {
						index++;
						continue;
					}
					if (c === 62 /* > */) {
						if (matcher == null) {
							root = matcher = {
								selector: '__scope__',
								nextKey: nextKey,
								filters: null,
								next: {
									type: 'children',
									matcher: null
								}
							};
						} else {
							matcher.next = {
								type: 'children',
								matcher: null
							};
						}
						current = matcher;
						matcher = null;
						index++;
						continue;
					}
					
					end = selector_moveToBreak(selector, index + 1, length);
					if (c === 46 /*.*/ ) {
						_key = 'class';
						_prop = sel_key_ATTR;
						_selector = sel_hasClassDelegate(selector.substring(index + 1, end));
					}
			
					else if (c === 35 /*#*/ ) {
						_key = 'id';
						_prop = sel_key_ATTR;
						_selector = selector.substring(index + 1, end);
					}
			
					else if (c === 91 /*[*/ ) {
						eq = selector.indexOf('=', index);
						//if DEBUG
						eq === -1 && console.error('Attribute Selector: should contain "="');
						// endif
			
						_prop = sel_key_ATTR;
						_key = selector.substring(index + 1, eq);
			
						//slice out quotes if any
						c = selector.charCodeAt(eq + 1);
						slicer = c === 34 || c === 39 ? 2 : 1;
			
						_selector = selector.substring(eq + slicer, end - slicer + 1);
			
						// increment, as cursor is on closed ']'
						end++;
					}
					else if (c === 58 /*:*/ && selector.charCodeAt(index + 1) === 58) {
						index += 2;
						var start = index, name, expr;
						do {
							c = selector.charCodeAt(index);
						} while (c >= 97 /*a*/ && c <= 122 /*z*/ && ++index < length);
						
						name = selector.substring(start, index);
						if (c === 40 /*(*/) {
							start = ++index;
							do {
								c = selector.charCodeAt(index);
							} while (c !== 41/*)*/ && ++index < length);
							expr = selector.substring(start, index);
							index++;
						}
						var pseudo = PseudoSelectors(name, expr);
						if (matcher == null) {
							matcher = {
								selector: '*',
								nextKey: nextKey
							};
						}
						if (root == null) {
							root = matcher;
						}
						if (matcher.filters == null) {
							matcher.filters = [];
						}
						matcher.filters.push(pseudo);
						continue;
					}
					else {
						
						if (matcher != null) {
							matcher.next = {
								type: 'any',
								matcher: null
							};
							current = matcher;
							matcher = null;
						}
						
						_prop = null;
						_key = type === Dom.SET ? 'tagName' : 'compoName';
						_selector = selector.substring(index, end);
					}
			
					index = end;
			
					if (matcher == null) {
						matcher = {
							key: _key,
							prop: _prop,
							selector: _selector,
							nextKey: nextKey,
							filters: null
						};
						if (root == null) 
							root = matcher;
							
						if (current != null) {
							current.next.matcher = matcher;
						}
						
						continue;
					}
					if (matcher.filters == null) 
						matcher.filters = [];
					
					matcher.filters.push({
						key: _key,
						selector: _selector,
						prop: _prop
					});
				}
				
				if (current && current.next) 
					current.next.matcher = matcher;
				
				return root;
			};
			
			selector_match = function(node, selector, type) {
				if (typeof selector === 'string') {
					if (type == null) {
						type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
					}
					selector = selector_parse(selector, type);
				}
				
				var obj = selector.prop ? node[selector.prop] : node,
					matched = false;
			
				if (obj == null) 
					return false;
				if (selector.selector === '*') {
					matched = true
				}
				else if (typeof selector.selector === 'function') {
					matched = selector.selector(obj[selector.key]);
				}
				else if (selector.selector.test != null) {
					if (selector.selector.test(obj[selector.key])) {
						matched = true;
					}
				}
				else  if (obj[selector.key] === selector.selector) {
					matched = true;
				}
			
				if (matched === true && selector.filters != null) {
					for(var i = 0, x, imax = selector.filters.length; i < imax; i++){
						x = selector.filters[i];
						
						if (typeof x === 'function') {
							matched = x(node, type);
							if (matched === false) 
								return false;
							continue;
						}
						if (selector_match(node, x, type) === false) {
							return false;
						}
					}
				}
			
				return matched;
			};
			
			// ==== private
			
			var sel_key_UP = 'parent',
				sel_key_MASK = 'nodes',
				sel_key_COMPOS = 'components',
				sel_key_ATTR = 'attr';
			
			
			function sel_hasClassDelegate(matchClass) {
				return function(className){
					return sel_hasClass(className, matchClass);
				};
			}
			
			// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
			function sel_hasClass(className, matchClass, index) {
				if (typeof className !== 'string')
					return false;
				
				if (index == null) 
					index = 0;
					
				index = className.indexOf(matchClass, index);
			
				if (index === -1)
					return false;
			
				if (index > 0 && className.charCodeAt(index - 1) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				var class_Length = className.length,
					match_Length = matchClass.length;
					
				if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				return true;
			}
			
			
			function selector_moveToBreak(selector, index, length) {
				var c, 
					isInQuote = false,
					isEscaped = false;
			
				while (index < length) {
					c = selector.charCodeAt(index);
			
					if (c === 34 || c === 39) {
						// '"
						isInQuote = !isInQuote;
					}
			
					if (c === 92) {
						// [\]
						isEscaped = !isEscaped;
					}
			
					if (c === 46 || c === 35 || c === 91 || c === 93 || c === 62 || c < 33) {
						// .#[]>
						if (isInQuote !== true && isEscaped !== true) {
							break;
						}
					}
					index++;
				}
				return index;
			}
			
			var PseudoSelectors;
			(function() {
				PseudoSelectors = function(name, expr) {
					var fn = Fns[name];
					if (fn !== void 0) 
						return fn;
					
					var worker = Workers[name];
					if (worker !== void 0) 
						return worker(expr);
					
					throw new Error('Uknown pseudo selector:' + name);
				};		
				var Fns = {
					text: function (node) {
						return node.type === Dom.TEXTNODE;
					},
					node: function(node) {
						return node.type === Dom.NODE;
					}
				};
				var Workers = {
					not: function(expr){
						return function(node, type){
							return !selector_match(node, expr, type);
						}
					}
				};
			}());
		}());
		
		// end:source ../src/util/selector.js
		// source ../src/util/utils.js
		var jmask_filter,
			jmask_find,
			jmask_clone,
			jmask_deepest,
			jmask_getText
			;
		
		(function(){
			
			jmask_filter = function(mix, matcher) {
				if (matcher == null) 
					return mix;
				
				var result = [];
				arr_eachAny(mix, function(node, i) {
					if (selector_match(node, matcher)) 
						result.push(node);
				});
				return result;
			};
			
			/**
			 * - mix (Node | Array[Node])
			 */
			jmask_find = function(mix, matcher, output, deep) {
				if (mix == null) {
					return output;
				}
				if (output == null) {
					output = [];
				}
				if (deep == null) {
					// is root and matchling like `> div` (childs only)
					if (matcher.selector === '__scope__') {
						deep = false;
						matcher = matcher.next.matcher;
					} else{
						deep = true;
					}
				}
				
				arr_eachAny(mix, function(node){
					if (selector_match(node, matcher) === false) {
						
						if (matcher.next == null && deep !== false) 
							jmask_find(node[matcher.nextKey], matcher, output, deep);
						
						return;
					}
					
					if (matcher.next == null) {
						output.push(node);
						if (deep === true) 
							jmask_find(node[matcher.nextKey], matcher, output, deep);
							
						return;
					}
					
					var next = matcher.next;
					deep = next.type !== 'children';
					jmask_find(node[matcher.nextKey], next.matcher, output, deep);
				});
				return output;
			};
			
			jmask_clone = function(node, parent){
				var clone = obj_create(node);
			
				var attr = node.attr;
				if (attr != null){
					clone.attr = obj_create(attr);
				}
			
				var nodes = node.nodes;
				if (nodes != null){
					if (is_ArrayLike(nodes) === false) {
						clone.nodes = [ jmask_clone(nodes, clone) ];
					}
					else {
						clone.nodes = [];
						var imax = nodes.length,
							i = 0;
						for(; i< imax; i++){
							clone.nodes[i] = jmask_clone(nodes[i], clone);
						}
					}
				}
				return clone;
			};
			
			
			jmask_deepest = function(node){
				var current = node,
					prev;
				while(current != null){
					prev = current;
					current = current.nodes && current.nodes[0];
				}
				return prev;
			};
			
			
			jmask_getText = function(node, model, ctx, controller) {
				if (Dom.TEXTNODE === node.type) {
					if (is_Function(node.content)) {
						return node.content('node', model, ctx, null, controller);
					}
					return node.content;
				}
			
				var output = '';
				if (node.nodes != null) {
					for(var i = 0, x, imax = node.nodes.length; i < imax; i++){
						x = node.nodes[i];
						output += jmask_getText(x, model, ctx, controller);
					}
				}
				return output;
			};
		
		}());
		
		// end:source ../src/util/utils.js
	
		// source ../src/jmask/jmask.js
		function jMask(mix) {
			if (this instanceof jMask === false) 
				return new jMask(mix);
			if (mix == null) 
				return this;
			if (mix.type === Dom.SET) 
				return mix;
			return this.add(mix);
		}
		
		var Proto = jMask.prototype = {
			constructor: jMask,
			type: Dom.SET,
			length: 0,
			components: null,
			add: function(mix) {
				var i, length;
		
				if (typeof mix === 'string') {
					mix = _mask_parse(mix);
				}
		
				if (is_ArrayLike(mix)) {
					for (i = 0, length = mix.length; i < length; i++) {
						this.add(mix[i]);
					}
					return this;
				}
		
				if (typeof mix === 'function' && mix.prototype.type != null) {
					// assume this is a controller
					mix = {
						controller: mix,
						type: Dom.COMPONENT
					};
				}
		
		
				var type = mix.type;
		
				if (!type) {
					// @TODO extend to any type?
					console.error('Only Mask Node/Component/NodeText/Fragment can be added to jmask set', mix);
					return this;
				}
		
				if (type === Dom.FRAGMENT) {
					var nodes = mix.nodes;
		
					for(i = 0, length = nodes.length; i < length;) {
						this[this.length++] = nodes[i++];
					}
					return this;
				}
		
				if (type === Dom.CONTROLLER) {
		
					if (mix.nodes != null && mix.nodes.length) {
						for (i = mix.nodes.length; i !== 0;) {
							// set controller as parent, as parent is mask dom node
							mix.nodes[--i].parent = mix;
						}
					}
		
					if (mix.$ != null) {
						this.type = Dom.CONTROLLER;
					}
				}
		
		
		
				this[this.length++] = mix;
				return this;
			},
			toArray: function() {
				return _Array_slice.call(this);
			},
			/**
			 *	render([model, cntx, container]) -> HTMLNode
			 * - model (Object)
			 * - cntx (Object)
			 * - container (Object)
			 * - returns (HTMLNode)
			 *
			 **/
			render: function(model, ctx, el, ctr) {
				this.components = [];
		
				if (this.length === 1) {
					return _mask_render(this[0], model, ctx, el, ctr || this);
				}
		
				if (el == null) {
					el = document.createDocumentFragment();
				}
		
				for (var i = 0, length = this.length; i < length; i++) {
					_mask_render(this[i], model, ctx, el, ctr || this);
				}
				return el;
			},
			prevObject: null,
			end: function() {
				return this.prevObject || this;
			},
			pushStack: function(nodes) {
				var next;
				next = jMask(nodes);
				next.prevObject = this;
				return next;
			},
			controllers: function() {
				if (this.components == null) {
					console.warn('Set was not rendered');
				}
				return this.pushStack(this.components || []);
			},
			mask: function(template) {
				if (arguments.length !== 0) {
					return this.empty().append(template);
				}
				return mask.stringify(this);
			},
		
			text: function(mix, ctx, ctr){
				if (typeof mix === 'string' && arguments.length === 1) {
					var node = [ new Dom.TextNode(mix) ];
		
					for(var i = 0, imax = this.length; i < imax; i++){
						this[i].nodes = node;
					}
					return this;
				}
		
				var str = '';
				for(var i = 0, imax = this.length; i < imax; i++){
					str += jmask_getText(this[i], mix, ctx, ctr);
				}
				return str;
			}
		};
		
		arr_each(['append', 'prepend'], function(method) {
		
			Proto[method] = function(mix) {
				var $mix = jMask(mix),
					i = 0,
					length = this.length,
					arr, node;
		
				for (; i < length; i++) {
					node = this[i];
					// we create each iteration a new array to prevent collisions in future manipulations
					arr = $mix.toArray();
		
					for (var j = 0, jmax = arr.length; j < jmax; j++) {
						arr[j].parent = node;
					}
		
					if (node.nodes == null) {
						node.nodes = arr;
						continue;
					}
		
					node.nodes = method === 'append' ? node.nodes.concat(arr) : arr.concat(node.nodes);
				}
		
				return this;
			};
		
		});
		
		arr_each(['appendTo'], function(method) {
		
			Proto[method] = function(mix, model, cntx, controller) {
		
				if (controller == null) {
					controller = this;
				}
		
				if (mix.nodeType != null && typeof mix.appendChild === 'function') {
					mix.appendChild(this.render(model, cntx, null, controller));
		
					_signal_emitIn(controller, 'domInsert');
					return this;
				}
		
				jMask(mix).append(this);
				return this;
			};
		
		});
		
		// end:source ../src/jmask/jmask.js
		// source ../src/jmask/manip.attr.js
		(function() {
			Proto.removeAttr = Proto.removeProp = function(key){
				return coll_each(this, function(node){
					node.attr[key] = null;
				});
			};
			Proto.attr = Proto.prop = function(mix, val){
				if (arguments.length === 1 && is_String(mix)) {
					return this.length !== 0 ? this[0].attr[mix] : null;
				}
				function asString(node, key, val){
					node.attr[key] = _mask_ensureTmplFn(val);
				}
				function asObject(node, obj){
					for(var key in obj){
						asString(node, key, obj[key]);
					}
				}
				var fn = is_String(mix) ? asString : asObject;
				return coll_each(this, function(node){
					fn(node, mix, val);
				});
			};
			Proto.tag = function(name) {
				if (arguments.length === 0) 
					return this[0] && this[0].tagName;
				
				return coll_each(this, function(node){
					node.tagName = name;
				});
			};
			Proto.css = function(mix, val) {
				if (arguments.length <= 1 && typeof mix === 'string') {
					if (this.length == null) 
						return null;
					
					var style = this[0].attr.style;
					if (style == null) 
						return null;
					
					var obj = css_parseStyle(style);
					return mix == null ? obj : obj[mix];
				}
				
				if (mix == null) 
					return this;
				
				var stringify = typeof mix === 'object'
					? css_stringify
					: css_stringifyKeyVal ;
				var extend = typeof mix === 'object'
					? obj_extend
					: css_extendKeyVal ;
					
				return coll_each(this, function(node){
					var style = node.attr.style;
					if (style == null) {
						node.attr.style = stringify(mix, val);
						return;
					}
					var css = css_parseStyle(style);
					extend(css, mix, val);
					node.attr.style = css_stringify(css);
				});
			};
		
			function css_extendKeyVal(css, key, val){
				css[key] = val;
			}
			function css_parseStyle(style) {
				var obj = {};
				style.split(';').forEach(function(x){
					if (x === '') 
						return;
					var i = x.indexOf(':'),
						key = x.substring(0, i).trim(),
						val = x.substring(i + 1).trim();
					obj[key] = val;
				});
				return obj;
			}
			function css_stringify(css) {
				var str = '', key;
				for(key in css) {
					str += key + ':' + css[key] + ';';
				}
				return str;
			}
			function css_stringifyKeyVal(key, val){
				return key + ':' + val + ';';
			}
		
		}());
		
		// end:source ../src/jmask/manip.attr.js
		// source ../src/jmask/manip.class.js
		(function() {
			Proto.hasClass = function(klass){
				return coll_find(this, function(node){
					return has(node, klass);
				});
			};
			var Mutator_ = {
				add: function(node, klass){
					if (has(node, klass) === false) 
						add(node, klass);
				},
				remove: function(node, klass){
					if (has(node, klass) === true) 
						remove(node, klass);
				},
				toggle: function(node, klass){
					var fn = has(node, klass) === true ? remove : add;
					fn(node, klass);
				}
			};
			arr_each(['add', 'remove', 'toggle'], function(method) {
				var fn = Mutator_[method];
				Proto[method + 'Class'] = function(klass) {
					return coll_each(this, function(node){
						fn(node, klass);
					});
				};
			});
			function current(node){
				var className = node.attr['class'];
				return typeof className === 'string' ? className : '';
			}
			function has(node, klass){
				return -1 !== (' ' + current(node) + ' ').indexOf(' ' + klass + ' ');
			}
			function add(node, klass){
				node.attr['class'] =  (current(node) + ' ' + klass).trim();
			}
			function remove(node, klass) {
				node.attr['class'] = (' ' + current(node) + ' ').replace(' ' + klass + ' ', '').trim();
			}
		}());
		
		// end:source ../src/jmask/manip.class.js
		// source ../src/jmask/manip.dom.js
		obj_extend(Proto, {
			clone: function(){
				return jMask(coll_map(this, jmask_clone));
			},
			wrap: function(wrapper){
				var $wrap = jMask(wrapper);
				if ($wrap.length === 0){
					log_warn('Not valid wrapper', wrapper);
					return this;
				}
				var result = coll_map(this, function(x){
					var node = $wrap.clone()[0];
					jmask_deepest(node).nodes = [ x ];
					
					if (x.parent != null) {
						var i = coll_indexOf(x.parent.nodes, x);
						if (i !== -1) 
							x.parent.nodes.splice(i, 1, node);
					}
					return node
				});
				return jMask(result);
			},
			wrapAll: function(wrapper){
				var $wrap = jMask(wrapper);
				if ($wrap.length === 0){
					log_error('Not valid wrapper', wrapper);
					return this;
				}
				this.parent().mask($wrap);
				jmask_deepest($wrap[0]).nodes = this.toArray();
				return this.pushStack($wrap);
			}
		});
		
		arr_each(['empty', 'remove'], function(method) {
			Proto[method] = function(){
				return coll_each(this, Methods_[method]);
			};
			var Methods_ = {
				remove: function(node){
					if (node.parent != null) 
						coll_remove(node.parent.nodes, node);
				},
				empty: function(node){
					node.nodes = null;
				}
			};
		});
		
		// end:source ../src/jmask/manip.dom.js
		// source ../src/jmask/traverse.js
		obj_extend(Proto, {
			each: function(fn, ctx) {
				for (var i = 0; i < this.length; i++) {
					fn.call(ctx || this, this[i], i)
				}
				return this;
			},
			eq: function(i) {
				return i === -1 ? this.slice(i) : this.slice(i, i + 1);
			},
			get: function(i) {
				return i < 0 ? this[this.length - i] : this[i];
			},
			slice: function() {
				return this.pushStack(Array.prototype.slice.apply(this, arguments));
			}
		});
		
		
		arr_each([
			'filter',
			'children',
			'closest',
			'parent',
			'find',
			'first',
			'last'
		], function(method) {
		
			Proto[method] = function(selector) {
				var result = [],
					matcher = selector == null
						? null
						: selector_parse(selector, this.type, method === 'closest' ? 'up' : 'down'),
					i, x;
		
				switch (method) {
				case 'filter':
					return jMask(jmask_filter(this, matcher));
				case 'children':
					for (i = 0; i < this.length; i++) {
						x = this[i];
						if (x.nodes == null) {
							continue;
						}
						result = result.concat(matcher == null ? x.nodes : jmask_filter(x.nodes, matcher));
					}
					break;
				case 'parent':
					for (i = 0; i < this.length; i++) {
						x = this[i].parent;
						if (!x || x.type === Dom.FRAGMENT || (matcher && selector_match(x, matcher))) {
							continue;
						}
						result.push(x);
					}
					arr_unique(result);
					break;
				case 'closest':
				case 'find':
					if (matcher == null) {
						break;
					}
					for (i = 0; i < this.length; i++) {
						jmask_find(this[i][matcher.nextKey], matcher, result);
					}
					break;
				case 'first':
				case 'last':
					var index;
					for (i = 0; i < this.length; i++) {
		
						index = method === 'first' ? i : this.length - i - 1;
						x = this[index];
						if (matcher == null || selector_match(x, matcher)) {
							result[0] = x;
							break;
						}
					}
					break;
				}
		
				return this.pushStack(result);
			};
		
		});
		
		// end:source ../src/jmask/traverse.js
	
	
		jMask.prototype.fn = jMask.prototype;
		return jMask;
	
	}(Mask));
	
	// end:source /ref-mask-j/lib/jmask.embed.js
	// source /ref-mask-binding/lib/binding_embed
	
	
	
	(function(mask, Compo){
		
		// source vars
		var __Compo = typeof Compo !== 'undefined' ? Compo : (mask.Compo || global.Compo),
		    __dom_addEventListener = __Compo.Dom.addEventListener,
		    __registerHandler = mask.registerHandler,
		    __registerAttr = mask.registerAttrHandler,
		    __registerUtil = mask.registerUtil,
		    
			domLib = __Compo.config.getDOMLibrary();
			
		
		// end:source vars
		// source utils/
		// source object
		
		// end:source object
		// source object_observe
		var obj_addObserver,
			obj_hasObserver,
			obj_removeObserver,
			obj_lockObservers,
			obj_unlockObservers,
			obj_ensureObserversProperty,
			obj_addMutatorObserver,
			obj_removeMutatorObserver
			;
		
		(function(){
			obj_addObserver = function(obj, property, cb) {
				// closest observer
				var parts = property.split('.'),
					imax  = parts.length,
					i = -1,
					x = obj;
				while ( ++i < imax ) {
					x = x[parts[i]];
					
					if (x == null) 
						break;
					
					if (x[prop_OBS] != null) {
						
						var prop = parts.slice(i + 1).join('.');
						if (x[prop_OBS][prop] != null) {
							
							pushListener_(x, prop, cb);
							
							var cbs = pushListener_(obj, property, cb);
							if (cbs.length === 1) {
								var arr = parts.splice(0, i);
								if (arr.length !== 0) 
									attachProxy_(obj, property, cbs, arr, true);
							}
							return;
						}
					}
				}
				
				var cbs = pushListener_(obj, property, cb);
				if (cbs.length === 1) 
					attachProxy_(obj, property, cbs, parts, true);
				
				var val = obj_getProperty(obj, property),
					mutators = getSelfMutators(val);
				if (mutators != null) {
					objMutator_addObserver(
						val, mutators, cb
					);
				}
			};
			
			obj_hasObserver = function(obj, property, callback){
				// nested observer
				var parts = property.split('.'),
					imax  = parts.length,
					i = -1,
					x = obj;
				while ( ++i < imax ) {
					x = x[parts[i]];
					if (x == null) 
						break;
					
					if (x[prop_OBS] != null) {
						if (obj_hasObserver(x, parts.slice(i).join('.'), callback))
							return true;
						
						break;
					}
				}
				
				var obs = obj[prop_OBS];
				if (obs == null || obs[property] == null) 
					return false;
				
				return arr_contains(obs[property], callback);
			};
			
			obj_removeObserver = function(obj, property, callback) {
				// nested observer
				var parts = property.split('.'),
					imax  = parts.length,
					i = -1,
					x = obj;
				while ( ++i < imax ) {
					x = x[parts[i]];
					if (x == null) 
						break;
					
					if (x[prop_OBS] != null) {
						obj_removeObserver(x, parts.slice(i).join('.'), callback);
						break;
					}
				}
				
				
				var obs = obj_ensureObserversProperty(obj, property),
					val = obj_getProperty(obj, property);
				if (callback === void 0) {
					// callback not provided -> remove all observers	
					obs.length = 0;
				} else {
					arr_remove(obs, callback);
				}
			
				var mutators = getSelfMutators(val);
				if (mutators != null) 
					objMutator_removeObserver(val, mutators, callback)
				
			};
			obj_lockObservers = function(obj) {
				var obs = obj[prop_OBS];
				if (obs != null) 
					obs[prop_DIRTY] = {};
			};	
			obj_unlockObservers = function(obj) {
				var obs = obj[prop_OBS],
					dirties = obs == null ? null : obs[prop_DIRTY];
				if (dirties == null)
					return;
				
				obs[prop_DIRTY] = null;
				
				var prop, cbs, val, imax, i;
				for(prop in dirties) {
					cbs = obj[prop_OBS][prop];
					imax = cbs == null ? 0 : cbs.length;
					if (imax === 0) 
						continue;
					
					i = -1;
					val = prop === prop_MUTATORS
							? obj
							: obj_getProperty(obj, prop)
							;
					while ( ++i < imax ) {
						cbs[i](val);
					}
				}
			};
		
			obj_ensureObserversProperty = function(obj, type){
				var obs = obj[prop_OBS];
				if (obs == null) {
					obs = {
						__dirty: null,
						__dfrTimeout: null,
						__mutators: null
					};
					defineProp_(obj, '__observers', {
						value: obs,
						enumerable: false
					});
				}
				if (type == null) 
					return obs;
				
				var arr = obs[type];
				return arr == null
					? (obs[type] = [])
					: arr
					;
			};
			
			obj_addMutatorObserver = function(obj, cb){
				var mutators = getSelfMutators(obj);
				if (mutators != null) 
					objMutator_addObserver(obj,  mutators, cb);
			};
			obj_removeMutatorObserver = function(obj, cb){
				objMutator_removeObserver(obj, null, cb);
			};
			
			// PRIVATE
			var prop_OBS = '__observers',
				prop_MUTATORS = '__mutators',
				prop_TIMEOUT = '__dfrTimeout',
				prop_DIRTY = '__dirty';
				
			var defineProp_ = Object.defineProperty;
				
			
			//Resolve object, or if property do not exists - create
			function ensureProperty_(obj, chain) {
				var i = -1,
					imax = chain.length - 1,
					key
					;
				while ( ++i < imax ) {
					key = chain[i];
			
					if (obj[key] == null) 
						obj[key] = {};
					
					obj = obj[key];
				}
				return obj;
			}
			function getSelfMutators(obj) {
				if (obj == null || typeof obj !== 'object') 
					return null;
				
				if (typeof obj.length === 'number' && typeof obj.slice === 'function') 
					return MUTATORS_.Array;
				if (typeof obj.toUTCString === 'function') 
					return MUTATORS_.Date;
				
				return null;
			}
			var MUTATORS_ = {
				Array: {
					throttle: false,
					methods: [
						// native mutators
						'push',
						'unshift',
						'splice',
						'pop',
						'shift',
						'reverse',
						'sort',
						// collection mutators
						'remove'
					]
				},
				Date: {
					throttle: true,
					methods: [
						'setDate',
						'setFullYear',
						'setHours',
						'setMilliseconds',
						'setMinutes',
						'setMonth',
						'setSeconds',
						'setTime',
						'setUTCDate',
						'setUTCFullYear',
						'setUTCHours',
						'setUTCMilliseconds',
						'setUTCMinutes',
						'setUTCMonth',
						'setUTCSeconds',
					]
				}
			};
			function attachProxy_(obj, property, cbs, chain) {
				var length = chain.length,
					parent = length > 1
						? ensureProperty_(obj, chain)
						: obj,
					key = chain[length - 1],
					currentVal = parent[key];
					
				if (length > 1) {
					obj_defineCrumbs(obj, chain);
				}
				
				
				if ('length' === key) {
					var mutators = getSelfMutators(parent);
					if (mutators != null) {
						objMutator_addObserver(
							parent, mutators, function(){
								var imax = cbs.length,
									i = -1
									;
								while ( ++i < imax ) {
									cbs[i].apply(null, arguments);
								}
							});
						return currentVal;
					}
					
				}
				
				defineProp_(parent, key, {
					get: function() {
						return currentVal;
					},
					set: function(x) {
						if (x === currentVal) 
							return;
						var oldVal = currentVal;
						
						currentVal = x;
						var i = 0,
							imax = cbs.length,
							mutators = getSelfMutators(x);
							
						
						if (mutators != null) {
							for(; i < imax; i++) {
								objMutator_addObserver(
									x, mutators, cbs[i]
								);
							}
						}
						
						if (obj[prop_OBS][prop_DIRTY] != null) {
							obj[prop_OBS][prop_DIRTY][property] = 1;
							return;
						}
			
						for (i = 0; i < imax; i++) {
							cbs[i](x);
						}
						
						obj_sub_notifyListeners(obj, property, oldVal)
					},
					configurable: true,
					enumerable : true
				});
				
				return currentVal;
			}
			
			function obj_defineCrumbs(obj, chain) {
				var rebinder = obj_crumbRebindDelegate(obj),
					path = '',
					key;
				
				var imax = chain.length - 1,
					i = 0;
				for(; i < imax; i++) {
					key = chain[i];
					path += key + '.';
					
					obj_defineCrumb(path, obj, key, rebinder);
					obj = obj[key];
				}
			}
			
			function obj_defineCrumb(path, obj, key, rebinder) {
					
				var value = obj[key],
					old;
				
				defineProp_(obj, key, {
					get: function() {
						return value;
					},
					set: function(x) {
						if (x === value) 
							return;
						
						old = value;
						value = x;
						rebinder(path, old);
					},
					configurable: true,
					enumerable : true
				});
			}
			function obj_sub_notifyListeners(obj, path, oldVal) {
				var obs = obj[prop_OBS];
				if (obs == null) 
					return;
				for(var prop in obs) {
					if (prop.indexOf(path + '.') !== 0) 
						continue;
					
					var cbs = obs[prop].slice(0),
						imax = cbs.length,
						i = 0, oldProp, cb;
					if (imax === 0) 
						continue;
					
					var val = obj_getProperty(obj, prop);
					for (i = 0; i < imax; i++) {
						cb = cbs[i];
						obj_removeObserver(obj, prop, cb);
						
						if (oldVal != null && typeof oldVal === 'object') {
							oldProp = prop.substring(path.length + 1);
							obj_removeObserver(oldVal, oldProp, cb);
						}
					}
					for (i = 0; i < imax; i++){
						cbs[i](val);
					}
					for (i = 0; i < imax; i++){
						obj_addObserver(obj, prop, cbs[i]);
					}
				}
			}
			
			function obj_crumbRebindDelegate(obj) {
				return function(path, oldValue){
					obj_crumbRebind(obj, path, oldValue);
				};
			}
			function obj_crumbRebind(obj, path, oldValue) {
				var obs = obj[prop_OBS];
				if (obs == null) 
					return;
				
				for (var prop in obs) {
					if (prop.indexOf(path) !== 0) 
						continue;
					
					var cbs = obs[prop].slice(0),
						imax = cbs.length,
						i = 0;
					
					if (imax === 0) 
						continue;
					
					var val = obj_getProperty(obj, prop),
						cb, oldProp;
					
					for (i = 0; i < imax; i++) {
						cb = cbs[i];
						obj_removeObserver(obj, prop, cb);
						
						if (oldValue != null && typeof oldValue === 'object') {
							oldProp = prop.substring(path.length);
							obj_removeObserver(oldValue, oldProp, cb);
						}
					}
					for (i = 0; i < imax; i++){
						cbs[i](val);
					}
					
					for (i = 0; i < imax; i++){
						obj_addObserver(obj, prop, cbs[i]);
					}
				}
			}
			
			// Create Collection - Check If Exists - Add Listener
			function pushListener_(obj, property, cb) {
				var obs = obj_ensureObserversProperty(obj, property);
				if (arr_contains(obs, cb) === false) 
					obs.push(cb);
				return obs;
			}
			
			var objMutator_addObserver,
				objMutator_removeObserver;
			(function(){
				objMutator_addObserver = function(obj, mutators, cb){
					var methods = mutators.methods,
						throttle = mutators.throttle,
						obs = obj_ensureObserversProperty(obj, prop_MUTATORS);
					if (obs.length === 0) {
						var imax = methods.length,
							i = -1,
							method, fn;
						while( ++i < imax ){
							method = methods[i];
							fn = obj[method];
							if (fn == null) 
								continue;
							
							obj[method] = objMutator_createWrapper_(
								obj
								, fn
								, method
								, throttle
							);
						}
					}
					obs[obs.length++] = cb;
				};
				objMutator_removeObserver = function(obj, mutators, cb){
					var obs = obj_ensureObserversProperty(obj, prop_MUTATORS);
					if (cb === void 0) {
						obs.length = 0;
						return;
					}
					arr_remove(obs, cb);
				};
				
				function objMutator_createWrapper_(obj, originalFn, method, throttle) {
					var fn = throttle === true ? callDelayed : call;
					return function() {
						return fn(
							obj,
							originalFn,
							method,
							_Array_slice.call(arguments)
						);
					};
				}
				function call(obj, original, method, args) {
					var cbs = obj_ensureObserversProperty(obj, prop_MUTATORS),
						result = original.apply(obj, args);
					
					tryNotify(obj, cbs, method, args, result);
					return result;
				}
				function callDelayed(obj, original, method, args) {
					var cbs = obj_ensureObserversProperty(obj, prop_MUTATORS),
						result = original.apply(obj, args);
					
					var obs = obj[prop_OBS];
					if (obs[prop_TIMEOUT] != null) 
						return result;
					
					obs[prop_TIMEOUT] = setTimeout(function(){
						obs[prop_TIMEOUT] = null;
						tryNotify(obj, cbs, method, args, result);
					});
					return result;
				}
				
				function tryNotify(obj, cbs, method, args, result){
					if (cbs.length === 0) 
						return;
					
					var obs = obj[prop_OBS];
					if (obs[prop_DIRTY] != null) {
						obs[prop_DIRTY][prop_MUTATORS] = 1;
						return;
					}
					var imax = cbs.length,
						i = -1,
						x;
					while ( ++i < imax ){
						x = cbs[i];
						if (typeof x === 'function') {
							x(obj, method, args, result);
						}
					}
				}
			}());
			
		}());
		// end:source object_observe
		// source date
		var date_ensure;
		(function(){
			date_ensure = function(val){
				if (val == null || val === '') 
					return null;
				
				var date = val;
				var type = typeof val;
				if (type === 'string') {
					date = new Date(val);
					
					if (rgx_es5Date.test(date) && val.indexOf('Z') === -1) {
						// adjust to local time (http://es5.github.io/x15.9.html#x15.9.1.15)
						val.setMinutes(val.getTimezoneOffset());
					}
				}
				if (type === 'number') {
					date = new Date(val);
				}
				
				return isNaN(date) === false && typeof date.getFullYear === 'function'
					? date
					: null
					;
			};
			
			var rgx_es5Date = /^\d{4}\-\d{2}/;
		}());
		// end:source date
		// source dom
		
		function dom_removeElement(node) {
			return node.parentNode.removeChild(node);
		}
		
		function dom_removeAll(array) {
			if (array == null) 
				return;
			
			var imax = array.length,
				i = -1;
			while ( ++i < imax ) {
				dom_removeElement(array[i]);
			}
		}
		
		function dom_insertAfter(element, anchor) {
			return anchor.parentNode.insertBefore(element, anchor.nextSibling);
		}
		
		function dom_insertBefore(element, anchor) {
			return anchor.parentNode.insertBefore(element, anchor);
		}
		
		
		
		
		// end:source dom
		// source compo
		var compo_fragmentInsert,
			compo_render,
			compo_dispose,
			compo_inserted,
			compo_attachDisposer,
			compo_trav_children,
			compo_getScopeFor
			;
		(function(){
			
			compo_fragmentInsert = function(compo, index, fragment, placeholder) {
				if (compo.components == null) 
					return dom_insertAfter(fragment, placeholder || compo.placeholder);
				
				var compos = compo.components,
					anchor = null,
					insertBefore = true,
					imax = compos.length,
					i = index - 1,
					elements;
				
				if (anchor == null) {
					while (++i < imax) {
						elements = compos[i].elements;
				
						if (elements && elements.length) {
							anchor = elements[0];
							break;
						}
					}
				}
				if (anchor == null) {
					insertBefore = false;
					i = index < imax
						? index
						: imax
						;
					while (--i > -1) {
						elements = compos[i].elements;
						if (elements && elements.length) {
							anchor = elements[elements.length - 1];
							break;
						}
					}
				}
				if (anchor == null) 
					anchor = placeholder || compo.placeholder;
				
				if (insertBefore) 
					return dom_insertBefore(fragment, anchor);
				
				return dom_insertAfter(fragment, anchor);
			};
			
			compo_render = function(parentCtr, template, model, ctx, container) {
				return mask.render(template, model, ctx, container, parentCtr);
			};
			
			compo_dispose = function(compo, parent) {
				if (compo == null) 
					return false;
				
				if (compo.elements != null) {
					dom_removeAll(compo.elements);
					compo.elements = null;
				}
				__Compo.dispose(compo);
				
				var compos = (parent && parent.components) || (compo.parent && compo.parent.components);
				if (compos == null) {
					log_error('Parent Components Collection is undefined');
					return false;
				}
				return arr_remove(compos, compo);
			};
			
			compo_inserted = function(compo) {
				__Compo.signal.emitIn(compo, 'domInsert');
			};
			
			compo_attachDisposer = function(ctr, disposer) {
				if (typeof ctr.dispose === 'function') {
					var previous = ctr.dispose;
					ctr.dispose = function(){
						disposer.call(this);
						previous.call(this);
					};
			
					return;
				}
				ctr.dispose = disposer;
			};
		
			compo_trav_children = function(compo, compoName){
				var out = [],
					arr = compo.components || [],
					imax = arr.length,
					i = -1;
				
				while ( ++i < imax ){
					if (arr[i].compoName === compoName) {
						out.push(arr[i]);
					}
				}
				return out;
			};
			
			compo_getScopeFor = function(ctr, path){
				var key = path;
				var i = path.indexOf('.');
				if (i !== -1) {
					key = path.substring(0, i);
				}
				while (ctr != null) {
					if (ctr.scope != null && ctr.scope.hasOwnProperty(key)) {
						return ctr.scope;
					}
					ctr = ctr.parent;
				}
				return null;
			};
		}());
		// end:source compo
		// source expression
		var expression_eval,
			expression_eval_strict,
			expression_bind,
			expression_unbind,
			expression_createBinder,
			expression_createListener,
			
			expression_parse,
			expression_varRefs
			;
			
		(function(){
			var Expression = mask.Utils.Expression;
		
			expression_eval_strict = Expression.eval;
			expression_parse = Expression.parse;
			expression_varRefs = Expression.varRefs;
			
			expression_eval = function(expr, model, ctx, ctr){
				if (expr === '.') 
					return model;
				
				var x = expression_eval_strict(expr, model, ctx, ctr);
				return x == null ? '' : x;
			};
				
			expression_bind = function(expr, model, ctx, ctr, callback) {
				if (expr === '.') {
					if (model != null) {
						obj_addMutatorObserver(model, callback);
					}
					return;
				}
				
				var ast = expression_parse(expr),
					vars = expression_varRefs(ast, model, ctx, ctr),
					obj, ref;
			
				if (vars == null) 
					return;
				
				if (typeof vars === 'string') {
					_toggleObserver(obj_addObserver, model, ctr, vars, callback);
					return;
				}
			
				var isArray = vars.length != null && typeof vars.splice === 'function',
					imax = isArray === true ? vars.length : 1,
					i = 0,
					x, prop;
				
				for (; i < imax; i++) {
					x = isArray === true ? vars[i] : vars;
					_toggleObserver(obj_addObserver, model, ctr, x, callback);
				}
			};
			
			expression_unbind = function(expr, model, ctr, callback) {
				
				if (typeof ctr === 'function') 
					log_warn('[mask.binding] - expression unbind(expr, model, controller, callback)');
				
				if (expr === '.') {
					if (model != null) {
						obj_removeMutatorObserver(model, callback);
					}
					return;
				}
				
				var vars = expression_varRefs(expr, model, null, ctr),
					x, ref;
			
				if (vars == null) 
					return;
				
				if (typeof vars === 'string') {
					_toggleObserver(obj_removeObserver, model, ctr, vars, callback);
					return;
				}
				
				var isArray = vars.length != null && typeof vars.splice === 'function',
					imax = isArray === true ? vars.length : 1,
					i = 0,
					x;
				
				for (; i < imax; i++) {
					x = isArray === true ? vars[i] : vars;
					_toggleObserver(obj_removeObserver, model, ctr, x, callback);
				}
			
			}
			
			/**
			 * expression_bind only fires callback, if some of refs were changed,
			 * but doesnt supply new expression value
			 **/
			expression_createBinder = function(expr, model, cntx, controller, callback) {
				var locks = 0;
				return function binder() {
					if (++locks > 1) {
						locks = 0;
						log_warn('<mask:bind:expression> Concurent binder detected', expr);
						return;
					}
					
					var value = expression_eval(expr, model, cntx, controller);
					if (arguments.length > 1) {
						var args = _Array_slice.call(arguments);
						
						args[0] = value;
						callback.apply(this, args);
						
					} else {
						
						callback(value);
					}
					
					locks--;
				};
			};
			
			expression_createListener = function(callback){
				var locks = 0;
				return function(){
					if (++locks > 1) {
						locks = 0;
						log_warn('<listener:expression> concurent binder');
						return;
					}
					
					callback();
					locks--;
				}
			};
			
			function _toggleObserver(mutatorFn, model, ctr, accessor, callback) {
				if (accessor == null) 
					return;
				
				if (typeof accessor === 'object') {
					var obj = expression_eval_strict(accessor.accessor, model, null, ctr);
					if (obj == null || typeof obj !== 'object') {
						console.error('Binding failed to an object over accessor', accessor.ref);
						return;
					}
					mutatorFn(obj, accessor.ref, callback);
					return;
				}
				
				// string;
				var property = accessor,
					parts = property.split('.'),
					imax = parts.length;
				
				if (imax > 1) {
					var first = parts[0];
					if (first === '$c' || first === '$') {
						if (parts[1] === 'attr') {
							return;
						}
						// Controller Observer
						var owner  = _getObservable_Controller(ctr, parts.slice(1), imax - 1);
						var cutIdx = first.length + 1;
						mutatorFn(owner, property.substring(cutIdx), callback);
						return;
					}
					if (first === '$scope') {
						// Controller Observer
						var scope = _getObservable_Scope(ctr, parts[1]);
						var cutIdx = 6 + 1;
						mutatorFn(scope, property.substring(cutIdx), callback);
						return;
					}
					if ('$a' === first || '$ctx' === first || '_' === first || '$u' === first) 
						return;
				}
				
				var obj = null;
				if (_isDefined(model, parts, imax)) {
					obj = model;
				}
				if (obj == null) {
					obj = _getObservable_Scope(ctr, parts[0], imax);
				}
				if (obj == null) {
					obj = model;
				}
				
				mutatorFn(obj, property, callback);
			}
			
			function _getObservable_Scope_(ctr, parts, imax){
				var scope;
				while(ctr != null){
					scope = ctr.scope;
					if (scope != null && _isDefined(scope, parts, imax)) 
						return scope;
					
					ctr = ctr.parent;
				}
				return null;
			}
			function _getObservable_Controller(ctr_, parts, imax) {
				var ctr = ctr_;
				while(ctr != null){
					if (_isDefined(ctr, parts, imax)) 
						return ctr;
					ctr = ctr.parent;
				}
				return ctr;
			}
			function _getObservable_Scope(ctr_, property, imax) {
				var ctr = ctr_, scope;
				while(ctr != null){
					scope = ctr.scope;
					if (scope != null && scope[property] != null) {
						return scope;
					}
					ctr = ctr.parent;
				}
				return null;
			}
			function _isDefined(obj, parts, imax){
				if (obj == null) 
					return false;
					
				var i = 0, val;
				for(; i < imax; i++) {
					obj = obj[parts[i]];
					if (obj == null) 
						return false;
				}
				return true;
			}
			
			
		}());
		
		
		
		// end:source expression
		// source signal
		var signal_parse,
			signal_create
			;
		
		(function(){
			
			
			signal_parse = function(str, isPiped, defaultType) {
				var signals = str.split(';'),
					set = [],
					i = 0,
					imax = signals.length,
					x,
					signalName, type,
					signal;
					
			
				for (; i < imax; i++) {
					x = signals[i].split(':');
					
					if (x.length !== 1 && x.length !== 2) {
						log_error('Too much ":" in a signal def.', signals[i]);
						continue;
					}
					
					
					type = x.length === 2 ? x[0] : defaultType;
					signalName = x[x.length === 2 ? 1 : 0];
					
					signal = signal_create(signalName.trim(), type, isPiped);
					
					if (signal != null) {
						set.push(signal);
					}
				}
				
				return set;
			};
			
			
			signal_create = function(signal, type, isPiped) {
				if (isPiped !== true) {
					return {
						signal: signal,
						type: type
					};
				}
				
				var index = signal.indexOf('.');
				if (index === -1) {
					log_error('No pipe name in a signal', signal);
					return null;
				}
				
				return {
					signal: signal.substring(index + 1),
					pipe: signal.substring(0, index),
					type: type
				};
			};
		}());
		
		// end:source signal
		// end:source utils/
		
		// source DomObjectTransport
		var DomObjectTransport;
		(function(){
			
			var objectWay = {
				get: function(provider, expression) {
					var getter = provider.objGetter;
					if (getter == null) {
						return expression_eval(
							expression
							, provider.model
							, provider.ctx
							, provider.ctr
						);
					}
					
					var obj = getAccessorObject_(provider, getter);
					if (obj == null) 
						return null;
					
					return obj[getter](expression, provider.model, provider.ctr.parent);
				},
				set: function(obj, property, value, provider) {
					var setter = provider.objSetter;
					if (setter == null) {
						obj_setProperty(obj, property, value);
						return;
					}
					var ctx = getAccessorObject_(provider, setter);
					if (ctx == null) 
						return;
					
					ctx[setter](
						property
						, value
						, provider.model
						, provider.ctr.parent
					);
				}
			};
			var domWay  = {
				get: function(provider) {
					var getter = provider.domGetter;
					if (getter == null) {
						return obj_getProperty(provider, provider.property);
					}
					var ctr = provider.ctr.parent;
					if (isValidFn_(ctr, getter, 'Getter') === false) {
						return null;
					}
					return ctr[getter](provider.element);
				},
				set: function(provider, value) {
					var setter = provider.domSetter;
					if (setter == null) {
						obj_setProperty(provider, provider.property, value);
						return;
					}
					var ctr = provider.ctr.parent;
					if (isValidFn_(ctr, setter, 'Setter') === false) {
						return;
					}
					ctr[setter](value, provider.element);
				}
			};
			var DateTimeDelegate = {
				domSet: function(format){
					return function(prov, val){
						var date = date_ensure(val);
						prov.element.value = date == null ? '' : format(date);
					}
				},
				objSet: function(extend){
					return function(obj, prop, val){
						
						var date = date_ensure(val);
						if (date == null) 
							return;
						
						var target = obj_getProperty(obj, prop);
						if (target == null) {
							obj_setProperty(obj, prop, date);
							return;
						}
						if (target.getFullYear == null || isNaN(target)) {
							target = date_ensure(target) || date;
							extend(target, date);
							obj_setProperty(obj, prop, target);
							return;
						}
						extend(target, date);
					}
				}
			};
			
			DomObjectTransport = {
				// generic
				objectWay: objectWay,
				domWay: domWay,
				
				SELECT: {
					get: function(provider) {
						var el = provider.element,
							i = el.selectedIndex;
						if (i === -1) 
							return '';
						
						var opt = el.options[i],
							val = opt.getAttribute('value');
						return val == null
							? opt.getAttribute('name') /* obsolete */
							: val
							;
					},
					set: function(provider, val) {
						var el = provider.element,
							options = el.options,
							imax = options.length,
							opt, x, i;
						for(i = 0; i < imax; i++){
							opt = options[i];
							x = opt.getAttribute('value');
							if (x == null) 
								x = opt.getAttribute('name');
							
							/* jshint eqeqeq: false */
							if (x == val) {
								/* jshint eqeqeq: true */
								el.selectedIndex = i;
								return;
							}
						}
						log_warn('Value is not an option', val);
					}
				},
				SELECT_MULT: {
					get: function(provider) {
						return coll_map(provider.element.selectedOptions, function(x){
							return x.value;
						});
					},
					set: function(provider, mix) {
						coll_each(provider.element.options, function(el){
							el.selected = false;
						});
						if (mix == null) {
							return;
						}
						var arr = is_ArrayLike(mix) ? mix : [ mix ];
						coll_each(arr, function(val){
							var els = provider.element.options,
								imax = els.length,
								i = -1;
							while (++i < imax) {
								/* jshint eqeqeq: false */
								if (els[i].value == val) {
									els[i].selected = true;
								}
							}
							log_warn('Value is not an option', val);
						});
					}
				},
				DATE: {
					domWay: {
						get: domWay.get,
						set: function(prov, val){
							var date = date_ensure(val);
							prov.element.value = date == null ? '' : formatDate(date);
						}
					},
					objectWay: {
						get: objectWay.get,
						set: DateTimeDelegate.objSet(function(a, b){
							a.setFullYear(b.getFullYear());
							a.setMonth(b.getMonth());
							a.setDate(b.getDate());
						})
					}
				},
				TIME: {
					domWay: {
						get: domWay.get,
						set: DateTimeDelegate.domSet(formatTime)
					},
					objectWay: {
						get: objectWay.get,
						set: DateTimeDelegate.objSet(function(a, b){
							a.setHours(b.getHours())
							a.setMinutes(b.getMinutes());
							a.setSeconds(b.getSeconds());
						})
					}
				},
				RADIO: {
					domWay: {
						get: function(provider){
							var el = provider.element;
							return el.checked ? el.value : null;
						},
						set: function(provider, value){
							var el = provider.element;
							el.checked = el.value === value;
						}
					},
				}
				
			};
			
			function isValidFn_(obj, prop, name) {
				if (obj== null || typeof obj[prop] !== 'function') {
					log_error('BindingProvider. Controllers accessor.', name, 'should be a function. Property:', prop);
					return false;
				}
				return true;
			}
			function getAccessorObject_(provider, accessor) {
				var ctr = provider.ctr.parent;
				if (ctr[accessor] != null) 
					return ctr;
				var model = provider.model;
				if (model[accessor] != null) 
					return model;
				
				log_error('BindingProvider. Accessor `', accessor, '`should be a function');
				return null;
			}
			function formatDate(date) {
				var YYYY = date.getFullYear(),
					MM = date.getMonth() + 1,
					DD = date.getDate();
				return YYYY
					+ '-'
					+ (MM < 10 ? '0' : '')
					+ (MM)
					+ '-'
					+ (DD < 10 ? '0' : '')
					+ (DD)
					;
			}
			function formatTime(date) {
				var H = date.getHours(),
					M = date.getMinutes();
				return H
					+ ':'
					+ (M < 10 ? '0' : '')
					+ (M)
					;
			}
		}());
		
		// end:source DomObjectTransport
		// source ValidatorProvider
		var ValidatorProvider,
			Validators;
		(function() {
			var class_INVALID = '-validate__invalid';
			
			ValidatorProvider = {
				getFnFromModel: fn_fromModelWrapp,
				getFnByName: fn_byName,
				validate: validate,
				validateUi: function(fns, val, ctr, el, oncancel) {
					var error = validate(fns, val, ctr);
					if (error != null) {
						ui_notifyInvalid(el, error, oncancel);
						return error;
					}
					ui_clearInvalid(el);
					return null;
				}
			};
			
			function validate(fns, val, ctr) {
				if (fns == null) {
					return null;
				}
				var imax = fns.length,
					i = -1,
					error, fn;
				while ( ++i < imax ){
					fn = fns[i];
					if (fn == null) {
						continue;
					}
					error = fn(val, ctr);
					if (error != null) {
						if (is_String(error)) {
							return {
								message: error,
								actual: val
							};
						}
						if (error.actual == null) {
							error.actual = val;
						}
						return error;
					}
				}
			}
			
			function fn_fromModel(model, prop) {
				if (is_Object(model) === false) {
					return null;
				}
				var Validate = model.Validate;
				if (Validate != null) {
					var fn = null;
					if (is_Function(fn = Validate)) {
						return fn;
					}
					if (is_Function(fn = Validate[prop])) {
						return fn;
					}
				}
				
				var i = prop.indexOf('.');
				if (i !== -1) {
					return fn_fromModel(
						model[prop.substring(0, i)], prop.substring(i+1)
					);
				}
				return null;
			}
			function fn_fromModelWrapp(model, prop) {
				var fn = fn_fromModel(model, prop);
				if (fn == null) {
					return null;
				}
				return function(){
					var mix = fn.apply(model, arguments),
						message, error;
					if (mix == null) {
						return null;
					}
					if (is_String(mix)) {
						return {
							message: mix,
							property: prop,
							ctx: model
						};
					}
					mix.property = prop;
					mix.ctx = model;
					return mix;
				};
			}
			
			function fn_byName(name, param, message) {
				var Delegate = Validators[name];
				if (Delegate == null) {
					log_error('Invalid validator', name, 'Supports:', Object.keys(Validators));
					return null;
				}
				var fn = Delegate(param);
				return function(val, ctr){
					var mix = fn(val, ctr);
					if (mix == null || mix === true) {
						return null;
					}
					if (mix === false) {
						return message || ('Check failed: `' + name + '`');
					}
					if (is_String(mix) && mix.length !== 0) {
						return mix;
					}
					return null;
				};
			}
			
			function ui_notifyInvalid(el, error, oncancel) {
				
				var message = error.message || error;
				var next = domLib(el).next('.' + class_INVALID);
				if (next.length === 0) {
					next = domLib('<div>')
						.addClass(class_INVALID)
						.html('<span></span><button>&otimes;</button>')
						.insertAfter(el);
				}
		
				return next
					.children('button')
					.off()
					.on('click', function() {
						next.hide();
						oncancel && oncancel();
			
					})
					.end()
					.children('span').text(message)
					.end()
					.show();
			}
		
			function ui_clearInvalid(el) {
				return domLib(el).next('.' + class_INVALID).hide();
			}
			
			Validators = {
				match: function (match) {		
					return function (str){
						return new RegExp(match).test(str);
					};
				},
				unmatch: function (unmatch) {
					return function (str){
						return !(new RegExp(unmatch).test(str));
					};
				},
				minLength: function (min) {
					return function (str){
						return str.length >= parseInt(min, 10);
					};
				},
				maxLength: function (max) {
					return function (str){
						return str.length <= parseInt(max, 10);
					};
				},
				check: function (condition, node){
					return function (str){
						return expression_eval('x' + condition, node.model, {x: str}, node);
					};
				}
			};
		}());
		// end:source ValidatorProvider
		// source BindingProvider
		var CustomProviders,
			BindingProvider;
		(function() {
			CustomProviders = {};
			
			BindingProvider = class_create({
				validations: null,
				constructor: function BindingProvider(model, element, ctr, bindingType) {
					if (bindingType == null) {
						bindingType = 'dual';
						
						var name = ctr.compoName;
						if (name === ':bind' || name === 'bind') {
							bindingType = 'single';
						}
					}
					
					var attr = ctr.attr,
						type;
			
					this.node = ctr; // backwards compat.
					this.ctr = ctr;
					this.ctx = null;
			
					this.model = model;
					this.element = element;
					this.value = attr.value;
					this.property = attr.property;
					this.domSetter = attr.setter || attr['dom-setter'];
					this.domGetter = attr.getter || attr['dom-getter'];
					this.objSetter = attr['obj-setter'];
					this.objGetter = attr['obj-getter'];
					
					/* Convert to an instance, e.g. Number, on domchange event */
					this['typeof'] = attr['typeof'] || null;
					
					this.dismiss = 0;
					this.bindingType = bindingType;
					this.log = false;
					this.signal_domChanged = null;
					this.signal_objectChanged = null;
					this.locked = false;
					
					
					if (this.property == null && this.domGetter == null) {
			
						switch (element.tagName) {
							case 'INPUT':
								type = element.getAttribute('type');
								if ('checkbox' === type) {
									this.property = 'element.checked';
									break;
								}
								else if ('date' === type) {
									var x = DomObjectTransport.DATE;
									this.domWay = x.domWay;
									this.objectWay = x.objectWay;
								}
								else if ('number' === type) {
									this['typeof'] = 'Number';
								}
								else if ('radio' === type) {
									var x = DomObjectTransport.RADIO;
									this.domWay = x.domWay;
									break;
								}
								
								this.property = 'element.value';
								break;
							case 'TEXTAREA':
								this.property = 'element.value';
								break;
							case 'SELECT':
								this.domWay = element.multiple
									? DomObjectTransport.SELECT_MULT
									: DomObjectTransport.SELECT;
								break;
							default:
								this.property = 'element.innerHTML';
								break;
						}
					}
			
					if (attr['log']) {
						this.log = true;
						if (attr.log !== 'log') {
							this.logExpression = attr.log;
						}
					}
			
					// Send signal on OBJECT or DOM change
					if (attr['x-signal']) {
						var signal = signal_parse(attr['x-signal'], null, 'dom')[0],
							signalType = signal && signal.type;
						
						switch(signalType){
							case 'dom':
							case 'object':
								this['signal_' + signalType + 'Changed'] = signal.signal;
								break;
							default:
								log_error('Signal typs is not supported', signal);
								break;
						}
					}
					
					// Send PIPED signal on OBJECT or DOM change
					if (attr['x-pipe-signal']) {
						var signal = signal_parse(attr['x-pipe-signal'], true, 'dom')[0],
							signalType = signal && signal.type;
							
						switch(signalType){
							case 'dom':
							case 'object':
								this['pipe_' + signalType + 'Changed'] = signal;
								break;
							default:
								log_error('Pipe type is not supported');
								break;
						}
					}
					
					var domSlot = attr['dom-slot'];
					if (domSlot != null) {
						this.slots = {};
						// @hack - place dualb. provider on the way of a signal
						// 
						var parent = ctr.parent,
							newparent = parent.parent;
							
						parent.parent = this;
						this.parent = newparent;				
						this.slots[domSlot] = function(sender, value){
							this.domChanged(sender, value);
						};
					}
					
					/*
					 *  @obsolete: attr name : 'x-pipe-slot'
					 */
					var pipeSlot = attr['object-pipe-slot'] || attr['x-pipe-slot'];
					if (pipeSlot) {
						var str = pipeSlot,
							index = str.indexOf('.'),
							pipeName = str.substring(0, index),
							signal = str.substring(index + 1);
						
						this.pipes = {};
						this.pipes[pipeName] = {};
						this.pipes[pipeName][signal] = function(){
							this.objectChanged();
						};
						
						__Compo.pipe.addController(this);
					}
			
			
					if (attr.expression) {
						this.expression = attr.expression;
						if (this.value == null && bindingType !== 'single') {
							var refs = expression_varRefs(this.expression);
							if (typeof refs === 'string') {
								this.value = refs;
							} else {
								log_warn('Please set value attribute in DualBind Control.');
							}
						}
						return;
					}
					
					this.expression = this.value;
				},
				dispose: function() {
					expression_unbind(this.expression, this.model, this.ctr, this.binder);
				},
				objectChanged: function(x) {
					if (this.dismiss-- > 0) {
						return;
					}
					if (this.locked === true) {
						log_warn('Concurance change detected', this);
						return;
					}
					this.locked = true;
		
					if (x == null) {
						x = this.objectWay.get(this, this.expression);
					}
		
					this.domWay.set(this, x);
		
					if (this.log) {
						console.log('[BindingProvider] objectChanged -', x);
					}
					if (this.signal_objectChanged) {
						signal_emitOut(this.ctr, this.signal_objectChanged, [x]);
					}			
					if (this.pipe_objectChanged) {
						var pipe = this.pipe_objectChanged;
						__Compo.pipe(pipe.pipe).emit(pipe.signal);
					}
		
					this.locked = false;
				},
				domChanged: function(event, value) {
					if (this.locked === true) {
						log_warn('Concurance change detected', this);
						return;
					}
					this.locked = true;
		
					if (value == null) 
						value = this.domWay.get(this);
					
					var typeof_ = this['typeof'];
					if (typeof_ != null) {
						var Converter = window[typeof_];
						value = Converter(value);
					}
					
					var error = this.validate(value);
					if (error == null) {
						this.dismiss = 1;
						var obj = this.model;
						var prop = this.value;
						if (prop.charCodeAt(0) === 36 /*$*/) {
							var i = prop.indexOf('.');
							if (i !== -1) {
								var key = prop.substring(0, i);
								if (key === '$scope') {
									prop = prop.substring(i + 1);
									obj = compo_getScopeFor(this.ctr.parent, prop);
								}
							}
						}
						
						this.objectWay.set(obj, prop, value, this);
						this.dismiss = 0;
		
						if (this.log) {
							console.log('[BindingProvider] domChanged -', value);
						}
						if (this.signal_domChanged != null) {
							signal_emitOut(this.ctr, this.signal_domChanged, [value]);
						}
						if (this.pipe_domChanged != null) {
							var pipe = this.pipe_domChanged;
							__Compo.pipe(pipe.pipe).emit(pipe.signal);
						}	
					}
					this.locked = false;
				},
				addValidation: function(mix){
					if (this.validations == null) {
						this.validations = [];
					}
					if (is_Array(mix)) {
						this.validations = this.validations.concat(mix);
						return;
					}
					this.validations.push(mix);
				},
				validate: function (val) {
					var fns = this.validations,
						ctr = this.ctr,
						el = this.element
						;
					if (fns == null || fns.length === 0) {
						return null;
					}
					var val_ = arguments.length !== 0
						? val
						: this.domWay.get(this);
					
					return ValidatorProvider.validateUi(
						fns, val_, ctr, el, this.objectChanged.bind(this)
					);
				},
				objectWay: DomObjectTransport.objectWay,
				domWay: DomObjectTransport.domWay,
			});
				
			
			obj_extend(BindingProvider, {
				create: function (model, el, ctr, bindingType) {
			
					/* Initialize custom provider */
					var type = ctr.attr.bindingProvider,
						CustomProvider = type == null ? null : CustomProviders[type],
						provider;
			
					if (typeof CustomProvider === 'function') {
						return new CustomProvider(model, el, ctr, bindingType);
					}
			
					provider = new BindingProvider(model, el, ctr, bindingType);
			
					if (CustomProvider != null) {
						obj_extend(provider, CustomProvider);
					}
					return provider;
				},
				
				bind: function (provider){
					return apply_bind(provider);
				}
			});
			
			function apply_bind(provider) {
		
				var expr = provider.expression,
					model = provider.model,
					onObjChanged = provider.objectChanged = provider.objectChanged.bind(provider);
		
				provider.binder = expression_createBinder(expr, model, provider.ctx, provider.ctr, onObjChanged);
		
				expression_bind(expr, model, provider.ctx, provider.ctr, provider.binder);
		
				if (provider.bindingType === 'dual') {
					var attr = provider.ctr.attr;
					
					if (!attr['change-slot'] && !attr['change-pipe-event']) {
						var element = provider.element,
							/*
							 * @obsolete: attr name : 'changeEvent'
							 */
							eventType = attr['change-event'] || attr.changeEvent || 'change',
							onDomChange = provider.domChanged.bind(provider);
			
						__dom_addEventListener(element, eventType, onDomChange);
					}
					
						
					if (!provider.objectWay.get(provider, provider.expression)) {
						// object has no value, so check the dom
						setTimeout(function(){
							if (provider.domWay.get(provider))
								// and apply when exists
								provider.domChanged();	
						});
						return provider;
					}
				}
		
				// trigger update
				provider.objectChanged();
				return provider;
			}
		
			function signal_emitOut(ctr, signal, args) {
				if (ctr == null) 
					return;
				
				var slots = ctr.slots;
				if (slots != null && typeof slots[signal] === 'function') {
					if (slots[signal].apply(ctr, args) === false) 
						return;
				}
				
				signal_emitOut(ctr.parent, signal, args);
			}
			
			
			obj_extend(BindingProvider, {
				addObserver: obj_addObserver,
				removeObserver: obj_removeObserver
			});
		}());
		
		// end:source BindingProvider
		
		// source handlers/
		// source visible
		/**
		 * visible handler. Used to bind directly to display:X/none
		 *
		 * attr =
		 *    check - expression to evaluate
		 *    bind - listen for a property change
		 */
		
		function VisibleHandler() {}
		
		__registerHandler(':visible', VisibleHandler);
		
		
		VisibleHandler.prototype = {
			constructor: VisibleHandler,
		
			refresh: function(model, container) {
				container.style.display = expression_eval(this.attr.check, model) ? '' : 'none';
			},
			renderStart: function(model, cntx, container) {
				this.refresh(model, container);
		
				if (this.attr.bind) {
					obj_addObserver(model, this.attr.bind, this.refresh.bind(this, model, container));
				}
			}
		};
		
		// end:source visible
		// source validate
		var ValidationCompo;
		(function() {	
			var class_INVALID = '-validate-invalid';
		
			ValidationCompo = class_create({
		        attr: null,
				element: null,
				validators: null,
				
				constructor: function(){
					this.validators = [];
				},
				renderStart: function(model, ctx, container) {
					this.element = container;
					
					var prop = this.attr.value;
					if (prop) {
						var fn = ValidatorProvider.getFnFromModel(model, prop);
						if (fn != null) {
							this.validators.push(fn);
						}
					}
				},
				/**
				 * @param input - {control specific} - value to validate
				 * @param element - {HTMLElement} - (optional, @default this.element) -
				 *				Invalid message is schown(inserted into DOM) after this element
				 * @param oncancel - {Function} - Callback function for canceling
				 *				invalid notification
				 */
				validate: function(val, el, oncancel) {
					var element = el == null ? this.element : el,
						value   = val;
					if (arguments.length === 0) {
						value = obj_getProperty(this.model, this.attr.value);
					}
					if (this.validators.length === 0) {
						this.initValidators();
					}
					var fns = this.validators,
						type = this.attr.silent ? 'validate' : 'validateUi'
						;
					
					return ValidatorProvider[type](
						fns, value, this, element, oncancel
					);
				},
				initValidators: function() {
					var attr = this.attr,
						message = this.attr.message,
						isDefault = message == null
					
					if (isDefault) {
						message = 'Invalid value of `' + this.attr.value + '`';
					}
					for (var key in attr) {				
						switch (key) {
							case 'message':
							case 'value':
							case 'getter':
							case 'silent':
								continue;
						}				
						if (key in Validators === false) {
							log_error('Unknown Validator:', key, this);
							continue;
						}
						var str = isDefault ? (message + ' Validation: `' + key + '`') : message 
						var fn = ValidatorProvider.getFnByName(key, attr[key], str);
						if (fn != null) {
							this.validators.push(fn);
						}
					}
				}
			});
			
			__registerHandler(':validate', ValidationCompo);
			
			__registerHandler(':validate:message', Compo({
				template: 'div.' + class_INVALID + ' { span > "~[bind:message]" button > "~[cancel]" }',
				
				onRenderStart: function(model){
					if (typeof model === 'string') {
						model = {
							message: model
						};
					}
					
					if (!model.cancel) {
						model.cancel = 'cancel';
					}
					
					this.model = model;
				},
				compos: {
					button: '$: button',
				},
				show: function(message, oncancel){
					var that = this;
					
					this.model.message = message;
					this.compos.button.off().on(function(){
						that.hide();
						oncancel && oncancel();
						
					});
					
					this.$.show();
				},
				hide: function(){
					this.$.hide();
				}
			}));
			
		}());
		
		// end:source validate
		// source validate_group
		function ValidateGroup() {}
		
		__registerHandler(':validate:group', ValidateGroup);
		
		
		ValidateGroup.prototype = {
			constructor: ValidateGroup,
			validate: function() {
				var validations = getValidations(this);
		
		
				for (var i = 0, x, length = validations.length; i < length; i++) {
					x = validations[i];
					if (!x.validate()) {
						return false;
					}
				}
				return true;
			}
		};
		
		function getValidations(component, out){
			if (out == null){
				out = [];
			}
		
			if (component.components == null){
				return out;
			}
			var compos = component.components;
			for(var i = 0, x, length = compos.length; i < length; i++){
				x = compos[i];
		
				if (x.compoName === 'validate'){
					out.push(x);
					continue;
				}
		
				getValidations(x);
			}
			return out;
		}
		
		// end:source validate_group
		
		
		
		// if BROWSER
		// source bind
		/**
		 *  Mask Custom Tag Handler
		 *	attr =
		 *		attr: {String} - attribute name to bind
		 *		prop: {Stirng} - property name to bind
		 *		- : {default} - innerHTML
		 */
		
		
		
		(function() {
		
			function Bind() {}
		
			__registerHandler(':bind', Bind);
			__registerHandler( 'bind', Bind);
		
			Bind.prototype = {
				constructor: Bind,
				renderEnd: function(els, model, cntx, container){
					
					this.provider = BindingProvider.create(model, container, this, 'single');
					
					BindingProvider.bind(this.provider);
				},
				dispose: function(){
					if (this.provider && typeof this.provider.dispose === 'function') {
						this.provider.dispose();
					}
				}
			};
		
		
		}());
		
		// end:source bind
		// source dualbind
		/**
		 *	Mask Custom Handler
		 *
		 *	2 Way Data Model binding
		 *
		 *
		 *	attr =
		 *		value: {string} - property path in object
		 *		?property : {default} 'element.value' - value to get/set from/to HTMLElement
		 *		?changeEvent: {default} 'change' - listen to this event for HTMLELement changes
		 *
		 *		?setter: {string} - setter function of a parent controller
		 *		?getter: {string} - getter function of a parent controller
		 *
		 *
		 */
		
		var DualbindCompo = class_create({
		
			renderEnd: function(elements, model, ctx, container) {
				this.provider = BindingProvider.create(model, container, this);
				
				var compos = this.components;
				if (compos != null) {
					var imax = compos.length,
						i = -1, x;
					while ( ++i < imax ){
						x = compos[i];
						if (x.compoName === ':validate') {
							this.provider.addValidation(x.validations);
						}
					}
				}
					
				
				if (this.attr['no-validation'] == null) {
					var fn = ValidatorProvider.getFnFromModel(model, this.provider.value);
					if (fn != null) {
						this.provider.addValidation(fn);
					}
				}
				BindingProvider.bind(this.provider);
			},
			dispose: function() {
				var dispose = this.provider && this.provider.dispose;
				if (dispose != null) {
					dispose.call(this.provider);
				}
			},
			
			validate: function(){
				return this.provider && this.provider.validate();
			},
			
			handlers: {
				attr: {
					'x-signal': function() {}
				}
			}
		});
		
		__registerHandler(':dualbind', DualbindCompo);
		__registerHandler( 'dualbind', DualbindCompo);
		// end:source dualbind
		// endif
		// end:source handlers/
		// source utilities/
		// source bind
		/**
		 *	Mask Custom Utility - for use in textContent and attribute values
		 */
		(function(){
			
			function attr_strReplace(attrValue, currentValue, newValue) {
				if (!attrValue) 
					return newValue;
				
				if (currentValue == null || currentValue === '') 
					return attrValue + ' ' + newValue;
				
				return attrValue.replace(currentValue, newValue);
			}
		
			function refresherDelegate_NODE(element){
				return function(value) {
					element.textContent = value;
				};
			}
			function refresherDelegate_ATTR(element, attrName, currentValue) {
				return function(value){
					var currentAttr = element.getAttribute(attrName),
						attr = attr_strReplace(currentAttr, currentValue, value);
		
					element.setAttribute(attrName, attr);
					currentValue = value;
				};
			}
			function refresherDelegate_PROP(element, attrName, currentValue) {
				return function(value){
					switch(typeof element[attrName]) {
						case 'boolean':
							currentValue = element[attrName] = !!value;
							return;
						case 'number':
							currentValue = element[attrName] = Number(value);
							return;
						case 'string':
							currentValue = element[attrName] = attr_strReplace(element[attrName], currentValue, value);
							return;
						default:
							log_warn('Unsupported elements property type', attrName);
							return;
					}
				};
			}
			
			function create_refresher(type, expr, element, currentValue, attrName) {
				if ('node' === type) {
					return refresherDelegate_NODE(element);
				}
				if ('attr' === type) {
					switch(attrName) {
						case 'value':
						case 'disabled':
						case 'checked':
						case 'selected':
						case 'selectedIndex':
							return refresherDelegate_PROP(element, attrName, currentValue);
					}
					return refresherDelegate_ATTR(element, attrName, currentValue);
				}
				throw Error('Unexpected binder type: ' + type);
			}
		
		
			function bind (current, expr, model, ctx, element, controller, attrName, type){
				var	refresher =  create_refresher(type, expr, element, current, attrName),
					binder = expression_createBinder(expr, model, ctx, controller, refresher);
			
				expression_bind(expr, model, ctx, controller, binder);
			
			
				compo_attachDisposer(controller, function(){
					expression_unbind(expr, model, controller, binder);
				});
			}
		
			__registerUtil('bind', {
				mode: 'partial',
				current: null,
				element: null,
				nodeRenderStart: function(expr, model, ctx, element, controller){
					
					var current = expression_eval(expr, model, ctx, controller);
					
					// though we apply value's to `this` context, but it is only for immediat use
					// in .node() function, as `this` context is a static object that share all bind
					// utils
					this.element = document.createTextNode(current);
					
					return (this.current = current);
				},
				node: function(expr, model, ctx, container, ctr){
					var el = this.element,
						val = this.current;
					bind(
						val
						, expr
						, model
						, ctx
						, el
						, ctr
						, null
						, 'node'
					);
					this.element = null;
					this.current = null;
					return el;
				},
				
				attrRenderStart: function(expr, model, ctx, element, controller){
					return (this.current = expression_eval(expr, model, ctx, controller));
				},
				attr: function(expr, model, ctx, element, controller, attrName){
					bind(
						this.current,
						expr,
						model,
						ctx,
						element,
						controller,
						attrName,
						'attr');
					
					return this.current;
				}
			});
		
		}());
		
		// end:source bind
		// end:source utilities/
		// source attributes/
		// source xxVisible
		
		
		__registerAttr('xx-visible', function(node, attrValue, model, cntx, element, controller) {
			
			var binder = expression_createBinder(attrValue, model, cntx, controller, function(value){
				element.style.display = value ? '' : 'none';
			});
			
			expression_bind(attrValue, model, cntx, controller, binder);
			
			compo_attachDisposer(controller, function(){
				expression_unbind(attrValue, model,  controller, binder);
			});
			
			
			
			if (!expression_eval(attrValue, model, cntx, controller)) {
				
				element.style.display = 'none';
			}
		});
		// end:source xxVisible
		// source xToggle
		/**
		 *	Toggle value with ternary operator on an event.
		 *
		 *	button x-toggle='click: foo === "bar" ? "zet" : "bar" > 'Toggle'
		 */
		
		__registerAttr('x-toggle', 'client', function(node, attrValue, model, ctx, element, controller){
		    
		    
		    var event = attrValue.substring(0, attrValue.indexOf(':')),
		        expression = attrValue.substring(event.length + 1),
		        ref = expression_varRefs(expression);
		    
			if (typeof ref !== 'string') {
				// assume is an array
				ref = ref[0];
			}
			
		    __dom_addEventListener(element, event, function(){
		        var value = expression_eval(expression, model, ctx, controller);
		        
		        obj_setProperty(model, ref, value);
		    });
		});
		
		// end:source xToggle
		// source xClassToggle
		/**
		 *	Toggle Class Name
		 *
		 *	button x-toggle='click: selected'
		 */
		
		__registerAttr('x-class-toggle', 'client', function(node, attrVal, model, ctx, element){
		    
		    var event = attrVal.substring(0, attrVal.indexOf(':')),
		        klass = attrVal.substring(event.length + 1).trim();
		    
			
		    __dom_addEventListener(element, event, function(){
		         domLib(element).toggleClass(klass);
		    });
		});
		
		// end:source xClassToggle
		// end:source attributes/
		// source statements/
		(function(){
			var custom_Statements = mask.getStatement();
			
			// source 1.utils.js
			var _getNodes,
				_renderElements,
				_renderPlaceholder,
				_compo_initAndBind,
				
				els_toggle
				
				;
				
			(function(){
				
				_getNodes = function(name, node, model, ctx, controller){
					return custom_Statements[name].getNodes(node, model, ctx, controller);
				};
				
				_renderElements = function(nodes, model, ctx, container, ctr){
					if (nodes == null) 
						return null;
					
					var elements = [];
					builder_build(nodes, model, ctx, container, ctr, elements);
					return elements;
				};
				
				_renderPlaceholder = function(staticCompo, compo, container){
					var placeholder = staticCompo.placeholder;
					if (placeholder == null) {
						placeholder = document.createComment('');
						container.appendChild(placeholder);
					}
					compo.placeholder = placeholder;
				};
				
				_compo_initAndBind = function(compo, node, model, ctx, container, controller) {
					
					compo.parent = controller;
					compo.model = model;
					
					compo.refresh = fn_proxy(compo.refresh, compo);
					compo.binder = expression_createBinder(
						compo.expr || compo.expression,
						model,
						ctx,
						controller,
						compo.refresh
					);
					
					
					expression_bind(compo.expr || compo.expression, model, ctx, controller, compo.binder);
				};
				
				
				els_toggle = function(els, state){
					if (els == null) 
						return;
					
					var isArray = typeof els.splice === 'function',
						imax = isArray ? els.length : 1,
						i = -1,
						x;
					while ( ++i < imax ){
						x = isArray ? els[i] : els;
						x.style.display = state ? '' : 'none';
					}
				}
				
			}());
			// end:source 1.utils.js
			// source 2.if.js
			(function(){
				
				__registerHandler('+if', {
					placeholder: null,
					meta: {
						serializeNodes: true
					},
					render: function(model, ctx, container, ctr, children){
						
						var node = this,
							nodes = _getNodes('if', node, model, ctx, ctr),
							index = 0;
						
						var next = node;
						while(true){
							
							if (next.nodes === nodes) 
								break;
							
							index++;
							next = node.nextSibling;
							
							if (next == null || next.tagName !== 'else') {
								index = null;
								break;
							}
						}
						
						this.attr['switch-index'] = index;
						
						return _renderElements(nodes, model, ctx, container, ctr, children);
					},
					
					renderEnd: function(els, model, ctx, container, ctr){
						
						var compo = new IFStatement(),
							index = this.attr['switch-index'];
						
						_renderPlaceholder(this, compo, container);
						
						return initialize(
							compo
							, this
							, index
							, els
							, model
							, ctx
							, container
							, ctr
						);
					},
					
					serializeNodes: function(current){
						
						var nodes = [ current ];
						while (true) {
							current = current.nextSibling;
							if (current == null || current.tagName !== 'else') 
								break;
							
							nodes.push(current);
						}
						
						return mask.stringify(nodes);
					}
					
				});
				
				
				function IFStatement() {}
				
				IFStatement.prototype = {
					compoName: '+if',
					ctx : null,
					model : null,
					controller : null,
					
					index : null,
					Switch : null,
					binder : null,
					
					refresh: function() {
						var compo = this,
							switch_ = compo.Switch,
							
							imax = switch_.length,
							i = -1,
							expr,
							item, index = 0;
							
						var currentIndex = compo.index,
							model = compo.model,
							ctx = compo.ctx,
							ctr = compo.controller
							;
						
						while ( ++i < imax ){
							expr = switch_[i].node.expression;
							if (expr == null) 
								break;
							
							if (expression_eval(expr, model, ctx, ctr)) 
								break;
						}
						
						if (currentIndex === i) 
							return;
						
						if (currentIndex != null) 
							els_toggle(switch_[currentIndex].elements, false);
						
						if (i === imax) {
							compo.index = null;
							return;
						}
						
						this.index = i;
						
						var current = switch_[i];
						if (current.elements != null) {
							els_toggle(current.elements, true);
							return;
						}
						
						var frag = mask.render(current.node.nodes, model, ctx, null, ctr);
						var els = frag.nodeType === Node.DOCUMENT_FRAGMENT_NODE
							? _Array_slice.call(frag.childNodes)
							: frag
							;
						
						
						dom_insertBefore(frag, compo.placeholder);
						
						current.elements = els;
						
					},
					dispose: function(){
						var switch_ = this.Switch,
							imax = switch_.length,
							i = -1,
							
							x, expr;
							
						while( ++i < imax ){
							x = switch_[i];
							expr = x.node.expression;
							
							if (expr) {
								expression_unbind(
									expr,
									this.model,
									this.controller,
									this.binder
								);
							}
							
							x.node = null;
							x.elements = null;
						}
						
						this.controller = null;
						this.model = null;
						this.ctx = null;
					}
				};
				
				function initialize(compo, node, index, elements, model, ctx, container, ctr) {
					
					compo.model = model;
					compo.ctx = ctx;
					compo.controller = ctr;		
					compo.refresh = fn_proxy(compo.refresh, compo);
					compo.binder = expression_createListener(compo.refresh);
					compo.index = index;
					compo.Switch = [{
						node: node,
						elements: null
					}];
					
					expression_bind(node.expression, model, ctx, ctr, compo.binder);
					
					while (true) {
						node = node.nextSibling;
						if (node == null || node.tagName !== 'else') 
							break;
						
						compo.Switch.push({
							node: node,
							elements: null
						});
						
						if (node.expression) 
							expression_bind(node.expression, model, ctx, ctr, compo.binder);
					}
					if (index != null) {
						compo.Switch[index].elements = elements;
					}
					return compo;
				}
			
				
			}());
			// end:source 2.if.js
			// source 3.switch.js
			(function(){
				
				var $Switch = custom_Statements['switch'],
					attr_SWITCH = 'switch-index'
					;
				
				var _nodes,
					_index;
				
				__registerHandler('+switch', {
					meta: {
						serializeNodes: true
					},
					serializeNodes: function(current){
						return mask.stringify(current);
					},
					render: function(model, ctx, container, ctr, children){
						
						var value = expression_eval(this.expression, model, ctx, ctr);
						
						
						resolveNodes(value, this.nodes, model, ctx, ctr);
						
						if (_nodes == null) 
							return null;
						
						this.attr[attr_SWITCH] = _index;
						
						return _renderElements(_nodes, model, ctx, container, ctr, children);
					},
					
					renderEnd: function(els, model, ctx, container, ctr){
						
						var compo = new SwitchStatement(),
							index = this.attr[attr_SWITCH];
						
						_renderPlaceholder(this, compo, container);
						
						return initialize(
							compo
							, this
							, index
							, els
							, model
							, ctx
							, container
							, ctr
						);
					}
				});
				
				
				function SwitchStatement() {}
				
				SwitchStatement.prototype = {
					compoName: '+switch',
					ctx: null,
					model: null,
					controller: null,
					
					index: null,
					nodes: null,
					Switch: null,
					binder: null,
					
					
					refresh: function(value) {
						
						var compo = this,
							switch_ = compo.Switch,
							
							imax = switch_.length,
							i = -1,
							expr,
							item, index = 0;
							
						var currentIndex = compo.index,
							model = compo.model,
							ctx = compo.ctx,
							ctr = compo.controller
							;
						
						resolveNodes(value, compo.nodes, model, ctx, ctr);
						
						if (_index === currentIndex) 
							return;
						
						if (currentIndex != null) 
							els_toggle(switch_[currentIndex], false);
						
						if (_index == null) {
							compo.index = null;
							return;
						}
						
						this.index = _index;
						
						var elements = switch_[_index];
						if (elements != null) {
							els_toggle(elements, true);
							return;
						}
						
						var frag = mask.render(_nodes, model, ctx, null, ctr);
						var els = frag.nodeType === Node.DOCUMENT_FRAGMENT_NODE
							? _Array_slice.call(frag.childNodes)
							: frag
							;
						
						
						dom_insertBefore(frag, compo.placeholder);
						
						switch_[_index] = els;
						
					},
					dispose: function(){
						expression_unbind(
							this.expr,
							this.model,
							this.controller,
							this.binder
						);
					
						this.controller = null;
						this.model = null;
						this.ctx = null;
						
						var switch_ = this.Switch,
							key,
							els, i, imax
							;
						
						for(key in switch_) {
							els = switch_[key];
							
							if (els == null)
								continue;
							
							imax = els.length;
							i = -1;
							while ( ++i < imax ){
								if (els[i].parentNode != null) 
									els[i].parentNode.removeChild(els[i]);
							}
						}
					}
				};
				
				function resolveNodes(val, nodes, model, ctx, ctr) {
					
					_nodes = $Switch.getNodes(val, nodes, model, ctx, ctr);
					_index = null;
					
					if (_nodes == null) 
						return;
					
					var imax = nodes.length,
						i = -1;
					while( ++i < imax ){
						if (nodes[i].nodes === _nodes) 
							break;
					}
						
					_index = i === imax ? null : i;
				}
				
				function initialize(compo, node, index, elements, model, ctx, container, ctr) {
					
					compo.ctx = ctx;
					compo.expr = node.expression;
					compo.model = model;
					compo.controller = ctr;
					compo.index = index;
					compo.nodes = node.nodes;
					
					compo.refresh = fn_proxy(compo.refresh, compo);
					compo.binder = expression_createBinder(
						compo.expr,
						model,
						ctx,
						ctr,
						compo.refresh
					);
					
					
					compo.Switch = new Array(node.nodes.length);
					
					if (index != null) {
						compo.Switch[index] = elements;
					}
					expression_bind(node.expression, model, ctx, ctr, compo.binder);
					
					return compo;
				}
			
				
			}());
			// end:source 3.switch.js
			// source 4.with.js
			(function(){
				
				var $With = custom_Statements['with'];
					
				__registerHandler('+with', {
					meta: {
						serializeNodes: true
					},
					rootModel: null,
					render: function(model, ctx, container, ctr){
						var expr = this.expression,
							nodes = this.nodes,
							val = expression_eval_strict(
								expr, model, ctx, ctr
							)
							;
						this.rootModel = model;
						return build(nodes, val, ctx, container, ctr);
					},
					
					onRenderStartClient: function(model, ctx){
						this.rootModel = model;
						this.model = expression_eval_strict(
							this.expression, model, ctx, this
						);
					},
					
					renderEnd: function(els, model, ctx, container, ctr){
						model = this.rootModel || model;
						
						var compo = new WithStatement(this);
					
						compo.elements = els;
						compo.model = model;
						compo.parent = ctr;
						compo.refresh = fn_proxy(compo.refresh, compo);
						compo.binder = expression_createBinder(
							compo.expr,
							model,
							ctx,
							ctr,
							compo.refresh
						);
						
						expression_bind(compo.expr, model, ctx, ctr, compo.binder);
						
						_renderPlaceholder(this, compo, container);
						return compo;
					}
				});
				
				
				function WithStatement(node){
					this.expr = node.expression;
					this.nodes = node.nodes;
				}
				
				WithStatement.prototype = {
					compoName: '+with',
					elements: null,
					binder: null,
					model: null,
					parent: null,
					refresh: function(val){
						dom_removeAll(this.elements);
						
						if (this.components) {
							var imax = this.components.length,
								i = -1;
							while ( ++i < imax ){
								Compo.dispose(this.components[i]);
							}
							this.components.length = 0;
						}
						
						
						var fragment = document.createDocumentFragment();
						this.elements = build(this.nodes, val, null, fragment, this);
						
						dom_insertBefore(fragment, this.placeholder);
						compo_inserted(this);
					},
					
					
					dispose: function(){
						expression_unbind(
							this.expr,
							this.model,
							this.parent,
							this.binder
						);
					
						this.parent = null;
						this.model = null;
						this.ctx = null;
					}
					
				};
				
				function build(nodes, model, ctx, container, controller){
					var els = [];
					builder_build(nodes, model, ctx, container, controller, els);
					return els;
				}
			}());
			// end:source 4.with.js
			// source 5.visible.js
			(function(){
				var $Visible = custom_Statements['visible'];
					
				__registerHandler('+visible', {
					meta: {
						serializeNodes: true
					},
					render: function(model, ctx, container, ctr, childs){
						return build(this.nodes, model, ctx, container, ctr);
					},
					renderEnd: function(els, model, ctx, container, ctr){
						
						var compo = new VisibleStatement(this);
						compo.elements = els;
						compo.model = model;
						compo.parent = ctr;
						compo.refresh = fn_proxy(compo.refresh, compo);
						compo.binder = expression_createBinder(
							compo.expr,
							model,
							ctx,
							ctr,
							compo.refresh
						);
						
						expression_bind(compo.expr, model, ctx, ctr, compo.binder);
						compo.refresh();
						return compo;
					}
				});
				
				
				function VisibleStatement(node){
					this.expr = node.expression;
					this.nodes = node.nodes;
				}
				
				VisibleStatement.prototype = {
					compoName: '+visible',
					elements: null,
					binder: null,
					model: null,
					parent: null,
					refresh: function(){
						var isVisible = expression_eval(
							this.expr, this.model, this.ctx, this
						);
						$Visible.toggle(this.elements, isVisible);
					},
					dispose: function(){
						expression_unbind(
							this.expr,
							this.model,
							this.parent,
							this.binder
						);
					
						this.parent = null;
						this.model = null;
						this.ctx = null;
					}
					
				};
				
				function build(nodes, model, ctx, container, ctr){
					var els = [];
					builder_build(nodes, model, ctx, container, ctr, els);
					return els;
				}
			}());
			// end:source 5.visible.js
			// source loop/exports.js
			(function(){
				
				// source utils.js
				
				
				function arr_createRefs(array){
					var imax = array.length,
						i = -1,
						x;
					while ( ++i < imax ){
						//create references from values to distinguish the models
						x = array[i];
						switch (typeof x) {
						case 'string':
						case 'number':
						case 'boolean':
							array[i] = Object(x);
							break;
						}
					}
				}
				
				
				function list_sort(self, array) {
				
					var compos = self.node.components,
						i = 0,
						imax = compos.length,
						j = 0,
						jmax = null,
						element = null,
						compo = null,
						fragment = document.createDocumentFragment(),
						sorted = [];
				
					for (; i < imax; i++) {
						compo = compos[i];
						if (compo.elements == null || compo.elements.length === 0) 
							continue;
						
						for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
							element = compo.elements[j];
							element.parentNode.removeChild(element);
						}
					}
				
					
					outer: for (j = 0, jmax = array.length; j < jmax; j++) {
				
						for (i = 0; i < imax; i++) {
							if (array[j] === self._getModel(compos[i])) {
								sorted[j] = compos[i];
								continue outer;
							}
						}
					
						console.warn('No Model Found for', array[j]);
					}
				
				
				
					for (i = 0, imax = sorted.length; i < imax; i++) {
						compo = sorted[i];
				
						if (compo.elements == null || compo.elements.length === 0) {
							continue;
						}
				
				
						for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
							element = compo.elements[j];
				
							fragment.appendChild(element);
						}
					}
				
					self.components = self.node.components = sorted;
				
					dom_insertBefore(fragment, self.placeholder);
				
				}
				
				function list_update(self, deleteIndex, deleteCount, insertIndex, rangeModel) {
					
					var node = self.node,
						compos = node.components
						;
					if (compos == null) 
						compos = node.components = []
					
					var prop1 = self.prop1,
						prop2 = self.prop2,
						type = self.type,
						
						ctx = self.ctx,
						ctr = self.node
						;
					
					if (deleteIndex != null && deleteCount != null) {
						var i = deleteIndex,
							length = deleteIndex + deleteCount;
				
						if (length > compos.length) 
							length = compos.length;
						
						for (; i < length; i++) {
							if (compo_dispose(compos[i], node)){
								i--;
								length--;
							}
						}
					}
				
					if (insertIndex != null && rangeModel && rangeModel.length) {
				
						var i = compos.length,
							imax,
							fragment = self._build(node, rangeModel, ctx, ctr),
							new_ = compos.splice(i)
							; 
						compo_fragmentInsert(node, insertIndex, fragment, self.placeholder);
						
						compos.splice.apply(compos, [insertIndex, 0].concat(new_));
						i = 0;
						imax = new_.length;
						for(; i < imax; i++){
							__Compo.signal.emitIn(new_[i], 'domInsert');
						}
					}
				}
				
				function list_remove(self, removed){
					var compos = self.components,
						i = compos.length,
						x;
					while(--i > -1){
						x = compos[i];
						
						if (removed.indexOf(x.model) === -1) 
							continue;
						
						compo_dispose(x, self.node);
					}
				}
				
				
				// end:source utils.js
				// source proto.js
				var LoopStatementProto = {
					model: null,
					parent: null,
					refresh: function(value, method, args, result){
						var i = 0,
							x, imax;
							
						var node = this.node,
							
							model = this.model,
							ctx = this.ctx,
							ctr = this.node
							;
				
						if (method == null) {
							// this was new array/object setter and not an immutable function call
							
							var compos = node.components;
							if (compos != null) {
								var imax = compos.length,
									i = -1;
								while ( ++i < imax ){
									if (compo_dispose(compos[i], node)){
										i--;
										imax--;
									}
								}
								compos.length = 0;
							}
							
							var frag = this._build(node, value, ctx, ctr);
							
							dom_insertBefore(frag, this.placeholder);
							arr_each(node.components, compo_inserted);
							return;
						}
				
						var array = value;
						arr_createRefs(value);
						
				
						switch (method) {
						case 'push':
							list_update(this, null, null, array.length - 1, array.slice(array.length - 1));
							break;
						case 'pop':
							list_update(this, array.length, 1);
							break;
						case 'unshift':
							list_update(this, null, null, 0, array.slice(0, 1));
							break;
						case 'shift':
							list_update(this, 0, 1);
							break;
						case 'splice':
							var sliceStart = args[0],
								sliceRemove = args.length === 1 ? this.components.length : args[1],
								sliceAdded = args.length > 2 ? array.slice(args[0], args.length - 2 + args[0]) : null;
				
							list_update(this, sliceStart, sliceRemove, sliceStart, sliceAdded);
							break;
						case 'sort':
						case 'reverse':
							list_sort(this, array);
							break;
						case 'remove':
							if (result != null && result.length) 
								list_remove(this, result);
							break;
						}
					},
					
					dispose: function(){
						
						expression_unbind(
							this.expr || this.expression, this.model, this.parent, this.binder
						);
					}
				};
				
				// end:source proto.js
				// source for.js
				(function(){
					
					var For = custom_Statements['for'],
					
						attr_PROP_1 = 'for-prop-1',
						attr_PROP_2 = 'for-prop-2',
						attr_TYPE = 'for-type',
						attr_EXPR = 'for-expr'
						;
						
					
					__registerHandler('+for', {
						meta: {
							serializeNodes: true
						},
						serializeNodes: function(node){
							return mask.stringify(node);
						},
						render: function(model, ctx, container, ctr, children){
							var directive = For.parseFor(this.expression),
								attr = this.attr;
							
							attr[attr_PROP_1] = directive[0];
							attr[attr_PROP_2] = directive[1];
							attr[attr_TYPE] = directive[2];
							attr[attr_EXPR] = directive[3];
							
							var value = expression_eval_strict(directive[3], model, ctx, ctr);
							if (value == null) 
								return;
							
							if (is_Array(value)) 
								arr_createRefs(value);
							
							For.build(
								value,
								directive,
								this.nodes,
								model,
								ctx,
								container,
								this,
								children
							);
						},
						
						renderEnd: function(els, model, ctx, container, ctr){
							
							var compo = new ForStatement(this, this.attr);
							_renderPlaceholder(this, compo, container);			
							_compo_initAndBind(compo, this, model, ctx, container, ctr);
							return compo;
						},
						
						getHandler: function(name, model){
							
							return For.getHandler(name, model);
						}
						
					});
					
					function initialize(compo, node, els, model, ctx, container, ctr) {
						
						compo.parent = ctr;
						compo.model = model;
						
						compo.refresh = fn_proxy(compo.refresh, compo);
						compo.binder = expression_createBinder(
							compo.expr,
							model,
							ctx,
							ctr,
							compo.refresh
						);
						
						
						expression_bind(compo.expr, model, ctx, ctr, compo.binder);
						
					}
					
					function ForStatement(node, attr) {
						this.prop1 = attr[attr_PROP_1];
						this.prop2 = attr[attr_PROP_2];
						this.type = attr[attr_TYPE];
						this.expr = attr[attr_EXPR];
						
						if (node.components == null) 
							node.components = [];
						
						this.node = node;
						this.components = node.components;
					}
					
					ForStatement.prototype = {
						compoName: '+for',
						model: null,
						parent: null,
						
						refresh: LoopStatementProto.refresh,
						dispose: LoopStatementProto.dispose,
						
						_getModel: function(compo) {
							return compo.scope[this.prop1];
						},
						
						_build: function(node, model, ctx, component) {
							var nodes = For.getNodes(node.nodes, model, this.prop1, this.prop2, this.type);
							
							return builder_build(nodes, this.model, ctx, null, component);
						}
					};
					
				}());
				// end:source for.js
				// source each.js
				(function(){
					
					var Each = custom_Statements['each'];
					var EachBinded =  {
						meta: {
							serializeNodes: true
						},
						serializeNodes: function(node){
							return mask.stringify(node);
						},
						//modelRef: null,
						render: function(model, ctx, container, ctr, children){
							//this.modelRef = this.expression;
							var array = expression_eval(this.expression, model, ctx, ctr);
							if (array == null) 
								return;
							
							arr_createRefs(array);
							
							build(
								this.nodes,
								array,
								ctx,
								container,
								this,
								children
							);
						},
						
						renderEnd: function(els, model, ctx, container, ctr){
							var compo = new EachStatement(this, this.attr);
							
							_renderPlaceholder(this, compo, container);
							_compo_initAndBind(compo, this, model, ctx, container, ctr);
							return compo;
						}
						
					};
					
					var EachItem = class_create({
						compoName: 'each::item',
						scope: null,
						model: null,
						modelRef: null,
						parent: null,
				
						// if BROWSER
						renderStart: null,
						// endif
						renderEnd: function(els) {
							this.elements = els;
						},
						dispose: function(){
							if (this.elements != null) {
								this.elements.length = 0;
								this.elements = null;
							}
						}
					});
					
					var EachStatement = class_create({
						constructor: function EachStatement(node, attr) {
							this.expression = node.expression;
							this.nodes = node.nodes;
							
							if (node.components == null) 
								node.components = [];
							
							this.node = node;
							this.components = node.components;
						},
						compoName: '+each',
						refresh: LoopStatementProto.refresh,
						dispose: LoopStatementProto.dispose,
						
						_getModel: function(compo) {
							return compo.model;
						},
						
						_build: function(node, model, ctx, component) {
							var fragment = document.createDocumentFragment();
							
							build(node.nodes, model, ctx, fragment, component);
							
							return fragment;
						}
					});
					
					// METHODS
					
					function build(nodes, array, ctx, container, ctr, elements) {
						var imax = array.length,
							nodes_ = new Array(imax),
							i = 0, node;
						
						for(; i < imax; i++) {
							node = createEachNode(nodes, i);
							builder_build(node, array[i], ctx, container, ctr, elements);
						}
					}
					
					function createEachNode(nodes, index){
						var item = new EachItem;
						item.scope = { index: index };
						
						return {
							type: Dom.COMPONENT,
							tagName: 'each::item',
							nodes: nodes,
							controller: function() {
								return item;
							}
						};
					}
					
					// EXPORTS
					
					__registerHandler('each::item', EachItem);
					__registerHandler('+each', EachBinded);
				}());
				// end:source each.js
				
			}());
			
			// end:source loop/exports.js
			
		}());
		// end:source statements/
		
		// source exports
		obj_extend(mask, {
			Validators: Validators,
			registerValidator: function(type, fn) {
				Validators[type] = fn;
			},
			BindingProviders: CustomProviders,
			registerBinding: function(name, Prov) {
				CustomProviders[name] = Prov;
			}
		});
		
		// end:source exports
	
		// source api/utils
		obj_extend(mask.obj, {
			addObserver   : obj_addObserver,
			removeObserver: obj_removeObserver,
		});
		// end:source api/utils
	
	}(Mask, Compo));
	
	// end:source /ref-mask-binding/lib/binding_embed
	
	// source handlers/
	// source debug
	(function(){
		custom_Statements['log'] = {
			render: function(node, model, ctx, container, controller){
				var arr = expression_evalStatements(node.expression, model, ctx, controller);
				arr.unshift('Mask::Log');
				console.log.apply(console, arr);
			}
		};
		customTag_register('debugger', {
			render: function(model, ctx, container, compo){
				debugger;
			}
		});
		customTag_register(':utest', Compo({
			render: function (model, ctx, container) {
				if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
					container = container.childNodes;
				this.$ = $(container);
			}
		}));
	}());
	// end:source debug
	// source define
	custom_Tags['define'] = class_create({
		meta: {
			serializeNodes: true
		},
		constructor: function(node, model, ctx, el, ctr) {
			Define.registerGlobal(node, model, ctr);
		},
		render: fn_doNothing
	});
	
	custom_Tags['let'] = class_create({
		meta: {
			serializeNodes: true
		},
		constructor: function(node, model, ctx, el, ctr) {
			Define.registerScoped(node, model, ctr);
		},
		render: fn_doNothing
	});
	// end:source define
	// source html
	(function() {
		var Compo = {
			meta: {
				mode: 'server:all'
			},
			render: function(model, ctx, container) {
				this.html = jmask(this.nodes).text(model, ctx, this);
		
				if (container.insertAdjacentHTML) {
					container.insertAdjacentHTML('beforeend', this.html);
					return;
				}
				if (container.ownerDocument) {
					var div = document.createElement('div'),
						child;
					div.innerHTML = this.html;
					child = div.firstChild;
					while (child != null) {
						container.appendChild(child);
						child = child.nextSibling;
					}
				}
			},
			toHtml: function(){
				return this.html || '';
			},
			html: null
		};	
		customTag_register(':html', Compo);
	}());
	
	// end:source html
	// source methods
	(function() {
		var Method = class_create({
			meta: {
				serializeNodes: true
			},
			constructor: function(node) {
				this.fn = node.fn; // || compileFn(node.args, node.body);
				this.name = node.name;
			}
		});
		
		custom_Tags['slot'] = class_create(Method, {
			renderEnd: function(){
				var ctr = this.parent;
				var slots = ctr.slots;
				if (slots == null) {
					slots = ctr.slots = {};
				}
				slots[this.name] = this.fn;
			}
		});
		custom_Tags['event'] = class_create(Method, {
			renderEnd: function(els, model, ctx, el){
				this.fn = this.fn.bind(this.parent);
				var name = this.name,
					params = null,
					i = name.indexOf(':');
				if (i !== -1) {
					params = name.substring(i + 1).trim();
					name = name.substring(0, i).trim();
				}			
				Compo.Dom.addEventListener(el, name, this.fn, params);
			}
		});
		custom_Tags['function'] = class_create(Method, {
			renderEnd: function(){
				this.parent[this.name] = this.fn;
			}
		});
	}());
	// end:source methods
	// source template
	(function(){
		var templates_ = {},
			helper_ = {
				get: function(id){
					return templates_[id]
				},
				resolve: function(node, id){
					var nodes = templates_[id];
					if (nodes != null) 
						return nodes;
					
					var selector = ':template[id=' + id +']',
						parent = node.parent,
						tmpl = null
						;
					while (parent != null) {
						tmpl = jmask(parent.nodes)
							.filter(selector)
							.get(0);
						
						if (tmpl != null) 
							return tmpl.nodes;
							
						parent = parent.parent;
					}
					log_warn('Template was not found', id);
					return null;
				},
				register: function(id, nodes){
					if (id == null) {
						log_warn('`:template` must define the `id` attr');
						return;
					}
					templates_[id] = nodes;
				}
			};
	
		Mask.templates = helper_;
		customTag_register(':template', {
			render: function() {
				helper_.register(this.attr.id, this.nodes);
			}
		});
	
		customTag_register(':import', {
			renderStart: function() {
				var id = this.attr.id;
				if (id == null) {
					log_error('`:import` shoud reference the template via id attr')
					return;
				}
				this.nodes = helper_.resolve(this, id);
			}
		});
		
		custom_Statements['include'] = {
			render: function (node, model, ctx, container, ctr, els) {
				var name = attr_first(node.attr);
				var Compo = customTag_get(name, ctr);
				var template;
				
				if (Compo != null) {
					template = Compo.prototype.template || Compo.prototype.nodes;
					if (template != null) {
						template = mask_merge(template, node.nodes);
					}
				}
				else {
					template = helper_.get(name);
				}
				if (template != null) {
					builder_build(template, model, ctx, container, ctr, els);
				}
			}
		};	
		
		customTag_register('layout:master', {
			render: function () {
				var name = this.attr.id || attr_first(this.attr);
				helper_.register(name, this.nodes);
			}
		});
		
		customTag_register('layout:view', {
			render: function (model, ctx, container, ctr, els) {
				var nodes = helper_.get(this.attr.master);
				var template = mask_merge(nodes, this.nodes, null, { extending: true });
				builder_build(template, model, ctx, container, ctr, els);
			}
		});
		
	}());
	// end:source template
	// source var
	(function(){
		// TODO: refactor methods, use MaskNode Serialization instead Model Serialization
		custom_Tags['var'] = class_create(customTag_Base, {
			renderStart: function(model, ctx){
				set(this, this.attr, true, model, ctx);
			},
			onRenderStartClient: function(){
				set(this, this.model, false)
			}
		});
	
		function set(self, source, doEval, attr, model, ctx) {
			// set data also to model, so that it will be serialized in NodeJS
			self.model = {};
			
			var parent = self.parent;
			var scope  = parent.scope;
			if (scope == null) {
				scope = parent.scope = {};
			}
			for(var key in source){
				self.model[key] = scope[key] = doEval === false
					? source[key]
					: expression_eval(source[key], model, ctx, parent);
			}
		}
	}());
	// end:source var
	// end:source handlers/

// source umd-footer
	Mask.Compo = Compo;
	Mask.jmask = jmask;
	
	Mask.version = '0.51.37';
	
	//> make fast properties
	custom_optimize();
	
	return (exports.mask = Mask);
}));
// end:source umd-footer
