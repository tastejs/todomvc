/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var /*istanbul ignore next*/_store = require("../store");

/*istanbul ignore next*/
var _store2 = _interopRequireDefault(_store);

var /*istanbul ignore next*/_babelTraverse = require("babel-traverse");

/*istanbul ignore next*/
var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var /*istanbul ignore next*/_file5 = require("./file");

/*istanbul ignore next*/
var _file6 = _interopRequireDefault(_file5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PluginPass = function (_Store) {
  (0, _inherits3.default)(PluginPass, _Store);

  function /*istanbul ignore next*/PluginPass(file, plugin) {
    /*istanbul ignore next*/var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, PluginPass);

    var _this = (0, _possibleConstructorReturn3.default)(this, /*istanbul ignore next*/_Store.call( /*istanbul ignore next*/this));

    /*istanbul ignore next*/_this.plugin = plugin;
    /*istanbul ignore next*/_this.file = file;
    /*istanbul ignore next*/_this.opts = options;
    /*istanbul ignore next*/return _this;
  }

  PluginPass.prototype.transform = function transform() {
    var file = this.file;
    file.log.debug( /*istanbul ignore next*/"Start transformer " + this.key);
    /*istanbul ignore next*/(0, _babelTraverse2.default)(file.ast, this.plugin.visitor, file.scope, file);
    file.log.debug( /*istanbul ignore next*/"Finish transformer " + this.key);
  };

  PluginPass.prototype.addHelper = function addHelper() {
    /*istanbul ignore next*/
    var _file;

    return (/*istanbul ignore next*/(_file = this.file).addHelper. /*istanbul ignore next*/apply( /*istanbul ignore next*/_file, /*istanbul ignore next*/arguments)
    );
  };

  PluginPass.prototype.addImport = function addImport() {
    /*istanbul ignore next*/
    var _file2;

    return (/*istanbul ignore next*/(_file2 = this.file).addImport. /*istanbul ignore next*/apply( /*istanbul ignore next*/_file2, /*istanbul ignore next*/arguments)
    );
  };

  PluginPass.prototype.getModuleName = function getModuleName() {
    /*istanbul ignore next*/
    var _file3;

    return (/*istanbul ignore next*/(_file3 = this.file).getModuleName. /*istanbul ignore next*/apply( /*istanbul ignore next*/_file3, /*istanbul ignore next*/arguments)
    );
  };

  PluginPass.prototype.buildCodeFrameError = function buildCodeFrameError() {
    /*istanbul ignore next*/
    var _file4;

    return (/*istanbul ignore next*/(_file4 = this.file).buildCodeFrameError. /*istanbul ignore next*/apply( /*istanbul ignore next*/_file4, /*istanbul ignore next*/arguments)
    );
  };

  return PluginPass;
}(_store2.default);

/*istanbul ignore next*/exports.default = PluginPass;
/*istanbul ignore next*/module.exports = exports["default"];