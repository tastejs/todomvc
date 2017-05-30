"use strict";
var tokenizer_1 = require("./tokenizer");
var Parser = (function () {
    function Parser() {
    }
    Parser.split = function (expr) {
        var re = /(\+|\-|\<|\>|===|==|\!==|\!=|\&\&|\|\|)/;
        return expr
            .split(re)
            .map(function (i) { return i.trim(); })
            .filter(function (i) { return Boolean(i); });
    };
    Parser.parse = function (expr) {
        // if the whole expr is a string
        if (tokenizer_1.StringToken.valid(expr)) {
            var token = tokenizer_1.tokenizer(expr.trim());
            return [token];
        }
        var com = Parser.split(expr);
        // case 3: foo + bar
        // case 1: foo (no operators found)
        if (com.length !== 3 && com.length !== 1) {
            return [];
        }
        var tokens = com.map(function (i) { return tokenizer_1.tokenizer(i); });
        // any of tokens is invalid
        if (tokens.find(function (i) { return i instanceof tokenizer_1.InvalidToken; })) {
            return [];
        }
        return tokens;
    };
    return Parser;
}());
exports.Parser = Parser;
