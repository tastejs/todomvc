(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

// Associates DOM Nodes with state objects.
var StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
var NodeCache = new Map();

// Cache transition functions.
var TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
var MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();

var caches = Object.freeze({
	StateCache: StateCache,
	NodeCache: NodeCache,
	TransitionCache: TransitionCache,
	MiddlewareCache: MiddlewareCache
});

// A modest size.
var size = 10000;

var free = new Set();
var allocate = new Set();
var _protect = new Set();
var shape = function shape() {
  return {
    rawNodeName: '',
    nodeName: '',
    nodeValue: '',
    nodeType: 1,
    key: '',
    childNodes: [],
    attributes: {}
  };
};

// Creates a pool to query new or reused values from.
var memory = { free: free, allocated: allocate, protected: _protect };

// Prime the free memory pool with VTrees.
for (var i = 0; i < size; i++) {
  free.add(shape());
}

// Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.
var freeValues = free.values();

// Cache VTree objects in a pool which is used to get
var Pool = {
  size: size,
  memory: memory,

  get: function get() {
    var _freeValues$next = freeValues.next(),
        _freeValues$next$valu = _freeValues$next.value,
        value = _freeValues$next$valu === undefined ? shape() : _freeValues$next$valu,
        done = _freeValues$next.done;

    // This extra bit of work allows us to avoid calling `free.values()` every
    // single time an object is needed.


    if (done) {
      freeValues = free.values();
    }

    free.delete(value);
    allocate.add(value);
    return value;
  },
  protect: function protect(value) {
    allocate.delete(value);
    _protect.add(value);
  },
  unprotect: function unprotect(value) {
    if (_protect.has(value)) {
      _protect.delete(value);
      free.add(value);
    }
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var CreateTreeHookCache = MiddlewareCache.CreateTreeHookCache;
var isArray = Array.isArray;

var fragmentName = '#document-fragment';

function createTree(input, attributes, childNodes) {
  var arguments$1 = arguments;

  for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments$1[_key];
  }

  // If no input was provided then we return an indication as such.
  if (!input) {
    return null;
  }

  // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.
  if (isArray(input)) {
    childNodes = [];

    for (var i = 0; i < input.length; i++) {
      var newTree = createTree(input[i]);
      if (!newTree) {
        continue;
      }
      var isFragment = newTree.nodeType === 11;

      if (typeof newTree.rawNodeName === 'string' && isFragment) {
        var _childNodes;

        (_childNodes = childNodes).push.apply(_childNodes, toConsumableArray(newTree.childNodes));
      } else {
        childNodes.push(newTree);
      }
    }

    return createTree(fragmentName, null, childNodes);
  }

  var isObject = (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';

  // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
  if (input && isObject && 'parentNode' in input) {
    attributes = {};
    childNodes = [];

    // When working with a text node, simply save the nodeValue as the
    // initial value.
    if (input.nodeType === 3) {
      childNodes = input.nodeValue;
    }
    // Element types are the only kind of DOM node we care about attributes
    // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
    // ignore this.
    else if (input.nodeType === 1 && input.attributes.length) {
        attributes = {};

        for (var _i = 0; _i < input.attributes.length; _i++) {
          var _input$attributes$_i = input.attributes[_i],
              name = _input$attributes$_i.name,
              value = _input$attributes$_i.value;

          // If the attribute's value is empty, seek out the property instead.

          if (value === '' && name in input) {
            attributes[name] = input[name];
            continue;
          }

          attributes[name] = value;
        }
      }

    // Get the child nodes from an Element or Fragment/Shadow Root.
    if (input.nodeType === 1 || input.nodeType === 11) {
      if (input.childNodes.length) {
        childNodes = [];

        for (var _i2 = 0; _i2 < input.childNodes.length; _i2++) {
          childNodes.push(createTree(input.childNodes[_i2]));
        }
      }
    }

    var _vTree = createTree(input.nodeName, attributes, childNodes);
    NodeCache.set(_vTree, input);
    return _vTree;
  }

  // Assume any object value is a valid VTree object.
  if (isObject) {
    return input;
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes].concat(rest);
  }

  // Allocate a new VTree from the pool.
  var entry = Pool.get();
  var isTextNode = input === '#text';
  var isString = typeof input === 'string';

  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = isString ? input.toLowerCase() : '#document-fragment';
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (isTextNode) {
    var _nodes = arguments.length === 2 ? attributes : childNodes;
    var nodeValue = isArray(_nodes) ? _nodes.join('') : _nodes;

    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');

    return entry;
  }

  if (input === fragmentName || typeof input !== 'string') {
    entry.nodeType = 11;
  } else if (input === '#comment') {
    entry.nodeType = 8;
  } else {
    entry.nodeType = 1;
  }

  var useAttributes = isArray(attributes) || (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) !== 'object';
  var nodes = useAttributes ? attributes : childNodes;
  var nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (var _i3 = 0; _i3 < nodeArray.length; _i3++) {
      var newNode = nodeArray[_i3];
      var _isArray = Array.isArray(newNode);

      // Merge in arrays.
      if (_isArray) {
        for (var _i4 = 0; _i4 < newNode.length; _i4++) {
          entry.childNodes.push(newNode[_i4]);
        }
      }
      // Merge in fragments.
      else if (newNode.nodeType === 11 && typeof newNode.rawNodeName === 'string') {
          for (var _i5 = 0; _i5 < newNode.childNodes.length; _i5++) {
            entry.childNodes.push(newNode.childNodes[_i5]);
          }
        }
        // Assume objects are vTrees.
        else if (newNode && (typeof newNode === 'undefined' ? 'undefined' : _typeof(newNode)) === 'object') {
            entry.childNodes.push(newNode);
          }
          // Cover generate cases where a user has indicated they do not want a
          // node from appearing.
          else if (newNode) {
              entry.childNodes.push(createTree('#text', null, newNode));
            }
    }
  }

  if (attributes && (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // If is a script tag and has a src attribute, key off that.
  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  }

  // Set the `key` prop if passed as an attr, overrides `script[src]`.
  if (entry.attributes && 'key' in entry.attributes) {
    entry.key = String(entry.attributes.key);
  }

  var vTree = entry;

  CreateTreeHookCache.forEach(function (fn, retVal) {
    // Invoke all the `createNodeHook` functions passing along this transaction
    // as the only argument. These functions must return valid vTree values.
    if (retVal = fn(vTree)) {
      vTree = retVal;
    }
  });

  return vTree;
}

var process$1 = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' }
};

var CreateNodeHookCache = MiddlewareCache.CreateNodeHookCache;

var namespace = 'http://www.w3.org/2000/svg';

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @param {Boolean} - Is their a root SVG element?
 * @return {Object} - A DOM Node matching the vTree
 */
function createNode(vTree) {
  var ownerDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var isSVG = arguments[2];

  var existingNode = NodeCache.get(vTree);

  // If the DOM Node was already created, reuse the existing node.
  if (existingNode) {
    return existingNode;
  }

  var nodeName = vTree.nodeName,
      _vTree$childNodes = vTree.childNodes,
      childNodes = _vTree$childNodes === undefined ? [] : _vTree$childNodes;

  isSVG = isSVG || nodeName === 'svg';

  // Will vary based on the properties of the VTree.
  var domNode = null;

  CreateNodeHookCache.forEach(function (fn, retVal) {
    // Invoke all the `createNodeHook` functions passing along the vTree as the
    // only argument. These functions must return a valid DOM Node value.
    if (retVal = fn(vTree)) {
      domNode = retVal;
    }
  });

  if (!domNode) {
    // Create empty text elements. They will get filled in during the patch
    // process.
    if (nodeName === '#text') {
      domNode = ownerDocument.createTextNode(vTree.nodeValue);
    }
    // Support dynamically creating document fragments.
    else if (nodeName === '#document-fragment') {
        domNode = ownerDocument.createDocumentFragment();
      }
      // Support SVG.
      else if (isSVG) {
          domNode = ownerDocument.createElementNS(namespace, nodeName);
        }
        // If not a Text or SVG Node, then create with the standard method.
        else {
            domNode = ownerDocument.createElement(nodeName);
          }
  }

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (var i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], ownerDocument, isSVG));
  }

  return domNode;
}

