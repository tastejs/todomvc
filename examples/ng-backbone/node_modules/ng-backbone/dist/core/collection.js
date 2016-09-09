"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(models, options) {
        _super.call(this, models, options);
        this.options = options || {};
    }
    return Collection;
}(Backbone.Collection));
exports.Collection = Collection;
