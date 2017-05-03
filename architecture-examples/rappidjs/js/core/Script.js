requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.Script", ["js.core.Element"], function (El) {
        return El.inherit({
            // all the crazy stuff is done in xaml.js
            evaluate: function (imports) {
                var textContent = this._getTextContentFromDescriptor(this.$descriptor);
                var fn = eval("this.javascript = (" + textContent + ")");
                return fn.apply(this, imports);
            }
        });
    });
});