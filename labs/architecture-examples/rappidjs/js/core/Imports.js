var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.Imports", ["js.core.Element"], function (Component) {
        return Component.inherit({
        });
    });
});