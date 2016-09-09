"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(attributes, options) {
        _super.call(this, attributes, options);
        this.options = options || {};
    }
    return Model;
}(Backbone.Model));
exports.Model = Model;
