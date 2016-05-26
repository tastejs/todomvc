/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.visitors = exports.Hub = exports.Scope = exports.NodePath = undefined;

var _getOwnPropertySymbols = require("babel-runtime/core-js/object/get-own-property-symbols");

var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _path = require("./path");

Object.defineProperty(exports, "NodePath", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_path).default;
  }
});
/*istanbul ignore next*/
var _scope = require("./scope");

Object.defineProperty(exports, "Scope", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_scope).default;
  }
});
/*istanbul ignore next*/
var _hub = require("./hub");

Object.defineProperty(exports, "Hub", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hub).default;
  }
});
/*istanbul ignore next*/exports.default = traverse;

var /*istanbul ignore next*/_context = require("./context");

/*istanbul ignore next*/
var _context2 = _interopRequireDefault(_context);

var /*istanbul ignore next*/_visitors = require("./visitors");

/*istanbul ignore next*/
var visitors = _interopRequireWildcard(_visitors);

var /*istanbul ignore next*/_babelMessages = require("babel-messages");

/*istanbul ignore next*/
var messages = _interopRequireWildcard(_babelMessages);

var /*istanbul ignore next*/_includes = require("lodash/includes");

/*istanbul ignore next*/
var _includes2 = _interopRequireDefault(_includes);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

var /*istanbul ignore next*/_cache = require("./cache");

/*istanbul ignore next*/
var cache = _interopRequireWildcard(_cache);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.visitors = visitors;
function traverse(parent, opts, scope, state, parentPath) {
  if (!parent) return;
  if (!opts) opts = {};

  if (!opts.noScope && !scope) {
    if (parent.type !== "Program" && parent.type !== "File") {
      throw new Error(messages.get("traverseNeedsParent", parent.type));
    }
  }

  visitors.explode(opts);

  traverse.node(parent, opts, scope, state, parentPath);
}

traverse.visitors = visitors;
traverse.verify = visitors.verify;
traverse.explode = visitors.explode;

traverse.NodePath = require("./path");
traverse.Scope = require("./scope");
traverse.Hub = require("./hub");

traverse.cheap = function (node, enter) {
  if (!node) return;

  var keys = t.VISITOR_KEYS[node.type];
  if (!keys) return;

  enter(node);

  for ( /*istanbul ignore next*/var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
    /*istanbul ignore next*/
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var key = _ref;

    var subNode = node[key];

    if (Array.isArray(subNode)) {
      for ( /*istanbul ignore next*/var _iterator2 = subNode, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
        /*istanbul ignore next*/
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _node = _ref2;

        traverse.cheap(_node, enter);
      }
    } else {
      traverse.cheap(subNode, enter);
    }
  }
};

traverse.node = function (node, opts, scope, state, parentPath, skipKeys) {
  var keys = t.VISITOR_KEYS[node.type];
  if (!keys) return;

  var context = new /*istanbul ignore next*/_context2.default(scope, opts, state, parentPath);
  for ( /*istanbul ignore next*/var _iterator3 = keys, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
    /*istanbul ignore next*/
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var key = _ref3;

    if (skipKeys && skipKeys[key]) continue;
    if (context.visit(node, key)) return;
  }
};

var CLEAR_KEYS = t.COMMENT_KEYS.concat(["tokens", "comments", "start", "end", "loc", "raw", "rawValue"]);

traverse.clearNode = function (node) {
  for ( /*istanbul ignore next*/var _iterator4 = CLEAR_KEYS, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator3.default)(_iterator4);;) {
    /*istanbul ignore next*/
    var _ref4;

    if (_isArray4) {
      if (_i4 >= _iterator4.length) break;
      _ref4 = _iterator4[_i4++];
    } else {
      _i4 = _iterator4.next();
      if (_i4.done) break;
      _ref4 = _i4.value;
    }

    var _key = _ref4;

    if (node[_key] != null) node[_key] = undefined;
  }

  for (var key in node) {
    if (key[0] === "_" && node[key] != null) node[key] = undefined;
  }

  cache.path.delete(node);

  var syms = /*istanbul ignore next*/(0, _getOwnPropertySymbols2.default)(node);
  for ( /*istanbul ignore next*/var _iterator5 = syms, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator3.default)(_iterator5);;) {
    /*istanbul ignore next*/
    var _ref5;

    if (_isArray5) {
      if (_i5 >= _iterator5.length) break;
      _ref5 = _iterator5[_i5++];
    } else {
      _i5 = _iterator5.next();
      if (_i5.done) break;
      _ref5 = _i5.value;
    }

    var sym = _ref5;

    node[sym] = null;
  }
};

traverse.removeProperties = function (tree) {
  traverse.cheap(tree, traverse.clearNode);
  return tree;
};

function hasBlacklistedType(path, state) {
  if (path.node.type === state.type) {
    state.has = true;
    path.stop();
  }
}

traverse.hasType = function (tree, scope, type, blacklistTypes) {
  // the node we're searching in is blacklisted
  if ( /*istanbul ignore next*/(0, _includes2.default)(blacklistTypes, tree.type)) return false;

  // the type we're looking for is the same as the passed node
  if (tree.type === type) return true;

  var state = {
    has: false,
    type: type
  };

  traverse(tree, {
    blacklist: blacklistTypes,
    enter: hasBlacklistedType
  }, scope, state);

  return state.has;
};

traverse.clearCache = function () {
  cache.clear();
};

traverse.copyCache = function (source, destination) {
  if (cache.path.has(source)) {
    cache.path.set(destination, cache.path.get(source));
  }
};