/*
@page jquery.model.deferreds Deferreds
@parent jQuery.Model

Models (and also views) work 
with [http://api.jquery.com/category/deferred-object/ jQuery.Deferred]. If
you properly fill out a model's [jquery.model.services service API], asynchronous
requests done via the model will return a jQuery.Deferred.

## findAll example

The following example, requests tasks and people and waits for both requests
to be complete before alerting the user:

    var tasksDef = Task.findAll(),
        peopleDef = People.findAll();
        
    $.when(tasksDef,peopleDef).done(function(taskResponse, peopleResponse){
      alert("There are "+taskRespone[0].length+" tasks and "+
            peopleResponse[0].length+" people.");
    });
    
__Note__ taskResponse[0] is an Array of tasks.  

## save and destroy example

Calls to [jQuery.Model.prototype.save save] and [jQuery.Model.prototype.destroy] also
return a deferred.  The deferred is resolved to the newly created, destroyed, or updated
model instance.

The following creates a task, updates it, and destroys it:

    var taskD = new Task({name: "dishes"}).save();
    
    taskD.done(function(task){
    
      var taskD2 = task.update({name: "all the dishes"})
      
      taskD2.done(function(task){
         
         var taskD3 = task.destroy();
         
         taskD3.done(function(){
           console.log("task destroyed");
         })
         
      })
      
    });

*/