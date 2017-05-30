"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <span data-ng-el="this.setAttribute('ss', 11)">Error</span>
 */
var NgEl = (function (_super) {
    __extends(NgEl, _super);
    function NgEl(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-el", function (node, expr, compile) {
            return {
                el: node,
                exp: compile(expr, "", reporter)
            };
        });
    }
    NgEl.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.exp.call(node.el, data);
        });
    };
    return NgEl;
}(abstract_directive_1.AbstractDirective));
exports.NgEl = NgEl;
