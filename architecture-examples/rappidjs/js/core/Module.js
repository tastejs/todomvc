requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.Module", ["js.core.UIComponent"], function (UIComponent) {
        return UIComponent.inherit({
            /**
             * loads the
             * @param callback
             */
            start: function (callback) {
                if (callback) {
                    callback();
                }
            },

            render: function (target) {
                // module won't render anything, but delivers content via js:Content
                // content is rendered inside ContentPlaceHolders
            }
        });
    });
});