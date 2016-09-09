"use strict";
var constants_1 = require("./constants");
var exception_1 = require("./exception");
var exception_2 = require("./expression/exception");
var parser_1 = require("./expression/parser");
var tokenizer_1 = require("./expression/tokenizer");
/**
 * Calc value in a composite xpression such as `foo + bb`
 */
function reduceComposite(tokens, data) {
    if (tokens.length === 1) {
        var token = tokens[0];
        return token.resolveValue(data);
    }
    var left = tokens[0], leftVal = left.resolveValue(data), operator = tokens[1], right = tokens[2], rightVal = right.resolveValue(data);
    if (!(operator instanceof tokenizer_1.OperatorToken)) {
        throw new exception_1.Exception("Invalid operator " + operator.value + " in ng* expression");
    }
    switch (operator.value) {
        case "+":
            return leftVal + rightVal;
        case "-":
            return leftVal - rightVal;
        case "<":
            return leftVal < rightVal;
        case ">":
            return leftVal > rightVal;
        case "===":
            return leftVal === rightVal;
        case "==":
            return leftVal === rightVal;
        case "!==":
            return leftVal !== rightVal;
        case "!=":
            return leftVal !== rightVal;
        case "&&":
            return leftVal && rightVal;
        case "||":
            return leftVal || rightVal;
    }
}
/**
 * Wrap as requested by the consumer object
 */
function wrap(value, wrapper) {
    switch (wrapper) {
        case "String":
            return String(value);
        case "Boolean":
            return Boolean(value);
        default:
            return value;
    }
}
/**
 * Throw an error or silently report the exception
 */
function treatException(err, expr, reporter) {
    if (!(err instanceof exception_2.ExpressionException)) {
        throw new exception_1.Exception("Invalid ng* expression " + expr);
    }
    reporter.addLog((constants_1.ERROR_CODES.NGT0003 + ": ") + err.message);
}
/**
 * Create evaluation function for expressions like "prop, value"
 */
function tryGroupStrategy(expr, reporter) {
    var leftExpr, rightExpr;
    if (expr.indexOf(",") === -1) {
        throw new exception_1.Exception("Group expression must have syntax: 'foo, bar'");
    }
    _a = expr.split(","), leftExpr = _a[0], rightExpr = _a[1];
    var leftTokens = parser_1.Parser.parse(leftExpr), rightTokens = parser_1.Parser.parse(rightExpr);
    if (!leftTokens.length) {
        throw new exception_2.ExpressionException("Cannot parse expression " + leftExpr);
    }
    if (!rightTokens.length) {
        throw new exception_2.ExpressionException("Cannot parse expression " + rightExpr);
    }
    reporter.addTokens(leftTokens);
    reporter.addTokens(rightTokens);
    return function (data) {
        try {
            return [reduceComposite(leftTokens, data), reduceComposite(rightTokens, data)];
        }
        catch (err) {
            treatException(err, expr, reporter);
            return ["", ""];
        }
    };
    var _a;
}
exports.tryGroupStrategy = tryGroupStrategy;
/**
 * Create evaluation function for expressions like "value" or "value + value"
 */
function tryOptimalStrategy(expr, wrapper, reporter) {
    if (wrapper === void 0) { wrapper = ""; }
    var tokens = parser_1.Parser.parse(expr);
    if (!tokens.length) {
        throw new exception_2.ExpressionException("Cannot parse expression " + expr);
    }
    reporter.addTokens(tokens);
    return function (data) {
        // Here we do not need to keep the el context - whenver this. encountered it jumps to fallback strategy
        try {
            return wrap(reduceComposite(tokens, data), wrapper);
        }
        catch (err) {
            treatException(err, expr, reporter);
            return "";
        }
    };
}
exports.tryOptimalStrategy = tryOptimalStrategy;
/**
 * Create evaluation function for any expression by using eval
 */
function fallbackStrategy(expr, wrapper, reporter) {
    if (wrapper === void 0) { wrapper = ""; }
    // make available in the closure
    var __toArray = function () {
        return [].slice.call(arguments);
    }, 
    // Standard strategy
    func = function (data) {
        var cb, code, keys = Object.keys(data), vals = keys.map(function (key) {
            return data[key];
        });
        try {
            code = "cb = function(" + keys.join(",") + ("){ return " + wrapper + "(" + expr + "); };");
            eval(code);
            return cb.apply(this, vals);
        }
        catch (err) {
            reporter.addError(constants_1.ERROR_CODES.NGT0002 + ": Could not evaluate " + code);
        }
    };
    return func;
}
exports.fallbackStrategy = fallbackStrategy;
function compile(expr, wrapper, reporter) {
    if (wrapper === void 0) { wrapper = ""; }
    try {
        if (wrapper === "__toArray") {
            return tryGroupStrategy(expr, reporter);
        }
        return tryOptimalStrategy(expr, wrapper, reporter);
    }
    catch (err) {
        if (!(err instanceof exception_2.ExpressionException)) {
            throw new exception_1.Exception(err.message);
        }
    }
    reporter.addError(constants_1.ERROR_CODES.NGT0001 + ": Could not parse the expression, going eval()");
    return fallbackStrategy.call(this, expr, wrapper, reporter);
}
exports.compile = compile;
