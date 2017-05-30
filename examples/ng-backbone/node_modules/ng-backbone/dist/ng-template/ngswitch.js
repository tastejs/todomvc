"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <span data-ng-switch="exp"></span>
 */
var NgSwitch = (function (_super) {
    __extends(NgSwitch, _super);
    function NgSwitch(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-switch", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "", reporter),
                cache: cache
            };
        });
    }
    NgSwitch.prototype.sync = function (data, Ctor) {
        this.nodes.forEach(function (node) {
            var tpl = new Ctor(node.el, node.outerHTML);
            node.cache.evaluate(node.exp.call(node.el, data), function (val) {
                data["$"] = val;
                tpl.sync(data);
            });
        });
    };
    return NgSwitch;
}(abstract_directive_1.AbstractDirective));
exports.NgSwitch = NgSwitch;
