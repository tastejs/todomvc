"use strict";

exports.__esModule = true;

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = explode;
exports.verify = verify;

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

var _lodash = require("lodash.clone");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * explode() will take a visitor object with all of the various shorthands
 * that we support, and validates & normalizes it into a common format, ready
 * to be used in traversal
 *
 * The various shorthands are:
 * * `Identifier() { ... }` -> `Identifier: { enter() { ... } }`
 * * `"Identifier|NumericLiteral": { ... }` -> `Identifier: { ... }, NumericLiteral: { ... }`
 * * Aliases in `babel-types`: e.g. `Property: { ... }` -> `ObjectProperty: { ... }, ClassProperty: { ... }`
 *
 * Other normalizations are:
 * * `enter` and `exit` functions are wrapped in arrays, to ease merging of
 *   visitors
 */
// Copied from babel-traverse, but with virtual types handling removed
// https://github.com/babel/babel/blob/07b3dc18a09f2217b38a3a63c8613add6df1b47d/packages/babel-traverse/src/visitors.js

// import * as messages from 'babel-messages';
function explode(visitor) {
  if (visitor._exploded) return visitor;
  visitor._exploded = true;

  // normalise pipes
  for (var nodeType in visitor) {
    if (shouldIgnoreKey(nodeType)) continue;

    var parts = nodeType.split("|");
    if (parts.length === 1) continue;

    var fns = visitor[nodeType];
    delete visitor[nodeType];

    for (var _iterator = parts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var part = _ref;

      visitor[part] = fns;
    }
  }

  // verify data structure
  verify(visitor);

  // make sure there's no __esModule type since this is because we're using loose mode
  // and it sets __esModule to be enumerable on all modules :(
  delete visitor.__esModule;

  // ensure visitors are objects
  ensureEntranceObjects(visitor);

  // ensure enter/exit callbacks are arrays
  ensureCallbackArrays(visitor);

  // add aliases
  for (var _nodeType in visitor) {
    if (shouldIgnoreKey(_nodeType)) continue;

    var _fns = visitor[_nodeType];

    var aliases = t.FLIPPED_ALIAS_KEYS[_nodeType];

    var deprecratedKey = t.DEPRECATED_KEYS[_nodeType];
    if (deprecratedKey) {
      console.trace("Visitor defined for " + _nodeType + " but it has been renamed to " + deprecratedKey);
      aliases = [deprecratedKey];
    }

    if (!aliases) continue;

    // clear it from the visitor
    delete visitor[_nodeType];

    for (var _iterator2 = aliases, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var alias = _ref2;

      var existing = visitor[alias];
      if (existing) {
        mergePair(existing, _fns);
      } else {
        visitor[alias] = (0, _lodash2.default)(_fns);
      }
    }
  }

  for (var _nodeType2 in visitor) {
    if (shouldIgnoreKey(_nodeType2)) continue;

    ensureCallbackArrays(visitor[_nodeType2]);
  }

  return visitor;
}

function verify(visitor) {
  if (visitor._verified) return;

  if (typeof visitor === "function") {
    // throw new Error(messages.get("traverseVerifyRootFunction"));
    throw new Error("You passed `traverse()` a function when it expected a visitor object, are you sure you didn't mean `{ enter: Function }`?");
  }

  for (var nodeType in visitor) {
    if (nodeType === "enter" || nodeType === "exit") {
      validateVisitorMethods(nodeType, visitor[nodeType]);
    }

    if (shouldIgnoreKey(nodeType)) continue;

    if (t.TYPES.indexOf(nodeType) < 0) {
      // throw new Error(messages.get("traverseVerifyNodeType", nodeType));
      throw new Error("You gave us a visitor for the node type " + nodeType + " but it's not a valid type");
    }

    var visitors = visitor[nodeType];
    if ((typeof visitors === "undefined" ? "undefined" : (0, _typeof3.default)(visitors)) === "object") {
      for (var visitorKey in visitors) {
        if (visitorKey === "enter" || visitorKey === "exit") {
          // verify that it just contains functions
          validateVisitorMethods(nodeType + "." + visitorKey, visitors[visitorKey]);
        } else {
          // throw new Error(messages.get("traverseVerifyVisitorProperty", nodeType, visitorKey));
          throw new Error("You passed `traverse()` a visitor object with the property " + nodeType + " that has the invalid property " + visitorKey);
        }
      }
    }
  }

  visitor._verified = true;
}

function validateVisitorMethods(path, val) {
  var fns = [].concat(val);
  for (var _iterator3 = fns, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var fn = _ref3;

    if (typeof fn !== "function") {
      throw new TypeError("Non-function found defined in " + path + " with type " + (typeof fn === "undefined" ? "undefined" : (0, _typeof3.default)(fn)));
    }
  }
}

function wrapWithStateOrWrapper(oldVisitor, state, wrapper) {
  var newVisitor = {};

  var _loop = function _loop(key) {
    var fns = oldVisitor[key];

    // not an enter/exit array of callbacks
    if (!Array.isArray(fns)) return "continue";

    fns = fns.map(function (fn) {
      var newFn = fn;

      if (state) {
        newFn = function newFn(path) {
          return fn.call(state, path, state);
        };
      }

      if (wrapper) {
        newFn = wrapper(state.key, key, newFn);
      }

      return newFn;
    });

    newVisitor[key] = fns;
  };

  for (var key in oldVisitor) {
    var _ret = _loop(key);

    if (_ret === "continue") continue;
  }

  return newVisitor;
}

function ensureEntranceObjects(obj) {
  for (var key in obj) {
    if (shouldIgnoreKey(key)) continue;

    var fns = obj[key];
    if (typeof fns === "function") {
      obj[key] = { enter: fns };
    }
  }
}

function ensureCallbackArrays(obj) {
  if (obj.enter && !Array.isArray(obj.enter)) obj.enter = [obj.enter];
  if (obj.exit && !Array.isArray(obj.exit)) obj.exit = [obj.exit];
}

function shouldIgnoreKey(key) {
  // internal/hidden key
  if (key[0] === "_") return true;

  // ignore function keys
  if (key === "enter" || key === "exit" || key === "shouldSkip") return true;

  // ignore other options
  if (key === "blacklist" || key === "noScope" || key === "skipKeys") return true;

  return false;
}

function mergePair(dest, src) {
  for (var key in src) {
    dest[key] = [].concat(dest[key] || [], src[key]);
  }
}