// Support loading diffHTML in non-browser environments.
var g = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : window;
var element = g.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}

/**
 * Tiny HTML escaping function, useful to protect against things like XSS and
 * unintentionally breaking attributes with quotes.
 *
 * @param {String} unescaped - An HTML value, unescaped
 * @return {String} - An HTML-safe string
 */
function escape(unescaped) {
  return unescaped.replace(/[&<>]/g, function (match) {
    return "&#" + match.charCodeAt(0) + ";";
  });
}

var marks = new Map();
var prefix = 'diffHTML';
var DIFF_PERF = 'diff_perf';

var hasSearch = typeof location !== 'undefined';
var hasArguments = typeof process !== 'undefined' && process.argv;
var nop = function nop() {};

var makeMeasure = (function (domNode, vTree) {
  // Check for these changes on every check.
  var wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
  var wantsArguments = hasArguments && process.argv.includes(DIFF_PERF);
  var wantsPerfChecks = wantsSearch || wantsArguments;

  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) {
    return nop;
  }

  return function (name) {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = domNode.host.constructor.name + ' ' + name;
    } else if (typeof vTree.rawNodeName === 'function') {
      name = vTree.rawNodeName.name + ' ' + name;
    }

    var endName = name + '-end';

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      var totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(prefix + ' ' + name + ' (' + totalMs + 'ms)', name, endName);
    }
  };
});

var memory$1 = Pool.memory;
var protect = Pool.protect;
var unprotect = Pool.unprotect;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */

