(function(context, undefined){
    context.todo= {};
    
    $(function(){
        broke.init('todo.settings', function(){
            // create counter
            todo.models.Counter.objects.create({"pk":1, "model": "todo.counter", "fields": {"count": 0, "completed": 0}});

            broke.events.postDelete(todo.models.Task, function(e, task, kwargs){
                todo.models.Counter.objects.get({ pk: 1 }, function(counter){
                    counter.update({ completed: counter.completed - 1 });
                });
            });

            broke.events.postUpdate(todo.models.Task, function(e, task, kwargs){
                todo.models.Counter.objects.get({ pk: 1 }, function(counter){
                    if('is_complete' in kwargs && task.fields.is_complete) {
                        counter.update({ completed: counter.fields.completed + 1 });
                    } else if('is_complete' in kwargs && !task.fields.is_complete) {
                        counter.update({ completed: counter.fields.completed - 1 });
                    }
                });
            });

            broke.events.postCreate(todo.models.Task, function(e, task){

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

            broke.events.request('/');
        });
    });

})(this);