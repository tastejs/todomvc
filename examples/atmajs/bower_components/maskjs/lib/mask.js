// source /src/license.txt
/*!
 * MaskJS v0.10.0
 * Part of the Atma.js Project
 * http://atmajs.com/
 *
 * MIT license
 * http://opensource.org/licenses/MIT
 *
 * (c) 2012, 2014 Atma.js and other contributors
 */
// end:source /src/license.txt
// source /src/umd-head.js
(function (root, factory) {
    'use strict';

    var _global = typeof window === 'undefined' || window.navigator == null
		? global
		: window,

		_exports, _document;


	if (typeof exports !== 'undefined' && (root == null || root === exports || root === _global)){
		// raw commonjs module
        root = exports;
    }


    _document = _global.document;
	_exports = root || _global;


    function construct(){
        return factory(_global, _exports, _document);
    }


    if (typeof define === 'function' && define.amd) {
        return define(construct);
    }

	// Browser OR Node
    return construct();

}(this, function (global, exports, document) {
    'use strict';

// end:source /src/umd-head.js

	// source /ref-utils/lib/utils.embed.js
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
		is_rawObject;

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
	}());
	// end:source /src/is.js
	// source /src/obj.js
	var obj_getProperty,
		obj_setProperty,
		obj_extend,
		obj_create;
	(function(){
		obj_getProperty = function(obj, path){
			if ('.' === path) // obsolete
				return obj;

			var chain = path.split('.'),
				imax = chain.length,
				i = -1;
			while ( obj != null && ++i < imax ) {
				obj = obj[chain[i]];
			}
			return obj;
		};
		obj_setProperty = function(obj, path, val) {
			var chain = path.split('.'),
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
		obj_create = Object.create || function(x) {
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
		arr_contains;
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
	}());
	// end:source /src/arr.js
	// source /src/fn.js
	var fn_proxy,
		fn_apply,
		fn_doNothing;
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
	}());
	// end:source /src/fn.js

	// source /src/refs.js
	var _Array_slice = Array.prototype.slice,
		_Array_splice = Array.prototype.splice,
		_Array_indexOf = Array.prototype.indexOf,

		_Object_create = obj_create,
		_Object_hasOwnProp = Object.hasOwnProperty;
	// end:source /src/refs.js
	// end:source /ref-utils/lib/utils.embed.js

	// source /src/scope-vars.js
	var __rgxEscapedChar = {
			"'": /\\'/g,
			'"': /\\"/g,
			'{': /\\\{/g,
			'>': /\\>/g,
			';': /\\>/g
		},

		__cfg = {
			// Relevant to node.js only. Disable compo caching
			allowCache: true
		};
	// end:source /src/scope-vars.js
    // source /src/util/util.js

    /**
     * - arr (Array) - array that was prepaired by parser -
     *  every even index holds interpolate value that was in #{some value}
     * - model: current model
     * - type (String const) (node | attr): tell custom utils what part we are
     *  interpolating
     * - cntx (Object): current render context object
     * - element (HTMLElement):
     * type node - this is a container
     * type attr - this is element itself
     * - name
     *  type attr - attribute name
     *  type node - undefined
     *
     * -returns Array | String
     *
     * If we rendere interpolation in a TextNode, then custom util can return not only string values,
     * but also any HTMLElement, then TextNode will be splitted and HTMLElements will be inserted within.
     * So in that case we return array where we hold strings and that HTMLElements.
     *
     * If custom utils returns only strings, then String will be returned by this function
     *
     */

    function util_interpolate(arr, type, model, ctx, element, controller, name) {
	var imax = arr.length,
		i = -1,
		array = null,
		string = '',
		even = true,

		utility,
		value,
		index,
		key,
		handler;

	while ( ++i < imax ) {
		if (even === true) {
			if (array == null){
				string += arr[i];
			} else{
				array.push(arr[i]);
			}
		} else {
			key = arr[i];
			value = null;
			index = key.indexOf(':');

			if (index === -1) {
				value = obj_getPropertyEx(key,  model, ctx, controller);

			} else {
				utility = index > 0
					? key.substring(0, index).trim()
					: '';

				if (utility === '') {
					utility = 'expression';
				}

				key = key.substring(index + 1);
				handler = custom_Utils[utility];

				if (handler == null) {
					log_error('Undefined custom util `%s`', utility);
					continue;
				}

				value = handler(key, model, ctx, element, controller, name, type);
			}

			if (value != null){

				if (typeof value === 'object' && array == null){
					array = [string];
				}

				if (array == null){
					string += value;
				} else {
					array.push(value);
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

    // end:source /src/util/util.js
    // source /src/util/attr.js
    var attr_extend;

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
    }());

    // end:source /src/util/attr.js
	// source /src/util/template.js
	function Template(template) {
		this.template = template;
		this.index = 0;
		this.length = template.length;
	}

	Template.prototype = {
		skipWhitespace: function () {

			var template = this.template,
				index = this.index,
				length = this.length;

			for (; index < length; index++) {
				if (template.charCodeAt(index) > 32 /*' '*/) {
					break;
				}
			}

			this.index = index;

			return this;
		},

		skipToAttributeBreak: function () {

			var template = this.template,
				index = this.index,
				length = this.length,
				c;
			do {
				c = template.charCodeAt(++index);
				/* if c == # && next() == { - continue */
				if (c === 35 && template.charCodeAt(index + 1) === 123) {
					// goto end of template declaration
					this.index = index;
					this.sliceToChar('}');
					this.index++;
					return;
				}
			}
			while (c !== 46 && c !== 35 && c !== 62 && c !== 123 && c !== 32 && c !== 59 && index < length);
			//while(!== ".#>{ ;");

			this.index = index;
		},
		sliceToChar: function (c) {
			var template = this.template,
				index = this.index,
				start = index,
				isEscaped = false,
				value, nindex;

			while ((nindex = template.indexOf(c, index)) > -1) {
				index = nindex;
				if (template.charCodeAt(index - 1) !== 92 /*'\\'*/) {
					break;
				}
				isEscaped = true;
				index++;
			}

			value = template.substring(start, index);

			this.index = index;

			return isEscaped ? value.replace(__rgxEscapedChar[c], c) : value;
		}

	};

	// end:source /src/util/template.js

	// source /src/util/array.js
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
	// end:source /src/util/array.js
	// source /src/util/string.js

	// end:source /src/util/string.js
    // source /src/util/object.js
    var obj_getPropertyEx,
        obj_toDictionary;
    (function(){
        obj_getPropertyEx = function(path, model, ctx, ctr){
            if (path === '.')
                return model;

            var props = path.split('.'),
                value = model,
                i = -1,
                imax = props.length,
                key = props[0],
                start_i
                ;

            if ('$c' === key) {
                value = ctr;
                i++;
            }

            else if ('$a' === key) {
                value = ctr && ctr.attr;
                i++;
            }

            else if ('$u' === key) {
                value = customUtil_$utils;
                i++;
            }

            else if ('$ctx' === key) {
                value = ctx;
                i++;
            }

            start_i = i;
            while (value != null && ++i < imax) {
                value = value[props[i]];
            }
            if (value == null && start_i === -1) {
                var $scope;
                while (ctr != null){

                    $scope = ctr.scope;
                    if ($scope != null) {
                        value = getProperty_($scope, props, 0, imax);
                        if (value != null)
                            return value;
                    }

                    ctr = ctr.parent;
                }
            }

            return value;
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

        function getProperty_(obj, props, i, imax) {
            var val = obj;
            while(i < imax && val != null){
                val = val[props[i]];
                i++;
            }
            return val;
        }
    }());

    // end:source /src/util/object.js
	// source /src/util/listeners.js
	var listeners_on,
		listeners_off,
		listeners_emit;
	(function(){

		listeners_on = function(event, fn) {
			(bin[event] || (bin[event] = [])).push(fn);
		};
		listeners_off = function(event, fn){
			if (fn == null) {
				bin[event] = [];
				return;
			}
			arr_remove(bin[event], fn);
		};
		listeners_emit = function(event){

			var fns = bin[event];
			if (fns == null)
				return;

			var imax = fns.length,
				i = -1,
				args = _Array_slice.call(arguments, 1)
				;

			while ( ++i < imax)
				fns[i].apply(null, args);
		};

		// === private

		var bin = {
			compoCreated: null,
			error: null
		};
	}());
	// end:source /src/util/listeners.js
	// source /src/util/reporters.js
	var throw_,
		parser_error,
		parser_warn,
		log_warn,
		log_error;

	(function(){


		throw_ = function(error){
			log_error(error);
			listeners_emit('error', error);
		};

		parser_error = function(msg, str, i, token, state, file){
			var error = createMsg('error', msg, str, i, token, state, file);

			log_error(error.message);
			log_warn(error.stack);
			listeners_emit('error', error);
		};
		parser_warn = function(msg, str, i, token, state, file){
			var error = createMsg('warn', msg, str, i, token, state, file);
			log_warn(error.message);
			log_warn(error.stack);
			listeners_emit('error', error);
		};

		if (typeof console === 'undefined') {
			log_warn = log_error = function(){};
		}
		else {
			var bind  = Function.prototype.bind;
			log_warn  = bind.call(console.warn , console, 'MaskJS [Warn] :');
			log_error = bind.call(console.error, console, 'MaskJS [Error] :');
		}

		var ParserError = createError('Error'),
			ParserWarn  = createError('Warning');

		function createError(type) {
			function ParserError(msg, orig, index){
				this.type = 'Parser' + type;
				this.message = msg;
				this.original = orig;
				this.index = index;
				this.stack = prepairStack();
			}
			inherit(ParserError, Error);
			return ParserError;
		}

		function prepairStack(){
			var stack = new Error().stack;
			if (stack == null)
				return null;

			return stack
				.split('\n')
				.slice(6, 8)
				.join('\n');
		}
		function inherit(Ctor, Base){
			if (Object.create)
				Ctor.prototype = Object.create(Base.prototype);
		}
		function createMsg(type, msg, str, index, token, state, filename){
			msg += formatToken(token)
				+ formatFilename(str, index, filename)
				+ formatStopped(type, str, index)
				+ formatState(state)
				;

			var Ctor = type === 'error'
				? ParserError
				: ParserWarn;

			return new Ctor(msg, str, index);
		}
		function formatToken(token){
			if (token == null)
				return '';

			if (typeof token === 'number')
				token = String.fromCharCode(token);

			return ' Invalid token: `'+ token + '`';
		}
		function formatFilename(str, index, filename) {
			if (index == null && !filename)
				return '';

			var lines = str.substring(0, index).split('\n'),
				line = lines.length,
				row = index + 1 - lines.slice(0, line - 2).join('\n').length;

			return ' at '
				+ (filename || '')
				+ '(' + line + ':' + row + ')';
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

			return '\n    , when parsing ' + states[state];
		}
		function formatStopped(type, str, index){
			if (index == null)
				return '';

			var stopped = str.substring(index);
			if (stopped.length > 30)
				stopped = stopped.substring(0, 30) + '...';

			return '\n    Parser ' + type + ' at: ' + stopped;
		}
	}());
	// end:source /src/util/reporters.js

	// source /src/custom/exports.js
	var custom_Utils,
		custom_Statements,
		custom_Attributes,
		custom_Tags,
		custom_Tags_defs,

		customUtil_get,
		customUtil_$utils,
		customUtil_register,

		customTag_register
		;

	(function(){

		initialize();

		// source tag.js
		(function(repository){

			customTag_register = function(name, Handler){

				if (Handler != null && typeof Handler === 'object') {
					//> static
					Handler.__Ctor = wrapStatic(Handler);
				}

				repository[name] = Handler;
			};


			function wrapStatic(proto) {
				function Ctor(node, parent) {
					this.tagName = node.tagName;
					this.attr = node.attr;
					this.expression = node.expression;
					this.nodes = node.nodes;
					this.nextSibling = node.nextSibling;
					this.parent = parent;
					this.components = null;
				}

				Ctor.prototype = proto;

				return Ctor;
			}

		}(custom_Tags));
		// end:source tag.js
		// source util.js

		(function(repository) {

			customUtil_$utils = {};

			customUtil_register = function(name, mix) {

				if (is_Function(mix)) {
					repository[name] = mix;
					return;
				}

				repository[name] = createUtil(mix);

				if (mix.arguments === 'parsed')
					customUtil_$utils[name] = mix.process;

			};

			customUtil_get = function(name) {
				return name != null
					? repository[name]
					: repository
					;
			};

			// = private

			function createUtil(obj) {

				if (obj.arguments === 'parsed')
					return processParsedDelegate(obj.process);

				var fn = fn_proxy(obj.process || processRawFn, obj);
				// <static> save reference to the initial util object.
				// Mask.Bootstrap need the original util
				// @workaround
				fn.util = obj;
				return fn;
			}


			function processRawFn(expr, model, ctx, element, controller, attrName, type) {
				if ('node' === type) {

					this.nodeRenderStart(expr, model, ctx, element, controller);
					return this.node(expr, model, ctx, element, controller);
				}

				// asume 'attr'

				this.attrRenderStart(expr, model, ctx, element, controller, attrName);
				return this.attr(expr, model, ctx, element, controller, attrName);
			}


			function processParsedDelegate(fn) {

				return function(expr, model, ctx, element, controller) {

					var args = ExpressionUtil
							.evalStatements(expr, model, ctx, controller);

					return fn.apply(null, args);
				};
			}

		}(custom_Utils));
		// end:source util.js

		function initialize() {

			custom_Utils = {
				expression: function(value, model, ctx, element, controller){
					return ExpressionUtil.eval(value, model, ctx, controller);
				},
			};

			custom_Statements = {};

			custom_Attributes = {
				'class': null,
				id: null,
				style: null,
				name: null,
				type: null
			};

			custom_Tags = {
				/*
				 * Most common html tags
				 * http://jsperf.com/not-in-vs-null/3
				 */
				div: null,
				span: null,
				input: null,
				button: null,
				textarea: null,
				select: null,
				option: null,
				h1: null,
				h2: null,
				h3: null,
				h4: null,
				h5: null,
				h6: null,
				a: null,
				p: null,
				img: null,
				table: null,
				td: null,
				tr: null,
				pre: null,
				ul: null,
				li: null,
				ol: null,
				i: null,
				em: null,
				b: null,
				strong: null,
				form: null,
				audio: null,
				video: null,
				canvas: null,
				svg: null
			};

			// use on server to define reserved tags and its meta info
			custom_Tags_defs = {};
		}

	}());

	// end:source /src/custom/exports.js

	// source /src/expression/exports.js
	/**
	 * ExpressionUtil
	 *
	 * Helper to work with expressions
	 **/

	var ExpressionUtil = (function(){

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

			util_resolveRef = function(astRef, model, ctx, controller) {
				var current = astRef,
					key = astRef.body,
					object,
					value,
					args,
					i,
					imax
					;

				if ('$c' === key) {
					value = controller;

					var next = current.next,
						nextBody = next != null && next.body;
					if (nextBody != null && value[nextBody] == null){

						if (next.type === type_FunctionRef
								&& typeof Compo.prototype[nextBody] === 'function') {
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
							key = '$c.' + nextBody;
							current = next;
						}
					}

				}

				else if ('$a' === key)
					value = controller && controller.attr;

				else if ('$u' === key)
					value = customUtil_$utils;


				else if ('$ctx' === key)
					value = ctx;

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

						while( ++i < imax )
							args[i] = expression_evaluate(current.arguments[i], model, ctx, controller);

						value = value.apply(object, args);
					}

					if (value == null || current.next == null)
						break;

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

				//debugger;
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
		// source 7.vars.helper.js
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

		// end:source 7.vars.helper.js


		return {
			parse: expression_parse,

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
			eval: expression_evaluate,
			varRefs: refs_extractVars,

			// Return all values of a comma delimiter expressions
			// like argumets: ' foo, bar, "4,50" ' => [ %fooValue, %barValue, "4,50" ]
			evalStatements: function(expr, model, ctx, controller){

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

	                args.push(expression_evaluate(group, model, ctx, controller));
					group.body.length = 0;
	            }
				return args;
			}
		};

	}());

	// end:source /src/expression/exports.js
	// source /src/dom/exports.js
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

			nodes.push(el);
			var prev = nodes[nodes.length - 2];

			prev.nextSibling = el;
		}
		// end:source 1.utils.js
		// source 2.Node.js
		function Node(tagName, parent) {
			this.type = Dom.NODE;
			this.tagName = tagName;
			this.parent = parent;
			this.attr = {};
		}
		Node.prototype = {
			constructor: Node,
			type: dom_NODE,
			tagName: null,
			parent: null,
			attr: null,
			nodes: null,
			expression: null,
			appendChild: _appendChild,
			stringify: null,
			__single: null
		};
		// end:source 2.Node.js
		// source 3.TextNode.js


		function TextNode(text, parent) {
			this.content = text;
			this.parent = parent;
		}

		TextNode.prototype = {
			type: dom_TEXTNODE,
			content: null,
			parent: null
		};
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
		function Fragment(){}

		Fragment.prototype = {
			constructor: Fragment,
			type: dom_FRAGMENT,
			nodes: null,
			appendChild: _appendChild
		};
		// end:source 5.Fragment.js


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
	}());

	// end:source /src/dom/exports.js

	// source /src/statements/exports.js
	// source 1.if.js
	(function(){

		function getNodes(node, model, ctx, ctr){
			function evaluate(expr){
				return ExpressionUtil.eval(expr, model, ctx, ctr);
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

	// end:source 1.if.js
	// source 2.for.js

	(function(){
		var FOR_OF_ITEM = 'for..of/item',
			FOR_IN_ITEM = 'for..in/item';

		custom_Statements['for'] = {

			render: function(node, model, ctx, container, controller, childs){

				parse_For(node.expression);

				var value = ExpressionUtil.eval(__ForDirective[3], model, ctx, controller);
				if (value == null)
					return;

				build(
					value,
					__ForDirective,
					node.nodes,
					model,
					ctx,
					container,
					controller,
					childs
				);
			},

			build: build,
			parseFor: parse_For,
			createForItem: createForItem,
			getNodes: getNodes,

			getHandler: function(compoName, model){
				return createHandler(compoName, model);
			}
		};

		function createBootstrapCompo(name) {
			var Ctor = function(){};
			Ctor.prototype = {
				type: Dom.COMPONENT,
				compoName: name,
				renderEnd: handler_proto_renderEnd,
				dispose: handler_proto_dispose
			};
			return Ctor;
		}
		custom_Tags[FOR_OF_ITEM] = createBootstrapCompo(FOR_OF_ITEM);
		custom_Tags[FOR_IN_ITEM] = createBootstrapCompo(FOR_IN_ITEM);

		function build(value, For, nodes, model, ctx, container, ctr, childs) {

			builder_build(
				getNodes(nodes, value, For[0], For[1], For[2]),
				model,
				ctx,
				container,
				ctr,
				childs
			);
		}

		function getNodes(nodes, value, prop1, prop2, type) {

			if ('of' === type) {
				if (is_Array(value) === false) {
					log_error('<ForStatement> Value is not enumerable', value);
					return null;
				}

				return loop_Array(nodes, value, prop1, prop2);
			}

			if ('in' === type) {
				if (typeof value !== 'object') {
					log_warn('<ForStatement> Value is not an object', value);
					return null;
				}

				if (is_Array(value))
					log_warn('<mask:for> Consider to use `for..of` for Arrays');

				return loop_Object(nodes, value, prop1, prop2);
			}
		}

		function loop_Array(template, arr, prop1, prop2){

			var i = -1,
				imax = arr.length,
				nodes = new Array(imax),
				scope;

			while ( ++i < imax ) {
				scope = {};

				scope[prop1] = arr[i];

				if (prop2)
					scope[prop2] = i;


				nodes[i] = createForItem(FOR_OF_ITEM, template, scope);
			}

			return nodes;
		}

		function loop_Object(template, obj, prop1, prop2){
			var nodes = [],
				i = 0,
				scope, key, value;

			for (key in obj) {
				value = obj[key];
				scope = {};

				scope[prop1] = key;

				if (prop2)
					scope[prop2] = value;

				nodes[i++] = createForItem(FOR_IN_ITEM, template, scope);
			}

			return nodes;
		}

		function createForItem(name, nodes, scope) {

			return {
				type: Dom.COMPONENT,
				tagName: name,
				nodes: nodes,
				controller: {
					compoName: name,
					scope: scope,
					renderEnd: handler_proto_renderEnd,
					dispose: handler_proto_dispose
				}
			};
		}

		function createHandler(name, scope) {
			return {
				compoName: name,
				scope: scope,
				renderEnd: handler_proto_renderEnd,
				dispose: handler_proto_dispose
			}
		}

		function handler_proto_renderEnd(elements) {
			this.elements = elements;
		}
		function handler_proto_dispose() {
			if (this.elements)
				this.elements.length = 0;
		}


		var __ForDirective = [ 'prop1', 'prop2', 'in|of', 'expression' ],
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


	// end:source 2.for.js
	// source 3.each.js

	(function(){

		custom_Statements['each'] = {

			render: function(node, model, ctx, container, controller, children){

				var array = ExpressionUtil.eval(node.expression, model, ctx, controller);

				if (array == null)
					return;


				build(node.nodes, array, ctx, container, controller, children);
			},
			createItem: createEachItem,
			build: build
		};

		function build(template, array, ctx, container, controller, children){
			var imax = array.length,
				i = -1,
				nodes = template,
				itemCtr;

			while ( ++i < imax ){

				itemCtr = createEachItem(i, nodes, controller);
				builder_build(nodes, array[i], ctx, container, itemCtr, children);

				if (itemCtr.components != null) {
					var compos = controller.components;
					if (compos == null)
						compos = controller.components = [];

					arr_pushMany(controller.components, itemCtr.components);
				}
			}

		}

		function createEachItem(index, nodes, parent) {

			return {
				type: Dom.COMPONENT,
				compoName: 'each::item',
				scope: {
					index: index
				},
				parent: parent,
				nodes: nodes,
				model: null,
				attr: null,
				components: null,
				elements: null,
				ID: null
			};
		}

	}());

	// end:source 3.each.js
	// source 4.with.js

	custom_Statements['with'] = {
		render: function(node, model, ctx, container, controller, childs){

			var obj = ExpressionUtil.eval(node.expression, model, ctx, controller);


			builder_build(node.nodes, obj, ctx, container, controller, childs);
		}
	};
	// end:source 4.with.js
	// source 5.switch.js
	(function(){
		var eval_ = ExpressionUtil.eval;

		custom_Statements['switch'] = {
			render: function(node, model, ctx, container, controller, childs){

				var value = eval_(node.expression, model, ctx, controller),
					nodes = getNodes(value, node.nodes, model, ctx, controller);
				if (nodes == null)
					return;


				builder_build(nodes, model, ctx, container, controller, childs);
			},

			getNodes: getNodes
		};


		function getNodes(value, nodes, model, ctx, controller) {
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
				if (eval_(expr, model, ctx, controller) == value) {
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


	// end:source 5.switch.js
	// source 6.include.js
	(function(){

		custom_Statements['include'] = {

			render: function(node, model, ctx, container, controller, childs){

				var arguments_ = ExpressionUtil.evalStatements(node.expression);

				var resource;

				while(controller != null){

					resource = controller.resource;
					if (resource != null)
						break;

					controller = controller.parent;
				}

				var ctr = new IncludeController(controller),
					resume = Compo.pause(ctr, ctx);



				include
					.instance(resource && resource.url)
					.load
					.apply(resource, arguments_)
					.done(function(resp){

						ctr.templates = resp.load;

						builder_build(
							node.nodes,
							model,
							ctx,
							container,
							ctr,
							childs);

						resume();
					});
			}
		};

		function IncludeController(parent){

			this.parent = parent;
			this.compoName = 'include';
			this.components = [];
			this.templates = null;
		}

	}());


	// end:source 6.include.js
	// source 7.import.js


	custom_Statements['import'] = {
		render: function(node, model, ctx, container, controller, childs){

			var expr = node.expression,
				args = ExpressionUtil.evalStatements(expr, model, ctx, controller),
				name = args[0]
				;
			if (typeof name !== 'string') {
				log_error('<mask:import> Invalid argument', expr);
				return;
			}

			while (true) {

				if (controller.compoName === 'include')
					break;

				controller = controller.parent;

				if (controller == null)
					break;
			}



			if (controller == null)
				return;

			var nodes = controller.templates[name];
			if (nodes == null)
				return;

			builder_build(Parser.parse(nodes), model, ctx, container, controller, childs);
		}
	};
	// end:source 7.import.js
	// source 8.var.js
	custom_Tags['var'] = VarStatement;

	function VarStatement(){}

	VarStatement.prototype = {
		renderStart: function(model, ctx){
			var parent = this.parent,
				scope = parent.scope,
				key, val;

			if (scope == null)
				scope = parent.scope = {};

			this.model = {};
			for(key in this.attr){
				val = ExpressionUtil.eval(this.attr[key], model, ctx, parent);
				this.model[key] = scope[key] = val;
			}
			this.attr = {};
		},
		onRenderStartClient: function(){
			var parent = this.parent,
				scope = parent.scope;
			if (scope == null)
				scope = parent.scope = {};

			for(var key in this.model){
				scope[key] = this.model[key];
			}
		}
	};
	// end:source 8.var.js
	// source 9.visible.js
	(function(){
		custom_Statements['visible'] = {
			toggle: toggle,
			render: function(node, model, ctx, container, ctr, children){
				var els = [];
				builder_build(node.nodes, model, ctx, container, ctr, els);
				arr_pushMany(children, els)

				var visible = ExpressionUtil.eval(node.expression, model, ctx, ctr);
				toggle(els, visible);
			}
		};
		function toggle(els, visible){
			for(var i = 0; i < els.length; i++){
				els[i].style.display = visible ? '' : 'none';
			}
		}
	}());

	// end:source 9.visible.js
	// end:source /src/statements/exports.js


	// source /src/parse/parser.js
	var parser_parse,
		parser_ensureTemplateFunction,
		parser_setInterpolationQuotes,
		parser_cleanObject,


		// deprecate
		Parser
		;

	(function(Node, TextNode, Fragment, Component) {

		var interp_START = '~',
			interp_OPEN = '[',
			interp_CLOSE = ']',

			// ~
			interp_code_START = 126,
			// [
			interp_code_OPEN = 91,
			// ]
			interp_code_CLOSE = 93,

			_serialize;

		// source ./cursor.js
		var cursor_groupEnd,
			cursor_quoteEnd,
			cursor_refEnd
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
			}

			cursor_quoteEnd = function(str, i, imax, char_){
				var start = i;
				while ((i = str.indexOf(char_, i)) !== -1) {
					if (str.charCodeAt(i - 1) !== 92)
						// \
						return i;
					i++;
				}
				parser_warn('Quote was not closed', str, start);
				return imax;
			};

		}());
		// end:source ./cursor.js
		// source ./parsers/var.js
		var parser_var;
		(function(){
			parser_var = function(template, index, length, parent){
				var node = new Node('var', parent),
					start,
					c;

				node.stringify = stingify;
				var go_varName = 1,
					go_assign = 2,
					go_value = 3,
					go_next = 4,
					state = go_varName,
					token,
					key;
				while(true) {
					if (index < length && (c = template.charCodeAt(index)) < 33) {
						index++;
						continue;
					}

					if (state === go_varName) {
						start = index;
						index = cursor_refEnd(template, index, length);
						key = template.substring(start, index);
						state = go_assign;
						continue;
					}

					if (state === go_assign) {
						if (c !== 61 ) {
							// =
							parser_error(
								'Assignment expected'
								, template
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
								index = cursor_groupEnd(template, index, length, c, c + 2);
								break;
							case 39:
							case 34:
								// ' "
								index = cursor_quoteEnd(template, index, length, c === 39 ? "'" : '"')
								break;
							default:
								while (index < length) {
									c = template.charCodeAt(index);
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
						node.attr[key] = template.substring(start, index);
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
				return [node, index];
			};

			function stingify(){
				var attr = this.attr;
				var str = 'var ';
				for(var key in attr){
					if (str !== 'var ')
						str += ',';

					str += key + '=' + attr[key];
				}
				return str + ';';
			}
		}());
		// end:source ./parsers/var.js

		function ensureTemplateFunction(template) {
			var index = -1;

			/*
			 * - single char indexOf is much faster then '~[' search
			 * - function is divided in 2 parts: interpolation start lookup/ interpolation parse
			 * for better performance
			 */
			while ((index = template.indexOf(interp_START, index)) !== -1) {
				if (template.charCodeAt(index + 1) === interp_code_OPEN)
					break;

				index++;
			}

			if (index === -1)
				return template;

			var length = template.length,
				array = [],
				lastIndex = 0,
				i = 0,
				end;


			while (true) {
				end = cursor_groupEnd(
					template
					, index + 2
					, length
					, interp_code_OPEN
					, interp_code_CLOSE
				);
				if (end === -1)
					break;

				array[i++] = lastIndex === index
					? ''
					: template.substring(lastIndex, index);
				array[i++] = template.substring(index + 2, end);

				lastIndex = index = end + 1;

				while ((index = template.indexOf(interp_START, index)) !== -1) {
					if (template.charCodeAt(index + 1) === interp_code_OPEN)
						break;

					index++;
				}
				if (index === -1)
					break;
			}

			if (lastIndex < length)
				array[i] = template.substring(lastIndex);


			template = null;
			return function(type, model, ctx, element, controller, name) {
				if (type == null) {
					// http://jsperf.com/arguments-length-vs-null-check
					// this should be used to stringify parsed MaskDOM
					var string = '',
						imax = array.length,
						i = -1,
						x;
					while ( ++i < imax) {
						x = array[i];

						string += i % 2 === 1
							? interp_START
								+ interp_OPEN
								+ x
								+ interp_CLOSE
							: x
							;
					}
					return string;
				}

				return util_interpolate(
					array
					, type
					, model
					, ctx
					, element
					, controller
					, name);
			};
		}

		var go_tag = 2,
			state_tag = 3,
			state_attr = 5,
			go_attrVal = 6,
			go_attrHeadVal = 7,
			state_literal = 8,
			go_up = 9
			;


		Parser = {

			/** @out : nodes */
			parse: function(template) {

				//_serialize = T.serialize;

				var current = new Fragment(),
					fragment = current,
					state = go_tag,
					last = state_tag,
					index = 0,
					length = template.length,
					classNames,
					token,
					key,
					value,
					next,
					//-next_Type,
					c, // charCode
					start,
					nextC;




				outer: while (true) {

					if (index < length && (c = template.charCodeAt(index)) < 33) {
						index++;
						continue;
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
								log_warn('<mask:parse> block comment has no end');
								// endif
								index = length;
							}


							continue;
						}
					}

					if (last === state_attr) {
						if (classNames != null) {
							current.attr['class'] = ensureTemplateFunction(classNames);
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

							if ('var' === token) {
								var tuple = parser_var(template, index, length, current);
								current.appendChild(tuple[0]);
								index = tuple[1];
								state = go_tag;
								token = null;
								continue;
							}

							next = new Node(token, current);

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
								current.attr['class'] = ensureTemplateFunction(classNames);
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

						// skip ; , when node is not a single tag (else goto 125)
						if (current.nodes != null) {
							index++;
							continue;
						}

						/* falls through */
					case 125:
						// ;}

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
							parser_warn('Literal has no ending', template, start);
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

						token = template.substring(start, index);
						if (isEscaped === true) {
							token = token.replace(__rgxEscapedChar[_char], _char);
						}

						if (state !== state_attr || key !== 'class')
							token = ensureTemplateFunction(token);

						index += isUnescapedBlock ? 3 : 1;
						continue;
					}


					if (state === go_tag) {
						last = state_tag;
						state = state_tag;
						//next_Type = Dom.NODE;

						if (c === 46 /* . */ || c === 35 /* # */ ) {
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

					var isInterpolated = null;

					start = index;
					while (index < length) {

						c = template.charCodeAt(index);

						if (c === interp_code_START && template.charCodeAt(index + 1) === interp_code_OPEN) {
							isInterpolated = true;
							++index;
							do {
								// goto end of template declaration
								c = template.charCodeAt(++index);
							}
							while (c !== interp_code_CLOSE && index < length);
						}

						// if DEBUG
						if (c === 0x0027 || c === 0x0022 || c === 0x002F || c === 0x003C || c === 0x002C) {
							// '"/<,
							parser_warn('', template, index, c, state);
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
								token = ensureTemplateFunction(token);
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
					current.nodes != null) {
					parser_warn('Tag was not closed: ' + current.parent.tagName, template)
				}
				// endif


				var nodes = fragment.nodes;
				return nodes != null && nodes.length === 1
					? nodes[0]
					: fragment
					;
			},

			// obsolete
			cleanObject: function(obj) {
				if (obj instanceof Array) {
					for (var i = 0; i < obj.length; i++) {
						this.cleanObject(obj[i]);
					}
					return obj;
				}
				delete obj.parent;
				delete obj.__single;

				if (obj.nodes != null) {
					this.cleanObject(obj.nodes);
				}

				return obj;
			},
			setInterpolationQuotes: function(start, end) {
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
			},

			ensureTemplateFunction: ensureTemplateFunction
		};

		// = exports

		parser_parse = Parser.parse;
		parser_ensureTemplateFunction = Parser.ensureTemplateFunction;
		parser_cleanObject = Parser.cleanObject;
		parser_setInterpolationQuotes = Parser.setInterpolationQuotes;

	}(Dom.Node, Dom.TextNode, Dom.Fragment, Dom.Component));

	// end:source /src/parse/parser.js
	// source /src/build/builder.dom.js
	var builder_componentID = 0,

		builder_build;

	(function(custom_Attributes, custom_Tags, Component){



		// source util.js
		function build_resumeDelegate(controller, model, ctx, container, children){
			var anchor = container.appendChild(document.createComment(''));

			return function(){
				return build_resumeController(controller, model, ctx, anchor, children);
			};
		}
		function build_resumeController(ctr, model, ctx, anchor, children) {

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

				anchor.parentNode.insertBefore(fragment, anchor);
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
						attrFn(anchor, ctr.attr[key], model, ctx, elements[0], ctr);
					}
				}
			}

			if (is_Function(ctr.renderEnd)) {
				ctr.renderEnd(elements, model, ctx, anchor.parentNode);
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
		// end:source util.js
		// source util.controller.js
		function controller_pushCompo(ctr, compo) {
			var compos = ctr.components;
			if (compos == null) {
				ctr.components = [ compo ];
				return;
			}
			compos.push(compo);
		}
		// end:source util.controller.js

		// source type.textNode.js

		var build_textNode = (function(){

			var append_textNode = (function(document){

				return function(element, text){
					element.appendChild(document.createTextNode(text));
				};

			}(document));

			return function build_textNode(node, model, ctx, container, controller) {

				var content = node.content;


				if (is_Function(content)) {

					var result = content('node', model, ctx, container, controller);

					if (typeof result === 'string') {

						append_textNode(container, result);
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
								append_textNode(container, text);
								text = '';
							}
							if (x.nodeType == null) {
								text += x.toString();
								continue;
							}
							container.appendChild(x);
							continue;
						}

						text += x;
					}

					if (text !== '') {
						append_textNode(container, text);
					}

					return;
				}

				append_textNode(container, content);
			}
		}());
		// end:source type.textNode.js
		// source type.node.js

		var build_node = (function(){

			var el_create = (function(doc){
				return function(name){

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

			return function build_node(node, model, ctx, container, controller, childs){

				var tagName = node.tagName,
					attr = node.attr;

				var tag = el_create(tagName);
				if (tag == null)
					return;

				if (childs != null){
					childs.push(tag);
					attr['x-compo-id'] = controller.ID;
				}

				// ++ insert tag into container before setting attributes, so that in any
				// custom util parentNode is available. This is for mask.node important
				// http://jsperf.com/setattribute-before-after-dom-insertion/2
				if (container != null) {
					container.appendChild(tag);
				}

				var key,
					value;
				for (key in attr) {

					/* if !SAFE
					if (_Object_hasOwnProp.call(attr, key) === false) {
						continue;
					}
					*/

					if (is_Function(attr[key])) {
						value = attr[key]('attr', model, ctx, tag, controller, key);
						if (value instanceof Array) {
							value = value.join('');
						}

					} else {
						value = attr[key];
					}

					// null or empty string will not be handled
					if (value) {
						if (is_Function(custom_Attributes[key])) {
							custom_Attributes[key](node, value, model, ctx, tag, controller, container);
						} else {
							tag.setAttribute(key, value);
						}
					}
				}

				return tag;
			}

		}());
		// end:source type.node.js
		// source type.component.js
		var build_compo;

		(function(){


			build_compo = function(node, model, ctx, container, controller, childs){

				var compoName = node.tagName,
					Handler;

				if (node.controller != null)
					Handler = node.controller;

				if (Handler == null)
					Handler = custom_Tags[compoName];

				if (Handler == null)
					return build_NodeAsCompo(node, model, ctx, container, controller, childs);


				var isStatic = false,
					handler, attr, key;

				if (typeof Handler === 'function') {
					handler = new Handler(model);
				} else{
					handler = Handler;
					isStatic = true;
				}

				var fn = isStatic
					? build_Static
					: build_Component
					;

				return fn(handler, node, model, ctx, container, controller, childs);
			}


			// PRIVATE

			function build_Component(compo, node, model, ctx, container, controller, childs){

				var attr, key;

				compo.compoName = node.tagName;
				compo.attr = attr = attr_extend(compo.attr, node.attr);
				compo.parent = controller;
				compo.ID = ++builder_componentID;
				compo.expression = node.expression;

				if (compo.model == null)
					compo.model = model;

				if (compo.nodes == null)
					compo.nodes = node.nodes;

				for (key in attr) {
					if (typeof attr[key] === 'function')
						attr[key] = attr[key]('attr', model, ctx, container, controller, key);
				}


				listeners_emit(
					'compoCreated'
					, compo
					, model
					, ctx
					, container);


				if (is_Function(compo.renderStart))
					compo.renderStart(model, ctx, container);


				controller_pushCompo(controller, compo);

				if (compo.async === true) {
					compo.await(build_resumeDelegate(compo, model, ctx, container, childs));
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

				if (Ctor) {
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

				if (is_Function(clone.renderStart))
					clone.renderStart(model, ctx, container, ctr, children);

				controller_pushCompo(ctr, clone);

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
						}
					}
				}

				return wasRendered
					? null
					: clone
					;

			}


			function build_NodeAsCompo(node, model, ctx, container, controller, childs){
				node.ID = ++builder_componentID;

				controller_pushCompo(controller, node);

				if (node.model == null)
					node.model = model;

				var els = node.elements = [];
				builder_build(node.nodes, node.model, ctx, container, node, els);

				if (childs != null && els.length !== 0)
					arr_pushMany(childs, els);

				return null;
			}

		}());

		// end:source type.component.js


		builder_build = function(node, model, ctx, container, controller, childs) {

			if (node == null)
				return container;

			var type = node.type,
				elements,
				key,
				value,
				j, jmax;

			if (controller == null)
				controller = new Component();

			if (type == null){
				// in case if node was added manually, but type was not set

				if (node instanceof Array) {
					type = 10
				}
				else if (node.tagName != null){
					type = 1;
				}
				else if (node.content != null){
					type = 2;
				}
			}

			if (type === 1 && custom_Tags[node.tagName] != null) {
				// check if the tag name was overriden
				type = 4;
			}

			if (container == null && type !== 1)
				container = document.createDocumentFragment();


			// Dom.TEXTNODE
			if (type === 2) {

				build_textNode(node, model, ctx, container, controller);
				return container;
			}

			// Dom.SET
			if (type === 10) {

				j = 0;
				jmax = node.length;

				for(; j < jmax; j++) {
					builder_build(node[j], model, ctx, container, controller, childs);
				}
				return container;
			}

			var tagName = node.tagName;
			if (tagName === 'else')
				return container;

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

					Handler.render(node, model, ctx, container, controller, childs);
					return container;
				}
			}

			// Dom.NODE
			if (type === 1) {
				container = build_node(node, model, ctx, container, controller, childs);
				childs = null;
			}

			// Dom.COMPONENT
			if (type === 4) {

				controller = build_compo(node, model, ctx, container, controller, childs);

				if (controller == null)
					return container;

				elements = [];
				node = controller;

				if (controller.model !== model && controller.model != null)
					model = controller.model;

			}

			var nodes = node.nodes;
			if (nodes != null) {

				if (childs != null && elements == null)
					elements = childs;

				var isarray = nodes instanceof Array,
					length = isarray === true ? nodes.length : 1,
					i = 0,
					childNode = null;

				for (; i < length; i++) {
					childNode = isarray === true
						? nodes[i]
						: nodes;

					builder_build(childNode, model, ctx, container, controller, elements);
				}

			}

			if (type === 4) {

				// use or override custom attr handlers
				// in Compo.handlers.attr object
				// but only on a component, not a tag controller
				if (node.tagName == null && node.compoName !== '%') {
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
							attrFn(node, val, model, ctx, elements[0], controller);
					}
				}

				if (is_Function(node.renderEnd))
					node.renderEnd(elements, model, ctx, container);
			}

			if (childs != null && elements != null && childs !== elements)
				arr_pushMany(childs, elements);

			return container;
		};



	}(custom_Attributes, custom_Tags, Dom.Component));
	// end:source /src/build/builder.dom.js

	/* Features */
	// source /src/feature/run.js
	var mask_run;

	(function(){
		mask_run = function(){
			var args = _Array_slice.call(arguments),
				container,
				model,
				Ctr,
				imax,
				i,
				mix;

			imax = args.length;
			i = -1;
			while ( ++i < imax ) {
				mix = args[i];
				if (mix instanceof Node) {
					container = mix;
					continue;
				}
				if (is_Function(mix)) {
					Ctr = mix;
					continue;
				}
				if (is_Object(mix)) {
					model = mix;
					continue;
				}
			}

			if (container == null)
				container = document.body;

			var controller = is_Function(Ctr)
				? new Ctr
				: new Compo
				;
			controller.ID = ++builder_componentID;

			var scripts = document.getElementsByTagName('script'),
				script,
				found = false;

			imax = scripts.length;
			i = -1;
			while( ++i < imax ){
				script = scripts[i];
				if (script.getAttribute('type') !== 'text/mask')
					continue;
				if (script.getAttribute('data-run') !== 'true')
					continue;

				var fragment = builder_build(
					parser_parse(script.textContent), model, {}, null, controller
				);
				script.parentNode.insertBefore(fragment, script);
				found = true;
			}
			if (found === false) {
				log_warn("No blocks found: <script type='text/mask' data-run='true'>...</script>");
			}
			if (is_Function(controller.renderEnd)) {
				controller.renderEnd(container, model);
			}
			Compo.signal.emitIn(controller, 'domInsert');
			return controller;
		};
	}());
	// end:source /src/feature/run.js
	// source /src/feature/merge.js
	var mask_merge;
	(function(){

		mask_merge = function(a, b, owner){
			if (typeof a === 'string')
				a = parser_parse(a);
			if (typeof b === 'string')
				b = parser_parse(b);

			var contents = _getContents(b, b, new Contents);
			return _merge(a, contents, owner);
		};

		var tag_ELSE = '@else',
			tag_IF = '@if',
			tag_EACH = '@each',
			tag_PLACEHOLDER = '@placeholder',

			dom_NODE = Dom.NODE,
			dom_TEXTNODE = Dom.TEXTNODE,
			dom_FRAGMENT = Dom.FRAGMENT,
			dom_STATEMENT = Dom.STATEMENT
			;

		function _merge(node, contents, tmplNode, clonedParent){
			if (node == null)
				return null;

			if (is_Array(node))
				return _mergeArray(node, contents, tmplNode, clonedParent);

			switch(node.type){
				case dom_TEXTNODE:
					return _cloneTextNode(node, contents, tmplNode);
				case dom_NODE:
				case dom_STATEMENT:
					return _mergeNode(node, contents, tmplNode, clonedParent);
				case dom_FRAGMENT:
					return _mergeArray(node.nodes, contents, tmplNode, clonedParent);
			}
			log_warn('Uknown type', node.type);
			return null;
		}
		function _mergeArray(nodes, contents, tmplNode, clonedParent){
			var fragment = new Dom.Fragment,
				imax = nodes.length,
				i = -1,
				x, node;
			while( ++i < imax ) {
				node = nodes[i];

				if (node.tagName === tag_ELSE) {
					// check previous
					if (x != null)
						continue;

					if (node.expression && !eval_(node.expression, contents, tmplNode))
						continue;

					x = _merge(nodes[i].nodes, contents, tmplNode, clonedParent)
				}
				else {
					x = _merge(node, contents, tmplNode, clonedParent);
				}

				appendAny(fragment, x);
			}
			return fragment;
		}
		function _mergeNode(node, contents, tmplNode, clonedParent){
			var tagName = node.tagName;
			if (tagName.charCodeAt(0) !== 64) {
				// @
				return _cloneNode(node, contents, tmplNode, clonedParent);
			}

			var id = node.attr.id;
			if (tagName === tag_PLACEHOLDER && id == null)
				return tmplNode.nodes;

			if (tag_EACH === tagName) {
				var arr = contents[node.expression],
					x;
				if (arr == null) {
					log_error('No template node: @' + node.expression);
					return null;
				}
				if (is_Array(arr) === false) {
					x = arr;
					return _merge(
						node.nodes
						, _getContents(x.nodes, x.nodes, new Contents(contents))
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
						, _getContents(x.nodes, x.nodes, new Contents(contents))
						, x
						, clonedParent
					));
				}
				return fragment;
			}
			if (tag_IF === tagName) {
				var val = eval_(node.expression, contents, tmplNode);
				return val
					? _merge(node.nodes, contents, tmplNode, clonedParent)
					: null
					;
			}

			if (id == null)
				id = tagName.substring(1);

			var content = contents.$getNode(id);
			if (content == null)
				return null;

			if (content.parent)
				_modifyParents(clonedParent, content.parent);


			var contentNodes = content.nodes,
				wrapperNode;
			if (node.attr.as !== void 0) {
				var tagName_ = node.attr.as;
				wrapperNode = {
					type: dom_NODE,
					tagName: tagName_,
					attr: _mergeAttr(node.attr, content.attr, contents, tmplNode),
					parent: clonedParent,
					nodes: contentNodes
				};
				wrapperNode.attr.as = null;
			}

			if (node.nodes == null)
				return wrapperNode || contentNodes;

			var nodes =  _merge(
				node.nodes
				, _getContents(contentNodes, contentNodes, new Contents(contents))
				, content
				, wrapperNode || clonedParent
			);
			if (wrapperNode != null) {
				wrapperNode.nodes = nodes;
				return wrapperNode;
			}
			return nodes;
		}
		function _mergeAttr(a, b, contents, tmplNode){
			if (a == null || b == null)
				return a || b;

			var out = interpolate_obj_(a, contents, tmplNode);
			for (var key in b){
				out[key] = interpolate_str_(b[key], contents, tmplNode);
			}
			return out;
		}

		function _cloneNode(node, contents, tmplNode, clonedParent){
			var tagName = node.tagName || node.compoName;
			if (':template' === tagName) {
				var id = interpolate_str_(node.attr.id, contents, tmplNode);
				Mask.templates.register(id, node.nodes);
				return null;
			}
			if (':import' === tagName) {
				var id = interpolate_str_(node.attr.id, contents, tmplNode),
					nodes = Mask.templates.resolve(node, id);
				return _merge(nodes, contents, tmplNode, clonedParent);
			}
			var outnode = {
				type: node.type,
				tagName: tagName,
				attr: interpolate_obj_(node.attr, contents, tmplNode),
				expression: interpolate_str_(node.expression, contents, tmplNode),
				controller: node.controller,
				parent: clonedParent
			};
			if (node.nodes)
				outnode.nodes = _merge(node.nodes, contents, tmplNode, outnode);

			return outnode;
		}
		function _cloneTextNode(node, contents, tmplNode, clonedParent){
			return {
				type: node.type,
				content: interpolate_str_(node.content, contents, tmplNode),
				parent: clonedParent
			};
		}
		function interpolate_obj_(obj, contents, node){
			var clone = _Object_create(obj),
				x;
			for(var key in clone){
				x = clone[key];
				if (x == null)
					continue;

				clone[key] = interpolate_str_(x, contents, node);
			}
			return clone;
		}
		function interpolate_str_(mix, contents, node){
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
					x = fn(expr, contents, node);

				if (x != null)
					result += x;

				// tail
				last = isBlockEntry ? (index + 1): index;
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
		function interpolate_(path, contents, node) {
			var index = path.indexOf('.');
			if (index === -1) {
				log_warn('Merge templates. Accessing node', path);
				return '';
			}
			var tagName = path.substring(0, index),
				id = tagName.substring(1),
				property = path.substring(index + 1),
				obj = null;

			if (node != null) {
				if (tagName === '@attr')
					obj = node.attr;
				else if (tagName === node.tagName)
					obj = node;
			}

			if (obj == null)
				obj = contents.$getNode(id);

			if (obj == null) {
				log_error('Merge templates. Node not found', tagName);
				return '';
			}
			return obj_getProperty(obj, property);
		}

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
			node.appendChild(mix);
		}

		var RESERVED = ' else placeholder each attr if parent scope'
		function _getContents(b, node, contents) {
			if (node == null)
				return contents;

			if (is_Array(node)) {
				var imax = node.length,
					i = -1;
				while( ++i < imax ){
					_getContents(node === b ? node[i] : b, node[i], contents);
				}
				return contents;
			}

			var type = node.type;
			if (type === dom_TEXTNODE)
				return contents;

			if (type === dom_NODE) {
				var tagName = node.tagName;
				if (tagName != null && tagName.charCodeAt(0) === 64) {
					// @
					var id = tagName.substring(1);
					// if DEBUG
					if (RESERVED.indexOf(' ' + id + ' ') !== -1)
						log_error('MaskMerge. Reserved Name', id);
					// endif
					var x = {
						tagName: node.tagName,
						parent: _getParentModifiers(b, node),
						nodes: node.nodes,
						attr: node.attr,
						expression: node.expression
					};
					if (contents[id] == null) {
						contents[id] = x;
					} else {
						var current = contents[id];
						if (is_Array(current)) {
							current.push(x);
						}
						else {
							contents[id] = [current, x];
						}
					}
					return contents;
				}
			}
			return _getContents(b, node.nodes, contents);
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

		function eval_(expr, contents, tmplNode) {
			if (tmplNode)
				contents.attr = tmplNode.attr;

			return ExpressionUtil.eval(expr, contents, null, contents);
		}
		function Contents(parent){
			this.scope = this;
			this.parent = parent;
		}
		Contents.prototype = {
			parent: null,
			attr: null,
			scope: null,
			$getNode: function(id){
				var ctx = this, node;
				while(ctx != null){
					node = ctx[id];
					if (node != null)
						return node;
					ctx = ctx.parent;
				}
			}
		};

	}());
	// end:source /src/feature/merge.js

	// source /src/mask.js

	/**
	 *  mask
	 *
	 **/

	var cache = {},
		Mask = {

			/**
			 *	mask.render(template[, model, ctx, container = DocumentFragment, controller]) -> container
			 * - template (String | MaskDOM): Mask String or Mask DOM Json template to render from.
			 * - model (Object): template values
			 * - ctx (Object): can store any additional information, that custom handler may need,
			 * this object stays untouched and is passed to all custom handlers
			 * - container (IAppendChild): container where template is rendered into
			 * - controller (Object): instance of an controller that own this template
			 *
			 *	Create new Document Fragment from template or append rendered template to container
			 **/
			render: function (template, model, ctx, container, controller) {

				// if DEBUG
				if (container != null && typeof container.appendChild !== 'function'){
					log_error('.render(template[, model, ctx, container, controller]', 'Container should implement .appendChild method');
					log_warn('Args:', arguments);
				}
				// endif

				if (typeof template === 'string') {
					if (_Object_hasOwnProp.call(cache, template)){
						/* if Object doesnt contains property that check is faster
						then "!=null" http://jsperf.com/not-in-vs-null/2 */
						template = cache[template];
					}else{
						template = cache[template] = parser_parse(template);
					}
				}
				if (ctx == null)
					ctx = {};

				return builder_build(template, model, ctx, container, controller);
			},

			/* deprecated, renamed to parse */
			compile: parser_parse,

			/**
			 *	mask.parse(template) -> MaskDOM
			 * - template (String): string to be parsed into MaskDOM
			 *
			 * Create MaskDOM from Mask markup
			 **/
			parse: parser_parse,

			build: builder_build,

			/*
			 * - ?model:Object
			 * - ?Controller: Function
			 * - ?container: Node (@default: body)
			 */
			run: mask_run,


			/*
			 * - aTmpl: Mask Template
			 * - bTmpl: Mask Template
			 *
			 * @returns New joined mask template
			 */
			merge: mask_merge,

			/**
			 * mask.registerHandler(tagName, tagHandler) -> void
			 * - tagName (String): Any tag name. Good practice for custom handlers it when its name begins with ':'
			 * - tagHandler (Function|Object):
			 *
			 *	When Mask.Builder matches the tag binded to this tagHandler, it -
			 *	creates instances of the class(in case of Function) or uses specified object.
			 *	Shallow copies -
			 *		.nodes(MaskDOM) - Template Object of this node
			 *		.attr(Object) - Attributes of this node
			 *	And calls
			 *		.renderStart(model, ctx, container)
			 *		.renderEnd(elements, model, ctx, container)
			 *
			 *	Custom Handler now can handle rendering of underlined nodes.
			 *	The most simple example to continue rendering is:
			 *	mask.render(this.nodes, model, container, ctx);
			 **/
			registerHandler: customTag_register,
			/**
			 *	mask.getHandler(tagName) -> Function | Object
			 * - tagName (String):
			 *
			 *	Get Registered Handler
			 **/
			getHandler: function (tagName) {
				return tagName != null
					? custom_Tags[tagName]
					: custom_Tags
					;
			},

			registerStatement: function(name, handler){
				//@TODO should it be not allowed to override system statements, if, switch?

				custom_Statements[name] = is_Function(handler)
					? { render: handler }
					: handler
					;
			},

			getStatement: function(name){
				return name != null
					? custom_Statements[name]
					: custom_Statements
					;
			},

			/**
			 * mask.registerAttrHandler(attrName, mix, Handler) -> void
			 * - attrName (String): any attribute string name
			 * - mix (String | Function): Render Mode or Handler Function if 'both'
			 * - Handler (Function)
			 *
			 * Handler Interface, <i>(similar to Utility Interface)</i>
			 * ``` customAttribute(maskNode, attributeValue, model, ctx, element, controller) ```
			 *
			 * You can change do any changes to maskNode's template, current element value,
			 * controller, model.
			 *
			 * Note: Attribute wont be set to an element.
			 **/
			registerAttrHandler: function(attrName, mix, Handler){
				if (is_Function(mix)) {
					Handler = mix;
				}

				custom_Attributes[attrName] = Handler;
			},

			getAttrHandler: function(attrName){
				return attrName != null
					? custom_Attributes[attrName]
					: custom_Attributes;
			},
			/**
			 *	mask.registerUtil(utilName, mix) -> void
			 * - utilName (String): name of the utility
			 * - mix (Function, Object): Util Handler
			 *
			 *	Register Util Handler. Template Example: '~[myUtil: value]'
			 *
			 *	Function interface:
			 *	```
			 *	function(expr, model, ctx, element, controller, attrName, type);
			 *	```
			 *
			 *	- value (String): string from interpolation part after util definition
			 *	- model (Object): current Model
			 *	- type (String): 'attr' or 'node' - tells if interpolation is in TEXTNODE value or Attribute
			 *	- ctx (Object): Context Object
			 *	- element (HTMLNode): current html node
			 *	- name (String): If interpolation is in node attribute, then this will contain attribute name
			 *
			 *  Object interface:
			 *  ```
			 *  {
			 *  	nodeRenderStart: function(expr, model, ctx, element, controller){}
			 *  	node: function(expr, model, ctx, element, controller){}
			 *
			 *  	attrRenderStart: function(expr, model, ctx, element, controller, attrName){}
			 *  	attr: function(expr, model, ctx, element, controller, attrName){}
			 *  }
			 *  ```
			 *
			 *	This diff nodeRenderStart/node is needed to seperate util logic.
			 *	Mask in node.js will call only node-/attrRenderStart,
			 *
			 **/

			registerUtil: customUtil_register,
			//////function(utilName, mix){
			//////	if (typeof mix === 'function') {
			//////		custom_Utils[utilName] = mix;
			//////		return;
			//////	}
			//////
			//////	if (typeof mix.process !== 'function') {
			//////		mix.process = function(expr, model, ctx, element, controller, attrName, type){
			//////			if ('node' === type) {
			//////
			//////				this.nodeRenderStart(expr, model, ctx, element, controller);
			//////				return this.node(expr, model, ctx, element, controller);
			//////			}
			//////
			//////			// asume 'attr'
			//////
			//////			this.attrRenderStart(expr, model, ctx, element, controller, attrName);
			//////			return this.attr(expr, model, ctx, element, controller, attrName);
			//////		};
			//////
			//////	}
			//////
			//////	custom_Utils[utilName] = mix;
			//////},

			getUtil: customUtil_get,
			//////function(util){
			//////	return util != null
			//////		? custom_Utils[util]
			//////		: custom_Utils;
			//////},

			$utils: customUtil_$utils,

			registerUtility: function (utilityName, fn) {
				// if DEBUG
				log_warn('@registerUtility - deprecated - use registerUtil(utilName, mix)', utilityName);
				// endif
				this.registerUtility = this.registerUtil;
				this.registerUtility(utilityName, fn);
			},

			getUtility: function(util){
				// if DEBUG
				log_warn('@getUtility - deprecated - use getUtil(utilName)', util);
				// endif
				this.getUtility = this.getUtil;

				return this.getUtility();
			},
			/**
			 * mask.clearCache([key]) -> void
			 * - key (String): template to remove from cache
			 *
			 *	Mask Caches all templates, so this function removes
			 *	one or all templates from cache
			 **/
			clearCache: function(key){
				if (typeof key === 'string'){
					delete cache[key];
				}else{
					cache = {};
				}
			},

			Utils: {

				/**
				 * mask.Util.Expression -> ExpressionUtil
				 *
				 * [[ExpressionUtil]]
				 **/
				Expression: ExpressionUtil,

				/**
				 *	mask.Util.getProperty(model, path) -> value
				 *	- model (Object | value)
				 *	- path (String): Property or dot chainable path to retrieve the value
				 *		if path is '.' returns model itself
				 *
				 *	```javascript
				 *	mask.render('span > ~[.]', 'Some string') // -> <span>Some string</span>
				 *	```
				 **/
				getProperty: obj_getProperty,

				ensureTmplFn: Parser.ensureTemplateFunction
			},
			Dom: Dom,
			plugin: function(source){
				eval(source);
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
			},

			on: listeners_on,
			off: listeners_off,

			/*
			 *	Stub for the reload.js, which will be used by includejs.autoreload
			 */
			delegateReload: function(){},

			/**
			 *	mask.setInterpolationQuotes(start,end) -> void
			 * -start (String): Must contain 2 Characters
			 * -end (String): Must contain 1 Character
			 *
			 * Starting from 0.6.9 mask uses ~[] for string interpolation.
			 * Old '#{}' was changed to '~[]', while template is already overloaded with #, { and } usage.
			 *
			 **/
			setInterpolationQuotes: Parser.setInterpolationQuotes,

			setCompoIndex: function(index){
				builder_componentID = index;
			},

			cfg: function(){
				var args = arguments;
				if (args.length === 0) {
					return __cfg;
				}

				var key, value;

				if (args.length === 2) {
					key = args[0];

					__cfg[key] = args[1];
					return;
				}

				var obj = args[0];
				if (typeof obj === 'object') {

					for (key in obj) {
						__cfg[key] = obj[key]
					}
				}
			}
		};


	/**	deprecated
	 *	mask.renderDom(template[, model, container, ctx]) -> container
	 *
	 * Use [[mask.render]] instead
	 * (to keep backwards compatiable)
	 **/
	Mask.renderDom = Mask.render;

	// end:source /src/mask.js

	// source /src/formatter/stringify.lib.js
	(function(mask){


		// source stringify.js

		var mask_stringify;

		(function() {


			//settings (Number | Object) - Indention Number (0 - for minification)
			mask_stringify = function(input, settings) {
				if (input == null)
					return '';

				if (typeof input === 'string')
					input = mask.parse(input);

				if (settings == null) {
					_indent = 0;
					_minimize = true;
				} else  if (typeof settings === 'number'){
					_indent = settings;
					_minimize = _indent === 0;
				} else{
					_indent = settings && settings.indent || 4;
					_minimize = _indent === 0 || settings && settings.minimizeAttributes;
				}

				return run(input);
			};


			var _minimize,
				_indent,
				Dom = mask.Dom;

			function doindent(count) {
				var output = '';
				while (count--) {
					output += ' ';
				}
				return output;
			}



			function run(node, indent, output) {
				var outer, i;

				if (indent == null)
					indent = 0;

				if (output == null) {
					outer = true;
					output = [];
				}

				var index = output.length;
				if (node.type === Dom.FRAGMENT)
					node = node.nodes;

				if (node instanceof Array) {
					for (i = 0; i < node.length; i++) {
						processNode(node[i], indent, output);
					}
				} else {
					processNode(node, indent, output);
				}


				var spaces = doindent(indent);
				for (i = index; i < output.length; i++) {
					output[i] = spaces + output[i];
				}

				if (outer)
					return output.join(_indent === 0 ? '' : '\n');
			}

			function processNode(node, currentIndent, output) {
				if (typeof node.stringify === 'function') {
					output.push(node.stringify(_minimize));
					return;
				}
				if (typeof node.content === 'string') {
					output.push(wrapString(node.content));
					return;
				}

				if (typeof node.content === 'function'){
					output.push(wrapString(node.content()));
					return;
				}

				if (isEmpty(node)) {
					output.push(processNodeHead(node) + ';');
					return;
				}

				if (isSingle(node)) {
					var next = _minimize ? '>' : ' > ';
					output.push(processNodeHead(node) + next);
					run(getSingle(node), _indent, output);
					return;
				}

				output.push(processNodeHead(node) + '{');
				run(node.nodes, _indent, output);
				output.push('}');
				return;
			}

			function processNodeHead(node) {
				var tagName = node.tagName,
					_id = node.attr.id || '',
					_class = node.attr['class'] || '';


				if (typeof _id === 'function')
					_id = _id();

				if (typeof _class === 'function')
					_class = _class();


				if (_id) {

					_id = _id.indexOf(' ') !== -1
						? ''
						: '#' + _id
						;
				}

				if (_class)
					_class = '.' + _class.split(' ').join('.');


				var attr = '';

				for (var key in node.attr) {
					if (key === 'id' || key === 'class') {
						// the properties was not deleted as this template can be used later
						continue;
					}
					var value = node.attr[key];

					if (typeof value === 'function')
						value = value();


					if (_minimize === false || /[^\w_$\-\.]/.test(value))
						value = wrapString(value);


					attr += ' ' + key;

					if (key !== value)
						attr += '=' + value;
				}

				if (tagName === 'div' && (_id || _class))
					tagName = '';

				var expr = '';
				if (node.expression)
					expr = '(' + node.expression + ')';

				return tagName
					+ _id
					+ _class
					+ attr
					+ expr;
			}


			function isEmpty(node) {
				return node.nodes == null || (node.nodes instanceof Array && node.nodes.length === 0);
			}

			function isSingle(node) {
				return node.nodes && (node.nodes instanceof Array === false || node.nodes.length === 1);
			}

			function getSingle(node) {
				if (node.nodes instanceof Array)
					return node.nodes[0];

				return node.nodes;
			}

			function wrapString(str) {

				if (str.indexOf("'") === -1)
					return "'" + str.trim() + "'";

				if (str.indexOf('"') === -1)
					return '"' + str.trim() + '"';


				return '"' + str.replace(/"/g, '\\"').trim() + '"';
			}


		}());

		// end:source stringify.js

		mask.stringify = mask_stringify;

	}(Mask));

	// end:source /src/formatter/stringify.lib.js

	/* Handlers */
	// source /src/handlers/html.js
	(function() {
		Mask.registerHandler(':html', {
			$meta: {
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
						frag = document.createDocumentFragment(),
						child;
					div.innerHTML = this.html;
					child = div.firstChild;
					while (child != null) {
						frag.appendChild(child);
						child = child.nextSibling;
					}
				}
			},
			toHtml: function(){
				return this.html || '';
			},
			html: null
		});
	}());

	// end:source /src/handlers/html.js
	// source /src/handlers/define.js
	(function(mask){

		custom_Tags['define']  = Define;

		function Define(){}
		Define.prototype = {
			$meta: {
				serializeNodes: true
			},
			render: define,
			onRenderStartClient: define
		};

		function define(){
			var name;
			for(name in this.attr) break;

			var nodes = this.nodes;
			mask.registerHandler(name, Compo({
				renderStart: function(){
					this.nodes = mask.merge(nodes, this.nodes || [], this);
				}
			}));
		}
	}(Mask));
	// end:source /src/handlers/define.js
	// source /src/handlers/template.js
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
						log_warn('`:template` must be define via id attr.');
						return;
					}
					templates_[id] = nodes;
				}
			};

		Mask.templates = helper_;
		Mask.registerHandler(':template', {
			render: function() {
				helper_.register(this.attr.id, this.nodes);
			}
		});

		Mask.registerHandler(':import', {
			renderStart: function() {
				var id = this.attr.id;
				if (id == null) {
					log_error('`:import` shoud reference the template via id attr')
					return;
				}
				this.nodes = helper_.resolve(this, id);
			}
		});
	}());
	// end:source /src/handlers/template.js
	// source /src/handlers/debug.js
	(function(){
		custom_Statements['log'] = {
			render: function(node, model, ctx, container, controller){
				var arr = ExpressionUtil.evalStatements(node.expression, model, ctx, controller);
				arr.unshift('Mask::Log');
				console.log.apply(console, arr);
			}
		};
		customTag_register('debugger', {
			render: function(model, ctx, container, compo){
				debugger;
			}
		});
	}());
	// end:source /src/handlers/debug.js

	/* Libraries */

	// source /ref-mask-compo/lib/compo.embed.js

	var Compo = exports.Compo = (function(mask){
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
		var find_findSingle;

		(function(){


			find_findSingle = function(node, matcher) {

				if (is_Array(node)) {

					var imax = node.length,
						i = -1,
						result;

					while( ++i < imax ){

						result = find_findSingle(node[i], matcher);

						if (result != null)
							return result;
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
			}


		}());

		// end:source ./traverse.js
		// source ./dom.js
		var dom_addEventListener,

			node_tryDispose,
			node_tryDisposeChildren
			;

		(function(){

			dom_addEventListener = function(element, event, listener) {

				if (EventDecorator != null)
					event = EventDecorator(event);

				// allows custom events - in x-signal, for example
				if (domLib != null)
					return domLib(element).on(event, listener);


				if (element.addEventListener != null)
					return element.addEventListener(event, listener, false);

				if (element.attachEvent)
					element.attachEvent('on' + event, listener);

			};

			node_tryDispose = function(node){
				if (node.hasAttribute('x-compo-id')) {

					var id = node.getAttribute('x-compo-id'),
						compo = Anchor.getByID(id)
						;

					if (compo) {

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

				var compos = compo.components,
					i = compos == null ? 0 : compos.length;
				while ( --i > -1 ) {
					compo_dispose(compos[i]);
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
				compo.nodes = mask.parse('.-mask-compo-errored > "~[.]"');
				compo.model = error.message || String(error);
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
				compo_meta_executeAttributeHandler = function(compo){
					var fn = compo.meta && compo.meta.handleAttributes;
					return fn == null ? true : fn(compo);
				};

				function _handleAll_Delegate(hash){
					return function(compo){
						var attr = compo.attr,
							key, fn, val, error;
						for(key in hash){
							fn    = hash[key];
							val   = attr[key];
							error = fn(compo, val);

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
						attrName = optional
							? metaKey.substring(1)
							: metaKey;

					var property = attrName.replace(/-(\w)/g, _toCamelCase_Replacer),
						fn = metaVal;

					if (typeof metaVal === 'string')
						fn = _ensureFns[metaVal];

					else if (metaVal instanceof RegExp)
						fn = _ensureFns_Delegate.regexp(metaVal);

					else if (typeof metaVal === 'function')
						fn = metaVal;

					else if (metaVal == null)
						fn = _ensureFns_Delegate.any();

					if (fn == null) {
						log_error('Function expected for the attr. handler', metaKey);
						return;
					}

					Proto[property] = null;
					Proto = null;
					hash [attrName] = function(compo, attrVal){
						if (attrVal == null)
							return optional ? null : Error('Expected');

						var val = fn.call(compo, attrVal, compo);
						if (val instanceof Error)
							return val;

						compo[property] = val;
						return null;
					};
				}

				function _toCamelCase_Replacer(full, char_){
					return char_.toUpperCase();
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
					'boolean': function(x){
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
					}
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
				return function CompoBase(){

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

					if (Ctor != null)
						Ctor.call(this);
				};
			};
		}());
		// end:source ./compo_create.js
		// source ./compo_inherit.js
		var compo_inherit;
		(function(mask_merge){

			compo_inherit = function(Proto, Extends){

				var imax = Extends.length,
					i = imax,
					ctors = [],
					x;
				while( --i > -1){
					x = Extends[i];
					if (typeof x === 'string')
						x = Mask.getHandler(x);
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
			};

			function inherit_(target, source, name){
				if (target == null || source == null)
					return;

				if ('node' === name) {
					var targetNodes = target.template || target.nodes,
						sourceNodes = source.template || source.nodes;
					if (targetNodes == null || sourceNodes == null) {
						target.template = targetNodes || sourceNodes;
					} else {
						target.nodes = mask.merge(sourceNodes, targetNodes, target);
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
						target[key] = 'object' === type
							? clone_(mix)
							: mix;
						continue;
					}
					if ('node' === name) {
						// http://jsperf.com/indexof-vs-bunch-of-if
						var isSealed = key === 'renderStart' ||
								key === 'renderEnd' ||
								key === 'emitIn' ||
								key === 'emitOut' ||
								key === 'components' ||
								key === 'nodes' ||
								key === 'template' ||
								key === 'find' ||
								key === 'closest' ||
								key === 'on' ||
								key === 'remove' ||
								key === 'slotState' ||
								key === 'signalState' ||
								key === 'append' ||
								key === 'appendTo'
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
					var i = imax;
					while( --i > -1 ){
						fns[i].apply(this, arguments);
					}
				};
			}
		}(mask.merge));
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

			mask.registerAttrHandler('x-pipe-signal', 'client', function(node, attrValue, model, cntx, element, controller) {

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
						log_error('define pipeName "click: pipeName.pipeSignal"');
						return;
					}

					pipe = handler.substring(0, dot);
					signal = handler.substring(++dot);

					var Handler = _handler(pipe, signal);


					// if DEBUG
					!event && log_error('Signal: event type is not set', attrValue);
					// endif


					dom_addEventListener(element, event, Handler);

				}
			});

			function _handler(pipe, signal) {
				return function(event){
					new Pipe(pipe).emit(signal, event);
				};
			}


			function pipe_attach(pipeName, controller) {
				if (controller.pipes[pipeName] == null) {
					log_error('Controller has no pipes to be added to collection', pipeName, controller);
					return;
				}

				if (_collection[pipeName] == null) {
					_collection[pipeName] = [];
				}
				_collection[pipeName].push(controller);
			}

			function pipe_detach(pipeName, controller) {
				var pipe = _collection[pipeName],
					i = pipe.length;

				while (--i > -1) {
					if (pipe[i] === controller)
						pipe.splice(i, 1);
				}

			}

			function controller_remove() {
				var	controller = this,
					pipes = controller.pipes;
				for (var key in pipes) {
					pipe_detach(key, controller);
				}
			}

			function controller_add(controller) {
				var pipes = controller.pipes;

				// if DEBUG
				if (pipes == null) {
					log_error('Controller has no pipes', controller);
					return;
				}
				// endif

				for (var key in pipes) {
					pipe_attach(key, controller);
				}

				Compo.attachDisposer(controller, controller_remove.bind(controller));
			}

			function Pipe(pipeName) {
				if (this instanceof Pipe === false) {
					return new Pipe(pipeName);
				}
				this.pipeName = pipeName;

				return this;
			}
			Pipe.prototype = {
				constructor: Pipe,
				emit: function(signal){
					var controllers = _collection[this.pipeName],
						pipeName = this.pipeName,
						args;

					if (controllers == null) {
						//if DEBUG
						log_warn('Pipe.emit: No signals were bound to:', pipeName);
						//endif
						return;
					}

					/**
					 * @TODO - for backward comp. support
					 * to pass array of arguments as an Array in second args
					 *
					 * - switch to use plain arguments
					 */

					if (arguments.length === 2 && is_Array(arguments[1]))
						args = arguments[1];

					else if (arguments.length > 1)
						args = _Array_slice.call(arguments, 1);


					var i = controllers.length,
						controller, slots, slot, called;

					while (--i !== -1) {
						controller = controllers[i];
						slots = controller.pipes[pipeName];

						if (slots == null)
							continue;

						slot = slots[signal];
						if (is_Function(slot)) {
							slot.apply(controller, args);
							called = true;
						}
					}

					// if DEBUG
					if (!called)
						log_warn('Pipe `%s` has not slots for `%s`', pipeName, signal);
					// endif
				}
			};

			Pipe.addController = controller_add;
			Pipe.removeController = controller_remove;

			return {
				addController: controller_add,
				removeController: controller_remove,

				pipe: Pipe
			};

		}());

		// end:source /src/compo/pipes.js

		// source /src/compo/anchor.js

		/**
		 *	Get component that owns an element
		 **/

		var Anchor = (function(){

			var _cache = {};

			return {
				create: function(compo){
					if (compo.ID == null){
						log_warn('Component should have an ID');
						return;
					}

					_cache[compo.ID] = compo;
				},
				resolveCompo: function(element){
					if (element == null){
						return null;
					}

					var findID, currentID, compo;
					do {

						currentID = element.getAttribute('x-compo-id');


						if (currentID) {

							if (findID == null) {
								findID = currentID;
							}

							compo = _cache[currentID];

							if (compo != null) {
								compo = Compo.find(compo, {
									key: 'ID',
									selector: findID,
									nextKey: 'components'
								});

								if (compo != null) {
									return compo;
								}
							}

						}

						element = element.parentNode;

					}while(element && element.nodeType === 1);


					// if DEBUG
					findID && log_warn('No controller for ID', findID);
					// endif
					return null;
				},
				removeCompo: function(compo){
					if (compo.ID == null){
						return;
					}
					delete _cache[compo.ID];
				},
				getByID: function(id){
					return _cache[id];
				}
			};

		}());

		// end:source /src/compo/anchor.js
		// source /src/compo/Compo.js
		var Compo, CompoProto;
		(function() {

			Compo = function(Proto) {
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

				/* obsolete */
				render: function(compo, model, ctx, container) {

					compo_ensureTemplate(compo);

					var elements = [];

					mask.render(
						compo.tagName == null ? compo.nodes : compo,
						model,
						ctx,
						container,
						compo,
						elements
					);

					compo.$ = domLib(elements);

					if (compo.events != null)
						Events_.on(compo, compo.events);

					if (compo.compos != null)
						Children_.select(compo, compo.compos);

					return compo;
				},

				initialize: function(compo, model, ctx, container, parent) {

					var compoName;

					if (container == null){
						if (ctx && ctx.nodeType != null){
							container = ctx;
							ctx = null;
						}else if (model && model.nodeType != null){
							container = model;
							model = null;
						}
					}

					if (typeof compo === 'string'){
						compoName = compo;

						compo = mask.getHandler(compoName);
						if (!compo){
							log_error('Compo not found:', compo);
						}
					}

					var node = {
						controller: compo,
						type: Dom.COMPONENT,
						tagName: compoName
					};

					if (parent == null && container != null)
						parent = Anchor.resolveCompo(container);

					if (parent == null)
						parent = new Dom.Component();


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
							EventDecorator = EventDecos[mix];
							return;
						}
						if (typeof mix === 'boolean' && mix === false) {
							EventDecorator = null;
							return;
						}
					}

				},

				//pipes: Pipes,
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
					eval(source);
				},

				Dom: {
					addEventListener: dom_addEventListener
				}
			});


			// end:source ./Compo.static.js
			// source ./async.js
			(function(){

				function _on(ctx, type, callback) {
					if (ctx[type] == null)
						ctx[type] = [];

					ctx[type].push(callback);

					return ctx;
				}

				function _call(ctx, type, _arguments) {
					var cbs = ctx[type];
					if (cbs == null)
						return;

					for (var i = 0, x, imax = cbs.length; i < imax; i++){
						x = cbs[i];
						if (x == null)
							continue;

						cbs[i] = null;

						if (_arguments == null) {
							x();
							continue;
						}

						x.apply(this, _arguments);
					}
				}


				var DeferProto = {
					done: function(callback){
						return _on(this, '_cbs_done', callback);
					},
					fail: function(callback){
						return _on(this, '_cbs_fail', callback);
					},
					always: function(callback){
						return _on(this, '_cbs_always', callback);
					},
					resolve: function(){
						this.async = false;
						_call(this, '_cbs_done', arguments);
						_call(this, '_cbs_always', arguments);
					},
					reject: function(){
						this.async = false;
						_call(this, '_cbs_fail', arguments);
						_call(this, '_cbs_always');
					},
					_cbs_done: null,
					_cbs_fail: null,
					_cbs_always: null
				};

				var CompoProto = {
					async: true,
					await: function(resume){
						this.resume = resume;
					}
				};

				Compo.pause = function(compo, ctx){
					if (ctx.async == null) {
						ctx.defers = [];
						obj_extend(ctx, DeferProto);
					}

					ctx.async = true;
					ctx.defers.push(compo);

					obj_extend(compo, CompoProto);

					return function(){
						Compo.resume(compo, ctx);
					};
				};

				Compo.resume = function(compo, ctx){

					// fn can be null when calling resume synced after pause
					if (compo.resume)
						compo.resume();

					compo.async = false;

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

			}());
			// end:source ./async.js

			CompoProto = {
				type: Dom.CONTROLLER,
				__resource: null,

				tagName: null,
				compoName: null,
				nodes: null,
				components: null,
				expression: null,
				attr: null,
				model: null,

				slots: null,
				pipes: null,

				compos: null,
				events: null,

				async: false,
				await: null,

				meta: {
					/* render modes, relevant for mask-node */
					mode: null,
					modelMode: null,
					attributes: null,
					serializeNodes: null,
				},

				onRenderStart: null,
				onRenderEnd: null,
				render: null,
				renderStart: function(model, ctx, container){

					if (arguments.length === 1
						&& model != null
						&& model instanceof Array === false
						&& model[0] != null){

						var args = arguments[0];
						model = args[0];
						ctx = args[1];
						container = args[2];
					}

					if (compo_meta_executeAttributeHandler(this) === false) {
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
					if (arguments.length === 1 && elements instanceof Array === false){
						var args = arguments[0];
						elements = args[0];
						model = args[1];
						ctx = args[2];
						container = args[3];
					}

					Anchor.create(this, elements);

					this.$ = domLib(elements);

					if (this.events != null)
						Events_.on(this, this.events);

					if (this.compos != null)
						Children_.select(this, this.compos);

					if (is_Function(this.onRenderEnd))
						this.onRenderEnd(elements, model, ctx, container);
				},
				appendTo: function(mix) {

					var element = typeof mix === 'string'
						? document.querySelector(mix)
						: mix
						;

					if (element == null) {
						log_warn('Compo.appendTo: parent is undefined. Args:', arguments);
						return this;
					}

					var els = this.$,
						i = 0,
						imax = els.length;
					for (; i < imax; i++) {
						element.appendChild(els[i]);
					}

					this.emitIn('domInsert');
					return this;
				},
				append: function(template, model, selector) {
					var parent;

					if (this.$ == null) {
						var dom = typeof template === 'string'
							? mask.compile(template)
							: template;

						parent = selector
							? find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'))
							: this;

						if (parent.nodes == null) {
							this.nodes = dom;
							return this;
						}

						parent.nodes = [this.nodes, dom];

						return this;
					}

					var fragment = mask.render(template, model, null, null, this);

					parent = selector
						? this.$.find(selector)
						: this.$;


					parent.append(fragment);


					// @todo do not emit to created compos before
					this.emitIn('domInsert');

					return this;
				},
				find: function(selector){
					return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'));
				},
				closest: function(selector){
					return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'up'));
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
				}
			};

			Compo.prototype = CompoProto;
		}());

		// end:source /src/compo/Compo.js
		// source /src/compo/signals.js
		(function() {

			/**
			 *	Mask Custom Attribute
			 *	Bind Closest Controller Handler Function to dom event(s)
			 */

			mask.registerAttrHandler('x-signal', 'client', function(node, attrValue, model, ctx, element, controller) {

				var arr = attrValue.split(';'),
					signals = '',
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
						Handler = _createListener(controller, handler)
						;

					// if DEBUG
					!event && log_error('Signal: event type is not set', attrValue);
					// endif

					if (Handler) {

						signals += ',' + handler + ',';
						dom_addEventListener(element, event, Handler);
					}

					// if DEBUG
					!Handler && log_warn('No slot found for signal', handler, controller);
					// endif
				}

				if (signals !== '')
					element.setAttribute('data-signals', signals);

			});

			// @param sender - event if sent from DOM Event or CONTROLLER instance
			function _fire(controller, slot, sender, args, direction) {

				if (controller == null)
					return false;

				var found = false,
					fn = controller.slots != null && controller.slots[slot];

				if (typeof fn === 'string')
					fn = controller[fn];

				if (typeof fn === 'function') {
					found = true;

					var isDisabled = controller.slots.__disabled != null && controller.slots.__disabled[slot];

					if (isDisabled !== true) {

						var result = args == null
								? fn.call(controller, sender)
								: fn.apply(controller, [sender].concat(args));

						if (result === false) {
							return true;
						}

						if (result != null && typeof result === 'object' && result.length != null) {
							args = result;
						}
					}
				}

				if (direction === -1 && controller.parent != null) {
					return _fire(controller.parent, slot, sender, args, direction) || found;
				}

				if (direction === 1 && controller.components != null) {
					var compos = controller.components,
						imax = compos.length,
						i = 0,
						r;
					for (; i < imax; i++) {
						r = _fire(compos[i], slot, sender, args, direction);

						!found && (found = r);
					}
				}

				return found;
			}

			function _hasSlot(controller, slot, direction, isActive) {
				if (controller == null) {
					return false;
				}

				var slots = controller.slots;

				if (slots != null && slots[slot] != null) {
					if (typeof slots[slot] === 'string') {
						slots[slot] = controller[slots[slot]];
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

				if (direction === -1 && controller.parent != null) {
					return _hasSlot(controller.parent, slot, direction);
				}

				if (direction === 1 && controller.components != null) {
					for (var i = 0, length = controller.components.length; i < length; i++) {
						if (_hasSlot(controller.components[i], slot, direction)) {
							return true;
						}

					}
				}
				return false;
			}

			function _createListener(controller, slot) {

				if (_hasSlot(controller, slot, -1) === false) {
					return null;
				}

				return function(event) {
					var args = arguments.length > 1 ? _Array_slice.call(arguments, 1) : null;

					_fire(controller, slot, event, args, -1);
				};
			}

			function __toggle_slotState(controller, slot, isActive) {
				var slots = controller.slots;
				if (slots == null || slots.hasOwnProperty(slot) === false) {
					return;
				}

				if (slots.__disabled == null) {
					slots.__disabled = {};
				}

				slots.__disabled[slot] = isActive === false;
			}

			function __toggle_slotStateWithChilds(controller, slot, isActive) {
				__toggle_slotState(controller, slot, isActive);

				if (controller.components != null) {
					for (var i = 0, length = controller.components.length; i < length; i++) {
						__toggle_slotStateWithChilds(controller.components[i], slot, isActive);
					}
				}
			}

			function __toggle_elementsState(controller, slot, isActive) {
				if (controller.$ == null) {
					log_warn('Controller has no elements to toggle state');
					return;
				}

				domLib()
					.add(controller.$.filter('[data-signals]'))
					.add(controller.$.find('[data-signals]'))
					.each(function(index, node) {
						var signals = node.getAttribute('data-signals');

						if (signals != null && signals.indexOf(slot) !== -1) {
							node[isActive === true ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled');
						}
					});
			}

			function _toggle_all(controller, slot, isActive) {

				var parent = controller,
					previous = controller;
				while ((parent = parent.parent) != null) {
					__toggle_slotState(parent, slot, isActive);

					if (parent.$ == null || parent.$.length === 0) {
						// we track previous for changing elements :disable state
						continue;
					}

					previous = parent;
				}

				__toggle_slotStateWithChilds(controller, slot, isActive);
				__toggle_elementsState(previous, slot, isActive);

			}

			function _toggle_single(controller, slot, isActive) {
				__toggle_slotState(controller, slot, isActive);

				if (!isActive && (_hasSlot(controller, slot, -1, true) || _hasSlot(controller, slot, 1, true))) {
					// there are some active slots; do not disable elements;
					return;
				}
				__toggle_elementsState(controller, slot, isActive);
			}



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

		// end:source /src/compo/signals.js

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
				remove: function(){
					return each(this, function(x){
						x.parentNode.removeChild(x);
					});
				}
			};

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

				var compo = Anchor.resolveCompo(this[0]);

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

					domLib.fn[method] = function(template, model, controller, ctx){

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

						if (controller == null) {
							controller = index < 2
								? this.compo()
								: this.parent().compo()
								;
						}

						var isUnsafe = false;
						if (controller == null) {
							controller = {};
							isUnsafe = true;
						}


						if (controller.components == null) {
							controller.components = [];
						}

						var compos = controller.components,
							i = compos.length,
							fragment = mask.render(template, model, ctx, null, controller);

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

				if (selector.selector === '*')
					return true;

				var obj = selector.prop ? node[selector.prop] : node,
					matched = false;

				if (obj == null)
					return false;

				if (typeof selector.selector === 'function') {
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

				var copy = {
					'type': 1,
					'tagName': 1,
					'compoName': 1,
					'controller': 1
				};

				var clone = {
					parent: parent
				};

				for(var key in node){
					if (copy[key] === 1){
						clone[key] = node[key];
					}
				}

				if (node.attr != null){
					clone.attr = obj_create(node.attr);
				}

				var nodes = node.nodes;
				if (nodes != null && nodes.length > 0){
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
				return Array.prototype.slice.call(this);
			},
			/**
			 *	render([model, cntx, container]) -> HTMLNode
			 * - model (Object)
			 * - cntx (Object)
			 * - container (Object)
			 * - returns (HTMLNode)
			 *
			 **/
			render: function(model, cntx, container, controller) {
				this.components = [];

				if (this.length === 1) {
					return _mask_render(this[0], model, cntx, container, controller || this);
				}

				if (container == null) {
					container = document.createDocumentFragment();
				}

				for (var i = 0, length = this.length; i < length; i++) {
					_mask_render(this[i], model, cntx, container, controller || this);
				}
				return container;
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
				var node;

				if (template != null)
					return this.empty().append(template);

				if (arguments.length)
					return this;


				if (this.length === 0)
					node = new Dom.Node();

				else if (this.length === 1)
					node = this[0];

				else {
					node = new Dom.Fragment();
					node.nodes = [];

					var i = -1;
					while ( ++i < this.length ){
						node.nodes[i] = this[i];
					}
				}

				return mask.stringify(node);
			},

			text: function(mix, cntx, controller){
				if (typeof mix === 'string' && arguments.length === 1) {
					var node = [new Dom.TextNode(mix)];

					for(var i = 0, x, imax = this.length; i < imax; i++){
						x = this[i];
						x.nodes = node;
					}
					return this;
				}

				var string = '';
				for(var i = 0, x, imax = this.length; i < imax; i++){
					x = this[i];
					string += jmask_getText(x, mix, cntx, controller);
				}
				return string;
			}
		};

		arr_each(['append', 'prepend'], function(method) {

			jMask.prototype[method] = function(mix) {
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

			jMask.prototype[method] = function(mix, model, cntx, controller) {

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
				if (arguments.length === 1) {
					return this.length > 0 ? this[0].attr[mix] : null;
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
		obj_extend(jMask.prototype, {
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
			jMask.prototype[method] = function(){
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
		obj_extend(jMask.prototype, {
			each: function(fn, cntx) {
				for (var i = 0; i < this.length; i++) {
					fn.call(cntx || this, this[i], i)
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

			jMask.prototype[method] = function(selector) {
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



		return jMask;

	}(Mask));

	// end:source /ref-mask-j/lib/jmask.embed.js
	// source /ref-mask-binding/lib/binding.embed.js
	(function(mask, Compo){
		var IS_BROWSER = true,
			IS_NODE = false;

		// source ../src/vars.js
		var __Compo = typeof Compo !== 'undefined' ? Compo : (mask.Compo || global.Compo),
		    __dom_addEventListener = __Compo.Dom.addEventListener,
		    __mask_registerHandler = mask.registerHandler,
		    __mask_registerAttrHandler = mask.registerAttrHandler,
		    __mask_registerUtil = mask.registerUtil,

			domLib = __Compo.config.getDOMLibrary();


		// end:source ../src/vars.js

		// source ../src/util/object.js

		// end:source ../src/util/object.js
		// source ../src/util/object.observe.js
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

			function obj_crumbRebindDelegate(obj) {
				return function(path, oldValue){

					var observers = obj[prop_OBS];
					if (observers == null)
						return;

					for (var property in observers) {

						if (property.indexOf(path) !== 0)
							continue;

						var listeners = observers[property].slice(0),
							imax = listeners.length,
							i = 0;

						if (imax === 0)
							continue;

						var val = obj_getProperty(obj, property),
							cb, oldProp;

						for (i = 0; i < imax; i++) {
							cb = listeners[i];
							obj_removeObserver(obj, property, cb);

							oldProp = property.substring(path.length);
							obj_removeObserver(oldValue, oldProp, cb);
						}
						for (i = 0; i < imax; i++){
							listeners[i](val);
						}

						for (i = 0; i < imax; i++){
							obj_addObserver(obj, property, listeners[i]);
						}

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
		// end:source ../src/util/object.observe.js
		// source ../src/util/date.js
		var date_ensure;
		(function(){
			date_ensure = function(val){
				if (val == null || val === '')
					return null;
				if (typeof val === 'string')
					val = new Date(val);

				return isNaN(val) === false && typeof val.getFullYear === 'function'
					? val
					: null
					;
			};
		}());
		// end:source ../src/util/date.js
		// source ../src/util/dom.js

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




		// end:source ../src/util/dom.js
		// source ../src/util/compo.js
		var compo_fragmentInsert,
			compo_render,
			compo_dispose,
			compo_inserted,
			compo_attachDisposer
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

		}());
		// end:source ../src/util/compo.js
		// source ../src/util/expression.js
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
					obj_addMutatorObserver(model, callback);
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
					obj_removeMutatorObserver(model, callback);
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
					if (first === '$c') {
						// Controller Observer
						ctr = _getObservable_Controller(ctr, parts.slice(1), imax - 1);
						mutatorFn(ctr, property.substring(3), callback);
						return;
					}
					if ('$a' === first || '$ctx' === first)
						return;
				}

				var obj = null;
				if (_isDefined(model, parts, imax)) {
					obj = model;
				}
				if (obj == null) {
					obj = _getObservable_Scope(ctr, parts, imax);
				}
				if (obj == null) {
					obj = model;
				}

				mutatorFn(obj, property, callback);
			}

			function _getObservable_Scope(ctr, parts, imax){
				var scope;
				while(ctr != null){
					scope = ctr.scope;
					if (scope != null && _isDefined(scope, parts, imax))
						return scope;

					ctr = ctr.parent;
				}
				return null;
			}
			function _getObservable_Controller(ctr, parts, imax) {
				while(ctr != null){
					if (_isDefined(ctr, parts, imax))
						return ctr;
					ctr = ctr.parent;
				}
				return ctr;
			}
			function _isDefined(obj, parts, imax){
				if (obj == null)
					return false;

				var i = 0, val;
				for(; i < imax; i++) {
					obj = obj[parts[i]];
					if (obj === void 0)
						return false;
				}
				return true;
			}


		}());



		// end:source ../src/util/expression.js
		// source ../src/util/signal.js
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

		// end:source ../src/util/signal.js

		// source ../src/bindingProvider.js
		// source ./DomObjectTransport.js
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

						var target = date_ensure(obj_getProperty(obj, prop));
						if (target == null) {
							obj_setProperty(obj, prop, date);
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
						return  i === -1
							? ''
							: el.options[i].getAttribute('name')
							;
					},
					set: function(provider, val) {
						var el = provider.element,
							options = el.options,
							imax = options.length,
							i = -1;
						while( ++i < imax ){
							/* jshint eqeqeq: false */
							if (options[i].getAttribute('name') == val) {
								/* jshint eqeqeq: true */
								el.selectedIndex = i;
								return;
							}
						}
						log_warn('Value is not an option', val);
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
				}

			};

			function isValidFn_(obj, prop, name) {
				if (obj== null || typeof obj[prop] !== 'function') {
					log_error('BindingProvider.', name, 'should be a function. Property:', prop);
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

		// end:source ./DomObjectTransport.js
		// source ./CustomProviders.js
		var CustomProviders = {};

		mask.registerBinding = function(name, Prov) {
			CustomProviders[name] = Prov;
		};
		// end:source ./CustomProviders.js

		var BindingProvider;
		(function() {

			mask.BindingProvider =
			BindingProvider =
			function BindingProvider(model, element, ctr, bindingType) {
				if (bindingType == null)
					bindingType = ctr.compoName === ':bind' ? 'single' : 'dual';

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
							if ('date' === type) {
								var x = DomObjectTransport.DATE;
								this.domWay = x.domWay;
								this.objectWay = x.objectWay;
							}
							this.property = 'element.value';
							break;
						case 'TEXTAREA':
							this.property = 'element.value';
							break;
						case 'SELECT':
							this.domWay = DomObjectTransport.DATE.SELECT;
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

				/**
				 *	Send signal on OBJECT or DOM change
				 */
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


				if (attr['dom-slot']) {
					this.slots = {};
					// @hack - place dualb. provider on the way of a signal
					//
					var parent = ctr.parent,
						newparent = parent.parent;

					parent.parent = this;
					this.parent = newparent;

					this.slots[attr['dom-slot']] = function(sender, value){
						this.domChanged(sender, value);
					}
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
			};

			BindingProvider.create = function(model, el, ctr, bindingType) {

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
			};

			BindingProvider.bind = function(provider){
				return apply_bind(provider);
			};

			BindingProvider.prototype = {
				constructor: BindingProvider,

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

					var isValid = true,
						validations = this.ctr.validations;
					if (validations) {
						var imax = validations.length,
							i = -1, x;
						while( ++i < imax ) {
							x = validations[i];
							if (x.validate(value, this.element, this.objectChanged.bind(this)) === false) {
								isValid = false;
								break;
							}
						}
					}
					if (isValid) {
						this.dismiss = 1;
						this.objectWay.set(this.model, this.value, value, this);
						this.dismiss = 0;

						if (this.log) {
							console.log('[BindingProvider] domChanged -', value);
						}
						if (this.signal_domChanged) {
							signal_emitOut(this.ctr, this.signal_domChanged, [value]);
						}
						if (this.pipe_domChanged) {
							var pipe = this.pipe_domChanged;
							__Compo.pipe(pipe.pipe).emit(pipe.signal);
						}
					}
					this.locked = false;
				},

				objectWay: DomObjectTransport.objectWay,
				domWay: DomObjectTransport.domWay
			};

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

		// end:source ../src/bindingProvider.js

		// source ../src/mask-handler/visible.js
		/**
		 * visible handler. Used to bind directly to display:X/none
		 *
		 * attr =
		 *    check - expression to evaluate
		 *    bind - listen for a property change
		 */

		function VisibleHandler() {}

		__mask_registerHandler(':visible', VisibleHandler);


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

		// end:source ../src/mask-handler/visible.js
		// source ../src/mask-handler/bind.js
		/**
		 *  Mask Custom Tag Handler
		 *	attr =
		 *		attr: {String} - attribute name to bind
		 *		prop: {Stirng} - property name to bind
		 *		- : {default} - innerHTML
		 */



		(function() {

			function Bind() {}

			__mask_registerHandler(':bind', Bind);

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

		// end:source ../src/mask-handler/bind.js
		// source ../src/mask-handler/dualbind.js
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

		function DualbindHandler() {}

		__mask_registerHandler(':dualbind', DualbindHandler);



		DualbindHandler.prototype = {
			constructor: DualbindHandler,

			renderEnd: function(elements, model, cntx, container) {
				this.provider = BindingProvider.create(model, container, this);

				if (this.components) {
					for (var i = 0, x, length = this.components.length; i < length; i++) {
						x = this.components[i];

						if (x.compoName === ':validate') {
							(this.validations || (this.validations = []))
								.push(x);
						}
					}
				}

				if (!this.attr['no-validation'] && !this.validations) {
					var Validate = model.Validate,
						prop = this.provider.value;

					if (Validate == null && prop.indexOf('.') !== -1) {
						var parts = prop.split('.'),
							i = 0,
							imax = parts.length,
							obj = model[parts[0]];
						while (Validate == null && ++i < imax && obj) {
							Validate = obj.Validate;
							obj = obj[parts[i]]
						}
						prop = parts.slice(i).join('.');
					}

					var validator = Validate && Validate[prop];
					if (typeof validator === 'function') {

						validator = mask
							.getHandler(':validate')
							.createCustom(container, validator);

						(this.validations || (this.validations = []))
							.push(validator);

					}
				}


				BindingProvider.bind(this.provider);
			},
			dispose: function() {
				if (this.provider && typeof this.provider.dispose === 'function') {
					this.provider.dispose();
				}
			},

			handlers: {
				attr: {
					'x-signal': function() {}
				}
			}
		};
		// end:source ../src/mask-handler/dualbind.js
		// source ../src/mask-handler/validate.js
		(function() {

			var class_INVALID = '-validate-invalid';

			mask.registerValidator = function(type, validator) {
				Validators[type] = validator;
			};

			function Validate() {}

			__mask_registerHandler(':validate', Validate);




			Validate.prototype = {
				constructor: Validate,
		        attr: {},
				renderStart: function(model, cntx, container) {
					this.element = container;

					if (this.attr.value) {
						var validatorFn = Validate.resolveFromModel(model, this.attr.value);

						if (validatorFn) {
							this.validators = [new Validator(validatorFn)];
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
				validate: function(input, element, oncancel) {
					if (element == null){
						element = this.element;
					}

					if (this.attr) {

						if (input == null && this.attr.getter) {
							input = obj_getProperty({
								node: this,
								element: element
							}, this.attr.getter);
						}

						if (input == null && this.attr.value) {
							input = obj_getProperty(this.model, this.attr.value);
						}
					}



					if (this.validators == null) {
						this.initValidators();
					}

					for (var i = 0, x, imax = this.validators.length; i < imax; i++) {
						x = this.validators[i].validate(input)

						if (x && !this.attr.silent) {
							this.notifyInvalid(element, x, oncancel);
							return false;
						}
					}

					this.makeValid(element);
					return true;
				},
				notifyInvalid: function(element, message, oncancel){
					return notifyInvalid(element, message, oncancel);
				},
				makeValid: function(element){
					return makeValid(element);
				},
				initValidators: function() {
					this.validators = [];

					for (var key in this.attr) {


						switch (key) {
							case 'message':
							case 'value':
							case 'getter':
								continue;
						}

						if (key in Validators === false) {
							log_error('Unknown Validator:', key, this);
							continue;
						}

						var x = Validators[key];

						this.validators.push(new Validator(x(this.attr[key], this), this.attr.message));
					}
				}
			};


			Validate.resolveFromModel = function(model, property){
				return obj_getProperty(model.Validate, property);
			};

			Validate.createCustom = function(element, validator){
				var validate = new Validate();

				validate.element = element;
				validate.validators = [new Validator(validator)];

				return validate;
			};


			function Validator(fn, defaultMessage) {
				this.fn = fn;
				this.message = defaultMessage;
			}
			Validator.prototype.validate = function(value){
				var result = this.fn(value);

				if (result === false) {
					return this.message || ('Invalid - ' + value);
				}
				return result;
			};


			function notifyInvalid(element, message, oncancel) {
				log_warn('Validate Notification:', element, message);

				var next = domLib(element).next('.' + class_INVALID);
				if (next.length === 0) {
					next = domLib('<div>')
						.addClass(class_INVALID)
						.html('<span></span><button>cancel</button>')
						.insertAfter(element);
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

			function makeValid(element) {
				return domLib(element).next('.' + class_INVALID).hide();
			}

			__mask_registerHandler(':validate:message', Compo({
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


			var Validators = {
				match: function(match) {

					return function(str){
						return new RegExp(match).test(str);
					};
				},
				unmatch:function(unmatch) {

					return function(str){
						return !(new RegExp(unmatch).test(str));
					};
				},
				minLength: function(min) {

					return function(str){
						return str.length >= parseInt(min, 10);
					};
				},
				maxLength: function(max) {

					return function(str){
						return str.length <= parseInt(max, 10);
					};
				},
				check: function(condition, node){

					return function(str){
						return expression_eval('x' + condition, node.model, {x: str}, node);
					};
				}


			};



		}());

		// end:source ../src/mask-handler/validate.js
		// source ../src/mask-handler/validate.group.js
		function ValidateGroup() {}

		__mask_registerHandler(':validate:group', ValidateGroup);


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

		// end:source ../src/mask-handler/validate.group.js

		// source ../src/mask-util/bind.js
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

			__mask_registerUtil('bind', {
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
				node: function(expr, model, ctx, element, controller){
					bind(
						this.current,
						expr,
						model,
						ctx,
						this.element,
						controller,
						null,
						'node');

					return this.element;
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

		// end:source ../src/mask-util/bind.js

		// source ../src/mask-attr/xxVisible.js


		__mask_registerAttrHandler('xx-visible', function(node, attrValue, model, cntx, element, controller) {

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
		// end:source ../src/mask-attr/xxVisible.js
		// source ../src/mask-attr/xToggle.js
		/**
		 *	Toggle value with ternary operator on an event.
		 *
		 *	button x-toggle='click: foo === "bar" ? "zet" : "bar" > 'Toggle'
		 */

		__mask_registerAttrHandler('x-toggle', 'client', function(node, attrValue, model, ctx, element, controller){


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

		// end:source ../src/mask-attr/xToggle.js
		// source ../src/mask-attr/xClassToggle.js
		/**
		 *	Toggle Class Name
		 *
		 *	button x-toggle='click: selected'
		 */

		__mask_registerAttrHandler('x-class-toggle', 'client', function(node, attrValue, model, ctx, element, controller){


		    var event = attrValue.substring(0, attrValue.indexOf(':')),
		        $class = attrValue.substring(event.length + 1).trim();


		    __dom_addEventListener(element, event, function(){
		         domLib(element).toggleClass($class);
		    });
		});

		// end:source ../src/mask-attr/xClassToggle.js

		//--import ../src/sys/sys.js
		// source ../src/statements/exports.js
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

				_renderPlaceholder = function(compo, container){
					compo.placeholder = document.createComment('');
					container.appendChild(compo.placeholder);
				};

				_compo_initAndBind = function(compo, node, model, ctx, container, controller) {

					compo.parent = controller;
					compo.model = model;

					compo.refresh = fn_proxy(compo.refresh, compo);
					compo.binder = expression_createBinder(
						compo.expr,
						model,
						ctx,
						controller,
						compo.refresh
					);


					expression_bind(compo.expr, model, ctx, controller, compo.binder);
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

				mask.registerHandler('+if', {
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

						compo.placeholder = document.createComment('');
						container.appendChild(compo.placeholder);

						initialize(compo, this, index, els, model, ctx, container, ctr);


						return compo;
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

					if (index != null)
						compo.Switch[index].elements = elements;

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

				mask.registerHandler('+switch', {
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

						_renderPlaceholder(compo, container);

						initialize(compo, this, index, els, model, ctx, container, ctr);

						return compo;
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

					if (index != null)
						compo.Switch[index] = elements;

					expression_bind(node.expression, model, ctx, ctr, compo.binder);
				}


			}());
			// end:source 3.switch.js
			// source 4.with.js
			(function(){

				var $With = custom_Statements['with'];

				mask.registerHandler('+with', {
					meta: {
						serializeNodes: true
					},
					render: function(model, ctx, container, ctr, childs){
						var val = expression_eval_strict(this.expression, model, ctx, ctr);
						return build(this.nodes, val, ctx, container, ctr);
					},

					renderEnd: function(els, model, ctx, container, ctr){

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

						_renderPlaceholder(compo, container);

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

				mask.registerHandler('+visible', {
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

						log_warn('No Model Found for', array[j]);
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
							this.expr, this.model, this.parent, this.binder
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


					mask.registerHandler('+for', {
						meta: {
							serializeNodes: true
						},
						serializeNodes: function(node){
							return mask.stringify(node);
						},
						render: function(model, ctx, container, controller, childs){

							var directive = For.parseFor(this.expression),
								attr = this.attr;

							attr[attr_PROP_1] = directive[0];
							attr[attr_PROP_2] = directive[1];
							attr[attr_TYPE] = directive[2];
							attr[attr_EXPR] = directive[3];


							var value = expression_eval(directive[3], model, ctx, controller);
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
								childs
							);
						},

						renderEnd: function(els, model, ctx, container, controller){

							var compo = new ForStatement(this, this.attr);

							compo.placeholder = document.createComment('');
							container.appendChild(compo.placeholder);



							_compo_initAndBind(compo, this, model, ctx, container, controller);

							return compo;
						},

						getHandler: function(name, model){

							return For.getHandler(name, model);
						}

					});

					function initialize(compo, node, els, model, ctx, container, controller) {

						compo.parent = controller;
						compo.model = model;

						compo.refresh = fn_proxy(compo.refresh, compo);
						compo.binder = expression_createBinder(
							compo.expr,
							model,
							ctx,
							controller,
							compo.refresh
						);


						expression_bind(compo.expr, model, ctx, controller, compo.binder);

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


					mask.registerHandler('+each', {

						render: function(model, ctx, container, controller, children){

							var node = this;

							var array = expression_eval(node.expression, model, ctx, controller);
							if (array == null)
								return;

							arr_createRefs(array);

							build(
								node.nodes,
								array,
								ctx,
								container,
								node,
								children
							);
						},

						renderEnd: function(els, model, ctx, container, controller){

							var compo = new EachStatement(this, this.attr);

							compo.placeholder = document.createComment('');
							container.appendChild(compo.placeholder);

							_compo_initAndBind(compo, this, model, ctx, container, controller);

							return compo;
						}

					});

					function build(nodes, array, ctx, container, controller, elements) {
						var imax = array.length,
							i = -1,
							itemCtr;

						while ( ++i < imax ){

							itemCtr = Each.createItem(i, nodes, controller);
							builder_build(itemCtr, array[i], ctx, container, controller, elements);
						}
					}

					function EachStatement(node, attr) {
						this.expr = node.expression;
						this.nodes = node.nodes;

						if (node.components == null)
							node.components = [];

						this.node = node;
						this.components = node.components;
					}

					EachStatement.prototype = {
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
					};

				}());
				// end:source each.js

			}());

			// end:source loop/exports.js

		}());
		// end:source ../src/statements/exports.js

	}(Mask, Compo));

	// end:source /ref-mask-binding/lib/binding.embed.js



	Mask.Compo = Compo;
	Mask.jmask = jmask;

	return (exports.mask = Mask);
}));
