// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

// Create a module to hide our private implementation details
TodoMVC.module("TodoApp", function(App, TodoMVC, Backbone, Marionette, $, _){

  // Views
  // -----

  // The main form of the app, encapsulating the
  // form input to create a todo, and the "mark all as complete" checkbox
  App.TodoForm = Marionette.ItemView.extend({
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click .mark-all-done": "toggleAllClicked",
    },

    triggers: {
      "click .todo-clear a": "clear:completed"
    },

    initialize: function(){
      this.bindTo(this.collection, "update:counts", this.countsUpdated, this);
    },

    countsUpdated: function(counts){
      var $chk = this.$(".mark-all-done");
      $chk.prop("checked", counts.allDone);
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;

      var input = $(e.currentTarget);
      var content = input.val();
      input.val('');

      var data = { content: content };
      this.trigger("create:todo", data);
    },

    toggleAllClicked: function(e){
      var $chk = $(e.currentTarget);
      var checked = !!$chk.attr("checked");
      this.collection.toggleAll(checked);
    }
  });

  // Helpers
  // -------

  // The main application code, to get the app
  // off the ground and running.
  var todoApp = {

    run: function(){
      this.todoList = new TodoMVC.Todos.getAll();

      var form = this.getTodoForm(this.todoList);

      form.on("create:todo", this.todoList.add, this.todoList);
      form.on("clear:completed", this.todoList.clearCompleted, this.todoList);

      TodoMVC.vent.trigger("app:initialized", this.todoList);
    },

    getTodoForm: function(todos){
      var layout = new App.TodoForm({
        el: $("#todoapp"),
        collection: todos
      });
      return layout;
    }

  };
  
  // Initializers
  // ------------

  // Initializers run when the `TodoMVC.start()` method is called
  TodoMVC.addInitializer(function(){
    todoApp.run();
  });

});

