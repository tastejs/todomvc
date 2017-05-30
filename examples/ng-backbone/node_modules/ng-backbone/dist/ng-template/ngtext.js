"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <span data-ng-text="foo">...</span>
 */
var NgText = (function (_super) {
    __extends(NgText, _super);
    function NgText(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-text", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "String", reporter),
                cache: cache
            };
        });
    }
    NgText.prototype.sync = function (data) {
        var _this = this;
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (val) {
                _this.setText(node.el, val);
            });
        });
    };
    return NgText;
}(abstract_directive_1.AbstractDirective));
exports.NgText = NgText;
