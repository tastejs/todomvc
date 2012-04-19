requirejs(["rAppid"], function (rAppid) {
    /***
     *
     * Acts as base class for
     *
     * @class js.data.ListView
     */
    rAppid.defineClass("js.data.ListView", ["js.core.List"], function (List) {

        return List.inherit({

            defaults: {
                filterFnc: function(item, index, list){
                    return true;
                }
            },
            ctor: function (attributes) {
                this.base.base.ctor.call(this, attributes);
                if(this.$['list']){
                    this._bindList(this.$['list']);

                }else{
                    throw "No list defined!";
                }
            },
            _unbindList: function(list){
                if (list) {
                    list.unbind('add', this._onItemAdded);
                    list.unbind('remove', this._onItemRemoved);
                    list.unbind('change', this._onItemChange);
                    list.unbind('reset', this._onReset);
                    list.unbind('sort',this._onSort);
                }
            },
            _bindList: function(list){
                if(list){
                    list.bind('add',this._onItemAdded, this);
                    list.bind('remove', this._onItemRemoved, this);
                    list.bind('change', this._onItemChanged, this);
                    list.bind('reset', this._onReset, this);
                    list.bind('sort', this._onSort);
                    this._innerReset(this.$['list'].$items);
                }
            },
            _onItemAdded: function(e){
                var ret = this._filterItem(e.$.item, e.index);
                if(ret === true){
                    List.prototype.add.call(this,e.$.item, e.index);
                }
            },
            _onItemRemoved: function(e){
                List.prototype.remove.call(this, e.$.item, e.$.index);
            },
            _onItemChanged: function(e){
                var keep = this._filterItem(e.$.item, e.$.index);
                var included = rAppid._.include(this.$items,e.$.item);
                if(included && keep === false){
                    List.prototype.remove.call(this, e.$.item, e.$.index);
                }else if(!included && keep === true){
                    List.prototype.add.call(this, e.$.item, e.$.index);
                }
            },
            _onReset: function(e){
                this._innerReset(e.items);
            },
            _onSort: function(e){
                List.prototype.sort.call(this,e.sortFnc);
            },
            _innerReset: function(items){
                var filtered = [], item;
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    if (this._filterItem(item, i) === true) {
                        filtered.push(item);
                    }
                }
                List.prototype.reset.call(this, filtered);
            },
            _commitChangedAttributes: function(attributes){
                this.callBase();

                if (attributes['list']) {
                    this._unbindList(this.$previousAttributes['list']);
                    this._bindList(attributes['list']);
                }

                this._innerReset(this.$.list.$items);
            },
            _filterItem: function(item, index){
                return this.$.filterFnc.call(this,item,index,this.$.list);
            },
            reset:function () {
                throw "You can't reset a list view!";
            },
            add:function () {
                throw "You can't add items to a list view!";
            },
            remove:function () {
                throw "You can't remove items from a list view";
            },
            sort: function(){
                throw "You can't sort items of a list view";
            },
            set: function(){
                this.callBase();
            }

        })
    });
});