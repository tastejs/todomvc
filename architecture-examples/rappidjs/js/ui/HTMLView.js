requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.ui.HTMLView",
        ["js.ui.View"], function (View) {

            return View.inherit({
                _getChildrenFromDescriptor: function(descriptor){
                    return [];
                },
                _renderChildren:function () {

                },
                _renderContentChildren:function () {

                },
                _renderHTML:function (html, oldString) {
                    this.$el.innerHTML = html;
                }
            });
        }
    );
});