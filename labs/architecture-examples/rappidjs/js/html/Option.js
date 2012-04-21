var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.html.Option",
        ["js.html.DomElement"], function (DomElement) {
            return DomElement.inherit({
                _renderSelected: function(selected){
                    this.$el.selected = selected;
                }
            });
        }
    );
});