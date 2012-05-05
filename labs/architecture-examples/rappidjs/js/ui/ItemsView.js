var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.ui.ItemsView",
        ["js.ui.View", "js.core.Template", "js.core.List"], function (View, Template, List) {
            return View.inherit({
                defaults: {
                    tagName: "div",
                    items: []
                },
                hasItems: function(){
                    return this.$.items.length > 0;
                }.on('items'),
                addItem: function (item) {
                    this.$.items.push(item);
                    if (this.isRendered()) {
                        this._renderItem(item);
                    }
                },
                render: function(){
                    this.$renderedItems = [];
                    return this.callBase();
                },
                removeItem: function(item){
                    var index = this.$.items.indexOf(item);
                    if(index > -1){
                        this.$.items.slice(index,1);
                        if (this.isRendered()) {
                            this._removeRenderedItem(item);
                        }
                    }

                },
                clear: function(){


                },
                _renderList: function(list, oldList){
                    if(oldList){
                        // TODO: unbind!
                    }
                    if(list instanceof List){
                        list.bind('sort', this._onSort, this);
                        list.bind('reset', this._onReset, this);
                        list.bind('add', this._onItemAdd,this);
                        list.bind('remove', this._onItemRemove,this);

                        this.set({items: list.$items});
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
                    this.set('items',e.$.items);
                },
                _onItemAdd: function(e){
                    this._renderItem(e.$.item,e.$.index);
                },
                _onItemRemove: function(e){
                    this._removeRenderedItem(e.$.item);
                },
                _renderItems: function (items) {
                    if (this.$renderedItems) {
                        var c;
                        for (var j = this.$renderedItems.length - 1; j >= 0; j--) {
                            c = this.$renderedItems[j];
                            this.$el.removeChild(c.component.$el);
                        }
                    }
                    this.$renderedItems = [];
                    for (var i = 0; i < items.length; i++) {
                        this._renderItem(items[i],i);
                    }

                },
                _renderItem: function (item,i) {
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
                            this.$renderedItems.slice(i,1);
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