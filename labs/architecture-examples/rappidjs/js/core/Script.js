var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.Script", ["js.core.Element"], function (El) {
        return El.inherit({
            // all the crazy stuff is done in xaml.js
            evaluate: function (imports) {
                var textContent = this.$descriptor.textContent ? this.$descriptor.textContent : this.$descriptor.text;
                var fn = eval("this.javascript = (" + textContent + ")");
                return fn.apply(this, imports);
            }
        });
    });
});