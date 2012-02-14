// Create the Task model.
var Task = Spine.Model.setup("Task", ["name", "done"]);

// Persist model between page reloads.
Task.extend(Spine.Model.Local);

Task.extend({
  // Return all active tasks.
  active: function(){
    return(this.select(function(item){ return !item.done; }));
  },
  
  // Return all done tasks.
  done: function(){
    return(this.select(function(item){ return !!item.done; }));    
  },
  
  // Clear all done tasks.
  destroyDone: function(){
    jQuery(this.done()).each(function(i, rec){ rec.destroy(); });
  }
});