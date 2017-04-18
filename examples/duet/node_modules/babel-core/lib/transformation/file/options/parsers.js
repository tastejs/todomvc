/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.filename = undefined;
exports.boolean = boolean;
/*istanbul ignore next*/exports.booleanString = booleanString;
/*istanbul ignore next*/exports.list = list;

var /*istanbul ignore next*/_slash = require("slash");

/*istanbul ignore next*/
var _slash2 = _interopRequireDefault(_slash);

var /*istanbul ignore next*/_util = require("../../../util");

/*istanbul ignore next*/
var util = _interopRequireWildcard(_util);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filename = /*istanbul ignore next*/exports.filename = _slash2.default;

function boolean(val) {
  return !!val;
}

function booleanString(val) {
  return util.booleanify(val);
}

function list(val) {
  return util.list(val);
}