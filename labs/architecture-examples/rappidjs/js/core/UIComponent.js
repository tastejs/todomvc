var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.UIComponent",
        ["js.html.DomElement"], function (DomElement) {
            return DomElement.inherit({
                defaults: {
                    tagName: "div"
                },
                $behavesAsDomElement: false
            });
        }
    );
});