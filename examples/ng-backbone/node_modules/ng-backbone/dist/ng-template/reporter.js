"use strict";
var Reporter = (function () {
    function Reporter() {
        this.data = {
            errors: [],
            log: [],
            tokens: []
        };
    }
    Reporter.prototype.addError = function (msg) {
        this.data.errors.push(msg);
    };
    Reporter.prototype.addLog = function (msg) {
        this.data.log.push(msg);
    };
    Reporter.prototype.addTokens = function (tokens) {
        var merge = tokens.map(function (token) { return token.toJSON(); });
        this.data.tokens = this.data.tokens.concat(merge);
    };
    Reporter.prototype.get = function (key) {
        return key ? this.data[key] : this.data;
    };
    Reporter.prototype.isParsed = function () {
        return this.data.tokens.length > 0;
    };
    return Reporter;
}());
exports.Reporter = Reporter;
