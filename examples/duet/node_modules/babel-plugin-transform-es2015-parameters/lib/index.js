/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = function () {
  return {
    visitor: /*istanbul ignore next*/_babelTraverse.visitors.merge([{ /*istanbul ignore next*/
      ArrowFunctionExpression: function ArrowFunctionExpression(path) {
        // default/rest visitors require access to `arguments`
        var params = path.get("params");
        for ( /*istanbul ignore next*/var _iterator = params, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

          var param = _ref;

          if (param.isRestElement() || param.isAssignmentPattern()) {
            path.arrowFunctionToShadowed();
            break;
          }
        }
      }
    }, destructuring.visitor, rest.visitor, def.visitor])
  };
};

var /*istanbul ignore next*/_babelTraverse = require("babel-traverse");

var /*istanbul ignore next*/_destructuring = require("./destructuring");

/*istanbul ignore next*/
var destructuring = _interopRequireWildcard(_destructuring);

var /*istanbul ignore next*/_default = require("./default");

/*istanbul ignore next*/
var def = _interopRequireWildcard(_default);

var /*istanbul ignore next*/_rest = require("./rest");

/*istanbul ignore next*/
var rest = _interopRequireWildcard(_rest);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];