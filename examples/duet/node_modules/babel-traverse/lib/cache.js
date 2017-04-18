/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.scope = exports.path = undefined;

var _weakMap = require("babel-runtime/core-js/weak-map");

var _weakMap2 = _interopRequireDefault(_weakMap);

exports.clear = clear;
/*istanbul ignore next*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = /*istanbul ignore next*/exports.path = new /*istanbul ignore next*/_weakMap2.default();
var scope = /*istanbul ignore next*/exports.scope = new /*istanbul ignore next*/_weakMap2.default();

function clear() {
  /*istanbul ignore next*/exports.path = path = new /*istanbul ignore next*/_weakMap2.default();
  /*istanbul ignore next*/exports.scope = scope = new /*istanbul ignore next*/_weakMap2.default();
}