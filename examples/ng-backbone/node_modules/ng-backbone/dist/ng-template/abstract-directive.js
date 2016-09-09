"use strict";
var expression_1 = require("./expression");
var cache_1 = require("./cache");
var AbstractDirective = (function () {
    function AbstractDirective(el, reporter) {
    }
    AbstractDirective.prototype.initNodes = function (el, identifier, cb) {
        var datakey = this.getDataKey(identifier), selector = this.getSelector(identifier), targets = (el.matches(selector)
            ? [el] : Array.from(el.querySelectorAll(selector)));
        return targets.map(function (el) {
            var expr = el.dataset[datakey];
            delete el.dataset[datakey];
            return cb(el, expr, expression_1.compile, new cache_1.Cache());
        });
    };
    /**
     * Converts foo-bar-baz to `[data-foo-bar-baz]`
     */
    AbstractDirective.prototype.getSelector = function (raw) {
        return "[data-" + raw + "]";
    };
    /**
     * Converts foo-bar-baz to fooBarBaz
     */
    AbstractDirective.prototype.getDataKey = function (raw) {
        return raw
            .split("-").map(function (part, inx) {
            if (!inx) {
                return part;
            }
            return part.substr(0, 1).toUpperCase() + part.substr(1);
        })
            .join("");
    };
    /**
     * researched strategies
     * el.innerText = str; - no standard
     * el.textContent = str; - fast
     * el.appendChild( document.createTextNode( str ) ) - slower
     */
    AbstractDirective.prototype.setText = function (el, str) {
        el.textContent = str;
    };
    AbstractDirective.prototype.escape = function (str) {
        var div = document.createElement("div");
        this.setText(div, str);
        return div.innerHTML;
    };
    return AbstractDirective;
}());
exports.AbstractDirective = AbstractDirective;
