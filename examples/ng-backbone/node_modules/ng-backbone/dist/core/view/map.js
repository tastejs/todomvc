"use strict";
var ViewMap = (function () {
    function ViewMap() {
        this.map = new Map();
    }
    ViewMap.prototype.clear = function () {
        return this.map.clear();
    };
    ViewMap.prototype.delete = function (key) {
        return this.map.delete(key);
    };
    ViewMap.prototype.forEach = function (cb, thisArg) {
        return this.map.forEach(cb, thisArg);
    };
    ViewMap.prototype.forEachView = function (cb) {
        var _this = this;
        return this.map.forEach(function (views, key) {
            views.forEach(function (value, index) {
                cb.call(_this, value, index, key, _this.map);
            });
        });
    };
    ViewMap.prototype.get = function (key, inx) {
        if (inx === void 0) { inx = 0; }
        if (!this.map.has(key)) {
            throw new Error("The view map does not have the key " + key);
        }
        if (typeof this.map.get(key)[inx] === "undefined") {
            throw new Error("The view map does not have the index " + inx);
        }
        return this.map.get(key)[inx];
    };
    ViewMap.prototype.getAll = function (key) {
        return this.map.get(key) || [];
    };
    ViewMap.prototype.has = function (key) {
        return this.map.has(key);
    };
    ViewMap.prototype.hasElement = function (el) {
        var toggle = false;
        this.map.forEach(function (views) {
            if (views.find(function (view) { return view.el === el; })) {
                toggle = true;
            }
        });
        return toggle;
    };
    ViewMap.prototype.set = function (key, value) {
        return this.map.set(key, value);
    };
    Object.defineProperty(ViewMap.prototype, "size", {
        get: function () {
            return this.map.size;
        },
        enumerable: true,
        configurable: true
    });
    return ViewMap;
}());
exports.ViewMap = ViewMap;
