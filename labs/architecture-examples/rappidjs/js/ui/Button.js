var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.ui.Button",
        ["xaml!js.ui.Link", "js.core.Content"], function (Link) {
            return Link.inherit({
                defaults: {
                    'componentClass': 'btn'
                },
                _renderType: function (type, oldType) {
                    if (oldType) {
                        this.removeClass("btn-" + oldType);
                    }
                    if (type) {
                        this.addClass("btn-" + type);
                    }
                }
            });
        }
    );
});