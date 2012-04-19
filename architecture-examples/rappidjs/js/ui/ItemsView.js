requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.ui.ItemsView",
        ["js.ui.View", "js.core.Template", "js.core.List"], function (View, Template, List) {
            return View.inherit({
                defaults: {
                    tagName: "div",
                    items: null
                },
                hasItems: function(){
                    if(this.$.items){
                        return this.$.items.length;
                    }
                    return 0;
                }.on('items'),
                render: function(){
                    this.$renderedItems = [];
                    return this.callBase();
                },
                clear: function(){

                },
                _renderItems: function(items,oldItems){
                    if (oldItems && oldItems instanceof List) {
                        oldItems.unbind('sort', this._onSort);
                        oldItems.unbind('reset', this._onReset);
                        oldItems.unbind('add', this._onItemAdd);
                        oldItems.unbind('remove', this._onItemRemove);
                    }

                    if(items instanceof List){

                        items.bind('sort', this._onSort, this);
                        items.bind('reset', this._onReset, this);
                        items.bind('add', this._onItemAdd, this);
                        items.bind('remove', this._onItemRemove, this);
                        this._innerRenderItems(items.$items);
                    } else if(rAppid._.isArray(items)){
                        this._innerRenderItems(items);
                    }
                },
                _onSort: function(e){
                    if(this.isRendered()){
                        var item, c;
                        for (var i = 0; i < e.$.items.length; i++) {
                            item = e.$.items[i];
                            c = this.getComponentForItem(item);
                            this.$el.removeChild(c.$el);
                            this.$el.appendChild(c.$el);
                        }
                    }
                },
                _onReset: function(e){
                    this._innerRenderItems(e.$.items);
                },
                _onItemAdd: function(e){
                    this._innerRenderItem(e.$.item,e.$.index);
                },
                _onItemRemove: function(e){
                    this._removeRenderedItem(e.$.item);
                },
                _innerRenderItems: function (items) {
                    if (this.$renderedItems) {
                        var c;
                        for (var j = this.$renderedItems.length - 1; j >= 0; j--) {
                            c = this.$renderedItems[j];
                            this.$el.removeChild(c.component.$el);
                        }
                    }
                    this.$renderedItems = [];
                    for (var i = 0; i < items.length; i++) {
                        this._innerRenderItem(items[i],i);
                    }

                },
                _innerRenderItem: function (item,i) {
                    var comp = this.$templates['item'].createComponents({$item: item, $index: i})[0];
                    // add to rendered item map
                    this.$renderedItems.push({
                        item: item,
                        component: comp
                    });
                    this.addChild(comp);
                },
                _removeRenderedItem: function(item){
                    var ri;
                    for (var i = 0; i < this.$renderedItems.length; i++) {
                        ri = this.$renderedItems[i];
                        if (ri.item === item) {
                            this.$el.removeChild(ri.component.$el);
                            this.$renderedItems.splice(i,1);
                            return;
                        }
                    }
                },
                getComponentForItem: function (item) {
                    var ri;
                    for (var i = 0; i < this.$renderedItems.length; i++) {
                        ri = this.$renderedItems[i];
                        if (ri.item === item) {
                            return ri.component;
                        }
                    }
                    return null;
                }
            });
        }
    );
});