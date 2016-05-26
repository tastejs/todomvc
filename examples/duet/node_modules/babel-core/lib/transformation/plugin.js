/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var /*istanbul ignore next*/_optionManager = require("./file/options/option-manager");

/*istanbul ignore next*/
var _optionManager2 = _interopRequireDefault(_optionManager);

var /*istanbul ignore next*/_babelMessages = require("babel-messages");

/*istanbul ignore next*/
var messages = _interopRequireWildcard(_babelMessages);

var /*istanbul ignore next*/_store = require("../store");

/*istanbul ignore next*/
var _store2 = _interopRequireDefault(_store);

var /*istanbul ignore next*/_babelTraverse = require("babel-traverse");

/*istanbul ignore next*/
var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var /*istanbul ignore next*/_assign = require("lodash/assign");

/*istanbul ignore next*/
var _assign2 = _interopRequireDefault(_assign);

var /*istanbul ignore next*/_clone = require("lodash/clone");

/*istanbul ignore next*/
var _clone2 = _interopRequireDefault(_clone);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

var GLOBAL_VISITOR_PROPS = ["enter", "exit"];

/*istanbul ignore next*/
var Plugin = function (_Store) {
  (0, _inherits3.default)(Plugin, _Store);

  function /*istanbul ignore next*/Plugin(plugin, key) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Plugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, /*istanbul ignore next*/_Store.call( /*istanbul ignore next*/this));

    /*istanbul ignore next*/_this.initialized = false;
    /*istanbul ignore next*/_this.raw = /*istanbul ignore next*/(0, _assign2.default)({}, plugin);
    /*istanbul ignore next*/_this.key = key;

    /*istanbul ignore next*/_this.manipulateOptions = /*istanbul ignore next*/_this.take("manipulateOptions");
    /*istanbul ignore next*/_this.post = /*istanbul ignore next*/_this.take("post");
    /*istanbul ignore next*/_this.pre = /*istanbul ignore next*/_this.take("pre");
    /*istanbul ignore next*/_this.visitor = /*istanbul ignore next*/_this.normaliseVisitor( /*istanbul ignore next*/(0, _clone2.default)( /*istanbul ignore next*/_this.take("visitor")) || {});
    /*istanbul ignore next*/return _this;
  }

  Plugin.prototype.take = function take(key) {
    var val = this.raw[key];
    delete this.raw[key];
    return val;
  };

  Plugin.prototype.chain = function chain(target, key) {
    if (!target[key]) return this[key];
    if (!this[key]) return target[key];

    var fns = [target[key], this[key]];

    return function () {
      var val = /*istanbul ignore next*/void 0;
      /*istanbul ignore next*/
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      for ( /*istanbul ignore next*/var _iterator = fns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

        var fn = _ref;

        if (fn) {
          var ret = fn.apply(this, args);
          if (ret != null) val = ret;
        }
      }
      return val;
    };
  };

  Plugin.prototype.maybeInherit = function maybeInherit(loc) {
    var inherits = this.take("inherits");
    if (!inherits) return;

    inherits = /*istanbul ignore next*/_optionManager2.default.normalisePlugin(inherits, loc, "inherits");

    this.manipulateOptions = this.chain(inherits, "manipulateOptions");
    this.post = this.chain(inherits, "post");
    this.pre = this.chain(inherits, "pre");
    this.visitor = /*istanbul ignore next*/_babelTraverse2.default.visitors.merge([inherits.visitor, this.visitor]);
  };

  /**
   * We lazy initialise parts of a plugin that rely on contextual information such as
   * position on disk and how it was specified.
   */

  Plugin.prototype.init = function init(loc, i) {
    if (this.initialized) return;
    this.initialized = true;

    this.maybeInherit(loc);

    for (var key in this.raw) {
      throw new Error(messages.get("pluginInvalidProperty", loc, i, key));
    }
  };

  Plugin.prototype.normaliseVisitor = function normaliseVisitor(visitor) {
    for ( /*istanbul ignore next*/var _iterator2 = GLOBAL_VISITOR_PROPS, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
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

      var key = _ref2;

      if (visitor[key]) {
        throw new Error("Plugins aren't allowed to specify catch-all enter/exit handlers. Please target individual nodes.");
      }
    }

    /*istanbul ignore next*/_babelTraverse2.default.explode(visitor);
    return visitor;
  };

  return Plugin;
}(_store2.default);

/*istanbul ignore next*/exports.default = Plugin;
/*istanbul ignore next*/module.exports = exports["default"];