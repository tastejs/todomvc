(function(context, undefined){
    context.todo= {};
    
    $(function(){
        broke.init('todo.settings', function(){
            // fill db
            todo.models.Task.objects.create({"pk": 1, "model": "todo.task", "fields": {"is_complete": false, "title": "Title A"}});
            todo.models.Task.objects.create({"pk": 2, "model": "todo.task", "fields": {"is_complete": false, "title": "Title B"}});
            todo.models.Task.objects.create({"pk": 3, "model": "todo.task", "fields": {"is_complete": false, "title": "Title C"}});
            
            broke.events.request('/');
        });
    });

})(this);