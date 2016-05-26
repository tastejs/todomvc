/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var /*istanbul ignore next*/_virtualTypes = require("./lib/virtual-types");

/*istanbul ignore next*/
var virtualTypes = _interopRequireWildcard(_virtualTypes);

var /*istanbul ignore next*/_debug2 = require("debug");

/*istanbul ignore next*/
var _debug3 = _interopRequireDefault(_debug2);

var /*istanbul ignore next*/_invariant = require("invariant");

/*istanbul ignore next*/
var _invariant2 = _interopRequireDefault(_invariant);

var /*istanbul ignore next*/_index = require("../index");

/*istanbul ignore next*/
var _index2 = _interopRequireDefault(_index);

var /*istanbul ignore next*/_assign = require("lodash/assign");

/*istanbul ignore next*/
var _assign2 = _interopRequireDefault(_assign);

var /*istanbul ignore next*/_scope = require("../scope");

/*istanbul ignore next*/
var _scope2 = _interopRequireDefault(_scope);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

var /*istanbul ignore next*/_cache = require("../cache");

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

var _debug = /*istanbul ignore next*/(0, _debug3.default)("babel");

/*istanbul ignore next*/
var NodePath = function () {
  function /*istanbul ignore next*/NodePath(hub, parent) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, NodePath);

    this.parent = parent;
    this.hub = hub;
    this.contexts = [];
    this.data = {};
    this.shouldSkip = false;
    this.shouldStop = false;
    this.removed = false;
    this.state = null;
    this.opts = null;
    this.skipKeys = null;
    this.parentPath = null;
    this.context = null;
    this.container = null;
    this.listKey = null;
    this.inList = false;
    this.parentKey = null;
    this.key = null;
    this.node = null;
    this.scope = null;
    this.type = null;
    this.typeAnnotation = null;
  }

  NodePath.get = function get(_ref) {
    /*istanbul ignore next*/var hub = _ref.hub;
    /*istanbul ignore next*/var parentPath = _ref.parentPath;
    /*istanbul ignore next*/var parent = _ref.parent;
    /*istanbul ignore next*/var container = _ref.container;
    /*istanbul ignore next*/var listKey = _ref.listKey;
    /*istanbul ignore next*/var key = _ref.key;

    if (!hub && parentPath) {
      hub = parentPath.hub;
    }

    /*istanbul ignore next*/(0, _invariant2.default)(parent, "To get a node path the parent needs to exist");

    var targetNode = container[key];

    var paths = /*istanbul ignore next*/_cache.path.get(parent) || [];
    if (! /*istanbul ignore next*/_cache.path.has(parent)) {
      /*istanbul ignore next*/_cache.path.set(parent, paths);
    }

    var path = /*istanbul ignore next*/void 0;

    for (var i = 0; i < paths.length; i++) {
      var pathCheck = paths[i];
      if (pathCheck.node === targetNode) {
        path = pathCheck;
        break;
      }
    }

    if (!path) {
      path = new NodePath(hub, parent);
      paths.push(path);
    }

    path.setup(parentPath, container, listKey, key);

    return path;
  };

  NodePath.prototype.getScope = function getScope(scope) {
    var ourScope = scope;

    // we're entering a new scope so let's construct it!
    if (this.isScope()) {
      ourScope = new /*istanbul ignore next*/_scope2.default(this, scope);
    }

    return ourScope;
  };

  NodePath.prototype.setData = function setData(key, val) {
    return this.data[key] = val;
  };

  NodePath.prototype.getData = function getData(key, def) {
    var val = this.data[key];
    if (!val && def) val = this.data[key] = def;
    return val;
  };

  NodePath.prototype.buildCodeFrameError = function buildCodeFrameError(msg) {
    /*istanbul ignore next*/var Error = arguments.length <= 1 || arguments[1] === undefined ? SyntaxError : arguments[1];

    return this.hub.file.buildCodeFrameError(this.node, msg, Error);
  };

  NodePath.prototype.traverse = function traverse(visitor, state) {
    /*istanbul ignore next*/(0, _index2.default)(this.node, visitor, this.scope, state, this);
  };

  NodePath.prototype.mark = function mark(type, message) {
    this.hub.file.metadata.marked.push({
      type: type,
      message: message,
      loc: this.node.loc
    });
  };

  NodePath.prototype.set = function set(key, node) {
    t.validate(this.node, key, node);
    this.node[key] = node;
  };

  NodePath.prototype.getPathLocation = function getPathLocation() {
    var parts = [];
    var path = this;
    do {
      var key = path.key;
      if (path.inList) key = /*istanbul ignore next*/path.listKey + "[" + key + "]";
      parts.unshift(key);
    } while (path = path.parentPath);
    return parts.join(".");
  };

  NodePath.prototype.debug = function debug(buildMessage) {
    if (!_debug.enabled) return;
    _debug( /*istanbul ignore next*/this.getPathLocation() + " " + this.type + ": " + buildMessage());
  };

  return NodePath;
}();

/*istanbul ignore next*/exports.default = NodePath;


/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./ancestry"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./inference"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./replacement"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./evaluation"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./conversion"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./introspection"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./context"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./removal"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./modification"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./family"));
/*istanbul ignore next*/(0, _assign2.default)(NodePath.prototype, require("./comments"));

/*istanbul ignore next*/
var _loop2 = function _loop2() {
  if (_isArray) {
    if (_i >= _iterator.length) return "break";
    _ref2 = _iterator[_i++];
  } else {
    _i = _iterator.next();
    if (_i.done) return "break";
    _ref2 = _i.value;
  }

  var type = _ref2;

  var typeKey = /*istanbul ignore next*/"is" + type;
  NodePath.prototype[typeKey] = function (opts) {
    return t[typeKey](this.node, opts);
  };

  NodePath.prototype[/*istanbul ignore next*/"assert" + type] = function (opts) {
    if (!this[typeKey](opts)) {
      throw new TypeError( /*istanbul ignore next*/"Expected node path of type " + type);
    }
  };
};

for ( /*istanbul ignore next*/var _iterator = t.TYPES, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
  /*istanbul ignore next*/
  var _ref2;

  var _ret2 = _loop2();

  if (_ret2 === "break") break;
}

/*istanbul ignore next*/
var _loop = function _loop(type) {
  if (type[0] === "_") return (/*istanbul ignore next*/"continue"
    );
  if (t.TYPES.indexOf(type) < 0) t.TYPES.push(type);

  var virtualType = virtualTypes[type];

  NodePath.prototype[/*istanbul ignore next*/"is" + type] = function (opts) {
    return virtualType.checkPath(this, opts);
  };
};

for (var type in virtualTypes) {
  /*istanbul ignore next*/
  var _ret = _loop(type);

  /*istanbul ignore next*/if (_ret === "continue") continue;
}
/*istanbul ignore next*/module.exports = exports["default"];