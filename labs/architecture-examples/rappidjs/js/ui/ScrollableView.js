var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.ui.ScrollableView",
        ["js.ui.View", "js.ui.ItemsView", "js.html.DomElement", "jQuery"], function (View, ItemsView, DomElement, $) {
            var VERTICAL = "vertical";
            var HORIZONTAL = "horizontal";

            return View.inherit({
                defaults:{
                    tagName:"div",
                    direction:HORIZONTAL,
                    selectedPage:0,
                    componentClass:'scrollable'
                },
                ctor:function () {
                    this.callBase();
                    this.$childViews = [];
                },
                addChild:function (child) {
                    this.callBase();
                    if (!this.$scrollView && child instanceof DomElement) {
                        this.$scrollView = child;
                    }
                },
                _renderDirection: function(direction,oldDirection){
                    if(oldDirection){
                        this.removeClass(oldDirection);
                    }
                    if(direction){
                        this.addClass(direction);
                    }
                },
                _renderSelectedPage:function (page, oldPage) {
                    if (this.$scrollView && this.$scrollView.isRendered()) {
                        this.$scrollView.addClass('scroller');
                        if(this.$.direction === HORIZONTAL){
                            $(this.$scrollView.$el).animate({
                                left:-parseInt(this.$el.style.width) * page,
                                specialEasing:{
                                    width:'linear',
                                    height:'easeInOutQuad'
                                }
                            }, 'slow');
                        }else if(this.$.direction === VERTICAL){
                            $(this.$scrollView.$el).animate({
                                top:-parseInt(this.$el.style.height) * page,
                                specialEasing:{
                                    width:'linear',
                                    height:'easeInOutQuad'
                                }
                            }, 'slow');

                        }

                    }
                }
            });
        }
    );
});