"use strict";
var Cache = (function () {
    function Cache() {
    }
    Cache.prototype.match = function (exVal) {
        if (exVal === this.cache) {
            return true;
        }
        this.cache = exVal;
        return false;
    };
    Cache.prototype.evaluate = function (exVal, cb) {
        if (this.match(exVal)) {
            return;
        }
        cb(exVal);
    };
    return Cache;
}());
exports.Cache = Cache;
;
