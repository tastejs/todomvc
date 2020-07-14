'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = minifySvg;

var _svgo = require('svgo');

var _svgo2 = _interopRequireDefault(_svgo);

var _posthtmlRender = require('posthtml-render');

var _posthtmlRender2 = _interopRequireDefault(_posthtmlRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Minify SVG with SVGO */
function minifySvg(tree, options) {
    var svgoOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var promises = [];
    var svgo = new _svgo2.default(svgoOptions);

    tree.match({ tag: 'svg' }, function (node) {
        var svgStr = (0, _posthtmlRender2.default)(node);
        var promise = svgo.optimize(svgStr).then(function (result) {
            node.tag = false;
            node.attrs = {};
            node.content = result.data;
        });
        promises.push(promise);

        return node;
    });

    return Promise.all(promises).then(function () {
        return tree;
    });
}