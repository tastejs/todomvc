/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.getStatementParent = getStatementParent;
/*istanbul ignore next*/exports.getOpposite = getOpposite;
/*istanbul ignore next*/exports.getCompletionRecords = getCompletionRecords;
/*istanbul ignore next*/exports.getSibling = getSibling;
/*istanbul ignore next*/exports.get = get;
/*istanbul ignore next*/exports._getKey = _getKey;
/*istanbul ignore next*/exports._getPattern = _getPattern;
/*istanbul ignore next*/exports.getBindingIdentifiers = getBindingIdentifiers;
/*istanbul ignore next*/exports.getOuterBindingIdentifiers = getOuterBindingIdentifiers;

var /*istanbul ignore next*/_index = require("./index");

/*istanbul ignore next*/
var _index2 = _interopRequireDefault(_index);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStatementParent() {
  var path = this;

  do {
    if (!path.parentPath || Array.isArray(path.container) && path.isStatement()) {
      break;
    } else {
      path = path.parentPath;
    }
  } while (path);

  if (path && (path.isProgram() || path.isFile())) {
    throw new Error("File/Program node, we can't possibly find a statement parent to this");
  }

  return path;
} // This file contains methods responsible for dealing with/retrieving children or siblings.

function getOpposite() {
  if (this.key === "left") {
    return this.getSibling("right");
  } else if (this.key === "right") {
    return this.getSibling("left");
  }
}

function getCompletionRecords() {
  var paths = [];

  var add = function add(path) {
    if (path) paths = paths.concat(path.getCompletionRecords());
  };

  if (this.isIfStatement()) {
    add(this.get("consequent"));
    add(this.get("alternate"));
  } else if (this.isDoExpression() || this.isFor() || this.isWhile()) {
    add(this.get("body"));
  } else if (this.isProgram() || this.isBlockStatement()) {
    add(this.get("body").pop());
  } else if (this.isFunction()) {
    return this.get("body").getCompletionRecords();
  } else if (this.isTryStatement()) {
    add(this.get("block"));
    add(this.get("handler"));
    add(this.get("finalizer"));
  } else {
    paths.push(this);
  }

  return paths;
}

function getSibling(key) {
  return (/*istanbul ignore next*/_index2.default.get({
      parentPath: this.parentPath,
      parent: this.parent,
      container: this.container,
      listKey: this.listKey,
      key: key
    })
  );
}

function get(key, context) {
  if (context === true) context = this.context;
  var parts = key.split(".");
  if (parts.length === 1) {
    // "foo"
    return this._getKey(key, context);
  } else {
    // "foo.bar"
    return this._getPattern(parts, context);
  }
}

function _getKey(key, context) {
  /*istanbul ignore next*/
  var _this = this;

  var node = this.node;
  var container = node[key];

  if (Array.isArray(container)) {
    // requested a container so give them all the paths
    return container.map(function (_, i) {
      return (/*istanbul ignore next*/_index2.default.get({
          listKey: key,
          parentPath: /*istanbul ignore next*/_this,
          parent: node,
          container: container,
          key: i
        }).setContext(context)
      );
    });
  } else {
    return (/*istanbul ignore next*/_index2.default.get({
        parentPath: this,
        parent: node,
        container: node,
        key: key
      }).setContext(context)
    );
  }
}

function _getPattern(parts, context) {
  var path = this;
  for ( /*istanbul ignore next*/var _iterator = parts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

    var part = _ref;

    if (part === ".") {
      path = path.parentPath;
    } else {
      if (Array.isArray(path)) {
        path = path[part];
      } else {
        path = path.get(part, context);
      }
    }
  }
  return path;
}

function getBindingIdentifiers(duplicates) {
  return t.getBindingIdentifiers(this.node, duplicates);
}

function getOuterBindingIdentifiers(duplicates) {
  return t.getOuterBindingIdentifiers(this.node, duplicates);
}