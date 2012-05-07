var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.ui.SegmentedView",
        ["js.ui.ItemsView", "js.html.DomElement"], function (ItemsView, DomElement) {
            return ItemsView.inherit({
                defaults: {
                    tagName: "div",
                    visibleIndex: 0,
                    visibleView: null
                },
                ctor: function(){
                    this.$childViews = [];
                    this.callBase();
                },
                addChild: function (child) {
                    this.callBase();
                    if (child instanceof DomElement) {
                        this.$childViews.push(child);
                    }
                },
                _renderChild: function (child) {
                    if (this.$.visibleView == child) {
                        child.set({visible: true});
                        this.callBase();
                    }
                },
                _renderVisibleView: function (child, oldView) {
                    if (oldView) {
                        oldView.set({visible: false});
                    }

                    if (child) {
                        if (!child.isRendered()) {
                            child.set({visible: false});
                            this._renderChild(child);
                        }
                        child.set({visible: true});
                    }

                },
                _renderVisibleIndex: function (index) {
                    if (index > -1 && index < this.$childViews.length) {
                        this.set({visibleView: this.$childViews[index]});
                    } else if (this.$.visibleView) {
                        this.$.visibleView.set({visible: false});
                    }
                }

            });
        }
    );
});