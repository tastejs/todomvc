(function(context, undefined){
    var
        node= broke.shortcuts.node
        ,Task= todo.models.Task
    ;

    todo.views= {
        list: function(request, callback){

            Task.objects.all(function(taskList){
                
                callback(node.create({
                    htmlNode: '#content'
                    ,template: 'list'
                    ,object: taskList
                    ,context: {
                        taskList: taskList
                    }
                }));
                
            });
            
        }
        ,create: function(request, callback){
            
            if(request.POST) {
                
                Task.objects.create({
                    title: request.POST['title']
                    ,pk: 'auto'
                }, function(task){
                    
                    callback(node.create({
                        htmlNode: '#content .items'
                        ,template: 'view'
                        ,object: task
                        ,context: {
                            task: task
                        }
                        ,callback: function(){
                            broke.DOM.val(request.event.target.title, '');
                        }
                    }));
                });
            }
            
        }
        ,update: function(request, taskId, callback){
            
            Task.objects.get({ pk: taskId }, function(task){
                
                if(request.POST) {
                    
                    task.update({ title: request.POST['title'] });

                    callback(node.replace({
                        template: 'view'
                        ,context: {
                            task: task
                        }
                        ,htmlNode: task.elements({ clearCache: true, filter: 'li' })
                    }));
                    
                } else {
                    
                    callback(node.replace({
                        template: 'update'
                        ,context: {
                            task: task
                        }
                        ,htmlNode: task.elements({ clearCache: true, filter: 'li' })
                        ,callback: function(){
                            broke.DOM.querySelector('input', this)[0].focus();
                        }
                    }));
                    
                }
                
            });
            
        }
        ,'delete': function(request, taskId, callback){
            request.event.preventDefault();
            
            Task.objects.get({ pk: taskId }, function(task){
                task['delete']();
            });
        }
        ,complete: function(request, taskId, callback){

            Task.objects.get({ pk: taskId }, function(task){

                task.update({ is_complete: request.event.target.checked }, false);
                
            });
            
        }
        ,clear_completed: function(request, taskId, callback){

            Task.objects.filter({ is_complete: true }).all(function(taskList){
                
                builtins.forEach(taskList, function(task){
                    this['delete']();
                });

            });

        }
    };
})(this);