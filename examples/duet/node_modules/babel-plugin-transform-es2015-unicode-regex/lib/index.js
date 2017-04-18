/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function () {
  return {
    visitor: { /*istanbul ignore next*/
      RegExpLiteral: function RegExpLiteral(_ref) {
        /*istanbul ignore next*/var node = _ref.node;

        if (!regex.is(node, "u")) return;
        node.pattern = /*istanbul ignore next*/(0, _regexpuCore2.default)(node.pattern, node.flags);
        regex.pullFlag(node, "u");
      }
    }
  };
};

var /*istanbul ignore next*/_regexpuCore = require("regexpu-core");

/*istanbul ignore next*/
var _regexpuCore2 = _interopRequireDefault(_regexpuCore);

var /*istanbul ignore next*/_babelHelperRegex = require("babel-helper-regex");

/*istanbul ignore next*/
var regex = _interopRequireWildcard(_babelHelperRegex);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];