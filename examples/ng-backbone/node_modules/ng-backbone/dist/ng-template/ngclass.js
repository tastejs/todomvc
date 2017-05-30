"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <i data-ng-class="'is-hidden', isHidden"></i>
 */
var NgClass = (function (_super) {
    __extends(NgClass, _super);
    function NgClass(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, NgClass.selector, function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "__toArray", reporter),
                cache: cache
            };
        });
    }
    NgClass.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                args[0] && node.el.classList.toggle(args[0], Boolean(args[1]));
            });
        });
    };
    NgClass.selector = "ng-class";
    return NgClass;
}(abstract_directive_1.AbstractDirective));
exports.NgClass = NgClass;
