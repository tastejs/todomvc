/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var /*istanbul ignore next*/_babelHelperFunctionName = require("babel-helper-function-name");

/*istanbul ignore next*/
var _babelHelperFunctionName2 = _interopRequireDefault(_babelHelperFunctionName);

var /*istanbul ignore next*/_vanilla = require("./vanilla");

/*istanbul ignore next*/
var _vanilla2 = _interopRequireDefault(_vanilla);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LooseClassTransformer = function (_VanillaTransformer) {
  (0, _inherits3.default)(LooseClassTransformer, _VanillaTransformer);

  function /*istanbul ignore next*/LooseClassTransformer() {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, LooseClassTransformer);

    var _this = (0, _possibleConstructorReturn3.default)(this, /*istanbul ignore next*/_VanillaTransformer.apply( /*istanbul ignore next*/this, arguments));

    /*istanbul ignore next*/_this.isLoose = true;
    /*istanbul ignore next*/return _this;
  }

  LooseClassTransformer.prototype._processMethod = function _processMethod(node, scope) {
    if (!node.decorators) {
      // use assignments instead of define properties for loose classes

      var classRef = this.classRef;
      if (!node.static) classRef = t.memberExpression(classRef, t.identifier("prototype"));
      var methodName = t.memberExpression(classRef, node.key, node.computed || t.isLiteral(node.key));

      var func = t.functionExpression(null, node.params, node.body, node.generator, node.async);
      var key = t.toComputedKey(node, node.key);
      if (t.isStringLiteral(key)) {
        func = /*istanbul ignore next*/(0, _babelHelperFunctionName2.default)({
          node: func,
          id: key,
          scope: scope
        });
      }

      var expr = t.expressionStatement(t.assignmentExpression("=", methodName, func));
      t.inheritsComments(expr, node);
      this.body.push(expr);
      return true;
    }
  };

  return LooseClassTransformer;
}(_vanilla2.default);

/*istanbul ignore next*/exports.default = LooseClassTransformer;
/*istanbul ignore next*/module.exports = exports["default"];