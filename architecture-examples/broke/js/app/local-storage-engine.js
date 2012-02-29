(function(){
    var
        LocalStorageEngine
    ;

    LocalStorageEngine= broke.db.engines.BaseEngine.create({
        __name__: "broke.db.engines.LocalStorageEngine"
        ,storage: broke.storages.localStorage
        ,select: function(callback){
            var
                data= this.storage.getTable(this.model.getTableName())
            ;

            data= applyFilters(this, data, this.args.filter);
            data= applyFilters(this, data, this.args.exclude, true);

            callback(data);
        }
        ,insert: function(callback){
            var
                engine= this
                ,objects
                ,dataTableName= this.model.getTableName()
                ,data
            ;

            if(builtins.typeOf(this.args.insert) == "array") {
                data= [];

                builtins.forEach(this.args.insert, function(){
                    data.push(this.storage.set(dataTableName, this));
                });
            } else {
                data= this.storage.set(dataTableName, this.args.insert);
            }

            callback(data);
        }
        ,update: function(callback){
            return this.insert(callback);
        }
        ,'delete': function(callback){
            // TODO
        }
    });
})();