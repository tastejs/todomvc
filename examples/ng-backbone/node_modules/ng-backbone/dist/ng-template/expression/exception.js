"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exception_1 = require("../exception");
var ExpressionException = (function (_super) {
    __extends(ExpressionException, _super);
    function ExpressionException(message) {
        _super.call(this, message);
        this.name = "NgTemplateExpressionException",
            this.message = message;
    }
    return ExpressionException;
}(exception_1.Exception));
exports.ExpressionException = ExpressionException;
