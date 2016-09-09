"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ng_backbone_1 = require("ng-backbone");
var TodoRouter = (function (_super) {
    __extends(TodoRouter, _super);
    function TodoRouter() {
        _super.apply(this, arguments);
        this.listeners = [];
    }
    TodoRouter.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    // delegate the even to TODO view
    TodoRouter.prototype.setFilter = function (param) {
        this.listeners.forEach(function (listener) {
            listener.trigger("filter", param);
        });
    };
    TodoRouter = __decorate([
        ng_backbone_1.Mixin({
            routes: {
                "*filter": "setFilter"
            }
        }), 
        __metadata('design:paramtypes', [])
    ], TodoRouter);
    return TodoRouter;
}(Backbone.Router));
exports.TodoRouter = TodoRouter;
