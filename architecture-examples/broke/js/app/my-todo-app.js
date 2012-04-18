(function(context, undefined){
    context.todo= {};
    
    $(function(){
        broke.init('todo.settings', function(){

            todo.models.Counter.objects.getOrCreate({ pk: 1 }, function(created, counter){

                todo.models.Task.objects.all(function(taskList){
                    var count = 0,
                        completed = 0;

                    builtins.forEach(taskList, function(){
                        if(this.fields.is_complete) {
                            completed += 1;
                        } else {
                            count += 1;
                        }
                    });

                    counter.update({
                        count: count,
                        completed: completed
                    });

                    broke.shortcuts.node.create({
                        htmlNode: '#todo-list'
                        ,template: 'list'
                        ,object: taskList
                        ,context: {
                            taskList: taskList
                        }
                    });
                });

                broke.events.preDelete(todo.models.Task, function(e, task, kwargs){
                    console.log("pre delete", kwargs);

                    if(!task.fields.is_complete) {
                        counter.update({
                            count: counter.fields.count - 1
                        }).save();
                    } else {
                        counter.update({
                            completed: counter.fields.completed - 1
                        }).save();
                    }
                });

                broke.events.preUpdate(todo.models.Task, function(e, task, kwargs){

                    if(kwargs.is_complete === true && !task.fields.is_complete) {
                        counter.update({
                            completed: counter.fields.completed + 1
                            ,count: counter.fields.count - 1
                        }).save();
                    } else if(kwargs.is_complete === false && task.fields.is_complete === true) {
                        counter.update({
                            completed: counter.fields.completed - 1
                            ,count: counter.fields.count + 1
                        }).save();
                    }

                });

                broke.events.postCreate(todo.models.Task, function(e, task){
                    console.log("post create", task);

                    counter.update({ count: counter.fields.count + 1 }).save();

                });
            });
        });
    });

})(this);