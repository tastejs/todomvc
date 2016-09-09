"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <span data-ng-if="expression">Error</span>
 */
var NgIf = (function (_super) {
    __extends(NgIf, _super);
    function NgIf(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-if", function (node, expr, compile, cache) {
            return {
                el: node,
                anchor: document.createElement("ng"),
                exp: compile(expr, "Boolean", reporter),
                cache: cache
            };
        });
    }
    NgIf.prototype.sync = function (data) {
        var _this = this;
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (val) {
                if (val) {
                    return _this.enable(node);
                }
                _this.disable(node);
            });
        });
    };
    NgIf.prototype.disable = function (node) {
        if (node.anchor.parentNode) {
            return;
        }
        node.anchor.style.display = "none";
        node.el.parentNode.insertBefore(node.anchor, node.el);
        node.el.parentNode.removeChild(node.el);
    };
    NgIf.prototype.enable = function (node) {
        if (!node.anchor.parentNode) {
            return;
        }
        node.anchor.parentNode.insertBefore(node.el, node.anchor);
        node.anchor.parentNode.removeChild(node.anchor);
    };
    return NgIf;
}(abstract_directive_1.AbstractDirective));
exports.NgIf = NgIf;