function protectVTree(vTree) {
  protect(vTree);

  for (var i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */
function unprotectVTree(vTree) {
  unprotect(vTree);

  for (var i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory() {
  var isBusy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  StateCache.forEach(function (state) {
    return isBusy = state.isRendering || isBusy;
  });

  // TODO Pause GC in between renders.
  //if (isBusy) {
  //  return;
  //}

  memory$1.allocated.forEach(function (vTree) {
    return memory$1.free.add(vTree);
  });
  memory$1.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  NodeCache.forEach(function (node, descriptor) {
    if (!memory$1.protected.has(descriptor)) {
      NodeCache.delete(descriptor);
    }
  });
}

var memory$2 = Object.freeze({
	protectVTree: protectVTree,
	unprotectVTree: unprotectVTree,
	cleanMemory: cleanMemory
});

var internals = Object.assign({
  decodeEntities: decodeEntities,
  escape: escape,
  makeMeasure: makeMeasure,
  memory: memory$2,
  Pool: Pool,
  process: process$1
}, caches);

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  var state = transaction.state;

  // If there is an in-flight transaction render happening, push this
  // transaction into a queue.

  if (state.isRendering) {
    // Resolve an existing transaction that we're going to pave over in the
    // next statement.
    if (state.nextTransaction) {
      state.nextTransaction.promises[0].resolve(state.nextTransaction);
    }

    // Set a pointer to this current transaction to render immediatately after
    // the current transaction completes.
    state.nextTransaction = transaction;

    var deferred = {};
    var resolver = new Promise(function (resolve) {
      return deferred.resolve = resolve;
    });

    resolver.resolve = deferred.resolve;
    transaction.promises = [resolver];

    return transaction.abort();
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
}

function shouldUpdate(transaction) {
  var markup = transaction.markup,
      state = transaction.state,
      measure = transaction.state.measure;


  measure('should update');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}

function reconcileTrees(transaction) {
  var state = transaction.state,
      domNode = transaction.domNode,
      markup = transaction.markup,
      options = transaction.options;
  var previousMarkup = state.previousMarkup;
  var inner = options.inner;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.

  if (previousMarkup !== domNode.outerHTML || !state.oldTree) {
    if (state.oldTree) {
      unprotectVTree(state.oldTree);
    }

    state.oldTree = createTree(domNode);
    NodeCache.set(state.oldTree, domNode);
    protectVTree(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).
  if (!transaction.newTree) {
    transaction.newTree = createTree(markup);
  }

  // If we are diffing only the parent's childNodes, then adjust the newTree to
  // be a replica of the oldTree except with the childNodes changed.
  if (inner) {
    var oldTree = transaction.oldTree,
        newTree = transaction.newTree;
    var rawNodeName = oldTree.rawNodeName,
        nodeName = oldTree.nodeName,
        attributes = oldTree.attributes;

    var isUnknown = typeof newTree.rawNodeName !== 'string';
    var isFragment = newTree.nodeType === 11;
    var children = isFragment && !isUnknown ? newTree.childNodes : newTree;

    transaction.newTree = createTree(nodeName, attributes, children);
  }
}

var SyncTreeHookCache = MiddlewareCache.SyncTreeHookCache;
var empty = {};
var keyNames = ['old', 'new'];

// Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.
function syncTree(oldTree, newTree, patches) {
  var arguments$1 = arguments;

  if (!oldTree) { oldTree = empty; }
  if (!newTree) { newTree = empty; }

  var oldNodeName = oldTree.nodeName;
  var newNodeName = newTree.nodeName;
  var isFragment = newTree.nodeType === 11;
  var isEmpty = oldTree === empty;

  // Reuse these maps, it's more efficient to clear them than to re-create.
  var keysLookup = { old: new Map(), new: new Map() };

  for (var i = 0; i < keyNames.length; i++) {
    var keyName = keyNames[i];
    var map = keysLookup[keyName];
    var vTree = arguments$1[i];
    var nodes = vTree && vTree.childNodes;

    if (nodes && nodes.length) {
      for (var _i = 0; _i < nodes.length; _i++) {
        var _vTree = nodes[_i];

        if (_vTree.key) {
          map.set(_vTree.key, _vTree);
        }
      }
    }
  }

  // Invoke any middleware hooks, allow the middleware to replace the
  // `newTree`. Pass along the `keysLookup` object so that middleware can make
  // smart decisions when dealing with keys.
  SyncTreeHookCache.forEach(function (fn, retVal) {
    if ((retVal = fn(oldTree, newTree, null)) && retVal !== newTree) {
      newTree = retVal;

      // Find attributes.
      syncTree(null, retVal, patches);
    }

    for (var _i2 = 0; _i2 < newTree.childNodes.length; _i2++) {
      var oldChildNode = isEmpty ? empty : oldTree.childNodes[_i2];
      var newChildNode = newTree.childNodes[_i2];

      if (retVal = fn(oldChildNode, newChildNode, keysLookup)) {
        newTree.childNodes[_i2] = retVal;
      }
    }
  });

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
    TREE_OPS: [],
    NODE_VALUE: []
  };

  var _patches = patches,
      SET_ATTRIBUTE = _patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = _patches.REMOVE_ATTRIBUTE,
      TREE_OPS = _patches.TREE_OPS,
      NODE_VALUE = _patches.NODE_VALUE;

  // Build up a patchset object to use for tree operations.

  var patchset = {
    INSERT_BEFORE: [],
    REMOVE_CHILD: [],
    REPLACE_CHILD: []
  };

  // USED: INSERT_BEFORE: 3x, REMOVE_CHILD: 2x, REPLACE_CHILD: 3x.
  var INSERT_BEFORE = patchset.INSERT_BEFORE,
      REMOVE_CHILD = patchset.REMOVE_CHILD,
      REPLACE_CHILD = patchset.REPLACE_CHILD;

  var isElement = newTree.nodeType === 1;

  // Text nodes are low level and frequently change, so this path is accounted
  // for first.
  if (newTree.nodeName === '#text') {
    // If there was no previous element to compare to, simply set the value
    // on the new node.
    if (oldTree.nodeName !== '#text') {
      NODE_VALUE.push(newTree, newTree.nodeValue, null);
    }
    // If both VTrees are text nodes and the values are different, change the
    // `Element#nodeValue`.
    else if (!isEmpty && oldTree.nodeValue !== newTree.nodeValue) {
        NODE_VALUE.push(oldTree, newTree.nodeValue, oldTree.nodeValue);
        oldTree.nodeValue = newTree.nodeValue;
      }

    return patches;
  }

  // Seek out attribute changes first, but only from element Nodes.
  if (isElement) {
    var oldAttributes = isEmpty ? empty : oldTree.attributes;
    var newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (var key in newAttributes) {
      var value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (!isEmpty) {
        oldAttributes[key] = value;
      }

      SET_ATTRIBUTE.push(isEmpty ? newTree : oldTree, key, value);
    }

    // Search for removals.
    if (!isEmpty) {
      for (var _key in oldAttributes) {
        if (_key in newAttributes) {
          continue;
        }
        REMOVE_ATTRIBUTE.push(oldTree, _key);
        delete oldAttributes[_key];
      }
    }
  }

  // If we somehow end up comparing two totally different kinds of elements,
  // we'll want to raise an error to let the user know something is wrong.
  var newChildNodes = newTree.childNodes;

  // Scan all childNodes for attribute changes.
  if (isEmpty) {
    // Do a single pass over the new child nodes.
    for (var _i3 = 0; _i3 < newChildNodes.length; _i3++) {
      syncTree(null, newChildNodes[_i3], patches);
    }

    return patches;
  }

  var oldChildNodes = oldTree.childNodes;

  // If we are working with keys, we can follow an optimized path.
  if (keysLookup.old.size || keysLookup.new.size) {
    var values = keysLookup.old.values();

    // Do a single pass over the new child nodes.
    for (var _i4 = 0; _i4 < newChildNodes.length; _i4++) {
      var oldChildNode = oldChildNodes[_i4];
      var newChildNode = newChildNodes[_i4];
      var newKey = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      var oldKey = oldChildNode.key;
      var oldInNew = keysLookup.new.has(oldKey);
      var newInOld = keysLookup.old.has(newKey);

      // Remove the old Node and insert the new node (aka replace).
      if (!oldInNew && !newInOld) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }
      // Remove the old node instead of replacing.
      else if (!oldInNew) {
          REMOVE_CHILD.push(oldChildNode);
          oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
          _i4 = _i4 - 1;
          continue;
        }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (newKey !== oldKey) {
        var optimalNewNode = newChildNode;

        // Prefer existing to new and remove from old position.
        if (newKey && newInOld) {
          optimalNewNode = keysLookup.old.get(newKey);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        } else if (newKey) {
          optimalNewNode = newChildNode;

          // Find attribute changes for this Node.
          syncTree(null, newChildNode, patches);
        }

        INSERT_BEFORE.push(oldTree, optimalNewNode, oldChildNode);
        oldChildNodes.splice(_i4, 0, optimalNewNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldTree.childNodes[_i4] = newChildNode;
        syncTree(null, newChildNode, patches);
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
      // Do a single pass over the new child nodes.
      for (var _i5 = 0; _i5 < newChildNodes.length; _i5++) {
        var _oldChildNode = oldChildNodes && oldChildNodes[_i5];
        var _newChildNode = newChildNodes[_i5];

        // If there is no old element to compare to, this is a simple addition.
        if (!_oldChildNode) {
          INSERT_BEFORE.push(oldTree, _newChildNode, null);

          if (oldChildNodes) {
            oldChildNodes.push(_newChildNode);
          }

          syncTree(null, _newChildNode, patches);
          continue;
        }

        // If the element we're replacing is totally different from the previous
        // replace the entire element, don't bother investigating children.
        if (_oldChildNode.nodeName !== _newChildNode.nodeName) {
          REPLACE_CHILD.push(_newChildNode, _oldChildNode);
          oldTree.childNodes[_i5] = _newChildNode;
          syncTree(null, _newChildNode, patches);
          continue;
        }

        syncTree(_oldChildNode, _newChildNode, patches);
      }
    }

  // If there was no `oldTree` provided, we have sync'd all the attributes and
  // the node value of the `newTree` so we can early abort and not worry about
  // tree operations.
  if (isEmpty) {
    return patches;
  }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (var _i6 = newChildNodes.length; _i6 < oldChildNodes.length; _i6++) {
      REMOVE_CHILD.push(oldChildNodes[_i6]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE.length || REMOVE_CHILD.length || REPLACE_CHILD.length) {
    // Null out the empty arrays.
    if (!INSERT_BEFORE.length) {
      patchset.INSERT_BEFORE = null;
    }
    if (!REMOVE_CHILD.length) {
      patchset.REMOVE_CHILD = null;
    }
    if (!REPLACE_CHILD.length) {
      patchset.REPLACE_CHILD = null;
    }

    TREE_OPS.push(patchset);
  }

  return patches;
}

function syncTrees(transaction) {
  var measure = transaction.state.measure,
      oldTree = transaction.oldTree,
      newTree = transaction.newTree,
      domNode = transaction.domNode;


  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    transaction.patches = {
      TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }],
      SET_ATTRIBUTE: [],
      REMOVE_ATTRIBUTE: [],
      NODE_VALUE: []
    };

    unprotectVTree(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;
    protectVTree(transaction.oldTree);

    // Update the StateCache since we are changing the top level element.
    StateCache.set(createNode(newTree), transaction.state);
  }
  // Otherwise only diff the children.
  else {
      transaction.patches = syncTree(oldTree, newTree);
    }

  measure('sync trees');
}

// Available transition states.
var stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(function (stateName) {
  return TransitionCache.set(stateName, new Set());
});

function addTransitionState(stateName, callback) {
  TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (!callback && stateName) {
    TransitionCache.get(stateName).clear();
  }
  // Remove a specific transition callback.
  else if (stateName && callback) {
      TransitionCache.get(stateName).delete(callback);
    }
    // Remove all callbacks.
    else {
        for (var i = 0; i < stateNames.length; i++) {
          TransitionCache.get(stateNames[i]).clear();
        }
      }
}

function runTransitions(setName) {
  var arguments$1 = arguments;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments$1[_key];
  }

  var set$$1 = TransitionCache.get(setName);
  var promises = [];

  if (!set$$1.size) {
    return promises;
  }

  // Ignore text nodes.
  if (setName !== 'textChanged' && args[0].nodeType === 3) {
    return promises;
  }

  // Run each transition callback, if on the attached/detached.
  set$$1.forEach(function (callback) {
    var retVal = callback.apply(undefined, args);

    // Is a `thennable` object or Native Promise.
    if ((typeof retVal === 'undefined' ? 'undefined' : _typeof(retVal)) === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  if (setName === 'attached' || setName === 'detached') {
    var element = args[0];

    [].concat(toConsumableArray(element.childNodes)).forEach(function (childNode) {
      promises.push.apply(promises, toConsumableArray(runTransitions.apply(undefined, [setName, childNode].concat(toConsumableArray(args.slice(1))))));
    });
  }

  return promises;
}

var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var removeAttribute = function removeAttribute(domNode, name) {
  domNode.removeAttribute(name);

  if (name in domNode) {
    domNode[name] = undefined;
  }
};

var blacklist = new Set();

function patchNode(patches) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var promises = [];
  var TREE_OPS = patches.TREE_OPS,
      NODE_VALUE = patches.NODE_VALUE,
      SET_ATTRIBUTE = patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;
  var isSVG = state.isSVG,
      ownerDocument = state.ownerDocument;

  // Set attributes.

  if (SET_ATTRIBUTE.length) {
    for (var i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      var vTree = SET_ATTRIBUTE[i];
      var _name = SET_ATTRIBUTE[i + 1];
      var value = decodeEntities(SET_ATTRIBUTE[i + 2]);

      var domNode = createNode(vTree, ownerDocument, isSVG);
      var oldValue = domNode.getAttribute(_name);
      var newPromises = runTransitions('attributeChanged', domNode, _name, oldValue, value);

      // Triggered either synchronously or asynchronously depending on if a
      // transition was invoked.
      var isObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
      var isFunction = typeof value === 'function';

      // Events must be lowercased otherwise they will not be set correctly.
      var name = _name.indexOf('on') === 0 ? _name.toLowerCase() : _name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        var noValue = value === null || value === undefined;
        // Runtime checking if the property can be set.
        var blacklistName = vTree.nodeName + '-' + name;

        // If the property has not been blacklisted then use try/catch to try
        // and set it.
        if (!blacklist.has(blacklistName)) {
          try {
            domNode[name] = value;
          } catch (unhandledException) {
            blacklist.add(blacklistName);
          }
        }

        // Set the actual attribute, this will ensure attributes like
        // `autofocus` aren't reset by the property call above.
        domNode.setAttribute(name, noValue ? '' : value);
      }
      // Support patching an object representation of the style object.
      else if (isObject && name === 'style') {
          var keys = Object.keys(value);

          for (var _i = 0; _i < keys.length; _i++) {
            domNode.style[keys[_i]] = value[keys[_i]];
          }
        } else if (typeof value !== 'string') {
          // We remove and re-add the attribute to trigger a change in a web
          // component or mutation observer. Although you could use a setter or
          // proxy, this is more natural.
          if (domNode.hasAttribute(name) && domNode[name] !== value) {
            domNode.removeAttribute(name, '');
          }

          // Necessary to track the attribute/prop existence.
          domNode.setAttribute(name, '');

          // Since this is a property value it gets set directly on the node.
          try {
            domNode[name] = value;
          } catch (unhandledException) {}
        }

      if (newPromises.length) {
        promises.push.apply(promises, toConsumableArray(newPromises));
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    var _loop = function _loop(_i2) {
      var vTree = REMOVE_ATTRIBUTE[_i2];
      var name = REMOVE_ATTRIBUTE[_i2 + 1];

      var domNode = NodeCache.get(vTree);
      var attributeChanged = TransitionCache.get('attributeChanged');
      var oldValue = domNode.getAttribute(name);
      var newPromises = runTransitions('attributeChanged', domNode, name, oldValue, null);

      if (newPromises.length) {
        Promise.all(newPromises).then(function () {
          return removeAttribute(domNode, name);
        });
        promises.push.apply(promises, toConsumableArray(newPromises));
      } else {
        removeAttribute(domNode, name);
      }
    };

    for (var _i2 = 0; _i2 < REMOVE_ATTRIBUTE.length; _i2 += 2) {
      _loop(_i2);
    }
  }

  // Once attributes have been synchronized into the DOM Nodes, assemble the
  // DOM Tree.
  for (var _i3 = 0; _i3 < TREE_OPS.length; _i3++) {
    var _TREE_OPS$_i = TREE_OPS[_i3],
        INSERT_BEFORE = _TREE_OPS$_i.INSERT_BEFORE,
        REMOVE_CHILD = _TREE_OPS$_i.REMOVE_CHILD,
        REPLACE_CHILD = _TREE_OPS$_i.REPLACE_CHILD;

    // Insert/append elements.

    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (var _i4 = 0; _i4 < INSERT_BEFORE.length; _i4 += 3) {
        var _vTree = INSERT_BEFORE[_i4];
        var newTree = INSERT_BEFORE[_i4 + 1];
        var refTree = INSERT_BEFORE[_i4 + 2];

        var _domNode = NodeCache.get(_vTree);
        var refNode = refTree && createNode(refTree, ownerDocument, isSVG);
        var attached = TransitionCache.get('attached');

        if (refTree) {
          protectVTree(refTree);
        }

        var newNode = createNode(newTree, ownerDocument, isSVG);
        protectVTree(newTree);

        // If refNode is `null` then it will simply append like `appendChild`.
        _domNode.insertBefore(newNode, refNode);

        var attachedPromises = runTransitions('attached', newNode);

        promises.push.apply(promises, toConsumableArray(attachedPromises));
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      var _loop2 = function _loop2(_i5) {
        var vTree = REMOVE_CHILD[_i5];
        var domNode = NodeCache.get(vTree);
        var detached = TransitionCache.get('detached');
        var detachedPromises = runTransitions('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(function () {
            domNode.parentNode.removeChild(domNode);
            unprotectVTree(vTree);
          });

          promises.push.apply(promises, toConsumableArray(detachedPromises));
        } else {
          domNode.parentNode.removeChild(domNode);
          unprotectVTree(vTree);
        }
      };

      for (var _i5 = 0; _i5 < REMOVE_CHILD.length; _i5++) {
        _loop2(_i5);
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      var _loop3 = function _loop3(_i6) {
        var newTree = REPLACE_CHILD[_i6];
        var oldTree = REPLACE_CHILD[_i6 + 1];

        var oldDomNode = NodeCache.get(oldTree);
        var newDomNode = createNode(newTree, ownerDocument, isSVG);
        var attached = TransitionCache.get('attached');
        var detached = TransitionCache.get('detached');
        var replaced = TransitionCache.get('replaced');

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        protectVTree(newTree);

        var attachedPromises = runTransitions('attached', newDomNode);
        var detachedPromises = runTransitions('detached', oldDomNode);
        var replacedPromises = runTransitions('replaced', oldDomNode, newDomNode);
        var allPromises = [].concat(toConsumableArray(attachedPromises), toConsumableArray(detachedPromises), toConsumableArray(replacedPromises));

        if (allPromises.length) {
          Promise.all(allPromises).then(function () {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            unprotectVTree(oldTree);
          });

          promises.push.apply(promises, toConsumableArray(allPromises));
        } else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          unprotectVTree(oldTree);
        }
      };

      for (var _i6 = 0; _i6 < REPLACE_CHILD.length; _i6 += 2) {
        _loop3(_i6);
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (var _i7 = 0; _i7 < NODE_VALUE.length; _i7 += 3) {
      var _vTree2 = NODE_VALUE[_i7];
      var nodeValue = NODE_VALUE[_i7 + 1];
      var _oldValue = NODE_VALUE[_i7 + 2];
      var _domNode2 = NodeCache.get(_vTree2);
      var textChanged = TransitionCache.get('textChanged');
      var textChangedPromises = runTransitions('textChanged', _domNode2, _oldValue, nodeValue);

      var parentNode = _domNode2.parentNode;


      if (nodeValue.includes('&')) {
        _domNode2.nodeValue = decodeEntities(nodeValue);
      } else {
        _domNode2.nodeValue = nodeValue;
      }

      if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
        parentNode.nodeValue = escape(decodeEntities(nodeValue));
      }

      if (textChangedPromises.length) {
        promises.push.apply(promises, toConsumableArray(textChangedPromises));
      }
    }
  }

  return promises;
}

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
  var domNode = transaction.domNode,
      state = transaction.state,
      measure = transaction.state.measure,
      patches = transaction.patches;
  var _transaction$promises = transaction.promises,
      promises = _transaction$promises === undefined ? [] : _transaction$promises;
  var _domNode$namespaceURI = domNode.namespaceURI,
      namespaceURI = _domNode$namespaceURI === undefined ? '' : _domNode$namespaceURI,
      nodeName = domNode.nodeName;


  state.isSVG = nodeName.toLowerCase() === 'svg' || namespaceURI.includes('svg');
  state.ownerDocument = domNode.ownerDocument || document;

  measure('patch node');
  promises.push.apply(promises, toConsumableArray(patchNode(patches, state)));
  measure('patch node');

  transaction.promises = promises;
}

// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  var _transaction$promises = transaction.promises,
      promises = _transaction$promises === undefined ? [] : _transaction$promises;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.

  if (promises.length) {
    return Promise.all(promises).then(function () {
      return transaction.end();
    });
  } else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}

var defaultTasks = [schedule, shouldUpdate, reconcileTrees, syncTrees, patch, endAsPromise];

var tasks = {
  schedule: schedule, shouldUpdate: shouldUpdate, reconcileTrees: reconcileTrees, syncTrees: syncTrees, patchNode: patch, endAsPromise: endAsPromise
};

var Transaction = function () {
  createClass(Transaction, null, [{
    key: 'create',
    value: function create(domNode, markup, options) {
      return new Transaction(domNode, markup, options);
    }
  }, {
    key: 'renderNext',
    value: function renderNext(state) {
      if (!state.nextTransaction) {
        return;
      }

      // Create the next transaction.
      var nextTransaction = state.nextTransaction,
          promises = state.nextTransaction.promises;

      var resolver = promises && promises[0];

      state.nextTransaction = undefined;
      nextTransaction.aborted = false;

      // Remove the last task, this has already been executed (via abort).
      nextTransaction.tasks.pop();

      // Reflow this transaction.
      Transaction.flow(nextTransaction, nextTransaction.tasks);

      // Wait for the promises to complete if they exist, otherwise resolve
      // immediately.
      if (promises && promises.length > 1) {
        Promise.all(promises.slice(1)).then(function () {
          return resolver.resolve();
        });
      } else if (resolver) {
        resolver.resolve();
      }
    }
  }, {
    key: 'flow',
    value: function flow(transaction, tasks) {
      var retVal = transaction;

      // Execute each "task" serially, passing the transaction as a baton that
      // can be used to share state across the tasks.
      for (var i = 0; i < tasks.length; i++) {
        // If aborted, don't execute any more tasks.
        if (transaction.aborted) {
          return retVal;
        }

        // Run the task.
        retVal = tasks[i](transaction);

        // The last `returnValue` is what gets sent to the consumer. This
        // mechanism is crucial for the `abort`, if you want to modify the "flow"
        // that's fine, but you must ensure that your last task provides a
        // mechanism to know when the transaction completes. Something like
        // callbacks or a Promise.
        if (retVal !== undefined && retVal !== transaction) {
          return retVal;
        }
      }
    }
  }, {
    key: 'assert',
    value: function assert(transaction) {
      
    }
  }, {
    key: 'invokeMiddleware',
    value: function invokeMiddleware(transaction) {
      var tasks = transaction.tasks;


      MiddlewareCache.forEach(function (fn) {
        // Invoke all the middleware passing along this transaction as the only
        // argument. If they return a value (must be a function) it will be added
        // to the transaction task flow.
        var result = fn(transaction);

        if (result) {
          tasks.push(result);
        }
      });
    }
  }]);

  function Transaction(domNode, markup, options) {
    classCallCheck(this, Transaction);

    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = StateCache.get(domNode) || {
      measure: makeMeasure(domNode, markup)
    };

    this.tasks = [].concat(options.tasks);

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  createClass(Transaction, [{
    key: 'start',
    value: function start() {
      var domNode = this.domNode,
          measure = this.state.measure,
          tasks = this.tasks;

      var takeLastTask = tasks.pop();

      this.aborted = false;

      // Add middleware in as tasks.
      Transaction.invokeMiddleware(this);

      // Measure the render flow if the user wants to track performance.
      measure('render');

      // Push back the last task as part of ending the flow.
      tasks.push(takeLastTask);

      return Transaction.flow(this, tasks);
    }

    // This will immediately call the last flow task and terminate the flow. We
    // call the last task to ensure that the control flow completes. This should
    // end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
    // `return someValue` to provide the most accurate performance reading. This
    // doesn't matter practically besides that.

  }, {
    key: 'abort',
    value: function abort() {
      var state = this.state;


      this.aborted = true;

      // Grab the last task in the flow and return, this task will be responsible
      // for calling `transaction.end`.
      return this.tasks[this.tasks.length - 1](this);
    }
  }, {
    key: 'end',
    value: function end() {
      var _this = this;

      var state = this.state,
          domNode = this.domNode,
          options = this.options;
      var measure = state.measure;
      var inner = options.inner;


      measure('finalize');

      this.completed = true;

      // Mark the end to rendering.
      measure('finalize');
      measure('render');

      // Trigger all `onceEnded` callbacks, so that middleware can know the
      // transaction has ended.
      this.endedCallbacks.forEach(function (callback) {
        return callback(_this);
      });
      this.endedCallbacks.clear();

      // Cache the markup and text for the DOM node to allow for short-circuiting
      // future render transactions.
      state.previousMarkup = domNode.outerHTML;
      state.isRendering = false;

      // Clean up memory before rendering the next transaction, however if
      // another transaction is running concurrently this will be delayed until
      // the last render completes.
      cleanMemory();

      // Try and render the next transaction if one has been saved.
      Transaction.renderNext(state);

      return this;
    }
  }, {
    key: 'onceEnded',
    value: function onceEnded(callback) {
      this.endedCallbacks.add(callback);
    }
  }]);
  return Transaction;
}();

function innerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = true;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(element, markup, options).start();
}

function outerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = false;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(element, markup, options).start();
}

function release(domNode) {
  // Try and find a state object for this DOM Node.
  var state = StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    unprotectVTree(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  StateCache.delete(domNode);

  // Recycle all unprotected objects.
  cleanMemory();
}

var CreateTreeHookCache$1 = MiddlewareCache.CreateTreeHookCache;
var CreateNodeHookCache$1 = MiddlewareCache.CreateNodeHookCache;
var SyncTreeHookCache$1 = MiddlewareCache.SyncTreeHookCache;


function use(middleware) {
  var subscribe = middleware.subscribe,
      unsubscribe = middleware.unsubscribe,
      createTreeHook = middleware.createTreeHook,
      createNodeHook = middleware.createNodeHook,
      syncTreeHook = middleware.syncTreeHook;

  // Add the function to the set of middlewares.

  MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe();

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache$1.add(createTreeHook);
  createNodeHook && CreateNodeHookCache$1.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache$1.add(syncTreeHook);

  // The unsubscribe method for the middleware.
  return function () {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe();

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache$1.delete(createTreeHook);
    CreateNodeHookCache$1.delete(createNodeHook);
    SyncTreeHookCache$1.delete(syncTreeHook);
  };
}

var __VERSION__ = '1.0.0-beta';

var VERSION = __VERSION__ + '-runtime';

var api = {
  VERSION: VERSION,
  addTransitionState: addTransitionState,
  removeTransitionState: removeTransitionState,
  release: release,
  createTree: createTree,
  use: use,
  outerHTML: outerHTML,
  innerHTML: innerHTML,
  html: createTree,
  defaultTasks: defaultTasks
};

// This is an internal API exported purely for middleware and extensions to
// leverage internal APIs that are not part of the public API. There are no
// promises that this will not break in the future. We will attempt to minimize
// changes and will supply fallbacks when APIs change.
var Internals = Object.assign(internals, api, { defaultTasks: defaultTasks, tasks: tasks, createNode: createNode });

// Attach a circular reference to `Internals` for ES/CJS builds.
api.Internals = Internals;

// Automatically hook up to DevTools if they are present.
if (typeof devTools === 'function') {
  use(devTools(Internals));
  console.info('diffHTML DevTools Found and Activated...');
}

(typeof window !== 'undefined' ? window : global).process = Internals.process;

var ComponentTreeCache = new WeakMap();
var InstanceCache = new WeakMap();

var NodeCache$2 = Internals.NodeCache;
var assign$3 = Object.assign;

function triggerRef(ref, instance) {
  if (typeof ref === 'function') {
    ref(instance);
  } else if (typeof ref === 'string') {
    this[ref](instance);
  }
}

function searchForRefs(newTree) {
  if (newTree.attributes.ref) {
    triggerRef(newTree.attributes.ref, NodeCache$2.get(newTree));
  }

  newTree.childNodes.forEach(searchForRefs);
}

function componentDidMount(newTree) {
  if (InstanceCache.has(newTree)) {
    InstanceCache.get(newTree).componentDidMount();
  }

  var instance = InstanceCache.get(newTree);

  searchForRefs(newTree);

  if (!instance) {
    return;
  }

  var ref$1 = instance.props;
  var ref = ref$1.ref;

  triggerRef(ref, instance);
}

function componentDidUnmount(oldTree) {
  if (InstanceCache.has(oldTree)) {
    InstanceCache.get(oldTree).componentDidUnmount();
  }

  var instance = InstanceCache.get(oldTree);

  searchForRefs(oldTree);

  if (!instance) {
    return;
  }

  var ref$1 = instance.props;
  var ref = ref$1.ref;

  triggerRef(ref, null);
}

function reactLikeComponentTask(transaction) {
  return transaction.onceEnded(function () {
    if (transaction.aborted) {
      return;
    }

    var patches = transaction.patches;

    if (patches.TREE_OPS && patches.TREE_OPS.length) {
      patches.TREE_OPS.forEach(function (ref) {
        var INSERT_BEFORE = ref.INSERT_BEFORE;
        var REPLACE_CHILD = ref.REPLACE_CHILD;
        var REMOVE_CHILD = ref.REMOVE_CHILD;

        if (INSERT_BEFORE) {
          for (var i = 0; i < INSERT_BEFORE.length; i += 3) {
            var newTree = INSERT_BEFORE[i + 1];
            componentDidMount(newTree);
          }
        }

        if (REPLACE_CHILD) {
          for (var i$1 = 0; i$1 < REPLACE_CHILD.length; i$1 += 2) {
            var newTree$1 = REPLACE_CHILD[i$1];
            componentDidMount(newTree$1);
          }
        }

        if (REMOVE_CHILD) {
          for (var i$2 = 0; i$2 < REMOVE_CHILD.length; i$2 += 1) {
            var oldTree = REMOVE_CHILD[i$2];
            componentDidUnmount(oldTree);
          }
        }
      });
    }
  });
}

reactLikeComponentTask.syncTreeHook = function (oldTree, newTree) {
  var oldChildNodes = oldTree && oldTree.childNodes;

  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called is
  // `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (var i = 0; i < newTree.childNodes.length; i++) {
    var newChild = newTree.childNodes[i];

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      var newCtor = newChild.rawNodeName;
      var oldChild = oldChildNodes && oldChildNodes[i];
      var oldInstanceCache = InstanceCache.get(oldChild);
      var children = newChild.childNodes;
      var props = assign$3({}, newChild.attributes, { children: children });
      var canNew = newCtor.prototype;

      // If the component has already been initialized, we can reuse it.
      var oldInstance = oldChild && oldInstanceCache instanceof newCtor && oldInstanceCache;
      var newInstance = !oldInstance && canNew && new newCtor(props);
      var instance = oldInstance || newInstance;

      var renderTree = null;

      if (oldInstance) {
        oldInstance.componentWillReceiveProps(props);

        if (oldInstance.shouldComponentUpdate()) {
          renderTree = oldInstance.render(props, oldInstance.state);
        }
      } else if (instance && instance.render) {
        renderTree = createTree(instance.render(props, instance.state));
      } else {
        renderTree = createTree(newCtor(props));
      }

      // Nothing was rendered so continue.
      if (!renderTree) {
        continue;
      }

      // Replace the rendered value into the new tree, if rendering a fragment
      // this will inject the contents into the parent.
      if (renderTree.nodeType === 11) {
        newTree.childNodes = [].concat( renderTree.childNodes );

        if (instance) {
          ComponentTreeCache.set(instance, oldTree);
          InstanceCache.set(oldTree, instance);
        }
      }
      // If the rendered value is a single element use it as the root for
      // diffing.
      else {
          newTree.childNodes[i] = renderTree;

          if (instance) {
            ComponentTreeCache.set(instance, renderTree);
            InstanceCache.set(renderTree, instance);
          }
        }
    }
  }

  return newTree;
};

var lifecycleHooks = {
  shouldComponentUpdate: function shouldComponentUpdate() {
    return true;
  },
  componentWillReceiveProps: function componentWillReceiveProps() {},
  componentWillMount: function componentWillMount() {},
  componentDidMount: function componentDidMount() {},
  componentDidUpdate: function componentDidUpdate() {},
  componentWillUnmount: function componentWillUnmount() {},
  componentDidUnmount: function componentDidUnmount() {}
};

var $$render = Symbol('diff.render');

var Debounce = new WeakMap();
var assign$5 = Object.assign;

function setState(newState) {
  var this$1 = this;

  this.state = assign$5({}, this.state, newState);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[$$render]();

    Debounce.set(this, setTimeout(function () {
      Debounce.delete(this$1);

      if (this$1.shouldComponentUpdate()) {
        this$1[$$render]();
      }
    }));
  }
}

function forceUpdate() {
  this[$$render]();
}

var assign$4 = Object.assign;

function upgradeClass(Constructor) {
  assign$4(Constructor.prototype, lifecycleHooks, { forceUpdate: forceUpdate, setState: setState });
  return Constructor;
}

var NodeCache$1 = Internals.NodeCache;
var keys$1 = Object.keys;
var assign$2 = Object.assign;

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
var subscribeMiddleware = function () { return use(reactLikeComponentTask); };
var unsubscribeMiddleware = subscribeMiddleware();

var Component = upgradeClass((function () {
  function Component(initialProps) {
    var props = this.props = assign$2({}, initialProps);
    var state = this.state = {};
    var context = this.context = {};

    var ref = this.constructor;
  var defaultProps = ref.defaultProps; if ( defaultProps === void 0 ) defaultProps = {};
  var propTypes = ref.propTypes; if ( propTypes === void 0 ) propTypes = {};
  var childContextTypes = ref.childContextTypes; if ( childContextTypes === void 0 ) childContextTypes = {};
  var contextTypes = ref.contextTypes; if ( contextTypes === void 0 ) contextTypes = {};
  var name = ref.name;

    keys$1(defaultProps).forEach(function (prop) {
      if (prop in props && props[prop] !== undefined) {
        return;
      }

      props[prop] = defaultProps[prop];
    });

    

    //keys(childContextTypes).forEach(prop => {
    //  if ("production" !== 'production') {
    //    const err = childContextTypes[prop](this.context, prop, name, 'context');
    //    if (err) { throw err; }
    //  }

    //  //this.context[prop] = child
    //});

    //keys(contextTypes).forEach(prop => {
    //  if ("production" !== 'production') {
    //    const err = childContextTypes[prop](this.context, prop, name, 'context');
    //    if (err) { throw err; }
    //  }

    //  this.context[prop] = child
    //});
  }

  Component.subscribeMiddleware = function subscribeMiddleware$1 () {
    return subscribeMiddleware();
  };

  Component.unsubscribeMiddleware = function unsubscribeMiddleware$1 () {
    unsubscribeMiddleware();
    return subscribeMiddleware;
  };

  Component.prototype[$$render] = function () {
    var this$1 = this;

    var vTree = ComponentTreeCache.get(this);
    var domNode = NodeCache$1.get(vTree);
    var renderTree = this.render();

    outerHTML(domNode, renderTree).then(function () {
      this$1.componentDidUpdate();
    });
  };

  return Component;
}()));

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var _Symbol = root$1.Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */
var root$3;

if (typeof self !== 'undefined') {
  root$3 = self;
} else if (typeof window !== 'undefined') {
  root$3 = window;
} else if (typeof global !== 'undefined') {
  root$3 = global;
} else if (typeof module !== 'undefined') {
  root$3 = module;
} else {
  root$3 = Function('return this')();
}

var result = symbolObservablePonyfill(root$3);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if ((typeof observer === 'undefined' ? 'undefined' : _typeof(observer)) !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  var arguments$1 = arguments;

  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments$1[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}

var _extends$1 = Object.assign || function (target) {
  var arguments$1 = arguments;

  for (var i = 1; i < arguments.length; i++) {
    var source = arguments$1[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  var arguments$1 = arguments;

  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments$1[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(undefined, chain)(store.dispatch);

      return _extends$1({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if ("production" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

var ADD_TODO = 'ADD_TODO';
var REMOVE_TODO = 'REMOVE_TODO';
var TOGGLE_COMPLETION = 'TOGGLE_COMPLETION';
var START_EDITING = 'START_EDITING';
var STOP_EDITING = 'STOP_EDITING';
var CLEAR_COMPLETED = 'CLEAR_COMPLETED';
var TOGGLE_ALL = 'TOGGLE_ALL';

function addTodo(title) {
	return {
		type: ADD_TODO,
		title: title
	};
}

function removeTodo(key) {
	return {
		type: REMOVE_TODO,
		key: key
	};
}

function toggleCompletion(key, completed) {
	return {
		type: TOGGLE_COMPLETION,
		key: key,
		completed: completed
	};
}

function startEditing(key) {
	return {
		type: START_EDITING,
		key: key
	};
}

function stopEditing(key, title) {
	return {
		type: STOP_EDITING,
		key: key,
		title: title
	};
}

function clearCompleted() {
	return {
		type: CLEAR_COMPLETED
	};
}

function toggleAll(completed) {
	return {
		type: TOGGLE_ALL,
		completed: completed
	};
}

var assign$7 = Object.assign;

var uuidv4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

var uuid = function uuid() {
	return uuidv4.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0;
		return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	});
};

var initialState = {
	todos: JSON.parse(localStorage['diffhtml-todos'] || '[]'),

	getByStatus: function getByStatus(type) {
		return this.todos.filter(function (todo) {
			switch (type) {
				case 'active':
					return !todo.completed;
				case 'completed':
					return todo.completed;
			}

			return true;
		});
	}
};

function todoApp() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case ADD_TODO:
			{
				if (!action.title) {
					return state;
				}

				return assign$7({}, state, {
					todos: state.todos.concat({
						completed: false,
						editing: false,

						title: action.title.trim(),
						key: uuid()
					})
				});
			}

		case REMOVE_TODO:
			{
				return assign$7({}, state, {
					todos: state.todos.filter(function (todo) {
						return todo.key !== action.key;
					})
				});
			}

		case TOGGLE_COMPLETION:
			{
				var index = state.todos.findIndex(function (todo) {
					return todo.key === action.key;
				});
				var todo = state.todos[index];

				state.todos[index] = assign$7({}, todo, {
					completed: action.completed
				});

				return assign$7({}, state, {
					todos: [].concat(toConsumableArray(state.todos))
				});
			}

		case START_EDITING:
			{
				var _index = state.todos.findIndex(function (todo) {
					return todo.key === action.key;
				});
				var _todo = state.todos[_index];

				state.todos[_index] = assign$7({}, _todo, {
					editing: true
				});

				return assign$7({}, state, {
					todos: [].concat(toConsumableArray(state.todos))
				});
			}

		case STOP_EDITING:
			{
				var _index2 = state.todos.findIndex(function (todo) {
					return todo.key === action.key;
				});
				var _todo2 = state.todos[_index2];

				state.todos[_index2] = assign$7({}, _todo2, {
					title: action.title,
					editing: false
				});

				return assign$7({}, state, {
					todos: [].concat(toConsumableArray(state.todos))
				});
			}

		case CLEAR_COMPLETED:
			{
				return assign$7({}, state, {
					todos: state.todos.filter(function (todo) {
						return todo.completed === false;
					})
				});
			}

		case TOGGLE_ALL:
			{
				return assign$7({}, state, {
					todos: state.todos.map(function (todo) {
						return assign$7({}, todo, {
							completed: action.completed
						});
					})
				});
			}

		default:
			{
				return state;
			}
	}
}

var SET_HASH_STATE = 'SET_HASH_STATE';

function setHashState$1(hash) {
	var path = hash.slice(1) || '/';

	return {
		type: SET_HASH_STATE,
		path: path
	};
}

var assign$8 = Object.assign;

var initialState$1 = { path: location.hash.slice(1) || '/' };

function url() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState$1;
	var action = arguments[1];

	switch (action.type) {
		case SET_HASH_STATE:
			{
				return assign$8({}, state, { path: action.path });
			}

		default:
			{
				return state;
			}
	}
}

// Makes a reusable function to create a store. Currently not exported, but
// could be in the future for testing purposes.
var createStoreWithMiddleware = compose(
// Adds in store middleware, such as async thunk and logging.
applyMiddleware(),

// Hook devtools into our store.
window.devToolsExtension ? window.devToolsExtension() : function (f) {
	return f;
})(createStore);

// Compose the root reducer from modular reducers.
var store = createStoreWithMiddleware(combineReducers({
	// Encapsulates all TodoApp state.
	todoApp: todoApp,

	// Manage the URL state.
	url: url,

	// Store the last action taken.
	lastAction: function lastAction(state, action) {
		return action;
	}
}), {});

var stopPropagation = function stopPropagation(ev) {
	return ev.stopPropagation();
};

function renderTodoList(props) {
	var _vtree = createTree('#text', null, "\n\t\t\t"),
	    _vtree2 = createTree('#text', null, "\n\t\t\t\t"),
	    _vtree3 = createTree('#text', null, "\n\t\t\t\t"),
	    _vtree4 = createTree('#text', null, "\n\t\t\t\t"),
	    _vtree5 = createTree('#text', null, "\n\t\t\t"),
	    _vtree6 = createTree('#text', null, "\n\n\t\t\t"),
	    _vtree7 = createTree('#text', null, "\n\t\t\t\t"),
	    _vtree8 = createTree('#text', null, "\n\t\t\t"),
	    _vtree9 = createTree('#text', null, "\n\t\t");

	return props.todos.map(function (todo) {
		return createTree("li", {
			"key": todo.key,
			"class": props.getTodoClassNames(todo)
		}, [_vtree, createTree("div", {
			"class": "view"
		}, [_vtree2, createTree("input", defineProperty({
			"onclick": stopPropagation,
			"class": "toggle",
			"type": "checkbox"
		}, todo.completed && 'checked', todo.completed && 'checked'), []), _vtree3, createTree("label", {}, [todo.title]), _vtree4, createTree("button", {
			"class": "destroy"
		}, []), _vtree5]), _vtree6, createTree("form", {
			"class": "edit-todo"
		}, [_vtree7, createTree("input", {
			"onblur": props.stopEditing,
			"value": todo.title,
			"class": "edit"
		}, []), _vtree8]), _vtree9]);
	});
}

var TodoApp = function (_Component) {
	var _vtree = createTree('#text', null, "\n\n\t\t\t\t"),
	    _vtree2 = createTree('#text', null, "\n\t\t\t\t\t"),
	    _vtree3 = createTree('#text', null, "todos"),
	    _vtree4 = createTree('#text', null, "\n\n\t\t\t\t\t"),
	    _vtree5 = createTree('#text', null, "\n\t\t\t\t\t\t"),
	    _vtree6 = createTree('#text', null, "\n\t\t\t\t\t"),
	    _vtree7 = createTree('#text', null, "\n\t\t\t\t"),
	    _vtree8 = createTree('#text', null, "\n\n\t\t\t"),
	    _vtree9 = createTree('#text', null, "\n\t\t\t\t"),
	    _vtree10 = createTree('#text', null, "Double-click to edit a todo"),
	    _vtree11 = createTree('#text', null, "\n\n\t\t\t\t"),
	    _vtree12 = createTree('#text', null, "\n\t\t\t\t\tCreated by "),
	    _vtree13 = createTree('#text', null, "Tim Branyen"),
	    _vtree14 = createTree('#text', null, "\n\t\t\t\t\tusing "),
	    _vtree15 = createTree('#text', null, "diffHTML 1.0"),
	    _vtree16 = createTree('#text', null, "\n\t\t\t\t"),
	    _vtree17 = createTree('#text', null, "\n\n\t\t\t\t"),
	    _vtree18 = createTree('#text', null, "Part of "),
	    _vtree19 = createTree('#text', null, "TodoMVC"),
	    _vtree20 = createTree('#text', null, "\n\t\t\t"),
	    _vtree21 = createTree('#text', null, "\n            "),
	    _vtree22 = createTree('#text', null, "\n            "),
	    _vtree23 = createTree('#text', null, "Mark all as complete"),
	    _vtree24 = createTree('#text', null, "\n\n\t\t\t\t\t\t"),
	    _vtree25 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree26 = createTree('#text', null, "\n\t\t\t\t\t\t}"),
	    _vtree27 = createTree('#text', null, "\n\t\t\t\t\t"),
	    _vtree28 = createTree('#text', null, "\n\n\t\t\t\t\t"),
	    _vtree29 = createTree('#text', null, "\n\t\t\t\t\t\t"),
	    _vtree30 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree31 = createTree('#text', null, "\n\n\t\t\t\t\t\t"),
	    _vtree32 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree33 = createTree('#text', null, "\n\t\t\t\t\t\t\t\t"),
	    _vtree34 = createTree('#text', null, "All"),
	    _vtree35 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree36 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree37 = createTree('#text', null, "\n\t\t\t\t\t\t\t\t"),
	    _vtree38 = createTree('#text', null, "Active"),
	    _vtree39 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree40 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree41 = createTree('#text', null, "\n\t\t\t\t\t\t\t\t"),
	    _vtree42 = createTree('#text', null, "Completed"),
	    _vtree43 = createTree('#text', null, "\n\t\t\t\t\t\t\t"),
	    _vtree44 = createTree('#text', null, "\n\t\t\t\t\t\t"),
	    _vtree45 = createTree('#text', null, "Clear completed");

	inherits(TodoApp, _Component);
	createClass(TodoApp, [{
		key: 'render',
		value: function render() {
			var state = store.getState();
			var todoApp = state[this.props.reducer];
			var status = state.url.path.slice(1);
			var allTodos = todoApp.todos;
			var todos = todoApp.getByStatus(status);
			var activeTodos = todoApp.getByStatus('active');
			var completedTodos = todoApp.getByStatus('completed');

			localStorage['diffhtml-todos'] = JSON.stringify(allTodos);

			return [createTree("section", {
				"class": "todoapp",
				"onsubmit": this.onSubmitHandler,
				"onclick": this.onClickHandler,
				"onkeydown": this.handleKeyDown,
				"ondblclick": this.startEditing,
				"onchange": this.toggleCompletion
			}, [_vtree, createTree("header", {
				"class": "header"
			}, [_vtree2, createTree("h1", {}, [_vtree3]), _vtree4, createTree("form", {
				"class": "add-todo"
			}, [_vtree5, createTree("input", {
				"class": "new-todo",
				"placeholder": "What needs to be done?",
				"autofocus": ""
			}, []), _vtree6]), _vtree7]), allTodos.length && [createTree("section", {
				"class": "main"
			}, [_vtree21, createTree("input", defineProperty({
				"class": "toggle-all",
				"id": "toggle-all",
				"type": "checkbox"
			}, this.setCheckedState(), this.setCheckedState()), []), _vtree22, createTree("label", {
				"for": "toggle-all"
			}, [_vtree23]), _vtree24, createTree("ul", {
				"class": "todo-list"
			}, [_vtree25, createTree(renderTodoList, {
				"stopEditing": this.stopEditing,
				"getTodoClassNames": this.getTodoClassNames,
				"todos": todos
			}, []), _vtree26]), _vtree27]), _vtree28, createTree("footer", {
				"class": "footer"
			}, [_vtree29, createTree("span", {
				"class": "todo-count"
			}, [_vtree30, createTree("strong", {}, [String(activeTodos.length)]), createTree('#document-fragment', null, [activeTodos.length == 1 ? ' item' : ' items', createTree('#text', ' left\n\t\t\t\t\t\t')])]), _vtree31, createTree("ul", {
				"class": "filters"
			}, [_vtree32, createTree("li", {}, [_vtree33, createTree("a", {
				"href": "#/",
				"class": this.getNavClass('/')
			}, [_vtree34]), _vtree35]), _vtree36, createTree("li", {}, [_vtree37, createTree("a", {
				"href": "#/active",
				"class": this.getNavClass('/active')
			}, [_vtree38]), _vtree39]), _vtree40, createTree("li", {}, [_vtree41, createTree("a", {
				"href": "#/completed",
				"class": this.getNavClass('/completed')
			}, [_vtree42]), _vtree43]), _vtree44]), completedTodos.length && createTree("button", {
				"class": "clear-completed",
				"onclick": this.clearCompleted
			}, [_vtree45])])]]), _vtree8, createTree("footer", {
				"class": "info"
			}, [_vtree9, createTree("p", {}, [_vtree10]), _vtree11, createTree("p", {}, [_vtree12, createTree("a", {
				"href": "http://github.com/tbranyen"
			}, [_vtree13]), _vtree14, createTree("a", {
				"href": "http://diffhtml.org"
			}, [_vtree15]), _vtree16]), _vtree17, createTree("p", {}, [_vtree18, createTree("a", {
				"href": "http://todomvc.com"
			}, [_vtree19])]), _vtree20])];
		}
	}]);

	function TodoApp(props) {
		classCallCheck(this, TodoApp);

		var _this = possibleConstructorReturn(this, (TodoApp.__proto__ || Object.getPrototypeOf(TodoApp)).call(this, props));

		_this.addTodo = function (ev) {
			ev.preventDefault();

			var newTodo = ev.target.parentNode.querySelector('.new-todo');
			store.dispatch(addTodo(newTodo.value));
			newTodo.value = '';
		};

		_this.removeTodo = function (ev) {
			if (!ev.target.matches('.destroy')) {
				return;
			}

			var li = ev.target.parentNode.parentNode;

			store.dispatch(removeTodo(li.key));
		};

		_this.toggleCompletion = function (ev) {
			if (!ev.target.matches('.toggle')) {
				return;
			}

			var li = ev.target.parentNode.parentNode;

			store.dispatch(toggleCompletion(li.key, ev.target.checked));
		};

		_this.startEditing = function (ev) {
			if (!ev.target.matches('label')) {
				return;
			}

			var li = ev.target.parentNode.parentNode;

			store.dispatch(startEditing(li.key));

			li.querySelector('form input').focus();
		};

		_this.stopEditing = function (ev) {
			ev.preventDefault();

			var parentNode = ev.target.parentNode;
			var nodeName = parentNode.nodeName.toLowerCase();
			var li = nodeName === 'li' ? parentNode : parentNode.parentNode;
			var editTodo = li.querySelector('.edit');
			var text = editTodo.value.trim();

			if (text) {
				store.dispatch(stopEditing(li.key, text));
			} else {
				store.dispatch(removeTodo(li.key));
			}
		};

		_this.clearCompleted = function (ev) {
			if (!ev.target.matches('.clear-completed')) {
				return;
			}

			store.dispatch(clearCompleted());
		};

		_this.toggleAll = function (ev) {
			if (!ev.target.matches('.toggle-all')) {
				return;
			}

			store.dispatch(toggleAll(ev.target.checked));
		};

		_this.handleKeyDown = function (ev) {
			if (!ev.target.matches('.edit, .new-todo')) {
				return;
			}

			switch (ev.keyCode) {
				case 27:
					{
						var todoApp = store.getState()[_this.props.reducer];
						var li = ev.target.parentNode.parentNode;

						ev.target.value = todoApp.todos.find(function (todo) {
							return todo.key === li.key;
						}).title;

						_this.stopEditing(ev);
						break;
					}

				case 13:
					{
						// Mock the submit handler.
						_this.onSubmitHandler(Object.assign({}, ev, {
							preventDefault: function preventDefault() {
								return ev.preventDefault();
							},
							target: ev.target.parentNode
						}));

						break;
					}
			}
		};

		_this.onSubmitHandler = function (ev) {
			ev.preventDefault();

			if (ev.target.matches('.add-todo')) {
				_this.addTodo(ev);
			} else if (ev.target.matches('.edit-todo')) {
				_this.stopEditing(ev);
			}
		};

		_this.onClickHandler = function (ev) {
			if (ev.target.matches('.destroy')) {
				_this.removeTodo(ev);
			} else if (ev.target.matches('.toggle-all')) {
				_this.toggleAll(ev);
			} else if (ev.target.matches('.clear-completed')) {
				_this.clearCompleted(ev);
			}
		};

		_this.getTodoClassNames = function (todo) {
			return [todo.completed ? 'completed' : '', todo.editing ? 'editing' : ''].filter(Boolean).join(' ');
		};

		_this.setCheckedState = function () {
			var todoApp = store.getState()[_this.props.reducer];
			var notChecked = todoApp.todos.filter(function (todo) {
				return !todo.completed;
			}).length;

			return notChecked ? '' : 'checked';
		};

		_this.getNavClass = function (name) {
			var state = store.getState();
			var path = state.url.path;

			return path === name ? 'selected' : undefined;
		};

		_this.unsubscribeStore = store.subscribe(function () {
			return _this.forceUpdate();
		});
		return _this;
	}

	return TodoApp;
}(Component);

var setHashState$$1 = function setHashState$$1(hash) {
  return store.dispatch(setHashState$1(hash));
};

// Link the Component to the DOM.
var mount = document.querySelector('todo-app');
innerHTML(mount, createTree(TodoApp, {
  "reducer": "todoApp"
}, []));

// Set URL state when hash changes.
window.onhashchange = function (e) {
  return setHashState$$1(location.hash);
};

})));
