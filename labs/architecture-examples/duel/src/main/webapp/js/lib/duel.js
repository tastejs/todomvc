/*global window */

/**
 * @license DUEL v0.8.2 http://duelengine.org
 * Copyright (c)2006-2012 Stephen M. McKamey.
 * Licensed under The MIT License.
 */

/**
 * @public
 * @param {Array|Object|string|number|function(*,number,number):Array|Object|string} view The view template
 * @return {function(*)}
 */
var duel = (
	/**
	 * @param {Document} document Document reference
	 * @param {function()} scriptEngine script engine version
	 * @param {*=} undef undefined
	 */
	function(document, scriptEngine, undef) {

	'use strict';

	/* types.js --------------------*/

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var NUL = 0;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var FUN = 1;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var ARY = 2;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var OBJ = 3;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var VAL = 4;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var RAW = 5;

	/**
	 * Wraps a data value to maintain as raw markup in output
	 * 
	 * @private
	 * @this {Markup}
	 * @param {string} value The value
	 * @constructor
	 */
	function Markup(value) {
		/**
		 * @type {string}
		 * @const
		 * @protected
		 */
		this.value = value;
	}

	/**
	 * Renders the value
	 * 
	 * @public
	 * @override
	 * @this {Markup}
	 * @return {string} value
	 */
	Markup.prototype.toString = function() {
		return this.value;
	};

	/**
	 * Determines if the value is an Array
	 * 
	 * @private
	 * @param {*} val the object being tested
	 * @return {boolean}
	 */
	var isArray = Array.isArray || function(val) {
		return (val instanceof Array);
	};
	
	/**
	 * Determines the type of the value
	 * 
	 * @private
	 * @param {*} val the object being tested
	 * @return {number}
	 */
	function getType(val) {
		switch (typeof val) {
			case 'object':
				return !val ? NUL : (isArray(val) ? ARY : ((val instanceof Markup) ? RAW : ((val instanceof Date) ? VAL : OBJ)));
			case 'function':
				return FUN;
			case 'undefined':
				return NUL;
			default:
				return VAL;
		}
	}

	/**
	 * Determines if the value is a string
	 * 
	 * @private
	 * @param {*} val the object being tested
	 * @return {boolean}
	 */
	function isString(val) {
		return (typeof val === 'string');
	}

	/**
	 * Determines if the value is a function
	 * 
	 * @private
	 * @param {*} val the object being tested
	 * @return {boolean}
	 */
	function isFunction(val) {
		return (typeof val === 'function');
	}

	/**
	 * String buffer
	 * 
	 * @private
	 * @this {Buffer}
	 * @constructor
	 */
	function Buffer() {
		/**
		 * @type {Array|string}
		 * @private
		 */
		this.value = Buffer.FAST ? '' : [];
	}

	/**
	 * Only IE<9 benefits from Array.join()
	 * 
	 * @private
	 * @constant
	 * @type {boolean}
	 */
	Buffer.FAST = !(scriptEngine && scriptEngine() < 9);

	/**
	 * Appends to the internal value
	 * 
	 * @public
	 * @this {Buffer}
	 * @param {null|string} v1
	 * @param {null|string=} v2
	 * @param {null|string=} v3
	 */
	Buffer.prototype.append = function(v1, v2, v3) {
		if (Buffer.FAST) {
			if (v1 !== null) {
				this.value += v1;

				if (v2 !== null && v2 !== undef) {
					this.value += v2;

					if (v3 !== null && v3 !== undef) {
						this.value += v3;
					}
				}
			}

		} else {
			this.value.push.apply(
				// Closure Compiler type cast
				/** @type{Array} */(this.value),
				arguments);
		}
	};

	/**
	 * Clears the internal value
	 * 
	 * @public
	 * @this {Buffer}
	 */
	Buffer.prototype.clear = function() {
		this.value = Buffer.FAST ? '' : [];
	};

	/**
	 * Renders the value
	 * 
	 * @public
	 * @override
	 * @this {Buffer}
	 * @return {string} value
	 */
	Buffer.prototype.toString = function() {
		return Buffer.FAST ?
			// Closure Compiler type cast
			/** @type{string} */(this.value) :
			this.value.join('');
	};

	function digits(n) {
        return (n < 10) ? '0'+n : n;
    }

	/**
	 * Formats the value as a string
	 * 
	 * @private
	 * @param {*} val the object being rendered
	 * @return {string|null}
	 */
	function asString(val) {
		var buffer, needsDelim;
		switch (getType(val)) {
			case VAL:
				return ''+val;
			case NUL:
				return '';
			case ARY:
				// flatten into simple list
				buffer = new Buffer();
				for (var i=0, length=val.length; i<length; i++) {
					if (needsDelim) {
						buffer.append(', ');
					} else {
						needsDelim = true;
					}
					buffer.append(asString(val[i]));
				}
				return buffer.toString();
			case OBJ:
				// format JSON-like
				buffer = new Buffer();
				buffer.append('{');
				for (var key in val) {
					if (val.hasOwnProperty(key)) {
						if (needsDelim) {
							buffer.append(', ');
						} else {
							needsDelim = true;
						}
						buffer.append(key, '=', asString(val[key]));
					}
				}
				buffer.append('}');
				return buffer.toString();
		}

		// Closure Compiler type cast
		return /** @type{string} */(val);
	}
	
	/**
	 * Wraps a binding result with rendering methods
	 * 
	 * @private
	 * @this {Result}
	 * @param {Array|Object|string|number} view The result tree
	 * @constructor
	 */
	function Result(view) {
		if (!isArray(view)) {
			// ensure is rooted element
			view = ['', view];
		}
	
		/**
		 * @type {Array}
		 * @const
		 * @protected
		 */
		// Closure Compiler type cast
		this.value = /** @type {Array} */(view);
	}

	/* bind.js --------------------*/

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var FOR = '$for';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var XOR = '$xor';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var IF = '$if';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var CALL = '$call';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var PART = '$part';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var TEST = 'test';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var EACH = 'each';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var IN = 'in';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var VIEW = 'view';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var DATA = 'data';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var INDEX = 'index';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var COUNT = 'count';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var KEY = 'key';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var NAME = 'name';

	var bind;

	/**
	 * Appends a node to a parent
	 * 
	 * @private
	 * @param {Array} parent The parent node
	 * @param {Array|Object|string|number} child The child node
	 */
	function append(parent, child) {
		switch (getType(child)) {
			case ARY:
				if (child[0] === '') {
					// child is documentFragment
					// directly append children, skip fragment identifier
					for (var i=1, length=child.length; i<length; i++) {
						append(parent, child[i]);
					}

				} else {
					// child is an element array
					parent.push(child);
				}
				break;

			case OBJ:
				// child is attributes object
				if (parent.length === 1) {
					parent.push(child);

				} else {
					var old = parent[1];
					if (getType(old) === OBJ) {
						// merge attribute objects
						for (var key in child) {
							if (child.hasOwnProperty(key)) {
								old[key] = child[key];
							}
						}

					} else {
						// insert attributes object
						parent.splice(1, 0, child);
					}
				}
				break;

			case VAL:
				if (child !== '') {
					// coerce primitive to string literal
					child = '' + child;

					var last = parent.length-1;
					if (last > 0 && getType(parent[last]) === VAL) {
						// combine string literals
						parent[last] += child;

					} else {
						// append
						parent.push(child);
					}
				}
				break;

			case NUL:
				// cull empty values
				break;

			default:
				// append others
				parent.push(child);
				break;
		}
	}

	/**
	 * Binds the child nodes ignoring parent element and attributes
	 * 
	 * @private
	 * @param {Array} node The template subtree root
	 * @param {*} data The data item being bound
	 * @param {number} index The index of the current data item
	 * @param {number} count The total number of data items
	 * @param {string|null} key The current property name
	 * @param {Object=} parts Named replacement partial views
	 * @return {Array|Object|string|number}
	 */
	function bindContent(node, data, index, count, key, parts) {
		// second item might be attributes object
		var hasAttr = (getType(node[1]) === OBJ);

		if (node.length === (hasAttr ? 3 : 2)) {
			// unwrap single nodes
			return bind(node[node.length-1], data, index, count, key, parts);
		}

		// element array, make a doc frag
		var result = [''];

		for (var i=hasAttr ? 2 : 1, length=node.length; i<length; i++) {
			append(result, bind(node[i], data, index, count, key, parts));
		}

		return result;
	}

	/**
	 * Binds the content once for each item in data
	 * 
	 * @private
	 * @param {Array|Object|string|number|function(*,number,number):*} node The template subtree root
	 * @param {*} data The data item being bound
	 * @param {number} index The index of the current data item
	 * @param {number} count The total number of data items
	 * @param {string|null} key The current property name
	 * @param {Object=} parts Named replacement partial views
	 * @return {Array|Object|string|number}
	 */
	function loop(node, data, index, count, key, parts) {
		var args = node[1] || {},
			result = [''],
			items, i, length;

		if (args.hasOwnProperty(COUNT)) {
			// evaluate for-count loop
			length = args[COUNT];
			if (isFunction(length)) {
				// execute code block
				length = length(data, index, count, key);
			}

			var d;
			if (args.hasOwnProperty(DATA)) {
				d = args[DATA];
				if (isFunction(d)) {
					// execute code block
					d = d(data, index, count, key);
				}
			} else {
				d = data;
			}

			// iterate over the items
			for (i=0; i<length; i++) {
				// Closure Compiler type cast
				append(result, bindContent(/** @type {Array} */(node), d, i, length, null, parts));
			}
			return result;
		}

		if (args.hasOwnProperty(IN)) {
			// convert for-in loop to for-each loop
			var obj = args[IN];
			if (isFunction(obj)) {
				// execute code block
				obj = obj(data, index, count, key);
			}
			if (getType(obj) === OBJ) {
				// accumulate the property keys to get count
				items = [];
				for (var k in obj) {
					if (obj.hasOwnProperty(k)) {
						items.push(k);
					}
				}

				// iterate over the keys
				for (i=0, length=items.length; i<length; i++) {
					// Closure Compiler type cast
					append(result, bindContent(/** @type {Array} */(node), obj[items[i]], i, length, items[i], parts));
				}
				return result;
			}

			// just bind to single value
			items = obj;

		} else {
			// evaluate for-each loop
			items = args[EACH];
			if (isFunction(items)) {
				// execute code block
				items = items(data, index, count, key);
			}
		}

		var type = getType(items); 
		if (type === ARY) {
			// iterate over the items
			for (i=0, length=items.length; i<length; i++) {
				// Closure Compiler type cast
				append(result, bindContent(/** @type {Array} */(node), items[i], i, length, null, parts));
			}

		} else if (type !== NUL) {
			// just bind the single value
			// Closure Compiler type cast
			result = bindContent(/** @type {Array} */(node), items, 0, 1, null, parts);
		}

		return result;
	}

	/**
	 * Binds the node to the first conditional block that evaluates to true
	 * 
	 * @private
	 * @param {Array|Object|string|number|function(*,number,number):Array|Object|string} node The template subtree root
	 * @param {*} data The data item being bound
	 * @param {number} index The index of the current data item
	 * @param {number} count The total number of data items
	 * @param {string|null} key The current property name
	 * @param {Object=} parts Named replacement partial views
	 * @return {Array|Object|string|number}
	 */
	function xor(node, data, index, count, key, parts) {
		for (var i=1, length=node.length; i<length; i++) {

			var block = node[i],
				args = block[1],
				test = args[TEST];

			if (getType(block[1]) === OBJ && test) {
				// execute test if exists
				if (isFunction(test)) {
					test = test(data, index, count, key);
				}

				if (!test) {
					continue;
				}
			}

			// process block contents
			return bindContent(block, data, index, count, key, parts);
		}

		return null;
	}

	/**
	 * Calls into another view
	 * 
	 * @private
	 * @param {Array|Object|string|number|function(*,*,*,*):(Object|null)} node The template subtree root
	 * @param {*} data The data item being bound
	 * @param {number} index The index of the current data item
	 * @param {number} count The total number of data items
	 * @param {string|null} key The current property name
	 * @return {Array|Object|string|number}
	 */
	function call(node, data, index, count, key) {
		var args = node[1] || {};
		if (!args[VIEW]) {
			return null;
		}

		// evaluate the arguments
		var v = bind(args[VIEW], data, index, count, key),
			d = args.hasOwnProperty(DATA) ? bind(args[DATA], data, index, count, key) : data,
			i = args.hasOwnProperty(INDEX) ? bind(args[INDEX], data, index, count, key) : index,
			c = args.hasOwnProperty(COUNT) ? bind(args[COUNT], data, index, count, key) : count,
			k = args.hasOwnProperty(KEY) ? bind(args[KEY], data, index, count, key) : key,
			p = {};

		// check for view parts
		for (var j=node.length-1; j>=2; j--) {
			var block = node[j];

			args = block[1] || {};
			if (args.hasOwnProperty(NAME)) {
				p[args[NAME]] = block;
			}
		}

		return (v && isFunction(v.getView)) ?
			// Closure Compiler type cast
			bind(v.getView(), d, /** @type {number} */i, /** @type {number} */c, /** @type {string} */k, p) : null;
	}

	/**
	 * Replaces a place holder part with the named part from the calling view
	 * 
	 * @private
	 * @param {Array|Object|string|number|function(*,*,*,*):(Object|null)} node The template subtree root
	 * @param {*} data The data item being bound
	 * @param {number} index The index of the current data item
	 * @param {number} count The total number of data items
	 * @param {string|null} key The current property name
	 * @param {Object=} parts Named replacement partial views
	 * @return {Array|Object|string|number}
	 */
	function part(node, data, index, count, key, parts) {
		var args = node[1] || {},
			block = args[NAME] || '';

		block = parts && parts.hasOwnProperty(block) ? parts[block] : node;

		return bindContent(block, data, index, count, key);
	}

	/**
	 * Binds the node to data
	 * 
	 * @private
	 * @param {Array|Object|string|number|function(*,*,*,*):(Object|null)} node The template subtree root
	 * @param {*} data The data item being bound
	 * @param {number} index The index of the current data item
	 * @param {number} count The total number of data items
	 * @param {string|null} key The current property name
	 * @param {Object=} parts Named replacement partial views
	 * @return {Array|Object|string|number}
	 */
	bind = function(node, data, index, count, key, parts) {

		switch (getType(node)) {
			case FUN:
				// execute code block
				// Closure Compiler type cast
				return (/** @type {function(*,*,*,*):(Object|null)} */ (node))(data, index, count, key);

			case ARY:
				// inspect element name for template commands
				/**
				 * @type {string}
				 */
				var tag = node[0] || '';
				switch (tag) {
					case FOR:
						return loop(node, data, index, count, key, parts);

					case XOR:
						return xor(node, data, index, count, key, parts);

					case IF:
						return xor([XOR, node], data, index, count, key, parts);

					case CALL:
						// parts not needed when calling another view
						return call(node, data, index, count, key);

					case PART:
						return part(node, data, index, count, key, parts);
				}

				// element array, first item is name
				var elem = [tag];
				for (var i=1, length=node.length; i<length; i++) {
					append(elem, bind(node[i], data, index, count, key, parts));
				}
				return elem;

			case OBJ:
				// attribute map
				var attr = {};
				for (var k in node) {
					if (node.hasOwnProperty(k)) {
						// parts not needed when binding attributes
						attr[k] = bind(node[k], data, index, count, key);
					}
				}
				return attr;
		}

		// literal values
		return node;
	};

	/* factory.js --------------------*/

	/**
	 * Renders an error as text
	 * 
	 * @private
	 * @param {Error} ex The exception
	 * @return {string}
	 */
	function onError(ex) {
		return '['+ex+']';
	}

	/**
	 * Wraps a view definition with binding method
	 * 
	 * @private
	 * @param {Array|Object|string|number} view The template definition
	 * @return {function(*)}
	 */
	function factory(view) {
		if (getType(view) !== ARY) {
			// ensure is rooted element
			view = ['', view];
		}

		/**
		 * Binds and wraps the result
		 * 
		 * @public
		 * @param {*} data The data item being bound
		 * @param {number} index The index of the current data item
		 * @param {number} count The total number of data items
		 * @param {string|null} key The current property name
		 * @return {Result}
		 */
		var self = function(data, index, count, key) {
			try {
				var result = bind(
					// Closure Compiler type cast
					/** @type {Array} */(view),
					data,
					isFinite(index) ? index : 0,
					isFinite(count) ? count : 1,
					isString(key) ? key : null);
				return new Result(result);
			} catch (ex) {
				// handle error with context
				return new Result(onError(ex));
			}
		};

		/**
		 * Gets the internal view definition
		 * 
		 * @private
		 * @return {Array}
		 */
		self.getView = function() {
			// Closure Compiler type cast
			return /** @type {Array} */(view);
		};

		return self;
	}

	/**
	 * @public
	 * @param {Array|Object|string|number|function(*,number,number):Array|Object|string} view The view template
	 * @return {Array|Object|string|number}
	 */
	var duel = function(view) {
		return (isFunction(view) && isFunction(view.getView)) ? view : factory(view);
	};

	/**
	 * @public
	 * @param {string} value Markup text
	 * @return {Markup}
	 */
	duel.raw = function(value) {
		return new Markup(value);
	};

	/* render.js --------------------*/
	
	/**
	 * Void tag lookup
	 *  
	 * @private
	 * @constant
	 * @type {Object.<boolean>}
	 */
	var VOID_TAGS = {
		'area' : true,
		'base' : true,
		'basefont' : true,
		'br' : true,
		'col' : true,
		'frame' : true,
		'hr' : true,
		'img' : true,
		'input' : true,
		'isindex' : true,
		'keygen' : true,
		'link' : true,
		'meta' : true,
		'param' : true,
		'source' : true,
		'wbr' : true
	};

	/**
	 * Boolean attribute map
	 * 
	 * @private
	 * @constant
	 * @type {Object.<number>}
	 */
	var ATTR_BOOL = {
		'async': 1,
		'checked': 1,
		'defer': 1,
		'disabled': 1,
		'hidden': 1,
		'novalidate': 1,
		'formnovalidate': 1
		// can add more attributes here as needed
	};

	/**
	 * Encodes invalid literal characters in strings
	 * 
	 * @private
	 * @param {Array|Object|string|number} val The value
	 * @return {Array|Object|string|number}
	 */
	function htmlEncode(val) {
		if (!isString(val)) {
			return val;
		}
	
		return val.replace(/[&<>]/g,
			function(ch) {
				switch(ch) {
					case '&':
						return '&amp;';
					case '<':
						return '&lt;';
					case '>':
						return '&gt;';
					default:
						return ch;
				}
			});
	}

	/**
	 * Encodes invalid attribute characters in strings
	 * 
	 * @private
	 * @param {Array|Object|string|number} val The value
	 * @return {Array|Object|string|number}
	 */
	function attrEncode(val) {
		if (!isString(val)) {
			return val;
		}
	
		return val.replace(/[&<>"]/g,
			function(ch) {
				switch(ch) {
					case '&':
						return '&amp;';
					case '<':
						return '&lt;';
					case '>':
						return '&gt;';
					case '"':
						return '&quot;';
					default:
						return ch;
				}
			});
	}

	/**
	 * Renders the comment as a string
	 * 
	 * @private
	 * @param {Buffer} buffer The output buffer
	 * @param {Array} node The result tree
	 */
	function renderComment(buffer, node) {
		if (node[0] === '!DOCTYPE') {
			// emit doctype
			buffer.append('<!DOCTYPE ', node[1], '>');
		} else {
			// emit HTML comment
			buffer.append('<!--', node[1], '-->');
		}
	}

	/**
	 * Renders the element as a string
	 * 
	 * @private
	 * @param {Buffer} buffer The output buffer
	 * @param {Array} node The result tree
	 */
	function renderElem(buffer, node) {

		var tag = node[0] || '',
			length = node.length,
			i = 1,
			child,
			isVoid = VOID_TAGS[tag];

		if (tag.charAt(0) === '!') {
			renderComment(buffer, node);
			return;
		}
		if (tag) {
			// emit open tag
			buffer.append('<', tag);

			child = node[i];
			if (getType(child) === OBJ) {
				// emit attributes
				for (var name in child) {
					if (child.hasOwnProperty(name)) {
						var val = child[name];
						if (ATTR_BOOL[name]) {
							if (val) {
								val = name;
							} else {
								// falsey boolean attributes must not be present
								continue;
							}
						}

						buffer.append(' ', name);
						if (getType(val) !== NUL) {
							// Closure Compiler type cast
							buffer.append('="', /** @type{string} */(attrEncode(val)), '"');
						}
					}
				}
				i++;
			}
			if (isVoid) {
				buffer.append(' /');
			}
			buffer.append('>');
		}

		// emit children
		for (; i<length; i++) {
			child = node[i];
			if (isArray(child)) {
				renderElem(buffer, child);
			} else {
				// encode string literals
				// Closure Compiler type cast
				buffer.append(/** @type{string} */(htmlEncode(child)));
			}
		}

		if (tag && !isVoid) {
			// emit close tag
			buffer.append('</', tag, '>');
		}
	}

	/**
	 * Renders the result as a string
	 * 
	 * @private
	 * @param {Array} view The compiled view
	 * @return {string}
	 */
	 function render(view) {
		try {
			var buffer = new Buffer();
			renderElem(buffer, view);
			return buffer.toString();
		} catch (ex) {
			// handle error with context
			return onError(ex);
		}
	}

	/**
	 * Returns result as HTML text
	 * 
	 * @public
	 * @override
	 * @this {Result}
	 * @return {string}
	 */
	Result.prototype.toString = function() {
		return render(this.value);
	};

	/**
	 * Immediately writes the resulting value to the document
	 * 
	 * @public
	 * @this {Result}
	 * @param {Document} doc optional Document reference
	 */
	Result.prototype.write = function(doc) {
		/*jslint evil:true*/
		(doc||document).write(''+this);
		/*jslint evil:false*/
	};

	/* dom.js --------------------*/

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var INIT = '$init';

	/**
	 * @private
	 * @constant
	 * @type {string}
	 */
	var LOAD = '$load';

	/**
	 * Attribute name map
	 * 
	 * @private
	 * @constant
	 * @type {Object.<string>}
	 */
	var ATTR_MAP = {
		'rowspan': 'rowSpan',
		'colspan': 'colSpan',
		'cellpadding': 'cellPadding',
		'cellspacing': 'cellSpacing',
		'tabindex': 'tabIndex',
		'accesskey': 'accessKey',
		'hidefocus': 'hideFocus',
		'usemap': 'useMap',
		'maxlength': 'maxLength',
		'readonly': 'readOnly',
		'contenteditable': 'contentEditable'
		// can add more attributes here as needed
	};

	/**
	 * Attribute duplicates map
	 * 
	 * @private
	 * @constant
	 * @type {Object.<string>}
	 */
	var ATTR_DUP = {
		'enctype': 'encoding',
		'onscroll': 'DOMMouseScroll',
		'checked': 'defaultChecked'
		// can add more attributes here as needed
	};

	/**
	 * Leading SGML line ending pattern
	 * 
	 * @private
	 * @constant
	 * @type {RegExp}
	 */
	var LEADING = /^[\r\n]+/;

	/**
	 * Trailing SGML line ending pattern
	 * 
	 * @private
	 * @constant
	 * @type {RegExp}
	 */
	var TRAILING = /[\r\n]+$/;

	/**
	 * Creates a DOM element 
	 * 
	 * @private
	 * @param {string} tag The element's tag name
	 * @return {Node}
	 */
	function createElement(tag) {
		if (!tag) {
			// create a document fragment to hold multiple-root elements
			if (document.createDocumentFragment) {
				return document.createDocumentFragment();
			}

			tag = '';

		} else if (tag.charAt(0) === '!') {
			return document.createComment(tag === '!' ? '' : tag.substr(1)+' ');
		}

		if (tag.toLowerCase() === 'style' && document.createStyleSheet) {
			// IE requires this interface for styles
			return document.createStyleSheet();
		}

		return document.createElement(tag);
	}

	/**
	 * Appends a child to an element
	 * 
	 * @private
	 * @param {Node} elem The parent element
	 * @param {Node} child The child
	 */
	function appendDOM(elem, child) {
		if (child) {
			var tag = (elem.tagName||'').toLowerCase();
			if (elem.nodeType === 8) { // comment
				if (child.nodeType === 3) { // text node
					elem.nodeValue += child.nodeValue;
				}
			} else if (tag === 'table' && elem.tBodies) {
				if (!child.tagName) {
					// must unwrap documentFragment for tables
					if (child.nodeType === 11) {
						while (child.firstChild) {
							appendDOM(elem, child.removeChild(child.firstChild));
						}
					}
					return;
				}

				// in IE must explicitly nest TRs in TBODY
				var childTag = child.tagName.toLowerCase();// child tagName
				if (childTag && childTag !== 'tbody' && childTag !== 'thead') {
					// insert in last tbody
					var tBody = elem.tBodies.length > 0 ? elem.tBodies[elem.tBodies.length-1] : null;
					if (!tBody) {
						tBody = createElement(childTag === 'th' ? 'thead' : 'tbody');
						elem.appendChild(tBody);
					}
					tBody.appendChild(child);
				} else if (elem.canHaveChildren !== false) {
					elem.appendChild(child);
				}

			} else if (tag === 'style' && document.createStyleSheet) {
				// IE requires this interface for styles
				elem.cssText = child;

			} else if (elem.canHaveChildren !== false) {
				elem.appendChild(child);

			} else if (tag === 'object' &&
				child.tagName && child.tagName.toLowerCase() === 'param') {
					// IE-only path
					try {
						elem.appendChild(child);
					} catch (ex1) {}
					try {
						if (elem.object) {
							elem.object[child.name] = child.value;
						}
					} catch (ex2) {}
			}
		}
	}

	/**
	 * Adds an event handler to an element
	 * 
	 * @private
	 * @param {Node} elem The element
	 * @param {string} name The event name
	 * @param {function(Event)} handler The event handler
	 */
	function addHandler(elem, name, handler) {
		switch (typeof handler) {
			case 'function':
				if (elem.addEventListener) {
					// DOM Level 2
					elem.addEventListener((name.substr(0,2) === 'on') ? name.substr(2) : name, handler, false);
				} else {
					// DOM Level 0
					elem[name] = handler;
				}
				break;

			case 'string':
				// inline functions are DOM Level 0
				/*jslint evil:true */
				elem[name] = new Function('event', handler);
				/*jslint evil:false */
				break;
		}
	}

	/**
	 * Appends a child to an element
	 * 
	 * @private
	 * @param {Node} elem The element
	 * @param {Object} attr Attributes object
	 * @return {Node}
	 */
	function addAttributes(elem, attr) {
		if (attr.name && document.attachEvent && !elem.parentNode) {
			try {
				// IE fix for not being able to programatically change the name attribute
				var alt = createElement('<'+elem.tagName+' name="'+attr.name+'">');
				// fix for Opera 8.5 and Netscape 7.1 creating malformed elements
				if (elem.tagName === alt.tagName) {
					elem = alt;
				}
			} catch (ex) { }
		}

		// for each attributeName
		for (var name in attr) {
			if (attr.hasOwnProperty(name)) {
				// attributeValue
				var value = attr[name],
					type = getType(value);

				if (name) {
					if (type === NUL) {
						value = '';
						type = VAL;
					}

					name = ATTR_MAP[name.toLowerCase()] || name;
					if (ATTR_BOOL[name]) {
						elem[name] = !!value;

						// also set duplicated attributes
						if (ATTR_DUP[name]) {
							elem[ATTR_DUP[name]] = !!value;
						}

					} else if (name === 'style') {
						if (typeof elem.style.cssText !== 'undefined') {
							elem.style.cssText = value;
						} else {
							elem.style = value;
						}

					} else if (name === 'class') {
						elem.className = value;

					} else if (name.substr(0,2) === 'on') {
						addHandler(elem, name, value);

						// also set duplicated events
						if (ATTR_DUP[name]) {
							addHandler(elem, ATTR_DUP[name], value);
						}

					} else if (type === VAL && name.charAt(0) !== '$') {
						elem.setAttribute(name, value);
	
						// also set duplicated attributes
						if (ATTR_DUP[name]) {
							elem.setAttribute(ATTR_DUP[name], value);
						}

					} else {
						// allow direct setting of complex properties
						elem[name] = value;

						// also set duplicated attributes
						if (ATTR_DUP[name]) {
							elem[ATTR_DUP[name]] = value;
						}
					}
				}
			}
		}
		return elem;
	}

	/**
	 * Tests a node for whitespace
	 * 
	 * @private
	 * @param {Node} node The node
	 * @return {boolean}
	 */
	function isWhitespace(node) {
		return !!node && (node.nodeType === 3) && (!node.nodeValue || !/\S/.exec(node.nodeValue));
	}

	/**
	 * Trims whitespace pattern from the text node
	 * 
	 * @private
	 * @param {Node} node The node
	 */
	function trimPattern(node, pattern) {
		if (!!node && (node.nodeType === 3) && pattern.exec(node.nodeValue)) {
			node.nodeValue = node.nodeValue.replace(pattern, '');
		}
	}

	/**
	 * Removes leading and trailing whitespace nodes
	 * 
	 * @private
	 * @param {Node} elem The node
	 */
	function trimWhitespace(elem) {
		if (elem) {
			while (isWhitespace(elem.firstChild)) {
				// trim leading whitespace text nodes
				elem.removeChild(elem.firstChild);
			}
			// trim leading whitespace text
			trimPattern(elem.firstChild, LEADING);
			while (isWhitespace(elem.lastChild)) {
				// trim trailing whitespace text nodes
				elem.removeChild(elem.lastChild);
			}
			// trim trailing whitespace text
			trimPattern(elem.lastChild, TRAILING);
		}
	}

	/**
	 * Converts the markup to DOM nodes
	 * 
	 * @private
	 * @param {string|Markup} value The node
	 * @return {Node}
	 */
	function toDOM(value) {
		var wrapper = createElement('div');
		wrapper.innerHTML = ''+value;
	
		// trim extraneous whitespace
		trimWhitespace(wrapper);

		// eliminate wrapper for single nodes
		if (wrapper.childNodes.length === 1) {
			return wrapper.firstChild;
		}

		// create a document fragment to hold elements
		var frag = createElement('');
		while (wrapper.firstChild) {
			frag.appendChild(wrapper.firstChild);
		}
		return frag;
	}

	/**
	 * Retrieve and remove method
	 * 
	 * @private
	 * @param {Node} elem The element
	 * @param {string} key The callback name
	 * @return {function(Node)}
	 */
	function popCallback(elem, key) {
		var method = elem[key];
		if (method) {
			try {
				delete elem[key];
			} catch (ex) {
				// sometimes IE doesn't like deleting from DOM
				elem[key] = undef;
			}

			if (!isFunction(method)) {
				try {
					/*jslint evil:true */
					method = new Function(''+method);
					/*jslint evil:false */
				} catch (ex2) {
					// filter
					method = null;
				}
			}
		}

		return method;
	}

	/**
	 * Executes oninit/onload callbacks
	 * 
	 * @private
	 * @param {Node} elem The element
	 */
	function callbacks(elem) {
		if (!elem) {
			return;
		}

		// execute and remove oninit method
		var method = popCallback(elem, INIT);
		if (method) {
			// execute in context of element
			method.call(elem);
		}

		// execute and remove onload method
		method = popCallback(elem, LOAD);
		if (method) {
			// queue up to execute after insertion into parentNode
			setTimeout(function() {
				// execute in context of element
				method.call(elem);
				method = elem = null;
			}, 0);
		} else {
			method = elem = null;
		}
	}

	/**
	 * Applies node to DOM
	 * 
	 * @private
	 * @param {Node} elem The element to append
	 * @param {Array} node The node to populate
	 * @return {Node}
	 */
	function patchDOM(elem, node) {
		for (var i=1, length=node.length; i<length; i++) {
			var child = node[i];
			switch (getType(child)) {
				case ARY:
					// build child element
					var childTag = child[0];
					child = patchDOM(createElement(childTag), child);

					if (childTag === 'html') {
						// trim extraneous whitespace
						trimWhitespace(child);

						// trigger callbacks
						callbacks(child);

						// unwrap HTML root, to simplify insertion
						return child;
					}

					// append child element
					appendDOM(elem, child);
					break;
				case VAL:
					if (child !== '') {
						// append child value as text
						appendDOM(elem, document.createTextNode(''+child));
					}
					break;
				case OBJ:
					if (elem.nodeType === 1) {
						// add attributes
						elem = addAttributes(elem, child);
					}
					break;
				case RAW:
					appendDOM(elem, toDOM(child));
					break;
			}
		}

		// trim extraneous whitespace
		trimWhitespace(elem);

		// trigger callbacks
		callbacks(elem);

		// eliminate wrapper for single nodes
		if (elem.nodeType === 11 && elem.childNodes.length === 1) {
			elem = elem.firstChild;
		}

		return elem;
	}

	/**
	 * Renders an error as a text node
	 * 
	 * @private
	 * @param {Error} ex The exception
	 * @return {Node}
	 */
	function onErrorDOM(ex) {
		return document.createTextNode(onError(ex));
	}

	/**
	 * Returns result as DOM objects
	 * 
	 * @public
	 * @this {Result}
	 * @param {Node|string=} elem An optional element or element ID to be replaced or merged
	 * @param {boolean=} merge Optionally merge result into elem
	 * @return {Node|null}
	 */
	Result.prototype.toDOM = function(elem, merge) {
		// resolve the element ID
		if (getType(elem) === VAL) {
			elem = document.getElementById(
				// Closure Compiler type cast
				/** @type{string} */(elem));
		}

		var view;
		try {
			if (merge) {
				view = elem;
				elem = null;
			}
			// Closure Compiler type cast
			view = patchDOM(/** @type{Node} */(view) || createElement(this.value[0]), this.value);

		} catch (ex) {
			// handle error with context
			view = onErrorDOM(ex);
		}

		if (elem && elem.parentNode) {
			// replace existing element with result
			// Closure Compiler type cast
			elem.parentNode.replaceChild(view, /** @type{Node} */(elem));
		}

		return view;
	};

	/**
	 * Replaces entire document with this Result
	 * 
	 * @public
	 * @this {Result}
	 */
	Result.prototype.reload = function() {
		// http://stackoverflow.com/questions/4297877
		var doc = document;
		try {
			var newRoot = this.toDOM();
			doc.replaceChild(newRoot, doc.documentElement);

			if (doc.createStyleSheet) {
				// IE requires link repair
				var head = newRoot.firstChild;
				while (head && (head.tagName||'') !== 'HEAD') {
					head = head.nextSibling;
				}

				var link = head && head.firstChild;
				while (link) {
					if ((link.tagName||'') === 'LINK') {
						// this seems to repair the link
						link.href = link.href;
					}
					link = link.nextSibling;
				}
			}

		} catch (ex) {
			/*jslint evil:true*/
			doc = doc.open('text/html');
			doc.write(this.toString());
			doc.close();
			/*jslint evil:false*/
		}
	};

	return duel;

})(document, window.ScriptEngineMajorVersion);
