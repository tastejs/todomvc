"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const posthtml = require('posthtml');

const htmlnano = require('htmlnano');

module.exports =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (asset) {
    yield asset.parseIfNeeded();
    let htmlNanoConfig = Object.assign({}, (yield asset.getConfig(['.htmlnanorc', '.htmlnanorc.js'], {
      packageKey: 'htmlnano'
    })), {
      minifyCss: false,
      minifyJs: false
    });
    let res = yield posthtml([htmlnano(htmlNanoConfig)]).process(asset.ast, {
      skipParse: true
    });
    asset.ast = res.tree;
    asset.isAstDirty = true;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();