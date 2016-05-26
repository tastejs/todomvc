/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function () {
  return {
    visitor: { /*istanbul ignore next*/
      ObjectMethod: function ObjectMethod(path) {
        /*istanbul ignore next*/var node = path.node;

        if (node.kind === "method") {
          path.replaceWith(t.objectProperty(node.key, t.functionExpression(null, node.params, node.body, node.generator, node.async), node.computed));
        }
      },
      /*istanbul ignore next*/ObjectProperty: function ObjectProperty(_ref) {
        /*istanbul ignore next*/var node = _ref.node;

        if (node.shorthand) {
          node.shorthand = false;
        }
      }
    }
  };
};

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = exports["default"];