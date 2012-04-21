var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.List", ["js.core.EventDispatcher","js.core.Bindable"], function(EventDispatcher, Bindable) {
        return EventDispatcher.inherit({


            ctor: function(items){
                this.$items = [];
                this.callBase();

                if(items){
                    this.add(items);
                }

                var self = this;
                this.bind('add', function () {
                    self.length = self.size();
                });
                this.bind('remove', function () {
                    self.length = self.size();
                });

                this.length = this.size();
            },
            hasItems: function(){
                return this.$items.length > 0;
            }.on("add","remove"),
            push: function(item){
                // TODO: add options
                this.$items.push(item);
                this.trigger('add', {item:item, index:this.$items.length-1});
            },
            pop: function(){
                // TODO: add options
                return this.removeAt(this.$items.length);
            },
            shift: function(){
                // TODO: add options
                return this.removeAt(0);
            },
            unshift: function(item){
                // TODO: add options
                this.$items.unshift(item);
                this.trigger('add', {item:item, index: 0});
            },
            add: function(items, options){


                options = options || {};
                rAppid._.defaults(options, {silent:false, index:this.$items.length});

                var index = options.index;

                if(!rAppid._.isArray(items)){
                    items = [items];
                }
                var item, itemIndex;
                for(var i = 0; i < items.length; i++){
                    item = items[i];
                    if(item instanceof Bindable){
                        item.bind('change',this._onItemChange,this);
                    }
                    itemIndex = index+i;
                    this.$items.splice(itemIndex,0,item);
                    if(options.silent !== true){
                        this.trigger('add', {item:item, index:itemIndex})
                    }
                }
            },
            _onItemChange: function(e,item){
                this.trigger('change',{item: item, index: this.$items.indexOf(item)});
            },
            remove: function(items, options){

                if(!rAppid._.isArray(items)){
                    items  = [items];
                }
                for(var i = 0 ; i < items.length; i++){
                    this.removeAt(this.$items.indexOf(items[i]),options);
                }
            },
            removeAt: function(index,options){
                options = options || {};

                if(index > -1 && index < this.$items.length){
                    var items = this.$items.splice(index,1);
                    if(options.silent !== true){
                        this.trigger('remove', {item:items[0], index:index});
                    }
                    return items[0];
                }
                return null;
            },
            reset: function(items){
                this.$items = items;
                this.trigger('reset',{items: items});
            },
            sort: function(fnc){
                this.trigger('sort', {items: this.$items.sort(fnc)});
            },
            clear: function(){
                this.reset([]);
            },
            size: function(){
                return this.$items.length;
            }.on('add','remove')
            ,
            at: function(index){
                if(index < this.$items.length && index >= 0){
                    return this.$items[index];
                }
                return null;
            },
            each: function(fnc,scope){
                scope = scope || this;
                for(var i = 0; i < this.$items.length; i++){
                    fnc.call(scope,this.$items[i],i);
                }
            }
        })
    })
});