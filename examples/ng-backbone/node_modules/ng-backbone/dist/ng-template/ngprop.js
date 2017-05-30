"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <i data-ng-prop="'disabled', isDisabled"></i>
 */
var NgProp = (function (_super) {
    __extends(NgProp, _super);
    function NgProp(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-prop", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "__toArray", reporter),
                cache: cache
            };
        });
    }
    NgProp.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                var el = node.el;
                el[args[0]] = args[1];
            });
        });
    };
    NgProp.selector = "ng-prop";
    return NgProp;
}(abstract_directive_1.AbstractDirective));
exports.NgProp = NgProp;
