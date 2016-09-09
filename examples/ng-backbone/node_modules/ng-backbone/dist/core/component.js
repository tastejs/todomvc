"use strict";
var utils_1 = require("./utils");
function Component(options) {
    var mixin = {
        __ngbComponent: {
            models: options.models,
            collections: options.collections,
            views: utils_1.mapFrom(options.views),
            template: options.template,
            templateUrl: options.templateUrl,
        },
        el: options.el || null,
        events: options.events || null,
        id: options.id || null,
        className: options.className || null,
        tagName: options.tagName || null,
        formValidators: options.formValidators || null
    };
    return function (target) {
        Object.assign(target.prototype, mixin);
        // This way we trick invokation of this.initialize after constructor
        // Keeping in mind that @Component belongs to View that knows about this.__ngbInitialize
        if ("initialize" in target.prototype) {
            _a = [target.prototype["initialize"], function () { }], target.prototype["__ngbInitialize"] = _a[0], target.prototype["initialize"] = _a[1];
        }
        var _a;
    };
}
exports.Component = Component;
