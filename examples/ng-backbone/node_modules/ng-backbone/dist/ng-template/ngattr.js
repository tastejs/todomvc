"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <i data-ng-attr="'checked', true"></i>
 */
var NgAttr = (function (_super) {
    __extends(NgAttr, _super);
    function NgAttr(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-attr", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "__toArray", reporter),
                cache: cache
            };
        });
    }
    NgAttr.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                var el = node.el;
                if (!args[1]) {
                    return el.removeAttribute(args[0]);
                }
                el.setAttribute(args[0], args[1]);
            });
        });
    };
    NgAttr.selector = "ng-attr";
    return NgAttr;
}(abstract_directive_1.AbstractDirective));
exports.NgAttr = NgAttr;
