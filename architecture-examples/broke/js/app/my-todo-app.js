(function(context, undefined){
    context.todo= {};
    
    $(function(){
        broke.init('todo.settings', function(){
            // create counter
            todo.models.Counter.objects.create({"pk":1, "model": "todo.counter", "fields": {"count": 0, "completed": 0}});

            broke.events.preDelete(todo.models.Task, function(e, task, kwargs){
                todo.models.Counter.objects.get({ pk: 1 }, function(counter){
                    if(!task.fields.is_complete) {
                        counter.update({
                            count: counter.fields.count - 1
                        });
                    } else {
                        counter.update({
                            completed: counter.fields.completed - 1
                        });
                    }
                });
            });

            broke.events.postUpdate(todo.models.Task, function(e, task, kwargs){
                todo.models.Counter.objects.get({ pk: 1 }, function(counter){

                    if('is_complete' in kwargs && kwargs.is_complete) {
                        counter.update({
                            completed: counter.fields.completed + 1
                            ,count: counter.fields.count - 1
                        });
                    } else if('is_complete' in kwargs && !kwargs.is_complete) {
                        counter.update({
                            completed: counter.fields.completed - 1
                            ,count: counter.fields.count + 1
                        });
                    }

                });
            });

            broke.events.postCreate(todo.models.Task, function(e, task){

                todo.models.Counter.objects.get({ pk: 1 }, function(counter){
                    counter.update({ count: counter.fields.count + 1 });
                });

            });

            broke.events.request('/');
        });
    });

})(this);