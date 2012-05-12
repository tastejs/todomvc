// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

// Create a module to contain the Todo model and collection, 
// providing encapsulation of these concepts so that they can
// be used throughout the rest of the app.
TodoMVC.module("Todos", function(Todos, TodoMVC, Backbone, Marionette, $, _){

  // Models
  // ------

  // The primary Todo model.
  Todos.Todo = Backbone.Model.extend({
    defaults: {
      done: false
    },

    toggle: function(done){
      this.set({done: done});
    },

    isDone: function(){
      return this.get("done");
    }
  });

  // A collection of todo models, containing core logic
  // for manipulating and counting the todos, in aggregate
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
      var doneCount = this.reduce(function(memo, todo){
        if (todo.isDone()){ memo += 1 };
        return memo;
      }, 0);
      return doneCount;
    }
  });

  // Public API
  // ----------

  // The public API that should be called when you
  // need to get the current list of todos
  Todos.getAll = function(){
    if (!Todos.todoList){
      Todos.todoList = new Todos.TodoCollection();
    }
    return Todos.todoList;
  };

});
