var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.ui.Button",
        ["xaml!js.ui.Link", "js.core.Content"], function (Link) {
            return Link.inherit({
                defaults: {
                    'tagName': 'label',
                    'componentClass': 'checkbox'
                },
                _renderLabel: function (label) {

                }
            });
        }
    );
});