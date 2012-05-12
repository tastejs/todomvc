// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

// Define an application
var TodoMVC = new Backbone.Marionette.Application();

// Add regions to use
TodoMVC.addRegions({
  list: "#todo-list",
  stats: "#todo-stats"
});

// Create a module to hide our private implementation details
TodoMVC.module("App", function(App, TodoMVC, Backbone, Marionette, $, _){

  // Views
  // -----

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
      if (counts.allDone){
        $chk.prop("checked", true);
      } else {
        $chk.prop("checked", false);
      }
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;

      var input = $(e.currentTarget);

      var content = input.val();
      var data = {
        content: content,
        done: false
      };

      this.trigger("create:todo", data);
      input.val('');
    },

    toggleAllClicked: function(e){
      var $chk = $(e.currentTarget);
      var checked = !!$chk.attr("checked");
      this.collection.toggleAll(checked);
    }
  });

  // Helpers
  // -------

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

  TodoMVC.addInitializer(function(){
    todoApp.run();
  });

});

