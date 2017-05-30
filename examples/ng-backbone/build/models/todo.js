"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ng_backbone_1 = require("ng-backbone");
var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel() {
        _super.apply(this, arguments);
    }
    TodoModel.prototype.defaults = function () {
        return {
            title: "",
            completed: false
        };
    };
    return TodoModel;
}(ng_backbone_1.Model));
exports.TodoModel = TodoModel;
