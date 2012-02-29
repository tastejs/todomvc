(function(context, undefined){
    context.todo= {};
    
    $(function(){
        broke.init('todo.settings', function(){
            // fill db
            todo.models.Counter.objects.create({"pk":1, "model": "todo.counter", "fields": {"count": 0}});

            broke.events.postCreate(todo.models.Task, function(e){

                todo.models.Counter.objects.get({ pk: 1 }, function(counter){
                    var
                        c = 1
                    ;

                    if(counter.fields._deleted) {
                        c = -1;
                    }

                    counter.update({ count: counter.fields.count + c });
                });

            });

            //todo.models.Task.objects.create({"pk": 1, "model": "todo.task", "fields": {"is_complete": false, "title": "Title A"}});
            //todo.models.Task.objects.create({"pk": 2, "model": "todo.task", "fields": {"is_complete": false, "title": "Title B"}});
            //todo.models.Task.objects.create({"pk": 3, "model": "todo.task", "fields": {"is_complete": false, "title": "Title C"}});

            broke.events.request('/');
        });
    });

})(this);