// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

TodoMVC.module("Todos", function(Todos, TodoMVC, Backbone, Marionette, $, _){
  // Models
  // ------

  Todos.Todo = Backbone.Model.extend({
    toggle: function(done){
      this.set({done: done});
    },

    isDone: function(){
      return this.get("done");
    }
  });

  Todos.TodoCollection = Backbone.Collection.extend({
    model: Todos.Todo,

    initialize: function(){
      this.updateCounts();
      this.on("add", this.updateCounts, this);
      this.on("remove", this.updateCounts, this);
      this.on("change:done", this.updateCounts, this);
    },

    clearCompleted: function(){
      var that = this;
      var completed = this.where({done: true});
      _.each(completed, function(todo){ that.remove(todo); });
    },

    toggleAll: function(done){
      this.each(function(todo){ todo.toggle(done); });
    },

    updateCounts: function(){
      var counts = {};

      counts.total = this.length;
      counts.done = this.doneCount();
      counts.remaining = counts.total - counts.done;
      counts.allDone = (counts.remaining === 0 && counts.done > 0);

      this.counts = counts;
      this.trigger("update:counts", counts);
    },

    doneCount: function(){
      var done = this.reduce(function(memo, todo){

        if (todo.isDone()){
          memo += 1
        };

        return memo;
      }, 0);

      return done;
    }
  });

  // Public API
  // ----------

  Todos.getAll = function(){
    if (!Todos.todoList){
      Todos.todoList = new Todos.TodoCollection();
    }
    return Todos.todoList;
  };

});
