/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict'

	__webpack_require__(2)
	const core = __webpack_require__(4)

	const nx = {
	  component: core.component,
	  symbols: core.symbols,
	  middlewares: __webpack_require__(11),
	  components: __webpack_require__(29),
	  observer: __webpack_require__(7),
	  compiler: __webpack_require__(14)
	}

	if (module && module.exports) {
	  module.exports = nx
	}
	window.nx = nx

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	__webpack_require__(3)


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*!
	Copyright (C) 2014-2015 by WebReflection
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/
	(function(window, document, Object, REGISTER_ELEMENT){'use strict';

	// in case it's there or already patched
	if (REGISTER_ELEMENT in document) return;

	// DO NOT USE THIS FILE DIRECTLY, IT WON'T WORK
	// THIS IS A PROJECT BASED ON A BUILD SYSTEM
	// THIS FILE IS JUST WRAPPED UP RESULTING IN
	// build/document-register-element.js
	// and its .max.js counter part

	var
	  // IE < 11 only + old WebKit for attributes + feature detection
	  EXPANDO_UID = '__' + REGISTER_ELEMENT + (Math.random() * 10e4 >> 0),

	  // shortcuts and costants
	  ATTACHED = 'attached',
	  DETACHED = 'detached',
	  EXTENDS = 'extends',
	  ADDITION = 'ADDITION',
	  MODIFICATION = 'MODIFICATION',
	  REMOVAL = 'REMOVAL',
	  DOM_ATTR_MODIFIED = 'DOMAttrModified',
	  DOM_CONTENT_LOADED = 'DOMContentLoaded',
	  DOM_SUBTREE_MODIFIED = 'DOMSubtreeModified',
	  PREFIX_TAG = '<',
	  PREFIX_IS = '=',

	  // valid and invalid node names
	  validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,
	  invalidNames = [
	    'ANNOTATION-XML',
	    'COLOR-PROFILE',
	    'FONT-FACE',
	    'FONT-FACE-SRC',
	    'FONT-FACE-URI',
	    'FONT-FACE-FORMAT',
	    'FONT-FACE-NAME',
	    'MISSING-GLYPH'
	  ],

	  // registered types and their prototypes
	  types = [],
	  protos = [],

	  // to query subnodes
	  query = '',

	  // html shortcut used to feature detect
	  documentElement = document.documentElement,

	  // ES5 inline helpers || basic patches
	  indexOf = types.indexOf || function (v) {
	    for(var i = this.length; i-- && this[i] !== v;){}
	    return i;
	  },

	  // other helpers / shortcuts
	  OP = Object.prototype,
	  hOP = OP.hasOwnProperty,
	  iPO = OP.isPrototypeOf,

	  defineProperty = Object.defineProperty,
	  gOPD = Object.getOwnPropertyDescriptor,
	  gOPN = Object.getOwnPropertyNames,
	  gPO = Object.getPrototypeOf,
	  sPO = Object.setPrototypeOf,

	  // jshint proto: true
	  hasProto = !!Object.__proto__,

	  // used to create unique instances
	  create = Object.create || function Bridge(proto) {
	    // silly broken polyfill probably ever used but short enough to work
	    return proto ? ((Bridge.prototype = proto), new Bridge()) : this;
	  },

	  // will set the prototype if possible
	  // or copy over all properties
	  setPrototype = sPO || (
	    hasProto ?
	      function (o, p) {
	        o.__proto__ = p;
	        return o;
	      } : (
	    (gOPN && gOPD) ?
	      (function(){
	        function setProperties(o, p) {
	          for (var
	            key,
	            names = gOPN(p),
	            i = 0, length = names.length;
	            i < length; i++
	          ) {
	            key = names[i];
	            if (!hOP.call(o, key)) {
	              defineProperty(o, key, gOPD(p, key));
	            }
	          }
	        }
	        return function (o, p) {
	          do {
	            setProperties(o, p);
	          } while ((p = gPO(p)) && !iPO.call(p, o));
	          return o;
	        };
	      }()) :
	      function (o, p) {
	        for (var key in p) {
	          o[key] = p[key];
	        }
	        return o;
	      }
	  )),

	  // DOM shortcuts and helpers, if any

	  MutationObserver = window.MutationObserver ||
	                     window.WebKitMutationObserver,

	  HTMLElementPrototype = (
	    window.HTMLElement ||
	    window.Element ||
	    window.Node
	  ).prototype,

	  IE8 = !iPO.call(HTMLElementPrototype, documentElement),

	  isValidNode = IE8 ?
	    function (node) {
	      return node.nodeType === 1;
	    } :
	    function (node) {
	      return iPO.call(HTMLElementPrototype, node);
	    },

	  targets = IE8 && [],

	  cloneNode = HTMLElementPrototype.cloneNode,
	  dispatchEvent = HTMLElementPrototype.dispatchEvent,
	  getAttribute = HTMLElementPrototype.getAttribute,
	  hasAttribute = HTMLElementPrototype.hasAttribute,
	  removeAttribute = HTMLElementPrototype.removeAttribute,
	  setAttribute = HTMLElementPrototype.setAttribute,

	  // replaced later on
	  createElement = document.createElement,

	  // shared observer for all attributes
	  attributesObserver = MutationObserver && {
	    attributes: true,
	    characterData: true,
	    attributeOldValue: true
	  },

	  // useful to detect only if there's no MutationObserver
	  DOMAttrModified = MutationObserver || function(e) {
	    doesNotSupportDOMAttrModified = false;
	    documentElement.removeEventListener(
	      DOM_ATTR_MODIFIED,
	      DOMAttrModified
	    );
	  },

	  // will both be used to make DOMNodeInserted asynchronous
	  asapQueue,
	  rAF = window.requestAnimationFrame ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame ||
	        window.msRequestAnimationFrame ||
	        function (fn) { setTimeout(fn, 10); },

	  // internal flags
	  setListener = false,
	  doesNotSupportDOMAttrModified = true,
	  dropDomContentLoaded = true,

	  // needed for the innerHTML helper
	  notFromInnerHTMLHelper = true,

	  // optionally defined later on
	  onSubtreeModified,
	  callDOMAttrModified,
	  getAttributesMirror,
	  observer,

	  // based on setting prototype capability
	  // will check proto or the expando attribute
	  // in order to setup the node once
	  patchIfNotAlready,
	  patch
	;

	if (sPO || hasProto) {
	    patchIfNotAlready = function (node, proto) {
	      if (!iPO.call(proto, node)) {
	        setupNode(node, proto);
	      }
	    };
	    patch = setupNode;
	} else {
	    patchIfNotAlready = function (node, proto) {
	      if (!node[EXPANDO_UID]) {
	        node[EXPANDO_UID] = Object(true);
	        setupNode(node, proto);
	      }
	    };
	    patch = patchIfNotAlready;
	}
	if (IE8) {
	  doesNotSupportDOMAttrModified = false;
	  (function (){
	    var
	      descriptor = gOPD(HTMLElementPrototype, 'addEventListener'),
	      addEventListener = descriptor.value,
	      patchedRemoveAttribute = function (name) {
	        var e = new CustomEvent(DOM_ATTR_MODIFIED, {bubbles: true});
	        e.attrName = name;
	        e.prevValue = getAttribute.call(this, name);
	        e.newValue = null;
	        e[REMOVAL] = e.attrChange = 2;
	        removeAttribute.call(this, name);
	        dispatchEvent.call(this, e);
	      },
	      patchedSetAttribute = function (name, value) {
	        var
	          had = hasAttribute.call(this, name),
	          old = had && getAttribute.call(this, name),
	          e = new CustomEvent(DOM_ATTR_MODIFIED, {bubbles: true})
	        ;
	        setAttribute.call(this, name, value);
	        e.attrName = name;
	        e.prevValue = had ? old : null;
	        e.newValue = value;
	        if (had) {
	          e[MODIFICATION] = e.attrChange = 1;
	        } else {
	          e[ADDITION] = e.attrChange = 0;
	        }
	        dispatchEvent.call(this, e);
	      },
	      onPropertyChange = function (e) {
	        // jshint eqnull:true
	        var
	          node = e.currentTarget,
	          superSecret = node[EXPANDO_UID],
	          propertyName = e.propertyName,
	          event
	        ;
	        if (superSecret.hasOwnProperty(propertyName)) {
	          superSecret = superSecret[propertyName];
	          event = new CustomEvent(DOM_ATTR_MODIFIED, {bubbles: true});
	          event.attrName = superSecret.name;
	          event.prevValue = superSecret.value || null;
	          event.newValue = (superSecret.value = node[propertyName] || null);
	          if (event.prevValue == null) {
	            event[ADDITION] = event.attrChange = 0;
	          } else {
	            event[MODIFICATION] = event.attrChange = 1;
	          }
	          dispatchEvent.call(node, event);
	        }
	      }
	    ;
	    descriptor.value = function (type, handler, capture) {
	      if (
	        type === DOM_ATTR_MODIFIED &&
	        this.attributeChangedCallback &&
	        this.setAttribute !== patchedSetAttribute
	      ) {
	        this[EXPANDO_UID] = {
	          className: {
	            name: 'class',
	            value: this.className
	          }
	        };
	        this.setAttribute = patchedSetAttribute;
	        this.removeAttribute = patchedRemoveAttribute;
	        addEventListener.call(this, 'propertychange', onPropertyChange);
	      }
	      addEventListener.call(this, type, handler, capture);
	    };
	    defineProperty(HTMLElementPrototype, 'addEventListener', descriptor);
	  }());
	} else if (!MutationObserver) {
	  documentElement.addEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
	  documentElement.setAttribute(EXPANDO_UID, 1);
	  documentElement.removeAttribute(EXPANDO_UID);
	  if (doesNotSupportDOMAttrModified) {
	    onSubtreeModified = function (e) {
	      var
	        node = this,
	        oldAttributes,
	        newAttributes,
	        key
	      ;
	      if (node === e.target) {
	        oldAttributes = node[EXPANDO_UID];
	        node[EXPANDO_UID] = (newAttributes = getAttributesMirror(node));
	        for (key in newAttributes) {
	          if (!(key in oldAttributes)) {
	            // attribute was added
	            return callDOMAttrModified(
	              0,
	              node,
	              key,
	              oldAttributes[key],
	              newAttributes[key],
	              ADDITION
	            );
	          } else if (newAttributes[key] !== oldAttributes[key]) {
	            // attribute was changed
	            return callDOMAttrModified(
	              1,
	              node,
	              key,
	              oldAttributes[key],
	              newAttributes[key],
	              MODIFICATION
	            );
	          }
	        }
	        // checking if it has been removed
	        for (key in oldAttributes) {
	          if (!(key in newAttributes)) {
	            // attribute removed
	            return callDOMAttrModified(
	              2,
	              node,
	              key,
	              oldAttributes[key],
	              newAttributes[key],
	              REMOVAL
	            );
	          }
	        }
	      }
	    };
	    callDOMAttrModified = function (
	      attrChange,
	      currentTarget,
	      attrName,
	      prevValue,
	      newValue,
	      action
	    ) {
	      var e = {
	        attrChange: attrChange,
	        currentTarget: currentTarget,
	        attrName: attrName,
	        prevValue: prevValue,
	        newValue: newValue
	      };
	      e[action] = attrChange;
	      onDOMAttrModified(e);
	    };
	    getAttributesMirror = function (node) {
	      for (var
	        attr, name,
	        result = {},
	        attributes = node.attributes,
	        i = 0, length = attributes.length;
	        i < length; i++
	      ) {
	        attr = attributes[i];
	        name = attr.name;
	        if (name !== 'setAttribute') {
	          result[name] = attr.value;
	        }
	      }
	      return result;
	    };
	  }
	}

	function loopAndVerify(list, action) {
	  for (var i = 0, length = list.length; i < length; i++) {
	    verifyAndSetupAndAction(list[i], action);
	  }
	}

	function loopAndSetup(list) {
	  for (var i = 0, length = list.length, node; i < length; i++) {
	    node = list[i];
	    patch(node, protos[getTypeIndex(node)]);
	  }
	}

	function executeAction(action) {
	  return function (node) {
	    if (isValidNode(node)) {
	      verifyAndSetupAndAction(node, action);
	      loopAndVerify(
	        node.querySelectorAll(query),
	        action
	      );
	    }
	  };
	}

	function getTypeIndex(target) {
	  var
	    is = getAttribute.call(target, 'is'),
	    nodeName = target.nodeName.toUpperCase(),
	    i = indexOf.call(
	      types,
	      is ?
	          PREFIX_IS + is.toUpperCase() :
	          PREFIX_TAG + nodeName
	    )
	  ;
	  return is && -1 < i && !isInQSA(nodeName, is) ? -1 : i;
	}

	function isInQSA(name, type) {
	  return -1 < query.indexOf(name + '[is="' + type + '"]');
	}

	function onDOMAttrModified(e) {
	  var
	    node = e.currentTarget,
	    attrChange = e.attrChange,
	    attrName = e.attrName,
	    target = e.target
	  ;
	  if (notFromInnerHTMLHelper &&
	      (!target || target === node) &&
	      node.attributeChangedCallback &&
	      attrName !== 'style' &&
	      e.prevValue !== e.newValue) {
	    node.attributeChangedCallback(
	      attrName,
	      attrChange === e[ADDITION] ? null : e.prevValue,
	      attrChange === e[REMOVAL] ? null : e.newValue
	    );
	  }
	}

	function onDOMNode(action) {
	  var executor = executeAction(action);
	  return function (e) {
	    asapQueue.push(executor, e.target);
	  };
	}

	function onReadyStateChange(e) {
	  if (dropDomContentLoaded) {
	    dropDomContentLoaded = false;
	    e.currentTarget.removeEventListener(DOM_CONTENT_LOADED, onReadyStateChange);
	  }
	  loopAndVerify(
	    (e.target || document).querySelectorAll(query),
	    e.detail === DETACHED ? DETACHED : ATTACHED
	  );
	  if (IE8) purge();
	}

	function patchedSetAttribute(name, value) {
	  // jshint validthis:true
	  var self = this;
	  setAttribute.call(self, name, value);
	  onSubtreeModified.call(self, {target: self});
	}

	function setupNode(node, proto) {
	  setPrototype(node, proto);
	  if (observer) {
	    observer.observe(node, attributesObserver);
	  } else {
	    if (doesNotSupportDOMAttrModified) {
	      node.setAttribute = patchedSetAttribute;
	      node[EXPANDO_UID] = getAttributesMirror(node);
	      node.addEventListener(DOM_SUBTREE_MODIFIED, onSubtreeModified);
	    }
	    node.addEventListener(DOM_ATTR_MODIFIED, onDOMAttrModified);
	  }
	  if (node.createdCallback && notFromInnerHTMLHelper) {
	    node.created = true;
	    node.createdCallback();
	    node.created = false;
	  }
	}

	function purge() {
	  for (var
	    node,
	    i = 0,
	    length = targets.length;
	    i < length; i++
	  ) {
	    node = targets[i];
	    if (!documentElement.contains(node)) {
	      length--;
	      targets.splice(i--, 1);
	      verifyAndSetupAndAction(node, DETACHED);
	    }
	  }
	}

	function throwTypeError(type) {
	  throw new Error('A ' + type + ' type is already registered');
	}

	function verifyAndSetupAndAction(node, action) {
	  var
	    fn,
	    i = getTypeIndex(node)
	  ;
	  if (-1 < i) {
	    patchIfNotAlready(node, protos[i]);
	    i = 0;
	    if (action === ATTACHED && !node[ATTACHED]) {
	      node[DETACHED] = false;
	      node[ATTACHED] = true;
	      i = 1;
	      if (IE8 && indexOf.call(targets, node) < 0) {
	        targets.push(node);
	      }
	    } else if (action === DETACHED && !node[DETACHED]) {
	      node[ATTACHED] = false;
	      node[DETACHED] = true;
	      i = 1;
	    }
	    if (i && (fn = node[action + 'Callback'])) fn.call(node);
	  }
	}

	// set as enumerable, writable and configurable
	document[REGISTER_ELEMENT] = function registerElement(type, options) {
	  upperType = type.toUpperCase();
	  if (!setListener) {
	    // only first time document.registerElement is used
	    // we need to set this listener
	    // setting it by default might slow down for no reason
	    setListener = true;
	    if (MutationObserver) {
	      observer = (function(attached, detached){
	        function checkEmAll(list, callback) {
	          for (var i = 0, length = list.length; i < length; callback(list[i++])){}
	        }
	        return new MutationObserver(function (records) {
	          for (var
	            current, node, newValue,
	            i = 0, length = records.length; i < length; i++
	          ) {
	            current = records[i];
	            if (current.type === 'childList') {
	              checkEmAll(current.addedNodes, attached);
	              checkEmAll(current.removedNodes, detached);
	            } else {
	              node = current.target;
	              if (notFromInnerHTMLHelper &&
	                  node.attributeChangedCallback &&
	                  current.attributeName !== 'style') {
	                newValue = getAttribute.call(node, current.attributeName);
	                if (newValue !== current.oldValue) {
	                  node.attributeChangedCallback(
	                    current.attributeName,
	                    current.oldValue,
	                    newValue
	                  );
	                }
	              }
	            }
	          }
	        });
	      }(executeAction(ATTACHED), executeAction(DETACHED)));
	      observer.observe(
	        document,
	        {
	          childList: true,
	          subtree: true
	        }
	      );
	    } else {
	      asapQueue = [];
	      rAF(function ASAP() {
	        while (asapQueue.length) {
	          asapQueue.shift().call(
	            null, asapQueue.shift()
	          );
	        }
	        rAF(ASAP);
	      });
	      document.addEventListener('DOMNodeInserted', onDOMNode(ATTACHED));
	      document.addEventListener('DOMNodeRemoved', onDOMNode(DETACHED));
	    }

	    document.addEventListener(DOM_CONTENT_LOADED, onReadyStateChange);
	    document.addEventListener('readystatechange', onReadyStateChange);

	    document.createElement = function (localName, typeExtension) {
	      var
	        node = createElement.apply(document, arguments),
	        name = '' + localName,
	        i = indexOf.call(
	          types,
	          (typeExtension ? PREFIX_IS : PREFIX_TAG) +
	          (typeExtension || name).toUpperCase()
	        ),
	        setup = -1 < i
	      ;
	      if (typeExtension) {
	        node.setAttribute('is', typeExtension = typeExtension.toLowerCase());
	        if (setup) {
	          setup = isInQSA(name.toUpperCase(), typeExtension);
	        }
	      }
	      notFromInnerHTMLHelper = !document.createElement.innerHTMLHelper;
	      if (setup) patch(node, protos[i]);
	      return node;
	    };

	    HTMLElementPrototype.cloneNode = function (deep) {
	      var
	        node = cloneNode.call(this, !!deep),
	        i = getTypeIndex(node)
	      ;
	      if (-1 < i) patch(node, protos[i]);
	      if (deep) loopAndSetup(node.querySelectorAll(query));
	      return node;
	    };
	  }

	  if (-2 < (
	    indexOf.call(types, PREFIX_IS + upperType) +
	    indexOf.call(types, PREFIX_TAG + upperType)
	  )) {
	    throwTypeError(type);
	  }

	  if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
	    throw new Error('The type ' + type + ' is invalid');
	  }

	  var
	    constructor = function () {
	      return extending ?
	        document.createElement(nodeName, upperType) :
	        document.createElement(nodeName);
	    },
	    opt = options || OP,
	    extending = (opt[EXTENDS] !== undefined),
	    nodeName = extending ? options[EXTENDS].toUpperCase() : upperType,
	    upperType,
	    i
	  ;

	  if (extending && -1 < (
	    indexOf.call(types, PREFIX_TAG + nodeName)
	  )) {
	    throwTypeError(nodeName);
	  }

	  i = types.push((extending ? PREFIX_IS : PREFIX_TAG) + upperType) - 1;

	  query = query.concat(
	    query.length ? ',' : '',
	    extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName
	  );

	  constructor.prototype = (
	    protos[i] = hOP.call(opt, 'prototype') ?
	      opt.prototype :
	      create(HTMLElementPrototype)
	  );

	  loopAndVerify(
	    document.querySelectorAll(query),
	    ATTACHED
	  );

	  return constructor;
	};

	}(window, document, Object, 'registerElement'));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	__webpack_require__(5)

	module.exports = {
	  component: __webpack_require__(6),
	  symbols: __webpack_require__(10)
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict'

	const style = document.createElement('style')
	const cloak = document.createTextNode('[cloak] { display: none; }')
	style.appendChild(cloak)
	document.head.appendChild(style)


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const observer = __webpack_require__(7)
	const onComponentInstanceAttached = __webpack_require__(8)
	const symbols = __webpack_require__(10)

	const config = Symbol('config')

	module.exports = function component (rawConfig) {
	  return {use, useOnContent, register, [config]: validateAndCloneConfig(rawConfig)}
	}

	function use (middleware) {
	  if (typeof middleware !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  this[config].middlewares.push(middleware)
	  return this
	}

	function useOnContent (contentMiddleware) {
	  if (typeof contentMiddleware !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  this[config].contentMiddlewares.push(contentMiddleware)
	  return this
	}

	function register (name) {
	  if (typeof name !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }
	  const parentProto = this[config].element ? this[config].elementProto : HTMLElement.prototype
	  const proto = Object.create(parentProto)
	  proto.createdCallback = onComponentInstantiated
	  proto.attachedCallback = onComponentInstanceAttached
	  proto[config] = this[config]
	  document.registerElement(name, {prototype: proto, extends: this[config].element})
	  return name
	}

	function onComponentInstantiated () {
	  if (typeof this[config].state === 'object') {
	    this[symbols.state] = this[config].state
	  } else if (this[config].state === true) {
	    this[symbols.state] = observer.observable()
	  }
	  if (this[config].state === 'inherit') {
	    this[symbols.inheritState] = true
	  }
	  this[symbols.isolate] = this[config].isolate
	  this[symbols.contentMiddlewares] = this[config].contentMiddlewares.slice()
	  this[symbols.middlewares] = this[config].middlewares.slice()
	  this[symbols.registered] = true
	}

	function validateAndCloneConfig (rawConfig) {
	  if (rawConfig === undefined) {
	    rawConfig = {}
	  }
	  if (typeof rawConfig !== 'object') {
	    throw new TypeError('invalid component config, must be an object or undefined')
	  }

	  const resultConfig = {}

	  if (typeof rawConfig.state === 'boolean' || rawConfig.state === 'inherit') {
	    resultConfig.state = rawConfig.state
	  } else if (typeof rawConfig.state === 'object' && observer.isObservable(rawConfig.state)) {
	    resultConfig.state = rawConfig.state
	  } else if (rawConfig.state === undefined) {
	    resultConfig.state = true
	  } else {
	    throw new Error('invalid state config: ' + rawConfig.state)
	  }

	  if (typeof rawConfig.isolate === 'boolean' || rawConfig.isolate === 'middlewares') {
	    resultConfig.isolate = rawConfig.isolate
	  } else if (rawConfig.isolate === undefined) {
	    resultConfig.isolate = false
	  } else {
	    throw new Error(`invalid isolate config: ${rawConfig.isolate}, must be a boolean or 'middlewares'`)
	  }

	  if (typeof rawConfig.element === 'string') {
	    try {
	      resultConfig.elementProto = Object.getPrototypeOf(document.createElement(rawConfig.element))
	      resultConfig.element = rawConfig.element
	    } catch (err) {
	      throw new Error(`invalid element config: ${rawConfig.element}, must be the name of a native element`)
	    }
	  } else if (rawConfig.element !== undefined) {
	    throw new Error(`invalid element config: ${rawConfig.element}, must be the name of a native element`)
	  }

	  resultConfig.contentMiddlewares = []
	  resultConfig.middlewares = []
	  return resultConfig
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict'

	const proxy = Symbol('proxy')
	const unobserverSet = Symbol('unobserverSet')
	const observing = Symbol('observing')

	const targets = new WeakMap()
	const observerSet = new Set()
	let currentObserver

	module.exports = {
	  observe,
	  unobserve,
	  observable,
	  isObservable
	}

	function observe (fn) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  if (!fn[observing]) {
	    fn[observing] = true
	    fn[unobserverSet] = new Set()
	    queueObserver(fn)
	  }
	}

	function unobserve (fn) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  if (fn[observing]) {
	    fn[unobserverSet].forEach(runUnobserver)
	    fn[unobserverSet] = undefined
	  }
	  fn[observing] = false
	}

	function runUnobserver (unobserver) {
	  unobserver()
	}

	function observable (obj) {
	  if (obj === undefined) {
	    obj = {}
	  }
	  if (typeof obj !== 'object') {
	    throw new TypeError('first argument must be an object or undefined')
	  }
	  if (isObservable(obj)) {
	    return obj
	  }
	  if (typeof obj[proxy] === 'object') {
	    return obj[proxy]
	  }
	  obj[proxy] = new Proxy(obj, {get: get, set: set, deleteProperty: deleteProperty})
	  targets.set(obj, new Map())
	  return obj[proxy]
	}

	function isObservable (obj) {
	  if (typeof obj !== 'object') {
	    throw new TypeError('first argument must be an object')
	  }
	  return (obj[proxy] === true)
	}

	function get (target, key, receiver) {
	  if (key === proxy) {
	    return true
	  }
		let result
		try {
			result = Reflect.get(target, key, receiver)
		} catch (err) {
			result = target[key]
		}
		result = target[key]
	  if (currentObserver) {
	    registerObserver(target, key, currentObserver)
	    if (typeof result === 'object' && !(result instanceof Date)) {
	      return observable(result)
	    }
	  }
	  if (typeof result === 'object' && typeof result[proxy] === 'object') {
	    return result[proxy]
	  }
	  return result
	}

	function registerObserver (target, key, observer) {
	  let observersForKey = targets.get(target).get(key)
	  if (!observersForKey) {
	    observersForKey = new Set()
	    targets.get(target).set(key, observersForKey)
	  }
	  if (!observersForKey.has(observer)) {
	    observersForKey.add(observer)
	    observer[unobserverSet].add(() => observersForKey.delete(observer))
	  }
	}

	function set (target, key, value, receiver) {
	  if (targets.get(target).has(key)) {
	    targets.get(target).get(key).forEach(queueObserver)
	  }
	  return Reflect.set(target, key, value, receiver)
	}

	function deleteProperty (target, key) {
	  if (targets.get(target).has(key)) {
	    targets.get(target).get(key).forEach(queueObserver)
	  }
	  return Reflect.deleteProperty(target, key)
	}

	function queueObserver (observer) {
	  if (observerSet.size === 0) {
	    Promise.resolve().then(runObservers)
	  }
	  observerSet.add(observer)
	}

	function runObservers () {
	  try {
	    observerSet.forEach(runObserver)
	  } finally {
	    currentObserver = undefined
	    observerSet.clear()
	  }
	}

	function runObserver (observer) {
	  if (observer[observing]) {
	    currentObserver = observer
	    observer()
	  }
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const setupNode = __webpack_require__(9)
	const symbols = __webpack_require__(10)

	const attached = 'attached'
	const detached = 'detached'

	const contentWatcherConfig = {
	  childList: true,
	  subtree: true
	}

	module.exports = function onComponentInstanceAttached () {
	  onNodeAdded(this)
	}

	function onMutations (mutations) {
	  for (let mutation of mutations) {
	    Array.prototype.forEach.call(mutation.removedNodes, cleanupNodeAndChildren)
	    Array.prototype.forEach.call(mutation.addedNodes, onNodeAdded)
	  }
	}

	function onNodeAdded (node) {
	  const context = getContext(node)
	  if (context.isolate !== true) {
	    if (!context.contentWatcherNode) {
	      node[symbols.contentWatcher] = new MutationObserver(onMutations)
	      node[symbols.contentWatcher].observe(node, contentWatcherConfig)
	    }
	    setupNodeAndChildren(node, context.state, context.contentMiddlewares)
	  }
	}

	function setupNodeAndChildren (node, state, contentMiddlewares) {
	  if (node[symbols.lifecycleStage] === detached) {
	    throw new Error(`you can't reattach a detached node: ${node}`)
	  }
	  if (node[symbols.lifecycleStage] === attached || !node.parentNode) {
	    return
	  }
	  if (node.parentNode[symbols.lifecycleStage] !== attached && !node[symbols.contentWatcher]) {
	    return
	  }
	  if (node instanceof HTMLUnknownElement && !node[symbols.registered]) {
	    return
	  }
	  if (node instanceof Element && node.hasAttribute('is') && !node[symbols.registered]) {
	    return
	  }
	  node[symbols.lifecycleStage] = attached

	  setupNode(node)

	  if (node[symbols.contextState]) {
	    state = node[symbols.contextState]
	  }
	  const contextState = state

	  if (node[symbols.state]) {
	    node[symbols.state].$parent = state
	    if (node[symbols.inheritState]) {
	      Object.setPrototypeOf(node[symbols.state], state)
	    }
	    state = node[symbols.state]
	  }

	  return composeAndRunMiddlewares(node, state, contextState, contentMiddlewares, node[symbols.middlewares])
	    .then(() => setupChildren(node, state, contentMiddlewares))
	    .then(() => afterSetup(node))
	}

	function afterSetup(node) {
	  if (node instanceof Element && node.hasAttribute('cloak')) {
	    Promise.resolve(node).then(uncloakNode)
	  }
	}

	function uncloakNode (node) {
	  node.removeAttribute('cloak')
	}

	function composeAndRunMiddlewares (node, state, contextState, contentMiddlewares, middlewares) {
	  return new Promise((resolve) => {
	    let i = 0
	    let j = 0

	    function next () {
	      if (i < contentMiddlewares.length) {
	        contentMiddlewares[i++](node, contextState, next)
	      } else if (middlewares && j < middlewares.length) {
	        middlewares[j++](node, state, next)
	      } else {
	        Promise.resolve().then(resolve)
	      }
	    }
	    next()
	  })
	}

	function setupChildren (node, state, contentMiddlewares) {
	  if (node[symbols.isolate] === true) {
	    return
	  } else if (node[symbols.isolate] === 'middlewares') {
	    contentMiddlewares = node[symbols.contentMiddlewares].slice()
	  } else if (node[symbols.contentMiddlewares]) {
	    contentMiddlewares = contentMiddlewares.concat(node[symbols.contentMiddlewares])
	  }

	  return Promise.all(Array.prototype.map.call(node.childNodes, (childNode) => {
	    setupNodeAndChildren(childNode, state, contentMiddlewares)
	  }))
	}

	function cleanupNodeAndChildren (node) {
	  if (node[symbols.lifecycleStage] !== attached) {
	    return
	  }
	  if (node.parentNode && node.parentNode[symbols.lifecycleStage] === attached) {
	    return
	  }
	  node[symbols.lifecycleStage] = detached

	  if (node[symbols.contentWatcher]) {
	    node[symbols.contentWatcher].disconnect()
	  }
	  if (node[symbols.cleanupFunctions]) {
	    node[symbols.cleanupFunctions].forEach(runCleanupFunction)
	  }
	  Array.prototype.forEach.call(node.childNodes, cleanupNodeAndChildren)
	}

	function runCleanupFunction (cleanupFunction) {
	  cleanupFunction()
	}

	function getContext (node) {
	  const context = {contentMiddlewares: []}
	  let isolate = false

	  node = node.parentNode
	  while (node) {
	    if (!context.state && node[symbols.state]) {
	      context.state = node[symbols.state]
	    }
	    if (!context.state && node[symbols.contextState]) {
	      context.state = node[symbols.contextState]
	    }

	    if (isolate !== true && isolate !== 'middlewares') {
	      isolate = node[symbols.isolate]
	    } else if (isolate === true) {
	      context.isolate = true
	      return context
	    }

	    if (node[symbols.contentMiddlewares] && !isolate) {
	      context.contentMiddlewares.unshift(...node[symbols.contentMiddlewares])
	    }
	    if (node[symbols.contentWatcher]) {
	      context.contentWatcherNode = node
	    }
	    node = node.parentNode
	  }
	  return context
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const observer = __webpack_require__(7)
	const symbols = __webpack_require__(10)

	module.exports = function setupNode (node) {
	  node[symbols.cleanupFunctions] = []
	  node[symbols.usedMiddlewareNames] = new Set()

	  node.$using = $using
	  node.$isUsing = $isUsing
	  node.$require = $require
	  node.$cleanup = $cleanup
	  node.$observe = $observe
	  node.$unobserve = $unobserve
	  node.$schedule = $schedule
	}

	function $using (...middlewareNames) {
	  const duplicateMiddlewareNames = []

	  for (let middlewareName of middlewareNames) {
	    if (this[symbols.usedMiddlewareNames].has(middlewareName)) {
	      duplicateMiddlewareNames.push(middlewareName)
	    } else {
	      this[symbols.usedMiddlewareNames].add(middlewareName)
	    }
	  }
	  if (duplicateMiddlewareNames.length) {
	    throw new Error(`duplicate middlewares in ${this}: ${duplicateMiddlewareNames}`)
	  }
	}

	function $isUsing (...middlewareNames) {
	  for (let middlewareName of middlewareNames) {
	    if (!this[symbols.usedMiddlewareNames].has(middlewareName)) {
	      return false
	    }
	  }
	  return true
	}

	function $require (...middlewareNames) {
	  const missingMiddlewareNames = []

	  for (let middlewareName of middlewareNames) {
	    if (!this[symbols.usedMiddlewareNames].has(middlewareName)) {
	      missingMiddlewareNames.push(middlewareName)
	    }
	  }
	  if (missingMiddlewareNames.length) {
	    throw new Error(`missing required middlewares in ${this}: ${missingMiddlewareNames}`)
	  }
	}

	function $cleanup (fn) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  this[symbols.cleanupFunctions].push(fn)
	}

	function $observe (fn) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  observer.observe(fn)
	  this.$cleanup(() => observer.unobserve(fn))
	}

	function $unobserve (fn) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  observer.unobserve(fn)
	}

	function $schedule (fn) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('first argument must be a function')
	  }
	  requestAnimationFrame(fn)
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict'

	module.exports = {
	  state: Symbol('state'),
	  inheritState: Symbol('inherit state'),
	  contextState: Symbol('context state'),
	  isolate: Symbol('isolate'),
	  middlewares: Symbol('middlewares'),
	  contentMiddlewares: Symbol('content middlewares'),
	  usedMiddlewareNames: Symbol('used middleware names'),
	  cleanupFunctions: Symbol('cleanup functions'),
	  lifecycleStage: Symbol('lifecycle stage'),
	  contentWatcher: Symbol('content watcher'),
	  registered: Symbol('registered custom element'),
	  filters: Symbol('filters'),
	  limiters: Symbol('limiters'),
	  routerLevel: Symbol('router level'),
	  currentView: Symbol('current router view')
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	  attributes: __webpack_require__(12),
	  code: __webpack_require__(13),
	  expression: __webpack_require__(15),
	  filter: __webpack_require__(16),
	  limiter: __webpack_require__(17),
	  events: __webpack_require__(18),
	  interpolate: __webpack_require__(19),
	  render: __webpack_require__(20),
	  content: __webpack_require__(21),
	  flow: __webpack_require__(22),
	  bindable: __webpack_require__(23),
	  bind: __webpack_require__(24),
	  style: __webpack_require__(25),
	  router: __webpack_require__(26),
	  params: __webpack_require__(27),
	  ref: __webpack_require__(28)
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict'

	const secret = {
	  handlers: Symbol('attribute handlers')
	}

	module.exports = function attributes (elem, state, next) {
	  if (!(elem instanceof Element)) return next()
	  elem.$require('expression')
	  elem.$using('attributes')

	  elem.$attribute = $attribute
	  next()

	  processAttributesWithoutHandler(elem, state)
	  processAttributesWithHandler(elem, state)
	}

	function $attribute (name, handler) {
	  if (typeof name !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }
	  if (typeof handler !== 'function') {
	    throw new TypeError('second argument must be a function')
	  }
	  if (!this[secret.handlers]) {
	    this[secret.handlers] = new Map()
	  }
	  this[secret.handlers].set(name, handler)
	}

	function processAttributesWithoutHandler (elem, state) {
	  const attributesToRemove = []

	  Array.prototype.forEach.call(elem.attributes, (attribute) => {
	    if (attribute.name[0] === '$') {
	      const name = attribute.name.slice(1)
	      if (!elem[secret.handlers] || !elem[secret.handlers].has(name)) {
	        const expression = elem.$compileExpression(attribute.value || name)
	        elem.setAttribute(name, expression(state))
	        attributesToRemove.push(attribute.name)
	      }
	    } else if (attribute.name[0] === '@') {
	      const name = attribute.name.slice(1)
	      if (!elem[secret.handlers] || !elem[secret.handlers].has(name)) {
	        const expression = elem.$compileExpression(attribute.value || name)
	        elem.$observe(() => elem.setAttribute(name, expression(state)))
	        attributesToRemove.push(attribute.name)
	      }
	    }
	  })

	  for (let attribute of attributesToRemove) {
	    elem.removeAttribute(attribute)
	  }
	}

	function processAttributesWithHandler (elem, state) {
	  if (!elem[secret.handlers]) return
	  const attributesToRemove = []

	  elem[secret.handlers].forEach((handler, name) => {
	    const onceName = '$' + name
	    const observedName = '@' + name

	    if (elem.hasAttribute(onceName)) {
	      const expression = elem.$compileExpression(elem.getAttribute(onceName) || name)
	      handler(expression(state), elem)
	      attributesToRemove.push(onceName)
	    } else if (elem.hasAttribute(observedName)) {
	      const expression = elem.$compileExpression(elem.getAttribute(observedName) || name)
	      elem.$observe(() => handler(expression(state), elem))
	      attributesToRemove.push(observedName)
	    } else if (elem.hasAttribute(name)) {
	      handler(elem.getAttribute(name), elem)
	    }
	  })

	  for (let attribute of attributesToRemove) {
	    elem.removeAttribute(attribute)
	  }
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const compiler = __webpack_require__(14)
	const exposed = __webpack_require__(10)

	const limiterRegex = /(?:[^\&]|\&\&)+/g
	const argsRegex = /\S+/g

	module.exports = function code (node, state, next) {
	  node.$using('code')

	  node.$compileCode = $compileCode
	  return next()
	}

	function $compileCode (rawCode) {
	  if (typeof rawCode !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }
	  const code = parseCode(this, rawCode)
	  const context = {}

	  return function evaluateCode (state, expando) {
	    const backup = createBackup(state, expando)
	    let i = 0
	    function next () {
	      try {
	        Object.assign(state, expando)
	        Object.assign(context, expando)
	        if (i < code.limiters.length) {
	          const limiter = code.limiters[i++]
	          const args = evaluateArgExpressions(limiter.argExpressions, state)
	          limiter.effect(next, context, ...args)
	        } else {
	          code.exec(state)
	        }
	      } finally {
	        Object.assign(state, backup)
	        Object.assign(context, backup)
	      }
	    }
	    next()
	  }
	}

	function parseCode (node, rawCode) {
	  const tokens = rawCode.match(limiterRegex)
	  const code = {
	    exec: compiler.compileCode(tokens.shift()),
	    limiters: []
	  }

	  for (let limiterToken of tokens) {
	    limiterToken = limiterToken.match(argsRegex) || []
	    const limiterName = limiterToken.shift()
	    if (!node[exposed.limiters] || !node[exposed.limiters].has(limiterName)) {
	      throw new Error(`there is no limiter named ${limiterName} on ${node}`)
	    }
	    const effect = node[exposed.limiters].get(limiterName)
	    const argExpressions = limiterToken.map(compileArg)
	    code.limiters.push({effect, argExpressions})
	  }
	  return code
	}

	function evaluateArgExpressions (argExpressions, state) {
	  const args = []
	  for (let argExpression of argExpressions) {
	    args.push(argExpression(state))
	  }
	  return args
	}

	function compileArg (arg) {
	  return compiler.compileExpression(arg)
	}

	function createBackup (state, expando) {
	  if (!expando) return undefined

	  const backup = {}
	  for (let key in expando) {
	    backup[key] = state[key]
	  }
	  return backup
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict'

	const sandboxProxies = new WeakMap()
	let currentAllowedGlobals

	module.exports = {
	  compileCode,
	  compileExpression
	}

	function compileExpression (src) {
	  if (typeof src !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }
	  return compileCode(`return ${src}`)
	}

	function compileCode (src) {
	  if (typeof src !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }

	  const code = new Function('sandbox', `with (sandbox) {${src}}`) // eslint-disable-line

	  return function (sandbox, allowedGlobals) {
	    if (typeof sandbox !== 'object') {
	      throw new TypeError('first argument must be an object')
	    }
	    if (allowedGlobals !== undefined && allowedGlobals !== true && !Array.isArray(allowedGlobals)) {
	      throw new TypeError('second argument must be an array of strings or true or undefined')
	    }

	    if (!sandboxProxies.has(sandbox)) {
	      sandboxProxies.set(sandbox, new Proxy(sandbox, {has: has, get: get}))
	    }
	    currentAllowedGlobals = allowedGlobals

	    let result
	    try {
	      result = code(sandboxProxies.get(sandbox))
	    } finally {
	      currentAllowedGlobals = undefined
	    }
	    return result
	  }
	}

	function get (target, key, receiver) {
	  if (key === Symbol.unscopables) {
	    return undefined
	  }
	  return Reflect.get(target, key, receiver)
	}

	function has (target, key) {
	  if (isAllowedGlobal(key)) {
	    return Reflect.has(target, key)
	  }
	  return true
	}

	function isAllowedGlobal (key) {
	  if (currentAllowedGlobals === true) {
	    return true
	  }
	  if (Array.isArray(currentAllowedGlobals) && currentAllowedGlobals.indexOf(key) !== -1) {
	    return true
	  }
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const compiler = __webpack_require__(14)
	const exposed = __webpack_require__(10)

	const filterRegex = /(?:[^\|]|\|\|)+/g
	const argsRegex = /\S+/g

	module.exports = function expression (node, state, next) {
	  node.$using('expression')

	  node.$compileExpression = $compileExpression
	  return next()
	}

	function $compileExpression (rawExpression) {
	  if (typeof rawExpression !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }
	  const expression = parseExpression(this, rawExpression)

	  return function evaluateExpression (state) {
	    let value = expression.exec(state)
	    for (let filter of expression.filters) {
	      const args = evaluateArgExpressions(filter.argExpressions, state)
	      value = filter.effect(value, ...args)
	    }
	    return value
	  }
	}

	function parseExpression (node, rawExpression) {
	  const tokens = rawExpression.match(filterRegex)
	  const expression = {
	    exec: compiler.compileExpression(tokens.shift()),
	    filters: []
	  }

	  for (let filterToken of tokens) {
	    filterToken = filterToken.match(argsRegex) || []
	    const filterName = filterToken.shift()
	    if (!node[exposed.filters] || !node[exposed.filters].has(filterName)) {
	      throw new Error(`there is no filter named ${filterName} on ${node}`)
	    }
	    const effect = node[exposed.filters].get(filterName)
	    const argExpressions = filterToken.map(compileArg)
	    expression.filters.push({effect, argExpressions})
	  }
	  return expression
	}

	function evaluateArgExpressions (argExpressions, state) {
	  const args = []
	  for (let argExpression of argExpressions) {
	    args.push(argExpression(state))
	  }
	  return args
	}

	function compileArg (arg) {
	  return compiler.compileExpression(arg)
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const exposed = __webpack_require__(10)

	module.exports = function filterFactory (name, handler) {
	  if (typeof name !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }
	  if (typeof handler !== 'function') {
	    throw new TypeError('second argument must be a function')
	  }

	  return function filter (elem, state, next) {
	    elem.$require('expression')

	    if (!elem[exposed.filters]) {
	      elem[exposed.filters] = new Map()
	    }
	    elem[exposed.filters].set(name, handler)
	    return next()
	  }
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const exposed = __webpack_require__(10)

	module.exports = function limiterFactory (name, handler) {
	  if (typeof name !== 'string') {
	    throw new TypeError('first argument must be a string')
	  }
	  if (typeof handler !== 'function') {
	    throw new TypeError('second argument must be a function')
	  }

	  return function limiter (elem, state, next) {
	    elem.$require('code')

	    if (!elem[exposed.limiters]) {
	      elem[exposed.limiters] = new Map()
	    }
	    elem[exposed.limiters].set(name, handler)
	    return next()
	  }
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const compiler = __webpack_require__(14)

	const secret = {
	  handlers: Symbol('event handlers'),
	  state: Symbol('event state')
	}

	module.exports = function events (elem, state, next) {
	  if (!(elem instanceof Element)) return next()
	  elem.$require('code')
	  elem.$using('events')

	  next()

	  for (let i = 0; i < elem.attributes.length; i++) {
	    const attribute = elem.attributes[i]

	    if (attribute.name[0] === '#') {
	      const handler = elem.$compileCode(attribute.value)

	      if (!elem[secret.handlers]) {
	        elem[secret.handlers] = new Map()
	        elem[secret.state] = state
	      }

	      const names = attribute.name.slice(1).split(',')
	      for (let name of names) {
	        let handlers = elem[secret.handlers].get(name)
	        if (!handlers) {
	          handlers = new Set()
	          elem[secret.handlers].set(name, handlers)
	        }
	        handlers.add(handler)
	        elem.addEventListener(name, listener)
	      }
	    }
	  }
	}

	function listener (event) {
	  const handlers = event.target[secret.handlers].get(event.type)
	  const state = event.target[secret.state]
	  for (let handler of handlers) {
	    handler(state, { $event: event })
	  }
	}


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function interpolate (node, state, next) {
	  if (node.nodeType !== Node.TEXT_NODE) return next()
	  node.$require('expression')
	  node.$using('interpolate')
	  next()
	  interpolateValue(node, state)
	}

	function interpolateValue (node, state) {
	  const tokens = parseValue(node.nodeValue)

	  tokens.forEach((token) => {
	    if (typeof token === 'object') {
	      const expression = node.$compileExpression(token.expression)
	      if (token.observed) {
	        node.$observe(() => interpolateToken(token, expression(state), tokens, node))
	      } else {
	        interpolateToken(token, expression(state), tokens, node)
	      }
	    }
	  })
	}

	function interpolateToken (token, value, tokens, node) {
	  if (value === undefined) value = ''
	  if (token.value !== value) {
	    token.value = value
	    node.nodeValue = tokens.map(tokenToString).join('')
	  }
	}

	function tokenToString (token) {
	  return (typeof token === 'object') ? token.value : token
	}

	function parseValue (string) {
	  const tokens = []
	  let expression = false
	  let anchor = 0
	  let depth = 0
	  let char
	  let token

	  for (let i = 0; i < string.length; i++) {
	    char = string.charAt(i)

	    if (expression) {
	      if (char === '{') {
	        depth++
	      } else if (char === '}') {
	        depth--
	      }

	      if (depth === 0) {
	        token.expression = string.slice(anchor, i)
	        tokens.push(token)
	        anchor = i + 1
	        expression = false
	      }
	    } else {
	      if (i === string.length - 1) {
	        tokens.push(string.slice(anchor, i + 1))
	      } else if ((char === '$' || char === '@') && string.charAt(i + 1) === '{') {
	        tokens.push(string.slice(anchor, i))
	        token = {observed: (char === '@')}
	        anchor = i + 2
	        depth = 0
	        expression = true
	      }
	    }
	  }
	  return tokens
	}


/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function render (config) {
	  config = validateAndCloneConfig(config)
	  if (config.cache) {
	    config.template = cacheTemplate(config.template)
	  }

	  return function renderMiddleware (elem, state, next) {
	    if (!(elem instanceof Element)) {
	      throw new Error('render only works with element nodes')
	    }
	    elem.$using('render')

	    let template
	    if (config.cache) {
	      template = document.importNode(config.template, true)
	    } else {
	      template = cacheTemplate(config.template)
	    }

	    if (config.compose) {
	      composeContentWithTemplate(elem, state, template)
	    } else {
	      clearContent(elem)
	    }

	    elem.appendChild(template)
	    return next()
	  }
	}

	function composeContentWithTemplate (elem, state, template) {
	  let defaultSlot

	  Array.prototype.forEach.call(template.querySelectorAll('slot'), (slot) => {
	    if (slot.hasAttribute('name') && slot.getAttribute('name') !== '') {
	      const slotFillers = elem.querySelectorAll(`[slot=${slot.getAttribute('name')}]`)
	      if (slotFillers.length) {
	        clearContent(slot)
	        Array.prototype.forEach.call(slotFillers, (slotFiller) => slot.appendChild(slotFiller))
	      }
	    } else if (!defaultSlot) {
	      defaultSlot = slot
	    }
	  })

	  if (defaultSlot && elem.childNodes.length) {
	    clearContent(defaultSlot)
	    while (elem.firstChild) {
	      defaultSlot.appendChild(elem.firstChild)
	    }
	  }
	  clearContent(elem)
	}

	function cacheTemplate (template) {
	  const cachedTemplate = document.createElement('template')
	  cachedTemplate.innerHTML = template
	  return cachedTemplate.content
	}

	function clearContent (elem) {
	  while (elem.firstChild) {
	    elem.removeChild(elem.firstChild)
	  }
	}

	function validateAndCloneConfig (rawConfig) {
	  const resultConfig = {}

	  if (typeof rawConfig !== 'object') {
	    throw new TypeError('config must be an object')
	  }

	  if (typeof rawConfig.template === 'string') {
	    resultConfig.template = rawConfig.template
	  } else {
	    throw new TypeError('template config must be a string')
	  }

	  if (typeof rawConfig.cache === 'boolean') {
	    resultConfig.cache = rawConfig.cache
	  } else if (rawConfig.cache === undefined) {
	    resultConfig.cache = true
	  } else {
	    throw new TypeError('cache config must be a boolean or undefined')
	  }

	  if (typeof rawConfig.compose === 'boolean') {
	    resultConfig.compose = rawConfig.compose
	  } else if (rawConfig.compose === undefined) {
	    resultConfig.compose = true
	  } else {
	    throw new TypeError('compose config must be a boolean or undefined')
	  }

	  return resultConfig
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const observer = __webpack_require__(7)
	const exposed = __webpack_require__(10)
	const secret = {
	  template: Symbol('content template'),
	  state: Symbol('content state')
	}

	module.exports = function content (node, state, next) {
	  if (!(node instanceof Element)) {
	    return next()
	  }
	  node.$using('content')

	  node[secret.state] = state

	  node.$extractContent = $extractContent
	  node.$insertContent = $insertContent
	  node.$removeContent = $removeContent
	  node.$replaceContent = $replaceContent

	  return next()
	}

	function $extractContent () {
	  const template = document.createDocumentFragment()
	  let node = this.firstChild
	  while (node) {
	    template.appendChild(node)
	    node = this.firstChild
	  }
	  template.appendChild(document.createComment('#separator#'))
	  this[secret.template] = template
	}

	function $insertContent (index, contextState) {
	  if (index === undefined) {
	    index = 0
	  }
	  if (typeof index !== 'number') {
	    throw new TypeError('first argument must be a number')
	  }
	  if (contextState !== undefined && typeof contextState !== 'object') {
	    throw new TypeError('second argument must be an object or undefined')
	  }
	  if (!this[secret.template]) {
	    throw new Error('you must extract a template with $extractContent before inserting')
	  }

	  const content = document.importNode(this[secret.template], true)

	  if (contextState) {
	    contextState = observer.observable(contextState)
	    Object.setPrototypeOf(contextState, this[secret.state])

	    let node = content.firstChild
	    while (node) {
	      node[exposed.contextState] = contextState
	      node = node.nextSibling
	    }
	  }
	  this.insertBefore(content, findContentStartAtIndex(this, index))
	}

	function $removeContent (index) {
	  if (index === undefined) {
	    index = 0
	  }
	  if (typeof index !== 'number') {
	    throw new TypeError('first argument must be a number')
	  }
	  let node = findContentStartAtIndex(this, index)
	  let next
	  while (node && !isSeparator(node)) {
	    next = node.nextSibling
	    this.removeChild(node)
	    node = next
	  }
	  this.removeChild(node)
	}

	function $replaceContent (index, contextState) {
	  if (index === undefined) {
	    index = 0
	  }
	  if (typeof index !== 'number') {
	    throw new TypeError('first argument must be a number')
	  }
	  if (contextState !== undefined && typeof contextState !== 'object') {
	    throw new TypeError('second argument must be an object or undefined')
	  }
	  this.$removeContent(index)
	  this.$insertContent(index, contextState)
	}

	function findContentStartAtIndex (node, index) {
	  node = node.firstChild
	  let count = 0
	  while (node && count < index) {
	    if (isSeparator(node)) count++
	    node = node.nextSibling
	  }
	  return node
	}

	function isSeparator (node) {
	  return (node.nodeType === Node.COMMENT_NODE && node.nodeValue === '#separator#')
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict'

	const secret = {
	  hasIf: Symbol('flow hasIf'),
	  showing: Symbol('flow showing'),
	  hasRepeat: Symbol('flow hasRepeat'),
	  prevArray: Symbol('flow prevArray')
	}

	module.exports = function flow (elem, state, next) {
	  if (!(elem instanceof Element)) return next()
	  elem.$require('content', 'attributes')
	  elem.$using('flow')

	  elem.$attribute('if', ifAttribute)
	  elem.$attribute('repeat', repeatAttribute)

	  return next()
	}

	function ifAttribute (show, elem) {
	  if (elem[secret.hasRepeat]) {
	    throw new Error('cant use if and repeat on the same node')
	  }
	  if (!elem[secret.hasIf]) {
	    elem.$extractContent()
	    elem[secret.hasIf] = true
	  }

	  if (show && !elem[secret.showing]) {
	    elem.$insertContent()
	    elem[secret.showing] = true
	  } else if (!show && elem[secret.showing]) {
	    elem.$removeContent()
	    elem[secret.showing] = false
	  }
	}

	function repeatAttribute (array, elem) {
	  if (elem[secret.hasIf]) {
	    throw new Error('cant use if and repeat on the same node')
	  }
	  if (!elem[secret.hasRepeat]) {
	    elem.$extractContent()
	    elem[secret.prevArray] = []
	    elem[secret.hasRepeat] = true
	  }
	  if (!Array.isArray(array)) {
	    return
	  }

	  const repeatValue = elem.getAttribute('repeat-value') || '$value'
	  const repeatIndex = elem.getAttribute('repeat-index') || '$index'
	  const prevArray = elem[secret.prevArray]
	  let viewIndex = 0
	  for (let i = 0; i < Math.max(array.length, prevArray.length); i++) {
	    if (prevArray[i] !== array[i]) {
	      if (array[i] === undefined) {
	        elem.$removeContent(viewIndex)
	        viewIndex--
	      } else if (prevArray[i] === undefined) {
	        elem.$insertContent(viewIndex, {[repeatValue]: array[viewIndex], [repeatIndex]: viewIndex})
	      } else {
	        elem.$replaceContent(viewIndex, {[repeatValue]: array[viewIndex], [repeatIndex]: viewIndex})
	      }
	      prevArray[i] = array[i]
	    }
	    viewIndex++
	  }
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict'

	const secret = {
	  state: Symbol('bindable state'),
	  params: Symbol('bindable params'),
	  binder: Symbol('bindable binder')
	}
	const paramsRegex = /\S+/g
	const defaultParams = {mode: 'two-way', on: 'change', type: 'string'}

	document.addEventListener('submit', onSubmit, true)

	function onInput (ev) {
	  const params = ev.target[secret.params]
	  if (ev.type === 'submit') {
	    syncStateWithForm(ev.target)
	  } else if (params && (params.on.indexOf(ev.type) !== -1)) {
	    syncStateWithElement(ev.target)
	  }
	}

	function onSubmit (ev) {
	  ev.preventDefault()
	}

	module.exports = function bindable (elem, state, next) {
	  if (!(elem instanceof Element)) return next()
	  elem.$require('attributes')
	  elem.$using('bindable')

	  elem.$bindable = $bindable
	  next()

	  if (elem[secret.params]) {
	    elem[secret.state] = state
	    elem[secret.binder] = syncElementWithState.bind(null, elem)
	    elem.$attribute('bind', bindAttribute)
	  }
	}

	function $bindable (params) {
	  if (typeof params !== 'object') params = {}
	  this[secret.params] = Object.assign({}, defaultParams, params)
	}

	function bindAttribute (params, elem) {
	  if (typeof params === 'string') {
	    const tokens = params.match(paramsRegex)
	    params = {}
	    if (tokens) {
	      if (tokens[0]) params.mode = tokens[0]
	      if (tokens[1]) params.on = tokens[1].split(',')
	      if (tokens[2]) params.type = tokens[2]
	    }
	  }
	  if (typeof params === 'object') {
	    Object.assign(elem[secret.params], params)
	  }
	  if (!Array.isArray(elem[secret.params].on)) {
	    elem[secret.params].on = [elem[secret.params].on]
	  }
	  bindElement(elem)
	}

	function bindElement (elem) {
	  const params = elem[secret.params]
	  const binder = elem[secret.binder]
	  if (params.mode === 'two-way') {
	    elem.$observe(binder)
	    // not optimal, but resolve.then is not enough delay
	    elem.$schedule(binder)
	  } else if (params.mode === 'one-time') {
	    elem.$unobserve(binder)
	    // not optimal, but resolve.then is not enough delay
	    elem.$schedule(binder)
	  } else if (params.mode === 'one-way') {
	    elem.$unobserve(binder)
	  } else {
	    throw new TypeError('bind mode must be two-way, one-time or one-way')
	  }
	  for (let eventName of params.on) {
	    document.addEventListener(eventName, onInput, true)
	  }
	}

	function syncElementWithState (elem) {
	  const state = elem[secret.state]
	  const params = elem[secret.params]
	  const value = getValue(state, elem.name)
	  if (elem.type === 'radio' || elem.type === 'checkbox') {
	    elem.checked = (value === toType(elem.value, params.type))
	  } else if (elem.value !== toType(value)) {
	    elem.value = toType(value)
	  }
	}

	function syncStateWithElement (elem) {
	  const state = elem[secret.state]
	  const params = elem[secret.params]
	  if (elem.type === 'radio' || elem.type === 'checkbox') {
	    const value = elem.checked ? toType(elem.value, params.type) : undefined
	    setValue(state, elem.name, value)
	  } else {
	    setValue(state, elem.name, toType(elem.value, params.type))
	  }
	}

	function syncStateWithForm (form) {
	  Array.prototype.forEach.call(form.elements, syncStateWithFormControl)
	}

	function syncStateWithFormControl (elem) {
	  const params = elem[secret.params]
	  if (params && (params.on.indexOf('submit') !== -1)) {
	    syncStateWithElement(elem)
	  }
	}

	function toType (value, type) {
	  if (value === '') return undefined
	  if (value === undefined) return ''

	  if (type === 'string') return String(value)
	  else if (type === 'number') return Number(value)
	  else if (type === 'boolean') return Boolean(value)
	  else if (type === 'date') return new Date(value)
	  else if (type !== undefined) {
	    throw new TypeError('bind type must be string, number, boolean or date')
	  }

	  return value
	}

	function getValue (state, name) {
	  const tokens = name.split('.')
	  let value = state

	  for (let token of tokens) {
	    value = value[token]
	  }
	  return value
	}

	function setValue (state, name, value) {
	  const tokens = name.split('.')
	  const propName = tokens.pop()
	  let parent = state

	  for (let token of tokens) {
	    parent = parent[token]
	  }
	  parent[propName] = value
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const exposed = __webpack_require__(10)

	module.exports = function bind (elem, state, next) {
	  if (!isInput(elem)) return next()
	  elem.$require('bindable')
	  elem.$isUsing('bind')

	  elem.$bindable({
	    mode: 'two-way',
	    on: getTrigger(elem),
	    type: getType(elem)
	  })

	  return next()
	}

	function isInput (elem) {
	  if (elem instanceof HTMLInputElement) return true
	  if (elem instanceof HTMLTextAreaElement) return true
	  if (elem instanceof HTMLSelectElement) return true
	  return false
	}

	function getType (elem) {
	  if (elem instanceof HTMLInputElement) {
	    if (elem.type === 'checkbox') {
	      return 'boolean'
	    }
	    if (elem.type === 'number' || elem.type === 'range' || elem.type === 'week') {
	      return 'number'
	    }
	    if (elem.type === 'date' || elem.type === 'datetime') {
	      return 'date'
	    }
	    if (elem.type === 'datetime-local' || elem.type === 'month') {
	      return 'date'
	    }
	  }
	  return 'string'
	}

	function getTrigger (elem) {
	  if (elem.form && elem.form instanceof HTMLFormElement) {
	    return 'submit'
	  }
	  return 'change'
	}


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict'

	const secret = {
	  display: Symbol('style display')
	}

	module.exports = function style (elem, state, next) {
	  if (!(elem instanceof HTMLElement)) return next()
	  elem.$require('attributes')
	  elem.$using('style')

	  elem.$attribute('class', classAttribute)
	  elem.$attribute('style', styleAttribute)
	  elem.$attribute('show', showAttribute)

	  return next()
	}

	function classAttribute (classes, elem) {
	  if (typeof classes === 'object') {
	    const classList = []
	    for (let className in classes) {
	      if (classes[className]) {
	        classList.push(className)
	      }
	    }
	    classes = classList.join(' ')
	  }
	  elem.setAttribute('class', classes)
	}

	function styleAttribute (styles, elem) {
	  if (typeof styles === 'object') {
	    const styleList = []
	    for (let styleName in styles) {
	      styleList.push(`${styleName}: ${styles[styleName]};`)
	    }
	    styles = styleList.join(' ')
	  }
	  elem.setAttribute('style', styles)
	}

	function showAttribute (show, elem) {
	  if (show) {
	    elem.style.display = ''
	  } else {
	    elem.style.display = 'none'
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const symbols = __webpack_require__(10)
	const secret = {
	  config: Symbol('router config')
	}

	const rootRouters = new Set()

	window.addEventListener('popstate', onPopState, true)

	function onPopState (ev) {
	  for (let router of rootRouters) {
	    routeRouterAndChildren(router, history.state.route)
	  }
	}

	module.exports = function router (router, state, next) {
	  if (!(router instanceof Element)) {
	    throw new Error('router only works with element nodes')
	  }
	  router.$using('router')

	  setupRouter(router)
	  extractViews(router)
	  Promise.resolve().then(() =>routeRouterAndChildren(router, absoluteToRelativeRoute(router, history.state.route)))

	  return next()
	}

	function setupRouter (router) {
	  router[secret.config] = {
	    children: new Set(),
	    templates: new Map()
	  }

	  const parentRouter = findParentRouter(router)
	  if (parentRouter) {
	    router[symbols.routerLevel] = parentRouter[symbols.routerLevel] + 1
	    parentRouter[secret.config].children.add(router)
	    router.$cleanup(() => parentRouter[secret.config].children.delete(router))
	  } else {
	    router[symbols.routerLevel] = 1
	    rootRouters.add(router)
	    router.$cleanup(() => rootRouters.delete(router))
	  }
	}

	function absoluteToRelativeRoute (router, route) {
	  return route.slice(router[symbols.routerLevel] - 1)
	}

	function extractViews (router) {
	  let view
	  while (router.firstChild) {
	    view = router.firstChild
	    if (view instanceof Element && view.hasAttribute('route')) {
	      router[secret.config].templates.set(view.getAttribute('route'), view)
	      if (view.hasAttribute('default-route')) {
	        router[secret.config].defaultView = view.getAttribute('route')
	      }
	    }
	    router.removeChild(view)
	  }
	}

	function findParentRouter (node) {
	  while(node.parentNode) {
	    node = node.parentNode
	    if (node[symbols.routerLevel] !== undefined) {
	      return node
	    }
	  }
	}

	function routeRouterAndChildren (router, route) {
	  route = route.slice()
	  const viewName = route.shift()
	  const prevViewName = router[symbols.currentView]
	  let routeEvent

	  if (prevViewName !== viewName) {
	    const eventConfig = {
	      bubbles: true,
	      cancelable: true,
	      detail: {
	        from: prevViewName,
	        to: viewName,
	        params: history.state.params
	      }
	    }
	    routeEvent = new CustomEvent('route', eventConfig)
	    router.dispatchEvent(routeEvent)
	  }

	  if (!(routeEvent && routeEvent.defaultPrevented)) {
	    routeRouter(router, viewName)
	    Promise.resolve().then(() => routeChildren(router, route))
	  }
	}

	function routeRouter (router, viewName) {
	  const templates = router[secret.config].templates
	  const defaultView = router[secret.config].defaultView

	  if (!templates.has(viewName) && templates.has(defaultView)) {
	    viewName = defaultView
	  }
	  if (router[symbols.currentView] !== viewName) {
	    while (router.firstChild) {
	      router.removeChild(router.firstChild)
	    }
	    const template = templates.get(viewName)
	    if (template) {
	      router.appendChild(document.importNode(template, true))
	    }
	    router[symbols.currentView] = viewName
	  }
	}

	function routeChildren (router, route) {
	  for (let childRouter of router[secret.config].children) {
	    routeRouterAndChildren(childRouter, route)
	  }
	}


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict'

	const secret = {
	  state: Symbol('params sync state'),
	  config: Symbol('params sync config')
	}
	const nodesToSync = new Set()

	window.addEventListener('popstate', onPopState)

	function onPopState (ev) {
	  for (let node of nodesToSync) {
	    syncStateWithParams(node[secret.state], history.state.params, node[secret.config])
	  }
	}

	module.exports = function params (config) {
	  return function paramsMiddleware (node, state, next) {
	    node.$using('params')

	    node[secret.state] = state
	    node[secret.config] = config
	    nodesToSync.add(node)
	    node.$cleanup(() => nodesToSync.delete(node))

	    syncStateWithParams(state, history.state.params, config)

	    next()

	    syncParamsWithState(history.state.params, state, config, false)
	    node.$observe(() => syncParamsWithState(history.state.params, state, config, true))
	  }
	}

	function syncStateWithParams (state, params, config) {
	  for (let paramName in config) {
	    if (state[paramName] !== params[paramName]) {
	      if (params[paramName] === undefined) {
	        state[paramName] = undefined
	      } else if (config[paramName].type === 'number') {
	        state[paramName] = Number(params[paramName])
	      } else if (config[paramName].type === 'string') {
	        state[paramName] = String(params[paramName])
	      } else if (config[paramName].type === 'boolean') {
	        state[paramName] = Boolean(params[paramName])
	      } else if (config[paramName].type === 'date') {
	        state[paramName] = new Date(params[paramName])
	      } else {
	        state[paramName] = params[paramName]
	      }
	    }
	  }
	}

	function syncParamsWithState (params, state, config, shouldUpdateHistory) {
	  let newParams = {}
	  let paramsChanged = false
	  let historyChanged = false

	  for (let paramName in config) {
	    if (params[paramName] !== state[paramName]) {
	      if (config[paramName].readOnly) {
	        throw new Error(`${paramName} is readOnly`)
	      }
	      newParams[paramName] = state[paramName]
	      paramsChanged = true
	      if (config[paramName].history && shouldUpdateHistory) {
	        historyChanged = true
	      }
	    }
	  }
	  if (paramsChanged) {
	    updateHistory(newParams, historyChanged)
	  }
	}

	function updateHistory (params, historyChanged) {
	  params = Object.assign({}, history.state.params, params)

	  const url = location.pathname + paramsToQuery(params)
	  if (historyChanged) {
	    history.pushState({route: history.state.route, params}, '', url)
	  } else {
	    history.replaceState({route: history.state.route, params}, '', url)
	  }
	}

	function paramsToQuery (params) {
	  if (params === undefined) {
	    params = {}
	  }

	  let query = ''
	  for (let param in params) {
	    if (params[param] !== undefined) {
	      query += `${param}=${params[param]}&`
	    }
	  }
	  if (query !== '') {
	    query = '?' + query.slice(0, -1)
	  }
	  return query
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const symbols = __webpack_require__(10)
	const secret = {
	  config: Symbol('ref config')
	}

	updateHistory(pathToRoute(location.pathname), queryToParams(location.search), {history: false})
	window.addEventListener('click', onClick, true)

	function onClick (ev) {
	  const config = ev.target[secret.config]
	  if (config) {
	    ev.target.$route(config.path, config.params, config.options)
	    ev.preventDefault()
	  }
	}

	module.exports = function ref (elem, state, next) {
	  if (!(elem instanceof Element)) return next()
	  elem.$require('attributes')
	  elem.$using('ref')

	  elem.$route = $route

	  if (elem instanceof HTMLAnchorElement) {
	    elem.$attribute('iref', irefAttribute)
	    elem.$attribute('iref-params', irefParamsAttribute)
	    elem.$attribute('iref-options', irefOptionsAttribute)
	  }
	  return next()
	}

	function irefAttribute (path, elem) {
	  elem[secret.config] = elem[secret.config] || {}
	  const config = elem[secret.config]
	  config.path = path

	  const query = elem.href ? elem.href.search : ''
	  const href = path + query
	  elem.setAttribute('href', href)
	}

	function irefParamsAttribute (params, elem) {
	  elem[secret.config] = elem[secret.config] || {}
	  const config = elem[secret.config]
	  config.params = params

	  const path = elem.href ? elem.href.pathname : ''
	  const href = path + paramsToQuery(params)
	  elem.setAttribute('href', href)
	}

	function irefOptionsAttribute (options, elem) {
	  elem[secret.config] = elem[secret.config] || {}
	  elem[secret.config].options = options
	}

	function $route (path, params, options) {
	  if (params === undefined) {
	    params = {}
	  }
	  if (options === undefined) {
	    options = {}
	  }

	  let route = pathToRoute(path)
	  if (route.some(filterRelativeTokens)) {
	    route = relativeToAbsoluteRoute(this, route)
	  }
	  updateHistory(route, params, options)
	  window.scrollTo(0, 0)
	}

	function relativeToAbsoluteRoute (node, relativeRoute) {
	  let router = findParentRouter(node)
	  let routerLevel = router ? router[symbols.routerLevel] : 0

	  for (let token of relativeRoute) {
	    if (token === '..') routerLevel--
	  }
	  if (routerLevel < 0) {
	    throw new Error('invalid relative route')
	  }

	  const currentRoute = []
	  while (router) {
	    currentRoute.unshift(router[symbols.currentView])
	    router = findParentRouter(router)
	  }
	  const route = relativeRoute.filter(filterAbsoluteTokens)
	  return currentRoute.slice(0, routerLevel).concat(route)
	}

	function filterAbsoluteTokens (token) {
	  return (token !== '..' && token !== '.')
	}

	function filterRelativeTokens (token) {
	  return (token === '..' || token === '.')
	}

	function filterEmptyTokens (token) {
	  return (token !== '')
	}

	function findParentRouter (node) {
	  while(node.parentNode) {
	    node = node.parentNode
	    if (node[symbols.routerLevel] !== undefined) {
	      return node
	    }
	  }
	}

	function updateHistory (route, params, options) {
	  if (options.inherit) {
	    params = Object.assign({}, history.state.params, params)
	  }

	  const url = routeToPath(route) + paramsToQuery(params)
	  if (options.history === false) {
	    history.replaceState({route, params}, '', url)
	  } else {
	    history.pushState({route, params}, '', url)
	  }

	  const eventConfig = {bubbles: true, cancelable: false }
	  document.dispatchEvent(new Event('popstate', eventConfig))
	}

	function routeToPath (route) {
	  if (route === undefined) {
	    route = []
	  }
	  return '/' + route.join('/')
	}

	function pathToRoute (path) {
	  if (path.charAt(0) === '/') {
	    path = path.slice(1)
	  }
	  return path.split('/').filter(filterEmptyTokens)
	}

	function paramsToQuery (params) {
	  if (params === undefined) {
	    params = {}
	  }

	  let query = ''
	  for (let param in params) {
	    if (params[param] !== undefined) {
	      query += `${param}=${params[param]}&`
	    }
	  }
	  if (query !== '') {
	    query = '?' + query.slice(0, -1)
	  }
	  return query
	}

	function queryToParams (query) {
	  if (query.charAt(0) === '?') {
	    query = query.slice(1)
	  }
	  query = query.split('&')

	  const params = {}
	  for (let keyValue of query) {
	    keyValue = keyValue.split('=')
	    if (keyValue.length === 2) {
	      params[keyValue[0]] = keyValue[1]
	    }
	  }
	  return params
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	  app: __webpack_require__(30),
	  router: __webpack_require__(48)
	}


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const core = __webpack_require__(4)
	const middlewares = __webpack_require__(11)
	const filters = __webpack_require__(31)
	const limiters = __webpack_require__(41)

	module.exports = function app (config) {
	  return core.component(config)
	    .useOnContent(middlewares.code)
	    .useOnContent(middlewares.expression)
	    .useOnContent(middlewares.events)
	    .useOnContent(middlewares.interpolate)
	    .useOnContent(middlewares.attributes)
	    .useOnContent(middlewares.style)
	    .useOnContent(middlewares.ref)
	    .useOnContent(middlewares.content)
	    .useOnContent(middlewares.flow)
	    .useOnContent(middlewares.bindable)
	    .useOnContent(middlewares.bind)
	    .useOnContent(middlewares.filter('capitalize', filters.capitalize))
	    .useOnContent(middlewares.filter('lowercase', filters.lowercase))
	    .useOnContent(middlewares.filter('uppercase', filters.uppercase))
	    .useOnContent(middlewares.filter('unit', filters.unit))
	    .useOnContent(middlewares.filter('slice', filters.slice))
	    .useOnContent(middlewares.filter('json', filters.json))
	    .useOnContent(middlewares.filter('date', filters.date))
	    .useOnContent(middlewares.filter('time', filters.time))
	    .useOnContent(middlewares.filter('datetime', filters.datetime))
	    .useOnContent(middlewares.limiter('if', limiters.if))
	    .useOnContent(middlewares.limiter('delay', limiters.delay))
	    .useOnContent(middlewares.limiter('debounce', limiters.debounce))
	    .useOnContent(middlewares.limiter('throttle', limiters.throttle))
	    .useOnContent(middlewares.limiter('key', limiters.key))
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	  capitalize: __webpack_require__(32),
	  uppercase: __webpack_require__(33),
	  lowercase: __webpack_require__(34),
	  unit: __webpack_require__(35),
	  json: __webpack_require__(36),
	  slice: __webpack_require__(37),
	  date: __webpack_require__(38),
	  time: __webpack_require__(39),
	  datetime: __webpack_require__(40)
	}


/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function capitalize (value) {
	  if (value === undefined) {
	    return value
	  }
	  value = String(value)
	  return value.charAt(0).toUpperCase() + value.slice(1)
	}


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function uppercase (value) {
	  if (value === undefined) {
	    return value
	  }
	  return String(value).toUpperCase()
	}


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function lowercase (value) {
	  if (value === undefined) {
	    return value
	  }
	  return String(value).toLowerCase()
	}


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function unit (value, unitName, postfix) {
	  unitName = unitName || 'item'
	  postfix = postfix || 's'
	  if (isNaN(value)) {
	    return value + ' ' + unitName
	  }
	  let result = value + ' ' + unitName
	  if (value !== 1) result += postfix
	  return result
	}


/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function json (value, indent) {
	  if (value === undefined) {
	    return value
	  }
	  return JSON.stringify(value, null, indent)
	}


/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function slice (value, begin, end) {
	  if (value === undefined) {
	    return value
	  }
	  return value.slice(begin, end)
	}


/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function date (value) {
	  if (value instanceof Date) {
	    return value.toLocaleDateString()
	  }
	  return value
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function time (value) {
	  if (value instanceof Date) {
	    return value.toLocaleTimeString()
	  }
	  return value
	}


/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function datetime (value) {
	  if (value instanceof Date) {
	    return value.toLocaleString()
	  }
	  return value
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	  if: __webpack_require__(42),
	  delay: __webpack_require__(43),
	  debounce: __webpack_require__(44),
	  throttle: __webpack_require__(45),
	  key: __webpack_require__(46)
	}


/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function ifLimiter (next, context, condition) {
	  if (condition) {
	    next()
	  }
	}


/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict'

	module.exports = function delay (next, context, time) {
	  if (time === undefined || isNaN(time)) {
	    time = 200
	  }
	  setTimeout(next, time)
	}


/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict'

	const timer = Symbol('debounce timer')

	module.exports = function debounce (next, context, delay) {
	  if (delay === undefined || isNaN(delay)) {
	    delay = 200
	  }
	  clearTimeout(context[timer])
	  context[timer] = setTimeout(next, delay)
	}


/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict'

	const timer = Symbol('throttle timer')
	const lastExecution = Symbol('throttle last execution')

	module.exports = function throttle (next, context, threshold) {
	  if (threshold === undefined || isNaN(threshold)) {
	    threshold = 200
	  }
	  const last = context[lastExecution]
	  if (last && Date.now() < (last + threshold)) {
	    clearTimeout(context[timer])
	    context[timer] = setTimeout(execute, context, next, threshold)
	  } else {
	    execute(context, next)
	  }
	}

	function execute (context, next) {
	  context[lastExecution] = Date.now()
	  next()
	}


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const keycode = __webpack_require__(47)

	module.exports = function keyLimiter (next, context, ...keys) {
	  if (!(context.$event instanceof KeyboardEvent)) {
	    return next()
	  }

	  const key = keycode(context.$event)
	  if (keys.indexOf(key) !== -1) {
	    next()
	  }
	}


/***/ },
/* 47 */
/***/ function(module, exports) {

	// Source: http://jsfiddle.net/vWx8V/
	// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

	/**
	 * Conenience method returns corresponding value for given keyName or keyCode.
	 *
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Mixed}
	 * @api public
	 */

	exports = module.exports = function(searchInput) {
	  // Keyboard Events
	  if (searchInput && 'object' === typeof searchInput) {
	    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
	    if (hasKeyCode) searchInput = hasKeyCode
	  }

	  // Numbers
	  if ('number' === typeof searchInput) return names[searchInput]

	  // Everything else (cast to string)
	  var search = String(searchInput)

	  // check codes
	  var foundNamedKey = codes[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // check aliases
	  var foundNamedKey = aliases[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // weird character?
	  if (search.length === 1) return search.charCodeAt(0)

	  return undefined
	}

	/**
	 * Get by name
	 *
	 *   exports.code['enter'] // => 13
	 */

	var codes = exports.code = exports.codes = {
	  'backspace': 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pause/break': 19,
	  'caps lock': 20,
	  'esc': 27,
	  'space': 32,
	  'page up': 33,
	  'page down': 34,
	  'end': 35,
	  'home': 36,
	  'left': 37,
	  'up': 38,
	  'right': 39,
	  'down': 40,
	  'insert': 45,
	  'delete': 46,
	  'command': 91,
	  'left command': 91,
	  'right command': 93,
	  'numpad *': 106,
	  'numpad +': 107,
	  'numpad -': 109,
	  'numpad .': 110,
	  'numpad /': 111,
	  'num lock': 144,
	  'scroll lock': 145,
	  'my computer': 182,
	  'my calculator': 183,
	  ';': 186,
	  '=': 187,
	  ',': 188,
	  '-': 189,
	  '.': 190,
	  '/': 191,
	  '`': 192,
	  '[': 219,
	  '\\': 220,
	  ']': 221,
	  "'": 222
	}

	// Helper aliases

	var aliases = exports.aliases = {
	  'windows': 91,
	  '⇧': 16,
	  '⌥': 18,
	  '⌃': 17,
	  '⌘': 91,
	  'ctl': 17,
	  'control': 17,
	  'option': 18,
	  'pause': 19,
	  'break': 19,
	  'caps': 20,
	  'return': 13,
	  'escape': 27,
	  'spc': 32,
	  'pgup': 33,
	  'pgdn': 34,
	  'ins': 45,
	  'del': 46,
	  'cmd': 91
	}


	/*!
	 * Programatically add the following
	 */

	// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

	// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i

	// function keys
	for (i = 1; i < 13; i++) codes['f'+i] = i + 111

	// numpad keys
	for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */

	var names = exports.names = exports.title = {} // title for backward compat

	// Create reverse mapping
	for (i in codes) names[codes[i]] = i

	// Add aliases
	for (var alias in aliases) {
	  codes[alias] = aliases[alias]
	}


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const core = __webpack_require__(4)
	const middlewares = __webpack_require__(11)

	module.exports = function routerComp (config) {
	  return core.component(config)
	    .use(middlewares.router)
	}


/***/ }
/******/ ]);
