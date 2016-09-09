"use strict";
/**
 * Decorator to debounce
 */
function Debounce(wait) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value;
        return Object.assign({}, descriptor, {
            value: function () {
                var _this = this;
                var args = Array.from(arguments);
                clearTimeout(this["_debounceTimer"]);
                return new Promise(function (resolve) {
                    _this["_debounceTimer"] = setTimeout(function () {
                        _this["_debounceTimer"] = null;
                        resolve(callback.apply(_this, args));
                    }, wait);
                });
            }
        });
    };
}
exports.Debounce = Debounce;
/**
 * Decorator to mixin
 */
function Mixin(mixin) {
    return function (target) {
        Object.assign(target.prototype, mixin);
    };
}
exports.Mixin = Mixin;
function mapFrom(mixin) {
    var map = new Map();
    mapAssign(map, mixin);
    return map;
}
exports.mapFrom = mapFrom;
function mapAssign(map, mixin) {
    if (mixin === void 0) { mixin = {}; }
    Object.keys(mixin).forEach(function (key) {
        map.set(key, mixin[key]);
    });
}
exports.mapAssign = mapAssign;
