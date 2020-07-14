"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const opn = require('opn');

const openInBrowser =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (url, browser) {
    try {
      const options = typeof browser === 'string' ? {
        app: browser
      } : undefined;
      yield opn(url, options);
    } catch (err) {
      console.error(`Unexpected error while opening in browser: ${browser}`);
      console.error(err);
    }
  });

  return function openInBrowser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = openInBrowser;