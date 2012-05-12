var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.ui.ContentPlaceHolder", ["js.ui.View"], function (View) {
        return View.inherit(({
            _renderContent: function (content) {
                if (content) {
                    this._renderChildren(content.$children);
                } else {
                    var cv;
                    for(var i = 0 ; i < this.$childViews.length; i++){
                        cv = this.$childViews[i];
                        this.$el.removeChild(cv.$el);
                    }
                }
            }
        }));
    });
});