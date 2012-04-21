var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.Module", ["js.core.UIComponent"], function (UIComponent) {
        return UIComponent.inherit({
            /**
             * loads the
             * @param callback
             */
            start: function (callback) {

            },
            render: function (target) {

            }
        });
    });
});