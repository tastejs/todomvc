var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.Content", ["js.core.Component"], function (Component) {
        return Component.inherit(({
            // TODO
        }));
    });
});