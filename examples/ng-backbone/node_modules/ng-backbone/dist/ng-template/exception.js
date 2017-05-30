"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Custom exception extending Error
 * @param {string} message
 */
var Exception = (function (_super) {
    __extends(Exception, _super);
    function Exception(message) {
        _super.call(this, message);
        this.name = "NgTemplateError",
            this.message = message;
    }
    return Exception;
}(Error));
exports.Exception = Exception;
