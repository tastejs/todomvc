/*istanbul ignore next*/"use strict";

var /*istanbul ignore next*/_index = require("./index");

/*istanbul ignore next*/
var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore next*/(0, _index2.default)("Noop", {
  visitor: []
});

/*istanbul ignore next*/(0, _index2.default)("ParenthesizedExpression", {
  visitor: ["expression"],
  aliases: ["Expression", "ExpressionWrapper"],
  fields: {
    expression: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});