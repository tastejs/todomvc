(function(){
    todo.routers = {};

    Class.create({
        __name__: "todo.routers.Router"
        ,dbForRead: function(model, hints){
            if(broke.conf.settings.enableLocalStorage){
                return 'localStorage';
            }
        }
        ,dbForWrite: function(model, hints){
            if(broke.conf.settings.enableLocalStorage){
                return 'localStorage';
            }
        }
    });
})();