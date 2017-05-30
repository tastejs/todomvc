"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// NgBackbone extends Backbone.Nativeview, but if it's not loaded, works also fine
if (!("NativeView" in Backbone)) {
    Backbone.NativeView = Backbone.View;
}
/**
 * Facade
 */
__export(require("./core/exception"));
__export(require("./core/component"));
__export(require("./core/utils"));
__export(require("./core/view"));
__export(require("./core/formview"));
__export(require("./core/model"));
__export(require("./core/collection"));
